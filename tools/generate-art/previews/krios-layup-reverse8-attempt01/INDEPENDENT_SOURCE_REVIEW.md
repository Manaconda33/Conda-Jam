# Krios J.128 `layup-reverse` attempt01 source review

**Disposition: retain for chroma-key cleanup and layout trials only. Not approved as packed production art or for runtime registration.**

## Reviewed inputs

- Exact generation request: `tools/generate-art/krios-layup-reverse8-attempt01-imagegen-request.txt`
- Source prompt brief: `tools/generate-art/krios-layup-reverse8-attempt01-prompt.md`
- Raw generated sheet: `tools/generate-art/sources/krios-layup-reverse8-attempt01-generated-raw.png`
- Provenance: `tools/generate-art/krios-layup-reverse8-attempt01-provenance.json`
- Canonical action poses/timing: `tools/generate-art/pose-catalog.json`, J.128 `layup-reverse`

## Art review

The 1536×1024 raw sheet contains eight distinct, full-body Krios figures in row-major order. The red skin, curled dark ram horns, charcoal beard, Scoria Rams black kit with red/gold trim, socks, and rugged boots stay recognizable across the poses. Anatomy is coherent; all limbs remain attached and readable. The sequence generally reads as a reverse gather, takeoff, partly back-facing rise, high-arm approach, far-side release gesture, descent, and landing. Pose 2's rear view and poses 4–5's raised/extended arms support the intended reverse finish, although runtime review will need to confirm that the carried ball path reads correctly across frames 3–5. No basketball or ball-shaped prop is visible in the artwork.

The opaque matte is a clean, highly separable bright green near `(16–20, 240–244, 12–17)` at the canvas corners. There is no large glow, vignette, or scenery. The black silhouette outlines provide a strong key boundary. A documented green-key cleanup is viable; inspect horns, black outlines, socks, gold trim, and fingers after keying for edge contamination. The raw RGB image is opaque and is not ready to pack as-is.

## Cell-fit and separation review

Foreground bounds measured by 8-connected component segmentation using a green-dominant matte predicate are below. The requested cells are 384×512, with at least 32 px clear on every edge.

| Frame | Measured global bounds `(left, top, right, bottom)` | Local cell margins `(L,T,R,B)` | Result |
|---|---:|---:|---|
| 0 | `(31,150,319,459)` | `(31,150,65,53)` | Pass |
| 1 | `(446,70,683,461)` | `(62,70,85,51)` | Pass |
| 2 | `(848,58,1163,376)` | `(80,58,-11,136)` | Extends 11 px past right edge |
| 3 | `(1231,28,1523,435)` | `(79,28,13,77)` | Top/right margins under 32 px |
| 4 | `(54,534,413,936)` | `(54,22,-29,88)` | Top margin low; extends 29 px right |
| 5 | `(475,498,741,965)` | `(91,-14,27,59)` | Crosses row boundary; right margin low |
| 6 | `(842,599,1136,960)` | `(74,87,16,64)` | Right margin low |
| 7 | `(1179,612,1505,960)` | `(27,100,31,64)` | Left/right margins low |

The silhouettes remain visually separate despite these cell-boundary crossings: the closest crossing neighbors have more than 60 px of visible green between their bounds, so independently cropping and fitting each pose should be feasible. The sheet must not be sliced on the nominal 4×2 boundaries unchanged. Generate per-pose crops from the keyed silhouette, apply one documented uniform scale that fits every silhouette within at least 32 px margins, and record each crop, scale, position, and output bounds.

## Recommendation

Proceed with cleanup and cell-fit trials. Preserve this raw source and its exact prompt/provenance. Re-review transparent output on light and dark backgrounds at native and enlarged size before any pack. Then verify both facings and calibrate Krios's separate ball track through frame 4/tick 11, release at frame 5/tick 12, and gameplay scoring. This review does not approve production use.
