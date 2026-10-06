const pillars = [
  ['01', 'Research intelligence', 'Evidence, sources, review status and regulatory context form the decision layer behind the platform.'],
  ['02', 'Connected commerce', 'A premium product experience designed to connect discovery, product data and future commerce flows.'],
  ['03', 'Knowledge engine', 'Research-led editorial turns complex longevity topics into clear, discoverable knowledge.'],
  ['04', 'Operating system', 'Products, research, content, inventory and campaigns are designed around one shared foundation.'],
];

const capabilities = [
  ['Research', 'Evidence-led product and substance intelligence.'],
  ['Products', 'Premium product discovery and structured product data.'],
  ['Knowledge', 'Multilingual content architecture for durable organic discovery.'],
  ['Operations', 'Connected workflows across the AgeLess platform.'],
  ['AI', 'Controlled natural-language operations with human oversight.'],
  ['Governance', 'Approvals, evidence, compliance context and change history.'],
];

const roadmap = [
  ['NOW', 'Beta foundation', 'Premium experience, connected infrastructure, research-first architecture and production deployment.'],
  ['NEXT', 'Platform depth', 'Product intelligence, knowledge workflows, operational data and deeper Supabase integration.'],
  ['SCALE', 'Growth system', 'Commerce, content, research and AI operations connected into a scalable longevity platform.'],
];

export default function Home() {
  return (
    <div className="page">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="AgeLess home">
          <img className="brand-logo" src="/ageless-logo.svg" alt="AgeLess — Science for a Longer, Better Life" />
        </a>
        <nav className="topnav" aria-label="Main navigation">
          <a href="#thesis">Thesis</a>
          <a href="#platform">Platform</a>
          <a href="/shop">Research Catalog</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="top-cta" href="/shop">Research Catalog <span>→</span></a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="eyebrow light">AGELESS / INVESTOR BETA</div>
            <h1>Science today.<br /><span>A platform for what comes next.</span></h1>
            <p>AgeLess is building a research-first longevity platform connecting evidence, products, knowledge and operations in one premium experience.</p>
            <div className="hero-actions">
              <a className="button primary" href="#thesis">Explore the thesis <span>→</span></a>
              <a className="button ghost" href="#platform">View the platform</a>
            </div>
            <div className="trust-row"><span>✓ Research-led</span><span>✓ Transparent</span><span>✓ Governance-aware</span></div>
          </div>
          <div className="hero-note"><span>BETA / 01</span><strong>Where science<br />meets responsibility.</strong></div>
        </section>

        <section className="investor-strip" aria-label="Investor snapshot">
          <div><span>BUILD STATUS</span><strong>Production beta</strong></div>
          <div><span>CORE MODEL</span><strong>Research → Knowledge → Product</strong></div>
          <div><span>FOUNDATION</span><strong>Next.js · Vercel · Supabase</strong></div>
          <div><span>POSITIONING</span><strong>Premium longevity platform</strong></div>
        </section>

        <section className="thesis" id="thesis">
          <div className="section-kicker">THE INVESTMENT THESIS</div>
          <div className="thesis-grid">
            <h2>Build trust first.<br /><span>Then build scale.</span></h2>
            <div>
              <p className="lead">Longevity is a high-information category. AgeLess is designed around the idea that durable value comes from making evidence easier to navigate — then connecting that intelligence to products, content and operations.</p>
              <p>Rather than treating commerce, research and editorial as separate destinations, the beta establishes a single foundation that can compound as the platform grows.</p>
            </div>
          </div>
        </section>

        <section className="pillar-grid">
          {pillars.map(([number, title, copy]) => (
            <article className="pillar-card" key={title}>
              <div className="pillar-top"><span>{number}</span><span>AGELESS</span></div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span className="card-arrow">↗</span>
            </article>
          ))}
        </section>

        <section className="platform" id="platform">
          <div className="section-heading">
            <div>
              <div className="section-kicker">ONE CONNECTED PLATFORM</div>
              <h2>Six capabilities.<br /><span>One operating picture.</span></h2>
            </div>
            <p>The beta architecture is intentionally modular: each capability can become deeper without breaking the shared research, product and governance foundation.</p>
          </div>
          <div className="capability-grid">
            {capabilities.map(([title, copy], index) => (
              <article className="capability-card" key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <i>→</i>
              </article>
            ))}
          </div>
        </section>

        <section className="proof">
          <div className="proof-image" />
          <div className="proof-copy">
            <div className="section-kicker">THE AGELESS ADVANTAGE</div>
            <h2>Make complexity<br /><span>feel simple.</span></h2>
            <div className="proof-list">
              <div><b>Evidence layer</b><span>Research and source context stay close to the product and content experience.</span></div>
              <div><b>Shared foundation</b><span>A common data and operating model reduces fragmentation as capabilities expand.</span></div>
              <div><b>Premium interface</b><span>Trust is reinforced through clarity, restraint and a high-quality customer experience.</span></div>
            </div>
          </div>
        </section>

        <section className="roadmap" id="roadmap">
          <div className="section-kicker">BUILDING THE PLATFORM</div>
          <div className="roadmap-head"><h2>From beta foundation<br /><span>to category platform.</span></h2><p>The roadmap is staged to compound the same core asset: a trusted, connected longevity knowledge and commerce layer.</p></div>
          <div className="roadmap-grid">
            {roadmap.map(([phase, title, copy], index) => (
              <article key={phase} className="roadmap-card">
                <span>{phase}</span><div className="roadmap-line" /><strong>0{index + 1}</strong>
                <h3>{title}</h3><p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="closing" id="contact">
          <div className="closing-glow" />
          <div className="section-kicker light">AGELESS / INVESTOR BETA</div>
          <h2>A longer, better life<br /><span>starts with better information.</span></h2>
          <p>AgeLess is building the infrastructure for that information — and the products, knowledge and operations around it.</p>
          <a className="button primary" href="mailto:vhartmann@e-valuate.biz">Discuss the opportunity <span>→</span></a>
        </section>
      </main>

      <footer className="footer" id="footer">
        <img className="footer-logo" src="/ageless-logo.svg" alt="AgeLess — Science for a Longer, Better Life" />
        <p>Science for a longer, better life.</p>
        <div className="footer-meta">Investor beta · Research-led · Transparent by design</div>
      </footer>
    </div>
  );
}
