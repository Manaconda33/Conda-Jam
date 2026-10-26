# Architecture

## Chosen path

The project uses plain JavaScript modules, a fixed-step simulation in `src/core/simulation.js`, locally generated team content in `src/content/teams.js`, and a Canvas 2D renderer/input loop in `src/main.js`. The renderer draws to a fixed 480×360 buffer and CSS scales it with nearest-neighbor filtering. Local HTML dialogs form the menu and settings layer. State persistence is a versioned, defensive `localStorage` wrapper.

The master prompt preferred Vite + TypeScript + Phaser 3. This first implementation deliberately avoids installing a large framework in an empty repository: no package cache or project dependencies were present, while the requested goal prioritizes an immediately runnable local game. A small Node server/build-copy script keeps the source and production preview self-contained. The trade-off is that physics, depth sorting, camera, sprites, and input integration are custom code and do not receive TypeScript's static checking or Phaser's mature collision/audio/animation tools. There are no external asset requests.

## Simulation boundaries

- `createMatch` owns the seed, teams, player state, ball state, clock, and events.
- `stepMatch` is authoritative and advances one 1/60-second frame. AI frames are generated for any athlete not claimed by input.
- `commitScore` is the only score-writing function and keys idempotence by attempt ID.
- `main.js` maps keyboard/gamepad data to input frames, runs a bounded rAF accumulator, and renders projections independently of game state.
- `teams.js` contains all captain plus two game-only supporting athletes and a content validator.

The world uses x along court length, y across court depth, and z for height. The default rendered x camera follows the ball and players are painter-sorted by ground y. An Issue #4 staging prototype is available only with `?stagePreview=1`; its 480×360 projection maps y=0–100 into a 208px ground band, narrows the far sideline to 94% of near width, and shows half the court length at midcourt. It scales the existing 78px human sprite render to a 2.05× near baseline, normalized against maximum visible alpha occupancy in the athlete's authored `idle-ball` clip, then eases that to .84 at the far sideline. Towering nonhumans retain a 1.4× stage multiplier. The in-flight ball is 19px wide. In the current stage review candidate, each hoop's rim and backboard project from separate court anchors; the stanchion foot sits nearer the foreground and is depth-sorted separately. See [ISSUE_4_STAGE_PREVIEW.md](ISSUE_4_STAGE_PREVIEW.md) for measured captures, source references, the remaining portrait gate, and review limits. The default renderer and simulation remain unchanged by the preview.

## Running and building

`npm run dev` serves the source at port 4173. `npm run build` copies the static files into `dist`; `npm run preview` serves that folder. The server handles local files only. GitHub Pages base-path behavior has not been verified.
