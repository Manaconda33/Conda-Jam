# Kraken J.07 `shoot` — attempt01 source preparation

The exact ImageGen prompt is [`tools/generate-art/kraken-shoot10-attempt01-imagegen-prompt.txt`](../../kraken-shoot10-attempt01-imagegen-prompt.txt). It follows the ten-pose `shoot` definition in `tools/generate-art/pose-catalog.json`: frame starts at ticks 0, 3, 6, 8, 10, 13, 14, 16, 19 and 23; takeoff is frame 2/tick 6, release and peak are frame 5/tick 13, and finish is frame 9/tick 23. The atlas is right-facing and uses approved Kraken art only as an identity/style reference.

## Canon and visual references

Kraken is an adult male elf with natural skin, short dark hair, long pointed ears and a calm refined face. His court look uses burgundy/black kit, copper trim and the small copper Cthulhu-themed amulet. The canonical default excludes tentacles, blue skin and monster anatomy. Sources to attach as ImageGen references: `public/assets/animation/kraken-idle-right.webp`, `public/assets/animation/kraken-run-right.webp`, and `public/assets/animation/kraken-block-right.webp`. The first two establish the current captain identity and court rendering; the block sheet establishes the latest cleanup/layout style. Keep the invisible basketball out of the athlete art; ball position and release belong to a separately reviewed runtime track.

## Required provenance and acceptance record

On generation, preserve the verbatim prompt above, its SHA-256, ImageGen tool generation ID (and C2PA ID if available), UTC generation time, tool/model metadata if supplied, raw source image and SHA-256, dimensions, and reference asset paths/hashes. If the export has no C2PA metadata, record that fact and retain the tool artifact ID; do not invent provenance. Keep each rejected generation and its reason alongside the selected raw source. Record cleanup script/method and reports, source/layout JSON, transparent and runtime-size outputs with hashes, cell margins, frame hashes, layout/calibration notes, light/dark and enlarged previews, and independent source/atlas reviews. The raw source must remain unchanged. Do not register or label the clip accepted until all ten complete, distinct poses pass identity/anatomy, separation, key cleanup, margins, baseline, alignment and mirroring review, and the separately calibrated ball track passes current-court runtime checks for both facings and required gameplay anchors.

This preparation task has not generated an image and makes no runtime or manifest changes.


## Generated attempt01 source status

ImageGen artifact `exec-20014507-d570-42f5-9ad7-6c2f9e4c6b03` produced the preserved 1254×1254 RGB sheet at 2026-10-28T05:58:48Z. This differs from the prompt's requested 1536×1536. The exported PNG contains no embedded C2PA/other metadata; tool artifact ID is retained. The independent raw-source review allows component-isolated cleanup/layout trials only and calls out tight/overflowing cell margins, varied near-green matte, and the need to prove frames4/5 remain distinct at native size. See `tools/generate-art/kraken-shoot10-attempt01-provenance.json` and `INDEPENDENT_SOURCE_REVIEW.md`.
