# AgeLess: Railway-Ersatz nach dem Vorbild e-Xpense – technischer Entscheid und Testauftrag

**Rolle:** Back03 | **Datum:** 06.11.2026 | **Status:** Technische Vorprüfung abgeschlossen; Sites-Kompatibilität/Hosting **NICHT GETESTET**; kein produktiver Wechsel.

## 1. Nachgewiesener Vergleich

**e-Xpense Report:** Das separate Team-Repository `VictorHartmann01/e-xpense-report-team`, Datei `status/apps.json`, dokumentiert für e-Nable eine ChatGPT-Sites-Produktionsinstanz `appgprj_6ad889ff00d481919553122f9baf1c28`, zuletzt dort Version 40 (Verifikationszeitpunkt 04.11.2026), plus Domain `www.e-xpense.report`. Das Team-Repo ist **Koordinationsquelle**, nicht der vollständige produktive Site-Quellcode.

**AgeLess:** Repo `VictorHartmann01/ageless-peptides-store`, aktiver Integrationsbranch `beta/highgloss-logo`. Next.js 16.3.8 / React 19.3.0. Echte serverseitige APIs und bestehende Supabase-Abhängigkeiten. Railway-Domain `www.ageless-peptides.store` zuletzt nicht erreichbar. Railway-Redeploy am 06.11. scheiterte mit `Your trial has expired. Please select a plan to continue using Railway`; DNS und Zertifikat sind nicht der bestätigte Fehler. Railway-Postgres und Railway-S3 sind vorhanden, aber keine vollständige Produktdatenmigration belegt.

## 2. Eignung der möglichen Ziele

| Hostingoption | Pluspunkt | Harte Grenze | Entscheidung |
| --- | --- | --- | --- |
| **ChatGPT Sites** (e-Xpense-Vorbild) | Bereits bei e-Xpense genutzte verwaltete Sites-Laufzeit, Domain-/Datei-/Datenbankfunktionen, externer Zahlungsdienstleister grundsätzlich möglich | Nicht jede Next.js-/Node-Architektur garantiert kompatibel; Workspace-/Nutzungslimits; keine integrierte vollständige kombinierte DB+Datei-Sicherung/Restore; Datenresidenz gesondert prüfen | **Zuerst eine private, nichtverkaufende Machbarkeitsprobe**, nicht sofort Produktion |
| **Cloudflare Workers/Assets** | Gratisgrenzen für statische Inhalte, globale Edge-Laufzeit | Workers Free: 10 ms CPU/Request; serverseitiges Next.js und Auth müssen auf Kompatibilität/Last getestet werden | Reserveoption, kein versprochener Vollersatz zum Nulltarif |
| **Gemeinsamer VPS (z. B. Hetzner) + Coolify** | Next.js/Node/Postgres/S3-kompatible Services mit eigener Betriebssteuerung; für mehrere Projekte nutzbar | Monatliche Kosten und Server-/Backuppflichten, ein einzelner VPS ist kein HA-System | **Produktions-Fallback**, wenn Sites die Daten-, Sicherheits- und Wiederherstellungsanforderungen nicht erfüllt |
| **Netlify Free** | Einfacher Next.js-Deploy | Credit-Obergrenze kann Website bis zur nächsten Periode pausieren | Nicht als ausfallsichere Dauerlösung auswählen |

Offizielle laufend änderbare Referenzen:
- https://help.openai.com/en/articles/20001339-creating-and-using-chatgpt-sites
- https://learn.chatgpt.com/docs/sites
- https://developers.cloudflare.com/workers/platform/limits/

**Hinweis:** Sites-Tarif, Nutzungskosten, Berechtigung, Datenstandort und tatsächliche Kompatibilität dieses konkreten Projekts sind noch nicht verifiziert. Keine Gratis-, DSGVO-, Verfügbarkeits- oder Wiederherstellungsgarantie.

## 3. AgeLess-Backend-Inventur, direkt aus dem Repo geprüft

| Funktion | Nachweis im Quellcode | Migrations-/Testbedarf |
| --- | --- | --- |
| Öffentliches Next.js/SSR | `app/page.tsx` importiert `getAdminClient`; zeigt nur freigegebene Angebote | Datenadapter oder verifizierte sichere serverseitige Verbindung erforderlich; kein statischer Export als gleichwertiger Shop |
| Kundenlogin und Sitzungen | `app/login/page.tsx`, `proxy.ts` mit `@supabase/ssr` und Zugriffstabelle `ageless_tester_access` | Sessions, E-Mail-Verifizierung, Testerkontrolle und Trennung zum Admin vollständig neu abnehmen |
| Admin und Produkteditor | `app/admin/page.tsx`, `app/api/admin/route.ts` | Rechte, Optimistic Concurrency, Speicherrückmeldung, Rechts-/Verkaufsfreigaben und Preis/Bestand erhalten |
| Produktbilder | `app/api/admin/image-upload/route.ts` nutzt bestehenden Storage und speichert URL | Binärdateien per ID/Hash sichern, Upload/MIME-/Größenprüfung, Zuordnung und Wiederherstellbarkeit testen |
| Zahlungen | `app/api/checkout/create/route.ts`, `app/api/checkout/capture/route.ts`, `lib/commerce/server.ts` | PayPal ausschließlich via externem Dienst; bestehendes `AGELESS_CHECKOUT_ENABLED` sowie Legal-/Lager-Gates **unverändert aus** |
| Daten | `lib/commerce/server.ts`, Admin-/Tester-/Bestelltabellen | Vollständiger aktueller Quell-Export inkl. Schema/Rollen, Auth und Binärdateien fehlt noch; **keine neue Supabase-Abfrage erlaubt** |
| Routing/Zugang | `proxy.ts` | Shop bei anonymer Anfrage geschlossen, `/admin` nur Admin, Checkout sicher gesperrt |
| Betrieb | Railway projekt-/serviceseitig registriert | DNS erst nach unabhängiger Live-Funktionsprüfung umstellen; Monitoring und Rückweg erforderlich |

Die vier früher ausgeschlossenen, unklar identifizierten Produkte nicht erneut einfügen. Historisch 46 Angebote sind **keine bestätigte aktuelle Exportanzahl**.

## 4. Konkreter erster Umsetzungspfad: ChatGPT Sites **nur als Testziel**

1. **Keine neue AgeLess-Produktivseite starten:** Quellcode und bewährtes CI/Corporate Design aus bestehendem Repository wiederverwenden. In ChatGPT Work / Sites die Kompatibilitätsprüfung eines **privaten** lokalen/GitHub-Projekts durchführen; ein bloß kopierter Designentwurf ist kein gültiger Test.
2. In einer **isolierten Testumgebung ohne echte Nutzer-/Bestelldaten** die Plattformfunktionen prüfen: Next.js-SSR, Route-Handler, Laufzeitumgebung, Dateiupload, Sessions und Domainfähigkeit. Keinen Checkout aktivieren.
3. WENN vollständige Funktionsparität auf Sites nicht wirtschaftlich/sicher möglich: **Abbruch von Sites als AgeLess-Shophosting** und Self-hosted-VPS/Managed-Hosting-Vergleich. Keine halbfertige öffentliche Nachbildung.
4. Für jede weitere Migration vorher verschlüsselten, aktuellen und vollständigen Daten-/Bild-/Auth-Export durch berechtigte Projektverantwortliche beschaffen. **Kein neuer Supabase-Zugriff durch Back03; kein Export aus historischen ZIPs vortäuschen.**
5. Datenhaltung, Adminrollen, Sessions, Backup/Restore und rechtliche Freigabegates mit produktionsnahen anonymisierten Testfällen prüfen. Ein Source-Code-Rollback allein stellt weder Datenbank noch Medien wieder her.
6. Live03 übernimmt Integration, bewiesenen Deployment-Status, Desktop-/Mobile- und HTTP-Funktionstests; **erst nach Freigabe** DNS-Cutover mit kontrolliertem Rückweg und externem Domain-Monitoring.

## 5. Vor einer produktiven Sites-Entscheidung zwingend nachweisen

- Der Workspace erlaubt **öffentliche** Sites und individuelle Domain. Plan-/Nutzungslimits und Kosten kontrolliert.
- Tatsächlicher Next.js-16-App-Router-/Route-Handler-Build und Runtime-Kompatibilität; keine nicht unterstützten Node-/TCP-Annahmen.
- Sicherer Export **und Restore** aller Produkt-/Kunden-/Bestell-/Auth-/Bilddaten (kein automatisch vorhandenes Sites-Backup behaupten).
- Personenbezogene Daten/Datenschutz: gültige Auftragsverarbeitungs- und Speicherortbedingungen durch Betreiber bewerten; **keine Gesundheitsdaten** in Sites.
- Customer-/Admin-/Owner-/Tester-Isolation incl. direkte API-Zugriffe, Sessions, Passwort-Reset und E-Mail-Zustellung.
- Explizite Non-Sale-Tests: nicht legal freigegebene Vials im öffentlichen Shop unsichtbar/nicht bestellbar; keine echte PayPal-Live-Zahlung.
- Ausfall- und Release-/Rollback-Tests: Domain, Backend, Assets, Daten, Monitoring, Backups, Kostenrisiken.
- Alternative für geschäftskritische Laufzeit, falls Sites-Publikumslimits greifen.

## 6. Aufgaben und offene Abhängigkeiten

- **Back03:** vorhandene Codepfade/Anforderungen inventarisiert; sichere Adapter-/Testumgebung erst nach geklärter Zielplattform und Export bauen.
- **Live03:** vom Betreiber gewollten Zielwechsel im zentralen `CURRENT.md` konsolidieren, kontrollierte private Sites-Probe im vorhandenen Work-/Sites-Kontext durchführen und Ergebnis mit echtem URL/Build/Testnachweis melden.
- **Front:** keine neuen Bilder erzwingen; 43er-Paket und SKU-Mapping aus Issue #21 weiter abgleichen.
- **Research/Beta Status:** bestehende Rechts- und Testzuständigkeit beibehalten.
- **Betreiber:** Entscheidung zu externen Kosten und ggf. notwendigen Work-/Sites-Zugriffsrechten; keine Zahlung oder Domainänderung ohne Auftrag.

**Ergebnis dieser Stufe:** Architekturvergleich und konkreter Test-/Abnahmeweg. **Nicht** umgesetzt: Sites-Deployment, Datenmigration, Auth-Übernahme, Domainwechsel oder Live-Abnahme.
