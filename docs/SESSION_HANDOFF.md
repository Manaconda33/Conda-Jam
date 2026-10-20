# Session handoff

## Current state

- Repository: `/workspace/Conda-Jam`, branch `work`.
- The initial repository was empty apart from a short README. No remote operations, deployment, or push occurred.
- Implemented a standalone no-dependency browser game, full 35-franchise/105-athlete content manifest, 60 Hz core simulation, Canvas projection/renderer, keyboard/gamepad inputs, settings, local sound, practice, rematches, and an eight-opponent Season Run.
- Recent checkpoints add goaltending, a persisted season route, assist/shooting stats, blocks against dunk releases, and tested rim/backboard bank contacts in both directions. Tests/build/content checks and Chromium browser journeys pass, including season win, loss, replay, and split-keyboard movement. Latest gameplay checkpoint is `376c890` (`Add bank-shot scoring off the backboard`); the working tree is clean.
- The latest 100-game benchmark completed 100 matches within 60,000 ticks each: 850,475 total ticks, average 5.31/6.09 points, 17 overtime periods.
- Screenshots are stored in `artifacts/screenshots/`.

## Important gaps

Shoves/knockdowns, substitutions, alternate lineup selection, full league standings/bracket, roster portraits and final pixel-art atlas, full league records, and sound/accessibility polish remain incomplete. Goaltending uses an approximate protected hoop region rather than exact rim collision and is covered by unit tests. See `FEATURE_MATRIX.md` and `KNOWN_ISSUES.md`.

## Single next best work item

Refine rim/backboard collision volumes, improve defensive steal fairness, and continue checking substitution/lineup options against the 2-on-2 format. Keep original team identities and silhouette details intact.

## Resume commands

```sh
cd /workspace/Conda-Jam
npm test && npm run validate:content && npm run lint && npm run build && npm run simulate:league && npm run test:e2e
```

Then start the local browser build with `npm run dev` and open `http://localhost:4173`.
