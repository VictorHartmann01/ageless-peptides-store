const principles = [
  ['01', 'Evidence before hype', 'Research context, source discipline and review status stay close to every product decision.'],
  ['02', 'Curated discovery', 'A deliberately focused experience designed to make a complex longevity category feel calm and understandable.'],
  ['03', 'Built for trust', 'A premium foundation for products, knowledge, customer journeys and future intelligent operations.'],
];

const layers = [
  ['Discover', 'A refined entry point into longevity and peptide research.'],
  ['Understand', 'Clear context instead of overwhelming claims and noise.'],
  ['Evaluate', 'Structured information designed to support responsible decisions.'],
  ['Connect', 'A platform foundation ready for commerce, content and community.'],
];

export default function Home() {
  return (
    <div className="hl-page">
      <header className="hl-nav">
        <a className="hl-logo-link" href="#top" aria-label="AgeLess home">
          <img src="/ageless-logo.svg" alt="AgeLess — Science for a Longer, Better Life" className="hl-logo" />
        </a>
        <nav className="hl-links">
          <a href="#approach">Approach</a><a href="#platform">Platform</a><a href="/shop">Catalog</a><a href="#vision">Vision</a>
        </nav>
        <a className="hl-nav-cta" href="/shop">Explore AgeLess <span>↗</span></a>
      </header>

      <main id="top">
        <section className="hl-hero">
          <div className="hl-hero-copy">
            <div className="hl-kicker">AGELESS / LONGEVITY INTELLIGENCE</div>
            <h1>Live longer.<br /><em>Know better.</em></h1>
            <p className="hl-hero-lead">A premium longevity platform turning emerging science, peptide research and product intelligence into a clearer, more responsible experience.</p>
            <div className="hl-actions">
              <a className="hl-button hl-button-dark" href="/shop">Explore the research catalog <span>→</span></a>
              <a className="hl-button hl-button-light" href="#approach">Discover our approach</a>
            </div>
            <div className="hl-micro-trust"><span><i>01</i> Research-led</span><span><i>02</i> Curated</span><span><i>03</i> Built for trust</span></div>
          </div>
          <div className="hl-hero-visual">
            <div className="hl-photo-main" />
            <div className="hl-floating-card"><span>AGELESS / 2026</span><strong>Science for a<br />longer, better life.</strong><small>Research · Knowledge · Products</small></div>
            <div className="hl-orbit hl-orbit-one" /><div className="hl-orbit hl-orbit-two" />
          </div>
        </section>

        <section className="hl-ticker"><span>LONGEVITY</span><b>·</b><span>PEPTIDE RESEARCH</span><b>·</b><span>KNOWLEDGE</span><b>·</b><span>RESPONSIBLE DISCOVERY</span><b>·</b><span>PREMIUM EXPERIENCE</span></section>

        <section className="hl-intro" id="approach">
          <div className="hl-intro-label"><span>OUR APPROACH</span><div className="hl-line" /></div>
          <div className="hl-intro-copy">
            <h2>Longevity is moving fast.<br /><em>Trust has to move faster.</em></h2>
            <div className="hl-intro-text"><p>AgeLess is designed for people who want to understand what is emerging without losing sight of evidence, context and responsibility.</p><p>We build around clarity first: better information, deliberate curation and a premium interface that makes sophisticated science easier to navigate.</p></div>
          </div>
        </section>

        <section className="hl-signals">
          {principles.map(([number,title,copy]) => <article className="hl-signal" key={number}><span>{number}</span><div className="hl-signal-rule" /><h3>{title}</h3><p>{copy}</p></article>)}
        </section>

        <section className="hl-feature" id="platform">
          <div className="hl-feature-image"><div className="hl-feature-badge"><span>AGELESS</span><strong>Research<br />meets design.</strong></div></div>
          <div className="hl-feature-copy">
            <div className="hl-kicker">ONE CONNECTED EXPERIENCE</div>
            <h2>From curiosity<br />to <em>clarity.</em></h2>
            <p className="hl-feature-lead">AgeLess brings the layers of longevity discovery together in one coherent platform — designed for today, structured for what comes next.</p>
            <div className="hl-layer-list">{layers.map(([title,copy],i) => <div className="hl-layer" key={title}><span>0{i+1}</span><strong>{title}</strong><p>{copy}</p><i>↗</i></div>)}</div>
          </div>
        </section>

        <section className="hl-catalog-callout">
          <div><div className="hl-kicker">RESEARCH CATALOG</div><h2>A quieter way to explore<br /><em>a noisy category.</em></h2></div>
          <div className="hl-catalog-copy"><p>Explore the current AgeLess research catalog with product states and context kept visible. The experience is intentionally selective rather than overwhelming.</p><a className="hl-text-link" href="/shop">Enter the research catalog <span>→</span></a></div>
        </section>

        <section className="hl-vision" id="vision">
          <div className="hl-vision-glow" />
          <div className="hl-vision-inner"><span className="hl-kicker hl-kicker-light">THE AGELESS VISION</span><h2>Not another store.<br /><em>A longevity platform.</em></h2><p>AgeLess is being built as a trusted premium layer between emerging longevity science and the people who want to understand it — with room to grow into commerce, knowledge, community and intelligent operations.</p><div className="hl-vision-stats"><div><span>01</span><strong>Premium consumer experience</strong></div><div><span>02</span><strong>Research-first foundation</strong></div><div><span>03</span><strong>Scalable platform architecture</strong></div></div></div>
        </section>

        <section className="hl-final"><img src="/ageless-logo.svg" alt="AgeLess" className="hl-final-logo" /><h2>The future of longevity<br />should feel <em>clearer.</em></h2><a className="hl-button hl-button-dark" href="/shop">Explore AgeLess <span>→</span></a></section>
      </main>
      <footer className="hl-footer"><span>© 2026 AgeLess</span><span>Science for a longer, better life.</span><span>Research-led · Transparent by design</span></footer>
    </div>
  );
}
