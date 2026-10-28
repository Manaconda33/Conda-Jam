# Kraken shoot track attempt22 — independent Jam Stage review

**Verdict: gameplay release and scoring pass for Kraken; shared shot rendering remains visually blocked. Do not register the candidate.**

Reviewed the current production Jam Stage captures in `report.json` and `reed-ashcroft-current-review/report.json`, including both facings at 100% and 120%. The active source uses `stageBallFlightScale('shot') = 0.8`; no simulation state is changed after release. Candidate artwork and track remain unregistered.

## Findings

- Kraken selects all ten candidate frames at the expected ticks, mirrors correctly, carries through the tick12 setup, and releases ownerless at tick13 in both facings and zoom levels. All four runs reach the actual score-complete capture with a three-point score; browser errors and failed requests are empty.
- Kraken's sampled late-flight ball is visible in both 120% facings. At `flight-sample037` it sits just below the fixed HUD, with only a narrow visual gap. This sample does not establish comfortable clearance across every flight tick.
- Reed Ashcroft's normal registered shoot track also releases at tick13 in both facings. Its 120% captures show the ball at tick43, but the ball is not visible at ticks73 and 83 while the recorded state still has `mode: shot`. Those late frames therefore fail the requested visibility/occlusion check. The comparison report has no score-complete capture, so scoring is not verified for Reed in this review.
- No visible ball/hand mismatch was found at the tick13 release frame. The fixed HUD and ordinary asset loader are present in the Reed comparison; the candidate atlas and custom track are used only in Kraken's run.

## Decision

The 0.8 shot scale keeps Kraken's sampled late flight on screen and Kraken scores, but it does not demonstrate consistently visible flight for a registered shooter at 120%. Preserve this attempt as a gameplay trial. Keep the change and candidate unaccepted until the late-ball disappearance for Reed is explained and both player classes have complete 120% flight and scoring evidence.
