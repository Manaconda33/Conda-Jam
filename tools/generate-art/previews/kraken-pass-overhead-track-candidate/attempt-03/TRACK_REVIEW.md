# Kraken `pass-overhead` track attempt03 — calibration notes (2026-10-28)

**Status: candidate calibration only. Do not register or accept for production.**

This attempt uses the reviewed v2 Kraken atlas and was captured through the current Jam Stage renderer. It changes only the athlete-specific trial track; no runtime or manifest files were modified.

```json
{
  "height": [1.05, 1.85, 1.75, 1.9, 2.1, 1.2],
  "forward": [2.5, 3, 2, 6, 10, 14]
}
```

The 24 static captures cover all six frame starts at ticks 0, 2, 5, 7, 8, and 10, both facings and 100%/120% zoom. The production selector chose the v2 atlas and expected frame in every row; facing left mirrored correctly. Initial visual inspection shows better body-side alignment at tick0 and near-hand positioning at tick5 than attempt02, while tick7 release stays adjacent to the extended hands.

The four real `stepMatch` smoke runs released at tick7 and Marin Dusk caught at step28 in both facings and both zooms. The harness manually moves the ball to the candidate release point after the production release event, then lets normal flight and catch simulation continue. It therefore does not yet prove the candidate track drives the full pre-release carried sequence or the actual release transition continuously. The tick0 held-ball position still needs an independent contact review.

No browser or failed-request errors occurred. Final score remained 0–0, and Marin alone owned the ball after the catch. Keep attempt03 pending independent review and integrated candidate-driven simulation.
