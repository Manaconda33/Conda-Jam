# Kraken J.07 `pickup` — attempt03 source intake

- ImageGen generation ID: `exec-8b97fb33-86c2-4f42-90d6-6bfd4ac91265`.
- Exact prompt and raw source are preserved in the adjacent prompt/provenance files and `tools/generate-art/sources/kraken-pickup5-attempt03-generated-raw.png`.
- Raw RGBA dimensions are 1983×793, SHA-256 `83d8654cd2bfe24303705f7476369c11691cd5968d0d1891f33114e4cfacdd1d`.
- The visual source shows five full-body Kraken poses: reach, deep crouch, low reach, ankle-height empty-hand grab, and recovery mime. It appears to have much more lower-cell clearance than attempt02.
- Alpha histogram: 1,169,154 fully transparent pixels; 402,956 partially transparent pixels; 409 fully opaque pixels. The widespread partial alpha requires segmentation/cleanup review before any normalization.
- Independent source review passes this sheet for careful cleanup/layout trials only. The original conclusion that atlas-only normalization cannot safely create extra bottom margin applied under the previous y=94 baseline convention.
- Cleanup/layout trial cleanup01 now uses the optional clip `baselineY=90` offset: five per-pose crops are isolated from alpha-connected figure components, scaled uniformly with nearest-neighbor sampling, placed with soles at y=90 in 80×96 frames, and leave six transparent rows below. See `clean-and-layout.py`, `cleanup01-layout.json`, and `candidate-metadata.json`.
- Original RGB values are preserved. Alpha cleanup retains only each principal component and a 1.5px source fringe. Light/dark previews are saved at native size and 4× nearest-neighbor.
- The cleanup is not independently reviewed yet. Pose3's empty ankle-height grab clarity, style at runtime size, and baseline transition need independent confirmation. No track or runtime registration is accepted.
