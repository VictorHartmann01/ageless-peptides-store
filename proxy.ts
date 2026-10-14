import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// Closed by default. Only an explicit release opens the storefront again.
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const open = path === '/zugang' || path === '/admin' || path === '/api/admin'
    || path.startsWith('/rechtliches/') || path.startsWith('/_next/static/')
    || ['/ageless-logo.svg', '/icon.svg', '/favicon.ico', '/robots.txt', '/sitemap.xml'].includes(path);
  if (open || process.env.AGELESS_SITE_ACCESS === 'public') return NextResponse.next();

  let response = NextResponse.next({ request });
  const finish = (result: NextResponse) => {
    for (const cookie of response.cookies.getAll()) result.cookies.set(cookie);
    result.headers.set('Cache-Control', 'private, no-store');
    result.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return result;
  };
  const deny = (status = 403) => {
    if (path.startsWith('/api/')) return finish(NextResponse.json({ error: 'TEST_ACCESS_REQUIRED' }, { status }));
    const target = new URL('/zugang', request.url);
    return finish(NextResponse.redirect(target, 307));
  };
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key || !secret) return deny(503);
    const auth = createServerClient(url, key, { cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    } });
    // Always validate with Auth; never trust browser session data or user_metadata.
    const { data, error } = await auth.auth.getUser();
    const user = data.user;
    if (error || !user?.email || !user.email_confirmed_at) return deny();
    const email = user.email.toLowerCase();
    const owners = (process.env.AGELESS_OWNER_EMAILS || process.env.AGELESS_ADMIN_APPROVER_EMAIL || '')
      .split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
    const db = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
    if (!owners.includes(email)) {
      const { data: access, error: lookupError } = await db.from('ageless_admin_access_requests')
        .select('status,email').eq('user_id', user.id).maybeSingle();
      if (lookupError || access?.status !== 'approved' || access.email?.toLowerCase() !== email) return deny();
    }
    // A closed test site may exercise sandbox payments, but cannot charge real money.
    if (path.startsWith('/api/checkout/')) {
      const { data: settings, error: settingsError } = await db.from('ageless_store_settings')
        .select('mode').eq('id', 1).single();
      if (settingsError || settings?.mode !== 'sandbox') return finish(NextResponse.json({ error: 'TEST_SITE_SANDBOX_ONLY' }, { status: 403 }));
    }
    return finish(response);
  } catch { return deny(503); }
}

export const config = { matcher: '/:path*' };
