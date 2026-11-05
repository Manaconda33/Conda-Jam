# Manaconda code-only pixel art, V2 (native 128×192)

This is a **new hand-coded drawing** at native 128×192. It is **not** an enlargement, interpolation, paint-over, or raster trace of the V1 or GPT-image sprite. Every visible pixel comes from source-controlled JavaScript curves, polygons, lines, points, color fills, and hand-placed details. Only Node.js built-ins (`fs`, `zlib`) are needed for generation. There is no image-generation inference, image input, external drawing library, installed browser, or internet request.

## Reproduce

Run these from the `v2/` directory:

```sh
node generate-manaconda-v2.mjs manaconda-code-pixel-v2.png --half manaconda-code-pixel-v2-64.png
node --test verify-manaconda-v2.test.mjs
node build-comparison.mjs
```

The Node test loads `../manaconda-code-pixel.png` to compare against V1, so retain the V1 asset alongside this folder. Compare with the original V1 test by running `node --test ../verify-manaconda.test.mjs verify-manaconda-v2.test.mjs`.

## Scope and design

- Character: Manaconda, right-facing three-quarter idle, ball-free Chicago Condas court attire.
- New dimensions: **128×192 RGBA**; also a separately exported **64×96** nearest-neighbor reduction sampled from V2.
- Production reference: `public/assets/animation/manaconda-idle-right.webp`, six idle frames in a 3×2 grid of 64×96 cells. The comparison viewer's reference URL is pinned to GitHub commit `7e700c0` so it does not silently drift.
- Coding: 63 actually used colors; custom thin-outline contours, offset anatomy, gold/violet jersey folds, etched beard gray hairs, azure-lens highlights, sculpted hands, white sleeve and tights, rearward branching flowering driftwood and scarf.
- Native output: **11,359 visible pixels**, bounds (5,8) through (123,187), at least three completely transparent pixels around all four edges.
- No portrait assets, textures, reference sprite pixels, AI-generative calls, or production renderer changes.

## Evaluation

Open `comparison-v2.html`. The offline-viewable V1 and V2 variants are embedded in the comparison file. The original ImageGen production WebP is loaded separately from GitHub (internet required for that panel only). The four panels are all displayed at the **same on-screen size**: original animation pose, original code V1, native-resolution code V2, and downsampled code V2. Choose `Actual 64×96 footprint` to see the detail loss at the previous sprite size. Select any of the original's six frame poses.

The embedded V1 is preserved. V2's alpha is hard (0 or 255), each 2×2 native neighborhood has independent colors/shape and is **not simply doubled V1 pixels**, and repeated generation yields byte-for-byte identical PNG output (SHA-256 `aeb0bce26ff5d76a077c1fe05dfa197eacce6038d0c600cd5266481496ee9fbb`). Both V1 and V2 Node tests pass.

## Limitations and next step

V2 adds detail but **has not been reviewed on a playable Conda Jam court**, and it is only **one** authored idle drawing. It is an art-direction experiment, not an idle animation, a drop-in manifest replacement, or proof that procedural animation will look better. The 64×96 reduction loses some fine details, so the decision to use 128×192 in production should be based on an in-game A/B at comparable camera sizes. Do not merge this experiment as a production sprite replacement without that review.
