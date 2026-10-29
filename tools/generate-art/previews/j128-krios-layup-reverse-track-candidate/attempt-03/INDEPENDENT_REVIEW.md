# Krios J.128 `layup-reverse` track candidate attempt03 review

**Disposition: clear attempt03 for production registration and subsequent registered-runtime validation. This candidate-injection capture is not registered-runtime acceptance and does not complete the clip.** The capture has the revised separate track `[0.9,1.25,1.7,2.15,2.3,2.35,1.4,0.8]` height, `[4,5.5,4,3,-4,-1,5,4]` forward, and `releaseVz:0.45`.

## Evidence reviewed

- Current Jam Stage report: `native/report.json`
- Candidate atlas: `tools/generate-art/previews/krios-layup-reverse8-attempt01/krios-layup-reverse8-attempt01-runtime-candidate.png`
- 64 captures cover frame/timing checkpoints and shot completion for both facings at 100%/120%. The fixture starts a fresh page/match per facing, uses Scoria as the offense/home team for right-facing and as away offense for left-facing, and warms the camera at the attacking end.

## Results

- Frame selection matches the eight-frame reverse-layup action at starts `[0,2,5,7,10,12,13,17]`. The production mirror selector is used for left-facing (`flip:true`). There are no missing candidate frames or pauses.
- Krios retains the separately rendered carried ball through tick11. At frame4/ticks10–11 the ball sits at the far-side head/hand position in both facings; the composition reads as a held reverse-layup ball rather than an ordinary forward reach. At tick12, frame5 is selected, fingers are open, and the ball becomes ownerless shot physics on the single `Krios launches a 2-pointer` event. The ball stays visually near the release hand at 100% and 120% in both facings.
- Current Jam Stage court and basket are in frame, with no HUD overlap on athlete/ball. Right-facing Scoria scores two at tick49 (`score [2,0]`); left-facing Scoria scores two at tick49 (`score [0,2]`). The ball is dead after the make. All four runs complete with no browser errors and clean per-match event logs.

## Required follow-up

Register the reviewed source/atlas, mirror policy, and Krios-specific track, then rerun actual registered-runtime captures using the production manifest and production `athleteBallTracks` without candidate injection. Verify both facings, zooms, carry through tick11, release at tick12, scoring, and selectors. Do not mark the clip complete until that registered-runtime review and normal validation pass.
