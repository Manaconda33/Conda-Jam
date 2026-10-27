# J.131 Briar Foxglove `layup-reverse` — attempt 05 review

## Status: superseded; not selected for production

The raw ImageGen edit preserves the attempt 04 pose layout, removes the invented white chest badge, and matches Briar's accepted russet/cream kit and dark shorts panels more closely. Independent anatomy and identity review found no ball or extra limbs. Takeoff, rise, cross-under gather, peak, release, descent, and landing read as distinct events. Attempt06 supersedes this sheet because it places the receiving hand farther from Briar's face and passes the native late-gather contact review more clearly.

Per-cell normalization was done only after that source review. The 1536x1024 source is split into exact 384x512 cells. At alpha>=16, the main subject is one connected component in each cell, with only isolated 1–2 pixel exceptions in poses 1 and 4. The cleanup script removes disconnected alpha 1–15 pixels only when outside a four-source-pixel halo of that component; retained source antialias pixels and all subject pixels are not painted over or masked. All eight poses are cropped with a four-pixel antialias allowance, scaled uniformly at 0.185 using nearest-neighbor sampling, centered horizontally in 72x95 cells, and placed on common baseline y=89.

Independent review of the normalized atlas confirms readable identity, anatomy, sequence and cell separation at 72x95, with margins and shared baseline. Shading is softer than Briar's original atlas. Native Jam Stage captures at 100% and 120%, right and left facings, are still required. No production manifest registration or ball-track acceptance has happened.
