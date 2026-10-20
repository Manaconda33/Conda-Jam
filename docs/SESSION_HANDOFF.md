# Session handoff

## Current state

- Repository: `/workspace/Conda-Jam`, active local branch `main`. The current checkpoint includes generated 2D gameplay sprites for all 105 roster athletes and a saved seeded eight-team single-elimination cup. No remote push or deployment occurred.
- The zero-dependency browser game supports 2-on-2 basketball, movement, charge/release shooting, passes and interceptions, dunks, steals/blocks, rebounds, possessions, shot clocks, four regulation quarters, overtime, completed box scores, CPU difficulty, practice, co-op, touch controls, Gamepad API, an eight-game season, league records and player career leaders.
- Generated art includes 35 captain portraits, 35 team crests, 35 full-body captain sprites, and 70 full-body supporting-player sprites. All 105 full-body sprites are mapped into gameplay and the four generated PNG atlases are embedded in `dist/JAMVERSE_96.html`.
- Cup mode draws a seeded field of eight from the 35 teams, deterministically resolves CPU bracket games, plays three rounds against the user's selected franchise, saves results and championship/elimination state, and validates saved data. Preferences migrate from v1 through v4 to v5.

## Latest validation

- `npm test`: 15/15 test files pass, including sprite atlas integrity, a default-length full-match simulation, and cup creation, save validation, advancement, elimination, and championship.
- `npm run lint`: nine JavaScript modules syntax-check.
- `npm run validate:content`: 35 franchises, 105 unique athletes and 35 canonical captains pass.
- `npm run build`: static preview and self-contained HTML build successfully.
- `npm run test:e2e`: Chromium verifies controls, modes, full match, saved cup journey, 35/105 generated artwork mapping, and standalone offline loading.
- `npm run simulate:league`: 100 AI matches completed in the latest 837,884 tick run.

## Remaining production gaps

- Gameplay sprites are original generated images, but each athlete has one pose; per-character multi-frame run, pass, shot, dunk, block, knockdown, idle and celebration atlases remain incomplete. Some canon props and anatomy details need individual visual QA at game scale.
- Practice has a free clock and reset but no guided drills. Third/fourth keyboard player layouts are absent; up to four Gamepad API users work, with physical hardware variants untested.
- Audio is synthesized and has music/effects volume controls, but no crowd layer or captions. Accessibility controls, gamepad remapping, screen-reader announcement coverage, and small-screen gameplay need more review.
- Firefox, Edge, long-run browser performance, and human playtesting have not been run. No TypeScript/Phaser port or deployment was requested.

## Run locally

```sh
cd /workspace/Conda-Jam
npm run dev
```

Open `http://localhost:4173`. For the standalone playable build, open `dist/JAMVERSE_96.html` in a modern browser; Chromium tested the file through a local static server because direct `file://` navigation is restricted in the managed environment.

## Next work

Prioritize full action-state sprite frames, audio captions/crowd ambience, an accessible tutorial/drill, additional keyboard layouts and broad browser/manual/performance review. Preserve and verify the match loop before merging further changes into local `main`.
