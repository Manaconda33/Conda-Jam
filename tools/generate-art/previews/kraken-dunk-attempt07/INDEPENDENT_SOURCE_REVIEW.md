# Kraken dunk-power attempt07 — independent source review

**Verdict: reject for normalization or production.** Preserve as source/reference work only. The sequence has exactly 10 poses, while the canonical dunk-power clip requires 15.

## Provenance and source

- Raw file: `tools/generate-art/sources/kraken-dunk-attempt07-generated-raw.png` (1983×793 RGBA).
- Generation ID: `exec-61e453ef-a600-46be-b578-a1f7bc3d2d8b`.
- Raw SHA-256 `69335f789e040c24b57733f9a38e8e85241a7066397043dd246b5aa067a43964` and prompt SHA-256 `2a2fbbd482e7f88ab13c9969d854901beb014f5abff0c935428d12437bbf8fcd` match the provenance file.

## Findings

- **Pose count and order: fail.** The sheet contains 5×2 = 10 figures, not 15. The broad row-major action reads as approach, gather, plant/takeoff, ascent, raised peak, downward slam, descent, low landing, and recovery. Peak and slam have some silhouette distinction, though the required fifteen timed beats cannot be reconstructed without inventing poses.
- **Style: fail.** The figures use smoothly blended muscle and cloth shading, many soft gradients, and antialiased contours. This reads as a detailed painted illustration, not the requested crisp limited-palette pixel art used by Kraken's game sprites.
- **Alpha and edge cleanliness: fail for direct packing.** The canvas corners are transparent, but alpha is not cleanly confined to the figures: 450,789 pixels have nonzero alpha, with 110,406 pixels in the very low 1–15 range. Low-alpha red/orange fringe extends to the top edge (66 top-edge pixels, maximum alpha 6), bottom edge (43 pixels), and left edge (one pixel). Against a light background a colored halo is visible around several silhouettes. Careful extraction may remove some residue, but it cannot address the style or missing-poses blockers.
- **Grid and margins: risky.** In the implied 5×2 grid (cells about 397×397), the lower-left spread-arm pose reaches the row seam: its hand pixels begin around y=390, before the lower row starts around y=397, and its opposite hand reaches x=397 at the first column boundary. A strict crop would clip those extremities. The upper row's lower legs also approach the row seam. The canvas is not divided by safe transparent gutters, so uniform cell cropping is unsafe.
- **Identity/anatomy: generally pass.** The ten figures are consistently Kraken: warm skin, auburn hair, pointed ears, copper pendant, burgundy/dark kit with copper trim, dark socks and burgundy shoes. Bodies appear full and connected, with no ball baked into the sheet. The style mismatch limits similarity to the native sprite set.

No production files were changed.
