# Independent ball-track review: Krios windmill attempt02, track03

## Verdict

**Visual track review: pass for this injected live-gameplay candidate.** The separate ball reads as controlled by Krios at the sampled hand-contact poses, including both facings and both tested zooms. The track supports the windmill path through takeoff and peak, stays in hand through the pre-release frame, and transfers to the dunk event at tick 21. This review does not register or accept the candidate into the normal asset loader: `report.json` records `runtimeIntegration: false`, with candidate atlas and track injected for these trials.

## Review evidence

- Inspected the current Jam Stage captures for both facings at 100% and 120% zoom, including frame 0/tick 0, frame 5/tick 10, frame 7/tick 14, frame 9/tick 19, frame 10/tick 21, score frame 11/tick 23, and landing/recovery frame 14/tick 30. The 60-capture set covers frames 0–14 in four facing/zoom combinations.
- At frame 0 the independent ball sits at Krios's lowered carrying hand/waist. At frame 5 it is at the hand passing behind the head during the windmill. At frame 7 it meets the fully raised hand at the peak. At frame 9 it remains at the reaching hand immediately before release; it reads as a hand-held ball in both facings rather than a floating ball or a ball on the opposite side of the body.
- Frame 10/tick 21 shows the separate ball at the rim and no longer carried. Frame 11/tick 23 reports `Krios scores 2!`; the score is on Krios's team side for each facing. Frame 14/tick 30 shows Krios grounded in recovery while the ball is dead and unowned.
- The live report selects the intended windmill atlas frame at every sample, reports no uncaught browser errors, and reports zero `carriedDelta` at carried samples. This confirms the simulation follows the supplied track; visual hand contact was reviewed separately from those state fields.

## Track values reviewed

Frame-indexed candidate values (`height`, `forward`):

| Frame | Tick | Pose/check | Height | Forward |
|---:|---:|---|---:|---:|
| 0 | 0 | carry at lowered hand | 0.70 | -4 |
| 5 | 10 | windmill hand behind head / grab | 1.40 | -3 |
| 7 | 14 | raised-hand peak | 2.00 | -1 |
| 9 | 19 | reaching hand, pre-release | 1.80 | 8 |
| 10 | 21 | separate ball at dunk/rim | 1.95 | 13 |
| 11 | 23 | score | 1.40 | 10 |
| 14 | 30 | grounded recovery | 0.70 | 4 |

The sampled points form a continuous rise from the carry through the raised-hand peak, sweep forward through frame 9, then transfer to the rim at release. **No frame-specific track adjustment is recommended from this review.** Keep this verdict scoped to the candidate capture setup; repeat the anchor and scoring checks after runtime registration, and recheck in the normal loader before production acceptance.
