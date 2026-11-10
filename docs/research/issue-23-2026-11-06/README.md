# Research Übergabe zu Issue 23

Stand 06.11.2026. Rolle Research. Empfänger AgeLess Website Live03, Front und Back03.

## Ergebnis und Grenze

**UMGESETZT:** Review der tatsächlich zugänglichen 47 historischen Erfassungspositionen, getrennte Varianten- und Identitätslücken, Quellenregister und verständliche Texte. Keine dieser Positionen erhält durch diese Recherche eine Freigabeempfehlung.

**BLOCKIERT:** vollständige Abnahme nach dem aktuellen Katalog. `CURRENT.md` nennt zuletzt 46 Datensätze, die einzige vollständige Repo-Erfassung enthält aber 47 Positionen vom 11.10.2026. Weitere Vorschau-Namen sind nur über ein älteres Mapping bekannt. Die vier absichtlich entfernten Positionen sind in den gelesenen aktuellen Regeln nicht namentlich/mit IDs dokumentiert. Ihre Identität wird nicht geraten. Alle historischen Zeilen sind reine Auditverweise, keine wiederhergestellten oder vorgeschlagenen aktiven Produkte.

`historical-review.json` ist ausdrücklich **keine Importdatei** und kein Ersatz für die Datenbank. Historische AGL-IDs nicht mit aktuellen DB-UUIDs gleichsetzen. Keinen bestehenden Datensatz damit überschreiben, anlegen, löschen oder aktivieren. Research hat weder Produktionsdaten abgefragt noch Supabase verwendet.

## Dateien

- [MATRIX.md](MATRIX.md): jede historische Position in einer eigenen Zeile; Variante, möglicher Prüfweg, konkrete Lücke und Quellen.
- [historical-review.json](historical-review.json): dieselben 47 Auditpositionen plus Status, Form, Zweck, offene Nachweise, Datum und lesbarer Einzeltext.
- [TEXTS.md](TEXTS.md): allgemeiner neutraler Informationstext, drei bekannte kosmetische Vorschau-Namen und Einzeltexte für die interne Produktprüfung. Keine Werbe-/Heilversprechen; keine automatische Produktkartenfreigabe.
- [sources.json](sources.json): Primärquellen mit URL, Abrufdatum, konkreter Aussagegrenze und ehrlichem Abrufstatus. Herstellerangebot ist ein Marktbeleg, keine Bestätigung der unbekannten AgeLess-Ware. Suchauszüge nicht als gelesenen Volltext ausgeben.
- [validate_review.py](validate_review.py): reproduzierbare Datenintegritätsprüfung ohne Netzwerk-/Datenbankzugriff.
- [VALIDATION.json](VALIDATION.json): tatsächliches Ergebnis dieser Prüfung, keine rechtliche Abnahme oder Live-QA.

## Sofort nutzbare fachliche Ergebnisse

1. GHK-Cu 100 mg, GHK-Cu 50 mg, NAD+ 500 mg und NAD+ 10 mg bleiben getrennt. Elf Lagerformen sind laut bestehendem Checkpoint Vials. Daraus wird weder eine Injektionszulässigkeit noch fertige Kosmetik/NEM abgeleitet.
2. Alle mg-Angaben sind historische Produktstärken, keine Stückzahlen oder Anwendungsempfehlungen. 10 ml ist ein Volumen, keine Konzentration. IU darf ohne produktbezogene Grundlage nicht in mg umgerechnet werden.
3. Sammelvarianten und Kombinationen werden nicht als einzelne fertige SKUs ausgegeben. Insbesondere 50+10+10 mg bleibt ohne bestätigte Komponentenzuordnung offen. BC, LC-Codes, Thymosin und „Acetate“ werden nicht durch Vermutung vervollständigt.
4. CosIng und ein kosmetisches Marktprodukt belegen keine allgemeine Stoff-/Produktzulassung. Die drei kosmetischen Vorschau-Namen aus dem Repo bleiben getrennt, ohne neue Produkte anzulegen.
5. Ein NEM-Anzeigenachweis ist keine Zulassung; bei unverändertem Wiederverkauf keine unnötige neue Anzeige/Sicherheitsbewertung/CPNP-Meldung verlangen. Pflichten der tatsächlichen Rolle prüfen. Kein pauschales COA-Pflichtfeld für alle Produktarten; Analytik nur soweit für Identität/Sicherheit/Produktzweck konkret erforderlich.
6. Arzneimitteleinstufung erfolgt produktbezogen. Keine pauschalen Behauptungen „alle Forschungspeptide illegal“, „nirgendwo zugelassen“ oder „jede pharmakologische Wirkung genügt“. Ausländische Zulassungen und WADA-Status ersetzen keine Prüfung für den geplanten DE-Verkauf.
7. Nach aktueller Betreiberregel keine ungeprüften Artikel als Angebot oder „Bald verfügbar“ zeigen. Das ist eine Vorgabe dieses Projekts, kein behauptetes allgemeines gesetzliches Verbot jeder redaktionellen Erwähnung. Interne Review-Sicht separat halten.

## Konkrete verbleibende Übergaben

- **Live03/Back03:** bereits gesicherten aktuellen, bereinigten Artikel-Export mit Produkt-ID/SKU, Name, Variante, Form, Zweck und dokumentierten Ausschluss-IDs bereitstellen. Kein Zugriff auf das ausgeschlossene Altsystem gefordert; keine privaten Daten/Geheimnisse ins öffentliche Repo. Dieser fehlende Datensatz kann nicht aus historischen Zählungen rekonstruiert werden.
- **Lieferant/Betreiber, soweit nur dort vorhanden:** Originaletikett, konkrete Lieferartikelidentität und Herstellerunterlagen zur tatsächlich angebotenen Variante. Je nach Rechtsweg zusätzlich Rezeptur-/Sicherheits-/Kennzeichnungsnachweise und erforderliche Berechtigungen. Keine pauschale Aufforderung zu einer nicht vorgesehenen „Peptid-Verkaufslizenz“.
- **Research:** nach dieser Übergabe aktuelle IDs und Ausschlüsse verbinden, vorhandene Dokumente wiederverwenden, nur entscheidende Lücken nachfordern und je konkretem Produkt bewerten. Erst dann „Freigabe empfohlen“, „Gezielte Ergänzung erforderlich“ oder begründet „In dieser Form nicht zulässig“.
- **Front/Live03:** nur passend zugeordnete, belegte Texte übernehmen. Interne Lücken-/Projekttexte nicht automatisch auf öffentliche Produktkarten übertragen.

## Prüfung und Rückweg

Nur additive Unterlagen unter `docs/research/issue-23-2026-11-06/`; keine Anwendung, Migration, Datenquelle, Bilder oder Berechtigungen geändert. Kein Build-/Live-Test erforderlich oder behauptet, weil kein ausführbarer Shopcode verändert wurde. Die Integritätsprüfung überprüft Vollständigkeit, Originalnamen/Varianten, Quellenverweise, Statusgrenzen und Mengenunterschiede. Sie beweist keine Stoffidentität oder Rechtskonformität.

Bei späterem verifiziertem Export ein neues Review anlegen und dieses historische Review erhalten. Den Review-Branch nicht mergen bzw. ausschließlich diesen Dokumentationscommit zurücknehmen, falls die Übergabe nicht verwendet werden soll; keine Datenbank-Rückabwicklung nötig.

## Ergänzung für CURRENT durch Live03

Research #23: historische 47er-Prüfmatrix und Sachtexte mit Quellen/Prüfdatum als gesonderter Review übergeben. Keine Produktfreigabe oder Datenänderung. Aktuelle SKU-Abnahme bleibt BLOCKIERT bis zu aktuellem gesicherten Katalogexport und eindeutiger Identifikation der vier Ausschlüsse; Originalunterlagen je Lieferprodukt fehlen im geprüften Repo-Bestand. Historische Review-Dateien nicht importieren. Issue #23 nicht als vollständig abgeschlossen kennzeichnen.

## Reproduzierbare Prüflogik

Im ersten lokalen Prüflauf war der Pfad zur Originaldatei falsch; danach zählte eine Prüfung auch IDs in erläuternden Querverweisen als zusätzliche Tabellenzeilen. Beides wurde korrigiert: Die Originaldatei wird in einem Repo-Checkout oder im getrennten Input-Verzeichnis gesucht; die Matrixprüfung liest ausschließlich IDs am Anfang tatsächlicher Tabellenzeilen. Der letzte Lauf bestand 12 Integritätsprüfungen. Diese Korrektur verändert keine fachlichen Bewertungen. Vermeidungsregel: Tabellenstruktur statt freier Textzählung prüfen; Dateiquellen explizit auflösen.
