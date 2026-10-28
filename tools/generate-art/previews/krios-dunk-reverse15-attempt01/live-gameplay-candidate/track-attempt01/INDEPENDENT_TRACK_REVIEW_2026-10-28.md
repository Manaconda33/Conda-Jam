# Independent candidate track review — Krios `dunk-reverse` attempt 01

**Verdict: REJECT track attempt01; source remains suitable for further ball-track trials only.**

Reviewed the 60 current Jam Stage candidate captures (15 frame/tick samples, both facings, 100% and 120%). The report confirms the candidate atlas and track were injected for trials, with the current court, no uncaught browser errors, the correct dunk-reverse selector and flip in both directions.

## Findings

- The reverse gather/release poses read as a two-hand overhead reverse motion, although some adjacent airborne art poses are close as recorded in the independent source review.
- Track01 does not keep the carried ball visually attached to Krios's hands through the reverse gather and peak. At frame05/tick10 the ball is driven above the top HUD and only partly visible; at frame07/tick14 it is obscured by the HUD/athlete area rather than clearly held by the hands. At frame09/tick19 the ball is again clipped by the HUD and separated above the reaching hands. These defects occur at 120% in both directions and make the carry continuity fail.
- At frame10/tick21 the separate ball reaches the rim with the reverse finish, and the rendered release/contact is legible in both directions. Simulation records Krios as owner through tick19, ownerless dunk-mode ball at tick21, and the correct two-point Krios score at tick23. Landing/recovery continues through tick30 with a dead unowned ball.
- No selector fallback, missing sprite, browser error, or unexpected team/court issue was found.

## Calibration guidance

Retain attempt01 unchanged as rejected evidence. Lower the separate track height substantially at frames05, 07, and 09 so the ball is not behind the HUD and can meet the cupped/raised hands; recapture all 60 samples and verify both facings. Recheck the neighboring arc for continuity, and keep the release/contact and scoring anchors intact. Do not register the source until a corrected track passes normal-loader review.
