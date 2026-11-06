# Krios dunk-clutch attempt 07 source review

**Review date:** 2026-10-28
**Verdict:** **PASS FOR SEPARATE BALL-TRACK TRIALS ONLY. Not runtime-registered.**

## Provenance and cleanup

- ImageGen edit generation ID: `exec-8b238b02-0c7a-43b7-879e-b9fb295cb19b`; timestamp `2026-10-28T09:28:00Z`.
- Exact edit prompt: `tools/generate-art/krios-dunk-clutch15-attempt07-imagegen-edit-prompt.txt`, SHA-256 `3985e175e85a4ca3a2d5495b523a8de4b1b47cb790f0481b2ea3764b3fbb9471`.
- Raw source: `tools/generate-art/sources/krios-dunk-clutch15-attempt07-generated-raw.png`, 1536×1024 RGB, SHA-256 `64efc03b18bd60e1a30dc57cb0047879bf800ee47dcaa34a38eb19a01d93f5c6`.
- The edit regenerated the full sheet, so all fifteen poses were reviewed. Unlike attempt06, the attempt07 raw contains no numeric labels or grid dividers. Cell-based extraction uses the measured 5×3 source layout and small internal margins, keeps the principal figure per cell, keys green to alpha, despills green, and applies uniform nearest-neighbor scaling into 128×96 cells with common baseline y=94. It does not redraw any pose.
- The candidate atlas, cleanup report, 15 isolated frames, target-size contact sheet, enlarged frame6/frame7 detail, and light/dark previews are retained in this directory.

## Review findings

**Corrected clutch and apex gestures:** Frame 6 now has two complete hands low between the spread knees with a visible green gap between fingers at source and target size. Frame 7 is in three-quarter view and both hands are visible, separately drawn against the black jersey across the near-side ribs, with elbows bent. Neither gesture reads as an object or ball hold.

**Ball-free check:** I inspected all cells and enlarged frames 4–7. There are no basketballs, spheres, props, or detached circular marks. The hands remain empty and show negative space where required.

**Canonical sequence and timing:** Frame 2 is the first airborne pose with both feet clear; frame 5 has the catch gesture at the chest; frame 7 shows the apex pull; frame 10 is a clear diagonal one-hand release; frame 11 is a separate high follow-through; frames 12–13 remain airborne above the baseline; frame 14 is the first clear foot contact and impact absorption. These match the supplied zero-based anchors: takeoff 2, grab 5, peak 7, release 10, finish 11, land 14.

**Identity, anatomy, separation:** Krios remains recognizable with consistent red-brown skin, tied-back black curls and green band, full beard, muscular human anatomy, black uniform with gold/red trim, and dark shoes. Hands, arms, legs, and shoes remain complete and attached. The frames are distinct at target size and the action progresses coherently. The high-detail glossy rendering is less pixel-like than the original runtime art, but it remains legible at the target dimensions.

**Cleanup and previews:** Atlas cells are transparent RGBA with consistent dimensions and baseline. Light and dark previews show no prominent green fringe, grid remnants, labels, clipping, or cell overlap. Source margins are retained around each figure.

## Disposition

Allow this candidate to proceed to a separate Krios-specific ball-track trial. This source review does not approve runtime registration or ball timing. Track calibration and its own visual review remain outstanding.
