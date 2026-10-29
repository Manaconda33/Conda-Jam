# Kraken dunk-windmill attempt01: independent gameplay review

**Verdict:** Candidate mechanics and scoring work, but hand contact fails at frames 6–8 and is marginal at frame 9. Retune before another candidate trial; do not register this track.

## Review scope

Reviewed all 60 captures (frames 0–14, both facings, 100% and 120%), including frames 6–10 at 120% in both facings, plus report metadata and browser errors.

## Findings

- The full 15-frame sequence is captured at both zooms and facings. No uncaught browser errors are recorded. Both sides of the current Jam Stage court render normally.
- **Frame 6:** The ball sits around the lower torso while the active hand is near the hip/back side. It is slightly high and forward of the hand. Lower it and move it back.
- **Frame 7:** The ball is over the face/head, while the rotating arm extends horizontally behind the body. It misses the hand substantially. Move it far back along the facing axis; preserve roughly shoulder/head-level height.
- **Frame 8:** The ball is behind the shoulder but below and somewhat offset from the bent hand behind the head. Raise it and bring it a little forward from its current extreme backward position.
- **Frame 9:** The ball reaches the overhead arc but remains slightly low and behind the raised hand. Raise it modestly and shift it toward the hand.
- **Frame 10:** This is the release/dunk transition, so hand contact is no longer required. The ball enters dunk mode at tick21.
- **Scoring/recovery:** Kraken scores at tick23/frame11 on the correct side for each facing (right-facing [2,0], left-facing [0,2]); recovery reaches upright frame14/tick30.
- **Candidate integration:** Report marks both atlas and track injected and `runtimeIntegration: false`. This review covers candidate calibration only, not normal-loader integration.

## Suggested attempt02 values

Keep other frames unchanged. Estimated edits based on the 120% captures:

| Frame | Height | Forward | Adjustment |
|---|---:|---:|---|
| 6 | 0.6 | -1 | Lower and move back |
| 7 | 1.4 | -3 | Keep height; move substantially back to the extended hand |
| 8 | 1.6 | -3 | Raise and move slightly forward from current -5 |
| 9 | 2.1 | -1 | Raise and move toward the overhead hand |

These are first retuning estimates; re-capture both facings and zooms before settling values. Release at frame10/tick21, score at tick23, and recovery at tick30 are already correct.
