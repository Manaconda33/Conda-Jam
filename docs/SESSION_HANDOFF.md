# Session handoff

## Current state

- Repository: `/workspace/Conda-Jam`, active branch `work`; local `main` is fast-forwarded through `aec6806`. No remote push or deployment occurred.
- The repository contains a playable zero-dependency browser basketball game and a generated standalone build at `dist/JAMVERSE_96.html`. The standalone file inlines the interface styling and game modules; Chromium loaded it over a local static server with no external requests, loaded all 35 franchises/105 athletes, unlocked music, and started a match.
- The roster includes all 35 canonical captains, 105 named athletes, selectable starters, substitutions, 35 captain portraits with roster ratings, and distinctive procedural court art. The game supports movement, turbo, pass, shoot, dunks, blocks/steals, loose-ball rebounds, scoring, possessions, clock/period rules, overtime, match completion, CPU opponents, local co-op, touch, and Gamepad API controls. Recent core improvements add directional pass poses, timed scoring celebrations, timed pass/steal/rebound/celebration poses, free-clock practice with keyboard/touch ball reset, optional screen shake suppressed by reduced flash, four-made-basket FIRE duration with a fresh streak required to reignite, made-run high-water tracking, dunk/streak box-score columns, and dunk career totals, and turnover/steal attribution for shot-clock violations, pass interceptions, and out-of-bounds play; turnovers appear in the final box score.
- Version 1 settings/season progress and version 2/3 preferences migrate to version 4, adding saved 35-franchise team standings and 105-athlete career totals, with malformed saves and unavailable local storage safely defaulting. Chromium verifies migration, four local humans via keyboard plus three Gamepad API users, four-gamepad-only play, and keyboard fallback after controller disconnect. Physical controller variations remain untested.

## Latest validation

- `npm test`: ten test files pass, including a full AI match using the default 3:00 regulation quarters.
- `npm run lint`: eight JavaScript modules syntax checked.
- `npm run validate:content`: 35 franchises, 105 unique athletes, and 35 canonical captains pass.
- `npm run build`: static preview and self-contained standalone HTML generated.
- `npm run test:e2e`: Chromium journeys pass for save migration, controls, a full default length match, keyboard/touch practice reset, Season Run, saved 35-team league table, career leaders, captain portrait grid, audio/accessibility settings, and standalone offline loading. Restricted sandbox Chromium cannot open its crash-report socket; the successful run used the approved elevated execution.
- The same Chromium suite additionally confirms that canceling the reset preserves saved records and confirming it clears league and career statistics and season progress while preserving settings and key bindings. The browser suite confirms the in-game quit dialog resumes correctly on cancel and exits without saving a partial match on confirmation; it also verifies a lost browser focus pauses play and Enter resumes the same match.
- Latest Chromium suite also checks visible uniform numbers and team W-L labels on franchise cards; the grid screenshot was refreshed to show the new presentation.
- `npm run simulate:league`: latest benchmark completed 100/100 matches, average final scores 4.95/4.85 and eight overtimes (814,538 total ticks) after the timed action-pose updates.

See `FEATURE_MATRIX.md`, `QA_REPORT.md`, and `KNOWN_ISSUES.md` for evidence and remaining limitations.

## Remaining production gaps

- Art is still procedural Canvas rendering rather than the requested complete 105-player atlas with dedicated portraits and all animation states. Key canonical species anatomy and signature traits are represented and exercised, but full visual review is still required.
- Season Run is an eight-game route; standings now record completed non-practice results for all 35 franchises. There is no seeded tournament bracket; the all-time player leader board covers points, assists, rebounds, steals, blocks, turnovers, and games.
- Third/fourth keyboard players are not mapped. Four Gamepad API controllers can take all athlete slots; with fewer pads, available keyboard controls remain active. Physical controller variants, Edge, and Firefox remain untested.
- Audio has a generated loop and effects behind independent music/effects sliders, without a crowd layer or captions. Accessibility settings and reduced flash coverage remain partial.
- Collision/render details, matchup balance, performance percentiles, and human fun/playability review need more validation. See `KNOWN_ISSUES.md` for specifics.

## Resume commands

```sh
cd /workspace/Conda-Jam
npm test && npm run validate:content && npm run lint && npm run build && npm run simulate:league && npm run test:e2e
```

Run `npm run dev` and open `http://localhost:4173` for development. For the self-contained playable file, open `dist/JAMVERSE_96.html` in a modern browser. The test harness could not navigate to a `file://` URL due its Chromium sandbox policy, so direct file-scheme launching was not exercised in this environment.

## Next work

Continue the full animation/art pass and supporting-player portraits, then implement a seeded tournament bracket and review remaining accessibility/audio gaps. Preserve the full playable game, rerun Chromium after each control/render change, update this handoff, and commit reviewable checkpoints on `work` merged into local `main`.
