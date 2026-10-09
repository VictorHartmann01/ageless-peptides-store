import Link from 'next/link';
import { createPublicClient } from '../lib/supabase/public';
const hero = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1800&q=85'; // Existing approved asset kept until licensed 35–65 lifestyle hero is supplied.

const categories = [
  { title: 'Peptide entdecken', eyebrow: 'WIRKSTOFFWELTEN', text: 'Peptide im Überblick: Produktformen, Hintergründe und transparente Informationen.', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=82', style: 'science' },
  { title: 'NAD+ & Longevity', eyebrow: 'ZELLBIOLOGIE', text: 'Entdecken Sie NAD+-Themen und erfahren Sie mehr über die Produktwelt.', image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=82', style: 'nad' },
  { title: 'Essentials & Vitamine', eyebrow: 'GRUNDLAGEN', text: 'Essentials entdecken und Inhaltsstoffe auf einen Blick kennenlernen.', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=82', style: 'nature' },
];

type Offer = { id: string; name: string; description: string | null; image_url: string | null; price_cents: number };
export const dynamic = 'force-dynamic';
async function getApprovedOffers(): Promise<Offer[]> {
  try {
    const { data, error } = await createPublicClient().from('ageless_offers')
      .select('id,name,description,image_url,price_cents')
      .eq('is_published', true).eq('manual_approved', true)
      .eq('compliance_status', 'approved').gt('stock_quantity', 0).order('name').limit(4);
    return error ? [] : (data ?? []) as Offer[];
  } catch { return []; }
}

export default async function Home() {
  const offers = await getApprovedOffers();
  return <main className="alv2" id="top">
    <a className="alv2-skip" href="#main-content">Zum Inhalt springen</a>
    <div className="alv2-trustbar"><span>AGELESS PREMIUM STORE</span><i/><span>KLARE PRODUKTINFORMATIONEN</span><i/><span>BEWUSST AUSWÄHLEN</span><span className="alv2-trustbar-right">AGELESS · LONGEVITY & SCIENCE</span></div>
    <header className="alv2-header">
      <Link className="alv2-logo" href="/" aria-label="AgeLess Startseite"><img src="/ageless-logo.svg" alt="AgeLess – Science for a Longer, Better Life" /></Link>
      <nav className="alv2-nav" aria-label="Hauptnavigation"><a className="alv2-nav-active" href="#top">Home</a><Link href="/shop/angebote">Shop</Link><a href="#wissen">Produktwelten</a><a href="#qualitaet">Qualität</a><a href="#ueber">Über AgeLess</a></nav>
      <Link className="alv2-nav-shop" href="/shop/angebote">Zum Shop <span aria-hidden="true">↗</span></Link>
      <details className="alv2-mobile-menu"><summary aria-label="Menü öffnen"><span/><span/><span/></summary><nav aria-label="Mobile Navigation"><a href="#top">Home</a><Link href="/shop/angebote">Shop</Link><a href="#wissen">Produktwelten</a><a href="#qualitaet">Qualität</a><a href="#ueber">Über AgeLess</a></nav></details>
    </header>
    <section className="alv2-hero" id="main-content" aria-labelledby="alv2-title">
      <div className="alv2-hero-copy">
        <p className="alv2-eyebrow">AGELESS · LONGEVITY & LIFESTYLE</p>
        <h1 id="alv2-title">Mehr Lebensqualität.<br/><em>Mehr Du.</em></h1>
        <p className="alv2-hero-lead">Entdecken Sie Longevity neu.</p>
        <p className="alv2-hero-description">Wählen Sie aus unseren Produktwelten rund um Peptide, NAD+ und Essentials. Entdecken Sie ausgewählte Angebote und informieren Sie sich einfach und transparent über jedes Produkt.</p>
        <div className="alv2-hero-actions"><Link className="alv2-gold-button" href="/shop/angebote">Zum Shop <span aria-hidden="true">→</span></Link><a className="alv2-hero-link" href="#wissen">Produktwelten entdecken ↗</a></div>
        <div className="alv2-hero-proof"><span><b aria-hidden="true">◇</b> Übersichtlich auswählen</span><span><b aria-hidden="true">✧</b> Produktdetails vergleichen</span><span><b aria-hidden="true">♧</b> Klar informiert</span></div>
      </div>
      <div className="alv2-hero-media"><div className="alv2-hero-photo" style={{backgroundImage:`url("${hero}")`}} role="img" aria-label="Lebensfreude und gemeinsame Zeit im Freien"/><div className="alv2-hero-photo-shade"/><div className="alv2-hero-quote"><span>AGELESS · PREMIUM STORE</span><strong>Entdecken, was<br/><em>zu Ihnen passt.</em></strong></div></div>
    </section>
    <section className="alv2-category-section" id="wissen" aria-labelledby="alv2-categories-heading">
      <div className="alv2-section-head"><div><span className="alv2-overline">UNSERE PRODUKTWELTEN</span><h2 id="alv2-categories-heading">Finden Sie Ihre Produktwelt.</h2></div><Link href="/shop">Alle Produkte ansehen <span aria-hidden="true">↗</span></Link></div>
      <div className="alv2-category-grid">{categories.map((item) => <Link href="/shop" className={`alv2-category-card alv2-category-${item.style}`} key={item.title}>
        <div className="alv2-category-photo" style={{backgroundImage:`url("${item.image}")`}} role="img" aria-label={item.title}/><div className="alv2-category-overlay"/><div className="alv2-category-content"><span>{item.eyebrow}</span><h3>{item.title}</h3><p>{item.text}</p><b>Produkte entdecken <span aria-hidden="true">→</span></b></div>
      </Link>)}</div>
    </section>
    <section className="alv2-products" aria-labelledby="alv2-products-heading">
      <div className="alv2-section-head"><div><span className="alv2-overline">AGELESS PRODUKTAUSWAHL</span><h2 id="alv2-products-heading">{offers.length ? "Aktuell im Shop." : "Entdecken Sie AgeLess."}</h2></div><Link href="/shop/angebote">Alle bestellbaren Angebote <span aria-hidden="true">↗</span></Link></div>
      {offers.length > 0 ? <div className="alv2-product-grid">{offers.map((item) => <article className="alv2-product-card" key={item.id}>
        <div className="alv2-product-art alv2-offer-art">{item.image_url ? <img className="alv2-offer-image" src={item.image_url} alt={item.name} loading="lazy" /> : <span className="alv2-offer-placeholder">AGELESS</span>}</div>
        <div className="alv2-product-info"><span>AGELESS / BESTELLBAR</span><h3>{item.name}</h3><p>{item.description ?? 'Alle Produktdetails und Bestellmöglichkeiten finden Sie im Shop.'}</p>
        <strong className="alv2-offer-price">{(item.price_cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</strong>
        <Link href="/shop/angebote">Angebot ansehen <span aria-hidden="true">↗</span></Link></div>
      </article>)}</div> : <div className="alv2-no-offers"><div><span className="alv2-overline">AGELESS SORTIMENT</span><h3>Ihre AgeLess Auswahl beginnt hier.</h3><p>Lernen Sie unsere Produktwelten kennen und entdecken Sie Informationen zu Inhaltsstoffen und Produktformen. Freigegebene Angebote werden hier angezeigt, sobald sie verfügbar sind.</p></div><Link className="alv2-gold-button" href="/shop">Produktwelt entdecken <span aria-hidden="true">→</span></Link></div>}
      <p className="alv2-product-disclaimer">Nur dokumentiert freigegebene Angebote sind bestellbar. Research-Produkte sind nicht zur Anwendung am Menschen bestimmt.</p>
    </section>
    <section className="alv2-standard" id="qualitaet"><div className="alv2-standard-heading"><span className="alv2-overline">UNSER VERSPRECHEN AN SIE</span><h2>Gut informiert.<br/><em>Bewusst entschieden.</em></h2><p>Entdecken Sie Produktinformationen, die Ihnen die Auswahl erleichtern – übersichtlich, nachvollziehbar und ohne unbelegte Versprechen.</p></div><div className="alv2-standard-grid"><article><span>01 / SCIENCE</span><h3>Produkte entdecken.</h3><p>Lernen Sie unser Sortiment und die Besonderheiten einzelner Produktwelten kennen.</p></article><article><span>02 / CLARITY</span><h3>Einfach vergleichen.</h3><p>Produktdetails und Hinweise unterstützen Ihre informierte Entscheidung.</p></article><article><span>03 / RESPONSIBILITY</span><h3>Transparent einkaufen.</h3><p>Nur dokumentiert freigegebene Angebote können bestellt werden.</p></article></div></section>
    <section className="alv2-end" id="ueber"><span className="alv2-overline">SCIENCE FOR A LONGER, BETTER LIFE</span><h2>Entdecken Sie AgeLess.<br/><em>In Ihrem Tempo.</em></h2><p>Entdecken Sie unsere Kollektionen und finden Sie Ihre Favoriten – mit klaren Informationen und einem modernen Einkaufserlebnis.</p><Link href="/shop/angebote" className="alv2-gold-button">Zum Shop <span aria-hidden="true">→</span></Link></section>
    <footer className="alv2-footer"><div className="alv2-footer-top"><Link href="/" aria-label="AgeLess Startseite"><img src="/ageless-logo.svg" alt="AgeLess"/></Link><nav aria-label="Footer-Navigation"><a href="#wissen">Produktwelten</a><a href="#qualitaet">Qualität</a><a href="#ueber">Über AgeLess</a><Link href="/shop/angebote">Shop</Link></nav></div><div className="alv2-footer-bottom"><span>© 2026 AgeLess · Science for a Longer, Better Life</span><span><Link href="/rechtliches/impressum">Impressum</Link> · <Link href="/rechtliches/datenschutz">Datenschutz</Link> · <Link href="/rechtliches/agb">AGB</Link> · <Link href="/rechtliches/widerruf">Widerruf</Link></span></div></footer>
  </main>;
}
