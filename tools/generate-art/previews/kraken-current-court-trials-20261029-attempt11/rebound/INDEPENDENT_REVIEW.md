# Kraken rebound attempt02 track attempt04 — independent review

**Verdict: FAIL for track acceptance; retain candidate-only trial evidence. Do not register.**

Reviewed attempt11's rebound captures for ticks 0, 2, 4, 5 and 7 at both facings and zoom100/120, plus the current-court report. The track uses H `[0.4, 0.2, 0.65, 0.65, 0.75]`, F `[3, 2.5, 0, 0, 1]`. All samples select the candidate attempt02 cleanup01 atlas; facing-left is mirrored with `flip: true`, and facing-right uses `flip: false`.

The live fixture is a missed Leo three-point shot (`shotMade: false`) followed by a loose rebound and Kraken catch. All four runs report an actual rebound and possession transfer. The court is Vesper Harbor Undertow vs Blackthorn Court Kings at courtY75; score stays 0–0 and browser errors are empty. The test is candidate-only (`candidateOverridesOnly: true`, `productionRegistration: false`).

Attempt04 improves the prior versions, but the grab contact still does not land in Kraken's hands. Tick0 has a tiny loose-ball mark above the player; tick2 shows the incoming ball above the raised fingertips; tick4's apex (reported loose-ball z=3.14) is not visibly at the overhead hands. At the tick5 transfer/frame3, the ball appears at the navel/upper-pelvis rather than the gathered chest-level hands in both facings and both zoom levels (for example `right-zoom120-rebound-tick05.png`, `left-zoom100-rebound-tick05.png`). At tick7/frame4 it sits nearer the torso and reads as a hold, but the catch frame itself remains visibly low; the ball moves up into the hold after possession transfers. The visual gap at tick5 is still clear at zoom100. Recalibrate frame3 upward so its ball center overlaps the hands, then recheck the tick4-to-tick5 transfer and held frame4 in all views.

No other simulation defect was found. The report and captures consistently show the missed shot, catch, candidate source, mirroring, score, and error state. Keep the trial unregistered until the hand contact is corrected and independently passes.

Reviewer: independent gameplay audit. Review date: 2026-10-29.
