# Kraken J.07 `pickup` cleanup02 — track attempt03

**Status: candidate trial only; not registered.**

Attempt03 tests whether lowering the recovery height reduces the one-tick rise after the empty ankle-cup grab pose. It uses the cleanup02 candidate atlas in memory and a Kraken-only candidate ball track; no runtime or manifest files were changed.

## Exact track

```json
{
  "height": [0.65, 0.45, 0.2, 0.2, 0.5],
  "forward": [3.5, 4.5, 5.5, 4.5, 4.5]
}
```

Frame durations are `[2,3,2,1,4]`, with `baselineY:90`. Frame3 is selected at tick7 for the grab; frame4 begins at tick8.

## Current Jam Stage trial

`capture.py` sets a controlled loose-ball fixture once per run, then advances the ordinary production simulation. The report contains 32 screenshots: ticks `[0,2,4,6,7,8,10,11]`, both facings, and zooms 100% and 120%. Candidate art and track are injected in page memory only. The source artwork remains the cleanup02 candidate atlas, SHA-256 `055364f4286b2552e8fdf076ab422fcf9b78d97bcf1d12c7a99f0563bd73a1da`.

Across both facings, the ball remains loose and unowned through tick6. At tick7/frame3 it reaches height `0.2`, the production event is `Kraken grabs the ball`, and ownership transfers to Kraken. At tick8/frame4 it remains carried by Kraken at height `0.5`; the same held placement persists at ticks10 and11. Expected frames and mirrored facings are selected in all captures. The visual comparison at zoom100 and zoom120 shows the carried ball staying close to the body on recovery.

Compared with attempt02's recovery height `0.75`, attempt03 reduces the tick7→8 rise from `0.55` to `0.30` track units. This is a substantial reduction, and the hold remains intact, but the recovery still raises the ball in a single simulation tick from ankle level toward the hip/waist. The change is still perceptible as a quick upward step; this trial does not establish a smooth multi-frame handoff. Do not expand the attempt series under this calibration request. Preserve the candidate as evidence and report the remaining snap for a production decision.

The captures show the ball separate from the athlete artwork. This validates only the candidate-injected fixture trial, not normal-loader selection or a user-action pickup path. Keep the candidate unregistered pending any further gameplay review.

## Evidence

- Captures and machine report: `native/`
- Capture script: `capture.py`
- Attempt02 baseline: `../attempt-02/TRACK_TRIALS.md` and `../attempt-02/INDEPENDENT_GAMEPLAY_REVIEW.md`
