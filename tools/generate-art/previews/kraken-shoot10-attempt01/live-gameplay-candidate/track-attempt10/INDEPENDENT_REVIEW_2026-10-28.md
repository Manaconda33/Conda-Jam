# Independent review: Kraken J.07 `shoot` track attempt10

**Date:** 2026-10-28  
**Verdict:** **REJECT for full flight acceptance.** Release and sampled early flight are visibly improved; the ball leaves the visible play area near the later flight apex at 120% zoom.

## Evidence integrity and setup

- Reviewed `report.json` and representative native captures for right/left facing at 100%/120%, including release, flight samples at ticks14/19/23, later idle flight, and score completion.
- The report records 76 unique paths, all present and hash-matching. All four runs use Krios at the expected positions (right/home x130, left/away x70, y100), the expected facing, and the same candidate track with releaseVz 0.60.
- All four deterministic runs report `mode=shot`, no owner after release, and score `[3,0]` for `shot-1`.

## Checks that pass

- **Frame13 release:** the rendered ball visibly touches the raised shooting hand at frame5/tick13, then detaches. State confirms unowned `mode=shot`, `lastTouch=kraken`, `attemptId=shot-1`.
- **Continuous sampled flight:** the ball is visible and separated from the athlete at ticks14, 19, and 23 in both facings and both zooms. At tick23 it is near the upper court area but remains within the canvas bounds in these samples.
- **P1/HUD collision:** no P1 marker overlaps the ball during the frame13 release or the tick14/19/23 shoot samples. HUD remains readable at all four sampled stages.
- **Scoring:** score-complete captures show 3–0 and the report records the made attempt. Actor and hoop remain on canvas in the scored captures.

## Blocking visual defect

The later flight samples are not fully contained in the visible stage. In the 120% runs, `right-zoom120-flight-sample028-tick14-idle-frame01.png` and `left-zoom120-flight-sample028-tick14-idle-frame01.png` show Kraken back in idle while the ball is outside the visible play area (at most its shadow is visible). The report state places this later ball at z≈9.594; subsequent idle samples descend, but the apex is already clipped above/outside the view. At 100%, the corresponding images put the ball at the top crowd/HUD boundary rather than within the unobstructed play area. This means the full ball flight is not continuously visible across both tested zooms, even though the specifically requested early ticks and scoring event pass.

## Follow-up

Lower or reframe the later flight so the ball remains visible without colliding with the HUD at 120%, then repeat both facings/zooms through idle flight and score. Attempt10 is not accepted by this independent review until that flight segment is visible.
