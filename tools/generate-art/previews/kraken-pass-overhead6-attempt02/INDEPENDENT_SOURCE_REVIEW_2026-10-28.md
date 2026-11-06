# Kraken pass-overhead attempt 02 — independent source review (2026-10-28)

**Decision: approve for cleanup and layout trials only. Source, atlas and gameplay remain unaccepted.**

Source: `tools/generate-art/sources/kraken-pass-overhead6-attempt02-generated-raw.png`  
Exact edit prompt: `tools/generate-art/kraken-pass-overhead6-attempt02-edit-prompt.txt`  
Generation ID: `exec-c4431957-32b5-428e-b129-7dfdf0f745b4`  
Source SHA-256: `3c43eac04b5f68b11a3b1948d938392dfdae9831312881a44e27c8e50b14e71f`  
Prompt SHA-256: `f4abef3d272f3a28c0d342ecf8fcaf8f7d0406d1be3d2aab08cc3463266abdb6`  
Dimensions/mode: 1536×1024 RGBA.

## Findings

- **Identity:** The six figures consistently depict Kraken: auburn hair, pointed elf ears, natural skin, burgundy uniform with gold/copper details, wrist bands, shorts and shoes. The amulet is visible. Face and costume remain broadly coherent.
- **Pose/timing:** The sequence is readable and follows the catalog: pose 0 gathers the invisible ball at the abdomen, pose 1 lifts overhead, pose 2 winds up behind the crown, pose 3 releases, pose 4 follows through, pose 5 recovers. Pose 3 reads as the overhead release at the specified frame 3/tick 7. The figures are anatomically complete, with no clearly cropped limbs or extra limbs. No basketball is visible in any pose; pose 0's hands are empty and separated enough to support a separate ball render.
- **Component isolation feasibility:** Raw alpha is 0–254 and has a broad brown/orange haze. At threshold 32, an 8-connected component scan yields exactly six large components with clean cell-scale separation and no background component joining the figures. At thresholds 8 and 16, the haze produces 39 and 17 components; threshold 24 produces 9; threshold 32 and most thresholds through 192 produce six. This provides a workable cleanup path: threshold the alpha for figure segmentation, isolate each main component, then retain only a very small near-silhouette alpha fringe to preserve antialiasing. The faint outer glow can be cleared. Record discarded pixels/fragments; keep the raw source untouched.
- **Small-sprite style/downscale:** The source remains painterly at full resolution, but its forms are cleanly outlined, color-separated and anatomically simple. Each isolated figure fits a similar full-body extent to the existing Kraken runtime sprites. A nearest-neighbor reduction to the existing 80×96 cell scale should consolidate the soft shading into pixel clusters and preserve the large identifying features (hair, pointed ear, uniform trim, limbs and shoes). The raw sheet does not pass the established crisp pixel-art standard as-is; cleanup must produce light/dark previews and inspect individual small poses for face, hands, trim and silhouette clarity. If the downscaled output retains blurry gradients or damages hand/edge readability, reject rather than pack.
- **Background:** The source still contains a visible semi-transparent brown/orange vignette. Alpha stats are 0–254; 469,398 nonzero pixels are partial alpha. This is not a clean transparent source, but the threshold/component behavior above makes cleanup trials justified. Verify against both light and dark backgrounds after cleanup.
- **Attempt 01 corrections:** The basketball in pose 0 and bright spot by pose 4 are gone. The raw remains visually contaminated by a broad background glow, so transparency cleanup is required.

## Trial gate

Proceed with cleanup/layout trials only. Do not pack, register, accept, or start ball-track gameplay tests until the cleaned 80×96 atlas is visually checked on light and dark backgrounds, all six complete silhouettes and margins are reviewed, the small-sprite appearance is compared directly to Kraken's existing runtime art, and an independent review passes.
