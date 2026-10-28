# Independent candidate track review — Krios `dunk-reverse` attempt 02

**Verdict: REJECT track attempt02 for further calibration; not runtime registration.**

Reviewed all 60 candidate captures for 15 sampled frame/ticks, both facings, and 100%/120% zoom on the current Jam Stage court. The report confirms the candidate-only atlas/track injection, correct clip/frame selection and directional flip, expected release and score events, and zero uncaught browser errors.

## Findings

- Track02 corrects the worst HUD clipping from attempt01. The ball is fully visible at gather frame05/tick10 and peak frame07/tick14 at both facings and zooms, with a much closer relationship to the two cupped hands behind Krios's head.
- Frame09/tick19 still breaks hand continuity: at 120% in both facings, the ball hangs well below and slightly apart from the overhead reaching hand. This reads as a loose ball before the release. Increase frame09 forward placement toward the hands and raise it slightly, then recheck the neighboring arc at both zooms.
- Frame10/tick21 release reaches the rim and arm contact reads clearly in both directions. Krios owns the carried ball through tick19, the ball is ownerless in dunk mode at tick21, and the correct two-point score appears at tick23. Landing/recovery continues through tick30 with a dead unowned ball.
- No missing sprite, fallback, mirror selection problem, court-framing defect, or browser error was found.

## Next calibration

Preserve this attempt as rejected evidence. Keep the successful gather and peak correction, and adjust frame09 to bring the held ball back to the raised hand without causing HUD collision. Repeat all 60 normal simulation captures; do not register until a normal-loader pass.
