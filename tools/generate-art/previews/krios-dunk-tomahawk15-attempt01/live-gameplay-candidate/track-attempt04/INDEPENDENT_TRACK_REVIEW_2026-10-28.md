# Independent candidate track review — Krios `dunk-tomahawk` attempt 01, track04

**Verdict: PASS FOR NORMAL-LOADER VERIFICATION; candidate-only, not accepted for registration.**

Reviewed the 60 current Jam Stage candidate captures: 15 sampled action frames/ticks, both facings, and 100%/120% zoom. The report confirms candidate atlas/track injection, exact requested sprite-frame selection, left-facing flip, and no uncaught browser errors.

## Findings

- **Gather and peak:** At frames05/tick10 and 07/tick14, the separate ball stays close to Krios's bent/raised finishing hand in both directions. The circle remains fully visible below the top HUD.
- **Pre-release contact and HUD:** Frame09/tick19 now places the ball directly at the elevated finishing hand in right and left facings. At 120% the upper contour clears the bottom of the HUD; the margin is narrow but the ball is not clipped or overdrawn. The 100% views have more separation. The detached/hidden ball defect from attempts01–02 is corrected in this trial.
- **Release and gameplay:** Krios retains possession through tick19. At frame10/tick21 the ball leaves into dunk mode and meets the rim during the downward tomahawk. At frame11/tick23 it becomes dead/unowned and records the expected two-point Krios score for the attacking team in each facing. Recovery completes through frame14/tick30 with the ball dead/unowned.
- **Presentation:** The current court and hoop remain framed; the correct sprite is selected in both directions. No fallback or browser error is reported.

This candidate track is suitable for normal-loader verification, with special attention to its tight frame09 HUD clearance. It is not yet production-accepted: repeat the 60-capture matrix using the registered manifest and Krios track before acceptance.
