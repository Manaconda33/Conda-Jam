# Session handoff

## Current state

- Repository: `/workspace/Conda-Jam`, branch `work`.
- The initial repository was empty apart from a short README. No remote operations, deployment, or push occurred.
- Implemented a standalone no-dependency browser game, content manifest, 60 Hz core simulation, Canvas projection/renderer, keyboard/gamepad inputs, settings, sound effects, local persistence, practice entry point, and season-run menu stub.
- Tests/build/content checks, production preview HTTP checks, and local Chromium browser E2E passed in this session. The source checkpoint is commit `2ca256d` (`Add signature character cues and shot blocks`).
- The 100-game AI benchmark completed all 100 games within 60,000 ticks each after shot timing and AI behavior were tuned.
- Screenshots are stored in `artifacts/screenshots/`.

## Important gaps

Goaltending/contact knockdowns, substitution, three-athlete lineup selection, campaign progress, roster portraits and final pixel-art atlas, complete endgame stats, and sound/accessibility polish remain incomplete. See `FEATURE_MATRIX.md` and `KNOWN_ISSUES.md`.

## Single next best work item

Add goaltending with unit tests first. In `src/core/simulation.js`, identify a descending shot inside the protected hoop cylinder and award the attacker's locked 2/3-point score once when a defender illegally touches it before legal rim contact. Add `tests/game-core.test.js` coverage for rising block, legal rim touch, descending goaltend, and event idempotence; run all checks and the Chromium E2E afterward.

## Resume commands

```sh
cd /workspace/Conda-Jam
npm test && npm run validate:content && npm run lint && npm run build
```

Then start the local browser build with `npm run dev` and open `http://localhost:4173`.
