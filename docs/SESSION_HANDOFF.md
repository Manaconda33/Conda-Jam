# Session handoff

## Current state

- Repository: `/workspace/Conda-Jam`, branch `work`.
- The initial repository was empty apart from a short README. No remote operations, deployment, or push occurred.
- Implemented a standalone no-dependency browser game, full 35-franchise/105-athlete content manifest, 60 Hz core simulation, Canvas projection/renderer, keyboard/gamepad inputs, settings, local sound, practice, rematches, and an eight-opponent Season Run.
- Recent implementation adds rules-tested goaltending and a persisted season route. Tests/build/content checks and the Chromium browser journey passed, including a completed season match and saved advancement. Latest source checkpoint before these changes is `2767a3d` (`Sync built bundle and resume handoff`); changes after it are currently uncommitted.
- The 100-game AI benchmark completed 100 matches within 60,000 ticks each: 854,176 total ticks, average 4.93/5.75 points, 18 overtime periods.
- Screenshots are stored in `artifacts/screenshots/`.

## Important gaps

Shoves/knockdowns, substitutions, alternate lineup selection, full league standings/bracket, roster portraits and final pixel-art atlas, complete endgame stats, and sound/accessibility polish remain incomplete. Goaltending is an approximation using a protected hoop region and is covered by unit tests. See `FEATURE_MATRIX.md` and `KNOWN_ISSUES.md`.

## Single next best work item

Exercise season loss/replay behavior in Chromium. Improve defensive steal fairness and consider replacing the approximate no-rim shot path with explicit rim/backboard contacts after preserving deterministic scoring. Keep original team identities and silhouette details intact.

## Resume commands

```sh
cd /workspace/Conda-Jam
npm test && npm run validate:content && npm run lint && npm run build && npm run simulate:league && npm run test:e2e
```

Then start the local browser build with `npm run dev` and open `http://localhost:4173`.
