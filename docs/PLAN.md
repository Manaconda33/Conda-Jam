# Implementation plan and checkpoint

The user's attached master prompt is the authoritative feature scope. The user also asked for implementation to start immediately; this file records the execution sequence and current evidence.

| Milestone | State | Evidence |
|---|---|---|
| 1. Bootable browser slice, movement, ball possession and court | Implemented / exercised | Chromium E2E and `court-chicago-crownfire.png` |
| 2. Pass, shot, scoring, steals, rebounds, clock/periods, overtime and defensive inbounds | Implemented / exercised in simulation; balance partial | `tests/game-core.test.js`, `tests/integration/match.test.js`; violation and out-of-bounds awards tested |
| 3. Complete league manifest, original character-specific silhouettes | Data implemented; art partial | Content validator passes 35 teams / 105 athletes; four team matchup screenshots |
| 4. UI, animation, sound and accessible controls | Partial | Canvas animation and generated tones present; no atlas/voice/music, remapping/settings incomplete |
| 5. Practice, campaign, save and local multiplayer | Partial | Practice and local keyboard/controller input paths exist; campaign progression and 3P/4P not completed |
| 6. Broad browser acceptance, performance and historical verification | Partial | Chromium journey and a 100-match AI simulation run; no Firefox/Edge, sustained FPS benchmark, or source archive review |

## Critical path

Keep the simulation deterministic and testable; next improve species-specific pixel rigs and roster cards while capturing and reviewing actual action frames. Then add campaign standings and complete options/accessibility without breaking the tested match loop.

## Constraints and assumptions

The repository was empty except for its initial README. There were no installed project packages, but local Node 24, npm 11, system Chromium, and Python Playwright were available. Browser launch required the approved command permission because the sandbox blocks Chromium's crash-report socket. No remote repository operations or deployments were made.
