# Independent Krios pickup track review

**Disposition: approved for integration.** Reviewed `attempt-04` candidate track and its production Jam Stage captures on 2026-10-28.

## Evidence reviewed

- `attempt-04/native/report.json`: 32 screenshots, four gameplay runs (right/left facing at 100%/120%), using a one-time loose-ball fixture followed by normal production `stepMatch` progression. No per-tick teleports; zero browser errors.
- For each facing and zoom, I reviewed ticks 0, 2, 4, 6, 7, 8, 10 and 11 in the corresponding `attempt-04/native/actual-{right,left}-pickup-tick{00,02,04,06,07,08,10,11}-zoom{100,120}.png` files.
- Track: H `[0.65, 0.45, 0.2, 0, 0.75]`; F `[3.5, 4.5, 5.5, 4.5, 4.5]`.

## Findings

- The loose ball approaches Krios at the front/outside hand through tick 6. At tick 7, the simulation emits `Krios grabs the ball`, sets `hasBall: true`, and changes ball mode to `carried` with owner `krios`. The ball visibly meets the reaching hand at the floor in both facings at both zoom levels.
- At ticks 8–11, the carried ball remains attached near the hands/abdomen as Krios rises into the carry pose. Left-facing art is mirrored and the contact remains on the anatomically correct outside hand. I found no missed catch, detached ball, clipping discontinuity, incorrect owner, or rendering/browser error.
- Frame progression is coherent from low reach through grab and recovery. The ball stays independently rendered; it is not baked into the atlas.
- At 100% the ball and hand are small but still read as contact; 120% confirms the contact clearly. The HUD grab announcement is at tick 7 as expected.

The report's candidate art/track are memory-injected for this calibration, so this review approves the candidate track and captures for integration; it does not claim the checked-in runtime manifest has already been changed or validated.

## attempt-07 retune review (supersedes the attempt-04 track approval)

**Disposition: approved.** Attempt 07's retuned carry track is approved for integration. It improves tick-6 contact visibility and lifts the carried ball into a clearer torso-level hold after the grab.

- Evidence: `attempt-07/native/report.json` plus all 32 `attempt-07/native/actual-{right,left}-pickup-tick{00,02,04,06,07,08,10,11}-zoom{100,120}.png` captures.
- Candidate track: H `[0.65, 0.45, 0.2, 0, 1.35]`; F `[3.5, 4.5, 5.5, 4.5, 0.5]`. The one-time fixture uses a 1.5 court-depth offset; thereafter normal production progression runs without per-tick teleports.
- At tick 6, the loose ball is visibly at the reaching hand at both 100% and 120% in both facings. The 100% view is smaller but the ball remains discernible beside the palm; 120% makes contact position clear.
- At tick 7, Krios reaches the ball and the ball overlaps the low hand naturally. The report records `Krios grabs the ball`, `hasBall: true`, `mode: carried`, and `owner: krios`. This holds in both facings and both zooms.
- At tick 8, the body rises and the carried ball moves to a chest/abdomen hold between the hands. The one-step lift is quick, but reads as Krios gathering and rising from the floor rather than a detached ball; there is no intermediate stray position or ownership break. The following ticks 10 and 11 retain this held-ball placement.
- Mirroring keeps the ball on the outside/reaching hand in left-facing runs. All four runs end with Krios in possession and no browser errors.

As with attempt 04, these are candidate-injected captures. This approves attempt 07's artwork/track calibration evidence, not runtime integration by itself.
