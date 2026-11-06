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
