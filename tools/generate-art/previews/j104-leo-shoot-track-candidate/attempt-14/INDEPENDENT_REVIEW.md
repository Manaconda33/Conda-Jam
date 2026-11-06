# Independent review — J.104 Leo shoot track attempt14

## Verdict: approved for production integration

I reviewed the actual Jam Stage production-path captures in `gameplay/rendered-production-courty95/`: ticks 13, 14, 16, 19, 23, and score completion, for both left/right facings at 100% and 120% zoom. I also checked the accompanying simulation report, capture script, and the registered release profile and `makeShot` implementation.

- The capture report has `candidateReleaseVz: null`, and the capture script only changes release velocity when `Number.isFinite(candidateVz)` is true. No release override was active. Its production release-profile probe reads `0.65` from `sampleBallReleaseVz('shoot','leo')`; `makeShot` obtains its initial vertical velocity from this registered profile. The reported `0.624` at the tick13 snapshot is the post-integration value after the same simulation step applies gravity, rather than an override value.
- In both facings, the tick13 production release has Leo at z2 and the separate ball at height3.65, in `shot` mode with `ownerId: null`, `playerHasBall: false`, and `lastTouch: leo`. The rendered ball contacts the raised fingertips at release. Tick14 visibly clears the hand, followed by separation and a continuous arc through ticks16, 19, and 23.
- The trajectory is advanced by Jam Stage `stepMatch` and production ball integration. There are no release-VZ overrides or post-release ball-coordinate rewrites in this run. Both attempts complete as made shots with score 3–0, and the ball has no owner at score completion.
- At 120% the ball and Leo remain in the court viewport at each sampled tick; Leo's feet are visible at tick23 and score completion. The outcome is consistent at 100%.
- The report records 24 renders across both facings and zoom levels, uses the current generated roster atlas, and reports zero uncaught browser errors.

This review approves the J104 `shoot` track and registered release profile based on the actual production simulation path. It does not attest to any other Leo clip or captain coverage.
