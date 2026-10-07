const categories = [
  ['Peptide', 'Ausgewählte Research-Peptide mit klarer Einordnung zu Evidenz, Status und Verwendung.'],
  ['NAD+', 'Longevity-orientierte Research-Themen rund um Zellenergie, Redoxbalance und Stoffwechsel.'],
  ['Aminosäuren', 'Basisbausteine für Regeneration, Strukturproteine und biochemische Prozesse.'],
  ['Kosmetik', 'Peptidbasierte Wirkstoffkonzepte für kosmetische Anwendungen und moderne Hautpflege.'],
];

const highlights = [
  ['Research zuerst', 'Wir trennen belastbare Evidenz, präklinische Daten und Mechanismen sichtbar voneinander.'],
  ['Qualität sichtbar', 'Produktform, Einordnung und relevante Unsicherheiten bleiben Teil der Nutzererfahrung.'],
  ['Compliance klar', 'Research, Kosmetik, Supplement und Arzneimittel werden nicht vermischt.'],
];

const products = [
  ['GHK-Cu', 'Peptid / Kosmetik', 'KOSMETISCHE EINORDNUNG'],
  ['NAD+', '500 mg · Research', 'RESEARCH'],
  ['SNAP-8', 'Acetyl Octapeptide-3', 'KOSMETISCHE EINORDNUNG'],
];

export default function Home() {
  return (
    <main className="ag-home" id="top">
      <header className="ag-header">
        <a href="#top" className="ag-brand" aria-label="AgeLess">
          <img src="/ageless-logo.svg" alt="AgeLess — Science for a Longer, Better Life" />
        </a>
        <nav className="ag-nav" aria-label="Hauptnavigation">
          <a href="#produkte">Produkte</a>
          <a href="#longevity">Longevity Wissen</a>
          <a href="#research">Research</a>
          <a href="#compliance">Compliance</a>
          <a href="#kontakt">Kontakt</a>
        </nav>
        <a href="/shop" className="ag-shop-link">Shop <span>→</span></a>
      </header>

      <section className="ag-hero">
        <div className="ag-hero-image" />
        <div className="ag-hero-shade" />
        <div className="ag-hero-content">
          <div className="ag-kicker">AGELESS · LONGEVITY · PEPTIDE RESEARCH</div>
          <h1>Longevity beginnt<br/><span>mit Wissenschaft.</span></h1>
          <p>
            AgeLess verbindet moderne Longevity-Themen mit einer kuratierten Auswahl hochwertiger
            Peptide, Research-Wirkstoffe und klarer wissenschaftlicher Einordnung.
          </p>
          <div className="ag-actions">
            <a href="/shop" className="ag-btn ag-btn-gold">Produkte entdecken <span>→</span></a>
            <a href="#longevity" className="ag-btn ag-btn-ghost">Longevity entdecken</a>
          </div>
          <div className="ag-trust">
            <span>Wissenschaftlich orientiert</span>
            <span>Transparent eingeordnet</span>
            <span>Premium kuratiert</span>
          </div>
        </div>

        <div className="ag-hero-visual-stack" aria-label="AgeLess Research Highlights">
          <aside className="ag-feature-card">
            <span className="ag-mini">FEATURED RESEARCH</span>
            <strong>NAD+ <small>500 mg</small></strong>
            <p>Energy metabolism · cellular function · redox balance</p>
            <div className="ag-feature-meta">
              <span>RESEARCH USE ONLY</span>
              <span>STATUS VISIBLE</span>
            </div>
            <a href="/shop">Research entdecken <span>↗</span></a>
          </aside>
          <div className="ag-proof-card">
            <span>AGELESS STANDARD</span>
            <strong>Legalität · Evidenz · Preise · Risiken</strong>
            <small>Klare Einordnung vor Vermarktung.</small>
          </div>
        </div>
      </section>

      <section className="ag-signature">
        <div className="ag-signature-copy">
          <span>AGELESS / PREMIUM BETA</span>
          <strong>Research wird nicht versteckt. Es wird Teil des Designs.</strong>
        </div>
        <div className="ag-signature-points">
          <span>Official sources preferred</span>
          <span>Research Use Only ≠ Humananwendung</span>
          <span>Keine Heilversprechen</span>
        </div>
      </section>

      <section className="ag-category-strip" id="produkte">
        <div className="ag-strip-head">
          <span>Produktwelt</span>
          <strong>Ausgewählte Kategorien rund um Longevity und Peptide.</strong>
        </div>
        <div className="ag-category-grid">
          {categories.map(([title, text], i) => (
            <article key={title} className="ag-category-card">
              <span className="ag-index">0{i + 1}</span>
              <h2>{title}</h2>
              <p>{text}</p>
              <a href="/shop">Entdecken <span>→</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="ag-story" id="longevity">
        <div className="ag-story-copy">
          <span className="ag-section-label">LONGEVITY WISSEN</span>
          <h2>Ein längeres Leben ist nur dann wertvoll,<br/><em>wenn es ein besseres Leben ist.</em></h2>
          <p className="ag-lead">
            Longevity verbindet Forschung zu Zellfunktion, Regeneration, Stoffwechsel und gesundem Altern.
            AgeLess macht relevante Themen verständlich und trennt wissenschaftliche Erkenntnis von Marketing-Hype.
          </p>
          <p>
            Unser Fokus liegt auf klarer Einordnung: Was ist gut belegt? Was ist vielversprechend? Wo bestehen
            Unsicherheiten? Diese Transparenz ist ein Kern der Marke.
          </p>
        </div>
        <div className="ag-story-visual">
          <div className="ag-story-orb" />
          <div className="ag-story-panel">
            <span>AGELESS STANDARD</span>
            <strong>Evidence before hype.</strong>
            <p>Jede Aussage soll nachvollziehbar, differenziert und angemessen eingeordnet sein.</p>
          </div>
        </div>
      </section>

      <section className="ag-research" id="research">
        <div className="ag-section-head">
          <div>
            <span className="ag-section-label">RESEARCH & QUALITÄT</span>
            <h2>Vertrauen entsteht,<br/><em>wenn Details sichtbar werden.</em></h2>
          </div>
          <p>
            Moderne Longevity-Produkte brauchen mehr als gutes Design. Entscheidend sind klare Produktinformationen,
            transparente Einordnung und ein verantwortungsvoller Umgang mit wissenschaftlicher Evidenz.
          </p>
        </div>
        <div className="ag-highlight-grid">
          {highlights.map(([title, text], i) => (
            <article key={title}>
              <span>0{i + 1}</span>
              <div className="ag-line" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ag-products">
        <div className="ag-section-head compact">
          <div>
            <span className="ag-section-label">AUSWAHL</span>
            <h2>Peptide & Longevity<br/><em>im Fokus.</em></h2>
          </div>
          <a className="ag-text-link" href="/shop">Alle Produkte ansehen <span>→</span></a>
        </div>
        <div className="ag-product-grid">
          {products.map(([name, meta, status]) => (
            <article className="ag-product-card" key={name}>
              <div className="ag-product-visual">
                <div className="ag-halo" />
                <div className="ag-vial">
                  <small>AGELESS</small>
                  <strong>{name}</strong>
                  <span>RESEARCH</span>
                </div>
              </div>
              <div className="ag-product-body">
                <span className="ag-product-status">{status}</span>
                <h3>{name}</h3>
                <p>{meta}</p>
                <a href="/shop">Details ansehen <span>↗</span></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ag-compliance" id="compliance">
        <div className="ag-compliance-image" />
        <div className="ag-compliance-copy">
          <span className="ag-section-label light">COMPLIANCE CENTER</span>
          <h2>Klarheit ist<br/><em>Teil der Qualität.</em></h2>
          <p>
            AgeLess trennt Research, Kosmetik, Nahrungsergänzung und arzneiliche Einordnung konsequent.
            Research Use Only bedeutet keine Humananwendung. Unsicherheiten werden sichtbar markiert statt übergangen.
          </p>
          <div className="ag-compliance-grid">
            <div><span>01</span><strong>Offizielle Quellen bevorzugt</strong></div>
            <div><span>02</span><strong>Keine Heilversprechen</strong></div>
            <div><span>03</span><strong>Produktform klar benannt</strong></div>
            <div><span>04</span><strong>Unsicherheit transparent</strong></div>
          </div>
        </div>
      </section>

      <section className="ag-closing" id="kontakt">
        <img src="/ageless-logo.svg" alt="AgeLess" />
        <span className="ag-section-label">SCIENCE FOR A LONGER, BETTER LIFE</span>
        <h2>Mehr Wissen. Mehr Klarheit.<br/><em>Mehr Zukunft.</em></h2>
        <p>
          Entdecken Sie die AgeLess Produktwelt und aktuelle Themen rund um Peptide, Longevity und wissenschaftlich
          orientierte Gesundheitsoptimierung.
        </p>
        <a href="/shop" className="ag-btn ag-btn-navy">Produkte entdecken <span>→</span></a>
      </section>

      <footer className="ag-footer">
        <span>© 2026 AgeLess</span>
        <span>Science for a longer, better life.</span>
        <span>Research Use Only where applicable · No medical advice</span>
      </footer>
    </main>
  );
}
