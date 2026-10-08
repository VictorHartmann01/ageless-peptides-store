import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

export type CartLine = { offerId: string; quantity: number };
export type Address = { name: string; email: string; line1: string; line2?: string; city: string; postalCode: string; country: string };
type Offer = { id: string; name: string; price_cents: number; shipping_cents: number; stock_quantity: number; allowed_countries: string[]; compliance_status: string; manual_approved: boolean; reviewed_at: string | null; approval_reference: string | null; is_published: boolean };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('COMMERCE_DATABASE_NOT_CONFIGURED');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function parseOrderRequest(value: unknown): { cart: CartLine[]; address: Address } {
  if (!value || typeof value !== 'object') throw new Error('INVALID_REQUEST');
  const input = value as Record<string, unknown>;
  if (!Array.isArray(input.cart) || input.cart.length < 1 || input.cart.length > 20) throw new Error('INVALID_CART');
  const cart = input.cart.map((raw) => {
    if (!raw || typeof raw !== 'object') throw new Error('INVALID_CART');
    const line = raw as Record<string, unknown>;
    if (typeof line.offerId !== 'string' || !uuid.test(line.offerId) || !Number.isInteger(line.quantity) || (line.quantity as number) < 1 || (line.quantity as number) > 10) throw new Error('INVALID_CART');
    return { offerId: line.offerId, quantity: line.quantity as number };
  });
  if (new Set(cart.map((x) => x.offerId)).size !== cart.length) throw new Error('DUPLICATE_OFFER');
  const a = input.address;
  if (!a || typeof a !== 'object') throw new Error('INVALID_ADDRESS');
  const raw = a as Record<string, unknown>;
  const required = (field: string, max: number) => {
    const v = raw[field];
    if (typeof v !== 'string' || v.trim().length < 2 || v.trim().length > max) throw new Error('INVALID_ADDRESS');
    return v.trim();
  };
  const name = required('name', 120);
  const email = required('email', 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('INVALID_EMAIL');
  const line1 = required('line1', 200);
  const city = required('city', 120);
  const postalCode = required('postalCode', 20);
  const country = required('country', 2).toUpperCase();
  if (!/^[A-Z]{2}$/.test(country)) throw new Error('INVALID_COUNTRY');
  const line2 = typeof raw.line2 === 'string' ? raw.line2.trim().slice(0, 200) : '';
  return { cart, address: { name, email, line1, line2, city, postalCode, country } };
}

export async function priceCart(cart: CartLine[], country: string) {
  const db = getAdminClient();
  const { data, error } = await db.from('ageless_offers').select('id,name,price_cents,shipping_cents,stock_quantity,allowed_countries,compliance_status,manual_approved,reviewed_at,approval_reference,is_published').in('id', cart.map((x) => x.offerId));
  if (error) throw new Error('COMMERCE_DATABASE_NOT_READY');
  const offers = (data ?? []) as Offer[];
  if (offers.length !== cart.length) throw new Error('OFFER_NOT_AVAILABLE');
  let subtotal = 0;
  let shipping = 0;
  const items = cart.map((line) => {
    const o = offers.find((x) => x.id === line.offerId);
    if (!o || !o.is_published || !o.manual_approved || o.compliance_status !== 'approved' || !o.reviewed_at || !o.approval_reference || !o.allowed_countries.includes(country) || o.stock_quantity < line.quantity) throw new Error('OFFER_NOT_AVAILABLE');
    subtotal += o.price_cents * line.quantity;
    shipping = Math.max(shipping, o.shipping_cents);
    return { offer_id: o.id, name: o.name, quantity: line.quantity, unit_price_cents: o.price_cents };
  });
  if (!Number.isSafeInteger(subtotal + shipping) || subtotal + shipping <= 0) throw new Error('INVALID_TOTAL');
  return { items, subtotal, shipping, total: subtotal + shipping };
}

export function money(cents: number) { return (cents / 100).toFixed(2); }

export async function paypalRequest(path: string, method: 'GET' | 'POST', body?: unknown, requestId?: string) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const environment = process.env.PAYPAL_ENVIRONMENT;
  if (!clientId || !secret || !['sandbox','live'].includes(environment || '')) throw new Error('PAYPAL_NOT_CONFIGURED');
  const host = environment === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  const auth = Buffer.from(clientId + ':' + secret).toString('base64');
  const tokenResponse = await fetch(host + '/v1/oauth2/token', {
    method: 'POST', headers: { Authorization: 'Basic ' + auth, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials', cache: 'no-store', signal: AbortSignal.timeout(12000),
  });
  if (!tokenResponse.ok) throw new Error('PAYPAL_AUTH_FAILED');
  const token = await tokenResponse.json() as { access_token?: string };
  if (!token.access_token) throw new Error('PAYPAL_AUTH_FAILED');
  const response = await fetch(host + path, {
    method, headers: { Authorization: 'Bearer ' + token.access_token, 'Content-Type': 'application/json', ...(requestId ? { 'PayPal-Request-Id': requestId } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: 'no-store', signal: AbortSignal.timeout(18000),
  });
  const data = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) {
    console.error('PayPal API error', response.status, data.name || 'unknown');
    throw new Error('PAYPAL_REQUEST_FAILED');
  }
  return data;
}

export function newRequestId() { return randomUUID(); }
