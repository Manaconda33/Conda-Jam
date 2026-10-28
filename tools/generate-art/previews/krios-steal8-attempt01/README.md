# J.128 Krios `steal` attempt01

Status: original source and cleanup/layout proof pass; gameplay track/timing review and production registration are pending.

- Exact prompt, generation ID, timestamp, raw-source hash, and image-generation metadata: `tools/generate-art/krios-steal8-attempt01-provenance.json`.
- Immutable source: `tools/generate-art/sources/krios-steal8-attempt01-generated-raw.png`.
- Source-only identity/pose review: `INDEPENDENT_SOURCE_REVIEW.md`.
- Component-isolation cleanup: `tools/generate-art/clean-krios-steal8-attempt01.py`.
- Cleanup metrics, source component bounds, logical margins, native layout, and alpha/color checks: `cleanup-layout-report.json` and `runtime-layout.json`.
- The light/dark previews and eight individual keyed pose crops are derived proofs; they do not redraw or invent any poses.
- The 1024×96 runtime candidate has eight 128×96 cells, a uniform 0.26 source scale, nearest-neighbor resize, and shared baseline y=94.
- No basketball is baked into the art. A separate Krios-specific track must align the empty C-shaped grab hand at frame3/tick5, then gameplay releases the ball into loose-ball physics.

The raw sheet's figures cross nominal grid edges and its green varies. Cleanup isolates eight connected figures, preserves their complete silhouettes, clears green from the alpha edge, and fits them into 4×2 logical cells with at least 24px margins. The gameplay candidate remains unregistered until an independently reviewed Krios track and actual Jam Stage checks pass in both facings.
