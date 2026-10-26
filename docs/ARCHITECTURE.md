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

The world uses x along court length, y across court depth, and z for height. The default rendered x camera follows the ball and players are painter-sorted by ground y. Issue #4's review stage is available only with `?stagePreview=1`; its 480×360 projection maps y=0–100 into a 260px / 72.2% ground band, shows 50.0% / 51.5% / 53.2% of court length at near/mid/far depth, and draws the centered midcourt stripe vertically while retaining perspective on other court edges. The stage camera keeps that view azimuth stable during each attack pan. Existing 78px human sprites are normalized by visible alpha occupancy in each athlete's authored `idle-ball` clip, then scaled from .84 at the far sideline to 1.0 at the near sideline; the floor expansion does not enlarge standing athletes. Towering nonhumans retain a 1.4× stage multiplier and the in-flight ball is 19px wide. Revision 15 projects the 13.16%-wide board parallel to the baseline and places the 42.44px rim 2.79px across it; the stanchion foot is 12 world units out. The assembly measures 32.64% W × 63.95% H. The preview provides fixed takeoff shadows, vertical jump lift, and an attacker-follow pan/zoom on dunk clips. Default projection, gameplay, and renderer remain unchanged outside the opt-in preview. Reed's shared shot ball track still aligns gameplay release with his authored hand.

## Running and building

`npm run dev` serves the source at port 4173. `npm run build` copies the static files into `dist`; `npm run preview` serves that folder. The server handles local files only. GitHub Pages base-path behavior has not been verified.
