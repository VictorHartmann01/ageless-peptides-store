import Link from 'next/link';
import { createPublicClient } from '../../../lib/supabase/public';
import AddToCart from './AddToCart';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Bestellbare Produkte | AgeLess', description: 'Ausschließlich nach dokumentierter Freigabe bestellbare AgeLess Produkte.' };

type Offer = { id: string; name: string; description: string | null; image_url: string | null; price_cents: number; shipping_cents: number; stock_quantity: number; allowed_countries: string[] };

export default async function OffersPage() {
  let offers: Offer[] = [];
  let unavailable = false;
  try {
    const { data, error } = await createPublicClient().from('ageless_offers')
      .select('id,name,description,image_url,price_cents,shipping_cents,stock_quantity,allowed_countries')
      .eq('is_published', true).eq('manual_approved', true).eq('compliance_status', 'approved')
      .gt('stock_quantity', 0).order('name');
    if (error) unavailable = true;
    else offers = (data ?? []) as Offer[];
  } catch { unavailable = true; }

  return <main className="ag-buy-page">
    <header className="ag-buy-header"><Link href="/" aria-label="AgeLess Startseite"><img src="/ageless-logo.svg" alt="AgeLess" /></Link><nav><Link href="/shop">Research-Katalog</Link><Link href="/shop/warenkorb">Warenkorb →</Link></nav></header>
    <section className="ag-buy-hero"><span className="ag-section-label">AGELESS / FREIGEGEBENE ANGEBOTE</span><h1>Bewusst ausgewählt.<br /><em>Transparent angeboten.</em></h1><p>Hier erscheinen ausschließlich Produkte, die für einen konkreten Verkauf dokumentiert freigegeben wurden. Research-Einträge sind nicht bestellbar.</p></section>
    {unavailable ? <section className="ag-buy-empty"><h2>Der Bestellkatalog ist derzeit nicht verfügbar.</h2><p>Bestellungen bleiben gesperrt, solange die erforderlichen Produktdaten nicht sicher geladen werden können.</p></section>
    : offers.length === 0 ? <section className="ag-buy-empty"><h2>Aktuell keine Produkte für den Verkauf freigegeben.</h2><p>Die Produktprüfung läuft getrennt vom Research-Katalog. Wir veröffentlichen hier keine ungeprüften Kaufangebote.</p><Link href="/shop">Research-Katalog ansehen →</Link></section>
    : <section className="ag-buy-grid">{offers.map((offer) => <article className="ag-buy-card" key={offer.id}>
      <div className="ag-buy-image">{offer.image_url ? <img src={offer.image_url} alt={offer.name} /> : <span>AGELESS</span>}</div>
      <div className="ag-buy-body"><span className="ag-section-label">DOKUMENTIERT FREIGEGEBEN</span><h2>{offer.name}</h2><p>{offer.description ?? 'AgeLess Produkt.'}</p><strong>{(offer.price_cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</strong><small>Versand ab {(offer.shipping_cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} · Lieferländer: {offer.allowed_countries.join(', ')}</small><AddToCart offer={offer} /></div>
    </article>)}</section>}
    <footer className="ag-buy-footer"><Link href="/">AgeLess</Link><Link href="/shop">Produktinformationen</Link><Link href="/rechtliches/impressum">Impressum</Link><Link href="/rechtliches/datenschutz">Datenschutz</Link><Link href="/rechtliches/agb">AGB</Link><Link href="/rechtliches/widerruf">Widerruf</Link></footer>
  </main>;
}
