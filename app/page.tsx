const modules = [
  ['Research & Due Diligence', 'Verified substance intelligence, regulatory context, sources and review status in one place.'],
  ['Inventory & Orders', 'Live stock visibility, order flow and auditable inventory movements from intake to sale.'],
  ['News & SEO', 'Research-backed multilingual content designed for discoverability around peptides and longevity.'],
  ['Social & Campaigns', 'Turn approved editorial content into channel-ready campaign concepts and creative briefs.'],
  ['AI Operations', 'Use natural-language instructions to propose controlled changes across products, content and settings.'],
  ['Governance', 'Keep evidence, compliance notes, approvals and change history connected to every important record.'],
];

const featured = [
  ['Research-first', 'Evidence & transparency', 'Every important product claim starts with documented research and review.'],
  ['Global-ready', 'Multilingual discovery', 'A content architecture built for international audiences and organic search.'],
  ['Operations', 'One connected system', 'Products, inventory, research, editorial and campaigns share the same foundation.'],
];

export default function Home() {
  return (
    <div className="page">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="AgeLess home">
          <span className="brand-mark" aria-hidden="true"><span className="helix helix-a" /><span className="helix helix-b" /></span>
          <span className="brand-name"><b>Age</b><em>Less</em><small>SCIENCE FOR A LONGER, BETTER LIFE</small></span>
        </a>
        <nav className="topnav" aria-label="Main navigation">
          <a href="#research">Research</a><a href="#products">Products</a><a href="#content">Knowledge</a><a href="#operations">Operations</a>
        </nav>
        <a className="top-cta" href="#contact">Explore AgeLess <span>→</span></a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="eyebrow light">VERIFIED LONGEVITY RESEARCH</div>
            <h1>Science today.<br /><span>Health tomorrow.</span></h1>
            <p>Evidence-led peptides, research products and knowledge for a longer, healthier and stronger life.</p>
            <div className="hero-actions"><a className="button primary" href="#products">Explore products <span>→</span></a><a className="button ghost" href="#research">Our research approach</a></div>
            <div className="trust-row"><span>✓ Research-led</span><span>✓ Transparent</span><span>✓ Compliance-aware</span></div>
          </div>
          <div className="hero-note"><span>AGELESS / 01</span><strong>Where science<br />meets responsibility.</strong></div>
        </section>

        <section className="intro" id="research">
          <div><div className="eyebrow">A NEW STANDARD</div><h2>Built around <span>evidence.</span></h2></div>
          <p>AgeLess brings research, product intelligence, commerce and content into one connected experience — designed to make complex longevity topics easier to understand and navigate.</p>
        </section>

        <section className="feature-grid" id="products">
          {featured.map(([label, title, copy], index) => (
            <article className="feature-card" key={title}>
              <div className="feature-number">0{index + 1}</div><div className="eyebrow">{label}</div><h3>{title}</h3><p>{copy}</p><span className="arrow">↗</span>
            </article>
          ))}
        </section>

        <section className="modules" id="operations">
          <div className="section-heading"><div><div className="eyebrow">THE AGELESS PLATFORM</div><h2>One foundation.<br /><span>Six connected capabilities.</span></h2></div><p>From product intake to research, inventory, editorial and campaign creation, the platform is designed to keep the complete operating picture connected.</p></div>
          <div className="module-grid">{modules.map(([title, description], index) => <article className="module-card" key={title}><div className="module-index">0{index + 1}</div><h3>{title}</h3><p>{description}</p><span className="module-arrow">→</span></article>)}</div>
        </section>

        <section className="statement" id="content">
          <div className="statement-image" />
          <div className="statement-copy"><div className="eyebrow">KNOWLEDGE / DISCOVERY / TRUST</div><h2>Longevity begins<br /><span>with knowledge.</span></h2><p>Our editorial layer turns reviewed research into clear, useful information — creating a durable knowledge base for customers, partners and organic discovery.</p><a className="text-link" href="#footer">Discover the knowledge platform <span>→</span></a></div>
        </section>
      </main>

      <footer className="footer" id="footer"><div className="footer-brand">Age<span>Less</span></div><p>Science for a longer, better life.</p><div className="footer-meta">Beta foundation · Research-led · Transparent by design</div></footer>
    </div>
  );
}
