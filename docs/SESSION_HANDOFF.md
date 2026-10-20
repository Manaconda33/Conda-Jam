# Session handoff

## Current state

- Repository: `/workspace/Conda-Jam`, branch `work`; local `main` was created from `origin/main` and fast-forwarded through `ae92099` before the current canonical roster guard. No remote push occurred.
- The initial repository was empty apart from a short README. No remote operations, deployment, or push occurred.
- Implemented a standalone no-dependency browser game, full 35-franchise/105-athlete content manifest, 60 Hz core simulation, Canvas projection/renderer, keyboard/gamepad inputs, settings, local sound, practice, rematches, and an eight-opponent Season Run.
- Recent checkpoints add goaltending, a persisted season route, assist/shooting stats, blocks against dunk releases, rim/backboard bank contacts in both directions, saved starter selection, humanoid run/action poses, corrected 2D dunk approach/release paths, turbo body-check knockdowns, between-period substitutions with stat retention, corrected defensive inbounds, canonical species anatomy updates, a 35-franchise chooser with captain cards, saved 90–120% UI zoom/reduced-flash settings, Gamepad API movement/Start pause-resume, saved P1/P2 keyboard rebinding with live control hints, disconnect fallback/reconnect assignment to CPU/humans, 390×844 team-selection checks, held-shot charging with a timing-window accuracy bonus, same-team keyboard co-op, franchise-specific court branding, CPU difficulty profiles, seed-based supporting-athlete visual variety, canonical captain/on-court art details, and hardened roster validation. Latest validator checkpoint is `6c63b20` (`Harden franchise roster content validation`).
- Latest validation: `npm test` passed six files, `npm run lint`, `npm run validate:content`, and `npm run build` passed. Chromium E2E passed including desktop and touch matches plus opening `dist/JAMVERSE_96.html`, confirming 35 franchises/105 athletes and tipoff with no external asset requests. The 100-match benchmark completed 100/100 within 60,000 ticks (805,840 total ticks; average scores 4.51/4.76; six overtimes). The standalone build feature is the current uncommitted checkpoint and should be committed and fast-forward merged to local `main`; no remote push occurred.
- Checkpoint `ce7ddfb` adds original nonhuman body silhouettes to Paprika, Dragon Queen, Suga, Steeb, GB Design and Quirky captain cards; its selected artwork screenshots are saved and that feature is merged into local `main`.
- All 35 captain-card updates are exercised in Chromium. Signature details were added for key human captains; screenshot checks cover Manaconda, Keeg, Krios, E. Indigo, Avek and Dea. The 70 game-only supporting athletes receive stable seed-based skin, hair, hairstyle and uniform variations; selected captain face details also draw on court. Checkpoint `6c63b20` strengthens validation of duplicate roster names/numbers/seeds, missing presentation, unsupported rigs and malformed skill vectors; invalid fixtures exercise those failures.
- Screenshots are stored in `artifacts/screenshots/`.

## Important gaps

Full league standings/bracket, roster portraits and final pixel-art atlas, more complete sound/accessibility polish, and broader 1–4 player input coverage remain incomplete. Fouls/free throws are intentionally excluded by the prompt's arcade law, but body-check balance is not tuned. Knockdowns do not appear in the box score. Goaltending and rim/backboard contact use approximate regions rather than exact geometry and are covered by unit tests. See `FEATURE_MATRIX.md` and `KNOWN_ISSUES.md`.

## Single next best work item

Continue building a fuller animation atlas and dedicated supporting-athlete portrait art. Follow with settings/save migration and accessibility refinements. Preserve canonical features and rerun Chromium after each pass. Latest full suite status is in `QA_REPORT.md`.

## Resume commands

```sh
cd /workspace/Conda-Jam
npm test && npm run validate:content && npm run lint && npm run build && npm run simulate:league && npm run test:e2e
```

Then start the local browser build with `npm run dev` and open `http://localhost:4173`.

The production preview was last started with `npm run preview` and served the built `dist/` page and bundle with HTTP 200 on `http://localhost:4173`. That local process may not survive session replacement; run the resume commands and restart `npm run dev` if the URL stops responding.
