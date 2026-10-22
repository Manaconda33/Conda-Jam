# Issue 3 animation production

Authoritative requirement: https://github.com/Manaconda33/Conda-Jam/issues/3

The requested outcome is arcade animation with genuinely distinct drawings and synchronized gameplay, across all 105 athletes. The prior two-frame action art is insufficient. Do not represent image transforms, duplicated holds, or a repaired selector as finished production art.

## Implementation

1. Establish shared clip metadata: per-frame tick durations, unique-frame indices, loop sequences, release/apex/grab/takeoff/peak/finish anchors; preserve simulation determinism.
2. Fix rendering to read live player state. Load per-character production atlases from a manifest, use clip-relative time, respect authored facing, preserve the existing roster art during staged production.
3. Queue shoot/pass releases and physical interactions at their authored anchors. Add eight dunk variants, two alley-oop finishes, two layups; animate celebration before inbound and fall/get-up.
4. Author the required distinct art through image generation. Work order: idle/locomotion/dribble; pass/receive/shoot; defense/pickup; layups; dunks/oops; celebration/fall. Every athlete receives the same clip counts. Inspect character identity and left/right asymmetry explicitly.
5. Audit decoded frame crops for nonblank art, distinct pixel hashes, dimensions, provenance, actual frame counts, and mirror review. Missing or unreviewed clips fail the production acceptance audit.
6. Integrate new assets in browser and offline build. Verify gameplay anchor tests, suite, full matches, and desktop/mobile browser flows where the environment permits. Review the whole change, checkpoint and deploy tested changes under the user's existing publication authorization.

## Interfaces

`src/core/animation.js`: `animationClips` with `frames:[{duration}]`, `loop`, `anchors`; `sampleAnimation(clipKey,tick)` returns `{frame,done}`. Live player `animation:{clip,tick}` is the renderer/simulation clock.

`public/assets/animation/manifest.json`: version 1, per-character directions/right and optional left; per-clip atlas src, actual frame rectangles/hash, provenance, reviewed flag. Safe mirroring requires individual documented review; asymmetric designs require authored left art.

## Decisions

- The user has repeatedly instructed uninterrupted implementation and authorized pushing, merging, and deployment. Proceed without new design/merge approval pauses.
- The user directs direct checkpointing to `main`; the current worktree is `/workspace/Conda-Jam` on `main`. Push and Pages deployment are authorized without additional approval pauses.
- Gameplay timing and audit tooling are independent parallel tasks; root owns rendering, build integration, image generation, and final integration.
- Production audit remains strict and may fail until all art is authored. Passing regression tests never implies issue 3 art acceptance.

## Progress

- Simulation animation clocks and action anchors implemented, integration defects repaired and reviewed.
- Strict decoded-pixel audit, canonical mirror review and source packing safeguards implemented.
- Current accepted inventory:2,761 real generated drawings /320 reviewed clips /53 athletes. Strict audit:1,275 missing clips,52 athletes unrepresented, and three clips below target (Dorian dribble and dribble-run; Luca run); full production acceptance remains incomplete.
- Latest deployed checkpoint: `e49c852`, with Pages workflow run43 successful: https://github.com/Manaconda33/Conda-Jam/actions/runs/39797343600. Preview: https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=e49c852. The current tested local batch adds reviewed42-pose locomotion sets for Pixel O’Keeffe and Fern Tempo; each has idle6, idle-ball4, dribble10, run11 and dribble-run11 clips with reviewed mirroring and athlete-specific ball tracking. Their generated source parts and 42-pose assembly provenance are committed alongside the packed atlases. The next uncovered pair in league order is Mira Wavelength and Azul Voss (J.10).
- `npm run build`, `npm test` (24 files), lint, 35-franchise/105-athlete validation, and12 Python packing checks pass. Chromium offline E2E passes with the required socket permission; the first restricted attempt failed at Crashpad `setsockopt`. Pixel and Fern native previews each load104 images, capture87 snapshots, and select all five production locomotion clips in both facings. Their focused ball-track test covers both facings.
