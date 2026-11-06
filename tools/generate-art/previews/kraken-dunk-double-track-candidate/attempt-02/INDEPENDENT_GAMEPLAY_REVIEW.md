# Independent gameplay review — Kraken dunk-double track attempt02

**Verdict: gameplay mechanics pass; carry contact at the chest recoil is now readable. The second overhead rise is too low and needs attempt03 tuning.** These are injected candidate captures; no production registration is validated.

## Contact review: both facings at 120%

- **Frame7, first two-hand pump:** Current height `1.55` puts the ball below the raised fingertips by roughly 25–35 screen pixels in both facings. The horizontal position is centered between the hands. Restore this point near the original `1.90`; keep forward `1.0`.
- **Frame8, chest recoil:** Current height `1.0` places the ball over the chest-clasp hands in both directions. This is a clear improvement over attempt01's floating ball. Horizontal position is slightly behind the hands, so increase forward modestly from `0.2` to `0.5`; keep height `1.0`.
- **Frame9, second overhead rise:** Current height `0.65` places the ball near the lower abdomen while both hands are overhead. Raise it substantially to about `1.70`, between attempt02's low point and attempt01's high point. Current forward `0.3` is close enough; retain it for the next trial.

The proposed frame9 height is an estimate from the mirrored 120% screenshots. Re-capture and review both directions before accepting the track.

## Gameplay path

The attempt02 report covers 60 candidate captures across all 15 frames, both facings and both zooms with zero browser errors. Kraken retains the ball through frames7–9. Frame10 releases into dunk mode at tick21, frame11 scores at tick23 (right `[2,0]`, left `[0,2]`), and frame14 is recovered/grounded at tick30. Mirrored gameplay and scoring pass.

## Recommended attempt03 track

All unlisted values remain as in attempt02:

- `height`: `[0.85,0.95,1.25,1.10,1.25,1.20,1.60,1.90,1.00,1.70,2.10,0.90,0.70,0.45,0.60]`
- `forward`: `[3,4,5,3,2,4,3,1,0.50,0.30,3,5,3,2,0]`

Re-run both facings and zooms, then visually inspect frames7–9. This remains candidate-only until that review passes.
