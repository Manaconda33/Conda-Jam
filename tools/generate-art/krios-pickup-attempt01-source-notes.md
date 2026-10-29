# J.128 Krios `pickup` source candidate — attempt01

## Status

Attempt01 was independently accepted for separate-ball track calibration after cleanup01 and packed-atlas review. It remains unregistered until its athlete-specific ball track and gameplay integration pass.

## Provenance and files

- Exact prompt: `tools/generate-art/krios-pickup-attempt01-prompt.md` (verbatim SHA-256 `33d11364bf099f84a1ed484b0dc15436097581f05d595f31c714c60803d56087`)
- ImageGen/C2PA generation ID: `c2pa:ada022b4-e0f0-42c7-840e-8b83a2e58c79`
- Raw image: `tools/generate-art/sources/krios-pickup-attempt01-generated-raw.png` (1536×1024 RGBA; SHA-256 `2de5645d90e08c61435c2d68f3ab11801299044655e988e33defbfaa829c0d77`)
- Layout: `tools/generate-art/krios-pickup-attempt01-layouts.json`
- Light/dark and grid previews: `tools/generate-art/previews/krios-pickup-attempt01/`
- Machine-readable provenance: `tools/generate-art/krios-pickup-attempt01-provenance.json`

## Independent review and cleanup

Source review approved five distinct poses, Krios identity/anatomy, sequence, and no-ball art for cleanup/packing trials. Cleanup01 set alpha below96 to transparent and remaining visible alpha to opaque without changing RGB; it removed haze, leaving five components. Independent packed-atlas review superseded an initial false-positive rejection: the suspected white streak is transparent negative space between arm and shorts, not painted pixels. The packed 128×96 cells have 9–24px horizontal margins, 4px minimum top margin, a common y94 baseline, and empty frame6. The smooth modeled shading reads clearly at gameplay scale and is consistent with Krios's other shaded action art. Accepted for separate-ball track calibration only; runtime registration awaits gameplay track review.

Attempts02 and03 requested a localized removal of the suspected defect but introduced red/black glow backdrops. Both whole sheets are preserved and rejected; no pixels from them were used.
