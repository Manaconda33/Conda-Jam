# Kraken dunk-360 attempt01: independent gameplay review

**Verdict:** Gameplay completes and scores, but the ball path fails visual contact/visibility through the rotation. Retune before another candidate trial; do not register this track.

## Review scope

Reviewed all 60 captures (frames0–14, both facings, 100% and 120%), the atlas action sequence, and the report. Inspected frames7–10 at 120% directly in both facings. All four runs captured every sampled frame, with zero uncaught browser errors. Candidate atlas and track are injected; normal-loader integration is not tested.

## Findings

- Frames0–4 show a visible approach and gather. Frames5–9 carry the ball too high: at 120%, it is clipped by the upper HUD at frames5–6, disappears from view behind/above the HUD during the back-facing rotation at frames7–8, and is again clipped at frame9. The athlete continues to animate, but the ball does not visibly follow the rotating hand. Frame10 is the release/dunk transition.
- The cleanup atlas has distinct side, back and opposite-side poses through the spin. The gameplay sprite sequence itself is coherent; the mismatch comes from ball height/placement.
- Release enters dunk mode at tick21/frame10. Kraken scores at tick23/frame11 on the correct side (right-facing [2,0], left-facing [0,2]) and recovers upright at frame14/tick30.
- Both zooms and facings render, and the browser error list is empty. This was an injected candidate trial (`runtimeIntegration: false`).

## Suggested attempt02 retune

Lower the ball through the high rotation arc before changing forward offsets, since current screenshots do not expose enough of frames7–8 to judge lateral hand alignment. Estimated heights:

| Frame | Current height | Suggested height |
|---|---:|---:|
| 5 | 2.10 | 1.40 |
| 6 | 2.25 | 1.40 |
| 7 | 2.40 | 1.40 |
| 8 | 2.35 | 1.40 |
| 9 | 2.15 | 1.70 |

Keep current forward values for this first visibility retune; recheck horizontal hand contact at both facings once the ball is visible. Then retune forward offsets only if the captures show a specific hand-side mismatch. These are candidate estimates, not accepted calibration values.
