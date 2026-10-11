import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, money, paypalRequest, priceCart } from '../../../../lib/commerce/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 });
    const body = await request.json() as Record<string, unknown>;
    if (typeof body.orderId !== 'string' || !uuid.test(body.orderId) || typeof body.paypalOrderId !== 'string' || !/^[A-Z0-9]{10,30}$/i.test(body.paypalOrderId)) return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 });
    const db = getAdminClient();
    const { data: order, error } = await db.from('ageless_orders').select('id,status,paypal_order_id,total_cents,country_code,payment_mode,items').eq('id', body.orderId).maybeSingle();
    if (error || !order || order.paypal_order_id !== body.paypalOrderId) return NextResponse.json({ error: 'ORDER_NOT_FOUND' }, { status: 404 });
    if (order.status === 'paid' || order.status === 'sandbox_paid' || order.status === 'paid_manual_review') return NextResponse.json({ status: order.status }, { headers: { 'Cache-Control': 'no-store' } });
    if (order.status !== 'payment_created') return NextResponse.json({ error: 'ORDER_NOT_PAYABLE' }, { status: 409 });
    if (process.env.AGELESS_CHECKOUT_ENABLED !== 'true') return NextResponse.json({ error: 'CHECKOUT_NOT_RELEASED' }, { status: 503 });
    const { data: gate, error: gateError } = await db.from('ageless_store_settings').select('mode').eq('id', 1).single();
    if (gateError || !gate || gate.mode !== order.payment_mode || !['sandbox', 'live'].includes(gate.mode)) return NextResponse.json({ error: 'CHECKOUT_NOT_RELEASED' }, { status: 503 });
    if (order.payment_mode === 'live') {
      if (process.env.AGELESS_LIVE_RELEASE_APPROVED !== 'true') return NextResponse.json({ error: 'LIVE_RELEASE_NOT_APPROVED' }, { status: 503 });
      const { data: pages, error: pagesError } = await db.from('ageless_legal_pages').select('slug,body,published');
      if (pagesError || !['impressum','datenschutz','agb','widerruf'].every(slug => pages?.some(p => p.slug === slug && p.published && p.body?.trim().length >= 30))) return NextResponse.json({ error: 'LEGAL_NOT_READY' }, { status: 503 });
    }
    // Re-check current product/country approval before requesting a charge.
    try {
      const price = await priceCart(order.items.map((item: { offer_id: string; quantity: number }) => ({ offerId: item.offer_id, quantity: item.quantity })), order.country_code);
      if (price.total !== order.total_cents) return NextResponse.json({ error: 'PRODUCT_OR_PRICE_CHANGED' }, { status: 409 });
    } catch { return NextResponse.json({ error: 'PRODUCT_APPROVAL_CHANGED' }, { status: 409 }); }
    // Capture is idempotent at PayPal and in the database. Never trust a browser-reported payment status.
    const result = await paypalRequest('/v2/checkout/orders/' + encodeURIComponent(body.paypalOrderId) + '/capture', 'POST', {}, 'ageless-capture-' + order.id, order.payment_mode as 'sandbox' | 'live');
    const units = result.purchase_units as Array<{ reference_id?: string; payments?: { captures?: Array<{ id: string; status: string; amount: { currency_code: string; value: string } }> } }> | undefined;
    const capture = units?.[0]?.payments?.captures?.[0];
    if (result.id !== body.paypalOrderId || units?.length !== 1 || units[0].reference_id !== order.id || capture?.status !== 'COMPLETED' || capture.amount?.currency_code !== 'EUR' || capture.amount.value !== money(order.total_cents)) throw new Error('PAYMENT_VERIFICATION_FAILED');
    if (order.payment_mode === 'sandbox') {
      const { error: sandboxError } = await db.from('ageless_orders').update({ status: 'sandbox_paid', paypal_capture_id: capture.id, paid_at: new Date().toISOString() }).eq('id', order.id).eq('status', 'payment_created');
      if (sandboxError) throw new Error('SANDBOX_ORDER_COMPLETION_FAILED');
      return NextResponse.json({ status: 'sandbox_paid' }, { headers: { 'Cache-Control': 'no-store' } });
    }
    const { data: state, error: completeError } = await db.rpc('ageless_complete_paid_order', { p_order_id: order.id, p_capture_id: capture.id });
    if (completeError) throw new Error('ORDER_COMPLETION_FAILED');
    return NextResponse.json({ status: state }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('AgeLess capture failure', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'PAYMENT_CONFIRMATION_UNAVAILABLE' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}

