# Session handoff

## Current state

- Repository: `/workspace/Conda-Jam`, branch `work`.
- The initial repository was empty apart from a short README. No remote operations, deployment, or push occurred.
- Implemented a standalone no-dependency browser game, full 35-franchise/105-athlete content manifest, 60 Hz core simulation, Canvas projection/renderer, keyboard/gamepad inputs, settings, local sound, practice, rematches, and an eight-opponent Season Run.
- Recent checkpoints add goaltending, a persisted season route, assist/shooting stats, blocks against dunk releases, rim/backboard bank contacts in both directions, saved starter selection, humanoid run/action poses, corrected 2D dunk approach/release paths, turbo body-check knockdowns, between-period substitutions with stat retention, corrected defensive inbounds, canonical species anatomy updates, a 35-franchise chooser with captain cards, saved 90–120% UI zoom/reduced-flash settings, Gamepad API movement/Start pause-resume, saved P1/P2 keyboard rebinding with live control hints, disconnect fallback/reconnect assignment to CPU/humans, 390×844 team-selection checks, and held-shot charging with a timing-window accuracy bonus. The previous checkpoint is `491adb7` (`Update reconnect validation handoff`); held-shot changes are currently uncommitted.
- The latest 100-game benchmark completed 100 matches within 60,000 ticks each: 828,437 total ticks, average 5.03/6.00 points, 11 overtime periods. E2E verifies 35/105 content, all 35 team-picker entries, captain card updates, maximum 120% zoom without clipping, saved reduced-flash settings, persisted keyboard rebinding and matching hints, keyboard/gamepad movement, Start pause-resume, disconnect/reconnect and 390×844 team selection, held-shot charge/release with one attempt, both substitutions, nonhuman matchups, a two-point dunk, a three-make FIRE streak, quarter-break and campaign screens, full short games and season progression; no page errors or failed requests.
- Screenshots are stored in `artifacts/screenshots/`.

## Important gaps

Full league standings/bracket, roster portraits and final pixel-art atlas, more complete sound/accessibility polish, and broader 1–4 player input coverage remain incomplete. Fouls/free throws are intentionally excluded by the prompt's arcade law, but body-check balance is not tuned. Knockdowns do not appear in the box score. Goaltending and rim/backboard contact use approximate regions rather than exact geometry and are covered by unit tests. See `FEATURE_MATRIX.md` and `KNOWN_ISSUES.md`.

## Single next best work item

Build distinctive supporting-athlete portraits and a fuller animation atlas, then expand the eight-game Season Run into standings/bracket progression. Preserve canonical species and rerun Chromium after each pass. The current charge behavior was validated in Chromium; the complete suite passed on 2026-10-20.

## Resume commands

```sh
cd /workspace/Conda-Jam
npm test && npm run validate:content && npm run lint && npm run build && npm run simulate:league && npm run test:e2e
```

Then start the local browser build with `npm run dev` and open `http://localhost:4173`.

The production preview was last started with `npm run preview` and served the built `dist/` page and bundle with HTTP 200 on `http://localhost:4173`. That local process may not survive session replacement; run the resume commands and restart `npm run dev` if the URL stops responding.
