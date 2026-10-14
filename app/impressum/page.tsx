import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum | AgeLess',
  description: 'Anbieterinformationen der AgeLess-Beta mit ausdrücklich gekennzeichneten fehlenden Angaben.',
};

export default function ImpressumPage() {
  return (
    <main className="legal-page" lang="de">
      <a href="/" className="legal-back">← Zur AgeLess-Startseite</a>
      <h1>Impressum</h1>
      <p className="legal-date">Prüfstand: 7. Oktober 2026</p>
      <aside className="legal-pending" aria-labelledby="impressum-status">
        <h2 id="impressum-status">Anbieterinformationen noch unvollständig</h2>
        <p>Die folgenden Pflichtangaben sind noch nicht belegt. Ihre Kennzeichnung ersetzt nicht die erforderlichen vollständigen Anbieterinformationen nach § 5 DDG.</p>
      </aside>
      <section>
        <h2>Anbieter dieses digitalen Dienstes</h2>
        <p>AgeLess ist die auf dieser Website verwendete Marke. Die Marke und der Name des Repository-Kontos belegen allein nicht den rechtlichen Betreiber.</p>
        <dl>
          <dt>Name / vollständige Firma des Betreibers</dt>
          <dd className="legal-missing">FEHLT: rechtlich verantwortlichen Betreiber bestätigen.</dd>
          <dt>Geschäftsanschrift</dt>
          <dd className="legal-missing">FEHLT: Straße, Hausnummer, Postleitzahl, Ort und Staat der Niederlassung.</dd>
          <dt>Rechtsform und Vertretungsberechtigung</dt>
          <dd className="legal-missing">OFFEN: bei einer juristischen Person Rechtsform und vertretungsberechtigte Person angeben.</dd>
        </dl>
      </section>
      <section>
        <h2>Kontakt</h2>
        <p>Die Website nennt bereits die E-Mail-Adresse <a href="mailto:vhartmann@e-valuate.biz">vhartmann@e-valuate.biz</a>.</p>
        <p className="legal-missing">OFFEN: Zuordnung dieser Adresse zum Betreiber und ein geeigneter Weg für schnelle, unmittelbare Kommunikation bestätigen.</p>
      </section>
      <section>
        <h2>Weitere Angaben, soweit einschlägig</h2>
        <ul>
          <li><strong>Register:</strong> Eintragung, zuständiges Register und Registernummer sind nicht belegt.</li>
          <li><strong>Umsatzsteuer- / Wirtschafts-Identifikationsnummer:</strong> Ob eine solche Nummer vorhanden ist, ist nicht belegt. Eine vorhandene Nummer ist anzugeben.</li>
          <li><strong>Erlaubnispflichtige Tätigkeit:</strong> Ob eine behördliche Zulassung erforderlich ist und welche Aufsichtsbehörde zuständig ist, ist nicht belegt.</li>
          <li><strong>Verbraucherstreitbeilegung:</strong> Beschäftigtenzahl zum 31. Dezember 2025 sowie eine Verpflichtung oder Bereitschaft zur Teilnahme sind nicht belegt. Eine Erklärung nach § 36 VSBG kann deshalb noch nicht verlässlich abgegeben werden.</li>
        </ul>
      </section>
      <p>Informationen zur Verarbeitung personenbezogener Daten finden Sie unter <a href="/datenschutz">Datenschutz</a>.</p>
    </main>
  );
}
