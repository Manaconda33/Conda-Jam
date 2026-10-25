# Uniform 80px-margin layout candidates, poses 00–04

These are review candidates only. They are not accepted for packing and do not replace the cleaned source or raw originals.

The generator crops each cleaned pose to its nonzero-alpha source bounds, applies a single uniform 0.90 affine scale on both axes using premultiplied-alpha bicubic resampling, and centers the result on that pose's original transparent canvas. The original canvas dimensions are preserved. No redraw, stretch, or original-file overwrite occurred.

`layout-candidates.json` records for each pose the cleaned input hash, candidate hash, exact scale, source crop and placement, alpha>16 and alpha>128 bounding boxes and margins, and the corresponding light/dark proof paths. All five candidate canvases retain more than 80 transparent pixels around the alpha>16 figure bounds. The proof contact sheets are in `../proofs/layout-candidates-80px/`.

Independent review is pending. Pose04 remains the canonical low rear sweep; pose05 is the deepest point.
