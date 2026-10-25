# J.123 Piper `alley-oop-power` native review

Reviewed 2026-10-25 by Codex parent, with independent visual review. The release-b lane-scale atlas is accepted; `atlas-bbox-height-release-b` remains a comparison candidate. The atlas packs 15 unique source poses in row-major order, preserves Piper's identity and adult human anatomy, uses transparent RGBA cells with clear margins, and contains no basketball. Pose09's angled closed fist and pose10's near-vertical splayed-palm release are distinct at native 128×96 size.

Actual `src/main.js` Canvas captures at standard 100% and 120% zoom cover all 15 frames in both facings. The catch pose05 receives the separate incoming ball at tick10. On carried poses05–09, the ball remains visibly attached through tick20 in both facings at both zoom levels, without a material gap or overshoot. At tick21, the open-palm release leaves the hand and travels toward the rim. The candidate3 track arrays are recorded in `track-calibration.json`; prior and failed candidate tracks remain preserved there and in the corresponding previews.

The focused simulation test uses a real teammate pass in both facings. Piper has no ownership before tick10, catches at tick10, carries through tick20, releases ownerless at tick21, scores once for two points at tick23, and lands at tick30. All action art remains ball-free; simulation owns and renders the basketball as a separate object.

Evidence:

- `native-100/report.json` and `native-120/report.json` record all selected frames and possession state.
- `native-100/` and `native-120/` contain the per-frame captures for both facings.
- The key catch, last-carry, and release screenshots are listed in the production manifest's `nativeReview.contactPreviews`.
- `tests/piper-alley-oop-power-candidate.test.js` verifies production selection, separate ball alignment, teammate-pass catch, single score, and landing.
