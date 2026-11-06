# Independent gameplay review — Kraken shoot attempt 22

**Verdict: flight, score, and visibility pass; release-to-hand visual alignment fails. This track is not ready for registration.**

Reviewed the 76 production Jam Stage Chromium screenshots and `report.json` across left/right facings at 100% and 120%, covering the setup, authored shoot frames, release, sampled flight, and score completion. All 76 paths exist and match their recorded SHA-256. The current Jam Stage court is used. The report records no failed requests, uncaught browser errors, or terminal misses.

## Gameplay and flight

- Kraken starts with the ball carried and owned. At release tick 13, `hasBall` becomes false and the ball has `mode: shot`, `ownerId: null`; the shooter is still on frame 5 of the shoot clip. The left-facing render mirrors the same candidate atlas, while right-facing is unflipped.
- Flight continues through peak and descent toward the hoop in both directions. The ball remains visible in the provided flight samples at 100% and 120%; it does not disappear behind the athlete or HUD. The camera keeps Kraken and the ball in frame. The hoop is partly cropped at 120% in places, but the ball and flight remain visible.
- Both test runs score successfully: Kraken's team receives 3 points, the ball becomes dead, and the attempt is recorded as scored. Scores are `[3, 0]` facing right and `[0, 3]` facing left. The completion captures show the score state in both zooms.
- The action and ball are visible at both tested zoom levels. No edge crop of Kraken or release ball was found in the reviewed key poses.

## Contact and release alignment defect

At tick 10/frame 4, the ball is near the raised hands and face; contact is readable in both facings. At release tick 13/frame 5, however, the ball appears well below and to the side of the fully raised shooting hand, around shoulder/chest height. In the 100% and 120% screenshots the gap is several ball diameters vertically. The same separation remains visible at tick 14/frame 6 and early flight samples. This makes the ball look detached before the shot, even though the simulation correctly transfers ownership and launches it.

The issue is mirrored consistently, so it is not a facing-specific flip error. Review and recalibrate the shoot track's release-frame ball position (and neighboring frame continuity), then recapture both facings and zooms. Flight trajectory, ownership transition, and 3-point resolution should remain unchanged.

## Other visual note

The score-complete screenshots display a very large red celebrator graphic while the recorded actor clip is `celebrate` and `src` is null. It appears in all four runs. This may be a shared score celebration overlay rather than the shot track, but it is visually unrelated to Kraken and should be confirmed separately before using those frames as character-specific animation evidence.

No code, source artwork, or production registration was changed during this review.
