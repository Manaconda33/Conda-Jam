# Independent source review — Kraken dunk-scythe attempt01

**Verdict: reject this raw sheet for normalization/production.** The 15 poses and Kraken identity are recognizable, but it misses the requested hard pixel-art style and is not safely aligned to a strict 5×3 cell grid.

## Provenance

- Source: `tools/generate-art/sources/kraken-dunk-scythe-attempt01-generated-raw.png`
- SHA-256 verified: `bd618cfdf69661f4af7f54b552bb40a23b204f72f0aad1803bd1348107e5e003` (matches `tools/generate-art/kraken-dunk-scythe-attempt01-provenance.json`).
- Prompt: `tools/generate-art/kraken-dunk-scythe-attempt01-imagegen-prompt.txt`; requested 15 row-major poses, transparent background, 16-color hard-edged pixel art, generous gutters, and distinct scythe-sweep stages.

## Findings

- **Alpha/background:** RGBA 1536×1024. Inter-cell samples and the canvas corners are alpha 0; the brown vignette seen in the raw viewer is hidden RGB at transparent pixels, not an opaque backdrop. The alpha silhouettes are localized to the 15 figures. Edges are extensively antialiased/soft, however, rather than hard-edged pixel clusters.
- **Grid/margins:** There are 15 main figures in apparent row-major order, but the sheet has no clean 5×3 gutters. At nominal 307×341 cell boundaries, several silhouettes cross into adjacent cells: index 1 reaches x639 past x614; index 6 reaches x637 past x614; index 7 reaches x952 past x921; index 10 reaches x327 past x307. Some heads/feet also approach or cross row boundaries. Direct cell slicing would clip figures or include neighboring content. Component extraction and a new fitted layout would be required.
- **Action:** Approach, gather/load, airborne arc, downward arm sweep, landing, and recovery are broadly legible. The requested sweep beats at indices 7–9 (frames 8–10) are present, but indices 7 and 8 are near-identical overhead/crown-arm poses; index 9 supplies the visibly downward sweep. The three-frame scythe transition needs stronger separation at native sprite size.
- **Identity/anatomy:** Consistent warm-skinned, auburn-haired, pointed-ear male in burgundy/copper uniform with pendant. The 15 figures appear anatomically complete; no ball or other prop is visible.
- **Style:** Reject blocker. The raw art is painterly with gradients, soft shading, and antialiased contours, not the specified crisp limited-palette sprite art. Downscaling to runtime cells would blur the details further.

The alpha-zero RGB residue is not itself visible after compositing, but it does not address the style or cell-fit blockers. Do not register this attempt; a pixel-art re-generation with stricter gutters and more distinct sweep poses is needed.
