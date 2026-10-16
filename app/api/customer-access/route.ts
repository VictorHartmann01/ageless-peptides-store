import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAdminClient } from '../../../lib/commerce/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'no-store' };

async function actor(req: NextRequest) {
  const token = req.headers.get('authorization');
  if (!token?.startsWith('Bearer ')) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const auth = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const result = await auth.auth.getUser(token.slice(7)).catch(() => null);
  if (!result) return null;
  const { data, error } = result;
  if (error || !data.user?.email_confirmed_at || !data.user.email) return null;
  const owners = (process.env.AGELESS_OWNER_EMAILS || process.env.AGELESS_ADMIN_APPROVER_EMAIL || '')
    .split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  return { id: data.user.id, email: data.user.email.toLowerCase(), owner: owners.includes(data.user.email.toLowerCase()) };
}
const fail = (error: string, status = 403) => NextResponse.json({ error }, { status, headers });

export async function GET(req: NextRequest) {
  const user = await actor(req);
  if (!user) return fail('AUTH_REQUIRED', 401);
  try {
    const db = getAdminClient();
    if (user.owner) {
      const { data, error } = await db.from('ageless_tester_access')
        .select('user_id,email,status,requested_at,decided_at').order('requested_at', { ascending: false });
      return error ? fail('ACCESS_READ_FAILED', 500) : NextResponse.json({ owner: true, requests: data }, { headers });
    }
    const { data, error } = await db.from('ageless_tester_access')
      .select('status,email').eq('user_id', user.id).maybeSingle();
    return error ? fail('ACCESS_READ_FAILED', 500) : NextResponse.json({ owner: false, status: data?.email?.toLowerCase() === user.email ? data.status : 'not_requested' }, { headers });
  } catch { return fail('SERVER_NOT_READY', 503); }
}

export async function POST(req: NextRequest) {
  const user = await actor(req);
  if (!user) return fail('AUTH_REQUIRED', 401);
  let input: { action?: string; user_id?: string; status?: string };
  try { input = await req.json(); } catch { return fail('INVALID_BODY', 400); }
  try {
    const db = getAdminClient();
    if (input.action === 'request') {
      if (user.owner) return NextResponse.json({ status: 'approved', owner: true }, { headers });
      const { data: old, error: readError } = await db.from('ageless_tester_access')
        .select('status,email').eq('user_id', user.id).maybeSingle();
      if (readError) return fail('ACCESS_READ_FAILED', 500);
      if (old && old.email?.toLowerCase() !== user.email) return fail('ACCESS_EMAIL_CHANGED');
      if (old) return NextResponse.json({ status: old.status }, { headers });
      const { error } = await db.from('ageless_tester_access')
        .insert({ user_id: user.id, email: user.email, status: 'pending' });
      return error ? fail('ACCESS_REQUEST_FAILED', 500) : NextResponse.json({ status: 'pending' }, { headers });
    }
    if (input.action === 'decide') {
      if (!user.owner) return fail('OWNER_REQUIRED');
      if (!input.user_id || !['approved','rejected','pending'].includes(input.status || '')) return fail('INVALID_DECISION', 400);
      const { data, error } = await db.from('ageless_tester_access')
        .update({ status: input.status, decided_at: new Date().toISOString(), decided_by: user.email })
        .eq('user_id', input.user_id).select('user_id').maybeSingle();
      if (error) return fail('ACCESS_UPDATE_FAILED', 500);
      if (!data) return fail('USER_NOT_FOUND', 404);
      return NextResponse.json({ ok: true }, { headers });
    }
    return fail('UNKNOWN_ACTION', 400);
  } catch { return fail('SERVER_NOT_READY', 503); }
}
