# J.07 Kraken `shoot` attempt01

Status: raw source and cleanup/layout reviews pass for gameplay trials only. No atlas is registered and no ball track is accepted.

- Exact prompt, ImageGen artifact ID, UTC timestamp, requested/actual dimensions, reference asset hashes, and raw-source hash: `tools/generate-art/kraken-shoot10-attempt01-provenance.json`.
- Immutable raw RGB source: `tools/generate-art/sources/kraken-shoot10-attempt01-generated-raw.png` (1254×1254, despite requested 1536×1536).
- Independent raw-source review: `INDEPENDENT_SOURCE_REVIEW.md`. Independent cleanup review: `INDEPENDENT_CLEANUP_REVIEW.md`.
- Range-key/component isolation cleanup: `tools/generate-art/clean-kraken-shoot10-attempt01.py`.
- Exactly ten separate pose crops and a 4×3 logical proof are retained in `poses/` and `kraken-shoot10-attempt01-logical-layout.png`.
- The 400×192 transparent runtime candidate packs ten 80×96 cells in a 5×2 atlas, with one nearest-neighbor source scale (`0.222`) and shared y=94 baseline. Blank raw-grid cells are not packed.
- `cleanup-layout-report.json` records source component bounds, green key/edge cleanup, raw/derived hashes, ten unique frame hashes, 24px logical cell margins and zero opaque green-dominant native pixels.
- Light and dark previews are included. No basketball is baked into the art; a separate Kraken-specific shot track and current-court release review remain required.

The raw export missed its requested dimensions and several source cell margins. Cleanup crops the ten isolated figures from the raw sheet without redrawing, then fits them uniformly into reviewed transparent cells. Keep the clip unregistered until independent ball-track calibration and actual Jam Stage runtime checks pass.
