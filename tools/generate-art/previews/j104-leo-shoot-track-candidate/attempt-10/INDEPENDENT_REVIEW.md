# Independent review — J.104 Leo shoot track attempt10 candidate03

## Verdict: approved for calibration integration

I reviewed the candidate's actual Jam Stage gameplay renders and simulation report at `candidate-03/gameplay/rendered-courty95/`, including both left/right facings at 100% and 120% zoom for ticks 13, 14, 16, 19, 23, and score completion.

- The release boundary is consistent in both facings: at tick13 the player is at z2, the ball is at height3, mode is `shot`, ownership is cleared, and `lastTouch` remains Leo. The rendered release image places the ball against the raised shooting hand/fingers. Tick14 shows it clearing the hand; ticks16 and later show separation along a continuous arc.
- The carried-ball track remains symmetric in athlete-relative space: H `[0.95,1.1,2.1,2.1,2.2,2.5,2.3,2.7,2.1,1.05]`, F `[6,7,6.5,4,3,4,4,4,6.5,5.5]`. The simulation report records the expected opposite-side launch velocities for mirrored facings and keeps Leo as last touch.
- The trajectory is advanced by `stepMatch`/`integrateBall` after the actual release. No post-release coordinate samples are assigned. Both shots reach score completion at 3–0 with no remaining owner; each report lists `made: true`.
- At 120%, Leo's full body, feet, and the ball remain inside the gameplay viewport in the tick23 and score-complete captures. The failed earlier courtY90 framing is separate evidence and is not the chosen candidate. Candidate03 is at courtY95.
- The report records 24 actual gameplay captures and zero uncaught browser errors. The visible player uses the current generated roster atlas.

This review accepts the ball-track calibration only. It does not approve or register source art, modify the captain clip manifest, or assert unrelated clip coverage. No implementation files were changed during this review.
