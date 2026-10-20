# JAMVERSE '96 — Legends of the Hardwood

An original browser basketball game built around the 35-franchise JAMVERSE character league. It uses a deterministic 60 Hz JavaScript simulation and a pixel-scaled 4:3 Canvas renderer. The current build is an early playable release: movement, shots, passes, steals, rebounds, scoring, periods, overtime, and match results are implemented; see the feature matrix for the exact limits.

## Play

From this folder, run:

```sh
npm run dev
```

Open **http://localhost:4173** in Chrome, Edge, or Firefox. The project has no npm dependencies and the game loads without network assets. To use a production copy instead:

```sh
npm run build
npm run preview
```

## Controls

| Action | Player 1 | Player 2 |
|---|---|---|
| Move | WASD | Arrow keys |
| Shoot / block | J | Numpad 1 |
| Pass / steal | K | Numpad 2 |
| Turbo | L | Numpad 3 |
| Pause / resume | Enter or Esc | Enter or Esc |

Gamepads use the left stick/D-pad, west face button for shoot/block, south face button for pass/steal, and right trigger for turbo. The first connected pad joins as an additional human athlete. Enable **LOCAL 2P** before tipoff for split-keyboard play. Uncontrolled athletes are driven by the CPU.

Choose any two franchises from the complete dropdowns, select CPU difficulty and quarter length, then tip off. Normal games have four periods, a 24-second shot clock, 2/3-point field goals, overtime on ties, and quick inbounds. Three consecutive makes by the same athlete without a teammate scoring start a fire streak; an opposing basket ends it. Practice, options, a saved eight-opponent Season Run entry point, and rematches from the result screen are available to varying levels of completeness.

## Development checks

```sh
npm test
npm run validate:content
npm run lint
npm run build
npm run test:e2e
```

`npm run test:e2e` launches local Chromium through Playwright and writes screenshots to `artifacts/screenshots/`. The renderer uses original programmatic Canvas sprite shapes, court drawing, and WebAudio tones. No historical source or game assets are included. The implementation intentionally uses zero runtime dependencies; it is plain JavaScript rather than the TypeScript/Phaser preference in the master specification, and is documented as an architecture tradeoff in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Screenshots

- [Title and team selection](artifacts/screenshots/title.png)
- [Chicago Condas vs Crownfire Sovereigns](artifacts/screenshots/court-chicago-crownfire.png)
- [Emberwood Kits vs Venom Delta Fangs](artifacts/screenshots/court-kits-fangs.png)
- [Stripewood Longarms vs Lantern Hollow Wombats](artifacts/screenshots/court-longarms-wombats.png)
- [Final box score](artifacts/screenshots/final-boxscore.png)

## Project status

See [docs/FEATURE_MATRIX.md](docs/FEATURE_MATRIX.md), [docs/QA_REPORT.md](docs/QA_REPORT.md), [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md), and [docs/SESSION_HANDOFF.md](docs/SESSION_HANDOFF.md). This is not a claim that every item in the 24-hour master specification is complete.
