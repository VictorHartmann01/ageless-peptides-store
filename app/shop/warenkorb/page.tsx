'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { euro, readCart, SavedCartItem, writeCart } from '../../../lib/commerce/cart';

export default function CartPage() {
  const [items, setItems] = useState<SavedCartItem[]>([]);
  useEffect(() => { setItems(readCart()); }, []);
  function change(id: string, quantity: number) {
    const next = items.map((x) => x.offerId === id ? { ...x, quantity } : x).filter((x) => x.quantity > 0);
    setItems(next); writeCart(next);
  }
  const subtotal = items.reduce((n, x) => n + x.priceCents * x.quantity, 0);
  const shipping = items.length ? Math.max(...items.map((x) => x.shippingCents)) : 0;
  return <main className="ag-buy-page"><header className="ag-buy-header"><Link href="/"><img src="/ageless-logo.svg" alt="AgeLess" /></Link><Link href="/shop/angebote">Weiter einkaufen →</Link></header>
    <section className="ag-buy-hero"><span className="ag-section-label">AGELESS / WARENKORB</span><h1>Ihre Auswahl.</h1><p>Preise und Produktfreigaben werden vor dem Bezahlvorgang auf dem Server erneut geprüft.</p></section>
    <section className="ag-cart-wrap">{items.length === 0 ? <div className="ag-buy-empty"><h2>Ihr Warenkorb ist leer.</h2><Link href="/shop/angebote">Freigegebene Angebote ansehen →</Link></div> : <>
      {items.map((x) => <div className="ag-cart-line" key={x.offerId}><div><h2>{x.name}</h2><span>{euro(x.priceCents)} je Stück</span></div><div className="ag-cart-controls"><label htmlFor={'qty-' + x.offerId}>Anzahl</label><select id={'qty-' + x.offerId} value={x.quantity} onChange={(e) => change(x.offerId, Number(e.target.value))}>{Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}</select><button type="button" onClick={() => change(x.offerId, 0)}>Entfernen</button></div><strong>{euro(x.priceCents * x.quantity)}</strong></div>)}
      <div className="ag-cart-total"><span>Zwischensumme</span><strong>{euro(subtotal)}</strong><span>Voraussichtlicher Versand</span><strong>{euro(shipping)}</strong><span>Voraussichtlicher Gesamtbetrag</span><strong>{euro(subtotal + shipping)}</strong></div>
      <p className="ag-cart-hint">Die endgültige Summe wird nach Prüfung der Lieferadresse und der aktuellen Preise berechnet.</p>
      <Link className="ag-buy-button ag-cart-checkout" href="/shop/checkout">Zur Kasse →</Link>
    </>}</section>
  </main>;
}
