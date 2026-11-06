# Independent review: Kraken J.07 `shoot` track attempt03

**Date:** 2026-10-28  
**Verdict:** **REJECT THE REVIEW PACKAGE FOR FLIGHT EVIDENCE INTEGRITY.** The candidate track's visible shot sequence is promising and was not rejected for hand contact; fix capture path collisions and recapture before treating the package as a clean independent pass.

## Review scope

Reviewed the lane `../REVIEW.md`, `report.json`, all four 10-frame action sequences at right/left facing and 100%/120% zoom, the recorded flight/score states, flight screenshots, and score-complete captures. No runtime or production documentation was changed.

## Visual and gameplay observations

- In the canonical action screenshots, the ball remains visibly carried through gather and raise (frames0–4/ticks0–10), reaches the shooting hand at the release pose (frame5/tick13), and separates into a readable upward flight path in follow-through frames6–8. Frame selection remains 0–9 in order; right-facing is unflipped and left-facing is mirrored. The carried-to-release transition and hand contact appear coherent in both facings at both zooms.
- HUD, court, player, and ball are visible in the action captures. The ball does not appear hidden by the HUD during gather, release, or the first post-release frames. The separate ball remains outside the atlas.
- `report.json` records release at tick13 with `mode=shot`, `ownerId=null`, `lastTouch=kraken`, and `attemptId=shot-1`; the simulation advances without post-release ball state writes. Each run records a completed three-point score, score `[3,0]`, and the same shot attempt ID. The score-complete screenshots show the scoreboard at 3–0.
- The simulation state samples show a rising shot after release (e.g. right/100% tick14 z=5.06, tick16 z=7.26, tick19 z=10.38, tick23 z=14.16). These are coherent states, but their corresponding flight-image records do not match the files now on disk, as detailed below.

## Blocking evidence defect

Each of the four run sections has 18 capture records, but four `flight-tick` paths per run are each recorded twice under the same filename. For example, `right-zoom100-flight-tick14.png` is associated first with the release flight state at simulation tick14, clip `shoot`, ball z=5.06, then with a later state at tick68, clip `idle`, ball z=26.06. The later capture overwrites the earlier PNG. The same collision occurs for flight ticks16, 19, and23 in every facing/zoom run (16 duplicate path collisions total across 4 runs).

Consequently, the `report.json` entries for the early flight captures point to screenshots from the later trajectory samples, and the current flight PNGs cannot independently verify the reported early ball positions. This prevents a clean visual flight review even though the separate action-frame screenshots show early flight and the simulation records a score.

## Required follow-up

Re-run or repair only the capture evidence with unique filenames for each flight pass (for example, add a `pass-early` / `pass-long` suffix). Ensure every report record resolves to a unique file showing the recorded state, then inspect the ball on screen through the flight and score transition in both facings and zooms. This review does not reject the attempt03 calibration values themselves, but the current evidence package is not a pass because the flight screenshots and state records are ambiguous.
