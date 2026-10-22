# QA report

## Environment

- Node.js v24.19.0, npm v11.9.0
- Chromium 154.0.8037.57 via system `/usr/bin/chromium`
- Python Playwright from the managed execution environment
- Work branch: `main` (latest deployed checkpoint `9c1479f`; tested local checkpoint adds Willow Root and Rowan Bark locomotion)

## Commands and results

| Command | Result |
|---|---|
| `npm test` | PASS — all 24 test files, including animation clock/sprite selection, generated asset validation, canonical rigs, 35-team/105-athlete roster, game rules, modes, save migrations, practice, season, substitutions, shot clock/inbounds and a complete match |
| `npm run validate:content` | PASS — 35 teams, 105 unique athletes, 35 canonical captains; validator checks presentation, unique names/numbers/seeds, sprite rig metadata and full skill vectors |
| `npm run lint` | PASS — syntax checked 14 source JavaScript modules |
| `npm run build` | PASS — static preview copied to `dist/`; self-contained `dist/JAMVERSE_96.html` embeds app code, CSS, all 480 reviewed production animation atlases and legacy gameplay art |
| `npm run preview` + local HTTP checks | PASS — built `index.html` and `src/main.js` both returned HTTP 200 |
| `npm run test:e2e` | PASS — Chromium verifies controls, full match, practice, co-op, season/cup progression, touch play, animation actions and the self-contained build with no external requests or page errors |
| `node tools/audit-animation-assets.mjs --report-only` | INCOMPLETE as specified — 4,105 drawings in 480 reviewed clips / 85 represented athletes; 2,043 missing-clip findings, 20 athletes unrepresented and three clips below target remain |
| J.25 native Canvas previews | PASS — Willow Root and Rowan Bark each loaded104 images and captured87 snapshots; all five new clips selected production atlases in both facings, and athlete-specific hand tracks align the separately rendered ball |
| GitHub Pages workflow | PASS — run #59 deployed commit `9c1479f`, including Moss/Digger locomotion. Standalone preview: https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=9c1479f |
| `npm run simulate:league` | PASS — 100 matches, 853,867 ticks, 7 overtime periods; averages 7.82/8.90 points |

The browser launch required an approved elevated command because the restricted sandbox blocked Chromium's Crashpad socket. The test was rerun successfully under that granted execution permission after this asset integration. The benchmark uses test periods; it is not proof of human-versus-CPU balance or a manual playtest. Chromium opened the self-contained HTML through a local static server and observed no external asset requests.

## Captured browser evidence

- `artifacts/screenshots/title.png`
- `artifacts/screenshots/team-selection-grid.png`
- `artifacts/screenshots/captain-dragon-queen.png`
- `artifacts/screenshots/captain-emberwood-kits.png`
- `artifacts/screenshots/captain-venom-delta-fangs.png`
- `artifacts/screenshots/captain-lantern-hollow-wombats.png`
- `artifacts/screenshots/captain-london-royal-spots.png`
- `artifacts/screenshots/captain-stripewood-longarms.png`
- `artifacts/screenshots/captain-manaconda.png`
- `artifacts/screenshots/captain-keeg.png`
- `artifacts/screenshots/captain-krios.png`
- `artifacts/screenshots/captain-e-indigo.png`
- `artifacts/screenshots/captain-avek.png`
- `artifacts/screenshots/captain-dea.png`
- `artifacts/screenshots/court-chicago-crownfire.png`
- `artifacts/screenshots/court-kits-fangs.png`
- `artifacts/screenshots/court-longarms-wombats.png`
- `artifacts/screenshots/court-quirky-dragonqueen.png`
- `artifacts/screenshots/court-alexithymia-paprika.png`
- `artifacts/screenshots/dunk-release.png`
- `artifacts/screenshots/active-fire.png`
- `artifacts/screenshots/quarter-break-substitutions.png`
- `artifacts/screenshots/campaign-ladder.png`
- `artifacts/screenshots/jam-cup-bracket.png`
- `artifacts/screenshots/final-boxscore.png`

The nonhuman matchup screenshots exercise those names and rigs in the match renderer; visual review corrected the wombat body/limbs, reviewed Quirky/Dragon Queen/Suga/GB Design details, and added Alexithymia's noir android body. The title and team-grid screenshots show generated captain portraits and franchise crests; the court matchup screenshots show the new generated full-body player sprites. Courts include the home team's color-matched center initial and crowd slogan. Supporting-player gear varies deterministically alongside hair, skin, and uniform patterns; canonical captain skin/eye colors and distinctive details are mapped on court. Deterministic E2E scenarios assert a dunk release commits exactly 2 points and three made baskets activate FIRE; the actual frames are saved above.

## Limits

No Edge or Firefox run, manual human playtest, accessibility audit, screenshot review across several browser sizes, performance percentile measurement, or 100 human-vs-CPU full-length game validation was performed. Current known defects are recorded in `KNOWN_ISSUES.md`.
