import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, money, paypalRequest } from '../../../../lib/commerce/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 });
    const body = await request.json() as Record<string, unknown>;
    if (typeof body.orderId !== 'string' || !uuid.test(body.orderId) || typeof body.paypalOrderId !== 'string' || !/^[A-Z0-9]{10,30}$/i.test(body.paypalOrderId)) return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 });
    const db = getAdminClient();
    const { data: order, error } = await db.from('ageless_orders').select('id,status,paypal_order_id,total_cents,country_code').eq('id', body.orderId).maybeSingle();
    if (error || !order || order.paypal_order_id !== body.paypalOrderId) return NextResponse.json({ error: 'ORDER_NOT_FOUND' }, { status: 404 });
    if (order.status === 'paid' || order.status === 'paid_manual_review') return NextResponse.json({ status: order.status }, { headers: { 'Cache-Control': 'no-store' } });
    if (order.status !== 'payment_created') return NextResponse.json({ error: 'ORDER_NOT_PAYABLE' }, { status: 409 });
    // Capture is idempotent at PayPal and in the database. Never trust a browser-reported payment status.
    const result = await paypalRequest('/v2/checkout/orders/' + encodeURIComponent(body.paypalOrderId) + '/capture', 'POST', {}, 'ageless-capture-' + order.id);
    const units = result.purchase_units as Array<{ reference_id?: string; payments?: { captures?: Array<{ id: string; status: string; amount: { currency_code: string; value: string } }> } }> | undefined;
    const capture = units?.[0]?.payments?.captures?.[0];
    if (result.id !== body.paypalOrderId || units?.length !== 1 || units[0].reference_id !== order.id || capture?.status !== 'COMPLETED' || capture.amount?.currency_code !== 'EUR' || capture.amount.value !== money(order.total_cents)) throw new Error('PAYMENT_VERIFICATION_FAILED');
    const { data: state, error: completeError } = await db.rpc('ageless_complete_paid_order', { p_order_id: order.id, p_capture_id: capture.id });
    if (completeError) throw new Error('ORDER_COMPLETION_FAILED');
    return NextResponse.json({ status: state }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('AgeLess capture failure', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'PAYMENT_CONFIRMATION_UNAVAILABLE' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
