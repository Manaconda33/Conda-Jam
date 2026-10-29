# Krios `dunk-scythe` attempt01 source review

**Review date:** 2026-10-28
**Verdict:** PASS FOR SEPARATE BALL-TRACK TRIALS ONLY; NOT ACCEPTED FOR REGISTRATION

## Scope reviewed

Reviewed the raw 5×3 ImageGen sheet, 15 normalized 128×96 pose crops, 15-cell transparent strip, cleanup/layout report, light and dark previews, and the canonical `dunk-scythe` pose descriptions and anchors.

## Findings

- The sheet has exactly 15 full-body Krios figures, one per cell, with all 15 normalized pose hashes unique. Krios's volcanic-red skin, curled black ram horns, charcoal beard, massive build, charcoal/ember uniform and dark shoes remain consistent. Hands, arms, legs, shoes and horns remain attached and inside the cells.
- The animation reads as a wide lateral scythe sweep: low far-hip cradle and load, lateral extension, crossing sweep, broad overhead arc, diagonal cut, opposite-side follow-through, wide balance and controlled landing. Release frame10 is a diagonal down-cut and differs from the frame11 cross-body follow-through. The separate-track trial must verify the exact handed contact and timing in motion.
- Source cleanup preserves transparent backgrounds and uses nearest-neighbor scaling without redraw. Light and dark previews show no distracting green fringe. All cells share baseline y=94; minimum top margin is 8 px and minimum horizontal margin is 12 px. The 15-cell strip is 1920×96 RGBA. Chroma cleanup reports 317–437 despilled pixels per figure; the visible edge treatment and uniform shading remain coherent at target size.
- No basketball, ball-like circle, rim, text or unrelated prop is baked into the athlete sheet.
- Frames2–4 and frames5–8 form short, deliberate transition groups. The poses are distinct in the normalized previews, though their lateral hand path should receive close scrutiny at gameplay scale. This is a motion-review risk, not a block to separate-ball-track calibration.

## Limits and next gate

This review authorizes only separate ball-track trials. It does not approve runtime registration. Calibrate Krios's separate ball track, then review the actual current Jam Stage normal-loader sequence in both facings and 100%/120% zoom, including the lateral contacts through tick19, diagonal release at tick21, score at tick23 and landing at tick30. Preserve this source and review if a later attempt replaces it.

## Provenance checked

- ImageGen generation: `exec-bc73f0d0-27e6-4baa-b6b6-2b6aa450c265`
- Prompt SHA-256: `8fb7544843f6f8620387b9a5c6ae92f49b8324e9d3033e5453d28e0b93313a3a`
- Raw source SHA-256: `ca2ada640955fdb2e2efb31c4bc0f6930f577f7e4fe14a10e0017000826c6c33`
- Normalized trial atlas SHA-256: `87f16ec492c286c9ddcb61c09acc1f515d6acdfec92719fc1e144d097606f0ac`
- Cleanup report: `cleanup-layout-report.json`
