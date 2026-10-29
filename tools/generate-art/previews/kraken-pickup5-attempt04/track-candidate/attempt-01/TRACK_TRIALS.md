# Kraken J.07 `pickup` cleanup02 — track attempt01

**Status: candidate for independent review only. Not registered.**

This trial reuses the previous Kraken pickup track as a starting vector with the reviewed attempt04 cleanup02 atlas. No basketball is baked into the five-frame sheet. The candidate atlas and Kraken-only track were injected in memory; the runtime manifest and checked-in track data remain unchanged.

## Track

```json
{
  "height": [0.65, 0.45, 0.2, 0, 0.75],
  "forward": [3.5, 4.5, 5.5, 4.5, 4.5]
}
```

Frame durations are `[2,3,2,1,4]`. Pose3 is the one-tick ankle-level grab at tick7; cleanup02 uses 80×96 cells with `baselineY:90`.

## Current Jam Stage trial

`capture.py` sets one loose-ball fixture per run, then advances normal Jam Stage simulation ticks without per-tick player or ball teleports. Four runs cover both facings and zooms 100%/120%; 32 screenshots sample ticks `[0,2,4,6,7,8,10,11]`.

All expected candidate frames and mirror directions are selected. The ball remains loose/unowned through tick6. At tick7 the simulation emits `Kraken grabs the ball`, moves the ball to carried state and assigns Kraken as owner. The ball remains carried at ticks8–11 in both facings and zooms. The score stays 0–0; no browser errors or capture-integrity failures occurred. At frame3, the separate ball appears adjacent to/overlapping the empty cupped hand at ankle level. Tick8+ places the ball near Kraken's waist during recovery.

Representative captures and the full state/capture report are under `native/`. Exact source lineage and cleanup review remain under the parent attempt04 directory.

## Remaining review

An independent reviewer must inspect the hand/ball contact and recovery placement in all four runs. This is candidate-only fixture validation; normal-loader selection and a gameplay-derived user-action transition have not been tested. Do not register until those reviews pass.
