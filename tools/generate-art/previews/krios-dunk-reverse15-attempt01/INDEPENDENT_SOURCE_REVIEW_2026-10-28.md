# Krios `dunk-reverse` attempt 01 source review

**Review date:** 2026-10-28
**Verdict:** PASS FOR BALL-TRACK TRIALS ONLY; NOT ACCEPTED FOR REGISTRATION
**Files reviewed:** raw ImageGen source, normalized 15-cell runtime candidate, pose-isolated previews, cleanup layout report, and canonical `dunk-reverse` pose catalog.

## Findings

- The athlete remains recognizable as Krios: red skin, dark hair, black uniform with red trim, and the same broad build appear consistently across the sequence. No unintended character or costume changes were apparent between frames.
- Full-body anatomy is present in all 15 extracted cells. The figure remains coherent through the jump and rotation; hands, limbs, and feet are visible rather than clipped. The reverse dunk reads from the back-facing gather through backward overhead reach and the turn into landing.
- The sequence covers the catalog's approach, planted load, takeoff, ascent, behind-head gather, peak, reverse extension, release, follow-through, drop, and landing. Frames 0–3 and 8–14 show useful changes in body orientation or limb position.
- Frames 4–7 form a deliberately tight airborne gather/hold passage, but adjacent poses are close at 128×96. Frames 9–11 are also similar overhead extensions. They are pixel-distinct and the action reads in sequence, though the release/follow-through distinction is subtle at native cell size. This is a review risk for the subsequent normal-loader pass, not a reason to block exploratory track calibration.
- Cleanup found 15 separate figure components and produced 15 unique normalized frame hashes. The atlas is RGBA with transparent cells, common baseline at y=94, minimum top margin 8 px, and minimum horizontal margin 22 px. Nearest-neighbor scaling and the green-despill cleanup preserve the pixel-art edge treatment. Both light and dark previews were checked for residual green fringe; none was visibly distracting.
- No basketball, ball-like prop, text, logo, or court element is baked into the athlete artwork.

## Limits and next gate

This review approves the source only for separate-ball-track trials. It does not accept the atlas into the production manifest. Calibrate the reverse-dunk ball independently, then inspect all required action anchors and both facing directions through the normal runtime loader on the current Jam Stage court. Pay special attention to whether the subtle frame 10 release and frame 11 follow-through remain legible in motion. Preserve this source and review if a later attempt replaces it.

## Provenance checked

- Generation ID: `exec-c761aa1e-4910-4746-8500-1e2e10409f46`
- Raw source SHA-256: `9341468350a4f55e76d6f594bf0c1175d584b06a8534e15594418afe176c19ce`
- Normalized candidate SHA-256: `5ff3a4093b2f414aeb163479b6d903d555236a1f3b8492a2da9ae3813d378d75`
- Cleanup report: `cleanup-layout-report.json`
