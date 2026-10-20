# Session handoff

## Current state

- Repository: `/workspace/Conda-Jam`, branch `work`.
- The initial repository was empty apart from a short README. No remote operations, deployment, or push occurred.
- Implemented a standalone no-dependency browser game, full 35-franchise/105-athlete content manifest, 60 Hz core simulation, Canvas projection/renderer, keyboard/gamepad inputs, settings, local sound, practice, rematches, and an eight-opponent Season Run.
- Recent checkpoints add goaltending, a persisted season route, assist/shooting stats, blocks against dunk releases, rim/backboard bank contacts in both directions, saved starter selection, humanoid run/action poses, and corrected 2D dunk approach/release paths. Tests/build/content checks and Chromium browser journeys pass, including alternate starter selection, season win/loss/replay, and split-keyboard movement. Latest gameplay checkpoint is `f9830ce` (`Correct dunk approach and curve releases`); the working tree is clean.
- The latest 100-game benchmark completed 100 matches within 60,000 ticks each: 850,661 total ticks, average 5.39/6.21 points, 17 overtime periods.
- Screenshots are stored in `artifacts/screenshots/`.

## Important gaps

Shoves/knockdowns, substitutions, full league standings/bracket, roster portraits and final pixel-art atlas, full league records, and sound/accessibility polish remain incomplete. Captain-plus-partner selection is implemented; bench rotation is not. Goaltending and rim/backboard contact use approximate regions rather than exact geometry and are covered by unit tests. See `FEATURE_MATRIX.md` and `KNOWN_ISSUES.md`.

## Single next best work item

Improve defensive steal fairness and explore in-match substitutions within the 2-on-2 format. Continue filling the canonical character silhouettes with distinctive sprite details. Keep original identities intact.

## Resume commands

```sh
cd /workspace/Conda-Jam
npm test && npm run validate:content && npm run lint && npm run build && npm run simulate:league && npm run test:e2e
```

Then start the local browser build with `npm run dev` and open `http://localhost:4173`.
