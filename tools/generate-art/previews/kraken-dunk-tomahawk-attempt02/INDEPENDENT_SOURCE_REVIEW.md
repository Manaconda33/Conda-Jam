# Independent source review — Kraken dunk-tomahawk attempt02

**Verdict: accept for careful cleanup/normalization trial; not ready for gameplay or registration.** The raw source has usable poses and true transparent alpha, but misses the requested source pixel style and generous cell margins. Cleanup must preserve every figure and prove native-scale style before gameplay.

## Provenance

- Raw source: `tools/generate-art/sources/kraken-dunk-tomahawk-attempt02-generated-raw.png`
- SHA-256 verified: `3936167ead301763320dfd6b76f2c234820aecf3dadb0f74d489bf0b9f83982c` (matches `tools/generate-art/kraken-dunk-tomahawk-attempt02-provenance.json`).
- Prompt SHA-256 verified: `deb77d21585f14b0d32ca6cbd06b8e93a0eed2fafb27ba0ebae3cbddc418b69a`.
- The generation ID and source hash occur in one provenance record; no duplicate source record was found.

## Findings

- **Alpha/background:** RGBA 1536×1024. Corners and sampled gutters have alpha 0; the brown tone displayed by the raw viewer is hidden RGB under transparent pixels. No opaque backdrop is baked in. Edges are antialiased (alpha 0–254), so the raw needs edge cleanup before packing.
- **Grid/margins:** Fifteen large, separate figures appear in row-major order. Most stay within their approximate 307×341 cells, but they do not meet the prompt's 42px per-side clearance; several silhouettes are substantially wider than the requested 55% of cell width. One lower-right component begins at y=680, about 3px above the nominal third-row boundary at y=683. Global alpha analysis finds 15 separated main components, so component extraction can preserve that figure instead of clipping it; direct fixed-cell slicing is not suitable.
- **Pose/action:** The approach, stride, gather/plant, load, takeoff, ascent, arm cock, downstroke, recoil/descent, landing and recovery are all present. One-based frames 8–11 (indices 7–10) progress from the cocked arm behind the head, to a farther-over-crown arm, to the downstroke, then an extended downward follow-through. These are distinct enough to read as a tomahawk action, though the first two overhead beats are close and frame 10's start of the downstroke could be stronger.
- **Identity/anatomy:** Consistent Kraken identity—warm skin, pointed ears, auburn hair, copper pendant, burgundy/copper kit, dark socks and burgundy shoes. All 15 poses appear full-body with coherent limbs; hands are empty and no ball/prop is visible.
- **Pixel style:** The raw is smooth, shaded illustration with antialiased edges, not the requested crisp 16-color pixel art or the accepted Kraken idle's blocky pixel clusters. Since the background is genuinely transparent and the 15 components are separate, nearest-neighbor fitting, a shared limited palette and binary alpha could produce a reviewable pixel-art derivative. Judge that derivative against Kraken idle at native sprite size before any gameplay trial.

The raw is worth a cleanup trial, with global component extraction to prevent the small row-boundary crop, then native-size light/dark proof and pixel-style review. If the cleaned output remains painterly/muddy or the overhead poses merge at 80×96, reject and generate a more compact, more clearly staged revision.
