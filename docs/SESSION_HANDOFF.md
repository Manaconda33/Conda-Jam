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

The registered production set now has146 actual drawings across17 clips and three athletes: Manaconda52 (five locomotion clips plus shoot10), Accu52 (same), Reed Ashcroft42 (locomotion). All generated through imagegen, checked at full resolution and packed gameplay size. Details: `docs/animation-production/GENERATED_POSES.md`. Manaconda's original five-clip batch is documented separately in `MANACONDA_ART.md`. Strict audit remains incomplete:70 missing clips among represented athletes and102 missing athletes.

Original PNGs remain in /workspace/generated_images; prompts, exact source paths, source hashes, crop rectangles and scale are committed under tools/generate-art. New reusable `package-motion42.py` accepts a source redraw and reading-order layout, verifies actual separated figure counts/alpha/clipping, uniformly packs poses and never approves them. Optional layout supports shoot10. Wider cells preserve actor height for scarves/hair. Six Python source validation tests pass.

Rejected experiments are NOT production: eleven35captain run sheets clipped figures/neighbor fragments and a35captain idle0 probe failed canon/grid review. The first Nova42 retarget produced only35 figures and baked in basketballs; source provenance records rejection. A retry using the accepted Accu42 female reference instead of Manaconda is in progress (root imagegen cell72; collect before resumption if available). No Nova art is registered yet.

Latest gameplay review fixes: shots and both layups now physically rise between takeoff and peak, land at finish, and preserve rendered hand elevation when releasing. Steals queue and resolve only at grab tick5 after rechecking target ownership, range and both stun states. Regression checks include lost possession, movement out of range, target stun, contact and separate ball recovery. Read-only follow-up review found no merge blocker.

## Validation evidence and limitations

- Fresh full build/tests/lint were run during this session; check final committed checkpoint notes for latest counts. Prior full suite had23test files green. Targeted timing suite includes aerial catch continuity, both oop finishes, cancellation, all8 natural AI dunk styles, dribble phase and physics3point tests.
-100complete simulated matches:875,572ticks; average scores8.18/9.51;12overtimes. Roster validation35franchises/105athletes passes.
- Chromium E2E cannot launch in this sandbox: setsockopt EPERM in crashpad. No retry with escalated permissions. Do NOT claim browser/mobile E2E passed here.
- Native Canvas diagnostic executes actual src/main.js with DOM adapters and 58images for Chicago and64 for Neo Runway;15manual pose snapshots each and actual180tick match snapshots were rendered. This is renderer smoke, NOT browser/CSS/E2E verification. `tools/render-preview.mjs`, `artifacts/native-render-preview/{manaconda,accu}/`; committed example screenshot under docs/animation-production/screenshots.
- Run native diagnostic here with `JAMVERSE_CANVAS_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas node tools/render-preview.mjs`. Adapter strips ancillary PNG metadata in memory because nativeCanvas misclassifies C2PAembeddedSVG; production images remain untouched.

## Commands

`npm run dev` serves local browser game at http://localhost:4173 . `npm run build`, `npm test`, `npm run lint`, `npm run validate:content`, `npm run simulate:league`.

`node tools/audit-animation-assets.mjs` must fail until art meets acceptance. Use `--report-only --json artifacts/issue3-animation-audit.json --markdown docs/animation-production/ASSET_STATUS.md` to save progress without claiming a pass.

`node tools/register-animation-atlas.mjs <layouts.json> public/assets/animation/manifest.json` computes real decoded crop hashes and resets reviews to pending; inspect and explicitly review before runtime use. See docs/ANIMATION_ASSET_AUDIT.md for schema. Source packing tool preserves drawings and never approves art.
