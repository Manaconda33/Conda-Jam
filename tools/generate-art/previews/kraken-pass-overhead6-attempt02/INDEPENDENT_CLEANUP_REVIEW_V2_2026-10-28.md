# Kraken pass-overhead attempt 02 cleanup v2 review (2026-10-28)

**Decision: PASS for separate Kraken ball-track trials only.** This corrected cleanup fixes the v1 hand clipping and is eligible to proceed to isolated track calibration/gameplay trials. This is not runtime registration or final production acceptance.

Reviewed raw source: `tools/generate-art/sources/kraken-pass-overhead6-attempt02-generated-raw.png`  
Generation ID: `exec-c4431957-32b5-428e-b129-7dfdf0f745b4`  
Raw SHA-256: `3c43eac04b5f68b11a3b1948d938392dfdae9831312881a44e27c8e50b14e71f`  
Reviewed cleanup: `tools/generate-art/clean-kraken-pass-overhead6-attempt02-v2.py`  
Reviewed outputs: `poses-v2/pose-00` through `pose-05-normalized.png`, `layout-v2.json`, `cleanup-layout-report-v2.json`, v2 runtime-candidate atlas, and v2 light/dark previews.

## Findings

- **Global seam segmentation:** the cleanup identifies exactly six alpha≥32 silhouette components over the full raw image, assigns each to a distinct row-major slot by centroid, and preserves global bounds. Pose 3 now spans `[111,499,513,1005]`; pose 4 spans `[580,503,985,1005]`. These bounds include the fingers that cross upward over y=512. The normalized v2 poses and previews visibly restore complete hands on both figures. No preceding pose was merged into those components.
- **Identity and anatomy:** all six are consistently recognizable as Kraken, with auburn hair, pointed ear, copper skin, amulet, burgundy/gold Vesper Harbor uniform, wrist bands and red shoes. Head, torso, both arms/hands, both legs and feet are present in every pose. No other clipping or malformed extra limb is apparent.
- **Distinct sequence and timing:** the poses read as gather, lift, wind-up, release, follow-through and recovery. Pose 3 is a clear overhead release for the configured frame-3/tick-7 anchor. Pose 4 remains similar in broad arm direction, as a one-frame follow-through should, but its arm/wrist and body placement differ visibly from pose 3. Pose 0 supports a separately rendered ball at the gather point.
- **Ball-free hands/art:** no baked basketball or unrelated prop appears in the six normalized poses or either preview. Empty hand spacing and hand placement provide a usable starting point for separate track calibration.
- **Transparency and backgrounds:** raw alpha is 0–254 and contains background haze, but v2 retains the source RGBA silhouette and near-edge fringe while suppressing distant haze. The light and dark previews show transparent backgrounds without visible broad halos or matte-color contamination.
- **Margins and baseline:** layout v2 sets baseline y=94 across all six 80×96 cells. Minimum margins are 10 px left, 21 px top, 11 px right and 2 px bottom. Both hands on poses 3/4 are now inside the upper cell margin, all feet remain complete, and the smallest margins do not clip the art.
- **Runtime-scale style:** at the 80×96 cell scale, nearest-neighbor reduction keeps the dark outlines and Kraken's identifying costume/hair features legible. Shading is denser than the idle reference but remains pixel-clustered and readable on both tested backgrounds.

## Trial gate

The corrected v2 atlas is suitable for separate ball-track trials. Trial work should still confirm contact through the intended release tick, hand/ball alignment, flight and handoff continuity, and both facing directions before runtime acceptance. Preserve v1's rejection record and keep v2 classified as a trial candidate until those checks pass.
