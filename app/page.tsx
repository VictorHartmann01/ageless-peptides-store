import heroD1 from './_assets/heroD1';
import heroD2 from './_assets/heroD2';

const products = [
  { name:'L-Lysine', meta:'Amino acid · Supplement', status:'LEGAL / FORMULIERUNGSPRÜFUNG', tone:'01' },
  { name:'L-Proline', meta:'Amino acid · Supplement', status:'LEGAL / FORMULIERUNGSPRÜFUNG', tone:'02' },
  { name:'Vitamin B12', meta:'Produktform vor Launch prüfen', status:'LEGAL / FORMULIERUNGSPRÜFUNG', tone:'03' },
  { name:'GHK-Cu', meta:'50 / 100 mg · Cosmetic context', status:'BEDINGT LEGAL — KOSMETIK', tone:'04' },
  { name:'SNAP-8', meta:'Acetyl Octapeptide-3 · Cosmetic', status:'BEDINGT LEGAL — KOSMETIK', tone:'05' },
  { name:'NAD+', meta:'500 mg · Research record', status:'BEDINGT / FORM OFFEN', tone:'06' },
];

const pillars = [
  ['LEGALITÄT','Lebensmittel, Kosmetik, Arzneimittel und Research werden sichtbar getrennt.'],
  ['EVIDENZ','Humanstudien, präklinische Daten und Mechanismen werden nicht vermischt.'],
  ['TRANSPARENZ','Preisfenster, Produktform und offene Punkte werden klar markiert.'],
  ['RISIKO','Unsicherheit, Zulassungsstatus und relevante Risiken bleiben sichtbar.'],
];

export default function Home(){
 const hero = 'data:image/webp;base64,' + Buffer.from(heroD1 + heroD2, 'base64').toString('utf8');
 return <main className="hg" id="top">
  <header className="hg-nav">
    <a href="#top" className="hg-logo"><img src="/ageless-logo.svg" alt="AgeLess — Science for a Longer, Better Life"/></a>
    <nav><a href="#products">Produkte</a><a href="#standard">Longevity Wissen</a><a href="#research">Research</a><a href="#compliance">Compliance</a><a href="#kontakt">Kontakt</a></nav>
    <a href="/shop" className="hg-nav-cta">Shop <span>↗</span></a>
  </header>

  <section className="hg-hero">
    <div className="hg-hero-photo" style={{backgroundImage:`url("${hero}")`}}/>
    <div className="hg-hero-film"/>
    <div className="hg-hero-copy">
      <div className="hg-overline"><span>AGELESS</span><i/> VERIFIED LONGEVITY RESEARCH</div>
      <h1>Science for a<br/><em>longer, better life.</em></h1>
      <p>AgeLess verbindet Longevity, Peptide und moderne Wirkstoffforschung mit einer klaren Regel: <strong>Evidenz vor Hype.</strong></p>
      <div className="hg-actions">
        <a href="/shop" className="hg-gold">Produkte entdecken <span>→</span></a>
        <a href="#standard" className="hg-glass">Warum AgeLess</a>
      </div>
      <div className="hg-hero-notes"><span>PEPTIDES</span><span>NAD+</span><span>LONGEVITY</span><span>RESEARCH</span></div>
    </div>
    <aside className="hg-feature">
      <div className="hg-feature-top"><span>FEATURED / 001</span><b>RESEARCH</b></div>
      <div className="hg-molecule">NAD<sup>+</sup></div>
      <h2>500 mg</h2>
      <p>Energy metabolism · cellular function · redox balance</p>
      <div className="hg-feature-rule"/>
      <div className="hg-feature-bottom"><span>FORMULIERUNG ENTSCHEIDEND</span><a href="/shop">Record ↗</a></div>
    </aside>
    <div className="hg-scroll">SCROLL TO DISCOVER <span>↓</span></div>
  </section>

  <section className="hg-manifesto" id="standard">
    <div className="hg-manifesto-title"><span>THE AGELESS STANDARD</span><h2>Longevity-Hype ist einfach.<br/><em>Vertrauen ist anspruchsvoller.</em></h2></div>
    <div className="hg-manifesto-copy"><p>AgeLess macht sichtbar, was andere oft im Kleingedruckten verstecken: regulatorische Einordnung, Evidenzniveau, Produktform und Unsicherheit.</p><a href="#research">Unser Research-Prinzip <span>→</span></a></div>
  </section>

  <section className="hg-pillars" id="research">
    {pillars.map(([title,text],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}
  </section>

  <section className="hg-products" id="products">
    <div className="hg-products-head">
      <div><span>CURATED / FIRST RELEASE</span><h2>Die erste<br/><em>AgeLess Auswahl.</em></h2></div>
      <p>Unsere erste Auswahl konzentriert sich bewusst auf klarer einordenbare Kategorien. Keine künstlichen Heilversprechen. Keine versteckte regulatorische Grauzone.</p>
    </div>
    <div className="hg-product-grid">
      {products.map((p,i)=><article className={"hg-product hg-product-"+p.tone} key={p.name}>
        <div className="hg-product-art">
          <span className="hg-product-index">0{i+1}</span>
          <div className="hg-orbit"><i/><b>{p.name}</b></div>
          <span className="hg-watermark">AGELESS</span>
        </div>
        <div className="hg-product-info">
          <span className="hg-status">{p.status}</span>
          <h3>{p.name}</h3><p>{p.meta}</p>
          <a href="/shop">Research Record <span>↗</span></a>
        </div>
      </article>)}
    </div>
  </section>

  <section className="hg-editorial" id="compliance">
    <div className="hg-editorial-photo" style={{backgroundImage:`linear-gradient(180deg,rgba(4,34,49,.08),rgba(4,34,49,.34)),url("${hero}")`}}/>
    <div className="hg-editorial-copy">
      <span>RESEARCH / RESPONSIBILITY</span>
      <h2>Research Use Only<br/><em>ist keine Humananwendung.</em></h2>
      <p>AgeLess trennt Research, Kosmetik, Nahrungsergänzung und Arzneimittel konsequent. Diese Klarheit ist kein Disclaimer am Ende der Seite — sie ist Teil des Produkterlebnisses.</p>
      <div className="hg-editorial-grid"><div><b>01</b>Offizielle Quellen bevorzugt</div><div><b>02</b>Keine Heilversprechen</div><div><b>03</b>Produktform sichtbar</div><div><b>04</b>Unsicherheit markieren</div></div>
    </div>
  </section>

  <section className="hg-close" id="kontakt">
    <span>AGELESS / SCIENCE FOR A LONGER, BETTER LIFE</span>
    <h2>Know more.<br/><em>Choose better.</em></h2>
    <p>Entdecke die AgeLess Produkt- und Research-Welt.</p>
    <a href="/shop" className="hg-gold">Produkte & Research <span>→</span></a>
  </section>

  <footer className="hg-footer"><img src="/ageless-logo.svg" alt="AgeLess"/><div><a href="#standard">Longevity Wissen</a><a href="#research">Research</a><a href="#compliance">Compliance</a><a href="/shop">Shop</a></div><p>© 2026 AgeLess · Research Use Only where applicable · No medical advice</p></footer>
 </main>
}