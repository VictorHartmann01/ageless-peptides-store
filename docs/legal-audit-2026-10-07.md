# AgeLess: Anbieter- und Datenschutzprüfung

Prüfstand: 07.10.2026. Ausgangscommit: `4353eb0df9d69ac4867dd0d046f30b03ee06f1c5` auf `main`.
Ziel: belegte Informationen ergänzen, offene Angaben sichtbar halten. Keine Bestätigung vollständiger Rechtskonformität.

## Befund vor der Änderung

| Prüfung | Ergebnis / Beleg |
| --- | --- |
| Öffentliche Startseite | GET `https://ageless-peptides-store.vercel.app/`: HTTP 200, `server: Vercel`; keine Impressums- oder Datenschutzlinks im HTML. |
| Katalog | GET `/shop`: HTTP 200; keine Rechtstextlinks im HTML. |
| Rechtstextadressen | `/impressum`, `/datenschutz`, `/imprint`, `/privacy`, `/legal`: HTTP 404. Keine entsprechende Route im Repository. Die Kombination aus Code und direkten Abrufen ist aussagekräftiger als fehlende Suchindexierung allein. |
| Betreiber | Weder Name/Firma, Rechtsform, Geschäftsanschrift noch Register- oder Identifikationsnummern im aktuellen Repository belegt. Ein Repository-Kontoname ist kein Nachweis des Diensteanbieters. |
| Kontakt | `app/page.tsx` und Live-HTML: `mailto:vhartmann@e-valuate.biz`. Belegt als Website-Kontakt, nicht als Nachweis einer konkreten Betreiberfirma. |
| Ergänzende Unterlage | Die Texte aller Folien aus `AgeLess_Info Deck DE_2026-10-06.pptx` geprüft: keine Betreiber-, Anschrifts- oder Kontaktangaben. Private Wohnanschriften oder Betreiber anderer Projekte wurden nicht übernommen. |

## Konkret einschlägige und bedingte Pflichten

| Regel | Einordnung für den geprüften Stand | Umsetzung / offene Punkte |
| --- | --- | --- |
| § 5 DDG | Die öffentliche Präsentation dient dem Aufbau und der Vermarktung einer kommerziellen Plattform mit Katalog und Investorenkontakt. Daraus ergibt sich die Einordnung als geschäftsmäßiger Dienst; die kostenlose Beta-Nutzung beseitigt die Anbieterpflichten nicht. Dies ist eine rechtliche Einordnung des belegten Angebots, keine aus dem Code ablesbare Tatsache. | Name/Firma, Niederlassungsanschrift, E-Mail und schnelle unmittelbare Kommunikation fehlen teilweise. Bei juristischer Person Rechtsform/Vertretung; Registerangaben, USt-IdNr. oder Wirtschafts-IdNr. und Aufsicht, soweit einschlägig. Keine normale Steuernummer veröffentlichen. |
| Art. 12/13 DSGVO | Bereits die Auslieferung über Hosting und externe Bildabrufe verarbeitet technische Besucherdaten. Bei E-Mail-Anfragen kommen vom Absender übermittelte Angaben hinzu. Beta ist keine Ausnahme. | Identität/Kontakt des Verantwortlichen, ggf. Datenschutzbeauftragter, Zwecke, Rechtsgrundlagen, ggf. berechtigte Interessen, Empfänger, ggf. Drittlandgarantien, Speicherdauer/Löschkriterien, Rechte, Beschwerde, Bereitstellungspflichten/Folgen und ggf. automatisierte Entscheidungen. Unbelegte Details bleiben ausdrücklich offen. |
| § 25 TDDDG | Einwilligung ist für Speicherungen/Zugriffe auf Endgeräte erforderlich, soweit keine gesetzliche Ausnahme greift. Die bloße externe Bild- oder Hostingverbindung belegt noch keinen solchen Speicherzugriff. | Keine selbst programmierten Cookies/Browser-Speicherzugriffe gefunden. Keine pauschale Cookie-frei-Aussage und kein unbegründeter Consent-Banner. Hosting-Injektionen und Drittanbieter sind nicht abschließend geprüft. |
| § 36 VSBG | Erklärung zur Teilnahmebereitschaft/-pflicht abhängig von Tatbestand; Ausnahme für Absatz 1 Nr. 1 bei höchstens zehn Beschäftigten am 31.12.2025. Eine Teilnahmeverpflichtung kann weitere Angaben auslösen. | Beschäftigtenzahl und Teilnahmestatus unbekannt. Kein erfundener Satz zur Nichtteilnahme. |
| § 18 MStV | Basis-Anbieterangaben für nicht rein persönliche/familiäre Angebote; zusätzlicher Verantwortlicher bei journalistisch-redaktionellem Angebot. Die Roadmap erwähnt Editorial, beweist aber kein entsprechendes aktuelles Angebot. | Name/Anschrift fehlen ohnehin. Redaktionellen Verantwortlichen erst bei nachgewiesenem Anwendungsfall zuordnen. |
| Art. 246a EGBGB; §§ 312j, 356a BGB; PAngV | Im aktuellen Code keine Preise, Kaufbuttons, Checkout- oder Zahlungsfunktion. Die Bezeichnung „Connected commerce“ beweist keine Bestellabwicklung. Für spätere B2C-Fernabsatzverträge sind u. a. Identität/Telefon, Gesamt- und ggf. Grundpreise, Versand-/Liefer-/Zahlungsangaben, Widerrufsbelehrung/-formular sowie ggf. elektronische Widerrufsfunktion zu prüfen. Auch Vertragsabschlüsse per E-Mail können Fernabsatzpflichten auslösen. | Keine pauschalen AGB, Widerrufstexte oder PayPal-Angaben für nicht nachgewiesene Abläufe ergänzt. Vor echter Bestellfreigabe konkret prüfen. |
| §§ 1, 3, 14 BFSG | Elektronischer Geschäftsverkehr für Verbraucher kann seit 28.06.2025 erfasst sein. Die Anwendung hängt vom tatsächlichen Dienst und der Unternehmensgröße ab; Kleinstunternehmen sind bei Dienstleistungen ausgenommen. | Kein bestätigter Anwendungsfall und keine bestätigte Ausnahme. Bei Bestellfreigabe Umfang und ggf. Informationen nach Anlage 3 prüfen. Die jetzigen Links sind einfache, ohne JavaScript nutzbare Anker; daraus folgt keine vollständige BFSG-Prüfung. |

Eine frühere Pflicht zum Link auf die EU-OS-Plattform wurde nicht übernommen: Verordnung (EU) 2024/3228 hebt Verordnung (EU) 524/2013 mit Wirkung zum 20.07.2025 auf. VSBG ist davon gesondert zu prüfen.

## Belegte Datenflüsse

| Vorgang | Beleg | Was daraus nicht folgt |
| --- | --- | --- |
| Vercel-Hosting | Live-HTTP-Header, Domain, `vercel.json`, Vercel-Projektmetadaten. Vercel nennt allgemein Vercel Inc. in seinen Vertragsinformationen. | Keine bestätigte Projektregion, Logfelder/-dauer, AVV-Geltung, konkrete Unterauftragnehmer oder Transfergarantien. Ein allgemeiner DPA-Text belegt keinen abgeschlossenen Vertrag dieses Betreibers. |
| Unsplash-Hintergrundbilder | Zwei direkte URLs von `images.unsplash.com` in `app/globals.css`, `.hero` und `.proof-image`. Browser muss für die Darstellung diese externen Bildadressen abrufen. | Keine bestätigte juristische Empfängeridentität, Speicherdauer, Drittlandgrundlage oder Einwilligung. Rechtsgrundlage/Interessenabwägung nicht erfunden. |
| Supabase-Produktabfrage | `app/shop/page.tsx` ist eine Server-Komponente. Sie liest `products`; `lib/supabase/public.ts` setzt `persistSession: false` und `autoRefreshToken: false`. Live-Katalogseite erreichbar. | Kein Nachweis, dass Besucher-IP/-Kennungen an Supabase übermittelt werden. Kein Nachweis einer aktiven Besucherauthentifizierung oder von Besucherbestellungen. Allgemeine Supabase-Anbieterinformationen nennen Supabase Pte. Ltd.; tatsächlicher Vertragspartner/Projektregion bleiben zu prüfen. |
| Produktbilder | `product.image_url` wird gegebenenfalls als direktes `<img>` ausgegeben. | Hostnamen der veröffentlichten Datensätze wurden nicht aus der Datenbank ermittelt. Vor Veröffentlichung externer Bilder Empfänger und Rechtsgrundlage prüfen. |
| E-Mail-Kontakt | `mailto`-Link, kein Formular/keine Versand-API. Eine Nachricht wird erst nach Versand im E-Mail-Programm übertragen. | Kein Nachweis des E-Mail-Hosters, Aufbewahrungsregeln oder Drittlandtransfers. Domain und Erinnerungen an andere Projekte sind kein Providerbeleg. |
| Tracking / weitere Funktionen | Keine Tracker, Browser-Speicherzugriffe, Anmelde-, Newsletter-, Bestell- oder PayPal-Funktion in Anwendungscode/Abhängigkeiten integriert. Migration beschreibt u. a. interne Rollen/Audit-Tabellen. | Tabellen, installierte SSR-Bibliothek und Roadmap beweisen keine Nutzung solcher Funktionen durch öffentliche Besucher. Keine abgeschlossene Laufzeitprüfung aller Hosting-Injektionen/Cookies. |

## Umsetzung

- Neue deutsche Seiten `/impressum` und `/datenschutz`, jeweils mit Seitentitel, `lang="de"`, Rücklink und auffälligem Unvollständigkeitshinweis.
- Belegte Kontaktadresse und technische Datenflüsse; fehlende Angaben als `FEHLT` / `OFFEN` markiert.
- Gemeinsamer `SiteFooter` im Root-Layout, statt nur auf der Startseite; beide Links auf jeder regulären Route und auf der generierten 404-Seite.
- Bestehende Startseiteninhalte und Kataloglogik beibehalten. Keine neuen Dienste, Cookies, Zahlungsfunktionen oder Abhängigkeiten.

## Verifikation und Grenzen

- TypeScript-Prüfung vor dem Build und `git diff --check` erfolgreich.
- Erstes `next build`: Anwendung kompiliert; bestehendes `/shop` scheitert beim Prerendern wegen fehlender lokaler Supabase-Variablen. Dieser Build ist kein erfolgreicher Gesamtbuild.
- Zweites `next build` mit ausdrücklich synthetischen lokalen Supabase-Testwerten: erfolgreich; `/`, `/shop`, `/impressum`, `/datenschutz` und 404 statisch erzeugt. Die Testabfrage lieferte keinen erfolgreichen echten Supabase-Zugriff; `/shop` wurde in seinem vorhandenen Fehlerzustand erzeugt. Kein Nachweis der Produktionsdatenbankfunktion aus diesem Test.
- Erzeugtes Produktions-HTML aller fünf Seiten geprüft: genau ein Footer, genau ein einfacher Link je Rechtstextseite; beide Rechtstextseiten mit deutschem `main`, sichtbaren Lücken und Unvollständigkeitshinweis. Footer umbruchfähig; Fokus-Markierung für Rechtstextlinks.
- Lokaler HTTP-Test konnte den gestarteten Server in dieser Ausführungsumgebung nicht erreichen. Daher keine Behauptung erfolgreicher lokaler HTTP- oder visueller Browserprüfung.
- Live-HTML und 404-Abrufe vor der Änderung sind direkt belegt. Kein Produktionsdeployment dieser Änderung ausgeführt.
- Vercel-API für Details der bestehenden Produktionsdomain: Zugriff mit bekanntem Projektscope verweigert (403). Keine internen Projekteinstellungen oder Geheimnisse abgerufen; kein unveränderter Wiederholungsversuch.
- Next.js erzeugte lokale Änderungen an `tsconfig.json`/`next-env.d.ts`; diese wurden zurückgesetzt und sind nicht Teil der Änderung.

## Zum Vervollständigen erforderliche Belege

1. Betreiber/Verantwortlicher: vollständiger Name oder Firma, Rechtsform, Niederlassungsanschrift, ggf. Vertretungsberechtigte und Registerdaten; vorhandene USt-IdNr./Wirtschafts-IdNr.; Zuordnung des E-Mail-Kontakts und unmittelbare Kommunikationsmöglichkeit.
2. Hosting: tatsächlicher Vertrag/Plan, anwendbarer AVV, aktivierte Logs/Skripte/Analytics, Daten-/Empfängerkategorien, Aufbewahrung und Verarbeitungsländer samt ggf. Drittlandgarantien. Supabase-Region/Vertrag bei personenbezogenen Verarbeitungsvorgängen gesondert bestätigen.
3. Unsplash: Empfänger/Verarbeitung prüfen oder Bilder nach geklärten Nutzungsrechten selbst hosten; Rechtsgrundlage dokumentieren. Produktbildhosts vor Veröffentlichung prüfen.
4. E-Mail: tatsächlich eingesetzter Dienstleister und Bearbeitungs-/Löschregeln; Rechtsgrundlage abhängig von der Anfrage bestätigen.
5. Bedingte Angaben: DSB-Benennung, VSBG-Beschäftigten-/Teilnahmestatus, ggf. behördliche Zulassung/redaktionelle Verantwortung. Keine nicht belegte Erklärung zur Befreiung.

## Primärquellen

- [§ 5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html)
- [DSGVO, EUR-Lex; insbesondere Art. 12, 13, 15–22, 28, 44 ff., 77](https://eur-lex.europa.eu/eli/reg/2016/679/2016-05-04/eng)
- [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html)
- [§ 36 VSBG](https://www.gesetze-im-internet.de/vsbg/__36.html)
- [§ 18 MStV, amtliches Landesrechtsangebot](https://www.gesetze-bayern.de/Content/Document/MStV-18?view=Print)
- [Art. 246a § 1 EGBGB](https://www.gesetze-im-internet.de/bgbeg/art_246a__1.html)
- [§ 312j BGB](https://www.gesetze-im-internet.de/bgb/__312j.html) / [§ 356a BGB](https://www.gesetze-im-internet.de/bgb/__356a.html)
- [PAngV](https://www.gesetze-im-internet.de/pangv_2022/BJNR492110021.html)
- [§ 1 BFSG](https://www.gesetze-im-internet.de/bfsg/__1.html) / [§ 3 BFSG](https://www.gesetze-im-internet.de/bfsg/__3.html) / [§ 14 BFSG](https://www.gesetze-im-internet.de/bfsg/__14.html)
- [Verordnung (EU) 2024/3228](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ%3AL_202403228)
- [Vercel DPA](https://vercel.com/legal/dpa) / [Supabase-Anbieterinformationen](https://supabase.com/privacy)
- [Repository](https://github.com/VictorHartmann01/ageless-peptides-store), oben benannter Ausgangscommit, und direkt abgerufenes Live-HTML/HTTP-Header.
