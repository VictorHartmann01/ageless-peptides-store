'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { writeCart } from '../../../../lib/commerce/cart';

export default function PaymentReturnPage() {
  const [state, setState] = useState<'checking' | 'paid' | 'manual' | 'failed'>('checking');
  useEffect(() => {
    let active = true;
    async function verify() {
      try {
        const query = new URLSearchParams(window.location.search);
        const orderId = query.get('orderId');
        const paypalOrderId = query.get('token');
        if (!orderId || !paypalOrderId) throw new Error('Missing payment reference');
        const response = await fetch('/api/checkout/capture', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId, paypalOrderId }) });
        const result = await response.json() as { status?: string };
        if (!response.ok || !['paid', 'paid_manual_review'].includes(result.status || '')) throw new Error('Payment not confirmed');
        if (!active) return;
        writeCart([]);
        setState(result.status === 'paid' ? 'paid' : 'manual');
      } catch { if (active) setState('failed'); }
    }
    void verify();
    return () => { active = false; };
  }, []);
  return <main className="ag-buy-page"><header className="ag-buy-header"><Link href="/"><img src="/ageless-logo.svg" alt="AgeLess" /></Link></header>
    <section className="ag-buy-hero"><span className="ag-section-label">AGELESS / ZAHLUNGSSTATUS</span><h1>{state === 'checking' ? 'Zahlung wird geprüft.' : state === 'paid' ? 'Vielen Dank für Ihre Bestellung.' : state === 'manual' ? 'Zahlung eingegangen.' : 'Zahlungsstatus noch nicht bestätigt.'}</h1>
    {state === 'checking' && <p role="status">Bitte warten. Die Zahlung wird direkt beim Zahlungsanbieter überprüft.</p>}
    {state === 'paid' && <p role="status">Die Zahlung wurde bestätigt und die Bestellung gespeichert. Bitte bewahren Sie Ihre PayPal-Zahlungsbestätigung auf.</p>}
    {state === 'manual' && <p role="status">Ihre Zahlung ist bestätigt. Die Bestellung benötigt eine manuelle Prüfung, bevor ein Versand erfolgen kann.</p>}
    {state === 'failed' && <p role="alert">Eine Bestätigung konnte derzeit nicht abgerufen werden. Bitte nicht erneut bezahlen, bevor der Status geklärt ist. Prüfen Sie Ihre PayPal-Aktivitäten.</p>}
    <Link className="ag-buy-link" href="/">Zur AgeLess Startseite →</Link></section>
  </main>;
}
