# Session handoff

## Active assignment and authorization

Continue https://github.com/Manaconda33/Conda-Jam/issues/3 and the full master specification in `docs/JAMVERSE_96_CODEX_MASTER_PROMPT.md`. Neither the full game specification nor the league animation assignment is complete. User authorizes continuous development, image generation, tests, push/merge and GitHub Pages deployment without further approval pauses. Do not ask for another approval of these actions.

Issue3 requires29 clips/athlete,293 target authored drawings each (30,765 total across105 athletes), with29,190 minimum; mirroring only after canon review. Runtime transforms, holds, duplicate crops and failed sources never count as authored completion. Issues1/2 also remain open; issue2 floor/arena presentation and real portrait browser acceptance remain unfinished. User prioritizes filling actual animation assets.

## Repo / deployment

Repo `/workspace/Conda-Jam`, branch `main`. Latest pushed checkpoint: `f752e30` (`Add reviewed locomotion atlases for six athletes`). The current unpushed checkpoint adds Keeg and Toph's reviewed five-clip /42-drawing locomotion sets. Pages run `39666421735` for `f752e30` was in progress at last check; verify the workflow after the next commit before claiming deployment.

- Browser site: https://manaconda33.github.io/Conda-Jam/
- Fully embedded game: https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html
- Use `?v=<deployed-sha>` for a fresh single-file preview.

Direct github.io probes are blocked by this environment's CONNECT proxy403. GitHub Actions/run HTML and git push work with additional network permission. Shell GitHub API/GraphQL is blocked; connector fetch_issue/search_issues works. Open issues were rechecked this turn:1,2,3; no newer issue. No issue should be closed from partial asset completion.

## Current accepted production set

**1,124 actual drawings /128 reviewed clips /19 athletes.**

- Manaconda:29 clips /293 drawings, the first captain with every requested authored clip at target counts. All8 fifteen-pose dunk styles, both15-pose alley-oops, two8-pose layups, all3six-pose passes, block/steal/push/rebound, ten-pose fall/get-up and celebration are included.
- Reed Ashcroft, Juniper Vale, Accu, Nova Stitch, Echo Catwalk: each6 clips /52 drawings (five locomotion clips42 plus shoot10).
- Paprika:9 clips /67 drawings (quadruped locomotion42, nose-flick shoot10, nose-pass6, receive4, pickup5). She remains a real tiny four-footed kit fox with animal paws, large ears, russet/cream fur and pale-tipped bushy tail.
- Lavi, Leo, Kraken, Krios, Colossus, McFleurdel, Ria, Gummiefish, Piper Quickstep, Briar Foxglove, Keeg and Toph each have5 locomotion clips /42 authored poses. Lavi retains short ginger curls, freckles and glasses; Leo's pale face, long black waves and mustache; Kraken's natural skin, short dark hair and pointed ears without tentacles; Krios's red skin, black ram horns and dark beard; Colossus's white hair/red round glasses/crimson flowers; McFleurdel's black/white hair and fleur-de-lis detail; Ria's dark low ponytail and emerald/wine uniform; Gummiefish's vivid blue hair, fish hairpin and human anatomy; Piper's orange high ponytail; Briar's brown locs and red headband; Keeg's black hair, close beard, purple/silver hat with mushrooms; Toph's pinned beanie, rectangular glasses, gauges and purple-thorn hoodie.

Strict decoded audit remains incomplete:128 inspected clips,423 missing clips among represented athletes,86 missing athletes. `docs/animation-production/GENERATED_POSES.md` has exact byte inventory; `ASSET_STATUS.md` is the strict audit output. Do not describe one captain's authored completion as full browser/league acceptance.

All production art is imagegen. Original PNGs remain in `/workspace/generated_images`; prompts, paths/dates, source hashes/crop rectangles/scale and packing flags are committed under tools/generate-art. The renderer consumes only reviewed clips and separately reviewed direction policy. E. Indigo/GB Design require explicit direction-specific treatment. Preserve existing supporting identities; use full spec for canon, not another character's anatomy.

## Current asset batch and next work

- Piper Quickstep `/workspace/generated_images/exec-8c77c000-885f-466b-a5be-6d63f3bb10c4.png` and Briar Foxglove `/workspace/generated_images/exec-57757a29-48ee-4dd0-9eae-861f1dbaccf5.png` have each passed alpha, component-count, cell-order and border checks, were packed into five 96px atlases, and were visually reviewed in source and packed form. Each has canon-reviewed mirroring. Native captures load102/107 images and produce87 snapshots; each athlete's five locomotion clips use production art in both facing directions.
- Ria `/workspace/generated_images/exec-0a7157ab-6b56-4cb7-85ca-1f1a816b71e0.png` and Gummiefish `/workspace/generated_images/exec-24d885d9-845b-42ab-9f9c-3cad41cf47bb.png` have five reviewed and integrated clips each; native diagnostics load93 images /87 snapshots.
- Colossus `/workspace/generated_images/exec-077c4860-816d-4bb0-bfb1-a9317c94ce25.png` and McFleurdel `/workspace/generated_images/exec-d4cca82e-afad-4909-9b3c-959d559ca8d1.png` are likewise packed, reviewed and rendered natively.
- Piper's first RGB checkerboard sheet and Briar's previous border-clipped sheet remain rejected and excluded.
- Heph's latest generated source `/workspace/generated_images/exec-b44d4a9e-23d7-4aa4-92fe-27d6fec1ecea.png` is rejected: source inspection found only41 separate figures and the sheet did not preserve the exact 7x6 layout. Do not pack or count it; regenerate Heph with six explicit rows of seven before proceeding.
- Continue with the uncovered canonical captains first (Heph is next after Toph); then produce the missing action clips for captains and the 35-team supporting roster. Only19 of105 athletes currently have reviewed clips.

Leo/Krios/Kraken, Gummiefish and crowded earlier sheets use component isolation only after verifying42 distinct bodies. Lavi, Colossus, McFleurdel, Ria, Piper and Briar use straight packing. All accepted prompts, source hashes and crop provenance are tracked under `tools/generate-art`.

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

Latest1,124/128 local checkpoint validation:

- Fresh build and all24 regression test files pass after Toph registration (17,729ms).
-84 direct animation tests pass, including Paprika start-of-match, inbound, receive and pickup hand placement.
- Syntax lint14 modules;35franchises/105athletes validation pass.
-100 complete simulated matches,853,717ticks; average scores7.57/9.25;7overtime periods.
-11 Python packing checks pass.
- Native renderer generated87 snapshots each for Lavi, Leo, Kraken, Krios, Colossus, McFleurdel, Ria, Gummiefish, Piper, Briar, Keeg and Toph. Piper loaded102 images, Briar107; each has production sprites on all five locomotion clips and explicit fallback for unfinished actions.
- Strict asset audit intentionally incomplete:128 reviewed clips,423 missing clips and86 missing characters. Toph's five locomotion atlases have been source/packed reviewed and registered.

Chromium E2E cannot launch in sandbox (crashpad setsockopt EPERM); no escalated retry. Do not claim browser/mobile playtest passed. Native diagnostic runs actual src/main.js via a minimal DOM/native Canvas adapter, not browser/CSS/E2E. Captures all29 clip keys across3 court positions with explicit production/fallback flags; Manaconda93images/87snapshots, Paprika95images/87snapshots. A real180tick simulation snapshot is also captured. Zoom120 diagnostic works. Actual hand alignment/loop continuity still need browser playtest.

Native command: `JAMVERSE_CANVAS_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas JAMVERSE_PREVIEW_ATHLETE=leo node tools/render-preview.mjs`; optional `JAMVERSE_PREVIEW_ZOOM` (85..120). Outputs artifacts/native-render-preview/<athlete>[-zoomN].

Commands: npm run dev (http://localhost:4173), npm run build, npm test, npm run lint, npm run validate:content, npm run simulate:league; Python checks as above. Before push verify clean diff/build and update actual inventory/handoff; user already authorized publication. Continue full art production after checkpoint.
