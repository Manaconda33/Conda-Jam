# Independent normal-loader re-review — Krios J.128 `dunk-windmill`, track attempt04

**Verdict: PASS for the current registered normal-loader capture set.**

## Evidence reviewed

Rechecked the current report and all 60 regenerated captures after the track attempt04 rerun: 15 sampled frames/ticks × both facings × 100% and 120% zoom. The report identifies `trackAttempt: 04`, `runtimeIntegration: true`, no candidate atlas/track injection, and the registered atlas `public/assets/animation/krios-dunk-windmill-right.png` (SHA-256 `81e22ddddd03eb31d5bc176228d19b456df881839fee83ec7268d21363c663a0`). All captures select the expected cells; left-facing captures use the mirror flag. Jam Stage courtY90 is recorded, with no browser or console errors.

## Findings

- **HUD clearance and hand relation:** With the lowered frame7/8 heights (1.6 and 1.55), the full ball clears the bottom of the HUD in both facings at both zoom levels. The ball stays close to the raised hand through the high arc; the peak reads as a controlled one-hand hold. No clipping or new athlete overlap is visible.
- **Other motion:** The sampled poses read in order from planted load through the circular gather, lift, peak, forward drive, release, follow-through, and landing/recovery. Krios's full anatomy, identity, and silhouette remain coherent. The ball remains separate from the atlas throughout.
- **Release/contact:** At frame10/tick21 the ownerless dunk ball sits at the rim in both directions, and Krios's reaching arm enters the hoop. The ball/rim/hand relationship reads as contact without obscuring the torso. The ball is absent at tick23/frame11 as follow-through continues.
- **Ownership and score:** The capture state shows Krios carrying through tick19, ownerless `dunk` mode at tick21, and `dead` mode with the correct two-point score and `Krios scores 2!` event at tick23. The scoreboard matches in both directions. Landing/recovery remains visible through the final sampled frame.
- **Stage framing/artifacts:** Court, hoop, player, and HUD stay within the stage view. No spill, missing sprite, atlas edge, or browser artifact is apparent. A small `P1` gameplay prompt appears in some 100% views but does not intersect the ball or action.

## Recommendation

The current track attempt04 and registered `dunk-windmill` atlas pass this independent normal-loader review, including the corrected peak margin in both facings and zoom levels.
