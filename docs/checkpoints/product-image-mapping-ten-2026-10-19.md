# AgeLess – Verbindliche Bild-zu-Produkt-Zuordnung (10 Vorschauartikel)

Freigabe des Betreibers gilt fuer die geschuetzte Shop-Vorschau, NICHT fuer reale Bestellungen. Die folgenden Dateinamen sind die bereitgestellten Chat-Dateien. Sie sind nicht allein durch dieses Mapping nach Supabase Storage hochgeladen.

| Reihenfolge | Supabase-Produktname | Bilddatei | Bildetikett | Kontrollhinweis |
|---|---|---|---|---|
| 01 | Argireline / Acetyl Hexapeptide-8 | Argireline(3).png | Argireline | Exakter Stoffname |
| 02 | GHK-Cu · 50 mg | GHK-Cu(4).png | GHK-Cu | Bild zeigt keine Mengenangabe; auch GHK-Cu 100 mg vorhanden. Nur bei bestaetigter 50-mg-Variante zuordnen. |
| 03 | L-Lysine · food supplement / amino acid | L-Lysin(4).png | L-Lysin | Namenssynonym; Bild als Visualisierung, keine bestaetigte Produktpackung |
| 04 | L-Proline · food supplement / amino acid | L-Prolin(4).png | L-Prolin | Namenssynonym; Bild als Visualisierung |
| 05 | NAD+ · 10 mg | NAD+ 10mg(1).png | NAD+ 10 mg | Staerke passt zum Bild |
| 06 | NAD+ · 500 mg | NAD+ 500mg(1).png | NAD+ 500 mg | Staerke passt zum Bild |
| 07 | Palmitoyl Tripeptide-1 | Palmitoyl-Tripeptide-1(3).png | Palmitoyl Tripeptide-1 | Exakte Zuordnung |
| 08 | Palmitoyl Tetrapeptide-7 | Palmitoyl-Tripeptide-7(3).png | Palmitoyl Tetrapeptide-7 | Dateiname ist irrefuehrend: im Bild steht Tetrapeptide-7, nicht Tripeptide-7 |
| 09 | SNAP-8 / Acetyl Octapeptide-3 · 10 ml | SNAP 8(4).png | SNAP-8 | Dateibild ohne Menge; 10 ml nur Produktdatensatz |
| 10 | Vitamin B12 · 10 ml — Produktform unklar | V B12(4).png | Vitamin B12 10 ml | Menge auf Bild; Produktform weiter ungeklärt |

## Upload und QA
1. Fuer jede der zehn Zeilen exakten Datensatz im Backoffice oeffnen.
2. Passende PNG-Datei in Supabase Storage per berechtigtem Admin-Browser-Upload hochladen (JPG/PNG/WebP bis 5 MB).
3. Vorschaubild und Etikett abgleichen, bei GHK-Cu die mg-Variante nicht ungeprueft behaupten.
4. Auf 'Produkt speichern' klicken und Seite neu laden.
5. Bild-URL im ageless_offers-Datensatz und Bild im geschuetzten /shop/angebote pruefen.
6. catalog_visible kann fuer diese zehn als Vorschau true sein. manual_approved/is_published/Checkout bleiben unangetastet bzw. gesperrt, bis die rechtliche Verkaufsfreigabe konkret belegt ist.
7. Preise/Bestand nur nach bestaetigten Echtdaten setzen, keine Testzahlen als echte Daten ausgeben.

Kein Live-Bild-Upload wird durch diese Dokumentation behauptet.
