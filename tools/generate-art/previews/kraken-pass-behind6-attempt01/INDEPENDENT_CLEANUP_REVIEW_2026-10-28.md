# Kraken pass-behind attempt 01 cleanup review (2026-10-28)

**Decision: PASS for separate Kraken ball-track trials only.** The cleaned layout preserves the pose-2 wrapped rear hand and the pose-3 release. This review permits track calibration/gameplay trials; it does not approve runtime registration or final production acceptance.

Source: `tools/generate-art/sources/kraken-pass-behind6-attempt01-generated-raw.png`  
Generation ID: `exec-fd0b1354-ad58-4283-b43b-bf6eb19f0234`  
Source SHA-256: `330048b48d179ac85252eaba2f04417e0fd6c2e42c59bb91342ed6fce7ef2a04`  
Cleanup script: `tools/generate-art/clean-kraken-pass-behind6-attempt01.py`  
Reviewed outputs: all six files in `poses/`, `layout.json`, `cleanup-layout-report.json`, runtime-candidate atlas, and light/dark previews.

## Findings

- **Pose 2 wrapped rear hand:** retained in the normalized pose and both previews. The arm wraps behind the lower torso toward the opposite rear hip; the hand remains visible at the hip with no gap that reads as a severed limb. This is essential pass-behind anatomy and must remain through subsequent track work.
- **Pose 3 release:** the untwisting body and opening/flicking arm read as the ball-release drawing. It is frame 3 at the documented tick-7 anchor; pose 2 is the last pre-release hold, pose 4 is follow-through, and pose 5 is recovery. Separate track work should confirm contact through tick 6 and release continuity at tick 7.
- **All six poses:** distinct full-body action states, consistent Kraken identity (auburn hair, pointed ear, copper skin, amulet, burgundy/gold Vesper Harbor kit, wrist detail and shoes), no apparent missing limbs or clipped anatomy, and no baked basketball or unrelated prop. Pose 0/1 positions can support a separately drawn ball, subject to track calibration.
- **Cleanup and exclusions:** the script uses six global alpha≥32 silhouette components and preserves the original RGBA within a 2-source-pixel fringe. The report records 1,872 removed detached/low-alpha components totaling 97,067 pixels; all original pixels remain recoverable in the untouched raw source. I inspected the resulting six poses against the source, with specific attention to the wrapped hand: the essential pose-2 hand is preserved, and no other removed component produces a visible anatomy break in the normalized output. The light and dark previews show no broad haze, matte, or visible detached artifact.
- **Transparency/style:** output is genuinely transparent, with source alpha up to 254 and no visible background glow on either tested background. Nearest-neighbor downscaling keeps crisp outlines and recognizable costume/hair/limb shapes at runtime scale; shading is detailed but remains readable.
- **Layout:** all six alpha and pose hashes are unique. Frames share baseline y=94 in 80×96 cells; the minimum cell margins are 11 px left, 21 px top, 11 px right, and 2 px bottom. The shoes are complete; the 2 px bottom margin is tight but not clipped.

## Trial gate

The cleaned atlas is eligible for separate ball-track trials. Keep the raw source and this review; do not register or mark the artwork finally accepted until hand/ball alignment, release timing, ownership transitions, and both facing directions have been checked in gameplay.
