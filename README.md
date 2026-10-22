# JAMVERSE '96 — Legends of the Hardwood

An original browser basketball game built around the 35-franchise JAMVERSE character league. It uses a deterministic 60 Hz JavaScript simulation and a pixel-scaled 4:3 Canvas renderer. The current build is an early playable release: movement, shots, passes, steals, rebounds, scoring, periods, overtime, and match results are implemented; see the feature matrix for the exact limits.

## Play

**[Play the hosted JAMVERSE ’96 preview](https://manaconda33.github.io/Conda-Jam/)** · **[Open the self-contained offline game](https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html)**

The live preview is deployed from `main` by GitHub Actions. The self-contained link opens the same game from one HTML file.

From this folder, run:

```sh
npm run dev
```

Open **http://localhost:4173** in Chrome, Edge, or Firefox. The project has no npm dependencies and the game loads without network assets. To use a production copy instead:

```sh
npm run build
npm run preview
```

For a standalone, offline copy, run `npm run build` and open `dist/JAMVERSE_96.html` directly in a modern browser. It contains the styles and game code in the same file and makes no external asset requests.

**[Play the self-contained JAMVERSE ’96 build](dist/JAMVERSE_96.html)**

## Controls

| Action | Player 1 | Player 2 |
|---|---|---|
| Move | WASD | Arrow keys |
| Shoot / block | J (hold, then release to charge) | Numpad 1 |
| Pass / steal | K | Numpad 2 |
| Turbo | L | Numpad 3 |
| Body check on defense | L + K | Numpad 3 + 2 |
| Pause / resume | Enter or Esc | Enter or Esc |

Touch devices show a hold-to-move D-pad and shoot, pass, and turbo buttons beneath the court. A shot charges while held and releases when you lift your finger. Gamepads use the left stick or D-pad to move, west face for shoot/block, south face for pass/steal, right trigger for turbo/body check, and Start to pause/resume. **Settings → Map gamepad action buttons** changes those four button assignments for every connected pad; defaults are 2 (west), 0 (south), 7 (right trigger), and 9 (Start). Up to four pads may join; when four connect, they control all four athletes, and disconnects return unclaimed athletes to CPU or configured keyboard control. **Settings → Rebind keyboard controls** changes P1/P2 movement and action keys; both keyboard and gamepad changes save on this device. **Team shape markers** adds color-independent H/A symbols above players. **Reset saved records** clears the season, franchise standings, and career totals after a confirmation; it preserves settings and controls. Enable **LOCAL 2P** before tipoff for split-keyboard play. Uncontrolled athletes are driven by the CPU.

During a quarter break, press **P** to rotate the home partner with the third roster athlete, or **O** to rotate the away partner. A gamepad user can press the south face button to substitute on their athlete's team. Substitutions preserve each athlete's box-score stats and are also available at halftime.

**LOCAL 2P** assigns Player 2 to the away team. Add **TEAMMATE CO-OP** to assign both keyboard players to the selected home pair while the away team stays CPU controlled. This option is available only with Local 2P enabled.

Choose any two franchises from the 35-team grid or dropdowns, choose each captain's second starter, select CPU difficulty and quarter length, then tip off. Rookie CPU shoots less often and has lower accuracy; Legend extends its shooting range and improves shooting, passing, steals, and blocks. Normal games have four periods, a 24-second shot clock, 2/3-point field goals, overtime on ties, and quick inbounds. Three consecutive makes by the same athlete without a teammate scoring start a fire streak; an opposing basket ends it, and it expires after four more made baskets by that player. Season Run plays an eight-game route against distinct franchises, saves wins locally, advances after each win, and ends on a loss. Settings separately save music and effects levels, optional score/dunk screen shake, reduced crowd twinkle, UI scaling from 90–120%, and color-independent team markers. Practice mode has free-running clocks; press **R** on keyboard, or **RESET** on touch, to restore the ball to the selected player. Use **QUIT TO MENU** to return to franchise selection; active games ask for confirmation and can be resumed by choosing **KEEP PLAYING**. Completed non-practice games update the 35-team league table and an all-time player leader board, saved locally. Each franchise card shows its generated captain portrait and team crest, all three athlete names, numbers and OVRs, current team W-L, and all category ratings on focus.

## Development checks

```sh
npm test
npm run validate:content
npm run lint
npm run build
npm run test:e2e
```

`npm run test:e2e` launches local Chromium through Playwright and writes screenshots to `artifacts/screenshots/`. The game uses generated original 2D art for all 35 captain portraits, all 35 franchise crests, and full-body gameplay sprites for all 105 athletes (`public/assets/`). Gameplay sprites use live world-position, depth, and action motion; ball physics, courts, shadows, and score effects are rendered by Canvas, with WebAudio tones and an original repeating chiptune loop. Play a one-off match, Practice, an eight-game Season Run, or the seeded eight-team Jam Cup. Supporting athletes get deterministic hair, skin, hairstyle, uniform, and court-gear variations; no historical source or game assets are included. The implementation intentionally uses zero runtime dependencies; it is plain JavaScript rather than the TypeScript/Phaser preference in the master specification, and is documented as an architecture tradeoff in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Screenshots

- [Title and team selection](artifacts/screenshots/title.png)
- [35-franchise selection grid](artifacts/screenshots/team-selection-grid.png)
- [Dragon Queen captain card](artifacts/screenshots/captain-dragon-queen.png)
- [Paprika, Suga, Steeb, GB Design and Quirky captain cards](artifacts/screenshots/captain-emberwood-kits.png)
- [Manaconda captain card](artifacts/screenshots/captain-manaconda.png)
- [Keeg captain card](artifacts/screenshots/captain-keeg.png)
- [Krios captain card](artifacts/screenshots/captain-krios.png)
- [E. Indigo captain card](artifacts/screenshots/captain-e-indigo.png)
- [E. Indigo canon face card](artifacts/screenshots/captain-e-indigo-card.png)
- [Avek captain card](artifacts/screenshots/captain-avek.png)
- [Dea captain card](artifacts/screenshots/captain-dea.png)
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
