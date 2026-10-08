import Link from 'next/link';
const hero = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1800&q=85';

const categories = [
  { title: 'Peptide & Forschung', eyebrow: 'WIRKSTOFFWELTEN', text: 'Entdecken Sie die wissenschaftlichen Hintergründe der Peptidforschung.', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=82', style: 'science' },
  { title: 'NAD+ & Longevity', eyebrow: 'ZELLBIOLOGIE', text: 'Wissenswertes über Zellstoffwechsel, Forschung und Longevity.', image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=82', style: 'nad' },
  { title: 'Essentials & Wissen', eyebrow: 'GRUNDLAGEN', text: 'Aminosäuren, Vitamine und bewusstes Verständnis von Inhaltsstoffen.', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=82', style: 'nature' },
];

const features = [
  { number: '01', label: 'NAD+', group: 'Zellbiologie & Forschung', text: 'Einblicke in die Rolle von Nicotinamidadenindinukleotid.' },
  { number: '02', label: 'GHK-Cu', group: 'Peptidforschung', text: 'Forschungswissen rund um ein kupferbindendes Peptid.' },
  { number: '03', label: 'L-Proline', group: 'Aminosäuren', text: 'Grundlagenwissen zu einer proteinogenen Aminosäure.' },
  { number: '04', label: 'Vitamin B12', group: 'Essentielle Nährstoffe', text: 'Einordnung eines wichtigen Vitamins im Nährstoffkontext.' },
];

export default function Home() {
  return <main className="alv2" id="top">
    <a className="alv2-skip" href="#main-content">Zum Inhalt springen</a>
    <div className="alv2-trustbar"><span>WISSENSCHAFT IM FOKUS</span><i/><span>TRANSPARENT INFORMIERT</span><i/><span>VERANTWORTUNGSBEWUSST</span><span className="alv2-trustbar-right">AGELESS · LONGEVITY & SCIENCE</span></div>
    <header className="alv2-header">
      <Link className="alv2-logo" href="/" aria-label="AgeLess Startseite"><img src="/ageless-logo.svg" alt="AgeLess – Science for a Longer, Better Life" /></Link>
      <nav className="alv2-nav" aria-label="Hauptnavigation"><a className="alv2-nav-active" href="#top">Home</a><Link href="/shop">Produkte</Link><a href="#wissen">Longevity Wissen</a><a href="#qualitaet">Qualität</a><a href="#ueber">Über AgeLess</a></nav>
      <Link className="alv2-nav-shop" href="/shop">Produktwelt <span aria-hidden="true">↗</span></Link>
      <details className="alv2-mobile-menu"><summary aria-label="Menü öffnen"><span/><span/><span/></summary><nav aria-label="Mobile Navigation"><a href="#top">Home</a><Link href="/shop">Produkte</Link><a href="#wissen">Longevity Wissen</a><a href="#qualitaet">Qualität</a><a href="#ueber">Über AgeLess</a></nav></details>
    </header>
    <section className="alv2-hero" id="main-content" aria-labelledby="alv2-title">
      <div className="alv2-hero-copy">
        <p className="alv2-eyebrow">FORSCHUNG. TRANSPARENZ. VERANTWORTUNG.</p>
        <h1 id="alv2-title">Longevity beginnt<br/>mit <em>Wissen.</em></h1>
        <p className="alv2-hero-lead">Mehr Perspektiven. Mehr Neugier. Mehr Du.</p>
        <p className="alv2-hero-description">Entdecken Sie die Welt von Peptiden, NAD+ und Longevity – klar erklärt, wissenschaftlich eingeordnet und mit einem besonderen Anspruch an Ästhetik und Transparenz.</p>
        <div className="alv2-hero-actions"><Link className="alv2-gold-button" href="/shop">Jetzt entdecken <span aria-hidden="true">→</span></Link><a className="alv2-hero-link" href="#ueber">AgeLess kennenlernen ↗</a></div>
        <div className="alv2-hero-proof"><span><b aria-hidden="true">◇</b> Wissenschaft im Fokus</span><span><b aria-hidden="true">✧</b> Transparent erklärt</span><span><b aria-hidden="true">♧</b> Bewusst entdecken</span></div>
      </div>
      <div className="alv2-hero-media"><div className="alv2-hero-photo" style={{backgroundImage:`url("${hero}")`}} role="img" aria-label="Menschen im Freien – Gesundheit und Lebensqualität"/><div className="alv2-hero-photo-shade"/><div className="alv2-hero-quote"><span>AGELESS PERSPECTIVE</span><strong>Wissen öffnet<br/><em>neue Horizonte.</em></strong></div></div>
    </section>
    <section className="alv2-category-section" id="wissen" aria-labelledby="alv2-categories-heading">
      <div className="alv2-section-head"><div><span className="alv2-overline">ENTDECKEN SIE DIE AGELESS WELT</span><h2 id="alv2-categories-heading">Wissen, das inspiriert.</h2></div><Link href="/shop">Alle Themen entdecken <span aria-hidden="true">↗</span></Link></div>
      <div className="alv2-category-grid">{categories.map((item) => <Link href="/shop" className={`alv2-category-card alv2-category-${item.style}`} key={item.title}>
        <div className="alv2-category-photo" style={{backgroundImage:`url("${item.image}")`}} role="img" aria-label={item.title}/><div className="alv2-category-overlay"/><div className="alv2-category-content"><span>{item.eyebrow}</span><h3>{item.title}</h3><p>{item.text}</p><b>Mehr erfahren <span aria-hidden="true">→</span></b></div>
      </Link>)}</div>
    </section>
    <section className="alv2-products" aria-labelledby="alv2-products-heading">
      <div className="alv2-section-head"><div><span className="alv2-overline">AUS DER AGELESS WISSENSWELT</span><h2 id="alv2-products-heading">Im Fokus der Forschung.</h2></div><Link href="/shop">Gesamten Katalog ansehen <span aria-hidden="true">↗</span></Link></div>
      <div className="alv2-product-grid">{features.map((item) => <article className="alv2-product-card" key={item.label}><div className="alv2-product-art"><span className="alv2-product-index">{item.number} / AGELESS</span><div className="alv2-product-bottle"><div className="alv2-bottle-cap"/><div className="alv2-bottle-glass"><div className="alv2-bottle-label"><small>AGELESS</small><strong>{item.label}</strong><span>SCIENCE / RESEARCH</span></div></div></div></div><div className="alv2-product-info"><span>{item.group}</span><h3>{item.label}</h3><p>{item.text}</p><Link href="/shop">Wissen entdecken <span aria-hidden="true">↗</span></Link></div></article>)}</div>
      <p className="alv2-product-disclaimer">Illustrative Produktwelt und redaktionelle Forschungsinformationen. Keine Kauf- oder Anwendungsempfehlung; eine Verkaufsfreigabe wird für jedes Produkt gesondert geprüft.</p>
    </section>
    <section className="alv2-standard" id="qualitaet"><div className="alv2-standard-heading"><span className="alv2-overline">DER AGELESS ANSPRUCH</span><h2>Vertrauen beginnt<br/>mit <em>Transparenz.</em></h2><p>Wir möchten Wissenschaft verständlich und verantwortungsvoll zugänglich machen – ohne Abkürzungen, ohne unbelegte Versprechen.</p></div><div className="alv2-standard-grid"><article><span>01 / SCIENCE</span><h3>Wissen statt Hype.</h3><p>Forschung verständlich einordnen und ihre Grenzen offen benennen.</p></article><article><span>02 / CLARITY</span><h3>Klarheit im Detail.</h3><p>Produktformen, Hintergründe und regulatorische Fragen sichtbar machen.</p></article><article><span>03 / RESPONSIBILITY</span><h3>Verantwortung zuerst.</h3><p>Research-Themen sind keine Empfehlung zur Anwendung am Menschen.</p></article></div></section>
    <section className="alv2-end" id="ueber"><span className="alv2-overline">SCIENCE FOR A LONGER, BETTER LIFE</span><h2>Eine neue Perspektive<br/><em>auf Longevity.</em></h2><p>AgeLess verbindet Neugier, wissenschaftliches Wissen und eine moderne Form der Produktkommunikation.</p><Link href="/shop" className="alv2-gold-button">AgeLess entdecken <span aria-hidden="true">→</span></Link></section>
    <footer className="alv2-footer"><div className="alv2-footer-top"><Link href="/" aria-label="AgeLess Startseite"><img src="/ageless-logo.svg" alt="AgeLess"/></Link><nav aria-label="Footer-Navigation"><a href="#wissen">Wissen</a><a href="#qualitaet">Qualität</a><a href="#ueber">Über AgeLess</a><Link href="/shop">Produktwelt</Link></nav></div><div className="alv2-footer-bottom"><span>© 2026 AgeLess · Science for a Longer, Better Life</span><span>Redaktionelle Informationen · Keine medizinische Beratung</span></div></footer>
  </main>;
}
