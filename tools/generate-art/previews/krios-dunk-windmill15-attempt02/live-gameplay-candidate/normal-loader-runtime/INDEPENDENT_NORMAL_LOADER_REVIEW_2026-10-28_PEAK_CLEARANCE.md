# Follow-up normal-loader review — Krios J.128 `dunk-windmill`

**Verdict: PASS for the refreshed normal-loader captures.**

## Evidence reviewed

Rechecked the refreshed 60 captures in this folder after lowering track heights at frames7/8: 15 sampled frames/ticks × both facings × 100% and 120% zoom. `report.json` confirms normal-loader runtime integration, no candidate injection, registered atlas `public/assets/animation/krios-dunk-windmill-right.png` (SHA-256 `81e22ddddd03eb31d5bc176228d19b456df881839fee83ec7268d21363c663a0`), expected selected source/frame metadata and left-facing flip, current Jam Stage at courtY90, and no browser or console errors.

## Findings

- **Peak HUD clearance:** The ball now clears the top HUD at frame07/tick14 and frame08/tick17 in both facings at 100% and 120%. The full ball contour remains visible. Lowering the frame7/8 heights also places the ball closer to the raised hand, so the peak reads as a controlled one-hand hold instead of a detached ball above the player.
- **Motion and hand relation:** Across the reviewed sequence the ball remains a separate runtime object and tracks the planted load, circular gather, lift, peak, forward drive, and reach. Krios's anatomy and silhouette remain readable. The ball is near the hand through the higher arc; no new collision with the athlete or court is apparent.
- **Release/contact:** At frame10/tick21 the ownerless dunk ball is centered at the rim in both directions and zoom levels. Krios reaches into the hoop; the ball/rim/hand relation reads as contact without covering the torso. At frame11/tick23 the ball is absent while the follow-through continues.
- **Ownership/scoring:** Report state confirms Krios carries the ball through tick19, it transitions to `dunk` with no owner at tick21, then to `dead` with the correct two-point score and `Krios scores 2!` event at tick23. Scoreboard and event presentation agree in both facings.
- **Landing and margins:** Frames12–14 show continued follow-through into landing/recovery. Athlete, hoop, and court remain framed; no atlas edge, limb, or court crop is apparent. A small `P1` gameplay prompt appears near the backboard in some zoom100 captures but does not overlap the ball, athlete, or scoring event.

## Recommendation

The refreshed normal-loader `dunk-windmill` capture set passes this review, including peak clearance, ball contact, scoring, and landing. The prior peak HUD defect is resolved in the reviewed captures.
