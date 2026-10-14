import Link from 'next/link';

export const metadata = { title: 'Geschlossener Testbereich', robots: { index: false, follow: false } };

export default function AccessPage() {
  return <main className="age-admin"><header className="age-admin-header"><Link href="/zugang"><img src="/ageless-logo.svg" alt="AgeLess" /></Link></header>
    <section className="age-admin-login"><span>AGELESS</span><h1>Willkommen bei AgeLess.</h1>
      <p>Unser Shop wird derzeit fertiggestellt. Der Testbereich ist ausschließlich für freigegebene Konten zugänglich.</p>
      <Link className="alv2-gold-button" href="/admin">Anmelden →</Link>
      <p>Bereits angemeldet? <Link href="/">Testbereich öffnen →</Link></p>
      <p><Link href="/rechtliches/impressum">Impressum</Link> · <Link href="/rechtliches/datenschutz">Datenschutz</Link></p>
    </section></main>;
}
