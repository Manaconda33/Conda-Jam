# QA report

## Environment

- Node.js v24.19.0, npm v11.9.0
- Chromium 154.0.8037.57 via system `/usr/bin/chromium`
- Python Playwright from the managed execution environment
- Work branch: `main` (local; no remote push)

## Commands and results

| Command | Result |
|---|---|
| `npm test` | PASS — fifteen test files, including four generated atlas validators, transparent artwork in all 140 cells, all 35 canon captains and rigs, 35-team/105-athlete roster, original music, self-contained packaging, v1→v5 and v2/v3/v4→v5 migrations, 8-team cup field/path/result validation, 34 core rules, practice, season, 35-team standings, career records, substitutions, shot clock/inbounds and a default 3:00-per-quarter full match |
| `npm run validate:content` | PASS — 35 teams, 105 unique athletes, 35 canonical captains; validator checks presentation, unique names/numbers/seeds, sprite rig metadata and full skill vectors |
| `npm run lint` | PASS — syntax checked nine source JavaScript modules |
| `npm run build` | PASS — static preview copied to `dist/` and self-contained `dist/JAMVERSE_96.html` generated with inline styles/modules and all four embedded generated atlases |
| `npm run preview` + local HTTP checks | PASS — built `index.html` and `src/main.js` both returned HTTP 200 |
| `npm run test:e2e` | PASS — Chromium verifies the existing complete match/control/practice/season/career journeys, saved screen-reader audio-caption toggle, a saved three-round cup progression and championship, v1→v5 migration, all generated sprites, and the self-contained offline file with no external requests or page errors |
| `npm run simulate:league` | PASS — 100/100 complete within 60,000 ticks; averages 4.52/5.70 points, 14 overtime periods (837,884 total ticks) |

The browser launch required an approved elevated command because the restricted sandbox blocked Chromium's crash-report socket. The test was rerun successfully under that granted execution permission. The benchmark uses 30-second test periods; it is not proof of a full-length user-driven three-minute game. A separate attempt to open the single-file build with Chromium `file:///` navigation was denied by the managed browser (`ERR_BLOCKED_BY_ADMINISTRATOR`); the same self-contained HTML passed through the local static server, with no external asset requests.

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
