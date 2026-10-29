# Independent source review — Kraken dunk-clutch attempt02

**Verdict: accept for component-based cleanup/normalization only; do not use fixed-cell crops, clean by manual repaint, or register from this review.** The raw has a readable 15-pose sequence and true transparent alpha, but several figures cross nominal cell boundaries and the raw rendering is not pixel art.

## Provenance

- Raw source: `tools/generate-art/sources/kraken-dunk-clutch-attempt02-generated-raw.png`
- SHA-256 verified: `2fc054e326f1d2962f8c5861221b77b31d1d1ecad25e24ef49ca656a529363b1`, matching `tools/generate-art/kraken-dunk-clutch-attempt02-provenance.json`.
- Exact prompt SHA-256 verified: `562b559a29d9f1bc3f97e02177e4317b58955fb9ba51a363863e1db6c276ce00`.
- The generation ID and raw hash match the attempt02 provenance; no competing attempt record was found.

## Findings

- **Alpha/background:** RGBA 1536×1024. Sampled corners and gutters have alpha 0. The brown background seen in the raw viewer is hidden RGB in transparent pixels, not an opaque backdrop. The source has many partial-alpha edge pixels (0–254), so binary-edge cleanup is needed before packing.
- **Cell boundaries:** Fifteen large, distinct connected figures are present, but fixed 307×341 cell crops would clip multiple silhouettes. Examples: top-row pose index 1 reaches x=642 past its cell end x=614; top-row pose index 3 reaches x=1268 past x=1229; bottom-row pose index 12 reaches x=947 past x=922; the bottom-right row's pose starts at y=659, 24px above its row boundary y=683. This means the nominal grid is not safely aligned. Global component extraction can preserve the figures, as the 15 components remain separate at alpha thresholds 16, 64, and 128.
- **Clutch sequence:** Approach, gather/plant, load, takeoff, clutch, downstroke/follow-through, descent, landing, and recovery are present. One-based frames 7–10 show visibly different hand/arm and body positions: one hand rises to the chest, both arms close into the sternum clutch, the elbow/hand shifts, and the apex tucks more compactly. The overhead/clutch beats are distinct enough to continue into a cleanup proof, although frames 8 and 10 both center the hands at the chest and need a native-size check after fitting. The empty-handed downstroke and separate follow-through are present in frames 11–12.
- **Identity/anatomy:** Consistent Kraken: warm natural skin, pointed ears, auburn hair, copper pendant, burgundy uniform with copper trim, dark socks, burgundy shoes. I see no extra limbs or baked ball. All 15 global components retain complete-looking head, torso, arms, legs and shoes.
- **Pixel-art quality:** Raw shading is smooth/illustrative with antialiased contours, not the requested compact hard-edged 16-color sprites. A nearest-neighbor component repack with one limited palette and binary alpha may convert it to a trialable sprite sheet, but the derivative must be compared against accepted Kraken idle at native scale before gameplay review.

Proceed to a documented component-based cleanup trial, not nominal cell slicing. Re-review margins, scale/baseline, no missing anatomy, no residue, and frame separation at 80×96 before gameplay.
