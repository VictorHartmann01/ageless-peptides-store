import Link from 'next/link';

// Closed beta: the public entry intentionally contains no product offers,
// checkout links or publicly accessible shop catalogue.
// Authentication and authorisation remain enforced by the backend.
export default function Home() {
  return (
    <main className="alv2 al-front02-entry" id="top">
      <a className="alv2-skip" href="#main-content">Zum Inhalt springen</a>
      <header className="alv2-header">
        <Link className="alv2-logo" href="/" aria-label="AgeLess Startseite">
          <img src="/ageless-logo.svg" alt="AgeLess – Science for a Longer, Better Life" />
        </Link>
        <nav className="al-front02-nav" aria-label="Navigation">
          <Link href="/rechtliches/impressum">Impressum</Link>
          <Link href="/rechtliches/datenschutz">Datenschutz</Link>
          <Link className="al-front02-nav-login" href="/login">Login <span aria-hidden="true">→</span></Link>
        </nav>
      </header>

      <section className="al-front02-hero" id="main-content" aria-labelledby="al-front02-heading">
        <div className="al-front02-copy">
          <p className="alv2-eyebrow">AGELESS · SCIENCE FOR A LONGER, BETTER LIFE</p>
          <h1 id="al-front02-heading">Willkommen bei <em>AgeLess.</em></h1>
          <p className="al-front02-lead">
            Entdecken Sie AgeLess. Unser Shop befindet sich derzeit in einer geschlossenen Testphase.
          </p>
          <p className="al-front02-support">
            Für freigegebene Tester steht ein persönlicher Zugang bereit. Produktangebote und Bestellungen
            sind nicht öffentlich zugänglich.
          </p>
          <Link className="alv2-gold-button al-front02-cta" href="/login">
            Zum Login <span aria-hidden="true">→</span>
          </Link>
          <p className="al-front02-footnote">Noch kein Zugang? Auf der Login-Seite können Sie einen Testzugang beantragen.</p>
        </div>
        <div className="al-front02-art" role="img" aria-label="AgeLess – hochwertige Longevity- und Wissenschaftswelt" />
      </section>

      <footer className="al-front02-footer">
        <span>© 2026 AgeLess · Science for a Longer, Better Life</span>
        <nav aria-label="Rechtliche Informationen">
          <Link href="/rechtliches/impressum">Impressum</Link>
          <Link href="/rechtliches/datenschutz">Datenschutz</Link>
        </nav>
      </footer>
    </main>
  );
}
