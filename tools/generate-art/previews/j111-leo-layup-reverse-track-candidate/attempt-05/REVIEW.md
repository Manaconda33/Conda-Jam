# J111 Leo `layup-reverse` track attempt 05 review

## Verdict: accepted candidate track

Attempt 05 was rendered on the current Jam Stage through the normal production canvas. It contains 40 captures: simulation ticks 0, 2, 5, 7, 10, 11, 12, 13, 17, and 20; both facing directions; and 100%/120% camera zoom. The browser reported no uncaught errors, the game is not paused, Leo is centered as the sole rendered athlete, and the separate basketball remains visible.

The capture harness injects this candidate into the served `src/core/animation.js` response after the existing Leo track initialization. No runtime, manifest, or other production source file was changed. The initial setup creates a single-player diagnostic match with the `layup-reverse` shot action already initialized because y=90 is outside `queueShot`'s close-range selection condition; after that one-time fixture, production `stepMatch` owns every animation and ball update.

Candidate track:

- Height: `[0.40, 1.61, 1.98, 2.60, 2.65, 2.65, 1.45, 0.84]`
- Forward: `[5.85, 6.58, 4.02, 4.50, 5.50, 6.80, 6.58, 5.85]`

Visual review found the carried ball follows the changing hand position from the gather through the high reverse finish. The frame 4/tick 10–11 ball meets the raised hand, and frame 5/tick 12 releases at the extended fingertips in both facings. The mirrored captures preserve the contact point; no facing-specific override was needed.

Gameplay state confirms correct ownership and timing in each facing: Leo has the ball through tick 11; at tick 12 the animation reaches frame 5, Leo no longer owns the ball, and the separate ball enters `shot` mode with `ownerId: null`. The ball continues on the simulation trajectory after release. The asset remains outside the production manifest until its full integration review.

Representative evidence: `native/actual-right-tick05-zoom120.png`, `native/actual-right-tick07-zoom120.png`, `native/actual-right-tick11-zoom120.png`, `native/actual-right-tick12-zoom120.png`, `native/actual-left-tick11-zoom120.png`, `native/actual-left-tick12-zoom120.png`, plus the complete 40-capture grid and `native/report.json`.

## Gameplay-flight follow-up: passed

The separate `gameplay/` evidence advances the same candidate through the real production shot path until score completion. The fixture initializes one `layup-reverse` shot action at x=100,y=90, then calls `stepMatch` continuously; no ball positions are teleported after setup. `gameplay/report.json` stores 436 per-step ownership/status records and 64 native Jam Stage screenshots across both facings and both zoom values.

Ownership stays with Leo through every simulation step before tick 12. At tick 12, the action reaches frame 5, `hasBall` becomes false, the ball owner clears, and the ball enters `shot` mode. The simulation then carries the ball through the hoop and completes the score at tick 108 in both directions:

- Facing right: target hoop x=188.8298, final score `[3, 0]`, scorer event `Leo scores 3!`.
- Facing left: target hoop x=11.1702, final score `[0, 3]`, scorer event `Leo scores 3!`.

Both directions have `fga=1`, `fgm=1`, and scored ball mode `dead`; there is no rebound or fallback. The exact same candidate runtime track is used in both facing tests. The mirrored track correctly moves the release hand opposite the player's orientation while the gameplay shot still targets the basket the player is attacking.

This gameplay result confirms the visual track acceptance above. It is evidence from the one-player diagnostic match, not yet a runtime/manifest registration test.

The first two-facing gameplay run reused `scoredAttempts` while resetting the diagnostic match's `nextAttempt`, causing the second fixture to reuse `shot-1` and fail duplicate-score protection. The capture fixture was corrected to reset `scoredAttempts` along with score and attempt counters, then all four facing/zoom runs were repeated. The final report above is from that corrected run; the apparent miss was a test-fixture state leak, not a gameplay track defect.
