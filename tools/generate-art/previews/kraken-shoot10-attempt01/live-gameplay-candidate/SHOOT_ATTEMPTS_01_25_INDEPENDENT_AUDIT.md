# Kraken J.129 `shoot` attempts 01–25 — independent viewport audit

## Finding

Attempt25's main late-flight failure is an omitted athlete-specific `releaseVz`, not a bad contact vector. Its report has no `releaseVz` in `candidateTrack`; `makeShot` therefore uses the generic high shot launch. The observed post-release sample at `flight-sample037` is still at `z=28.46`, and the ball is offscreen above the fixed HUD while its ground shadow remains visible. At 120%, the fixed hoop is also too close to the outer edge in the attempt25 setup. These are separate issues: launch arc/vertical visibility, and camera/rim framing.

## Evidence

- Attempts20–21 use the complete vector with `releaseVz: 0.46`. Their post-release trajectory is far shorter: the sampled maximum is about `z=7.05`, and the ball reaches the hoop/dead state around post-release step37. Both attempts score three points in all four facing/zoom runs. Their camera seed at x142/right and x58/left is 163.545/36.455. Independent review accepted attempt21's release, mirroring, sampled ball visibility and score, but explicitly notes that its capture used a temporary Jam Stage shot-height scale of 0.8 and needs comparison against another registered shooter.
- Attempts22–25 changed the setup to x135/right and x65/left, y=90, with camera seed x155.555/44.445. Their candidate track omits `releaseVz`; attempt25's report records post-step release `vz=1.1317` and a long high arc (`z=28.46` at the sample that loses the ball above the viewport). The ball is therefore not evidence of a malformed source pose or a failed scoring calculation. Attempt25 scores three points, but its 120% screenshot at left-facing tick19 shows the fixed rim cut by the left screen edge, and its late ball is hidden by the fixed HUD.
- Attempt21's track also has distinct gather/release samples. Attempt25 improved the held-ball hand contact while keeping similar gather samples. Its in-game release is tick13 and the ball becomes unowned normally; no post-release position writes are recorded.
- Attempts22–24 experimented with raised release-height samples while still omitting `releaseVz`; the attempt23/24 raises make the release itself much higher (`z≈11.3/11.8`) and increase the sampled peak. They do not address the default launch arc. Do not reuse those raised release-height values.

## Recommended next screen

Run one candidate trial that combines attempt25's better pre-release `height`/`forward` samples with an explicit `releaseVz: 0.46`, then compare it under the restored production renderer (`flightScale=1.62`). Retain `y=90` so `scoreValue` stays three points. Start from attempt21's x142/58 mirrored setup and its camera seed, which put the shooter nearer the target hoop and received a positive independent framing review. Do not patch the renderer or move the hoop for this trial.

Review every authored frame and continuous flight on the current Jam Stage court at both facings and 100%/120%. Specifically confirm release contact is unchanged, the target rim is fully visible, the late ball stays below the fixed HUD and inside the viewport, the ball meets the same fixed hoop, score is three points, and there are no browser errors. If the rim is still clipped after the camera follows, test only the hoop-aware camera seed/pan while keeping the simulation shot, fixed hoop geometry, and `releaseVz` unchanged; independently compare the same camera/renderer change against Reed's registered shot before proposing any shared renderer edit.

Attempt21's old 0.8-scale captures are useful as trajectory/camera evidence only; they are not production proof with today's renderer. Attempts22–25 are useful evidence for contact and the missing-`releaseVz` diagnosis, not acceptance captures. No files, runtime assets, renderer code, or ImageGen sources were changed for this audit.
