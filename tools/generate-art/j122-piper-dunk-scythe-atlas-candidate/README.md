# J.122 Piper dunk-scythe atlas candidates

These are review-only layout candidates assembled from the currently selected individual pose sources. `atlas-bbox-height` demonstrates the standard common-alpha-height packer behavior; it enlarges tucked pose07 and is retained only for comparison. `atlas-lane-scale` preserves each source lane's within-lane scale, keeping pose07's compact tuck. Its inter-lane factors are provisional visual estimates, not final anatomical calibration.

Both scripts use the same transparent 4x4 grid of 128x96 cells, alpha crop threshold 16, 80px height and 112px width caps, x-centered figures, and y=87 baseline. The resulting cell silhouettes have at least 8px side margins, 7px top margin, and 9px bottom margin before the unused sixteenth cell. The complete source, raw-image, prompt, and output byte hashes plus per-pose crop/scale/cell metadata are in the JSON layout files. No ball is included. No pose was redrawn, duplicated, mirrored, or synthesized.

Neither atlas is production accepted. The PNG/WebP and light/dark, 3x native-cell proofs exist only to support visual review and further scale adjustment.
