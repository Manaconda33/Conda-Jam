# Kraken dunk-scythe track candidate — attempt 02

This is a separate Kraken-only gameplay calibration against the independently art-reviewed `cleanup03-scaled-repack` atlas. Nothing in this directory is registered in production.

## Trial history

- Track attempt 01 is retained at `../attempt-01/track.json` with its original 60 gameplay captures under `../../kraken-dunk-scythe-attempt02/gameplay-candidate/attempt-01/`. It is rejected: the borrowed Krios values missed Kraken's hand, especially through the overhead scythe arc.
- Attempt 02 pass 01 is retained as `pass-01-track.json`, with 60 screenshots and report under `../../kraken-dunk-scythe-attempt02/gameplay-candidate/attempt-02-pass-01/`. It is rejected: ball sat below the frame 6 hand and too high above the hand in frames 8–9.
- `track.json` is attempt 02 pass 02, captured in both facings at 100% and 120% zoom. It adjusts only Kraken's values for frames 6–9. The ball now contacts the raised palm across those poses. Release remains the normal game action at tick 21; it scores two points at tick 23 and Kraken lands at z=0 by tick 23.

## Calibration notes

The initial captures showed screen-space error by pose. Frames 6–9 were tuned in native game screenshots to put the ball center at the visible hand while maintaining the same relative hand contact in the mirrored facing. No art was edited in this track task. The atlas is 88×96 cells, 15 unique frames, baselineY 94, SHA-256 `baef51515b6f0f5041ced9ea436736928e6d4924eac9ec83ae80dac02e588c54`.

## Status

Candidate-only, pending independent gameplay review. The completed capture is at `../../kraken-dunk-scythe-attempt02/gameplay-candidate/attempt-02-pass-02/`. Do not register until that review and final production review pass.
