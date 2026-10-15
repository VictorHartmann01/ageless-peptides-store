import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validEvidence } from '../../../lib/commerce/approval';
import { getAdminClient } from '../../../lib/commerce/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const noStore = { 'Cache-Control': 'no-store' };
const legalSlugs = ['impressum', 'datenschutz', 'agb', 'widerruf'];
const fail = (message: string, status = 400) => NextResponse.json({ error: message }, { status, headers: noStore });

async function authorize(req: NextRequest) {
  const bearer = req.headers.get('authorization');
  if (!bearer?.startsWith('Bearer ')) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  const auth = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await auth.auth.getUser(bearer.slice(7));
  const user = data.user;
  if (error || !user?.email_confirmed_at || !user.email) return null;
  const email = user.email.toLowerCase();
  const owners = (process.env.AGELESS_OWNER_EMAILS || process.env.AGELESS_ADMIN_APPROVER_EMAIL || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  if (owners.includes(email)) return { user, owner: true };
  const db = getAdminClient();
  const { data: access, error: lookupError } = await db.from('ageless_admin_access_requests').select('status,email').eq('user_id', user.id).maybeSingle();
  if (lookupError) throw lookupError;
  if (!access) {
    const { error: insertError } = await db.from('ageless_admin_access_requests').upsert({ user_id: user.id, email, status: 'pending' }, { onConflict: 'user_id', ignoreDuplicates: true });
    if (insertError) throw insertError;
  }
  return access?.status === 'approved' && access.email.toLowerCase() === email ? { user, owner: false } : null;
}
async function status(owner = false) {
  const db = getAdminClient();
  const [settings, pages, offers, orders] = await Promise.all([
    db.from('ageless_store_settings').select('*').eq('id', 1).single(),
    db.from('ageless_legal_pages').select('*').order('slug'),
    db.from('ageless_offers').select('id,name,slug,description,image_url,price_cents,shipping_cents,stock_quantity,allowed_countries,compliance_status,manual_approved,approval_reference,reviewed_at,is_published,legal_evidence,approved_by,updated_at,on_hold,hold_reason,catalog_visible').order('created_at', { ascending: false }),
    db.from('ageless_orders').select('id,buyer_name,email,country_code,items,total_cents,status,payment_mode,paypal_order_id,paypal_capture_id,created_at,paid_at').order('created_at', { ascending: false }).limit(50),
  ]);
  if (settings.error || pages.error || offers.error || orders.error) throw new Error('ADMIN_DATABASE_MIGRATION_REQUIRED');
  const env = {
    supabase: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    paypal: !!((process.env.PAYPAL_SANDBOX_CLIENT_ID && process.env.PAYPAL_SANDBOX_CLIENT_SECRET) || (process.env.PAYPAL_ENVIRONMENT === 'sandbox' && process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET)),
    paypalLive: !!process.env.PAYPAL_LIVE_CLIENT_ID && !!process.env.PAYPAL_LIVE_CLIENT_SECRET,
    paypalEnvironment: 'separate sandbox / live',
    checkoutEnabled: process.env.AGELESS_CHECKOUT_ENABLED === 'true',
    origin: !!process.env.AGELESS_PUBLIC_ORIGIN,
  };
  const legalReady = legalSlugs.every(slug => pages.data?.some(p => p.slug === slug && p.published && p.body?.trim().length >= 30));
  const offersReady = (offers.data || []).some(o => o.is_published && o.manual_approved && o.compliance_status === 'approved' && o.stock_quantity > 0 && o.approval_reference && !o.on_hold && o.reviewed_at && validEvidence(o.legal_evidence, o.allowed_countries));
  const requests = owner ? await db.from('ageless_admin_access_requests').select('user_id,email,status,requested_at,approved_at,approved_by').order('requested_at', { ascending: false }) : { data: [], error: null };
  if (requests.error) throw requests.error;
  return { owner, accessRequests: requests.data, settings: settings.data, pages: pages.data, offers: offers.data, orders: orders.data ?? [], env, legalReady, offersReady };
}
export async function GET(req: NextRequest) {
  try {
    const actor = await authorize(req);
    if (!actor) return fail('ACCESS_PENDING_OR_UNAUTHORIZED', 403);
    return NextResponse.json(await status(actor.owner), { headers: noStore });
  }
  catch { return fail('ADMIN_DATABASE_MIGRATION_REQUIRED', 503); }
}
export async function POST(req: NextRequest) {
  let actor;
  try { actor = await authorize(req); } catch { return fail('ADMIN_DATABASE_MIGRATION_REQUIRED', 503); }
  if (!actor) return fail('ACCESS_PENDING_OR_UNAUTHORIZED', 403);
  if (req.headers.get('content-type')?.split(';')[0] !== 'application/json') return fail('INVALID_CONTENT_TYPE', 415);
  let input: Record<string, unknown>;
  try { input = await req.json(); } catch { return fail('INVALID_JSON'); }
  try {
    const db = getAdminClient();
    const action = input.action;
    if (action === 'access') {
      if (!actor.owner) return fail('OWNER_REQUIRED', 403);
      const id = String(input.user_id || '');
      if (!/^[0-9a-f-]{36}$/i.test(id) || id === actor.user.id || !['approved','rejected','pending'].includes(String(input.status))) return fail('ACCESS_INVALID');
      const { data: target, error } = await db.from('ageless_admin_access_requests').update({ status: input.status, approved_at: input.status === 'approved' ? new Date().toISOString() : null, approved_by: actor.user.email }).eq('user_id', id).select('user_id').single();
      if (error || !target) return fail('ACCESS_REQUEST_NOT_FOUND', 404);
    } else if (action === 'legal') {
      if (!actor.owner) return fail('OWNER_REQUIRED', 403);
      const slug = String(input.slug || '');
      const body = String(input.body || '').trim();
      const published = input.published === true;
      if (!legalSlugs.includes(slug) || body.length > 40000 || (published && body.length < 30)) return fail('LEGAL_CONTENT_INVALID');
      const { error } = await db.from('ageless_legal_pages').update({ body, published, updated_at: new Date().toISOString() }).eq('slug', slug);
      if (error) throw error;
    } else if (action === 'create_offer') {
      const name = String(input.name || '').trim();
      const slug = String(input.slug || '').trim().toLowerCase();
      const price = input.price_cents === null ? null : Number(input.price_cents);
      const stock = input.stock_quantity === null ? null : Number(input.stock_quantity);
      if (name.length < 2 || name.length > 120 || !/^[a-z0-9-]{3,100}$/.test(slug) || (price !== null && (!Number.isSafeInteger(price) || price < 1 || price > 100000000)) || (stock !== null && (!Number.isSafeInteger(stock) || stock < 0 || stock > 1000000))) return fail('OFFER_INVALID');
      const { error } = await db.from('ageless_offers').insert({ name, slug, price_cents: price, stock_quantity: stock, shipping_cents: 0, allowed_countries: ['DE'], compliance_status: 'manual_review', manual_approved: false, is_published: false });
      if (error) throw error;
    } else if (action === 'offer') {
      const id = String(input.id || '');
      if (!/^[0-9a-f-]{36}$/i.test(id)) return fail('INVALID_ID');
      const stock = input.stock_quantity === null ? null : Number(input.stock_quantity);
      const price = input.price_cents === null ? null : Number(input.price_cents);
      const shipping = Number(input.shipping_cents);
      const name = String(input.name || '').trim();
      const ref = String(input.approval_reference || '').trim();
      const description = String(input.description || '').trim();
      const image = String(input.image_url || '').trim();
      const countries = String(input.allowed_countries || 'DE').split(',').map(x => x.trim().toUpperCase()).filter(Boolean);
      if (description.length > 5000 || (image && (!/^https:\/\/[a-z0-9.-]+(?:[:][0-9]+)?(?:\/[^\\s]*)?$/i.test(image) || image.length > 1000)) || !countries.length || countries.length > 20 || countries.some(x => !/^[A-Z]{2}$/.test(x))) return fail('PRODUCT_DETAILS_INVALID');
      const onHold = input.on_hold === true;
      const holdReason = String(input.hold_reason || '').trim();
      if (holdReason.length > 2000 || (onHold && !holdReason)) return fail('HOLD_REASON_REQUIRED');
      const approved = !onHold && input.manual_approved === true;
      const published = !onHold && input.is_published === true;
      const catalogVisible = input.catalog_visible === true;
      if ((stock !== null && (!Number.isSafeInteger(stock) || stock < 0 || stock > 1000000)) || (price !== null && (!Number.isSafeInteger(price) || price < 1 || price > 100000000)) || !Number.isSafeInteger(shipping) || shipping < 0 || shipping > 10000000 || name.length < 2 || name.length > 120 || ref.length > 500) return fail('OFFER_INVALID');
      if ((approved || published) && (price === null || stock === null)) return fail('PRICE_AND_STOCK_REQUIRED_FOR_APPROVAL');
      if ((approved || published) && (!approved || !ref )) return fail('APPROVAL_REFERENCE_REQUIRED');
      const evidence = input.legal_evidence;
      if (!Array.isArray(evidence) || evidence.length > 20 || JSON.stringify(evidence).length > 50000 || evidence.some(r => !r || typeof r !== 'object' || !['pending','verified','blocked'].includes(r.status) || ['country','intended_use','valid_from','valid_until','evidence_url','restrictions'].some(key => typeof r[key] !== 'string' || r[key].length > 2000))) return fail('LEGAL_EVIDENCE_INVALID');
      const { data: old, error: lookupError } = await db.from('ageless_offers').select('reviewed_at,approval_reference,name,description,image_url,price_cents,shipping_cents,stock_quantity,manual_approved,is_published,approved_by,legal_evidence,allowed_countries,updated_at,on_hold,hold_reason,catalog_visible').eq('id', id).single();
      if (lookupError || !old) return fail('OFFER_NOT_FOUND', 404);
      if (!actor.owner && catalogVisible !== (old.catalog_visible === true)) return fail('OWNER_REQUIRED', 403);
      if (input.updated_at !== old.updated_at) return fail('PRODUCT_CHANGED_RELOAD', 409);
      const evidenceChanged = old.on_hold !== onHold || (old.hold_reason || '') !== holdReason || old.name !== name || (old.description || '') !== description || old.approval_reference !== ref || JSON.stringify(old.legal_evidence) !== JSON.stringify(evidence) || JSON.stringify(old.allowed_countries) !== JSON.stringify(countries);
      // Any edit affecting the sold product requires a fresh owner approval.
      const commercialChanged = evidenceChanged || (old.image_url || null) !== (image || null) ||
        old.price_cents !== price || old.shipping_cents !== shipping || old.stock_quantity !== stock;
      // Approved staff may immediately remove a product from sale by zeroing stock,
      // without obtaining an owner signature. This emergency action REVOKES approval.
      const emergencyStockStop = !actor.owner && old.manual_approved && stock === 0 &&
        old.stock_quantity !== 0 && !evidenceChanged &&
        (old.image_url || null) === (image || null) &&
        old.price_cents === price && old.shipping_cents === shipping;
      const effectiveApproved = approved && !emergencyStockStop;
      const changedApproval = !old.manual_approved || commercialChanged;
      if (!actor.owner && old.manual_approved && commercialChanged && !emergencyStockStop) return fail('OWNER_REAPPROVAL_REQUIRED', 403);
      if (old.manual_approved && commercialChanged && (approved || published) && !emergencyStockStop) return fail('OWNER_REAPPROVAL_REQUIRED', 409);
      if (!actor.owner && (approved !== old.manual_approved || published !== old.is_published || evidenceChanged) && !emergencyStockStop) return fail('OWNER_REQUIRED', 403);
      if (approved && !validEvidence(evidence, countries)) return fail('LEGAL_EVIDENCE_MISSING_EXPIRED_OR_UNVERIFIED', 409);
      const { error } = await db.from('ageless_offers').update({
        name, description, image_url: image || null, allowed_countries: countries, price_cents: price, shipping_cents: shipping, stock_quantity: stock,
        catalog_visible: catalogVisible,
        on_hold: onHold, hold_reason: holdReason || null,
        legal_evidence: evidence, approved_by: effectiveApproved ? (changedApproval ? actor.user.email : old.approved_by) : null,
        approval_reference: ref || null, manual_approved: effectiveApproved,
        compliance_status: effectiveApproved ? 'approved' : 'manual_review',
        reviewed_at: effectiveApproved ? (changedApproval ? new Date().toISOString() : old.reviewed_at) : null,
        is_published: published && effectiveApproved,
        updated_at: new Date().toISOString(),
      }).eq('id', id).eq('updated_at', old.updated_at).select('id').single();
      if (error) return fail('PRODUCT_CHANGED_RELOAD', 409);
    } else if (action === 'mode') {
      if (!actor.owner) return fail('OWNER_REQUIRED', 403);
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

