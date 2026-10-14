import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz | AgeLess',
  description: 'Belegte Datenverarbeitung der AgeLess-Beta und noch fehlende Datenschutzangaben.',
};

export default function DatenschutzPage() {
  return (
    <main className="legal-page" lang="de">
      <a href="/" className="legal-back">← Zur AgeLess-Startseite</a>
      <h1>Datenschutzhinweise</h1>
      <p className="legal-date">Prüfstand: 7. Oktober 2026</p>
      <aside className="legal-pending" aria-labelledby="privacy-status">
        <h2 id="privacy-status">Datenschutzangaben noch unvollständig</h2>
        <p>Diese Seite beschreibt die belegten Vorgänge der öffentlichen Beta. Fehlende Informationen sind ausdrücklich gekennzeichnet. Die Hinweise erfüllen die Informationspflichten nach Art. 13 DSGVO noch nicht vollständig.</p>
      </aside>
      <section>
        <h2>Verantwortlicher und Kontakt</h2>
        <p className="legal-missing">FEHLT: Name beziehungsweise vollständige Firma und Geschäftsanschrift des datenschutzrechtlich Verantwortlichen.</p>
        <p>Vorhandener Website-Kontakt: <a href="mailto:vhartmann@e-valuate.biz">vhartmann@e-valuate.biz</a>. Die Zuordnung zum Verantwortlichen ist noch zu bestätigen; siehe <a href="/impressum">Impressum</a>.</p>
        <p className="legal-missing">OFFEN: Ob ein Datenschutzbeauftragter zu benennen ist; gegebenenfalls sind dessen Kontaktdaten zu ergänzen.</p>
      </section>
      <section>
        <h2>Aufruf der Website: Hosting bei Vercel</h2>
        <p>Die öffentliche Website wird über Vercel ausgeliefert. Beim Abruf werden technisch die IP-Adresse und die angeforderten Ressourcen an die Hosting-Infrastruktur übermittelt. Zweck dieses Vorgangs ist die Bereitstellung der Website.</p>
        <p>Vercel nennt in seinen <a href="https://vercel.com/legal/dpa">Vertragsinformationen zur Datenverarbeitung</a> Vercel Inc. als Anbieter. Diese allgemeinen Informationen belegen nicht die Vertrags- oder Datenschutzeinstellungen dieses Projekts.</p>
        <p className="legal-missing">FEHLT: bestätigte Rechtsgrundlage und gegebenenfalls berechtigte Interessen; genaue Protokolldaten und Speicherdauer oder Löschkriterien; eingesetzte Unterauftragnehmer und Verarbeitungsorte; anwendbarer Auftragsverarbeitungsvertrag und gegebenenfalls Grundlage für Drittlandübermittlungen samt Zugang zu den Garantien.</p>
      </section>
      <section>
        <h2>Direkt geladene Bilder von Unsplash</h2>
        <p>Die Startseite bindet zwei Hintergrundbilder direkt von images.unsplash.com ein. Ihr Browser ruft diese Bilder bei diesem externen Dienst ab. Dabei erhält der Dienst technisch Ihre IP-Adresse und die angeforderte Bildadresse; weitere vom Browser übermittelte Daten richten sich nach den Browsereinstellungen. Zweck ist die Darstellung der Bilder.</p>
        <p className="legal-missing">FEHLT: verifizierte rechtliche Identität des Empfängers, bestätigte Rechtsgrundlage, gegebenenfalls berechtigte Interessen, Speicherdauer oder Löschkriterien und Angaben zu etwaigen Drittlandübermittlungen. Eine Einwilligung oder eine abgeschlossene datenschutzrechtliche Prüfung ist nicht belegt.</p>
      </section>
      <section>
        <h2>Produktkatalog und Supabase</h2>
        <p>Der Katalog liest Produktinformationen serverseitig über Supabase. Der Anwendungscode übermittelt dabei keine Besucherformulare, Besucherkonten oder Browser-Kennungen an Supabase und aktiviert keine Speicherung von Anmeldesitzungen. Aus dieser Produktabfrage lässt sich keine Übermittlung Ihrer IP-Adresse an Supabase ableiten.</p>
        <p>Die <a href="https://supabase.com/privacy">Anbieterinformationen von Supabase</a> nennen Supabase Pte. Ltd. Der konkrete Vertragspartner, die Projektregion, Protokollierung und Aufbewahrung dieses Projekts sind noch nicht verifiziert. Etwaige externe Produktbilder hängen von den veröffentlichten Produktdatensätzen ab; deren Empfänger sind vor Veröffentlichung zu prüfen.</p>
      </section>
      <section>
        <h2>Kontakt per E-Mail</h2>
        <p>Der Kontaktlink öffnet Ihr E-Mail-Programm. Er versendet auf der Website selbst keine Nachricht. Wenn Sie eine Nachricht senden, übermitteln Sie Ihre Absenderadresse, den Inhalt und gegebenenfalls weitere von Ihnen beigefügte Angaben zur Bearbeitung Ihrer Anfrage.</p>
        <p className="legal-missing">FEHLT: bestätigte Rechtsgrundlage je nach Art der Anfrage, eingesetzter E-Mail-Dienstleister, Empfänger, Speicherdauer oder Löschkriterien und gegebenenfalls Informationen zu Drittlandübermittlungen.</p>
      </section>
      <section>
        <h2>Tracking, Cookies und weitere Funktionen</h2>
        <p>Im geprüften Anwendungscode sind keine Analyse- oder Werbetracker, keine Zugriffe auf Browser-Speicher, kein Newsletterformular, keine Anmeldung und keine Bestell- oder PayPal-Funktion eingebunden. Datenbanktabellen für spätere Funktionen belegen keine aktuelle Verarbeitung Ihrer Daten durch diese Funktionen.</p>
        <p>Diese Aussage ist auf den geprüften Anwendungscode begrenzt. Zusätzlich über die Hosting-Plattform eingebundene Skripte, Cookies oder Speicherzugriffe sind nicht abschließend verifiziert. Insbesondere ist damit keine Aussage getroffen, dass die Website vollständig ohne Cookies arbeitet.</p>
      </section>
      <section>
        <h2>Ihre Rechte</h2>
        <p>Unter den jeweiligen gesetzlichen Voraussetzungen haben Sie Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit. Soweit die Verarbeitung auf einer Einwilligung beruht, können Sie diese für die Zukunft widerrufen. Soweit sie auf Art. 6 Abs. 1 Buchst. e oder f DSGVO beruht, können Sie aus Gründen Ihrer besonderen Situation widersprechen; gegen Direktwerbung besteht ein Widerspruchsrecht ohne diese Voraussetzung.</p>
        <p>Sie können sich bei einer Datenschutzaufsichtsbehörde beschweren, insbesondere an Ihrem Aufenthaltsort, Arbeitsplatz oder am Ort eines mutmaßlichen Verstoßes. Die für den Betreiber zuständige Behörde ist mangels belegter Betreiberanschrift noch nicht bestimmt.</p>
        <p className="legal-missing">OFFEN: vollständige Angaben zur Pflicht oder Freiwilligkeit der Datenbereitstellung und deren Folgen je Verarbeitung sowie Bestätigung, ob außerhalb des geprüften Codes automatisierte Entscheidungen oder Profiling stattfinden. Im geprüften öffentlichen Anwendungscode ist keine solche Entscheidungsfunktion eingebunden.</p>
      </section>
    </main>
  );
}
