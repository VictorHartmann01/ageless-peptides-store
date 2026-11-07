# AgeLess - Verbindliche Team-Arbeitsregeln (AGENTS.md)

**Gültig ab 06.11.2026 für die weitere Arbeit am bestehenden AgeLess Peptides Store.**

**Zuerst lesen:** [Aktueller Projektcheckpoint](docs/checkpoints/CURRENT.md), [Teamrollen und Übergabe](docs/team/AGELESS_TEAM_ROLES.md), [gemeinsamer GitHub-Checkpoint #3](https://github.com/VictorHartmann01/ageless-peptides-store/issues/3). Danach den eigenen Arbeitsauftrag ausführen. Bei Widersprüchen aktuelle ausdrückliche Betreiberentscheidungen und übergeordnete Sicherheitsregeln beachten; Konflikte im Checkpoint offenlegen.

Dies ist eine dauerhafte und für alle beteiligten **GitHub-lesenden** Agenten gut auffindbare Arbeitsanweisung, jedoch **keine** automatische Benachrichtigung, keine Rechteausweitung und **kein** Beleg, dass andere Chats sie tatsächlich gelesen haben.

## 1. Unveränderliche Namen und Zuständigkeiten

Die Betreiberbezeichnungen **AgeLess Website Live04**, **Front**, **Back03**, **Research**, **Beta Status** und **AgeLess Tester** niemals eigenmächtig ändern. **AgeLess Website Live04** ist Teamleader/Integrationsverantwortlicher; die übrigen Rollen sind in [AGELESS_TEAM_ROLES.md](docs/team/AGELESS_TEAM_ROLES.md) festgelegt. Keine neuen parallelen Projekt-/Teamchats ohne ausdrücklichen Bedarf und Zustimmung. Andere Apps und Projekte bleiben unberührt.

## 2. Start jeder Arbeit

1. Das aktuelle `docs/checkpoints/CURRENT.md`, die eigene Rolle, [Issue #3](https://github.com/VictorHartmann01/ageless-peptides-store/issues/3), relevante PRs und den aktuellen Branch lesen.
2. Letzten verifizierten Stand, Autorisierung, Risiken und offene Abhängigkeiten prüfen; den maßgeblichen Projektnamen und vorhandene Systeme beibehalten.
3. Prüfen, ob zwingende manuelle Betreiberaktionen erforderlich sind; nur tatsächlich notwendige Aktionen sofort unter **MEINE MANUELLEN SCHRITTE** melden: JETZT ERFORDERLICH / SPÄTER ERFORDERLICH / KEINE. Selbst ausführbare Schritte selbst erledigen.
4. Ein priorisiertes offenes Arbeitspaket übernehmen und vor Änderungen Ausgangsstand/Commit sowie Rückweg dokumentieren. Bei paralleler Arbeit keine konkurrierenden Bearbeitungen derselben Dateien.

## 3. Umsetzung und Qualität

- Wahrheit vor Statusbehauptung: GEPLANT, VORBEREITET, IN ARBEIT, UMGESETZT, BLOCKIERT, ABGESCHLOSSEN; Prüfung getrennt (NICHT GEPRÜFT / PRÜFUNG BESTANDEN / PRÜFUNG FEHLGESCHLAGEN).
- Minimalinvasiv vorgehen; bestehende Funktionen, Nutzer- und Produktdaten, Rechte, Domain, mobile UX, Checkout-Sperren und Corporate Design bewahren.
- Vor risikohaften Änderungen Datenbackup **zusätzlich** zu Git-Commit; bei fehlender Sicherung keine destruktive Migration oder Löschung.
- Änderungsarbeit auf getrennten Branches/PRs, wenn möglich. Typecheck/Build, passende Backend-, Rechte- und Regressionstests vor Merge; echte Live-Funktion nach Deploy prüfen. Commit ist weder Deployment noch Abnahme.
- Bei Fehlern Ursache, erfolglose Ansätze, funktionierenden Rückweg und Vermeidungsregel im bestehenden Checkpoint dokumentieren; nicht blind wiederholen.
- Keine Zahlungs- oder Produktverkaufsfreigaben, rechtlich kritische Behauptungen, Löschung oder Kosten ohne konkreten Auftrag und passende Sicherheits-/Rechtsprüfung.
- Bevorzugt bereits vorhandene und kostenlose/inkludierte Mittel; zusätzliche laufende Kosten nur nach konkreter Information zu Anbieter, Zweck, Preis, Alternativen und ausdrücklicher Freigabe.
- Keine Passwörter, Tokens, Kundendaten oder private Produktionsdaten in GitHub-Kommentaren, Commits oder ungesicherten ZIP-Dateien.

## 4. Betreiberentscheidungen für AgeLess

- Bestehendes Projekt weiterführen; kein Neubau.
- GitHub `VictorHartmann01/ageless-peptides-store` ist die maßgebliche Code-/Checkpoint-Basis. **Railway ist durch die ausdrückliche Betreiberentscheidung vom 06.11.2026 als künftiges Hosting ausgeschlossen**. e-Xpense dient als Architekturvorbild für eine erst privat zu prüfende ChatGPT-Sites-Lösung; keine Änderungen an e-Xpense. Noch vorhandene Alt-Daten/Ressourcen erst nach vollständiger Sicherung und getestetem Restore abschalten oder löschen. Keine neuen Railway-Pläne oder Deployments.
- Supabase auf ausdrückliche Betreiberanweisung **nicht für neue Datenarbeiten verwenden**.
- Vier wegen unzureichender Informationen entfernte Produkte niemals eigenmächtig wiederherstellen. Historisch 46 verbleibende Produktdatensätze, Zahl ist nicht automatisch der Live-Iststand.
- Produktbilder nur von **Front** produzieren/qualitätsprüfen lassen; **Live04** integriert technisch. Das gemeldete 43er-PNG-Paket erfordert tatsächlich abrufbare Dateien und ein Manifest mit Produkt-/Varianten-Zuordnung.
- Nur passende und ausreichend dokumentierte Produkte öffentlich zeigen; fehlende Bilder im aktiven Katalog unterdrücken. Geplante Löschung aus Backoffice erst nach gesicherter Bestands- und Bildzuordnung. Bilder sind kein Nachweis legalen B2C-Verkaufs.
- Vial-/Forschungsware ohne belegte Verkehrsfähigkeit nicht verkäuflich machen; Checkout/Verkaufsfreigaben nicht eigenmächtig aktivieren.

## 5. Checkpoint, Übergaben und Bestätigung

- Für jede wesentliche Änderung oder Übergabe **Issue #3** kommentieren: Rolle, Aufgabe, Ausgangsstand, Änderungen, Commit/PR/Dateilink, tatsächliche Tests, Ergebnis, Risiken, nächste Aktion.
- Nach jeder wesentlichen Änderung zentralen `docs/checkpoints/CURRENT.md` durch **Live04** aktualisieren oder eine konkrete Ergänzung über Issue #3 liefern; keine konkurrierenden Checkpoint-Hauptdateien.
- Jede Rolle bestätigt im Issue #3 eigenständig das **tatsächliche Lesen**: `ROLLE | REGELN GELESEN | CURRENT.md Revision/Commit | eigene aktive Aufgabe | Blocker`. Ohne sichtbare Bestätigung ist die Kenntnis **NICHT BESTÄTIGT**.
- Für erfolgreich getestete wiederverwendbare Lösungen einen kurzen reproduzierbaren Wissenseintrag schreiben (Ursache, Lösung, Testdatum, Verweis). E-Mail-Belege nur bei autorisiertem, getesteten Versand; Versand nicht fingieren.
- Ein geplanter GitHub-Workflow oder Prompt startet keinen autonomen KI-Agenten. Keine stündliche selbstständige Codearbeit versprechen, ohne einen echt eingerichteten, kostenautorisierten und End-to-End-geprüften Runner.

**Bezug:** Erneut übergebene Nutzerdatei `Zusatz_Prompt_v6_-_Checkpoint(1).docx`, Version 6.0, Stand 25.10.2026, ergänzend zu bisherigen verbindlichen Projektentscheidungen. Die erneute Übergabe autorisiert keine zusätzlichen Projekte, Kosten, Migrationen, Secrets oder Datenlöschungen; diese GitHub-Regeln sind eine arbeitsbezogene Kurzfassung, nicht die vollständige Datei.

**Zusätzliche operative Punkte aus v6:** Nach tatsächlichem, erfolgreich getesteten Fix kurze reproduzierbare Lösung mit Ursache (ggf. ungeklärt), Schritten, Versionsstand, Regressionstest und Link dokumentieren. E-Mail an die vom Betreiber benannte Adresse nur bei überprüftem, autorisiertem Versand; sonst ausdrücklich NICHT GESENDET. Stündliche Agentenarbeit und vierstündliche Fortsetzung nur mit wirklich eingerichteten, autorisierten und End-to-End-getesteten Run-Zugängen – derzeit nicht als aktiv bestätigt. Bei GitHub-Checkpoints und PRs keine scheingenauen Status- oder Garantiebehauptungen. Pflicht zur erneuten Prüfung kritischer Checkout-Gates bei jeder Hostingmigration.


## Geprüfte Nachfolge am 07.11.2026

Auf ausdrücklichen Betreiberauftrag übernimmt **AgeLess Website Live04** die bisherige Teamleiterfunktion von **AgeLess Website Live03**. Live03 bleibt historische Quelle, ist nach Integration dieser Übergabe kein aktiver Teamleader. Ausgangsstand: `0d6df29bc8f5c0b4a2f6ac38649123acc0121eb2` auf `beta/highgloss-logo`. Bestehendes Team unverändert: Live04, Front, Back03, Research, Beta Status, AgeLess Tester. Alle früheren Ergebnisse und offenen Aufgaben bleiben erhalten; keine zusätzlichen Chats oder Rollen. Die organisatorische Nachfolge ist keine Shop-/Sicherheits-/Hostingabnahme. Jede andere Rolle bestätigt das Lesen selbst in Issue #3.
