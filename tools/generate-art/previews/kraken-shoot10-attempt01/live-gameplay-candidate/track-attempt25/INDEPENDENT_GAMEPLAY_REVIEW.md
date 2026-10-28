# Independent gameplay review — Kraken shoot attempt 25

**Verdict: release alignment and scoring pass under the restored renderer; late-flight visibility and Kraken's celebration remain unresolved.** This is a positive shoot-track review, not full visual acceptance of the entire sequence.

## Evidence and runtime state

Reviewed the 76 production Jam Stage Chromium captures at both facings and 100%/120% zoom, including ticks 10, 13, and 14, sampled flight, late flight, and score completion. All 76 recorded capture paths exist and match their SHA-256 hashes. The checked-in renderer is on its baseline shot `flightScale` of 1.62 (`src/main.js`); no temporary renderer patch or source/runtime edits were made for this review. The report records no failed requests, uncaught browser errors, or terminal misses.

## Release, mirroring, and score

- At tick 10/frame 4, the ball is held at the raised hands/head and the contact pose reads clearly in both facings and zooms.
- At tick 13/frame 5 (release), the ball is just above and in front of the extended shooting fingertips. At tick 14/frame 6 it has separated cleanly into flight above the follow-through hand. The hand-to-ball gap is small and consistent at 100% and 120%, correcting the detached release appearance from attempt 22.
- Right-facing uses the candidate atlas unflipped; left-facing mirrors it. The ball and shot travel toward the corresponding hoop in each direction. No left/right track inversion or handedness defect was observed.
- The ball is visible during the early flight samples and the score resolves correctly in all four runs. The ball becomes dead and the correct team receives exactly 3 points: `[3, 0]` facing right and `[0, 3]` facing left.
- At 100%, the rim stays in view through the reviewed flight and score captures. At 120%, the rim is partly clipped at the relevant outer edge (right hoop at the right edge, left hoop at the left edge), which limits visual inspection of the ball crossing the rim at that zoom. The score state itself remains legible.

## Remaining visibility and celebration issues

The ball leaves the top of the rendered viewport during late flight. In `flight-sample037-tick23-idle-frame02.png` for each facing/zoom, the ball is absent while its ground shadow remains visible; the matching simulation sample has the ball still in `shot` mode at z=28.46. Earlier flight samples show the ball, and the simulation later scores, but the captured images do not visually trace the late arc continuously.

As expected while Kraken's `celebrate` asset is missing, score-complete capture rendering falls back to Krios artwork: a large red, horned, bearded figure appears in place of Kraken in all four runs. The score and dead-ball state are correct, but these captures are not valid Kraken celebration evidence.

No production assets, source code, or runtime registration were changed.
