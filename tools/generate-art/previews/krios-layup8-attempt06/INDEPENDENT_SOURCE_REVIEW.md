# Krios layup8 attempt06 chroma-key source — independent review

**Disposition: accept for documented chroma-key cleanup and transparent layout trials only.** This review does not approve a packed atlas or runtime registration.

- Prompt: `tools/generate-art/krios-layup8-attempt06-chromakey-prompt.md` (SHA-256 `f40e6d2ddd985e1933aba0c517a0e20f45c7812e0c070bde40c7859f877e744e`)
- Raw source: `tools/generate-art/sources/krios-layup8-attempt06-chromakey-generated-raw.png` (SHA-256 `7ce2df943b35e655435b50f15703566799e7e3fa23c60e0255eade7567be84c6`)
- Provenance identifier: `urn:c2pa:7e914101-fdfe-4d20-9841-7493bf1eba20`; C2PA creation time `2026-10-28T04:43:55.383099372Z`.
- Source is 1536×1024 opaque RGB. It is intentionally not an alpha image.

## Art review

The image contains eight separate, readable poses in row-major order: gather, takeoff, ascent, extension, release/peak, follow-through, descent/landing approach, and finish. Pose silhouettes progress coherently and are distinct. Krios's red skin, curled dark horns, charcoal beard, Scoria Rams uniform, gold/red trim, muscular build, and boots remain recognizable and consistent. Anatomy is complete in all eight poses; no basketball is baked into the art. There is clear horizontal separation between adjacent figures. The green matte does not visibly contaminate the character palette at this review scale.

## Key and layout review

The matte is highly uniform bright green with small channel variation, approximately RGB `(0–20, 241–252, 0–26)`, and occupies about 77.9% of the source. The canvas is fully opaque. This is a strong color separation from Krios's red/charcoal/gold/white palette, so a documented thresholded flood fill from the outer canvas, followed by a reviewed edge decontamination pass, should produce usable transparency. A flat key is suitable for deterministic cleanup; preserve the original RGB source and report the exact key thresholds, connected regions, pixel counts, and any edge treatment. Inspect the cleaned result on both light and dark previews, especially horns, beard, hands, white socks, gold piping, and boots. Do not assume the threshold is safe without pixel/visual review.

The current sheet does **not** meet the specified 24-pixel per-cell margins in its present layout. Using four 384-pixel columns and two 512-pixel rows, the threshold-segmented figure bounds are:

| Pose | Local bounds `(left, top, right, bottom)` | Margin issue |
|---|---:|---|
| 0 | `(30, 148, 356, 456)` | Meets 24 px |
| 1 | `(80, 113, 306, 468)` | Meets 24 px |
| 2 | `(62, 70, 335, 463)` | Meets 24 px |
| 3 | `(44, 10, 330, 476)` | Top margin is 10 px |
| 4 | `(30, -9, 346, 453)` | Crosses the lower-row top boundary; only 9 px above it |
| 5 | `(122, -1, 330, 453)` | Crosses the lower-row top boundary; only 1 px above it |
| 6 | `(32, 96, 340, 465)` | Meets 24 px |
| 7 | `(40, 136, 327, 451)` | Meets 24 px |

The frame3 and frame4 silhouettes are only about 27 px apart vertically, so they also fail the requested 24 px margin on both sides of the row divider. The current raw layout must not be packed unchanged. After key removal, a documented layout step may uniformly fit/translate each reviewed pose into its own cell with at least 24 transparent pixels at every edge; re-review scale consistency, no clipping, and silhouette separation after that transform.

## Recommendation

Proceed with cleanup trials because the matte is separable and the character art is strong. Keep this candidate classified as source-art accepted for cleanup/layout trials, not as accepted production art. Reject if flood-fill/edge cleanup damages outlines or introduces green fringes, and reject if the 24-pixel margins cannot be achieved while retaining consistent scale and the full silhouettes.
