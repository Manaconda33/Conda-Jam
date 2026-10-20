# QA report

## Environment

- Node.js v24.19.0, npm v11.9.0
- Chromium 154.0.8037.57 via system `/usr/bin/chromium`
- Python Playwright from the managed execution environment
- Work branch: `work`

## Commands and results

| Command | Result |
|---|---|
| `npm test` | PASS — content, 28 core rule cases, season route/progression, stat consistency across substitutions, 24-second violation and out-of-bounds inbounds, starter selection, movement poses, steals, body-check recovery, and full AI match integration |
| `npm run validate:content` | PASS — 35 teams, 105 unique athletes, 35 canonical captains |
| `npm run lint` | PASS — syntax checked source JavaScript modules |
| `npm run build` | PASS — static source copied to `dist/` |
| `npm run preview` + local HTTP checks | PASS — built `index.html` and `src/main.js` both returned HTTP 200 |
| `npm run test:e2e` | PASS — Chromium title, text scaling up to 120% without clipping, saved reduced-flash setting, 35-button franchise grid and captain cards, alternate starter persistence, movement, both quarter-break substitutions, body-check, pass/shoot, pause/resume, shot scoring, split-keyboard movement, dunk scoring, three-basket FIRE activation, five nonhuman matchups, full accelerated 4-period match, rematch/menu, and season win/loss/replay; no page errors or failed requests |
| `npm run simulate:league` | PASS — 100/100 complete within 60,000 ticks; averages 5.03/6.00 points, 11 overtime periods (828,437 total ticks) |

The browser launch required an approved elevated command because the restricted sandbox blocked Chromium's crash-report socket. The test was rerun successfully under that granted execution permission. The benchmark uses 30-second test periods; it is not proof of a full-length user-driven three-minute game.

## Captured browser evidence

- `artifacts/screenshots/title.png`
- `artifacts/screenshots/team-selection-grid.png`
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

The nonhuman matchup screenshots exercise those names and rigs in the match renderer; visual review corrected the wombat body/limbs, reviewed Quirky/Dragon Queen/Suga/GB Design details, and added Alexithymia's noir android body. Deterministic E2E scenarios now assert a dunk release commits exactly 2 points and three made baskets activate FIRE; the actual frames are saved above. No screenshots have been captured for final roster cards.

## Limits

No Edge or Firefox run, manual human playtest, accessibility audit, screenshot review across several browser sizes, performance percentile measurement, or 100 human-vs-CPU full-length game validation was performed. Current known defects are recorded in `KNOWN_ISSUES.md`.
