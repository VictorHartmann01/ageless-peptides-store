'use client';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { euro, readCart, SavedCartItem } from '../../../lib/commerce/cart';

type Form = { name: string; email: string; line1: string; line2: string; postalCode: string; city: string; country: string };
const initial: Form = { name: '', email: '', line1: '', line2: '', postalCode: '', city: '', country: 'DE' };

export default function CheckoutPage() {
  const [cart, setCart] = useState<SavedCartItem[]>([]);
  const [form, setForm] = useState<Form>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [cancelled, setCancelled] = useState(false);
  useEffect(() => { setCart(readCart()); setCancelled(new URLSearchParams(window.location.search).get('cancelled') === '1'); }, []);
  const subtotal = cart.reduce((n, x) => n + x.priceCents * x.quantity, 0);
  const shipping = cart.length ? Math.max(...cart.map((x) => x.shippingCents)) : 0;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !cart.length) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/checkout/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cart: cart.map((x) => ({ offerId: x.offerId, quantity: x.quantity })), address: form }) });
      const data = await response.json() as { approvalUrl?: string; error?: string };
      if (!response.ok || !data.approvalUrl) throw new Error(data.error === 'OFFER_NOT_AVAILABLE' ? 'Ein Produkt ist für die angegebene Lieferadresse nicht verfügbar. Bitte Warenkorb und Lieferland prüfen.' : 'Der sichere Bezahlvorgang ist derzeit nicht verfügbar. Es wurde keine Zahlung ausgelöst.');
      if (!data.approvalUrl.startsWith('https://')) throw new Error('Ungültige Zahlungsweiterleitung.');
      window.location.assign(data.approvalUrl);
    } catch (e) { setError(e instanceof Error ? e.message : 'Checkout nicht verfügbar.'); setBusy(false); }
  }
  return <main className="ag-buy-page"><header className="ag-buy-header"><Link href="/"><img src="/ageless-logo.svg" alt="AgeLess" /></Link><Link href="/shop/warenkorb">← Warenkorb</Link></header>
    <section className="ag-buy-hero"><span className="ag-section-label">AGELESS / CHECKOUT</span><h1>Sicher bestellen.</h1><p>Produktzulässigkeit, Bestand und Preis werden vor jeder Zahlung erneut geprüft.</p></section>
    <section className="ag-checkout-layout"><form onSubmit={submit} className="ag-checkout-form">
      <h2>Rechnungs- und Lieferdaten</h2>
      {cancelled && <p role="status" className="ag-checkout-alert">Der Zahlungsvorgang wurde abgebrochen. Es wurde keine Bestellung bezahlt.</p>}
      <label>Vollständiger Name<input required minLength={2} maxLength={120} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>E-Mail-Adresse<input type="email" required maxLength={254} autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Straße und Hausnummer<input required minLength={2} maxLength={200} autoComplete="address-line1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} /></label>
      <label>Adresszusatz (optional)<input maxLength={200} autoComplete="address-line2" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} /></label>
      <div className="ag-form-pair"><label>Postleitzahl<input required minLength={2} maxLength={20} autoComplete="postal-code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} /></label><label>Ort<input required minLength={2} maxLength={120} autoComplete="address-level2" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label></div>
      <label>Lieferland<select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}><option value="DE">Deutschland</option><option value="AT">Österreich</option><option value="CH">Schweiz</option></select></label>
      <p className="ag-cart-hint">Bitte prüfen Sie vor der Bestellung die Angaben zu Versand, Rückgabe und Datenschutz. Der Kauf wird erst durch die bestätigte PayPal-Zahlung abgeschlossen.</p>
      {error && <p className="ag-checkout-alert" role="alert">{error}</p>}
      <button className="ag-buy-button" type="submit" disabled={busy || !cart.length}>{busy ? 'Sichere Zahlung wird vorbereitet …' : 'Weiter zu PayPal →'}</button>
    </form>
    <aside className="ag-checkout-summary"><h2>Ihre Bestellung</h2>{cart.length ? <>{cart.map((x) => <div className="ag-cart-summary-line" key={x.offerId}><span>{x.name} × {x.quantity}</span><strong>{euro(x.priceCents * x.quantity)}</strong></div>)}<div className="ag-cart-summary-line"><span>Zwischensumme</span><strong>{euro(subtotal)}</strong></div><div className="ag-cart-summary-line"><span>Voraussichtlicher Versand</span><strong>{euro(shipping)}</strong></div><div className="ag-cart-summary-line ag-summary-total"><span>Voraussichtliche Gesamtsumme</span><strong>{euro(subtotal + shipping)}</strong></div><small>Verbindliche Preis- und Lieferlandprüfung erfolgt auf dem Server.</small></> : <p>Ihr Warenkorb ist leer. <Link href="/shop/angebote">Angebote ansehen</Link></p>}</aside></section>
  </main>;
}
