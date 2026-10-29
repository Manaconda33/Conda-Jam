# Independent review: Krios `dunk-double` track attempt 01

**Disposition: reject this track for runtime acceptance; retain the capture set as diagnostic evidence.**

Reviewed all four injected-candidate capture runs (right/left facing at 100% and 120% zoom), focusing on the first pump, fold/resecure, second gather/apex, second extension/release, score and landing. The report records 60 captures, expected 2-point scoring, and zero uncaught browser errors. The candidate track is `[1.0, 0.9, 1.2, 1.8, 1.3, 1.1, 0.9, 0.8, 1.3, 1.8, 2.0, 1.2, 1.0, 0.8, 0.7]` height and `[5, 4, 3, 1, 1, -1, -1, -1, 0, 3, 12, 10, 8, 6, 4]` forward.

## Observations

- **First pump (tick 7): fail.** The ball is centered over Krios's face, masking the head and with no clear hand-to-ball contact in either facing. See `right-frame03-tick07-zoom120.png` and `left-frame03-tick07-zoom120.png`.
- **Fold/resecure (ticks 9–10): weak.** At tick 9 the ball still covers the face; at tick 10 it moves down to the shoulder/upper torso, but the transition reads as a floating ball passing across Krios rather than a controlled gather. See frames 04–05.
- **Second gather/apex (ticks 12–14): acceptable trajectory, contact still indistinct.** The ball is held around the chest, away from the rim, but the hands do not visibly bracket or support it. See frames 06–07.
- **Second extension (ticks 17–19): fail.** At tick 17 the ball is offset beside the raised arms near shoulder/head height; by tick 19 it sits over the head rather than at an obvious hand. This makes the second pump look detached from the ball. See frames 08–09.
- **Release/contact and scoring: pass for gameplay timing.** At tick 21 the ball is at the rim while the score remains 0; by tick 23 the expected 2 points register in the correct side's score for each facing. See frames 10–11.
- **Landing: pass.** Tick 30 shows Krios grounded and stable in both facings; no missing sprite or visible discontinuity was found. See frame 14.
- **HUD and framing: pass.** At both zooms and both facings, the action remains in frame and does not obscure the HUD. Mirroring is consistent. No browser errors were recorded.

## Recommendation

Do not register this ball track as accepted yet. Retune the candidate samples at ticks 7, 9, 17 and 19 against the hands so the ball does not cover Krios's face or visibly float away during either pump. Keep the successful tick-21 rim contact, tick-23 score, and tick-30 landing behavior intact, then recapture both facings and both zooms. These captures used candidate atlas and ball-track injection (`runtimeIntegration: false`), so they do not establish runtime registration.
