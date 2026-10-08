export type SavedCartItem = { offerId: string; name: string; priceCents: number; shippingCents: number; quantity: number };
const key = 'ageless_cart_v1';
export function readCart(): SavedCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(key) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.filter((x) => typeof x.offerId === 'string' && typeof x.name === 'string' && Number.isInteger(x.priceCents) && Number.isInteger(x.shippingCents) && Number.isInteger(x.quantity) && x.quantity >= 1 && x.quantity <= 10).slice(0,20);
  } catch { return []; }
}
export function writeCart(items: SavedCartItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event('ageless-cart-updated'));
}
export function euro(cents: number) { return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100); }
