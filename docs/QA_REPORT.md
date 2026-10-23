# QA report

## Latest validated checkpoint — J.88 (2026-10-23; local, push pending)

- `npm test`: PASS —393 tests, zero failures; includes static offline build.
- `npm run lint`: PASS —18 JavaScript modules.
- `npm run validate:content`: PASS —35 franchises /105 unique athletes /35 canonical captains.
- `npm run simulate:league`: PASS —100 matches /854,447 ticks /7 overtime periods.
- `python -m unittest tools.generate-art.test_package_motion -q`: PASS —41 packer checks.
- `npm run build`: PASS —static bundle and standalone offline page.
- `npm run test:e2e`: PASS —Chromium offline startup, controls, touch/gamepad/settings, nonhuman matchups, complete match, season progression and standalone startup.
- Strict animation audit: expected exit1 / INCOMPLETE —651 clips /5,685 authored drawings across105 athletes,2,452 missing clips,3 target shortfalls and4 inherited prompt findings.
- Keeg standard and zoom120 native renders each loaded154 images and rendered87 clip snapshots /452 action frames; `receive` selects production art in both facings and shows the separately rendered ball at the tick4 catch.
- J.87 commit `0012a40` Pages run #125 succeeded. J.88 is validated locally; push/deployment verification is next.

## Environment

- Date: 2026-10-22
- Node.js v24.19.0, npm v11.9.0
- Chromium 154.0.8037.57 via system `/usr/bin/chromium`
- Python Playwright from the managed execution environment
- Branch: `main`; J.30 Camden Union and Poppy Stitch locomotion is validated, pushed and deployed.

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
