# JAMVERSE ’96 — Active Handoff

Updated 2026-10-23. This file is the concise resume point; `docs/SESSION_HANDOFF.md` preserves the longer production history.

## Mission and status

Continue issue [#3](https://github.com/Manaconda33/Conda-Jam/issues/3) against the full authoritative specification at `docs/JAMVERSE_96_CODEX_MASTER_PROMPT.md`. The game is playable, but the game specification and animation assignment are not complete. The user has authorized continuous development, image generation, tests, pushes and GitHub Pages deployment; do not request that authorization again.

The animation target is29 action clips per athlete across105 athletes:30,765 target drawings (29,190 minimum). Mirroring, held frames, duplicate crops and rejected source drawings do not count. Issues #1 and #2 also remain open: full arena presentation and real-browser portrait acceptance need further work.

## Repository and deployment

- Repository: `/workspace/Conda-Jam`, branch `main`.
- Starting handoff/source checkpoint: `99c1c45d6ff879e967bd60c0f8a94bb57d14b17e`.
- Latest deployed source checkpoint: `7d15edc873a8dee34d87a3267e51dcc40c5fcaef`; Pages run #74 succeeded: <https://github.com/Manaconda33/Conda-Jam/actions/runs/39887404096>.
- Preview: <https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=7d15edc>.
- J.29–J.35 art batches are pushed and deployed. J.36 Reed Ashcroft and Juniper Vale now have reviewed standard and overhead passes integrated locally; their checkpoint is pending push and Pages verification.

## J.29 — Moss Granite and Thump Alder

Both Greenwall Giants now have original reviewed 42-pose locomotion sources, five packed right-facing atlases, production manifest registration and runtime selection, canon-reviewed mirror policy, separate ball tracks and focused tests. They use five actions: idle6, idle-ball4, dribble10, run11 and dribble-run11. Each still needs the other24 action clips.

**Moss Granite** remains an adult human man with warm medium-deep brown skin, dark eyes, full black beard, dark wavy hair under a moss/olive-green and gold headband, broad muscular build, and moss/stone/gold kit. His accepted28-pose base plus safe14-pose retry assemble to42 distinct in-bounds figures. The fused supplement was rejected and preserved; it is never cropped into frames.

**Thump Alder** remains an adult human woman with warm-peach skin, dark eyes, abundant black waves in large high rounded puffs with green/orange/gold ties, natural athletic-curvy build, and moss/stone/gold kit. Her accepted28-pose base plus safe14-pose retry assemble to42 distinct in-bounds figures. The clipped/touching supplement was rejected and preserved.

- Exact prompts, generation IDs, rejected attempts, raw sources, source maps and provenance: `tools/generate-art/j29-locomotion-prompts.md`, `tools/generate-art/assemble-supporting-locomotion42.py`, `tools/generate-art/*granite*`, and `tools/generate-art/*alder*`.
- Reviewed native preview captures: `artifacts/native-render-preview/moss-granite`, `thump-alder`, `moss-granite-zoom120`, and `thump-alder-zoom120`. Both athletes load104 images /87 snapshots; all five clips select production sprites in each facing.
- Canon mirror review: `docs/animation-production/CANON_MIRROR_REVIEW.md`; source and runtime policy in `src/content/animation-mirror-policy.js`.
- Current decoded audit:586 reviewed clips /4,981 drawings /105 represented athletes. It reports2,517 missing clips, no unrepresented athletes and three clips below target. The strict audit correctly remains incomplete.

## J.30 — Camden Union and Poppy Stitch

- Camden and Poppy are London Royal Spots partners. Runtime roster mapping uses zero-based cells58 and59; the stale supporting-gameplay prompt table was off after cell14 and has now been corrected against `src/content/teams.js`. `tests/supporting-gameplay-atlas.test.js` now asserts every prompt-table partner/alternate name, team and slot against the runtime roster. First generated candidates based on the wrong row are preserved as rejected art. Correct portrait/gameplay crops are in `tools/generate-art/references/`.
- Each athlete now has an accepted correct-cell28-pose base and safe14-pose supplement assembled into42 complete poses. Camden is a warm-tan, clean-shaven human man with short dense dark navy hair and a cobalt headband. Poppy is a fair-warm human woman with vivid red curls in a high ponytail and a navy headband. Both keep their London Royal Spots cobalt/red/white kit and natural human anatomy.
- Five atlases per athlete are registered; canon mirror policy and separate right-hand ball tracks are reviewed. Focused tests pass. Native Canvas previews at standard and zoom120 load109 images and capture87 snapshots each; all five clips select production art in both facings. Captures are under `artifacts/native-render-preview/{camden-union,poppy-stitch}{,-zoom120}`.
- Exact prompts, generation IDs, rejected candidates, source hashes, references, source maps and atlas provenance are recorded in `tools/generate-art/j30-locomotion-prompts.md`, `tools/generate-art/assemble-supporting-locomotion42.py` and `tools/generate-art/*-locomotion42-provenance.json`.

## J.31 — Draya Staffwind and Kael Rune

- Correct runtime cells60 and61 supply the exact portrait/gameplay references. Draya retains warm medium-brown skin, focused adult face, chestnut locs in a high ponytail with gold ties, athletic-curvy proportions and Coppermoon plum/copper/pale-gold kit. Kael retains warm medium-brown skin, angular adult face, short navy-black curls, connected beard/mustache, compact muscular build and matching kit.
- Both athletes have accepted28-pose bases and safe14-pose supplements, assembled as42 distinct in-bounds original figures. Draya’s first base attempt embedded basketballs and is preserved as rejected source history; it is not packed. Raw source hashes, exact prompts, generation IDs, maps and provenance are recorded in `tools/generate-art/j31-locomotion-prompts.md` and `tools/generate-art/*-locomotion42-provenance.json`.
- Five reviewed atlases per athlete are registered. Canon mirror review permits safe body mirroring, and separate athlete-specific right-hand ball tracks follow each hand and reach court at the low dribble bounce. Focused tests pass; native Canvas standard and zoom120 previews load105 images and capture87 snapshots per athlete, with all five clips selected in both facings. Captures are under `artifacts/native-render-preview/{draya-staffwind,kael-rune}{,-zoom120}`.
- J.32 Lilt Smile and Violet Wink (cells62/63) are now integrated locally; see the next section. Each athlete still needs24 action clips beyond locomotion.

## J.32 — Lilt Smile and Violet Wink

- Correct runtime cells62/63 supplied the exact portrait/gameplay identity. Lilt remains a tall human woman with light warm skin, dark eyes, vivid-magenta curls in a high ponytail with a warm tie, and purple/pink/cream/gold/turquoise kit. Violet remains a compact human athletic variant with light warm skin, dark eyes, defined brows, short dense lavender curls and the same Cheshire palette. No fantasy anatomy or props were added.
- Both have reviewed28-pose bases and safe14-pose supplements mapped into42 original drawings across idle6, idle-ball4, dribble10, run11 and dribble-run11. Lilt's low open-hand stance is mapped into the ball-ready clip while her six upright poses remain idle. A later retry was rejected for missing ball-ready hand poses and clipped outside art; it remains excluded.
- Ten right-facing atlases are registered. Canon review permits body mirroring; separate right-hand ball tracks were tuned against rendered hand and court-contact positions. Dark/light atlas sheets and standard/zoom120 native previews were reviewed. Each preview loads105 images and captures87 snapshots; all five clips select production art in both facings.
- Exact prompts, generation IDs, source hashes, pose maps, atlas layouts and preview captures are recorded in `tools/generate-art/j32-locomotion-prompts.md`, `tools/generate-art/*-locomotion42-provenance.json` and `artifacts/native-render-preview/{lilt-smile,violet-wink}{,-zoom120}`. Each athlete still needs24 action clips.


## J.33 — Fern Howl and Koa Vale

- Exact runtime cells64/65 and their portrait/gameplay crops preserve Fern's fair warm skin, dark eyes, high teal curls and tie, tall human build, and Koa's deep brown skin, dark eyes, close-cropped blue-black curls, portrait-matched face and compact human build. Both wear the Emerald Den Wolves emerald/teal/gold kit; neither has wolf anatomy or equipment.
- Each athlete has an accepted28-pose base and safe14-pose supplement assembled into42 distinct original drawings across idle6, idle-ball4, dribble10, run11 and dribble-run11. Fern's 27-component base, crouched-ready base and overlapping supplement are preserved as rejected; Koa's crouched/closed-hand bases and 26-component fused base are preserved and excluded.
- Five right-facing atlases per athlete are registered with reviewed provenance and canon-approved safe mirroring. Athlete-specific ball tracks follow each right hand and reach the court at both dribble bounce anchors. All ten atlases passed dark/light review; standard and zoom120 native Canvas previews load105 images and capture87 snapshots per athlete, selecting all five clips in both facings.
- Focused tests pass: animation112/112 and animation-sprites29/29. Full validation also passes: build, all28 test files, lint, content validation,100-match league simulation,12 atlas packaging checks, and elevated Chromium E2E through a complete match and season progression. Strict audit is incomplete at560 clips /4,777 drawings /101 represented athletes, with2,427 missing clips,4 missing athletes and3 below-target clips. Each J.29–J.33 athlete still needs24 other action clips. Generation IDs, prompts, rejected sources, source hashes, maps, provenance and preview paths are recorded in `tools/generate-art/j33-j35-locomotion-prompts.md` and `tools/generate-art/*-locomotion42-provenance.json`.

## J.34 — Scribble Turner and Palette Spry

- Exact runtime cells66/67 and their portrait/gameplay references anchor their identities. Scribble retains warm tan skin, dark eyes, very full dark-brown curls, portrait-matched brows and mouth, tall natural human build; Palette retains fair warm skin, dark eyes, blonde high ponytail with warm tie, compact natural human build. Both wear the Stripewood Longarms charcoal/orange/purple kit and use ordinary human anatomy.
- Rejected first base attempts have28 separate in-bounds drawings each but a crouched top-right ball-ready pose. The selected retries have28 separate figures in four rows of seven with an upright open-hand stance; both safe14-pose supplements have14 separate figures in two rows. The assembled42-pose source maps idle6, idle-ball4, dribble10, run11 and dribble-run11 without duplicates.
- Five packed right-facing atlases per athlete are registered with canon-reviewed safe mirroring and athlete-specific right-hand ball tracks. Dark/light source and atlas reviews passed. Standard and zoom120 native Canvas previews each load105 images and capture87 snapshots per athlete; all five clips select production art in both facings and the ball reaches the hand and court bounce.
- Focused tests pass: animation113/113 and animation-sprites30/30. Full validation also passes: build, all28 test files, lint, content validation,100-match league simulation,12 atlas packaging checks and elevated Chromium E2E through a complete match and season progression. Latest strict audit:570 reviewed clips /4,861 drawings /103 represented athletes, with2,475 missing clips,2 unrepresented athletes and3 below-target clips. Exact generation IDs, prompts, hashes, rejected sources, maps, provenance, layouts and preview paths are recorded in `tools/generate-art/j33-j35-locomotion-prompts.md` and `tools/generate-art/*-locomotion42-provenance.json`.

## J.35 — Sage Fletch and Hazel Bloom

- Exact runtime cells68/69 and portrait/gameplay references preserve Sage’s warm tan skin, dark eyes, short dense olive-green curls and tall natural human build, and Hazel’s light warm skin, dark eyes, abundant blonde curls with green/gold headwear and compact human build. Both wear Verdant Reach forest-green/gold kit and retain ordinary human anatomy.
- Accepted28-pose bases and safe14-pose supplements assemble42 distinct drawings per athlete across idle6, idle-ball4, dribble10, run11 and dribble-run11. Sage’s first14-pose supplement is preserved and excluded because two neighboring low-dribble bounds overlap; the retry has14 separated, in-bounds figures. Exact generation IDs, prompts, source hashes, maps and provenance are recorded in `tools/generate-art/j33-j35-locomotion-prompts.md` and the J.35 provenance/layout files.
- Five right-facing atlases per athlete are registered with reviewed canon mirroring and athlete-specific right-hand ball tracks. Source sheets and all ten packed atlases passed dark/light visual review. Standard and zoom120 native Canvas previews load105 images and capture87 snapshots each; all five clips select production art in both facings. Captures and contact sheets are under `artifacts/native-render-preview/{sage-fletch,hazel-bloom}{,-zoom120}` and `artifacts/asset-review/j35/`.
- Focused tests pass: animation114/114 and sprite selection31/31. Full validation passes: build, all28 test files, lint, content validation,100-match simulation,12 atlas packaging checks and elevated Chromium through a complete match and season progression. The strict audit is incomplete at580 clips /4,945 drawings /105 athletes, with2,523 missing clips and3 clips below target; there are no unrepresented athletes. Each athlete still needs24 action clips.

## J.36 — Reed Ashcroft and Juniper Vale action clips

- Both Chicago Condas athletes have six-frame standard chest, overhead and behind-the-back passes registered as reviewed production atlases. Their supporting cells0 and1 retain the canon portrait/gameplay identities, natural human anatomy, purple/gold kits and empty hands. Rejected standard-pass source sheets remain preserved with reasons; all prompts, C2PA claim/instance IDs, source hashes and crop maps are recorded in the three J.36 prompt docs and per-athlete provenance/layout files.
- Six atlases are component-isolated from original six-body sources and losslessly packed into 3×2 sheets. Each clip has six unique decoded frame hashes, safe canon mirroring and a separate athlete-specific ball track. Overhead and behind passes release from frame3 at tick7. Dark/light atlas review and standard/zoom120 native Canvas previews pass; each preview loads114 images and captures87 snapshots, selecting all six frames in both facings. Captures are under `artifacts/native-render-preview/{reed-ashcroft,juniper-vale}{,-zoom120}`.
- Focused tests pass; full validation passes all28 repository test files, build, lint, content validation,100-match simulation and12 atlas packaging checks. Chromium full-match/season E2E passed in the elevated environment after the restricted run failed at Crashpad `setsockopt`. The decoded asset audit is incomplete at586 clips /4,981 drawings /105 athletes, with2,517 missing clips and3 below-target clips. Reed and Juniper each still need20 other clips; the next missing clips in roster order are `receive` for Reed and Juniper.

## J.31 interim gameplay polish

- Added predictive horizontal camera follow with a dead zone, velocity look-ahead, time-based easing, zoom-adjusted speed and court-bounded coordinates. Fixed score and clock HUD remains screen-anchored.
- Added the existing knockdown stat as a `KDN` column in the final player box score; substitutions retain the tracked count. Updated `docs/KNOWN_ISSUES.md` accordingly.
- Seeded CPU Jam Cup results now use average roster OVR, with a 50% baseline and a one-point edge per OVR point, bounded20–80%; deterministic field selection and saved results are preserved.
- Added saved gamepad mappings for shoot, pass, turbo and pause, plus D-pad movement fallback when the left stick is centered. Chromium E2E checks custom action buttons, D-pad movement, analog movement and four-pad assignment.
- Added opt-in diagnostics with `?debug=1` and F3, showing measured FPS, mean simulation tick time, seed and current match/ball state; the overlay stays outside the score HUD. Unit and Chromium tests cover the readings, default-off state, toggle and standalone build.
- Deployed as `bbb1cbd` (Pages run #70). Build, all28 automated test files, lint and Chromium full-match/season E2E pass. Content validation confirms35 franchises /105 unique athletes; the100-match simulation completed853,867 ticks with7 overtime periods.
- Strict animation audit remains incomplete:550 clips /4,693 drawings /99 represented athletes;2,379 missing clips,6 missing characters and3 below-target clips.

## Required continuation

1. Continue filling the first missing required action clips in roster order. All105 athletes have at least one registered clip; J.29–J.35 supporting athletes currently have only their five locomotion actions complete. Reed and Juniper's next missing action is `receive`.
2. Finish remaining clips across the full105-athlete roster, keeping art original and canon-faithful. Use the master spec for required action names, per-clip frame targets, identities and anatomy. The current inventory and strict audit are `docs/animation-production/GENERATED_POSES.md`, `docs/ANIMATION_ASSET_AUDIT.md` and `public/assets/animation/ASSET_STATUS.json`.
3. Continue gameplay and presentation polish and address the outstanding spec/known issues.
4. Run the full build, automated tests, lint/content validation, 100-match simulation, Python atlas packaging checks, full-match/browser E2E and strict asset audit. Repair meaningful failures. The audit should stay marked incomplete until its actual full-roster criteria pass.
5. Build the self-contained `dist/JAMVERSE_96.html`, push a meaningful checkpoint, verify the GitHub Pages workflow, and update this file with the deployed commit and preview URL.

## J.30 checks performed

- Source sheets and all ten packed atlases reviewed on light and dark grounds; identity, anatomy and transparency remain consistent.
- Native Canvas previews at standard scale and zoom120 loaded109 images /87 snapshots per athlete and selected all five clips in both facings. Rendered ball tracks were checked at idle-ball, dribble and dribble-run poses.
- `node tests/animation.test.js`:109/109 pass; `node tests/animation-sprites.test.js`:26/26 pass. Tests cover athlete-specific ball hand placement, correct reference cells, five reviewed clips, exact frame counts, unique crops, accepted provenance, and both-facing production selection.
- Strict asset audit: 530 clips, 4,525 drawings, 95 athletes; incomplete with2,283 missing clips,10 missing athletes and three below-target clips.
- J.30 full validation passed: build, all24 test files, lint, content validation,100-match simulation,12 atlas packaging checks and offline Chromium full-match/season E2E. Pages run #65 succeeded for `c38d819`; the preview link above contains the deployed game. The strict asset audit remains incomplete by design.

## J.31 gameplay polish checks performed

- `node --test tests/camera-tracking.test.js tests/box-score.test.js tests/gamepad-controls.test.js`:11 test cases pass. The final-box-score browser capture visibly includes the new `KDN` column; generated E2E screenshots were restored after review.
- `npm run build`, `npm test` (all28 files), `npm run lint` (18 JavaScript modules), `npm run validate:content` and the full offline Chromium E2E journey pass. E2E covers settings, controls, co-op, a complete default-length match and season progression; the first restricted Chromium launch failed at Crashpad, and the authorized elevated retry passed.
- E2E verified that gamepad mapping changes persist, mapped shoot/pass/turbo actions register, D-pad and analog movement both work, Start pauses/resumes by default, and hot-plug/four-pad play still works.
- `npm run validate:content`:35 franchises /105 unique athletes. `npm run simulate:league`:100 completed matches /853,867 ticks /7 overtime periods.
- Strict audit was rerun report-only and remains incomplete at550 clips,4,693 drawings,99 athletes,2,379 missing clips,6 missing characters and3 target shortfalls. The decoded status JSON and audit summaries are updated; incomplete output is expected until every required clip is authored.
- Pages run #69 deployed the gamepad settings and controls build successfully; the preview URL at the top is current.
