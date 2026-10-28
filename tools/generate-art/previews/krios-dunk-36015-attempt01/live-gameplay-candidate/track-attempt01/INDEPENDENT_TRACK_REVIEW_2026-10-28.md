# Krios `dunk-360` track attempt01 review

**Verdict: REJECT track attempt01; preserve for calibration only.**

## Evidence

Reviewed the 60 current Jam Stage captures at all 15 frame starts, both facings, and 100%/120% zoom. The report confirms the candidate atlas and separate track were injected for this calibration pass (`runtimeIntegration:false`), all expected clip cells were selected, both mirror directions rendered, and there were no uncaught browser errors. The court is the current Jam Stage at `courtY90`.

## Findings

- **Ball-hand alignment fails during the gather and turn.** At frames5/tick10 the ball floats well above Krios's gathered hands in both facings at 120%. At frame7/tick14 it remains above the raised arm and is partly occluded by the top HUD. The ball does not read as securely held through the rotation.
- **Pre-release alignment fails.** At frame9/tick19 the ball is separated from Krios's extended hand in both facings. The ball position does not follow the action into the release.
- **Peak clearance fails.** Frame7's ball intersects the top HUD at zoom120. The athlete and hoop remain visible; this is a track-height collision.
- **Release and gameplay transition pass.** At tick21 the ball becomes ownerless in dunk mode at the rim; at tick23 the score updates by two points and the ball is dead/unowned. The authored follow-through and landing frames continue through tick30 without a fallback ball.
- **Framing and selection pass.** The 15 requested frames select in order for both facings; no missing sprite or browser/console error appeared. The full-turn source poses and 360 action sequence are a separate source-review item.

## Calibration guidance

Lower the held-ball heights materially around frames5–9 to restore hand contact and clear the HUD, then tune the forward offsets to keep the ball on the gathered/raised hand during the turn and at frame9. Recheck both facings and zooms before normal-loader review. Do not register this track.
