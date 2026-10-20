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

The world uses x along court length, y across court depth, and z for height. The rendered x camera follows the ball and players are painter-sorted by ground y. This is a functional projection, not yet an authentic wide camera track or a complete arena collision model.

## Running and building

`npm run dev` serves the source at port 4173. `npm run build` copies the static files into `dist`; `npm run preview` serves that folder. The server handles local files only. GitHub Pages base-path behavior has not been verified.
