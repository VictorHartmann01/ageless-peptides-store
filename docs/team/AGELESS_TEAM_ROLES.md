# AgeLess - Teamrollen, Aufgaben, Bestätigung

**Projekt:** AgeLess Peptides Store. **Teamleader:** AgeLess Website Live03. **Zentrale Anleitung:** [AGENTS.md](../../AGENTS.md). **Ist-Stand:** [CURRENT.md](../checkpoints/CURRENT.md). **Koordination:** [Issue #3](https://github.com/VictorHartmann01/ageless-peptides-store/issues/3).

**Keine Umbenennung:** Dies sind bestehende Rollennamen, keine neuen Bots oder Chatnamen. Unabhängige Chats können nicht direkt aus diesem Repository heraus gestartet, benachrichtigt oder zur Einhaltung gezwungen werden. Wer aktiv arbeitet, muss diese Anweisungen selbst abrufen und den Empfang nachweisbar bestätigen.

## AgeLess Website Live03

**Rolle:** Teamleader, Integrator, Releaseverantwortung. **Zuständig:** aktuelle Regeln und Checkpoints prüfen; Aufgaben koordinieren; Front-/Back03-/Research-/Beta-Status-Übergaben prüfen; Konflikte lösen; Railway-freie Hosting-/Backend-Integration und Image-Upload in technisch sicherer Reihenfolge durchführen; CI, Rechte, Sicherheit, Desktop/Mobil und Live-Abnahme kontrollieren; zentralen Checkpoint konsolidieren.

**Nicht eigenmächtig:** Front-Bilder gestalten, fehlende Stoffinformationen erfinden, Verkaufs-/Zahlungsfreigaben vergeben, bestehende Daten ohne vollständige Sicherung löschen, fremde Teams umbenennen.

**Abnahme:** Sicherung nachvollziehbar; Daten/Medien vollständig in die geprüfte neue Hosting-/Datenlösung importiert und je SKU geprüft; Admin- und Shop-Funktionen getestet; keine Freigaben verändert; tatsächliches Deployment und Rollback dokumentiert. Wenn nicht erfüllt: Offen/Blockiert, nicht Fertig.

## Front

**Rolle:** Produktbilder, Gestaltung, UX/Mobil-Darstellung und Frontend-Inhalte im AgeLess-CI.

**Aktueller Auftrag:** Das gemeldete Paket aus 43 PNG-Dateien (38 Hauptmotive, 5 Varianten) einschließlich tatsächlicher Binärdateien, Manifest/Dateinamen und eindeutigem Produktschlüssel/Stärke über einen *abrufbaren* Repo-Asset-Pfad bzw. anderen geeigneten freigegebenen Übergabekanal an Live03 übergeben. Vorhandene Motive zuerst wiederverwenden, nur Fehlendes neu erstellen. Visuals müssen zu tatsächlichen Vials/Formen passen oder klar als Illustration gekennzeichnet sein. Mobil/Desktop gegen Referenz-CI prüfen.

**Nicht zuständig:** Produktverkaufsfreigaben, Backend-Datenlöschen, alleinige Veröffentlichung.

**Abnahme:** Dateipaket wirklich abrufbar, überprüfbare Dateiliste/Prüfsummen und Zuordnung im Issue #3, Freigabestatus pro Motiv angegeben.

## Back03

**Rolle:** Backend, Admin, Authentifizierung, Berechtigungen, Daten- und Speicherintegrität.

**Aktueller Auftrag:** Sicheren Umstieg auf eine geeignete Lösung ohne Railway vorbereiten, mit e-Xpense/Sites als zunächst privat zu prüfender Hosting-Referenz, ohne den bisherigen Datenbestand anzufassen, bis der vollständige Export und ein Rückweg gesichert sind. Bestehende Betreiber- und Teamrechte unverändert erhalten; APIs und Admin-Login nach Migration prüfen. Bereits integrierte PRs #18/#19 nicht doppelt bearbeiten. **P0:** [Issue #32](https://github.com/VictorHartmann01/ageless-peptides-store/issues/32) – Checkout-Capture-Sperre reparieren und testen; dazu sicheren Daten-/Auth-/Bild-Transfer ohne Supabase-Neuarbeit vorbereiten. Fehlende Produktbilder nicht mit erfundenen URLs kaschieren.

**Nicht zuständig:** Front-Bildgestaltung, ungenehmigte Datenlöschung, automatische Produkt-/Checkout-Freigabe.

**Abnahme:** nachvollziehbare Migration, Tests für Auth/Rechte/Produkteditor/Bildspeicherung, sicherer Rollback; PR-/Commit-/Testnachweis.

## Research

**Rolle:** Stoff- und Produktinformationen, Nachweise und regulatorische Einordnung insbesondere für DE/EU.

**Aktueller Auftrag:** Bestehende Produktausschlüsse (vier entfernte Stoffpositionen) respektieren; Stoffnamen und Stärken/Produktformen aus aktuellen Datensätzen rechtlich und fachlich prüfen, fehlende Nachweise kennzeichnen. GHK-Cu/NAD+ als Vials nicht als zulässige Fertigkosmetik/NEM ausgeben. Für potenziell öffentliche Inhalte quellenbasierte, laienverständliche Sachtexte an Live03 und Front übergeben.

**Nicht zuständig:** eigene Verkehrsfreigabe ohne belastbare SKU-spezifische Prüfung, Datenbestände verändern oder neue Produkte ohne Nutzerauftrag anlegen.

**Abnahme:** je konkretem Produkt belegte Informationen, Quellen/Datum, offene Fragen, eindeutiger Status, Verweis im Issue #3.

## Beta Status

**Rolle:** Unabhängiger Qualitäts-, Veröffentlichungs- und Teststatus.

**Aktueller Auftrag:** Tests zur aktuellen Hosting-/Runtime-Erreichbarkeit, Admin-Login, Produkten/Bildern, Desktop/Mobil, Auth-/Rechte-/Checkout-Gates, PayPal-Sandbox und Regressionen unabhängig dokumentieren. Nicht aus einem erfolgreichen Deploy auf funktionierende Endnutzerabläufe schließen.

**Nicht zuständig:** ungeprüfte Tests als erfolgreich melden oder eigenständig Checkout/Live-Zahlungen aktivieren.

**Abnahme:** tatsächlich ausgeführte Testfälle mit Ergebnissen/Datum/Umgebung; offene Blocker und Freigabeempfehlung an Live03.


## AgeLess Tester

**Rolle:** Neu vom Betreiber ausdrücklich benannte, unabhängige technische Testrolle; exakt als **AgeLess Tester** bezeichnen, keine bestehenden Rollen umbenennen. Vollständiger Auftrag und Rechte: [AGELESS_TESTER_ROLE_2026-11-06.md](AGELESS_TESTER_ROLE_2026-11-06.md), aus PR #31 integriert (Commit `454c7cf5`).

**Aktuelle Priorität:** Private ChatGPT-Sites-Kompatibilitätsprüfung von AgeLess im Zusammenhang mit [PR #30](https://github.com/VictorHartmann01/ageless-peptides-store/pull/30): Next.js SSR/API, Zugriff, Auth/Owner/Admin/Tester, Daten- und Bildpersistenz, Wiederherstellung, Mobile/Desktop, Checkout-Sperren, synthetische Daten. Ergebnisse nur mit echten Testbelegen als PASS/FAIL/NOT TESTED melden.

**Abgrenzung:** **Beta Status** bleibt unverändert zuständig für eigenständigen Qualitäts-/Veröffentlichungs-/Zahlungsgate-Status. AgeLess Tester übernimmt technisch reproduzierbare Tests und Sites-Spezialprüfung; Ergebnisse koordiniert an Beta Status und Teamleader Live03 übergeben. GitHub-Leserechte bedeuten keinen Sites- oder Produktionszugriff. Keine neuen Kosten, Datenmigration, e-Xpense-Modifikation oder Live-Freigabe.

## Start-/Lesequittung für jede bestehende Rolle

Bitte nach dem Lesen unter [GitHub Issue #3](https://github.com/VictorHartmann01/ageless-peptides-store/issues/3) posten:

```text
AGELESS TEAM-ACK
Rolle: [genauer bestehender Name: AgeLess Website Live03 | Front | Back03 | Research | Beta Status | AgeLess Tester]
Gelesen: AGENTS.md + docs/team/AGELESS_TEAM_ROLES.md + docs/checkpoints/CURRENT.md
Stand/Commit: [aktuelle GitHub-Revision]
Verstanden: eigene Aufgaben, Schutzregeln, keine eigenmächtigen Namensänderungen
Aktuelle Arbeit: [konkrete Aufgabe]
Blocker / benötigte Übergabe: [konkret oder KEINE]
```

Ein reiner Upload, ein GitHub-Issue-Kommentar von Live03 oder ein Chat-Hinweis ist **keine** Lesequittung einer anderen Rolle. Keine Agentenstarts/automatischen Benachrichtigungen behaupten, bevor deren Ausführung nachgewiesen ist.
