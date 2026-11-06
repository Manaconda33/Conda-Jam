# Attempt 30 independent normal-loader review

## Verdict

Visual/gameplay and provenance checks pass for the captured production-loader run.

## Checks passed

- `report.json` records `productionRegistration: true`, `candidateOverridesOnly: false`, and the loader-selected atlas `./public/assets/animation/kraken-layup-reverse-right.webp`; each capture also reports that decoded production image and source. The production manifest entry is a 4×2 atlas with `baselineY: 92` (80×96 cells). Right-facing uses `flip: false`; left-facing uses the same production atlas with `flip: true`.
- Corrected report provenance now points to `tools/generate-art/previews/kraken-layup-reverse-track-candidate/attempt-25/track.json`. Its `height`, `forward`, and `releaseVz` exactly match both the report’s `productionTrack` and `athleteBallTracks.kraken['layup-reverse']` in `src/core/animation.js`: height `[0.9,1.1,1.4,1.4,2.3,1.15,1.1,0.8]`, forward `[4,5.5,4,0.5,-1.5,-2.5,5,4]`, releaseVz `0.8`. Thus the attempt25-calibrated values are the checked-in values exercised by these screenshots; no candidate track override is reported.
- Reviewed tick 0, tick 11, tick 12, tick 13, and post-score tick 100 at both 100% and 120%, in both facings. The athlete remains fully in frame, with shoes visible and a consistent grounded start (`z: 0`). At the 120% opening capture, the feet sit immediately above the cast shadow as expected from the canvas ground projection; no apparent baseline jump or clipped anatomy.
- The separately rendered ball remains with Kraken through tick 11 (`hasBall: true`, owner `kraken`, mode `carried`). The release happens at tick 12: frame 5 is selected, possession clears, mode becomes `shot`, owner becomes null, and the “Kraken launches a 2-pointer” event appears. The tick 11 ball is held at the raised hands; at tick 12 it is visibly separating from the hand, and tick 13 shows it continuing toward the basket.
- Both facings score two points. At tick 100, the runtime selects `./public/assets/animation/kraken-celebrate-right.png`, the ball is dead and unowned, and the score is `[2,0]` for right-facing / `[0,2]` for left-facing. `uncaughtBrowserErrors` is empty.

The earlier metadata mismatch has been corrected in the report. No provenance blocker remains.

No production files were changed during this review.
