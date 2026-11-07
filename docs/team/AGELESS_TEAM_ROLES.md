# AgeLess - Teamrollen, Aufgaben, Bestätigung

**Projekt:** AgeLess Peptides Store. **Teamleader:** AgeLess Website Live04. **Zentrale Anleitung:** [AGENTS.md](../../AGENTS.md). **Ist-Stand:** [CURRENT.md](../checkpoints/CURRENT.md). **Koordination:** [Issue #3](https://github.com/VictorHartmann01/ageless-peptides-store/issues/3).

**Rollenänderung vom Betreiber am 07.11.2026:** Der bisherige Chat **AgeLess Website Live03** führt künftig die Rolle **AgeLess Line Up**. **AgeLess Website Live04** bleibt der einzige Teamleiter und Verantwortliche für Integration, Work und Veröffentlichung. Sonstige Teamrollen bleiben unverändert. Keine eigenmächtigen zusätzlichen Rollen oder Chats. Unabhängige Chats können nicht direkt aus diesem Repository heraus gestartet, benachrichtigt oder zur Einhaltung gezwungen werden. Wer aktiv arbeitet, muss diese Anweisungen selbst abrufen und den Empfang nachweisbar bestätigen.

## AgeLess Website Live04

**Rolle:** Teamleader, Integrator, Releaseverantwortung. **Zuständig:** aktuelle Regeln und Checkpoints prüfen; Aufgaben koordinieren; Front-/Back03-/Research-/Beta-Status-Übergaben prüfen; Konflikte lösen; Railway-freie Hosting-/Backend-Integration und Image-Upload in technisch sicherer Reihenfolge durchführen; CI, Rechte, Sicherheit, Desktop/Mobil und Live-Abnahme kontrollieren; zentralen Checkpoint konsolidieren.

**Nicht eigenmächtig:** Front-Bilder gestalten, fehlende Stoffinformationen erfinden, Verkaufs-/Zahlungsfreigaben vergeben, bestehende Daten ohne vollständige Sicherung löschen, fremde Teams umbenennen.

**Abnahme:** Sicherung nachvollziehbar; Daten/Medien vollständig in die geprüfte neue Hosting-/Datenlösung importiert und je SKU geprüft; Admin- und Shop-Funktionen getestet; keine Freigaben verändert; tatsächliches Deployment und Rollback dokumentiert. Wenn nicht erfüllt: Offen/Blockiert, nicht Fertig.

## AgeLess Line Up (vormals AgeLess Website Live03)

**Rolle:** Vorbereitungs-, Koordinations- und Übergabestelle für AgeLess zur **Minimierung des begrenzten ChatGPT-Work-Veröffentlichungskontingents**. Bezeichnung gilt auf ausdrücklichen Betreiberauftrag vom 07.11.2026. **Nicht** Teamleiter, nicht Release-/Live-Verantwortlicher.

**Aufgabe:** Bereits vorhandene PRs, Issues, Dokumentation, Code, Assets, Tests und Checkpoints nutzen und konsolidieren; selbstständig alle sicheren Zusatzarbeiten außerhalb Work vorbereiten und soweit technisch möglich ausführen. Anforderungen und Abnahmekriterien präzisieren, notwendige Code-/Test-/Konfigurationspakete liefern, Offline-Prüfungen durchführen, Import-/Rollback- und Geheimnis-/Daten-Schutz prüfen, Mergekonflikte und Abhängigkeiten früh beseitigen. Ergebnisse ausschließlich mit echten Commit-/PR-/Testnachweisen und eindeutiger Integrationsanleitung über Issue #3 an Live04/Work übergeben. So muss Work möglichst nur noch zwingende Sites-/Hosting-/Runtime-Arbeiten, finale Integration und Veröffentlichung durchführen.

**Abgrenzung:** Back03 bleibt für Backend/Auth/#32, Front für Bilder/UX, Research für Produkt-/Rechtsprüfung, Beta Status und AgeLess Tester für unabhängige Qualität zuständig. Bei Bedarf Vorarbeiten abstimmen statt fremde Branches zu überschreiben. Keine Produktivfreigabe, Zahlung, Domain- oder Datenmigration ohne nachgewiesene Voraussetzungen und Betreiberentscheidung.

**Abnahme:** Fertige, nachvollziehbar geprüfte Übergabepakete mit Quellcommit/PR, Artefaktpfad, Tests, offenen Blockern, Rückweg und minimalen verbleibenden **Work-only**-Schritten. Kein automatisches Starten anderer Chats durch GitHub-Kommentar.

## Front

**Rolle:** Produktbilder, Gestaltung, UX/Mobil-Darstellung und Frontend-Inhalte im AgeLess-CI.

**Aktueller Auftrag:** Das gemeldete Paket aus 43 PNG-Dateien (38 Hauptmotive, 5 Varianten) einschließlich tatsächlicher Binärdateien, Manifest/Dateinamen und eindeutigem Produktschlüssel/Stärke über einen *abrufbaren* Repo-Asset-Pfad bzw. anderen geeigneten freigegebenen Übergabekanal an Live04 übergeben. Vorhandene Motive zuerst wiederverwenden, nur Fehlendes neu erstellen. Visuals müssen zu tatsächlichen Vials/Formen passen oder klar als Illustration gekennzeichnet sein. Mobil/Desktop gegen Referenz-CI prüfen.

**Nicht zuständig:** Produktverkaufsfreigaben, Backend-Datenlöschen, alleinige Veröffentlichung.

**Abnahme:** Dateipaket wirklich abrufbar, überprüfbare Dateiliste/Prüfsummen und Zuordnung im Issue #3, Freigabestatus pro Motiv angegeben.

## Back03

**Rolle:** Backend, Admin, Authentifizierung, Berechtigungen, Daten- und Speicherintegrität.

**Aktueller Auftrag:** Sicheren Umstieg auf eine geeignete Lösung ohne Railway vorbereiten, mit e-Xpense/Sites als zunächst privat zu prüfender Hosting-Referenz, ohne den bisherigen Datenbestand anzufassen, bis der vollständige Export und ein Rückweg gesichert sind. Bestehende Betreiber- und Teamrechte unverändert erhalten; APIs und Admin-Login nach Migration prüfen. Bereits integrierte PRs #18/#19 nicht doppelt bearbeiten. **P0:** [Issue #32](https://github.com/VictorHartmann01/ageless-peptides-store/issues/32) – Checkout-Capture-Sperre reparieren und testen; dazu sicheren Daten-/Auth-/Bild-Transfer ohne Supabase-Neuarbeit vorbereiten. Fehlende Produktbilder nicht mit erfundenen URLs kaschieren.

**Nicht zuständig:** Front-Bildgestaltung, ungenehmigte Datenlöschung, automatische Produkt-/Checkout-Freigabe.

**Abnahme:** nachvollziehbare Migration, Tests für Auth/Rechte/Produkteditor/Bildspeicherung, sicherer Rollback; PR-/Commit-/Testnachweis.

## Research

**Rolle:** Stoff- und Produktinformationen, Nachweise und regulatorische Einordnung insbesondere für DE/EU.

**Aktueller Auftrag:** Bestehende Produktausschlüsse (vier entfernte Stoffpositionen) respektieren; Stoffnamen und Stärken/Produktformen aus aktuellen Datensätzen rechtlich und fachlich prüfen, fehlende Nachweise kennzeichnen. GHK-Cu/NAD+ als Vials nicht als zulässige Fertigkosmetik/NEM ausgeben. Für potenziell öffentliche Inhalte quellenbasierte, laienverständliche Sachtexte an Live04 und Front übergeben.

**Nicht zuständig:** eigene Verkehrsfreigabe ohne belastbare SKU-spezifische Prüfung, Datenbestände verändern oder neue Produkte ohne Nutzerauftrag anlegen.

**Abnahme:** je konkretem Produkt belegte Informationen, Quellen/Datum, offene Fragen, eindeutiger Status, Verweis im Issue #3.

## Beta Status

**Rolle:** Unabhängiger Qualitäts-, Veröffentlichungs- und Teststatus.

**Aktueller Auftrag:** Tests zur aktuellen Hosting-/Runtime-Erreichbarkeit, Admin-Login, Produkten/Bildern, Desktop/Mobil, Auth-/Rechte-/Checkout-Gates, PayPal-Sandbox und Regressionen unabhängig dokumentieren. Nicht aus einem erfolgreichen Deploy auf funktionierende Endnutzerabläufe schließen.

**Nicht zuständig:** ungeprüfte Tests als erfolgreich melden oder eigenständig Checkout/Live-Zahlungen aktivieren.

**Abnahme:** tatsächlich ausgeführte Testfälle mit Ergebnissen/Datum/Umgebung; offene Blocker und Freigabeempfehlung an Live04.


## AgeLess Tester

**Rolle:** Neu vom Betreiber ausdrücklich benannte, unabhängige technische Testrolle; exakt als **AgeLess Tester** bezeichnen, keine bestehenden Rollen umbenennen. Vollständiger Auftrag und Rechte: [AGELESS_TESTER_ROLE_2026-11-06.md](AGELESS_TESTER_ROLE_2026-11-06.md), aus PR #31 integriert (Commit `454c7cf5`).

**Aktuelle Priorität:** Private ChatGPT-Sites-Kompatibilitätsprüfung von AgeLess im Zusammenhang mit [PR #30](https://github.com/VictorHartmann01/ageless-peptides-store/pull/30): Next.js SSR/API, Zugriff, Auth/Owner/Admin/Tester, Daten- und Bildpersistenz, Wiederherstellung, Mobile/Desktop, Checkout-Sperren, synthetische Daten. Ergebnisse nur mit echten Testbelegen als PASS/FAIL/NOT TESTED melden.

**Abgrenzung:** **Beta Status** bleibt unverändert zuständig für eigenständigen Qualitäts-/Veröffentlichungs-/Zahlungsgate-Status. AgeLess Tester übernimmt technisch reproduzierbare Tests und Sites-Spezialprüfung; Ergebnisse koordiniert an Beta Status und Teamleader Live04 übergeben. GitHub-Leserechte bedeuten keinen Sites- oder Produktionszugriff. Keine neuen Kosten, Datenmigration, e-Xpense-Modifikation oder Live-Freigabe.

## Start-/Lesequittung für jede bestehende Rolle

Bitte nach dem Lesen unter [GitHub Issue #3](https://github.com/VictorHartmann01/ageless-peptides-store/issues/3) posten:

```text
AGELESS TEAM-ACK
Rolle: [genauer bestehender Name: AgeLess Website Live04 | AgeLess Line Up | Front | Back03 | Research | Beta Status | AgeLess Tester]
Gelesen: AGENTS.md + docs/team/AGELESS_TEAM_ROLES.md + docs/checkpoints/CURRENT.md
Stand/Commit: [aktuelle GitHub-Revision]
Verstanden: eigene Aufgaben, Schutzregeln, keine eigenmächtigen Namensänderungen
Aktuelle Arbeit: [konkrete Aufgabe]
Blocker / benötigte Übergabe: [konkret oder KEINE]
```

Ein reiner Upload, ein GitHub-Issue-Kommentar einer anderen Rolle oder ein Chat-Hinweis ist **keine** Lesequittung einer anderen Rolle. Keine Agentenstarts/automatischen Benachrichtigungen behaupten, bevor deren Ausführung nachgewiesen ist.


## Geprüfte Nachfolge am 07.11.2026

Auf ausdrücklichen Betreiberauftrag übernimmt **AgeLess Website Live04** die bisherige Teamleiterfunktion von **AgeLess Website Live03**. Live03 bleibt historische Quelle, ist nach Integration dieser Übergabe kein aktiver Teamleader. Ausgangsstand: `0d6df29bc8f5c0b4a2f6ac38649123acc0121eb2` auf `beta/highgloss-logo`. Bestehendes Team unverändert: Live04, Front, Back03, Research, Beta Status, AgeLess Tester. Alle früheren Ergebnisse und offenen Aufgaben bleiben erhalten; keine zusätzlichen Chats oder Rollen. Die organisatorische Nachfolge ist keine Shop-/Sicherheits-/Hostingabnahme. Jede andere Rolle bestätigt das Lesen selbst in Issue #3.
