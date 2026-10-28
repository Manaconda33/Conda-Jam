# Independent candidate track review — Krios `dunk-tomahawk` attempt 01, track02

**Verdict: REJECT track02; preserve for calibration history.**

Reviewed all 60 candidate captures from the current Jam Stage across 15 sampled frames/ticks, both facings, and 100%/120% zoom. The report confirms candidate-only atlas/track injection, expected frame selection and left-facing flip, and no uncaught browser errors.

## Findings

- At frames05/tick10 and 07/tick14, the ball is carried near the bent/raised finishing hand in both facings and remains below the HUD.
- At frame09/tick19, the ball rises behind the top HUD and is clipped at 120% in both directions. It is not visibly attached to the raised hand before release, so carry continuity still fails. The high frame09 value is the cause; the preceding gather/peak improvement does not correct the pre-release gap.
- At frame10/tick21 the separate ball is at the rim during downward contact. Simulation keeps Krios as owner through tick19, switches to ownerless dunk mode on tick21, records the expected two-point Krios score at tick23, and completes the landing sequence with a dead/unowned ball at tick30, in both directions.
- Selector/mirroring, court framing, and browser execution otherwise pass.

## Calibration guidance

Keep attempt02 preserved and rejected. Lower frame09 height substantially from 2.2 to avoid HUD overlap, then adjust forward offset to meet the raised hand. Review the f8→f9→f10 progression at both zooms; do not accept a track that only fixes clipping by moving the ball away from the athlete.
