# Krios dunk-clutch attempt 02 source review

**Review date:** 2026-10-28  
**Verdict:** **REJECT for the canonical `dunk-clutch` clip. Not registered.**  
**Ball track:** Not calibrated; these poses do not yet establish the canonical hand path.

## Provenance and cleanup

- This is an edit of attempt01, with generation ID `exec-2506373d-1d58-4afa-b242-ca5a347ffa67` (`2026-10-28T09:02:00Z`). The exact edit prompt is `tools/generate-art/krios-dunk-clutch15-attempt02-imagegen-edit-prompt.txt`, SHA-256 `62616d66a12c38e27fc48db9009b71632469eb7647d7fc5d5228e4c9065f7888`.
- Raw source: `tools/generate-art/sources/krios-dunk-clutch15-attempt02-generated-raw.png`, 1619×971 RGB, SHA-256 `6622fb713c472ea4b120bc195e0a26db49f3b1a73447ec740ac5d062200c7268`.
- Cleanup script: `tools/generate-art/clean-krios-dunk-clutch15-attempt02.py`.
- Cleanup extracted 15 full figures in row-major order into 15 transparent 128×96 cells, scaled uniformly with nearest-neighbor sampling and aligned to baseline y=94. It removed the green background, despilled green pixels, and did not redraw poses. `cleanup-layout-report.json` records 15 components and 15 unique normalized pose hashes.
- Review artifacts: runtime candidate atlas, isolated frames `pose-00`–`pose-14`, target-size contact sheet, and light/dark previews are retained in this directory.

## Findings

**Identity, anatomy, and extraction:** Krios remains recognizable across the sheet: volcanic-red skin, black curled horns, dark beard, charcoal uniform with ember trim, muscular build, and dark shoes. No basketball is baked into the art. The 15 extracted figures are complete enough for inspection, cell margins and common baseline are consistent, transparent backgrounds are retained, and the pixel art remains legible against both light and dark preview fields. No material green spill is apparent in the previews.

**Distinctness and canonical actions:** There are 15 distinct silhouettes by normalized hash, but several poses still miss the action-specific requirements in `tools/generate-art/pose-catalog.json`:

- Frame 5 has the airborne body and lifted knees, but the hand-under-abdomen catch and the guide hand peeling away are not clearly separated at target size.
- **Frame 6 still fails the defining protected clutch.** The finishing arm and hand reach diagonally upward/out beside Krios rather than low at centerline between the tucked knees.
- **Frame 7 still fails the apex pull.** The arm remains an elevated reach; the elbow does not visibly start pulling the held ball upward across the far ribs. It is not a clear transition from the low clutch in frame 6.
- Frames 8–9 show a more continuous upward/diagonal reach, though the held state before release is not strongly legible.
- **Frame 10 still fails the release anchor.** Its arm arcs over the head and reads as a generic overhead reach; the high diagonal extension and distinct downward wrist/finger flick are not evident.
- Frames 12–14 remain compact, partly similar crouches, making empty-arm separation, descent, and distinct landing impact weak.

Hash uniqueness does not compensate for these gesture failures. In particular, the underbody clutch, apex pull, and release are still not a dependable visual sequence. That prevents a valid athlete-specific ball track and makes the generated sheet unsuitable for canonical registration.

## Disposition

Preserve all raw and derived files as rejected attempt evidence. Do not register the atlas, count it toward accepted captain animation coverage, or calibrate a ball track against it. Another source must visibly place the hand low between the knees at frame 6, pull across the far ribs at frame 7, and show the diagonal release/flick at frame 10 at target size.
