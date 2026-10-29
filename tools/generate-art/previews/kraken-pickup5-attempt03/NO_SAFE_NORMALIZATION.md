# Kraken J.07 `pickup` — attempt03 pre-offset normalization note (historical)

**Historical note:** this assessment predates the generic optional clip `baselineY` renderer offset. It is superseded for trial purposes by `clean-and-layout.py` and cleanup01, which place the figures at source baseline y=90 while leaving six transparent rows below. This note is retained to explain why atlas-only normalization could not satisfy the prior y=94 convention. Cleanup01 is still unreviewed and is not registered.

**Decision: no 80×96 review atlas was generated.** The raw source has much more vertical canvas below the silhouettes than attempt02, but the production sprite contract fixes the cell bottom/ground baseline at y=94. With 96-pixel frames, grounded pixels at that baseline leave exactly 2 pixels before the cell edge. Moving the normalized feet to y=90 would create 6 pixels of lower transparency but would raise planted Kraken frames four pixels above the established baseline. Adding transparent rows below the art has the same displacement because the renderer anchors the frame rectangle bottom. Uniform scaling cannot increase lower margin while the feet remain on y=94.

The source component bounds at alpha >=32, ordered left-to-right, are:

| Pose | Source bounds (LTRB) | Width × height |
|---:|---|---:|
| 0 | 40, 251, 455, 670 | 415 × 419 |
| 1 | 474, 324, 818, 671 | 344 × 347 |
| 2 | 864, 379, 1189, 674 | 325 × 295 |
| 3 | 1252, 295, 1568, 672 | 316 × 377 |
| 4 | 1639, 238, 1947, 671 | 308 × 433 |

The components are separated by actual transparent gaps; equal-width slicing is unnecessary. A width-limited nearest-neighbor fit to 70 pixels would give pose heights approximately 71, 59, 63, 83, and 98 pixels, so pose4 exceeds the height allowance before contact/style screening. A fit constrained to 70×73 preserves the common y=94 baseline and still leaves the same 2-pixel bottom margin; a safe margin cannot be achieved by this atlas-only layout. The pose3 grab hand also needs closer review after size reduction.

Source transparency and figure isolation are promising, but the source reviewer requests alpha-fringe cleanup and native-size style review. Keep the raw art and source review intact. No crop, cleaned atlas, candidate track, registration, or runtime change is produced by this attempt. Revisit only with explicit approval of a lower baseline exception or support for an athlete/clip baseline offset in the renderer.
