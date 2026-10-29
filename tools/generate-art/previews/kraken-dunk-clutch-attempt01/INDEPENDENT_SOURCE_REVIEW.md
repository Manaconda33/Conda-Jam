# Independent source review — Kraken `dunk-clutch`, attempt01

**Verdict: reject as a production source. It has real alpha, fifteen distinct bodies and a readable clutch-to-jump sequence, but the clutch/dunk action is not completed clearly, some cell boundaries are crossed, and the artwork misses the specified pixel-art style.**

## Hash and source verification

- Raw: `tools/generate-art/sources/kraken-dunk-clutch-attempt01-generated-raw.png`, 1536×1024 RGBA.
- Generation ID: `exec-bd2d5784-f365-4f17-bd78-b2ee9fa53663` (`2026-10-29T05:03:00Z`).
- Raw SHA-256 `bef1c4c23fba8cef21fec8761e354ce659c9e5ade19e0dee2fb9157b217d3b78` matches provenance.
- Prompt SHA-256 `1d60c7d0d095907d080d1667fea8d1c7749bd62574dd74551d2f26eb54fa2981` matches provenance.

## Findings

- **Alpha/gutters: partial pass.** The source has genuine RGBA alpha: 1,025,072 pixels are alpha 0, 547,792 are partially transparent, and none are alpha 255. The brown field visible in the preview is RGB under fully transparent pixels. The transparent RGB is nonblack throughout and could bleed into outlines under filtered scaling. At alpha≥64, there are 15 main sprite components; at alpha≥1, there are 4,554 components, including 4,539 low-alpha fragments. Gutters are transparent, but edge cleanliness needs alpha-aware/nearest-neighbor handling.
- **Pose count and anatomy: pass at gross level.** Fifteen full-body poses appear in 5×3 row-major order. Kraken's auburn hair, elf ears, warm skin, copper pendant, burgundy/dark uniform and shoes are consistent. Heads, hands, legs and feet remain present and attached. No ball or other prop appears.
- **Clutch-to-dunk action: partial/fail.** Frames 7–9 show a clear compact arm position around the empty chest/head space, and frame10 differs with one arm raised overhead. However frame10 reads as an overhead reach at the jump peak, not a decisive downward dunk extension. Frame11's arm remains raised/bent and does not clearly register follow-through past a rim plane. The sequence depicts the clutch, but not a readable dunk contact and release. The separate ball could add context in gameplay, but cannot repair this source-pose gap.
- **Cell margins and separation: fail.** Nominal cells are about 307×341 px. Several figures cross or nearly touch their implied cells: top-row column2 reaches x=639 beyond the x≈614 edge; row2 column5 starts at y=311, about 30 px above its row boundary near y=341; row3 column1 begins at y=668, about 15 px above the y≈683 seam. Other margins are modest. The grid is visually recognizable but the sprites are not safely contained with the wide gutters requested.
- **Style and edge halo: fail.** The figures have blended smooth shading and illustrated contours rather than hard square pixel clusters and a restricted discrete palette. Numerous low-alpha fragments and nonblack RGB under transparent pixels create color-bleed risk; no true opaque backdrop or checkerboard exists in alpha. Cleanup can isolate the bodies, but cannot convert the painted rendering into the specified pixel-art treatment.

## Recommendation

Preserve this generation and provenance as rejected source work. It may inform the compact clutch pose, but it is not cleanup-ready runtime artwork. Any new version needs an unmistakable dunk extension and follow-through, cell-contained figures with wider margins, and genuine crisp pixel-art shading. Keep the basketball on a separate athlete-specific track.
