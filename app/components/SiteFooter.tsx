export default function SiteFooter() {
  return (
    <footer className="footer" id="footer">
      <a className="footer-brand" href="/" aria-label="AgeLess home">Age<span>Less</span></a>
      <p>Science for a longer, better life.</p>
      <nav className="footer-legal" aria-label="Rechtliche Informationen" lang="de">
        <a href="/impressum">Impressum</a>
        <a href="/datenschutz">Datenschutz</a>
      </nav>
      <div className="footer-meta">Investor beta · Research-led · Transparent by design</div>
    </footer>
  );
}
