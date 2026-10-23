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
- Current accepted inventory:4,693 original generated drawings /550 reviewed clips /99 represented athletes. Strict audit:2,379 missing-clip findings,6 athletes without registered clips, and three clips below target (Dorian dribble and dribble-run; Luca run); full production acceptance remains incomplete. J.29–J.32 each add two athletes with five reviewed locomotion clips; the other24 clips per athlete remain open. J.31 Draya Staffwind/Kael Rune and J.32 Lilt Smile/Violet Wink are integrated and locally validated. The next pair in roster order is J.33.
- Latest deployed checkpoint remains `bbb1cbd`, Pages workflow run70 succeeded: https://github.com/Manaconda33/Conda-Jam/actions/runs/39871158208. Preview: https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=bbb1cbd. This deployed checkpoint has the gameplay polish and J.30 art. Local J.31/J.32 each add five reviewed locomotion atlases per athlete, mirror policy and custom ball tracks; native Canvas previews select every new clip in both facings. Current build, all28 test files, lint, content validation,100-match simulation and12 atlas packaging checks pass. The full roster/browser task remains open; local checkpoints await push and Pages verification.
- `npm run build`, `npm test` (24 files), lint, 35-franchise/105-athlete validation, and12 Python packing checks pass. Chromium offline E2E passes with the required socket permission; the first restricted attempt failed at Crashpad `setsockopt`. Sol and Mist native previews each load109 images, capture87 snapshots, and select all five production locomotion clips in both facings. Their focused ball-track test covers both facings.
