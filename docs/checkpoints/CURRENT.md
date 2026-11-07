## AgeLess Work – echte Sites-Speicherprobe bestanden – 07.11.2026

**Private Site:** `appgprj_6aeee73b27b481919180a3e3009abb3b`, Version 2, owner-only/custom, https://ageless-peptides-store.e-valuate-5668.chatgpt.site . Vorhandener AgeLess-Code mit Vinext/Worker-Adapter, gespeicherter Source-Commit `3d85bbcff53cab55b211aaa278086c25a56dfb36`; noch kein Merge des Sites-Adapters in den GitHub-Integrationsbranch behauptet.

**Tatsächlich geprüft:** Native Datenbankübersicht bestätigt Binding `DB` und isolierte Tabelle `ageless_runtime_probe`. Gehosteter Testablauf mit ausschließlich künstlichen Daten: write 200; read 200/consistent=true; mutate 200; read 200/consistent=false; restore aus zuvor gelesenem Snapshot 200; abschließendes read 200/consistent=true. Snapshot umfasst D1-Testdatensatz und R2-Testbildbytes/MIME. Kein echter Produkt-/Kunden-/Login-/Bestelldatensatz importiert.

**Nach Abschluss:** Prüfendpunkt per Environment deaktiviert, temporären Prüf-Schlüssel entfernt und dieselbe gespeicherte Version erneut privat bereitgestellt (Deployment `appgdep_6aeef876cc648191af231f1314d8bdfd`, env revision 3, SUCCESS). Native Datenbankabfrage danach bestätigt erhaltenen Datensatz `synthetic-runtime-v1` mit korrektem Fixture-Inhalt. Das ist ein begrenzter synthetischer Speicher-/Restore- und D1-Redeploy-Erhalt-Nachweis, **keine vollständige Produktionssicherung oder Shopabnahme**. R2-Erhalt nach diesem abschließenden Redeploy noch nicht separat erneut abgefragt.

**Offen / Verantwortliche:** Back03 #32 Capture-Gate und #22 eigener Shop-Auth-/Daten-/Medienadapter sowie gesicherter aktueller Export; Line Up unterstützt geprüfte Integrationspakete; Front #21 SKU/Varianten und gesperrtes ARA-290; Research #23 aktuelle SKU-Nachweise; Tester/Beta Status unabhängige technische und Release-Abnahme. Checkout bleibt gesperrt, kein DNS-Wechsel, kein Railway und keine neue Supabase-Datenarbeit. Kein erfolgreicher Kunden-/Admin-Login ohne Backend behauptet. Bisherige Nachrichten weiter unten sind historische Zwischenstände.

**Zusatzauftrag erledigt:** Einseitige Word-Kopiervorlage „Aufräumer“ erstellt, gerendert/geprüft und gespeichert. Keine weiteren Projektchats erstellt oder umbenannt.

---

## Verbindliche Teamaufstellung – Betreiberentscheidung 07.11.2026

| Rolle | Verbindliche Aufgabe |
|---|---|
| AgeLess Work | Einziger Teamleader; Integration, finale Prüfung und Veröffentlichung. Bisherige Bezeichnung: AgeLess Website Live04. |
| AgeLess Line Up | Vorarbeiten, Codeänderungen, Tests und vollständige geprüfte Übergabepakete; Work-Aufwand minimieren. Vormals Live03, keine parallele Teamleitung. |
| Front | Design, Corporate Identity, Produktbilder und Bedienung auf Handy und Desktop. |
| Back03 | Backend, Datenbank, Login, Rechte, sichere Speicherung und Checkout-Sperren; P0 #32. |
| Research | Produktinformationen, Quellen, Nachweise und rechtliche Prüfung. |
| Beta Status | Unabhängige Qualitätskontrolle, Abnahmestatus und Veröffentlichungsempfehlung. |
| AgeLess Tester | Unabhängige technische Tests: Sicherheit, Funktionen, mobile Darstellung, Datenverlust und Wiederherstellung. |

**Sieben bestehende Rollen.** Kein zusätzlicher Chat oder neuer Agent. „AgeLess Work“ ersetzt den bisherigen Namen Live04 für dieselbe Teamleiterrolle. Ältere abweichende Rollenlisten sind historische Stände. Jede Aufgabe behält genau einen primären Verantwortlichen; Line Up stimmt Vorarbeiten mit den Spezialrollen ab und vermeidet Doppelarbeit.

**Teamkommunikation:** Alle sechs Kollegen bitte diese Aufstellung und die aktuellen Regeln lesen und im bestehenden Issue #3 selbst bestätigen: `AGELESS TEAM-ACK | Rolle | neue Aufstellung gelesen | Commit | eigene Aufgabe | Blocker`. Eine GitHub-Mitteilung startet keine andere Chat-Sitzung; Empfang ist erst mit eigener Rückmeldung bestätigt. Zur Fehlervermeidung künftige Teamaufstellungen stets gegen diese sieben Rollen prüfen.

# AgeLess Website Live04 – geprüfte Übernahme 07.11.2026

**Aktueller Teamleader:** AgeLess Website Live04 auf ausdrücklichen Betreiberauftrag; ersetzt Live03 nach Integration dieser Dokumentation. Live03 bleibt historische Quelle. Keine technische Kopie eines Chats behauptet. Aktive Rollen: **Live04, Front, Back03, Research, Beta Status, AgeLess Tester**. Frühere Abschnitte darunter sind unveränderte Historie; aktuelle Betreiberentscheidung und dieser Abschnitt haben Vorrang.

**Übernahmebasis:** `beta/highgloss-logo` / `0d6df29bc8f5c0b4a2f6ac38649123acc0121eb2`. GitHub-Quellen: AGENTS.md, Teamrollen, CURRENT.md, Issue #3 (151 Kommentare abgerufen), offene PR-Übersicht, PR #30, Aufgaben #21–24 und #32. Zusatz-Prompt v6 vollständig aus Betreiberdatei vom 06.11. gelesen (Version 6.0, 25.10.2026, 13 Seiten). Lokale Git-Kopie und Bundle als Quellcode-Rückweg erstellt; **kein Produkt-/Kunden-/Medienbackup** daraus abgeleitet.

**Tatsächliche lokale Prüfung des Ausgangsstands:** npm ci erfolgreich; TypeScript erfolgreich; 43 Backoffice-Checks und 43 Zugriffschecks mit Mocks bestanden; 5 Exportvalidator-Tests mit synthetischen Dateien bestanden. Kein Live-Login, keine reale Datenmigration/Restore oder Zahlung getestet. Bestehende Checkout-Capture-Lücke bleibt P0 #32, primär Back03. Keine Verkaufs-/Zahlungsfreigabe.

**Sites/Work:** lokales Ausführen und GitHub-Lesen verfügbar; Sites-Konto erfolgreich abgefragt. Vollständige sichtbare Sites-Liste enthält noch kein AgeLess-Projekt. e-Xpense-Hosting nur als Referenz: vorhandene Site Version 41, öffentliche Custom Domain; keinerlei Quell-/Kundendaten übernommen oder verändert. Native Sites unterstützt Worker-ESM und D1/R2; bisheriger Next.js-Build allein ist kein deploybares Worker-Artefakt. Private Kompatibilitätsprobe auf bestehendem Code ist nächste Live04-Aufgabe; noch keine Site registriert/deployt und keine Runtime-Abnahme.

**Übernommene Aufgaben, je ein Hauptverantwortlicher:**
- **Live04:** private Sites-Integration, Quellcode-/Releaseprüfung und zentrale Dokumentation; PR #30 zunächst prüfen/ausführen, nicht blind mergen.
- **Back03:** #32 globale fail-closed Create/Capture-Sperre + Regressionstests; #22 vollständiger Export/Restore und eigener Auth-/Daten-/Medienadapter für Railway-freies Ziel. Kein neuer Supabase-Zugriff.
- **Front:** #21 vorhandenes 43er-Paket und präzises Variantenmapping; ARA-290 gesperrt halten bis Beschriftung geklärt. Live04 hat das tatsächliche Übergabe-ZIP als Datei gefunden, Byteprüfung noch offen. Kein Neugenerieren vorhandener Bilder.
- **Research:** #23 / PR #27 historische 47-Positionen-Matrix erhalten; aktueller SKU-Abgleich und konkrete Lieferunterlagen fehlen. Vier entfernte Produkte nicht wiederherstellen.
- **Beta Status:** #24 unabhängige Release-/Checkout-Abnahme; letzte Empfehlung NICHT FREIGEBEN bleibt.
- **AgeLess Tester:** technische unabhängige Sites-/Rechte-/Persistenz-/Restore-/Mobiltests zu PR #30/#32. Keine automatische Sitzung gestartet.

**Offen:** vollständiger aktueller Daten-/Auth-/Medienexport, eindeutige vier Ausschluss-IDs, 43er-Datei-/SKU-Abgleich, private echte Runtime, eigener Shop-Login und Backoffice, Backup/Restore echter Übernahme, mobile/desktop Abnahme, rechtliche Produktfreigaben. PR #18/#19 sind durch #25 bereits integriert; keine Doppelarbeit. PR #28 Monitor ist nicht aktiv. PR #27 ist Dokumentationsübergabe, kein aktueller Katalog.

**Kommunikation:** Rollenwechsel und Aufgaben werden in #3 veröffentlicht; Lesebestätigungen für Live04 sind bis zu tatsächlichen Antworten **NICHT BESTÄTIGT**. Keine Hintergrundagenten eingerichtet. E-Mail-Abschlussmeldung NICHT GESENDET (Versandverbindung/-funktion nicht geprüft).

**Schutz:** kein Railway-Zielhosting, keine Ressourcenlöschung, keine neue laufende Kosten, keine e-Xpense-Änderungen, keine DNS-Umstellung und keine realen Kundendaten in Tests. Aktuell keine manuelle Betreiberhandlung für die private Vorarbeit nötig. Datenübernahme bleibt vom sicheren Export abhängig.

---

## Historischer Stand von Live03 (erhalten)

## Zusatz-Prompt v6 erneut an vollständiges Team übergeben – 06.11.2026

**Quelle:** Betreiber-Upload `Zusatz_Prompt_v6_-_Checkpoint(1).docx`, Version 6.0 / Stand 25.10.2026 (13 Seiten). Ergänzende Vorgaben: Ausgangsstand/Backup und Rückweg, minimale getestete Änderungen, keine erfundenen Erfolge oder Hintergrundagenten, Status-/Prüfstatus getrennt, eine GitHub-Checkpoint-Wahrheit, sichere getrennte Branches/Übergaben, nur echt getestete Wissenseinträge und autorisierter E-Mail-Versand, kostenlose vorhandene Ressourcen zuerst, zwingende manuelle Betreiberaktionen sofort melden. **Kein Auftrag für neuen Anbieter, Railway-Reaktivierung, zusätzliche Klone, Löschungen, Kosten, Zahlungen oder Neustart.** Aktueller Betreiberentscheid (AgeLess ohne Railway, e-Xpense als Referenz) hat Vorrang vor allgemeinen Railway-Beispielen der v6-Datei.

**Repo-Umsetzung:** `AGENTS.md` um aktuelle sechsköpfige Teamliste und v6-Nachträge ergänzt, veraltete Railway-Zielweisung korrigiert (Commit `fac95f1e`). `docs/team/AGELESS_TEAM_ROLES.md` auf Nicht-Railway-Ziel und aktuelles Back03-P0 angepasst (Commit `bbb9e617`). Alle sechs bestehenden Rollen (Live03, Front, Back03, Research, Beta Status, AgeLess Tester) erhalten diese Anweisung über Checkpoint #3; deren erneute aktive Kenntnisnahme ist erst nach persönlicher Rückmeldung nachgewiesen. Kein eigenständiger 24/7-Agent/Scheduler ist hierdurch aktiviert.

**Neuer kritischer Ist-Befund von Beta Status, durch Live03 im Quellcode bestätigt:** `app/api/checkout/capture/route.ts` fehlt ein entsprechender `AGELESS_CHECKOUT_ENABLED`-Check, während Create den Flag prüft. Vorhandene offene Payment-Order könnte Capture trotz globalem Checkout-Aus ermöglichen. **P0:** [Issue #32](https://github.com/VictorHartmann01/ageless-peptides-store/issues/32) an Back03; AgeLess Tester prüft Negativ-/Regressionsfälle unabhängig, Beta Status blockiert Release bis bestandene Endabnahme. Bis Fix/Prüfung: **KEINE Verkauf-/Zahlungsfreigabe**.

## Teamaufnahme AgeLess Tester – 06.11.2026

**Vom Betreiber benannt:** Eigenständige zusätzliche Rolle **AgeLess Tester**; bestehende Rollen Front, Back03, Research, Beta Status und AgeLess Website Live03 behalten ihre Namen und Verantwortlichkeiten. [PR #31](https://github.com/VictorHartmann01/ageless-peptides-store/pull/31) wurde von Live03 anhand ausschließlich einer neuen Rollendokumentationsdatei geprüft und als `454c7cf525c96b49f07456637c9a4a012868ee22` gemergt. [Vollständige Rollendefinition](../team/AGELESS_TESTER_ROLE_2026-11-06.md) liegt im bestehenden Repository; Teamübersicht entsprechend ergänzt.

**Prüfauftrag:** Technische unabhängige Sites- und Regressionstests zur privaten Vorlage [PR #30](https://github.com/VictorHartmann01/ageless-peptides-store/pull/30). **Beta Status bleibt eigenständiger QA-/Release-/Zahlungsgate-Prüfer.** Kein verifizierter Sites-Zugriff oder Sites-Deployment allein durch Teamaufnahme; reale Runtime-, Backup/Restore- und Rechteprüfungen bleiben ausstehend. Keine automatische Aktivierung des anderen Chats durch GitHub.

## Betreiberentscheidung: e-Xpense als technische Referenz für AgeLess (06.11.2026)

**Verbindlich:** AgeLess ohne Railway aufbauen. **e-Xpense Report** als Vorbild der Hosting- und Update-/Deployment-Struktur nutzen, **nicht** die e-Xpense-App oder ihre Produktivdaten kopieren/verändern. Eigene AgeLess-Website, eigene Daten, eigene Berechtigungen und eigene Domain. Kein neues unnötiges Team und keine Umbenennung der Rollen.

**Referenz geprüft:** `VictorHartmann01/e-xpense-report-team/status/apps.json` weist für e-Nable die ChatGPT-Sites-Projekt-ID `appgprj_6ad889ff00d481919553122f9baf1c28`, publizierte Version 40 und eine Sites-URL aus (letzte dort eingetragene Verifikation 04.11.2026). Das ist **nur ein dokumentierter Betriebsnachweis für e-Xpense**, kein Beleg, dass der bestehende AgeLess-Next.js-Shop auf Sites unverändert lauffähig ist.

**P0 Umsetzungspfad:** Back03 prüft und bereitet die private Sites-Kompatibilitätsprobe anhand `docs/hosting/AGELESS_SITES_FEASIBILITY_2026-11-06.md` vor, mit synthetischen Testdaten ohne Kundendaten; Front erhält AgeLess-CI und 43er-Motivzuordnung; Beta Status überprüft SSR, Route-Handler, Login/Admin- und Testerrechte, Bilder-Uploads, Offline-/Updateverhalten, Backup+Restore, Domain und deaktivierte Checkout-Gates. Live03 integriert und entscheidet erst nach echten Tests über eine Site-Veröffentlichung. Kein DNS-Wechsel vorher. Keine zusätzliche Kostenpflicht ohne separate Freigabe.

**Offene Blocker:** Tatsächliche Sites-Bereitstellung bzw. Work-Computerzugang für Alterativhosting noch nicht nachgewiesen; aktueller vollständiger Produkt-/Auth-/Medienexport fehlt. Bestehenden GitHub-Code, Checkpoint, Ressourcen und Daten bis nach gesicherter Übernahme schützen. Keine Railway-Neuaktivierung.

## Betreiberentscheidung 06.11.2026: Railway als künftiges Hosting ausgeschlossen

**Verbindlich:** Betreiber: „Wir wollen sowieso ohne Railway arbeiten.“ Damit ist Railway keine Zielplattform für den fortgesetzten AgeLess-Betrieb. Keine neuen Railway-Deployments, Plankäufe, Ressourcen, produktiven Migrationen oder Erweiterungen. Keine Aufforderung zum Abschluss eines Railway-Tarifs. Bereits vorhandene Daten, Dienste und Konfigurationen **nicht ohne gesicherte Datenexporte und Wiederherstellungsmöglichkeit löschen oder kündigen**.

**Neues Ziel:** Bestehenden AgeLess-Shop auf einer geeigneten Nicht-Railway-Plattform funktionsgleich wiederherstellen. Zuerst private, datensparsame Machbarkeitsprüfung der bei e-Xpense verwendeten Hosting-Struktur (ChatGPT Sites), dann bei fehlender Kompatibilität andere kostengünstige geeignete Lösungen anhand Next.js-/Server-APIs, Auth/Admin, Datenbank, Bildspeicher, Datenschutz, Checkout-Schutz, Backups/Restore und Kosten prüfen. Kein DNS-Wechsel, keine reale Kundenmigration und keine Freigabe der Vial-Verkäufe vor bestandenen Tests. Kostenpflichtige Alternativen nur mit ausdrücklicher Kostenfreigabe.

**Offene Blocker:** Vollständiger aktueller Daten-/Auth-/Medienexport fehlt. Sites-kompatible Testinstanz und E2E-Tests nicht nachgewiesen. Weitere teamweite Arbeit über Issue #3; Back03 #22, Front #21, Research #23, Beta Status #24. Bestehende Rollennamen beibehalten.

# AgeLess Website Live03 - CURRENT CHECKPOINT

Stand: 2026-11-06 (Europe/Berlin)
Projekt: AgeLess Peptides Store
Repository: VictorHartmann01/ageless-peptides-store
Maßgeblicher Deployment-Branch: beta/highgloss-logo
Gemeinsamer Team-Checkpoint: https://github.com/VictorHartmann01/ageless-peptides-store/issues/3

## Verbindlicher Auftrag

AgeLess Website Live03 ist Teamleader für die technische Koordination, Integration, Tests und Veröffentlichung. Bestehende Bezeichnungen für Chats, Teams und Rollen niemals eigenständig ändern. Bestehende Teams: Front (Bilder, Design), Back03 (Backend), Research (rechtliche/product-bezogene Prüfung), Beta Status (Teststatus). Keine neuen Team-Chats ohne Bedarf.

Betreiberwunsch: Produktdaten und Bilder vollständig zu Railway migrieren, vorhandene Daten VOR dem Cutover sichern; niemals Freigaben oder Checkout selbsttätig aktivieren. Supabase vom Betreiber für neue Arbeiten ausgeschlossen. Produkte ohne korrekte Bilder nach überprüfter Sicherung aus dem aktiven BE/BO entfernen. Gelöschte vier Produktpositionen wegen fehlender Informationen nicht selbstständig wiederherstellen. Bildillustrationen nicht als echte Produktverpackungen darstellen.

Zusatz_Prompt_v6_-_Checkpoint.docx (25.10.2026) als ergänzende Qualitätsregel: minimaler Eingriff, überprüfbare Ergebnisse, keine Regression, kein Neustart, Sicherheits- und Kostenfreigaben. Kein automatischer Hintergrundagent allein durch einen Prompt.

## Verbindliche teamweite Arbeitsregeln (06.11.2026)

Die Zusatzregeln aus `Zusatz_Prompt_v6_-_Checkpoint.docx` sind für **alle bisherigen Rollen** als [AGENTS.md](../../AGENTS.md) und [AGELESS_TEAM_ROLES.md](../team/AGELESS_TEAM_ROLES.md) im aktiven Branch verankert.

- **Live03**: Teamleader/Integration/Abnahme; **Front**: Bilder/UX; **Back03**: Backend/Daten/Auth; **Research**: Evidenz/Legalität; **Beta Status**: unabhängige Prüfung. Keine eigenmächtigen Namensänderungen.
- Alle müssen beim nächsten aktiven Arbeitsbeginn die drei Dateien lesen und eine **eigene GitHub-ACK im Issue #3** hinterlegen; fremde Chats werden durch einen GitHub-Kommentar nicht automatisch gestartet.
- Status der **Lesequittungen der anderen Rollen**: **NICHT BESTÄTIGT** bis zu tatsächlichen Kommentaren der jeweiligen Rollen.
- Zentraler Checkpoint bleibt `docs/checkpoints/CURRENT.md`; keine parallele Hauptversion.
- Kostenfreigaben, Datensicherung, nicht-verkäufliche Vials, Produkt-Ausschlüsse, Railway-Cutover und Tests werden weiterhin durch die Bestandsregeln gesteuert.
- Geprüfte Publikation der Regeln: AGENTS.md Commit `43fe6fe1`, Teamrollen Commit `c7c0eca7`; zugehörige Arbeitsanweisungen sind keine Behauptung einer automatischen Ausführung.
- Nächste Priorität bleibt aktueller vollständiger Quelldaten-/Bildexport und sichere Railway-Migration. Die neuen Regeln ersetzen keine fehlenden Produktdaten oder ZIP-Dateien.

## Verifizierter technischer Stand 2026-11-06

Railway Projekt: 3bff23e0-de13-4fb1-8228-9b1b796180da
Production Environment: 28c8b5dc-158a-450c-9757-d070dd7a4010
Railway Services (environment_status): ageless-peptides-store ONLINE/SUCCESS; ageless-premium-preview ONLINE/SUCCESS; Postgres ONLINE/SUCCESS. Keine offenen pendingWork.
Postgres-Service-ID: 4d69fa0d-8cb1-40c9-81a7-de8cada330ea; erfolgreiches Deployment vom 25.10.2026.
Railway Bucket: ageless-product-images, ID f80f2dcc-93a3-4818-9b76-4875ec0caf2c, Status LIVE, Region ams.
Postgres-Volume: postgres-volume, an PostgreSQL angebunden.
Produktiv belegter Web-App-Commit: fc001bc84930f8a2a7561ba9e1c26203b8952735 (19.10.2026), keine aktuellere Web-App-Veröffentlichung nachgewiesen.
WICHTIG: Laufender Web-App-Code und alte Railway-Variablennamen weisen weiter auf den bisherigen Supabase-basierten Backendpfad hin. Railway-Postgres und Bucket zu provisionieren ist NICHT gleichbedeutend mit migrierten Daten oder umgestelltem Backend. Es fand in dieser Sitzung keine Abfrage oder Mutation der ausgeschlossenen Supabase-Daten statt.

## P0 Vorfall - Produktionsdomain offline (06.11.2026, 22:56 Europe/Berlin)

**AKTUELL GEPRÜFT:** Railway `environment_status`: alle drei Dienste `ageless-peptides-store`, `Postgres`, `ageless-premium-preview` **OFFLINE**, keine aktiven SUCCESS-Deployments. Railway `list_deployments`: letzte AgeLess-App Deployments `REMOVED`. Railway `domain_status` von `www.ageless-peptides.store`: DNS CNAME `9f5b7atu.up.railway.app` PROPAGATED, verified=true, Zertifikat VALID. Back03 hat bereits konkreten Fehler beim Redeploy nachgewiesen: `Your trial has expired. Please select a plan to continue using Railway.` Quelle: [Issue #3, Back03 Incident](https://github.com/VictorHartmann01/ageless-peptides-store/issues/3#issuecomment-6695815438). **Ursache Railway-Trial/Tarif-Blocker; DNS nicht ändern.** Noch kein wiederhergestellter Livebetrieb. Manuelle Betreiberhandlung: bestehenden Railway-Workspace-Tarif/Billing prüfen und einen geeigneten verfügbaren Tarif auswählen *oder* alternative Plattform nach echtem Kompatibilitätsnachweis wählen. Keine kostenpflichtige Aktivierung durch Live03 ohne konkrete Zustimmung und Preise.

**Back03-Übergabe geprüft/integriert:**
- [PR #26](https://github.com/VictorHartmann01/ageless-peptides-store/pull/26) sicherer lokaler Read-only-Migrations-Validator, 5 Tests, Cutover-/Rollback-Plan; aktueller Head `363f66f4`, zwei GitHub-Actions-Workflows SUCCESS. **MERGED** als `62cf511ae1605a45efd08c5a901955e8f09fa45f`. Kein Datenimport, keine neue Supabase-Abfrage, keine Auth-Umstellung. Export und Zugangskonzept bleiben Blocker.
- [PR #29](https://github.com/VictorHartmann01/ageless-peptides-store/pull/29) Architektur-/Machbarkeitsbericht zum Vergleich mit e-Xpense/Sites und Alternativen, GitHub Backend CI SUCCESS; **MERGED** als `658fb841050aa65f7875d60be7d40836597bc88b`. Keine funktionale Sites-Instanz und kein Hosting-Wechsel erzeugt. Sites zunächst nur in privater isolierter nichtverkaufender Probe, ohne echte Daten und ohne DNS-Wechsel prüfen. VPS/Coolify nur nach dokumentierter Kostenentscheidung als weiterer Fallback.
- [PR #28](https://github.com/VictorHartmann01/ageless-peptides-store/pull/28) Domain-Monitor alle 30 Minuten: Entwurf **NICHT GEMERGED/NICHT AKTIV**, vollständiger End-to-End-Test fehlt; keine erfundene aktive Alarmierung.

**Priorität:** (1) sichere Hosting-Wiederherstellung ohne unautorisierte Kosten; (2) verifizierter aktueller Gesamt-Export inkl. Auth, Produkten, Medien; (3) Front-Bildpaket mit eindeutigem SKU-Mapping; (4) Migration + E2E. Alle Checkout- und Verkaufsfreigaben bleiben unverändert. Diese Incident-Notiz ersetzt ältere 'Website ONLINE'-Statusangaben.

## Live03 tatsächliche Umsetzung am 06.11.2026

**Teamkoordination:** Die vier bestehenden Teamrollen haben eindeutige echte GitHub-Arbeitspakete: [Front #21](https://github.com/VictorHartmann01/ageless-peptides-store/issues/21), [Back03 #22](https://github.com/VictorHartmann01/ageless-peptides-store/issues/22), [Research #23](https://github.com/VictorHartmann01/ageless-peptides-store/issues/23), [Beta Status #24](https://github.com/VictorHartmann01/ageless-peptides-store/issues/24). Verbindliche Weitergabe im [Team-Checkpoint](https://github.com/VictorHartmann01/ageless-peptides-store/issues/3#issuecomment-6691633609). Noch **keine bestätigte individuelle Lesequittung** der anderen Rollen.

**Bildprüfung:** Betreiber-ZIP `AgeLess_Bilder_Substanznamen.zip` im Dateisystem geöffnet, **26 PNG / 21 einmalige SHA-256-Inhalte / 5 identische Dublettenpaare**. Nachweis: [IMAGE_INVENTORY_2026-11-06.md](IMAGE_INVENTORY_2026-11-06.md), Commit `f07d80a8`. Vollständiger neuer 43er-Asset-Bestand weiterhin NICHT als tatsächliche Datei übergeben.

**Backupprüfung:** `AgeLess_Project_Backup_2026-10-06.zip` enthält 62 ZIP-Einträge mit Dokumentation/Projektbildern, aber **keinen erkennbaren exportierten aktuellen PostgreSQL-/SQL-Datenbestand**; darf nicht als vollständiges aktuelles Produkt- und Nutzerbackup angesehen werden. Aktueller Datenbestand bleibt BLOCKIERT, solange kein vollständiger sicherer Quell-Export vorhanden ist.

**Code-Fix:** Bestehende Vorschläge #18 (Speicherstatus) und #19 (Admin-Navigation) in getrenntem PR #25 zusammengeführt. Auf dem PR-Head `564f6678`: GitHub Actions `AgeLess Admin Editor Build` und `AgeLess Backend CI` **SUCCESS**. PR #25 gemergt als `ae94b3b70d19205a67d6d68674a92ea7e1f126e6` auf `beta/highgloss-logo`; tatsächliches Railway-Deployment und funktionaler Browser-Admin-Test separat prüfen.

**Nicht automatisch erfolgt:** Neue GitHub-Issues oder Kommentare starten die unabhängigen anderen Chat-Sitzungen nicht. Teamarbeit erst nach tatsächlich nachgewiesenen Übergaben als in Arbeit bzw. erledigt markieren.

## Ausstehende und blockierte Aufgaben

1. BLOCKIERT / NICHT GEPRÜFT: Vollständigen aktuellen Quelldatenexport (inklusive 46 zuletzt bekannten Produktdatensätzen, Auth-/Rechtesystem, evtl. weitere Tabellen) und Bilddateien sicher bereitstellen. Altbestand aus 23.10. ist nur historische Zählung, kein verifizierter 06.11.-Iststand. Vorhandenes Projekt-Backup aus 06.10. ist nicht als aktueller vollständiger Export nachgewiesen. Nicht ohne Backup migrieren/abschalten.
2. OFFEN: Backend auf Railway-Postgres und Railway-Bucket einschließlich Admin-Authentifizierung, Zugriffsrechten, APIs, Bild-URLs und sicherer Speicherung in einem separaten Integrations-Branch umstellen; vollständigen Build und funktionalen Test vor Cutover. Geheimnisse niemals im GitHub-Checkpoint speichern.
3. BLOCKIERT: Front meldete 43 PNG-Dateien (38 Motive, 5 Varianten) per Screenshot. Im Issue #3 bislang keine tatsächlich abrufbare Übergabe des Gesamtpakets/Manifest mit SKU-IDs. Ältere Betreiber-ZIP mit 26 PNG-Dateien wurde früher erwähnt, aber nicht als vollständige aktuelle Freigabe verifiziert.
4. OFFEN: Nach gesicherter Übernahme korrekte Bildzuordnung zu Produktvarianten, Prüfung von Stoffnamen/Stärke/Vial vs. Design, Upload zu Railway-Bucket und Datenbankverknüpfung. Ohne passende Bilder keine öffentliche Produktkarte.
5. OFFEN: Backoffice-Sichtbarkeit von Bildlosen nach Datensicherung und eindeutiger Regel bereinigen; unwiederbringliche Löschung niemals ohne geprüfte Sicherung.
6. OFFEN: PR #18 (Speicherstatus) und PR #19 (Homepage-Admin-Link) vor Integrationsmerge auf aktuellem Branch gegenprüfen und testen.
7. OFFEN: GitHub Actions, mobile/desktop, Admin-Login, Rechte, Bilder, Produktlisten, Checkout-Gates und Rollback vor Live-Publikation abnehmen.
8. NICHT EINGERICHTET: automatischer GitHub-AI-Fortsetzungsrunner und dessen End-to-End-Nachweis. Nicht mit stündlicher Railway-Störungsüberwachung verwechseln.

## Sicherheitsregeln

- Keine Verkaufs- und Zahlungsfreigabe allein durch Produktbilder oder Materialrecherche.
- Verifizierte Lagerware (historisch): 11 Vial-Varianten; keine Annahme einer B2C-Verkehrsfähigkeit.
- Keine zusätzlichen kostenpflichtigen Ressourcen oder Skalierungen ohne verifizierte Kosten und ausdrückliche Freigabe.
- Code-Commit != Deployment; Deployment != Funktionsprüfung.
- Kein automatisches Arbeiten anderer Chats allein durch GitHub-Kommentare.

## Nächster konkreter Schritt

Vollständigen aktuellen Daten- und Bildexport ermitteln und sichern, ohne Supabase gegen den Nutzerwillen anzufassen. Unabhängig davon offenen GitHub-Code und PRs auf Migrationsvorbereitung und Regressionen prüfen. Die tatsächlich abrufbare 43-Bild-ZIP von Front samt Mapping benötigt eine dokumentierte Übergabe im Issue #3.

## Nachweise

- https://github.com/VictorHartmann01/ageless-peptides-store/issues/3
- https://github.com/VictorHartmann01/ageless-peptides-store/pull/18
- https://github.com/VictorHartmann01/ageless-peptides-store/pull/19
- Railway describe_environment und environment_status vom 06.11.2026 (beide live, SUCCESS).
