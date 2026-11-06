# AgeLess - Bestand alter Produktbild-ZIP (Prüfung 06.11.2026)

Quelle: vom Betreiber bereitgestellte Datei `AgeLess_Bilder_Substanznamen.zip` (lokal eingesehen). **Diese Liste ist keine bestätigte Übergabe des angekündigten 43-PNG-Pakets und keine Verkaufsfreigabe.**

## Ergebnis

- ZIP-Einträge: **26 PNG**
- Inhaltlich verschiedene Binärdateien laut SHA-256: **21**
- Identische Dublettenpaare: **5**
- Bilder sind Produktillustrationen; konkrete Stoffmenge, Produktform, Verpackung und Rechtsstatus jeweils vor Veröffentlichung separat verifizieren.
- Bestehende Bilder nicht erneut erzeugen; Front überprüft Qualitäts- und SKU-Zuordnung und liefert das fehlende Paket.

## Dubletten (hash-identische Inhalte)

| Originalname 1 | Originalname 2 | SHA-256 Präfix |
|---|---|---|
| Argireline Acetyl Hexapeptide-8.png | Argireline.png | `34c95d822ad3` |
| Palmitoyl Tetrapeptide-7.png | Palmitoyl-Tripeptide-7.png | `88e51e532244` |
| Palmitoyl Tripeptide-1.png | Palmitoyl-Tripeptide-1.png | `3596c44c22ff` |
| SNAP 8.png | SNAP-8.png | `333662d6c90b` |
| V B12.png | Vitamin B12 10 ml.png | `260826726439` |

**Achtung:** `Palmitoyl-Tripeptide-7.png` ist die gleiche Datei wie `Palmitoyl Tetrapeptide-7.png`, aber dieser Name ist fachlich irreführend. Keine automatische Stoff-Zuordnung über diesen Dateinamen.

## 21 verschiedene Dateien / Stoffbezeichnungen aus ZIP

| Bilddatei (kanonische Originalbezeichnung) | SHA-256 Präfix |
|---|---|
| AgeLess PT-141 Luxury Supplement Vial.png | `376ec49f844c` |
| Argireline Acetyl Hexapeptide-8.png | `34c95d822ad3` |
| BPC-157.png | `d396de236a57` |
| CJC-1295.png | `3ee7295cf6d9` |
| GHK-Cu.png | `a14abf8d8043` |
| GHRP-6.png | `0211387bd646` |
| HCG.png | `b9e26c6a6d64` |
| IGF-1 LR3.png | `7ebf414e6a6d` |
| Ipamorelin.png | `689e4581e0d8` |
| L-Lysin.png | `61ea8aad5119` |
| L-Prolin.png | `8bd6f26e32e1` |
| NAD+ 10 mg.png | `dba04cbf60c4` |
| NAD+ 500 mg.png | `023bb947b2ff` |
| Oxytocin.png | `fb7bee47f3e2` |
| Palmitoyl Tetrapeptide-7.png | `88e51e532244` |
| Palmitoyl Tripeptide-1.png | `3596c44c22ff` |
| Semax.png | `786f049061de` |
| SNAP 8.png | `333662d6c90b` |
| SS-31.png | `5a6a56478fc9` |
| TB-500.png | `6cfef3596bfd` |
| Vitamin B12 10 ml.png | `260826726439` |

## Noch nicht nachgewiesen

- Neue **43-PNG-Front-Übergabe** mit echten Dateien, vollständigen Checksums und SKU-/Varianten-ID.
- Tatsächliche Übertragung aller Dateien in Railway-Bucket.
- Erhalt des aktuell vollständigen Produkt- und Benutzerbestands inklusive Backup und Migration in Railway PostgreSQL.
- Durchgehend korrekte Darstellung je SKU, korrektes Vial bzw. klar als Illustration bezeichnet.

**Koordination:** Front [Issue #21](https://github.com/VictorHartmann01/ageless-peptides-store/issues/21), Live03 [Issue #3](https://github.com/VictorHartmann01/ageless-peptides-store/issues/3).
