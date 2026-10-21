# Session handoff

## Active assignment

Implement https://github.com/Manaconda33/Conda-Jam/issues/3. It is NOT complete. The full attached master specification is preserved in `docs/JAMVERSE_96_CODEX_MASTER_PROMPT.md`. Issue 3 requires 29 animation clips per athlete, 29,190 minimum independently drawn frames / 30,765 target frames across all105 athletes, plus direction-specific art where needed. Do not count runtime states, transforms, duplicated frames or failed artwork as authored completion.

The user authorizes continuous development, image generation, tests, pushing/merging and GitHub Pages deployment. Do not stop for another approval of those actions. Previous interruptions included exhausted model usage; do not redo completed work.

## Branch and deployment

Repository `/workspace/Conda-Jam`; work branch `issue-3-animation-production`, based on main commit `f9b0fcd`. The existing live Pages URL is https://manaconda33.github.io/Conda-Jam/ and standalone URL is https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html . These do not include the active branch until a later merge/deployment is verified. Do not describe a local checkpoint as a deployed build.

## Implemented gameplay and rendering

- `src/core/animation.js`: 29 clips, distinct-frame targets, nonuniform action durations, idle ping-pong, eleven-frame22tick run, release/apex/grab/takeoff/peak/finish anchors, carried-ball height metadata.
- `simulation.js`: live player.animation, delayed shot/pass releases, block apex windows, rebound/pickup grab timing, push contact timing, ten-frame fall state, 70tick celebration before inbound. Eight dunk clips cycle naturally in CPU games; two layups and three directional passes are reachable. Turbo+pass produces two alley-oop finishes with an actually travelling aerial pass caught at the airborne grab anchor; disruption cancels the finish. Pausing freezes animation.
- Fixed original rendering defect: canonical roster object was passed to the sprite selector, hiding live action state. New selector uses live player.animation.tick, not wall-clock time. Production atlas loading is limited to the selected franchises, including bench players.
- Production manifest `public/assets/animation/manifest.json`; synchronized JS runtime module; renderer only consumes reviewed clips and explicit reviewed mirror permissions. E. Indigo and GB Design require authored direction treatment; policy for all105 identities is in `animation-mirror-policy.js` and detailed canonical review docs.
- Corrected remaining issue2 court defects found during integration: arcs now face into court and join corner lines, free throw circles align with key ends, rims rise above floor, visual ball and hoop use matching height mapping. Scoring uses50.5radius/6.4cornerY. Fixed physics prematurely killing above-arc shots more than50units from target at release.
- Build handles nested imports and embeds new production assets once in offline HTML. Standalone tests compile AND execute the bundled dependency graph.

## Actual production art

Only Manaconda is registered with new issue3 art: idle6, idle-ball4, dribble10, run11, dribble-run11 =42 distinct generated drawings. Five64x96cell WebP atlases total131,424bytes. Root inspected all42 over a solid background and reviewed identity/mirroring. Timing/hand alignment still needs browser playtest. Details: `MANACONDA_ART.md`, source prompts, layouts, inspection JSON.

The strict audit currently reports5decoded clips,24missing clips for Manaconda,104missing characters. It intentionally fails production acceptance. Default regression tests passing do not close issue3.

Eleven experimental35captain run sheets yielded34packed11frame clips besides Manaconda. Although pixel hashes were distinct, visual review found clipping and neighboring sprite fragments; all34 were moved out of production to ignored `artifacts/rejected-captain-run/`. Source jobs/provenance and layouts are retained under tools/generate-art. A later35captain idle0 probe also failed pose/canon/grid review. `captain-jobs.json` explicitly marks it rejected; packer now refuses such records. Do not register or ship these experiments.

Next art probe: use the existing42pose Manaconda motion reference `tools/generate-art/references/manaconda-locomotion42.png` and its layout JSON. Ask imagegen to redraw each exact pose/cell as Reed Ashcroft (first/top-left supporting athlete in supporting-player-gameplay-sprites.png), preserving42cells while replacing Manaconda identity. This tests motion-reference retargeting instead of unreliable large35character generated grids. No Reed result exists yet. All actual drawings must come from imagegen; cropping, packing and uniform gameplay downsampling may not manufacture missing poses. Inspect all output counts, alpha, pose continuity and identity before registration. If successful, expand to other athletes with explicit nonhuman anatomical adaptations.

## Validation evidence and limitations

- Fresh full build/tests/lint were run during this session; check final committed checkpoint notes for latest counts. Prior full suite had23test files green. Targeted timing suite includes aerial catch continuity, both oop finishes, cancellation, all8 natural AI dunk styles, dribble phase and physics3point tests.
-100complete simulated matches:846,815ticks; average scores8.31/9.07;5overtimes. Roster validation35franchises/105athletes passes.
- Chromium E2E cannot launch in this sandbox: setsockopt EPERM in crashpad. No retry with escalated permissions. Do NOT claim browser/mobile E2E passed here.
- Native Canvas diagnostic executes actual src/main.js with DOM adapters and all52currentimages;15manual pose snapshots and an actual180tick match snapshot were rendered. This is renderer smoke, NOT browser/CSS/E2E verification. `tools/render-preview.mjs`, `artifacts/native-render-preview/`; committed example screenshot under docs/animation-production/screenshots.
- Run native diagnostic here with `JAMVERSE_CANVAS_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas node tools/render-preview.mjs`. Adapter strips ancillary PNG metadata in memory because nativeCanvas misclassifies C2PAembeddedSVG; production images remain untouched.

## Commands

`npm run dev` serves local browser game at http://localhost:4173 . `npm run build`, `npm test`, `npm run lint`, `npm run validate:content`, `npm run simulate:league`.

`node tools/audit-animation-assets.mjs` must fail until art meets acceptance. Use `--report-only --json artifacts/issue3-animation-audit.json --markdown docs/animation-production/ASSET_STATUS.md` to save progress without claiming a pass.

`node tools/register-animation-atlas.mjs <layouts.json> public/assets/animation/manifest.json` computes real decoded crop hashes and resets reviews to pending; inspect and explicitly review before runtime use. See docs/ANIMATION_ASSET_AUDIT.md for schema. Source packing tool preserves drawings and never approves art.
