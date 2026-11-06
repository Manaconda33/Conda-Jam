# Independent source review — Krios `dunk-360` attempt 01

**Verdict: PASS FOR CLEANUP AND SEPARATE BALL-TRACK TRIALS ONLY; NOT ACCEPTED FOR REGISTRATION.**

Reviewed the raw 5×3 ImageGen sheet against the exact attempt01 prompt and canonical `dunk-360` pose descriptions.

## Findings

- Krios remains recognizable and consistent across the 15 drawings: volcanic-red skin, curled black ram horns, charcoal beard, muscular adult human anatomy, charcoal uniform with ember-red trim, and dark shoes. No obvious species, face, or costume changes between cells.
- The output contains 15 visually distinct, complete figures. Approach and load differ; the early turn shows Krios's back and far side; later frames return to the right-facing target. The 360 read is present but the rotation compresses quickly in frames2–4, so preserve orientation changes during cleanup and check the motion at native 128×96 size.
- The chest gather in frame5, raised-ball preparation in frames6–7, forward whipping extension in frame9, and open-finger release in frame10 are distinguishable. Frame11's two-arm balance follow-through differs from release. Keep that release/follow-through separation when normalizing; runtime review must confirm it remains legible.
- All bodies appear full, with horns, hands, feet, and shoes inside the raw image. Row spacing is clear. No ball, ball-like circle, hoop, text, logo, court, or extra character is visible.
- The source uses a bright green backdrop and has no explicit grid lines. Cleanup should isolate by the detected row/column layout, preserve true transparent cells and common baseline, remove green spill without eroding red skin, and verify all 15 unique normalized poses on light and dark backgrounds.

## Gate before registration

This review does not accept cleaned artwork or gameplay integration. Complete and inspect cleanup, record its exact layout/report and light/dark proofs, then calibrate Krios's separate track. Review every anchor and the 360 torso turn, hand-held ball alignment, release, score and landing through the normal loader on the current Jam Stage court in both facings and zooms before registration.

## Provenance checked

- ImageGen ID: `exec-13df01bd-b980-41a4-806c-15bfcfdad9c3`
- Prompt: `tools/generate-art/krios-dunk-36015-attempt01-imagegen-prompt.txt`
- Raw source: `tools/generate-art/sources/krios-dunk-36015-attempt01-generated-raw.png`
- Raw SHA-256: `9a0ec487e02cb9b0b1691410331372f3761b4cc9a45c590f50842e677f2e1c7d`
