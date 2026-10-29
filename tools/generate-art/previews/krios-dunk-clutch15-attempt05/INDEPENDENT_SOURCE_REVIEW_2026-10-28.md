# Krios dunk-clutch attempt 05 source review

**Review date:** 2026-10-28  
**Verdict:** **REJECT for canonical registration and ball-track trials.**

## Provenance and review artifacts

- Generation ID: `exec-8a9a259c-e571-4f17-96c9-14ac92d01a85`; timestamp `2026-10-28T09:23:00Z`.
- Exact prompt: `tools/generate-art/krios-dunk-clutch15-attempt05-imagegen-prompt.txt`, SHA-256 `3cb79a76bd33dabc737be85a252c0310bb4c04bc0c9d0cfea57c16a32313c5ff`.
- Raw sheet: `tools/generate-art/sources/krios-dunk-clutch15-attempt05-generated-raw.png`, 1619×971 RGB, SHA-256 `b049ce68a8ebe97de632e75b4a32758d7bd3ff1255b58b3d85e0f9aa8e5843b1`.
- Cleanup uses the prompt's 5×3 cell order, retains each cell's largest 8-connected figure component, keys the green background to transparency, despills green, and scales uniformly with nearest-neighbor sampling into transparent 128×96 cells. It uses shared baseline y=94 and does not redraw poses. Black grid dividers are excluded by cell isolation and largest-component extraction; pose pixels were not edited.
- The candidate atlas, isolated frames, target-size contact sheet, light/dark previews, and enlarged raw cells 4–7 are retained in this directory.

## Review findings

**Identity and anatomy:** The same dark red-brown skinned, tied-back black-haired and bearded Krios appears in all cells, wearing the dark uniform with gold/red trim and shoes. Limbs and hands are attached and generally anatomically coherent. No face/hair/limb contamination from the green key is apparent in the previews. The sprite remains recognizable at target size, though the glossy, painterly rendering differs from the pixel-art look of the accepted game assets.

**Ball-free review, especially frames 4–7:** No separate basketball or orb is visible in any cell. Enlarged raw cells 4–7 are saved as `raw-cell-04-empty-hands-review.png` through `raw-cell-07-empty-hands-review.png`. Frame 4's dark area is garment/shorts shading, not a spherical object; frame 6's negative space between hands is green and clear; frame 7's hands are separated at the rib line. Frame 5 is less successful: the hands converge against the sternum and nearly touch, reading as a closed/clasped gesture rather than clearly separated fingers closing in empty air. It is not a visible ball, but it misses the prompt's clear empty-space treatment and makes the grab state ambiguous.

**Pose separation and anchors:** The 15 silhouettes are unique and the broad sequence is readable. The important airborne actions mostly land on the supplied indices: frame 2 is visibly the first airborne pose (takeoff), frame 5 is the gather/catch gesture (grab, though visually ambiguous), frame 7 is a bent-elbow rib pull at the apex, frame 10 is a clear diagonal release/flick, and frame 11 is a distinct airborne follow-through. Frames 12–14 descend into landing poses.

**Landing anchor failure:** Frame 13 already shows both shoes planted at the baseline in a bent-knee landing stance. Frame 14 is a deeper recovery crouch, not the first clear foot contact. This violates both the prompt's frame 13 requirement (feet just above baseline) and the canonical `land: 14` first-contact anchor. A ball track timed to frame 14 would place contact after the visible landing begins.

**Layout and alpha:** The raw contains dark grid lines, but these are cell boundaries and can be cleanly excluded during extraction without cutting into the figures. The cleanup atlas is RGBA with transparent backgrounds; all 15 isolated frames have distinct hashes and common cell alignment. The light/dark previews show no prominent green fringe. Cell-based cleanup also protects pose order from global connected-component misgrouping.

## Disposition

Preserve the raw sheet and all review/cleanup evidence. Do not register this source or calibrate its ball track. A replacement needs an unambiguous separated-hand grab pose at frame 5 and must keep both feet above the baseline until first contact at frame 14.
