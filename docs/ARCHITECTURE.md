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

The world uses x along court length, y across court depth, and z for height. The default rendered x camera follows the ball and players are painter-sorted by ground y. Issue #4's review stage is available only with `?stagePreview=1`; its 480×360 projection maps y=0–100 into a 234px / 65% ground band, shears the north–south basis for arcade perspective, and shows half the court length at midcourt. The stage camera keeps that view azimuth stable during each attack pan. Existing 78px human sprites are normalized by visible alpha occupancy in each athlete's authored `idle-ball` clip, then scaled from .84 at the far sideline to 1.0 at the near sideline; the floor expansion does not enlarge standing athletes. Towering nonhumans retain a 1.4× stage multiplier and the in-flight ball is 19px wide. Revision 10 projects the board parallel to the baseline at 12.63% of screen width and places the 12-world-unit stanchion foot beyond the endline. The measured assembly is 32.0% W × 61.8% H. The preview enlarges and details the stage floor and provides an attacker-follow pan/zoom on dunk clips; portrait remains gated on owner review. The default camera and renderer remain unchanged outside the opt-in preview. Reed's shared shot ball track places his released ball at his authored hand and also changes his gameplay release positioning.

## Running and building

`npm run dev` serves the source at port 4173. `npm run build` copies the static files into `dist`; `npm run preview` serves that folder. The server handles local files only. GitHub Pages base-path behavior has not been verified.
