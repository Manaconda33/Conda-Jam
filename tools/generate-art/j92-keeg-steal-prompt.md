# J.92 — Keeg steal

## Action and identity

Eight distinct right-facing defensive steal poses for Keeg, canonical K.03. His extremely tall purple witch hat with silver trim and mushroom ornaments, black hair, neat close black beard, athletic adult human anatomy, layered lavender/purple/silver basketball kit, and purple/silver sneakers stay consistent. The separate game basketball meets the forward hand at frame3 / tick5; after a successful steal, the runtime track brings it inward as Keeg recovers. The image contains no ball.

## Generation history

- Rejected generation `exec-0fb2940f-e182-4d3e-91ad-566b017b4b55`, raw source `tools/generate-art/sources/j92-keeg-steal-generated-raw.png`, SHA-256 `16784da4353426426c5816a2008c69f5964496998e6f6f812889184f2104a175`. Its poses were oversized; silhouettes reached across the nominal 4×2 cell cuts, contaminating neighboring crops and leaving no safe atlas gutters.
- Accepted corrected generation `exec-cd98fa0d-cfb1-4510-baf5-efbae001ed87`, raw source `tools/generate-art/sources/j92-keeg-steal-generated-correction-raw.png`, SHA-256 `3f20daf217f7f8aad3351c8c96a955c56871fdb6d310c99f083f6d3172878b5f`.
- Cleanup script `tools/generate-art/clean-keeg-steal8.py` identified eight complete separated body components, removed pixels owned by adjacent components, uniformly scaled and bottom-aligned each complete figure into its own 384×512 output cell, preserving aspect ratio and at least34 transparent pixels on all sides. No hand, hat, shoe or detached component was cropped. The accepted source `tools/generate-art/sources/j92-keeg-steal8.png` is SHA-256 `9c7865fb84ca4b2c2c44dc12497e7b4c60f0d82234cd309fcd9f102e6b7cdd54`. Per-pose raw/clean bounds and scale are recorded in `tools/generate-art/j92-keeg-steal-cleanup-layout.json`.

## Exact accepted generation prompt

> Create one production sprite atlas for JAMVERSE '96, transparent RGBA, exact canvas 1536x1024. Arrange exactly eight distinct full-body drawings in an exact 4-column by2-row grid, each cell 384x512, read left-to-right across the top row, then the bottom row. Each entire athlete silhouette must fit inside the central rectangle of its cell, maximum width 240 px and maximum height 370 px, with at least72 px left/right transparent gutter and60 px top/bottom transparent margin. Keep figures clearly separated; no part of one figure may enter a neighboring cell. Keep every hat tip, hand and shoe visible. No grid lines, cells, marks, captions, background, floor, court, hoop, shadows or special effects; all space outside the figures is genuine transparency.
>
> The same original character in all eight cells: Keeg, flamboyant adult male human witch, natural athletic human build, black hair, close neatly trimmed black beard, very tall ornate purple witch hat with silver trim and small mushrooms, layered lavender/purple/silver basketball uniform with subtle jewelry/belts and mushroom motifs, purple/silver sneakers. Preserve this identity and colors exactly across poses; keep full hat recognizable, human anatomy correct and proportionate. Both hands empty. Never draw a basketball; it is separate game art.
>
> 8 sequential defensive steal poses: 0 grounded alert stance, knees flexed and hands ready; 1 weight shift forward; 2 low lateral shuffle with near hand beginning a swipe; 3 at the steal contact, a decisive forward lunge with one open hand extended low-to-mid height toward the right, feet grounded and balanced; 4 curl the reaching arm inward as if securing the unseen ball while the other hand shields; 5 draw both elbows toward the chest and begin recovery; 6 step back into defense; 7 ready stance. The action reads as a quick basketball steal attempt and recovery, not a block, pass, shoot or dunk. The contact is frame3. Every pose must be unique and complete, consistent character scale and clear silhouette. Facing right in all frames. Use substantial transparent separation on all sides of every cell; make the athlete smaller than typical character art to leave generous margins.

## Review and packing

All eight accepted figures have clean silhouettes and distinct decoded crops. The source atlas was inspected on white; cleanup bounds preserve the separate action silhouettes. Body mirroring is approved by Keeg’s K.03 review. The separate basketball track is athlete-specific; possession changes only through game simulation. Packed atlas metadata, hashes and row-major source crops are in `tools/generate-art/keeg-steal8-layouts.json` and `tools/generate-art/j92-keeg-steal8-provenance.json`.
