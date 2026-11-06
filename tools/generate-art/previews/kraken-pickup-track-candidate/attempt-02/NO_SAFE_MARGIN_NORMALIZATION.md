# Kraken J.07 `pickup` — attempt 02 margin normalization

**Result: rejected as a repack candidate.** The original attempt02 source, cleanup, and reviewed light/dark previews remain unchanged. No derived atlas was made or proposed for runtime.

The existing five-cell atlas is 400×96, with a shared baseline at source y=94 and a uniform scale of 0.11317829457364341. Pose rectangles and alpha bounds are:

| Pose | Figure size | Left / top / right / bottom margin |
|---:|---:|---:|
| 0 | 47×73 | 16 / 21 / 17 / 2 |
| 1 | 55×61 | 12 / 33 / 13 / 2 |
| 2 | 46×51 | 17 / 43 / 17 / 2 |
| 3 | 44×56 | 18 / 38 / 18 / 2 |
| 4 | 43×68 | 18 / 26 / 19 / 2 |

The shared y=94 baseline is part of the current 96px frame convention. The renderer draws a frame rectangle to a fixed destination height and anchors its full rectangle bottom at the player's ground position. Translating the artwork upward to create more than 2px of bottom clearance would lift Kraken's visible feet from that ground line. Making taller frame rectangles while retaining transparent pixels below the feet has the same effect unless the renderer gains a per-asset baseline offset. Uniformly scaling the existing poses smaller around y=94 preserves the feet but leaves the bottom margin at 2px. Thus an atlas-only normalization cannot both increase the lower packing margin and preserve current screen alignment at the existing frame dimensions.

Current reviewed materials (no new edits):

- Atlas: `tools/generate-art/previews/kraken-pickup5-attempt02/kraken-pickup5-attempt02-runtime-candidate.png`, SHA-256 `6c83c60ed1a3bd7d3afc035177c2ebe4fd20722ec82a733986881f37cf57670b`.
- Light preview: `tools/generate-art/previews/kraken-pickup5-attempt02/kraken-pickup5-attempt02-light-preview.png`, SHA-256 `f276230a04c8f2192999b6e70ffa8e851a5b057ad2cbb33313662b88985b5d89`.
- Dark preview: `tools/generate-art/previews/kraken-pickup5-attempt02/kraken-pickup5-attempt02-dark-preview.png`, SHA-256 `54ffc812a4aa56967c308b5da33c7b3860f307ec907075de665e41f98f5e39ec`.
- Existing independent source, cleanup, and track reviews remain authoritative. The candidate is still unregistered.

Recommendation: retain the reviewed poses and track work, and wait for a replacement source with additional lower-cell transparency while keeping the feet on the y=94 baseline. Do not distort or shift these current poses to satisfy packing clearance.
