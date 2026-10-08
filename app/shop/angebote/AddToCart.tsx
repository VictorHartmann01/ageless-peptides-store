'use client';
import { useState } from 'react';
import { readCart, writeCart } from '../../../lib/commerce/cart';

export default function AddToCart({ offer }: { offer: { id: string; name: string; price_cents: number; shipping_cents: number } }) {
  const [added, setAdded] = useState(false);
  function add() {
    const cart = readCart();
    const existing = cart.find((item) => item.offerId === offer.id);
    if (existing) existing.quantity = Math.min(existing.quantity + 1, 10);
    else if (cart.length < 20) cart.push({ offerId: offer.id, name: offer.name, priceCents: offer.price_cents, shippingCents: offer.shipping_cents, quantity: 1 });
    writeCart(cart);
    setAdded(true);
  }
  return <div className="ag-buy-actions"><button type="button" className="ag-buy-button" onClick={add}>In den Warenkorb <span aria-hidden="true">→</span></button>{added && <a href="/shop/warenkorb" className="ag-buy-link">Warenkorb öffnen →</a>}</div>;
}
