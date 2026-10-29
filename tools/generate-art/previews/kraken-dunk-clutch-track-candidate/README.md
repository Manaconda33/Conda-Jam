# Kraken dunk-clutch ball-track candidates

These are isolated gameplay-trial tracks for the independently reviewed cleanup02 atlas. No candidate atlas or track is registered in the runtime manifest. Production Kraken art and ball data remain untouched.

## Attempt 01

- Track: `attempt-01/track.json` (SHA-256 `45566fc20bf5b4d10427cffe152081587766df04eb93adcf1558afb0e27bfa3d`)
- Seeded from the current per-pose hand-center metadata in `src/core/animation.js`.
- Four current Jam Stage runs cover Vesper Harbor Undertow vs Blackthorn Court Kings, both Kraken facings, zoom 100 and 120; 56 screenshots; no uncaught browser errors.
- Gameplay timing works: the ball is carried through pose 9, changes to dunk mode on animation tick 21, and scores on tick 23. Landing and recovery finish at pose 14.
- Visual inspection rejected this track for candidate use: the ball drifts far above/right of the visible clasped hand in poses 8–9.

## Attempt 02

- Track: `attempt-02/track.json` (SHA-256 `a9120edcd3280275804d9deb97f9f180bcb73565d59a799b58ad4387eb4f1bde`)
- Preserves attempt01's pre-contact, release, and recovery values; adjusts only the pose 7–9 carry points toward the visible clasped hand after screenshot review.
- Atlas SHA-256: `704bf818519322f52dbc85ad0d9c23484a5321a0873445c8d9389d68dc322763`.
- Four current Jam Stage runs cover both facings and zooms 100/120; 56 screenshots with no uncaught browser errors. Each run selects the candidate atlas and verifies proper left-facing mirroring.
- For right-facing/home Kraken, tick 21 enters `dunk` with score `[0,0]`, and tick 23 records `Kraken scores 2!` with `[2,0]`. For left-facing/away Kraken, it enters `dunk` at tick 21 and scores `[0,2]` at tick 23. Both runs show grounded landing/recovery by the final sampled tick.
- Screenshots show the ball brought back over the chest clasp in poses 7–9. Independent review passed for candidate gameplay only; the review is in `attempt-02/captures/attempt-02/INDEPENDENT_GAMEPLAY_REVIEW.md`. Attempt02 remains a candidate and is not production registered.

The report now records side-specific expected scores at top level and for each run. Each attempt preserves the full `report.json` and captures under its own directory. Reproduce with `TRACK_ATTEMPT=01` or `TRACK_ATTEMPT=02 PORT=4271 python tools/capture-kraken-dunk-clutch-candidate.py` from the repository root (the preview server requires local network permission in this environment).
