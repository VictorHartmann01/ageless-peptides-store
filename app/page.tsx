const products = [
  ['L-Lysine','Amino acid / supplement','LEGAL / FORMULIERUNGSPRÜFUNG'],
  ['L-Proline','Amino acid / supplement','LEGAL / FORMULIERUNGSPRÜFUNG'],
  ['Vitamin B12','10 ml · Produktform unklar','LEGAL / FORMULIERUNGSPRÜFUNG'],
  ['GHK-Cu','50 / 100 mg','BEDINGT LEGAL — KOSMETIK'],
  ['SNAP-8','10 ml · Acetyl Octapeptide-3','BEDINGT LEGAL — KOSMETIK'],
  ['NAD+','500 mg · Research','BEDINGT / FORM OFFEN'],
];

const standards = [
  ['01','Legalität sichtbar machen','Lebensmittel, Kosmetik, Arzneimittel und Research werden klar nach Verwendungszweck getrennt.'],
  ['02','Evidenz von Marketing trennen','Humanstudien, präklinische Daten und reine Mechanismen werden nicht vermischt.'],
  ['03','Risiken nicht verstecken','Fehlende Zulassung, Produktform, Fälschungsrisiko und Unsicherheiten bleiben sichtbar.'],
];

export default function Home() {
  return (
    <div className="deck-page">
      <header className="deck-header">
        <a href="#top" className="deck-logo-link" aria-label="AgeLess">
          <img src="/ageless-logo.svg" alt="AgeLess — Science for a Longer, Better Life" className="deck-logo" />
        </a>
        <nav className="deck-nav">
          <a href="#research">Research</a>
          <a href="#catalog">Produkte</a>
          <a href="#standard">Standard</a>
          <a href="/shop">Store Beta</a>
        </nav>
        <a href="/shop" className="deck-header-cta">Research Catalog <span>→</span></a>
      </header>

      <main id="top">
        <section className="lux-hero">
          <div className="lux-backdrop" />
          <div className="lux-overlay" />
          <div className="lux-hero-inner">
            <div className="lux-copy">
              <div className="lux-eyebrow"><span>PRIVATE BETA</span><b>2026</b></div>
              <div className="deck-kicker lux-kicker">PEPTIDE / NAD+ / LONGEVITY RESEARCH</div>
              <h1>Science for a<br/><span>longer, better life.</span></h1>
              <p>Premium Longevity Research mit sichtbarer Evidenz, klarer regulatorischer Einordnung und einer kuratierten Produktwelt.</p>
              <div className="deck-actions lux-actions">
                <a href="/shop" className="deck-btn lux-primary">Produkte entdecken <span>→</span></a>
                <a href="#research" className="deck-btn lux-secondary">AgeLess entdecken</a>
              </div>
              <div className="lux-proof">
                <span><i>01</i> Research-led</span>
                <span><i>02</i> Transparent</span>
                <span><i>03</i> Premium curated</span>
              </div>
            </div>
            <aside className="lux-card">
              <span>AGELESS / FEATURED RESEARCH</span>
              <strong>NAD+ 500 mg</strong>
              <p>Energy metabolism · cellular function · redox balance</p>
              <div className="lux-card-foot"><b>Research Use Only</b><a href="/shop">View record ↗</a></div>
            </aside>
          </div>
        </section>

        <section className="deck-status">
          <div><span>MARKENKERN</span><strong>Science + Premium Experience</strong></div>
          <div><span>FOKUS</span><strong>Peptides · NAD+ · Longevity</strong></div>
          <div><span>PRINZIP</span><strong>Evidence before marketing</strong></div>
          <div><span>BETA</span><strong>Erste Kunden · Plattform im Aufbau</strong></div>
        </section>

        <section className="deck-research" id="research">
          <div className="deck-section-label">WARUM AGELESS</div>
          <div className="deck-research-head">
            <h2>Premium wirkt nur,<br/><span>wenn Vertrauen sichtbar ist.</span></h2>
            <div>
              <p className="deck-lead">AgeLess soll nicht wie ein beliebiger Supplement- oder Peptide-Shop wirken. Die Marke verbindet eine hochwertige visuelle Welt mit einer nachvollziehbaren Research-Systematik.</p>
              <p>Genau deshalb werden Produktform, regulatorischer Status, Evidenz und Risiko nicht in Marketingtexten versteckt, sondern Teil der Nutzererfahrung.</p>
            </div>
          </div>
          <div className="deck-standards">
            {standards.map(([n,t,c]) => <article key={n}><span>{n}</span><div className="deck-rule"/><h3>{t}</h3><p>{c}</p></article>)}
          </div>
        </section>

        <section className="deck-catalog" id="catalog">
          <div className="deck-catalog-head">
            <div><div className="deck-section-label">AUS DEM AKTUELLEN RESEARCH DECK</div><h2>Substanzen.<br/><span>Sauber eingeordnet.</span></h2></div>
            <p>Die Beta zeigt zuerst die klarer einordenbaren Kategorien und Research-Objekte. Jede Karte macht den Status sichtbar, statt ihn hinter Werbeaussagen zu verstecken.</p>
          </div>
          <div className="deck-products">
            {products.map(([name,meta,status],i)=><article className="deck-product" key={name}>
              <div className="deck-product-visual">
                <div className="deck-vial">
                  <small>AGELESS</small>
                  <strong>{name}</strong>
                  <span>RESEARCH</span>
                </div>
              </div>
              <div className="deck-product-body">
                <div className="deck-product-meta"><span>0{i+1}</span><em>{status}</em></div>
                <h3>{name}</h3>
                <p>{meta}</p>
                <a href="/shop">Research Record <span>↗</span></a>
              </div>
            </article>)}
          </div>
        </section>

        <section className="deck-standard" id="standard">
          <div className="deck-standard-image"/>
          <div className="deck-standard-copy">
            <div className="deck-section-label light">AGELESS / STANDARD</div>
            <h2>Research first.<br/><span>Commerce only when justified.</span></h2>
            <p>Research Use Only ist keine Humananwendung. Kosmetik bleibt Kosmetik. Supplements bleiben Lebensmittel. Genau diese Trennung ist Teil des Produkterlebnisses — nicht nur ein Hinweis im Kleingedruckten.</p>
            <div className="deck-standard-grid">
              <div><span>01</span><strong>Offizielle Quellen bevorzugt</strong></div>
              <div><span>02</span><strong>Keine Heilversprechen</strong></div>
              <div><span>03</span><strong>Produktform sichtbar</strong></div>
              <div><span>04</span><strong>Unsicherheit markieren</strong></div>
            </div>
          </div>
        </section>

        <section className="deck-final">
          <img src="/ageless-logo.svg" alt="AgeLess" />
          <div className="deck-section-label">PUBLIC BETA</div>
          <h2>Ein Premium-Zwischenziel.<br/><span>Die Plattform wächst weiter.</span></h2>
          <p>Jetzt: starke Marke, Research Catalog und klare Produktwelt. Danach werden Bestellung, Payment, Kundenbereich, Content, Research-Automation und weitere Plattformfunktionen Schritt für Schritt ergänzt.</p>
          <a href="/shop" className="deck-btn deck-btn-primary">AgeLess Beta öffnen <span>→</span></a>
        </section>
      </main>

      <footer className="deck-footer">
        <span>© 2026 AgeLess</span>
        <span>Science for a longer, better life.</span>
        <span>Research Use Only where applicable · No medical advice</span>
      </footer>
    </div>
  );
}
