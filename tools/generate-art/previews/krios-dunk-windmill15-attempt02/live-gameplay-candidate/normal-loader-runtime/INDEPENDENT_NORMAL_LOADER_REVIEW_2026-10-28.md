# Independent normal-loader runtime review — Krios J.128 `dunk-windmill`

**Verdict: REJECT pending peak ball/HUD clearance.**

## Evidence reviewed

Reviewed all 60 captures in this folder: 15 sampled frames/ticks across both facings at 100% and 120% zoom. The capture report confirms normal-loader runtime integration, no candidate atlas or track injection, registered atlas `public/assets/animation/krios-dunk-windmill-right.png` with SHA-256 `81e22ddddd03eb31d5bc176228d19b456df881839fee83ec7268d21363c663a0`, and `dunk-windmill` selected for all requested cells. Right-facing has `flip: false`; left-facing has `flip: true`. The report records the current Jam Stage at courtY90 and no browser or console errors.

## Findings

- **Pose selection and action arc:** The 15 selected poses read in order as a planted crouch/load, lift, one-hand circular gather, high peak, forward drive, release/follow-through, and landing/recovery. The athlete remains recognizable as Krios with full anatomy. At the sampled points the ball stays separate from the atlas and tracks the raised hand through the arc; frame09/tick19 places it above the reaching hand before release.
- **Peak margin defect:** At frame07/tick14, the ball rises into and is visibly clipped by the bottom edge of the top HUD in both facings at 120%. The clipping removes the ball's upper contour and makes the peak feel cramped. This is a rendered margin/HUD collision, not missing source pixels. Keep the peak ball fully clear of the HUD in both directions and zoom levels before accepting this track/framing.
- **Release and contact:** At frame10/tick21, the ownerless ball is visible at the rim in both facings. Krios's raised arm reaches into the hoop, and the ball/rim relation reads as windmill dunk contact without covering his torso. At tick23/frame11 the ball is gone and the follow-through continues.
- **Ownership and score:** Krios owns the carried ball through tick19; it becomes ownerless in `dunk` mode at tick21; at tick23 it transitions to `dead` and records the two-point Krios score in both directions. The scoreboard and event banner agree. Recovery continues through tick30 without a visible fallback ball.
- **Court framing:** Athlete and hoop remain in frame across the sequence, and the court, audience, HUD, and score stay legible. Apart from the peak ball/HUD collision, there is no apparent court-edge clipping or identity/pose-selection mismatch.

## Recommendation

Correct the peak ball track height or stage attack framing so the whole ball clears the HUD at 120% in both facings, then recapture and review the 60-frame set. The rest of the reviewed motion, release/contact, ownership transition, scoring, and recovery are acceptable in these normal-loader captures.
