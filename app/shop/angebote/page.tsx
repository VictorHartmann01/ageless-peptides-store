import Link from 'next/link';
import { getAdminClient } from '../../../lib/commerce/server';
import { validEvidence } from '../../../lib/commerce/approval';
import { catalogBlockReason, CatalogOffer } from '../../../lib/commerce/catalog';
import AddToCart from './AddToCart';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Produkte | AgeLess', description: 'AgeLess Produkte und ihr aktueller Freigabestatus.' };

type Offer = CatalogOffer;

export default async function OffersPage() {
  let offers: Offer[] = [];
  let unavailable = false;
  try {
    const { data, error } = await getAdminClient().from('ageless_offers')
      .select('id,name,description,image_url,price_cents,shipping_cents,stock_quantity,allowed_countries,compliance_status,manual_approved,is_published,reviewed_at,approval_reference,on_hold,legal_evidence')
      .eq('catalog_visible', true).order('name');
    if (error) unavailable = true;
    else offers = (data ?? []) as Offer[];
  } catch { unavailable = true; }

  return <main className="ag-buy-page">
    <header className="ag-buy-header"><Link href="/" aria-label="AgeLess Startseite"><img src="/ageless-logo.svg" alt="AgeLess" /></Link><nav><Link href="/shop">Research-Katalog</Link><Link href="/shop/warenkorb">Warenkorb →</Link></nav></header>
    <section className="ag-buy-hero"><span className="ag-section-label">AGELESS / PRODUKTE</span><h1>Bewusst ausgewählt.<br /><em>Transparent angeboten.</em></h1><p>Entdecke unsere Produkte und ihren aktuellen Prüfstatus. Eine Bestellung ist erst nach der Freigabe durch den Betreiber möglich.</p></section>
    {unavailable ? <section className="ag-buy-empty"><h2>Der Bestellkatalog ist derzeit nicht verfügbar.</h2><p>Bestellungen bleiben gesperrt, solange die erforderlichen Produktdaten nicht sicher geladen werden können.</p></section>
    : offers.length === 0 ? <section className="ag-buy-empty"><h2>Aktuell keine Produkte zur Anzeige freigegeben.</h2><p>Die Produktauswahl wird nach Prüfung der Informationen ergänzt.</p><Link href="/shop">Research-Katalog ansehen →</Link></section>
    : <section className="ag-buy-grid">{offers.map((offer) => <article className="ag-buy-card" key={offer.id}>
      <div className="ag-buy-image">{offer.image_url ? <img src={offer.image_url} alt={offer.name} /> : <span>AGELESS</span>}</div>
      <div className="ag-buy-body"><span className="ag-section-label">{validEvidence(offer.legal_evidence, offer.allowed_countries) ? 'NACHWEISE GEPRÜFT' : 'RECHTSPRÜFUNG OFFEN'}</span><h2>{offer.name}</h2><p>{offer.description ?? 'AgeLess Produkt.'}</p><strong>{offer.price_cents === null ? 'Preis noch offen' : (offer.price_cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</strong><small>Versand ab {(offer.shipping_cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} · Lieferländer: {offer.allowed_countries.join(', ')}</small>{Array.isArray(offer.legal_evidence) && offer.legal_evidence.filter((r: { country: string }) => r && typeof r.country === 'string' && validEvidence([r], [r.country])).map((r: { country: string; intended_use: string; valid_from: string; valid_until?: string }) => <p key={r.country}>Dokumentierte Einordnung: {r.country} · {r.intended_use} · seit {r.valid_from}{r.valid_until ? ' · bis ' + r.valid_until : ''}</p>)}<AddToCart offer={{ id: offer.id, name: offer.name, price_cents: offer.price_cents, shipping_cents: offer.shipping_cents }} blockedReason={catalogBlockReason(offer, process.env.AGELESS_CHECKOUT_ENABLED === 'true')} /></div>
    </article>)}</section>}
    <footer className="ag-buy-footer"><Link href="/">AgeLess</Link><Link href="/shop">Produktinformationen</Link><Link href="/rechtliches/impressum">Impressum</Link><Link href="/rechtliches/datenschutz">Datenschutz</Link><Link href="/rechtliches/agb">AGB</Link><Link href="/rechtliches/widerruf">Widerruf</Link></footer>
  </main>;
}

