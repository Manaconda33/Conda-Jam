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
| Body check on defense | L + K | Numpad 3 + 2 |
| Pause / resume | Enter or Esc | Enter or Esc |

Gamepads use the left stick/D-pad, west face button for shoot/block, south face button for pass/steal, and right trigger for turbo/body check. The first connected pad joins as an additional human athlete. Enable **LOCAL 2P** before tipoff for split-keyboard play. Uncontrolled athletes are driven by the CPU.

During a quarter break, press **P** to rotate the home partner with the third roster athlete, or **O** to rotate the away partner. A gamepad user can press the south face button to substitute on their athlete's team. Substitutions preserve each athlete's box-score stats and are also available at halftime.

Choose any two franchises from the complete dropdowns, choose each captain's second starter, select CPU difficulty and quarter length, then tip off. Normal games have four periods, a 24-second shot clock, 2/3-point field goals, overtime on ties, and quick inbounds. Three consecutive makes by the same athlete without a teammate scoring start a fire streak; an opposing basket ends it. Season Run plays an eight-game route against distinct franchises, saves wins locally, advances after each win, and ends on a loss. Practice and sound/display options are also available.

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
- [Quirky and Dragon Queen on court](artifacts/screenshots/court-quirky-dragonqueen.png)
- [Alexithymia and Paprika on court](artifacts/screenshots/court-alexithymia-paprika.png)
- [Dunk release](artifacts/screenshots/dunk-release.png)
- [Active FIRE](artifacts/screenshots/active-fire.png)
- [Quarter-break substitutions](artifacts/screenshots/quarter-break-substitutions.png)
- [Season Run ladder](artifacts/screenshots/campaign-ladder.png)
- [Final box score](artifacts/screenshots/final-boxscore.png)

## Project status

See [docs/FEATURE_MATRIX.md](docs/FEATURE_MATRIX.md), [docs/QA_REPORT.md](docs/QA_REPORT.md), [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md), and [docs/SESSION_HANDOFF.md](docs/SESSION_HANDOFF.md). This is not a claim that every item in the 24-hour master specification is complete.
