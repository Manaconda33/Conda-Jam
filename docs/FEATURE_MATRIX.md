# Feature matrix

`PASS` means implemented and exercised by an automated test or browser flow. `PARTIAL` means some behavior exists but the prompt's acceptance contract is broader. `NOT TESTED` means no evidence was gathered.

| Requirement | Status | Evidence / gap |
|---|---|---|
| Browser boot, title menu, 35-franchise grid and captain cards | PASS | `npm run test:e2e`; browser asserts 35 grid buttons, captures the grid, selects alternate franchises, and checks the captain card update |
| 35 franchises, 105 unique athlete IDs, 35 captains, no Cleo | PASS | `npm run validate:content`; `tests/content.test.js` |
| Starter selection and between-period substitution from each three-athlete roster | PASS | Pregame lineup selectors plus P/O quarter-break rotation; core test checks active lineup and preserved box score across repeat substitution |
| Character anatomy metadata and selected special silhouettes | PARTIAL | Procedural fox/dragon/cobra/wombat/jaguar/hybrid branches, humanoid limbs, animated run poses, and stature scaling; art is primitive and not fully validated against every canonical feature |
| 2-on-2 match with fixed 60 Hz state | PASS | Simulation integration test and browser game screen |
| Eight-direction movement, sprint/turbo | PASS | Keyboard movement + browser position assertion; stamina bar exists |
| Pass / catch / interception | PASS | `tests/game-core.test.js`; one AI match journey |
| Shot release and 2/3 value fixed at release | PASS | `tests/game-core.test.js` |
| Ballistic shot and unique made-score event | PASS | `tests/game-core.test.js`; clean scores, rim deflections, and bank shots off the backboard work in either direction; collision volumes are still approximate |
| Shooter and box-score stats | PARTIAL | Points, made/attempted FG, made/attempted 3PT, assists, rebounds, steals, and blocks appear in the final results; no fouls, turnovers, minutes, or full league records |
| CPU full four-period match and scoring | PASS | `tests/integration/match.test.js`; 100 AI matches completed in the benchmark run |
| Steal and loose-ball rebound pickup | PARTIAL | Core tests prove close-steal possession changes once, unreachable steals fail, and rebound ownership works; CPU/player balance still needs human playtesting |
| Dunk approach and release | PARTIAL | 2D close turbo approach launches a distance-timed, center-curving dunk; unit and Chromium scenarios assert a valid near/angled dunk scores once. Dunk contact defense and polished multi-frame poses remain incomplete |
| Blocks, goaltending, shoves/knockdowns | PARTIAL | Timed contact deflects jump shots and dunks; goaltending awards the locked score before rim contact; turbo+pass body-checks a nearby off-ball defender with strength-based knockdown and timed recovery. No foul/charge system |
| Period transitions, halftime, tie overtime, final result | PASS | `tests/game-core.test.js` and 4-period integration match |
| Shot clock expiration and out-of-bounds possession | PASS | Unit tests assert one 24-second call, possession change, opponent inbound, shot-clock reset, and last-touch out-of-bounds rule |
| Fire streak and cool-off | PASS | `tests/game-core.test.js`; teammate scoring resets an individual run, opposing basket ends fire |
| Keyboard 1P and 2P split keyboard | PASS | Chromium journey verifies movement for WASD player 1 and Arrow-key player 2; input actions are wired in `src/main.js` |
| Gamepad movement, action buttons, pause/resume, hot-plug fallback | PASS | Mock Gamepad API Chromium journey verifies movement, Start toggling, unplug-to-CPU fallback, and reconnect reassignment; physical pads and 3P/4P remain unverified |
| Practice mode | PARTIAL | Starts an extended-clock match; no ball reset or guided practice menu |
| Season/tournament progression | PARTIAL | Eight-game route picks distinct league opponents, advances after wins, ends on loss, persists locally; single-elimination route is covered in Chromium. No league-wide standings or tournament bracket |
| Local save/settings and blocked storage fallback | PARTIAL | Defensive settings persistence exists; migration and full records/progress schema absent |
| Accessibility: keyboard controls, settings labels, text scale, reduced flash | PARTIAL | P1/P2 movement and action keys can be rebound with saved settings; 90–120% UI zoom stays on-screen at maximum, and reduced-flash stops crowd twinkle. Captions, colorblind overlays, full flash/motion limits, and gamepad remapping remain absent |
| Local generated audio | PARTIAL | Procedural tones for action/events; no music loop, chants, independently persisted volume verification |
| TypeScript/lint/full asset validation | FAIL | JS syntax check only; no TypeScript, asset paths/portrait files/atlas validator |
| Chromium acceptance journeys/screenshots | PASS | `tools/e2e_smoke.py`; no uncaught errors or failed requests in tested flow |
| Firefox and Edge | NOT TESTED | No browser run |
| Narrow-screen menu / team selection | PARTIAL | Chromium tests 390×844 cabinet bounds and 35-team grid selection; gameplay canvas and settings dialog still need small-screen review |
| Sustained FPS/frame percentile or 720p/1080p benchmarking | NOT TESTED | No performance telemetry yet |
| Deployment/GitHub Pages | NOT TESTED | No deployment requested or performed |
