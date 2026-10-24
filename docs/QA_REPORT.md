# QA report

## Moxie Capwell — full-roster asset integration and review

- Registered the24 source-only action atlases (251 authored drawings) after reviewing every light/dark pose sheet for cell separation, transparency, anatomy, canon identity and ball absence. Repacked only the derived atlases to provide at least5px clearance on all cell edges. The generated source sheets, original track values, exact prompts, raw/clean hashes, layouts, cleanup notes and rejected candidates remain preserved.
- Wired all22 source-specific ball tracks into gameplay and calibrated the late hand points on ten aerial actions. Native Canvas review at standard and120% zoom selected production art across87 snapshots and522 action frames per zoom, including contact, final carry and release in both facings. The original source track data and reviewed runtime values are separate in the inventory and clip provenance.
- Moxie is complete at29/29 clips /293 authored drawings. Focused sprite/animation tests pass; full validation passes: `npm test` (28/28 test files), lint (18 modules), content validation (35 franchises /105 athletes), 100-match simulation (860,220 ticks /6 overtimes), build, and Chromium E2E including offline standalone play and full-match progression.
- Strict report-only audit at `2026-10-24T18:26:27.303Z`: **696 clips /6,175 authored drawings /105 athletes**, 2,407 missing clips,3 target shortfalls and4 inherited prompt findings. The full roster target remains incomplete. Next canonical roster-order package is Dorian Mycel.

## J.107 Keeg `alley-oop-reverse` asset checkpoint — Pages run #159 passed

- Accepted and registered 15 unique generated Keeg poses in a lossless5×3 atlas. The 128×96 packed cells retain at least26px side margins and5px vertical margins; the corrected light/dark review covers all15 poses. Pose05 has an empty catch gap; no source art contains a ball.
- Exact per-pose generation/edit prompts, generation IDs, raw and cleaned source hashes, cleanup,20 rejected/excluded candidates, layout records and reviews are preserved under `tools/generate-art/`. Keeg retains K.03 human anatomy, black hair/beard, purple mushroom hat with silver trim, full Moonmorel kit and shoes.
- A Keeg-specific separate ball track catches the incoming lob at tick10, stays carried through tick20, and releases once at tick21 into simulation-owned rim flight. Native Canvas captures select all15 poses in both facings at standard and120% zoom; both full sequences and contact/release screenshots are preserved.
- Keeg is29/29 clips /293 authored drawings. Next canonical roster-order athlete is Piper Quickstep (`5/29`); `shoot` pose generation is underway.
- Validation: `npm test` PASS —28/28 test files; `npm run lint` PASS —18 modules; `npm run validate:content` PASS —35 franchises /105 athletes; `npm run simulate:league` PASS —100 matches /856,346 ticks /5 overtimes; atlas packer PASS —55/55; build and Chromium E2E PASS. Focused suites pass animation-sprites115/115 and simulation animation171/171. Strict report-only audit refreshed `2026-10-24T17:32:56.733Z`:670 clips /5,904 drawings /105 athletes,2,433 missing clips,3 target shortfalls,4 inherited prompt findings. Checkpoint `b8fd1d3` is pushed to `main`; GitHub Pages run #159 passed: https://github.com/Manaconda33/Conda-Jam/actions/runs/40117044306. Preview: https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=b8fd1d3.

## J.106 Keeg `alley-oop-power` asset checkpoint — local, not deployed

- Accepted and registered 15 unique generated Keeg drawings in a 5×3 lossless atlas. Original and alpha-cleaned sources, exact prompts, generation IDs, hashes, cleanup, layout/crop metadata, six rejected attempts, light/dark reviews, full sequence and ball overlay are preserved in `tools/generate-art/`.
- The independent Keeg ball track contacts the catch hand at tick10, remains attached through tick20, then simulation resolves the sole release to the rim at tick21. Native renderer report/screens cover both facings. K.03 human anatomy/identity, full hat/hands/shoes, transparent margins and pose separation pass.
- Keeg is 28/29 clips /278 authored drawings. Next roster-order asset is J.107 `alley-oop-reverse`.
- Validation: `npm test` PASS —28/28 files; lint PASS —18 modules; content PASS —35 franchises /105 athletes; simulation PASS —100 matches /856,346 ticks /5 overtimes; atlas packer PASS —55 checks; build PASS; Chromium E2E PASS.
- Strict audit refreshed `2026-10-24T16:44:38.344Z`:669 clips /5,889 drawings /105 athletes;2,434 missing clips,3 target shortfalls,4 inherited prompt findings. J.106 is validated locally; commit/push and Pages workflow verification remain.


## Latest animation work and validation — 2026-10-24 16:24 UTC

### J.105 Keeg `dunk-scythe`

- Accepted production atlas `public/assets/animation/keeg-dunk-scythe-right.webp`; 15 unique right-facing poses, safely mirrored under reviewed K.03 policy. The exact prompts, generated sources, eight rejected sheets, isolated rejected variants, cell layouts, cleanup notes, track overlay and native previews are preserved in the J.105 files and `artifacts/native-render-preview/`.
- Native preview selected all15 J.105 poses in both facings; carried ball tracks to the hand through tick20 and resolves at the rim on tick21. Focused sprite coverage verifies atlas hash, all unique frames, mirror direction, release anchor and sampled ball offsets.
- Audit refreshed at `2026-10-24T16:22:12.268Z`: 668 registered clips / 5,874 authored drawings / 105 athletes; 2,435 missing clips,3 target shortfalls,4 inherited prompt findings. Exact timestamp is in `docs/animation-production/ASSET_AUDIT.json`.

### J.106 Keeg `alley-oop-power` source lane — not registered yet

- Poses00–07 have individually generated source images and light/dark 128×96 cell reviews. Pose03 attempt01 (haze) and attempt02 (too similar to pose02), pose05 attempt01 (too similar to pose04), and pose07 attempt01 (hand behind/against hat) are preserved as rejected; accepted alternatives retain raw and cleaned outputs as applicable. Exact prompts, IDs, hashes and review metrics are in `tools/generate-art/j106-keeg-alley-oop-power-provenance.json` and pose prompt files.
- The accepted drawings retain Keeg’s K.03 human identity, black hair/beard, tall purple mushroom hat and purple/silver kit; no ball is painted. A separate ball track and atlas have not been approved. Poses08–14 are being generated in a separate review lane and must be verified before integration.

### Validation

- `npm test`: PASS —28/28 test files. `npm run lint`: PASS —18 modules. `npm run validate:content`: PASS —35 franchises /105 athletes. `npm run simulate:league`: PASS —100 matches /856,346 ticks /5 overtimes. `python3 tools/generate-art/test_package_motion.py`: PASS. `npm run build`: PASS.
- `npm run test:e2e`: PASS in Chromium after retrying with loopback access. The initial sandbox run failed when the local server bind returned `EPERM`; the authorized retry passed the standalone offline launch, game flow, nonhuman matchups, full match and season journey.
- J.105 native renderer:171 images loaded,87 clip snapshots /454 action previews; all35 J.105 pose/facing preview rows selected production art.

## Current checkpoint — portrait court, touch accessibility and audit refresh (Pages run #157 passed)

- Portrait play no longer crops the fixed 480×360 court into a narrow strip: mobile CSS letterboxes the full court. The 390×844 Chromium screenshot is `artifacts/screenshots/mobile-court.png`.
- Joystick mode preserves the labeled D-pad in the assistive-technology tree while keeping it visually hidden until focused. E2E checks the `Move up` button remains exposed and confirms joystick movement.
- Verification after these changes: `npm test` 413/413; `npm run test:e2e` PASS (including standalone offline, full match, touch, and named dialogs); lint 18 modules; content 35/105; 100-match simulation 851,533 ticks / 4 overtime periods. Atlas packer remains 55/55.
- Strict report-only audit refreshed at 2026-10-24T13:28:15Z: 667 clips / 5,859 authored drawings / 105 athletes; 2,436 missing clips, 3 target shortfalls and 4 inherited prompt findings.
- Responsive/accessibility and audit checkpoint `31224b3` is pushed and deployed in Pages run #157: https://github.com/Manaconda33/Conda-Jam/actions/runs/40098618086. Preview: https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=31224b3.

## Current checkpoint — gameplay, accessibility and audit refresh (Pages run #156 passed)

- Gameplay: body checks can jar the ball loose from a nearby carrier at reduced odds; the carrier is stunned and the defender receives last touch. Shots and dunks released before zero on the game clock now resolve before period transition. Regressions cover both behaviors.
- Accessibility: Settings, franchise picker, season, cup, standings, and career dialogs now use their visible headings as accessible names. Chromium role/name assertions cover all six.
- Verification: `npm test` 413/413; `npm run lint` 18 modules; `npm run validate:content` 35/105; `npm run simulate:league` 100 matches / 853,336 ticks / 6 overtime periods; atlas packer 55 tests; build and full Chromium offline/match/season journey pass.
- Strict animation audit remains incomplete as required: 667 clips / 5,859 authored drawings / 105 athletes; 2,436 missing clips, 3 target shortfalls and 4 inherited prompt findings. No accepted Keeg J.105 scythe art yet: two generated sheets are rejected for poses touching/crossing cell margins; both sources and exact prompts are preserved.
- The gameplay/accessibility checkpoint is committed and pushed as `8c54309`. Pages run #156 passed and deployed it: https://github.com/Manaconda33/Conda-Jam/actions/runs/40097847308. Preview: https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=8c54309.

## Continuation validation — 2026-10-24

- Baseline: current `origin/main` at `f2b0a22`; Pages run #157 passed for gameplay/accessibility checkpoint `31224b3`.
- `npm test`: PASS —28/28 test files. `node tests/game-core.test.js`: PASS —41/41 individual simulation cases, including made buzzer shots and dunks resolving a final-period lead or tie-to-overtime.
- `npm run lint`: PASS —18 modules. `npm run validate:content`: PASS —35 franchises /105 unique athletes /35 captains.
- `npm run simulate:league`: PASS —100 matches /856,346 ticks /5 overtime periods. `python3 -m unittest tools/generate-art/test_package_motion.py`: PASS —55 checks. `npm run build`: PASS.
- Buzzer celebration: made shots and dunks at zero clock hold their score pause for 70 ticks, then resolve the period without an inbound. Regression coverage verifies both a final lead and overtime tie.
- `npm run test:e2e`: PASS —standalone offline startup, settings and dialogs, controls, touch, substitutions, actions, nonhuman matchups, full default-length match and season progression in Chromium. E2E screenshots were restored after review.
- Keeg J.105 generation review: eight full-sheet candidates rejected. All 15 isolated poses passed individual human anatomy/identity/transparency review and deterministic 128×96 cell previews; pose07 attempt01 and pose09 attempts01–02 are rejected and preserved. The full pose strip is reviewed; the separate Keeg-specific ball track remains to be aligned and verified before this can become a complete clip source. No atlas or clip registration was created.
- Refreshed strict report-only audit at `2026-10-24T15:44:20.218Z`:667 clips /5,859 authored drawings /105 athletes;2,436 missing clips,3 target shortfalls,4 inherited prompt findings. Issue #3 remains incomplete.
- Art commits `7975575`, `8febf97`, `d8248cf`, `35307b7`, `30f5679`, `12d44d6`, `63201c8`, `ca71b2f`, `8741440`, `066c89d`, `7544b2f`, `25faa7b`, and `4b1aee3` are pushed to `main`. These art changes do not trigger Pages. Buzzer celebration runtime commit `3cdc3d6` is deployed successfully in Pages run #158: https://github.com/Manaconda33/Conda-Jam/actions/runs/40101381016. Preview: https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=3cdc3d6.

# QA report

## J.105 Keeg `dunk-scythe` asset checkpoint

- Accepted and registered15 pose-specific transparent drawings in a 5×3 atlas. The light/dark pose review checks separation, transparent gutters/cell margins, full human anatomy and Keeg’s black hair/beard, tall purple mushroom hat and purple/lavender/silver kit. The game ball is absent from all drawings. Rejected sheets and pose07/pose09 candidates remain preserved with exact prompts and review notes.
- The separate Keeg-specific track was reviewed over the pose cells and in native previews for both facings. It contacts the hand through pose09/tick20; pose10/tick21 resolves at the rim, after which simulation owns ball flight. Preview report: `artifacts/native-render-preview/keeg/report.json`.
- Atlas: `public/assets/animation/keeg-dunk-scythe-right.webp` (640×288; SHA-256 `60a7b91f8f5d004530ef74bffaa14d9e69921984b51deb141d5bbf3c4bb21df6`). Keeg now has27/29 clips /263 authored drawings; `alley-oop-power` is next.
- Strict report-only audit:668 clips /5,874 drawings /105 athletes;2,435 missing clips,3 target shortfalls,4 inherited prompt findings. Timestamp is recorded in `docs/animation-production/ASSET_AUDIT.json`.

## Gameplay and settings polish — shot-clock pass expiration and keyboard capture cancellation

- `npm test`: PASS — 411 tests, zero failures, including a regression proving an expired pass is canceled, the passer receives one turnover, and the opponent gets one inbound.
- `npm run lint`: PASS — 18 JavaScript modules.
- `npm run validate:content`: PASS — 35 franchises / 105 unique athletes / 35 canonical captains.
- `npm run simulate:league`: PASS — 100 matches / 866,809 ticks / 9 overtime periods.
- `npm run build`: PASS — static browser bundle and standalone offline page.
- `npm run test:e2e`: PASS — Chromium standalone offline startup, controls, co-op, touch, substitutions, actions, full match and season progression.
- The browser regression closes a pending keyboard rebind with both × and Save, reopens Settings, and confirms the next key does not change or consume the binding.
- Strict report-only asset audit refreshed: 667 clips / 5,859 authored drawings / 105 athletes; 2,436 missing clips, 3 target shortfalls and 4 inherited prompt findings. The audit is current but the animation assignment remains incomplete.
- The J.104 animation audit counts are unchanged. Gameplay commits `8dc07d6` and `6a202ea`, source-only atlases, and the refreshed strict report-only audit are deployed in Pages run #154: https://github.com/Manaconda33/Conda-Jam/actions/runs/40096067391. Preview: https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=aca8ac9.

## J.104 Keeg `dunk-clutch` art checkpoint (Pages run #145)

- `npm test`: PASS — 410 tests, zero failures; includes the self-contained offline build.
- `npm run lint`: PASS — 18 JavaScript modules.
- `npm run validate:content`: PASS — 35 franchises / 105 unique athletes / 35 canonical captains.
- `npm run simulate:league`: PASS — 100 matches / 866,809 ticks / 9 overtime periods.
- `python3 -m unittest tools/generate-art/test_package_motion.py`: PASS — 55 packer checks.
- `npm run build`: PASS — static browser bundle and standalone `dist/JAMVERSE_96.html`.
- `npm run test:e2e`: PASS — Chromium standalone offline startup, settings, controls, co-op, touch, matchups, full match and season progression. The first run timed out once at the combined gamepad-input wait; a diagnostic-instrumented complete rerun passed without gameplay-code changes.
- Strict audit is intentionally report-only and remains incomplete: 667 clips / 5,859 authored drawings across 105 athletes; 2,436 missing clips, 3 target shortfalls and 4 inherited prompt findings.
- Keeg standard and zoom120 native previews each loaded 170 images and rendered 87 clip snapshots / 452 action frames. All 15 J.104 poses select production art in both facings; the separate ball releases at frame10/tick21.
- J.104 `5907922` remains the latest animation-integrated art checkpoint. Gameplay fix `8dc07d6` and source-only atlases were deployed in Pages run #150; verification-gated build and refreshed audit checkpoint `aca8ac9` are deployed in Pages run #154: https://github.com/Manaconda33/Conda-Jam/actions/runs/40096067391. Preview: https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=aca8ac9.

## Environment

- Date: 2026-10-24
- Node.js v24.19.0, npm v11.9.0
- Chromium 154.0.8037.57 via system `/usr/bin/chromium`
- Python Playwright from the managed execution environment
- Branch: `main`; current repository checkpoint `7501dc3` is pushed. The latest Pages asset build is run #149; current runtime integration remains J.104.

## Commands and results

| Command | Result |
|---|---|
| `npm test` | PASS — all24 test files; includes full match integration, animation atlas selection, frame uniqueness, mirror policy, separate ball tracks, roster and gameplay systems |
| `npm run validate:content` | PASS — 35 franchises, 105 unique athletes, 35 canonical captains |
| `npm run lint` | PASS — syntax checked 14 source JavaScript modules |
| `npm run build` | PASS — creates the static browser bundle and standalone `dist/JAMVERSE_96.html` with registered J.30 art |
| `npm run simulate:league` | PASS — 100 matches, 853,867 ticks, 7 overtime periods; average scores 7.82 and 8.90 |
| `python tools/generate-art/test_package_motion.py` | PASS — all12 atlas packaging checks |
| `node tools/audit-animation-assets.mjs` | INCOMPLETE as required by current coverage — 530 clips decoded, 4,525 authored drawings /95 represented athletes; 2,283 missing clips,10 unrepresented athletes and 3 clips below target. Exit status1 correctly signals the full-roster gap. |
| `npm run test:e2e` | PASS on elevated retry — offline Chromium journey covers controls, co-op, touch, substitutions, held shots, body-checks, dunks, nonhuman matchups, full match, season progression and standalone build |
| J.29 native Canvas previews | PASS — Moss Granite and Thump Alder each load104 images /87 snapshots. All five clips select reviewed production art in both facings at standard scale and zoom120; separate basketball tracks were checked at hand contact and floor bounce. |
| J.30 native Canvas previews | PASS — Camden Union and Poppy Stitch each load109 images /87 snapshots at standard scale and zoom120. All five clips select reviewed production art in both facings; ball tracks align with the receiving hand and low bounce. |
| Focused animation tests | PASS — `node tests/animation.test.js` (109/109) and `node tests/animation-sprites.test.js` (26/26) |
| GitHub Pages | PASS — run #65 deployed J.30 commit `c38d819fa2a5e4c0a3b1a476873a12ea1d6b3480`: https://github.com/Manaconda33/Conda-Jam/actions/runs/39866201859. Preview: https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=c38d819 |

The first Chromium launch was blocked by the restricted sandbox's Crashpad socket. The same authorized E2E command passed on elevated retry. Its temporary screenshot rewrites were restored afterward, preserving the checked-in QA captures. The league benchmark uses test periods; it does not establish human-versus-CPU balance or substitute for human playtesting.

## Captured browser evidence

Stored E2E captures are under `artifacts/screenshots/`, including title, team selection, captain cards, court matchups, dunk release, FIRE, substitutions, season progression and final box score. Native Canvas pose captures for Moss, Thump, Camden and Poppy are in `artifacts/native-render-preview/`.

## Limits

The strict animation audit remains incomplete, so full issue #3 acceptance is not met. No Edge or Firefox run, manual human playtest, accessibility audit, broad responsive screenshot review, performance percentile measurement or 100 human-versus-CPU full-length game validation was performed. Current known defects are recorded in `KNOWN_ISSUES.md`.
