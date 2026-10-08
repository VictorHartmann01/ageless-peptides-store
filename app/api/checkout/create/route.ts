import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, money, parseOrderRequest, paypalRequest, priceCart } from '../../../../lib/commerce/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') return NextResponse.json({ error: 'INVALID_CONTENT_TYPE' }, { status: 415 });
    const { cart, address } = parseOrderRequest(await request.json());
    const totals = await priceCart(cart, address.country);
    const db = getAdminClient();
    const { data: order, error } = await db.from('ageless_orders').insert({
      email: address.email, buyer_name: address.name,
      shipping_address: { line1: address.line1, line2: address.line2, city: address.city, postalCode: address.postalCode, country: address.country },
      country_code: address.country, items: totals.items,
      subtotal_cents: totals.subtotal, shipping_cents: totals.shipping, total_cents: totals.total,
      status: 'pending_payment',
    }).select('id').single();
    if (error || !order) throw new Error('ORDER_DATABASE_ERROR');
    try {
      const origin = process.env.AGELESS_PUBLIC_ORIGIN;
      if (!origin || !/^https:\/\/[a-z0-9.-]+$/i.test(origin)) throw new Error('SHOP_ORIGIN_NOT_CONFIGURED');
      const payment = await paypalRequest('/v2/checkout/orders', 'POST', {
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: order.id,
          custom_id: order.id,
          amount: { currency_code: 'EUR', value: money(totals.total), breakdown: { item_total: { currency_code: 'EUR', value: money(totals.subtotal) }, shipping: { currency_code: 'EUR', value: money(totals.shipping) } } },
          items: totals.items.map((i) => ({ name: i.name.slice(0, 127), quantity: String(i.quantity), unit_amount: { currency_code: 'EUR', value: money(i.unit_price_cents) }, category: 'PHYSICAL_GOODS' })),
        }],
        payment_source: { paypal: { experience_context: {
          brand_name: 'AgeLess', user_action: 'PAY_NOW',
          return_url: origin + '/shop/checkout/return?orderId=' + order.id,
          cancel_url: origin + '/shop/checkout?cancelled=1',
        } } },
      }, 'ageless-create-' + order.id);
      const paypalId = payment.id;
      const links = payment.links as Array<{ rel: string; href: string }> | undefined;
      const approval = links?.find((l) => l.rel === 'payer-action' || l.rel === 'approve')?.href;
      if (typeof paypalId !== 'string' || typeof approval !== 'string' || !approval.startsWith('https://')) throw new Error('PAYPAL_APPROVAL_MISSING');
      const { error: saveError } = await db.from('ageless_orders').update({ status: 'payment_created', paypal_order_id: paypalId }).eq('id', order.id).eq('status', 'pending_payment');
      if (saveError) throw new Error('ORDER_DATABASE_ERROR');
      return NextResponse.json({ orderId: order.id, approvalUrl: approval }, { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
      await db.from('ageless_orders').update({ status: 'payment_failed' }).eq('id', order.id).eq('status', 'pending_payment');
      throw error;
    }
  } catch (error) {
    const code = error instanceof Error ? error.message : 'CHECKOUT_UNAVAILABLE';
    const clientErrors = ['INVALID_REQUEST','INVALID_CART','DUPLICATE_OFFER','INVALID_ADDRESS','INVALID_EMAIL','INVALID_COUNTRY','INVALID_TOTAL','OFFER_NOT_AVAILABLE'];
    const status = clientErrors.includes(code) ? 400 : 503;
    return NextResponse.json({ error: status === 400 ? code : 'CHECKOUT_UNAVAILABLE' }, { status, headers: { 'Cache-Control': 'no-store' } });
  }
}
