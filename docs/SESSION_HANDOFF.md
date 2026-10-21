# Session handoff

## Active assignment and authorization

Continue https://github.com/Manaconda33/Conda-Jam/issues/3 and the full master specification in `docs/JAMVERSE_96_CODEX_MASTER_PROMPT.md`. Neither the full game specification nor the league animation assignment is complete. User authorizes continuous development, image generation, tests, push/merge and GitHub Pages deployment without further approval pauses. Do not ask for another approval of these actions.

Issue3 requires29 clips/athlete,293 target authored drawings each (30,765 total across105 athletes), with29,190 minimum; mirroring only after canon review. Runtime transforms, holds, duplicate crops and failed sources never count as authored completion. Issues1/2 also remain open; issue2 floor/arena presentation and real portrait browser acceptance remain unfinished. User prioritizes filling actual animation assets.

## Repo / deployment

Repo `/workspace/Conda-Jam`, branch `main`. Latest pushed checkpoint before the active changes: `e9f4ee0` (611 drawings/66 clips). This handoff's current checkpoint is validated locally but not yet committed or pushed. Verify the Pages run for the next commit before claiming deployment.

- Browser site: https://manaconda33.github.io/Conda-Jam/
- Fully embedded game: https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html
- Use `?v=<deployed-sha>` for a fresh single-file preview.

Direct github.io probes are blocked by this environment's CONNECT proxy403. GitHub Actions/run HTML and git push work with additional network permission. Shell GitHub API/GraphQL is blocked; connector fetch_issue/search_issues works. Open issues were rechecked this turn:1,2,3; no newer issue. No issue should be closed from partial asset completion.

## Current accepted production set

**788 actual drawings /88 reviewed clips /11 athletes.**

- Manaconda:29 clips /293 drawings, the first captain with every requested authored clip at target counts. All8 fifteen-pose dunk styles, both15-pose alley-oops, two8-pose layups, all3six-pose passes, block/steal/push/rebound, ten-pose fall/get-up and celebration are included.
- Reed Ashcroft, Juniper Vale, Accu, Nova Stitch, Echo Catwalk: each6 clips /52 drawings (five locomotion clips42 plus shoot10).
- Paprika:9 clips /67 drawings (quadruped locomotion42, nose-flick shoot10, nose-pass6, receive4, pickup5). She remains a real tiny four-footed kit fox with animal paws, large ears, russet/cream fur and pale-tipped bushy tail.
- Lavi, Leo, Kraken and Krios each have5 locomotion clips /42 authored poses. Lavi retains short ginger curls, freckles and glasses; Leo's pale face, long black waves and mustache; Kraken's natural skin, short dark hair and pointed ears without tentacles; Krios's red skin, black ram horns and dark beard.

Strict decoded audit remains incomplete:88 inspected clips,231 missing clips among represented athletes,94 missing athletes. `docs/animation-production/GENERATED_POSES.md` has exact byte inventory; `ASSET_STATUS.md` is the strict audit output. Do not describe one captain's authored completion as full browser/league acceptance.

All production art is imagegen. Original PNGs remain in `/workspace/generated_images`; prompts, paths/dates, source hashes/crop rectangles/scale and packing flags are committed under tools/generate-art. The renderer consumes only reviewed clips and separately reviewed direction policy. E. Indigo/GB Design require explicit direction-specific treatment. Preserve existing supporting identities; use full spec for canon, not another character's anatomy.

## Pending generation at this checkpoint

1. Root exec cell79 is generating `riaLocomotion42MarginRepair` and `gummiefishLocomotion42BallRemoval`. Collect with `functions.wait`. The previous Ria source `/workspace/generated_images/exec-e2990319-005f-495a-ace0-ec658ffef24a.png` clips the canvas edge; the previous Gummiefish source `/workspace/generated_images/exec-9a93babf-3e26-4fce-87d8-f9f1200996b7.png` contains baked basketballs and clips the edge.
2. Fresh Colossus `/workspace/generated_images/exec-077c4860-816d-4bb0-bfb1-a9317c94ce25.png` and McFleurdel `/workspace/generated_images/exec-d4cca82e-afad-4909-9b3c-959d559ca8d1.png` pass 42-body/transparency/bounds source checks but remain unregistered pending packing and visual review of every packed clip.
3. Piper is not accepted yet: latest attempt `/workspace/generated_images/exec-bc728ba8-5362-4d85-a9f6-a44f78647e32.png` has40 separated components. Briar's latest `/workspace/generated_images/exec-e1f00c9a-bbcd-4653-8e49-4ca3218b897a.png` touches the canvas border. Earlier sheets are also rejected; do not pack/count them.
4. Leo/Krios/Kraken accepted sheets use component isolation only after verifying42 distinct bodies. Lavi uses the straight packing path. The source PNGs remain in `/workspace/generated_images`; accepted prompts and crop provenance are committed under `tools/generate-art`.

After collection, inspect every image, run `inspect_source` with and without isolation, reject non-RGBA/merged/missing/cropped figures or baked balls, then pack/register and inspect all packed action atlases. Continue through all35 canonical captains and then supporting players; gameplay atlas coverage is still only11 of105 athletes.

## Animation / simulation integration

- `src/core/animation.js`:29 shared clips, nonuniform tick durations, eleven-pose22tick run, idle ping-pong, release/grab/contact/apex/takeoff/peak/finish anchors. Actual player.animation drives selection, not immutable roster or wall time.
- All8 dunk variants rotate naturally in CPU play. Travelling aerial lob queues receiver jump and is caught at grab with no teleport; disrupted catches cancel. Celebration70ticks precedes inbound. Shot/layup jump starts takeoff, peaks and lands at marked anchors; steals resolve at grab after range/ownership/stun rechecks.
- Distinct sampled height/forward hand curves for all8 Manaconda dunks, both aerials, overhead/behind passes and two layups. Power measured against112x96 cells; reverse/tomahawk peak heights were lowered after native review.
- `sampleBallHeight/Forward(clip,tick,athleteId)` supports per-athlete overrides. All simulation call sites pass actual player/receiver ID. Paprika has lower paw/nose tracks for idle/dribble/run/shoot/pass/receive/pickup. Future custom anatomy needs its own tracks; do not apply human overhead release to foxes/snakes.
- Passes and shots start from sampled hand x/height. `flightHeightFromHand` preserves rendered elevation as attached jump becomes compressed free flight, above/below rim. Pass zero-distance division is guarded. Tests cover release continuity/mirroring, aerial catches and pause.
- `athleteVisualScale` makes Paprika .52 human scale and applies camera zoom to sprite size. Control markers follow body height. `ballDrawDepth` keeps carried ball in front of its owner while foreground defenders still occlude it; previous depth hid the ball inside opaque sprites.
- Court geometry/scoring fixes remain: inward3point arcs, aligned lane/circles, raised rim matching ball plane,50.5 radius/6.4 corner threshold, removed premature distant-shot kill.
- `heldBallPoint(player)` initializes the starting carrier, inbound/catch possession, and each carried-ball update from the active athlete track; Paprika no longer snaps from a human hand to her paw after the first tick.

## Pipeline / safeguards

`python tools/generate-art/package-motion42.py ATHLETE SOURCE PROVENANCE [LAYOUT] [--isolate-components]`

Validates safe identity, actual RGBA transparency, exact separated primary bodies, outer-border clipping, rectangular reading-order rows and explicit rejected-source flags. Row clustering uses largest gaps between lower edges so jump/crouch rows need not have equal heights. New regression catches ragged8/7/7/7/7/6 sheets whose total42 would otherwise shuffle clip boundaries. All29 prior accepted multi-pose source grids were rechecked without crop-order changes. Eleven Python checks pass.

Packing only crops/uniformly downsamples/pads existing pixels (height96, baseline94, width in16px increments up to192). Optional component isolation preserves existing antialiased figure pixels without neighbors; connected bodies still reject. No synthetic poses. It refuses overwriting accepted atlas paths.

`node tools/register-animation-atlas.mjs LAYOUT public/assets/animation/manifest.json` computes real decoded hashes and leaves review pending; inspect full source and packed atlas, then set reviewed flags and restore reviewed mirror policy from animation-mirror-policy.js. Synchronize src/content/animation-assets.js from manifest. `node tools/audit-animation-assets.mjs` must fail until complete; use --report-only to save progress without claiming acceptance.

Rejected sources include multiple360 attempts without a left profile, touching-body sheets, baked balls/numerals, wrong crest and incorrect interaction order. Final360 source is exec-a34daa74-ab44-46e9-9943-860e79216841.png with correct back/left/front/right stages. Block/steal final explicit12 source is exec-6354b5f3-ccd7-4d03-b87b-ae49d8cc4ca0.png; push/rebound final spacing repair is exec-bfab2690-08d9-406b-998b-00ba3956207d.png. Do not resurrect rejected28-pose defense sources: their contact ordering is wrong.

## Build / delivery / validation

Build supports nested imports, bundles and executes dependency graph in tests, embeds production atlases once and all47 legacy images in standalone HTML. Eleven -lossless.webp legacy derivatives preserve every decoded RGBA byte/dimension (including hiddenRGB/alpha); originals unchanged. Saves21.17% encoded bytes /10,069,276 standalone bytes; no reduction in decoded image memory. Provenance in docs/LOSSLESS_ATLAS_PROVENANCE.*.

Latest788/88 local checkpoint validation:

- Fresh build and all24 regression test files pass (59,205ms).
-84 direct animation tests pass, including Paprika start-of-match, inbound, receive and pickup hand placement.
- Syntax lint14 modules;35franchises/105athletes validation pass.
-100 complete simulated matches,853,717ticks; average scores7.57/9.25;7overtime periods.
-11 Python packing checks pass.
- Native renderer generated87 snapshots each for Lavi, Leo, Kraken and Krios, loaded93 images; each has production sprites on all five locomotion clips and explicit fallback for unfinished actions.
- Strict asset audit intentionally incomplete:88 reviewed clips,231 missing clips and94 missing characters.

Chromium E2E cannot launch in sandbox (crashpad setsockopt EPERM); no escalated retry. Do not claim browser/mobile playtest passed. Native diagnostic runs actual src/main.js via a minimal DOM/native Canvas adapter, not browser/CSS/E2E. Captures all29 clip keys across3 court positions with explicit production/fallback flags; Manaconda93images/87snapshots, Paprika95images/87snapshots. A real180tick simulation snapshot is also captured. Zoom120 diagnostic works. Actual hand alignment/loop continuity still need browser playtest.

Native command: `JAMVERSE_CANVAS_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas JAMVERSE_PREVIEW_ATHLETE=leo node tools/render-preview.mjs`; optional `JAMVERSE_PREVIEW_ZOOM` (85..120). Outputs artifacts/native-render-preview/<athlete>[-zoomN].

Commands: npm run dev (http://localhost:4173), npm run build, npm test, npm run lint, npm run validate:content, npm run simulate:league; Python checks as above. Before push verify clean diff/build and update actual inventory/handoff; user already authorized publication. Continue full art production after checkpoint.
