import Link from 'next/link';
import heroD1 from './_assets/heroD1';
import heroD2 from './_assets/heroD2';

const collections = [
  { number: '01', category: 'ESSENTIALS', title: 'Longevity Essentials', description: 'Aminosäuren, Vitamine und Grundlagen für eine bewusste Auseinandersetzung mit Longevity.', tags: ['L-Lysine', 'L-Proline', 'Vitamin B12'], theme: 'essentials' },
  { number: '02', category: 'SKIN SCIENCE', title: 'Peptide & Skin Science', description: 'Peptidforschung im kosmetischen Kontext — mit Blick auf Produktform und Einordnung.', tags: ['GHK-Cu', 'SNAP-8'], theme: 'skin' },
  { number: '03', category: 'RESEARCH', title: 'The Research Edit', description: 'Einblicke in Wirkstoffforschung und biochemische Zusammenhänge, ohne unbelegte Versprechen.', tags: ['NAD+', 'Research'], theme: 'research' },
];

const principles = [
  { n: '01', title: 'Wissenschaft zuerst.', text: 'Wir unterscheiden Forschung, Hinweise und belastbare Erkenntnisse.' },
  { n: '02', title: 'Klarheit statt Hype.', text: 'Wir benennen Produktform, Kontext und offene Fragen.' },
  { n: '03', title: 'Verantwortung im Detail.', text: 'Research-Inhalte sind keine Empfehlung zur Humananwendung.' },
];

export default function Home() {
  const hero = 'data:image/webp;base64,' + Buffer.from(heroD1 + heroD2, 'base64').toString('utf8');
  return (
    <main className="premium" id="top">
      <a className="premium-skip" href="#discover">Zum Inhalt springen</a>
      <div className="premium-topline"><span>AGELESS JOURNAL / SCIENCE MEETS LONGEVITY</span><span>EXPLORE THE POSSIBILITIES</span></div>
      <header className="premium-header">
        <Link href="/" className="premium-brand" aria-label="AgeLess Startseite"><img src="/ageless-logo.svg" alt="AgeLess — Science for a Longer, Better Life" /></Link>
        <nav className="premium-nav" aria-label="Hauptnavigation">
          <a href="#discover">Entdecken</a><a href="#philosophy">Philosophie</a><a href="#collections">Kollektionen</a><a href="#journal">Wissen</a>
        </nav>
        <Link href="/shop" className="premium-nav-action">Produktwelt <span aria-hidden="true">↗</span></Link>
        <details className="premium-mobile-menu"><summary aria-label="Menü öffnen"><span/><span/><span/></summary><nav aria-label="Mobiles Menü"><a href="#discover">Entdecken</a><a href="#philosophy">Philosophie</a><a href="#collections">Kollektionen</a><a href="#journal">Wissen</a><Link href="/shop">Produktwelt ansehen ↗</Link></nav></details>
      </header>

      <section className="premium-hero" id="discover" aria-labelledby="premium-hero-title">
        <div className="premium-hero-copy">
          <div className="premium-eyebrow"><span className="premium-gold-line"/> A NEW PERSPECTIVE ON LONGEVITY</div>
          <h1 id="premium-hero-title">Live longer.<br/><em>Live better.</em></h1>
          <p className="premium-hero-subtitle">Die Zukunft beginnt mit Neugier.</p>
          <p className="premium-hero-description">Entdecken Sie eine neue Perspektive auf Longevity, Peptide und moderne Wissenschaft. Sorgfältig kuratiert. Ästhetisch gedacht. Transparent eingeordnet.</p>
          <div className="premium-actions"><Link href="/shop" className="premium-button-primary">AgeLess entdecken <span aria-hidden="true">↗</span></Link><a href="#philosophy" className="premium-button-text">Unsere Philosophie <span aria-hidden="true">→</span></a></div>
          <div className="premium-hero-footnote"><span className="premium-footnote-dot"/> SCIENCE · CLARITY · CURIOSITY</div>
        </div>
        <div className="premium-hero-visual">
          <div className="premium-hero-photo" style={{ backgroundImage: `url("${hero}")` }} role="img" aria-label="Wissenschaftliche Longevity-Bildwelt"/>
          <div className="premium-hero-shine"/>
          <div className="premium-hero-vertical">AGELESS — SCIENCE FOR A LONGER, BETTER LIFE</div>
          <div className="premium-hero-card"><span>THE AGELESS PERSPECTIVE</span><strong>Curiosity<br/><em>is timeless.</em></strong><span className="premium-hero-card-line"/></div>
          <span className="premium-hero-counter">01 / 03</span>
        </div>
      </section>

      <div className="premium-signature"><span>THE ART OF LONGEVITY</span><i/><span>INSPIRED BY SCIENCE</span><i/><span>DESIGNED FOR DISCOVERY</span></div>

      <section className="premium-intro" id="philosophy">
        <div className="premium-section-mark"><span>01</span> THE AGELESS PHILOSOPHY</div>
        <div className="premium-intro-main"><h2>More than a trend.<br/><em>A new way to think.</em></h2><div className="premium-intro-side"><p>Longevity ist mehr als ein Versprechen. Es ist die Suche nach einem besseren Verständnis von Gesundheit, Biologie und Lebensqualität.</p><p>AgeLess macht diese faszinierende Welt zugänglich — mit wissenschaftlicher Neugier, gestalterischem Anspruch und einem bewussten Blick auf die Grenzen des Wissens.</p><a href="#journal" className="premium-inline-link">Unsere Prinzipien kennenlernen <span>↗</span></a></div></div>
      </section>

      <section className="premium-collections" id="collections">
        <div className="premium-collections-head"><div><div className="premium-section-mark"><span>02</span> CURATED EXPLORATION</div><h2>Explore the<br/><em>AgeLess universe.</em></h2></div><p>Drei Perspektiven. Eine gemeinsame Idee: Wissen mit Stil und Verantwortung entdecken.</p></div>
        <div className="premium-collection-grid">
          {collections.map((collection) => <article className={`premium-collection premium-collection-${collection.theme}`} key={collection.number}>
            <div className="premium-collection-art"><span className="premium-collection-index">{collection.number} / AGELESS</span><div className="premium-orbit"><div className="premium-orbit-inner"/><span>{collection.category === 'ESSENTIALS' ? 'A+' : collection.category === 'SKIN SCIENCE' ? 'P' : 'N+'}</span></div><span className="premium-collection-art-caption">SCIENCE / DISCOVERY</span></div>
            <div className="premium-collection-body"><span className="premium-category">{collection.category}</span><h3>{collection.title}</h3><p>{collection.description}</p><div className="premium-tags">{collection.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><Link href="/shop" className="premium-collection-link"><span>Kollektion entdecken</span><span aria-hidden="true">↗</span></Link></div>
          </article>)}
        </div>
        <p className="premium-collection-note">Die dargestellten Themen sind redaktionelle Einblicke, keine Kauf- oder Anwendungsempfehlungen. Produktverfügbarkeit und Zulässigkeit werden gesondert geprüft.</p>
      </section>

      <section className="premium-quote" aria-label="AgeLess Leitgedanke"><div className="premium-quote-deco">“</div><blockquote>Better questions.<br/><em>Brighter possibilities.</em></blockquote><span>THE AGELESS MINDSET</span></section>

      <section className="premium-journal" id="journal">
        <div className="premium-journal-head"><div className="premium-section-mark"><span>03</span> THE AGELESS STANDARD</div><h2>Inspired by science.<br/><em>Guided by clarity.</em></h2><p>Eine klare Haltung ist die Grundlage jeder Entdeckung. Deshalb machen wir sichtbar, was bekannt ist — und was noch offen bleibt.</p></div>
        <div className="premium-principles">{principles.map((principle) => <article key={principle.n}><span>{principle.n}</span><h3>{principle.title}</h3><p>{principle.text}</p></article>)}</div>
      </section>

      <section className="premium-final"><span className="premium-section-mark">WELCOME TO THE AGELESS WORLD</span><h2>Discover more.<br/><em>Become more curious.</em></h2><p>Wissen, Ästhetik und neue Perspektiven auf ein längeres, besseres Leben.</p><Link href="/shop" className="premium-button-primary">Produktwelt entdecken <span aria-hidden="true">↗</span></Link></section>

      <footer className="premium-footer"><div className="premium-footer-main"><Link href="/" aria-label="AgeLess Startseite"><img src="/ageless-logo.svg" alt="AgeLess" /></Link><div><a href="#philosophy">Philosophie</a><a href="#collections">Kollektionen</a><a href="#journal">Wissen</a><Link href="/shop">Produktwelt</Link></div></div><div className="premium-footer-bottom"><span>© 2026 AgeLess · Science for a Longer, Better Life</span><span>Wissenschaftliche Informationen · Keine medizinische Beratung</span></div></footer>
    </main>
  );
}
