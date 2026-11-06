# Kraken J.07 `pickup` cleanup02 — track attempt02

**Status: candidate for independent review only. Not registered.**

Attempt02 keeps the forward path and earlier frame heights, but raises the one-tick grab pose from height 0 to 0.2 so the separate ball overlaps the empty ankle-level cup more clearly. The candidate atlas and Kraken-only track are injected in memory; production manifest/runtime files remain unchanged.

## Track

```json
{
  "height": [0.65, 0.45, 0.2, 0.2, 0.75],
  "forward": [3.5, 4.5, 5.5, 4.5, 4.5]
}
```

Frame durations remain `[2,3,2,1,4]`; frame3/tick7 is the grab, and the atlas is rendered with `baselineY:90`.

## Current Jam Stage trial

`capture.py` sets one loose-ball fixture per run, then advances the production simulation without per-tick player or ball teleports. The valid run has 32 screenshots across both facings and 100%/120% zooms at ticks `[0,2,4,6,7,8,10,11]`.

The normal simulation keeps the ball loose/unowned through tick6. At tick7 it emits `Kraken grabs the ball`, transitions to carried state and assigns Kraken as owner. The ball remains carried through tick11; score is 0–0. Expected art frames and facing mirrors are selected in every capture, with no browser or capture-integrity errors. My visual check finds better vertical overlap of the ball with the ankle-level cupped hand at tick7 than attempt01; recovery places the carried ball around the waist by tick8.

The first invocation accidentally reused attempt01's height vector because the intended edit missed the JSON string. That run is preserved separately under `initial-invalid-reuse/` and explicitly excluded from attempt02 evidence. The corrected vector above is the only valid attempt02.

## Remaining review

Independent visual review of all four hand-contact runs remains before selecting this track. This is candidate-only fixture validation; normal-loader selection and a user-action gameplay transition have not been tested. Keep the candidate unregistered until those checks pass.
