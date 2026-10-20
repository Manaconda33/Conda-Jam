# QA report

## Environment

- Node.js v24.19.0, npm v11.9.0
- Chromium 154.0.8037.57 via system `/usr/bin/chromium`
- Python Playwright from the managed execution environment
- Work branch: `work`

## Commands and results

| Command | Result |
|---|---|
| `npm test` | PASS — eight test files, including all 35 canonical captain names and rigs, original repeating music, self-contained packaging, v1→v2 save migration and malformed save handling, 29 core rule cases, CPU difficulty ordering, season progression, substitutions, shot clock/inbounds, steals, body-check recovery, short-match integration, and a default 3:00-per-quarter full-length match |
| `npm run validate:content` | PASS — 35 teams, 105 unique athletes, 35 canonical captains; validator checks presentation, unique names/numbers/seeds, sprite rig metadata and full skill vectors |
| `npm run lint` | PASS — syntax checked source JavaScript modules |
| `npm run build` | PASS — static preview copied to `dist/` and self-contained `dist/JAMVERSE_96.html` generated with inline styles/modules |
| `npm run preview` + local HTTP checks | PASS — built `index.html` and `src/main.js` both returned HTTP 200 |
| `npm run test:e2e` | PASS — Chromium title, text scaling up to 120% without clipping, saved reduced-flash and color-independent team-marker settings, persisted P1 key rebinding, 35-button franchise grid and all 35 captain-card updates, selected custom-creature/signature-detail art, supporting-athlete styles, 390×844 layout/team selection, v1→v2 local save migration in a fresh browser context, alternate starter persistence, CPU difficulty, keyboard movement, four local humans via keyboard plus three Gamepad API players and four-gamepad-only control with keyboard fallback, pause/resume and disconnect/reconnect, both quarter-break substitutions, body-check, pass/shoot, held-shot charging/release with one attempt, dunk scoring, FIRE activation, nonhuman matchups, touch movement and shot at 390px plus bounds at 320px, full accelerated four-period match, rematch/menu, and season win/loss/replay. Source and standalone journeys unlock the music loop; standalone loads 35/105 roster data, tips off, and makes no external requests. No page errors or failed requests |
| `npm run simulate:league` | PASS — 100/100 complete within 60,000 ticks; averages 4.51/4.76 points, 6 overtime periods (805,840 total ticks) |

The browser launch required an approved elevated command because the restricted sandbox blocked Chromium's crash-report socket. The test was rerun successfully under that granted execution permission. The benchmark uses 30-second test periods; it is not proof of a full-length user-driven three-minute game.

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
- `artifacts/screenshots/final-boxscore.png`

The nonhuman matchup screenshots exercise those names and rigs in the match renderer; visual review corrected the wombat body/limbs, reviewed Quirky/Dragon Queen/Suga/GB Design details, and added Alexithymia's noir android body. Courts now include the home team's color-matched center initial and crowd slogan. Supporting-player gear now varies deterministically alongside hair, skin, and uniform patterns; canonical captain skin/eye colors and distinctive details are mapped on court. Deterministic E2E scenarios assert a dunk release commits exactly 2 points and three made baskets activate FIRE; the actual frames are saved above. No screenshots have been captured for final roster cards.

## Limits

No Edge or Firefox run, manual human playtest, accessibility audit, screenshot review across several browser sizes, performance percentile measurement, or 100 human-vs-CPU full-length game validation was performed. Current known defects are recorded in `KNOWN_ISSUES.md`.
