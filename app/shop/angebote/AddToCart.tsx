'use client';
import { useState } from 'react';
import { readCart, writeCart } from '../../../lib/commerce/cart';

export default function AddToCart({ offer, blockedReason }: { offer: { id: string; name: string; price_cents: number | null; shipping_cents: number }; blockedReason?: string }) {
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState('');
  function add() {
    if (blockedReason) { setMessage(blockedReason); return; }
    if (offer.price_cents === null || offer.price_cents <= 0) { setMessage('Für dieses Produkt ist noch kein Preis freigegeben.'); return; }
    const cart = readCart();
    const existing = cart.find((item) => item.offerId === offer.id);
    if (existing) existing.quantity = Math.min(existing.quantity + 1, 10);
    else if (cart.length < 20) cart.push({ offerId: offer.id, name: offer.name, priceCents: offer.price_cents, shippingCents: offer.shipping_cents, quantity: 1 });
    writeCart(cart);
    setAdded(true);
  }
  return <div className="ag-buy-actions"><button type="button" className="ag-buy-button" onClick={add}>Bestellen <span aria-hidden="true">→</span></button>{message && <p role="status">{message}</p>}{added && <a href="/shop/warenkorb" className="ag-buy-link">Warenkorb öffnen →</a>}</div>;
}

