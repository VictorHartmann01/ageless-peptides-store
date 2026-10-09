import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAdminClient } from '../../../lib/commerce/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const noStore = { 'Cache-Control': 'no-store' };
const legalSlugs = ['impressum', 'datenschutz', 'agb', 'widerruf'];
const fail = (message: string, status = 400) => NextResponse.json({ error: message }, { status, headers: noStore });

async function authorize(req: NextRequest) {
  const bearer = req.headers.get('authorization');
  if (!bearer?.startsWith('Bearer ')) return false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const allow = (process.env.AGELESS_ADMIN_EMAILS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  if (!url || !anon || !allow.length) return false;
  const auth = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await auth.auth.getUser(bearer.slice(7));
  return !error && !!data.user?.email_confirmed_at && !!data.user.email && allow.includes(data.user.email.toLowerCase());
}
async function status() {
  const db = getAdminClient();
  const [settings, pages, offers] = await Promise.all([
    db.from('ageless_store_settings').select('*').eq('id', 1).single(),
    db.from('ageless_legal_pages').select('*').order('slug'),
    db.from('ageless_offers').select('id,name,slug,description,image_url,price_cents,shipping_cents,stock_quantity,allowed_countries,compliance_status,manual_approved,approval_reference,reviewed_at,is_published').order('created_at', { ascending: false }),
  ]);
  if (settings.error || pages.error || offers.error) throw new Error('ADMIN_DATABASE_MIGRATION_REQUIRED');
  const env = {
    supabase: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    paypal: !!((process.env.PAYPAL_SANDBOX_CLIENT_ID && process.env.PAYPAL_SANDBOX_CLIENT_SECRET) || (process.env.PAYPAL_ENVIRONMENT === 'sandbox' && process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET)),
    paypalLive: !!process.env.PAYPAL_LIVE_CLIENT_ID && !!process.env.PAYPAL_LIVE_CLIENT_SECRET,
    paypalEnvironment: 'separate sandbox / live',
    checkoutEnabled: process.env.AGELESS_CHECKOUT_ENABLED === 'true',
    origin: !!process.env.AGELESS_PUBLIC_ORIGIN,
  };
  const legalReady = legalSlugs.every(slug => pages.data?.some(p => p.slug === slug && p.published && p.body?.trim().length >= 30));
  const offersReady = (offers.data || []).some(o => o.is_published && o.manual_approved && o.compliance_status === 'approved' && o.stock_quantity > 0 && o.approval_reference && o.reviewed_at);
  return { settings: settings.data, pages: pages.data, offers: offers.data, env, legalReady, offersReady };
}
export async function GET(req: NextRequest) {
  if (!await authorize(req)) return fail('UNAUTHORIZED', 401);
  try { return NextResponse.json(await status(), { headers: noStore }); }
  catch { return fail('ADMIN_DATABASE_MIGRATION_REQUIRED', 503); }
}
export async function POST(req: NextRequest) {
  if (!await authorize(req)) return fail('UNAUTHORIZED', 401);
  if (req.headers.get('content-type')?.split(';')[0] !== 'application/json') return fail('INVALID_CONTENT_TYPE', 415);
  let input: Record<string, unknown>;
  try { input = await req.json(); } catch { return fail('INVALID_JSON'); }
  const db = getAdminClient();
  try {
    const action = input.action;
    if (action === 'legal') {
      const slug = String(input.slug || '');
      const body = String(input.body || '').trim();
      const published = input.published === true;
      if (!legalSlugs.includes(slug) || body.length > 40000 || (published && body.length < 30)) return fail('LEGAL_CONTENT_INVALID');
      const { error } = await db.from('ageless_legal_pages').update({ body, published, updated_at: new Date().toISOString() }).eq('slug', slug);
      if (error) throw error;
    } else if (action === 'create_offer') {
      const name = String(input.name || '').trim();
      const slug = String(input.slug || '').trim().toLowerCase();
      const price = Number(input.price_cents);
      const stock = Number(input.stock_quantity);
      if (name.length < 2 || name.length > 120 || !/^[a-z0-9-]{3,100}$/.test(slug) || !Number.isSafeInteger(price) || price < 1 || price > 100000000 || !Number.isSafeInteger(stock) || stock < 0 || stock > 1000000) return fail('OFFER_INVALID');
      const { error } = await db.from('ageless_offers').insert({ name, slug, price_cents: price, stock_quantity: stock, shipping_cents: 0, allowed_countries: ['DE'], compliance_status: 'manual_review', manual_approved: false, is_published: false });
      if (error) throw error;
    } else if (action === 'offer') {
      const id = String(input.id || '');
      if (!/^[0-9a-f-]{36}$/i.test(id)) return fail('INVALID_ID');
      const stock = Number(input.stock_quantity);
      const price = Number(input.price_cents);
      const shipping = Number(input.shipping_cents);
      const name = String(input.name || '').trim();
      const ref = String(input.approval_reference || '').trim();
      const description = String(input.description || '').trim();
      const image = String(input.image_url || '').trim();
      const countries = String(input.allowed_countries || 'DE').split(',').map(x => x.trim().toUpperCase()).filter(Boolean);
      if (description.length > 5000 || (image && (!/^https:\/\/[a-z0-9.-]+(?:[:][0-9]+)?(?:\/[^\\s]*)?$/i.test(image) || image.length > 1000)) || !countries.length || countries.length > 20 || countries.some(x => !/^[A-Z]{2}$/.test(x))) return fail('PRODUCT_DETAILS_INVALID');
      const approved = input.manual_approved === true;
      const published = input.is_published === true;
      if (!Number.isSafeInteger(stock) || stock < 0 || stock > 1000000 || !Number.isSafeInteger(price) || price < 1 || price > 100000000 || !Number.isSafeInteger(shipping) || shipping < 0 || shipping > 10000000 || name.length < 2 || name.length > 120 || ref.length > 500) return fail('OFFER_INVALID');
      if ((approved || published) && (!approved || !ref || stock < 1)) return fail('APPROVAL_REFERENCE_AND_STOCK_REQUIRED');
      const { data: old, error: lookupError } = await db.from('ageless_offers').select('reviewed_at,approval_reference,manual_approved').eq('id', id).single();
      if (lookupError || !old) return fail('OFFER_NOT_FOUND', 404);
      const changedApproval = !old.manual_approved || old.approval_reference !== ref;
      const { error } = await db.from('ageless_offers').update({
        name, description, image_url: image || null, allowed_countries: countries, price_cents: price, shipping_cents: shipping, stock_quantity: stock,
        approval_reference: ref || null, manual_approved: approved,
        compliance_status: approved ? 'approved' : 'manual_review',
        reviewed_at: approved ? (changedApproval ? new Date().toISOString() : old.reviewed_at) : null,
        is_published: published && approved,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
    } else if (action === 'mode') {
      const mode = String(input.mode || '');
      if (!['draft','sandbox','live'].includes(mode)) return fail('INVALID_MODE');
      if (mode !== 'draft') {
        const state = await status();
        if (!(mode === 'live' ? state.env.paypalLive : state.env.paypal) || !state.env.checkoutEnabled || !state.env.origin) return fail('PAYMENT_ENVIRONMENT_NOT_READY', 409);
        if (mode === 'live' && (!state.legalReady || !state.offersReady)) return fail('LEGAL_OR_PRODUCTS_NOT_READY', 409);
        if (mode === 'live' && input.confirm !== 'LIVE FREIGEBEN') return fail('LIVE_CONFIRMATION_REQUIRED', 409);
      }
      const { error } = await db.from('ageless_store_settings').update({ mode, updated_at: new Date().toISOString() }).eq('id', 1);
      if (error) throw error;
    } else return fail('UNKNOWN_ACTION');
    return NextResponse.json({ ok: true }, { headers: noStore });
  } catch {
    return fail('SAVE_FAILED_CHECK_SCHEMA_OR_VALUES', 503);
  }
}
