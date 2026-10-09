# AgeLess: finale vier WebP-Bilder (Stand 09.10.2026)

**Status: Bilddateien extern im Chat erzeugt und geprüft, noch NICHT in GitHub gespeichert.**

Der Bildsatz stammt ausschließlich aus dem textfreien, im AgeLess-Beta-Front-Chat erzeugten Viererbild. **Keine Unsplash-Ersatzbilder als finale Bilder ausgeben.**

## Erwartete Dateien unter `public/images/ageless/`

| Datei | Abmessungen | SHA-256 |
|---|---|---|
| `hero-couple.webp` | 915 × 466 | `TO_BE_VERIFIED_ON_UPLOAD` |
| `category-peptides.webp` | 540 × 451 | `4f76614120783e1567b9ccf8fbd614925bc25ea7ff1a701a1cc9240955b2e1bb` |
| `category-nad-longevity.webp` | 555 × 451 | `31e266924b9ed5079cf4ed31ffb91fc154f5ec22919b372fba6b5e14128d89c3` |
| `category-essentials.webp` | 558 × 451 | `55c844c97e95ab40977b8cff57719e79df9195346811b875aee1ac320c6d9d55` |

Die WebP-Dateien wurden lokal erzeugt und in einem ZIP-Paket `AgeLess_4_WebP_Bilder.zip` bereitgestellt. Die aktuelle GitHub-Integration in `app/page.tsx` referenziert diese Pfade und nutzt bestehende externe Bilder als **Fallback**, solange die lokalen WebP-Dateien noch fehlen.

**LIVE-Verantwortung:** Die vier Original-WebP-Dateien aus dem ZIP exakt nach `public/images/ageless/` übernehmen; SHA-256 prüfen; auf Desktop und Smartphone im Browser kontrollieren; erst danach als fertig melden.

**Nicht tun:** Die Fotos stillschweigend durch andere Unsplash-URLs, KI-Mockups oder Bilder mit eingebrannten Texten ersetzen.
