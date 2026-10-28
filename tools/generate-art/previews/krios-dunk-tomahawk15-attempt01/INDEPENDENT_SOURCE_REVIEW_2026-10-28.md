# Krios `dunk-tomahawk` attempt 01 source review

**Review date:** 2026-10-28
**Verdict:** PASS FOR SEPARATE BALL-TRACK TRIALS ONLY; NOT ACCEPTED FOR REGISTRATION

## Evidence reviewed

Reviewed raw ImageGen sheet, exact prompt, normalized 15-cell candidate, isolated target-size poses, cleanup/layout report, light and dark previews, and canonical `dunk-tomahawk` poses/anchors from `tools/generate-art/pose-catalog.json`.

## Findings

- Krios identity is consistent across the sheet: volcanic-red skin, black curled ram horns, charcoal beard, muscular adult humanoid proportions, black kit with ember-red trim and dark shoes. Face, horns, facial hair and uniform remain coherent across the sequence.
- All 15 cells contain a complete figure with two arms/hands and two legs/feet. There are 15 separate components and 15 distinct normalized frame hashes. No body parts, horns, hands, or footwear are clipped.
- The pose sequence reads as approach/load, takeoff, backswing behind crown, cocked tomahawk, downward release, distinct downward follow-through, recovery and planted landing. Release frame10 and finish frame11 are distinguishable at target size. Frames3–4 and 5–7 form close neighboring airborne poses; they are pixel-distinct and aligned to the canonical action, but require runtime motion review to confirm the short held transitions remain legible.
- The atlas is transparent RGBA, normalized to 15 cells of 128×96, with shared baseline y94, minimum 8 px top margin and at least 22 px horizontal margin. Nearest-neighbor scaling retains pixel definition. Green despill was applied; no visually distracting fringe appears on either light or dark preview.
- No basketball, ball-like circle, rim, text, logo, or court element is baked into the athlete artwork.

## Limits and next gate

This review approves the cleaned source for separate athlete-specific ball-track calibration only. It does not accept runtime registration. Calibrate the Krios-only tomahawk track and review all action anchors, difficult pose transitions, both facings, and 100%/120% zoom on the current Jam Stage using the normal production loader. Verify release tick21, score tick23, and landing tick30.

## Provenance checked

- Generation ID: `exec-cff0c167-34bf-41a4-806c-15bfcfdad9c3`
- Raw source SHA-256: `2742089abf01ad1eb36ef496196368c138afa7b9bbe5f9008ad32153fea9aa96`
- Prompt SHA-256: `d86054fb5fb6383d4d4f705282728f34e0485bb3f54eda0c891be327e35758ad`
- Clean candidate SHA-256: `0cea7aaccf5def1b1a6ae15de241222182feae8366a8aebf1b5e5c03c3d26774`
- Cleanup report: `cleanup-layout-report.json`
