# First carrier-shove capture — preserved harness failure

The initial genuine carrier-shove capture used Kraken and Krios at the same court depth. It produced the tick8 push event and loose ball, but Kraken immediately became the nearest catch candidate; the engine switched the animation to `rebound` in the same tick, so the authored push contact frame was skipped. The initial report/captures are preserved here as a failed candidate check.

Correction: after a successful carrier shove, exclude the pusher from loose-ball catch candidates for that single integration tick. Other players remain eligible. This exposes the push contact pose and preserves the loose-ball transition. Regression coverage is in `tests/game-core.test.js`; corrected carrier gameplay evidence is in `../actual-carrier-shove/`.
