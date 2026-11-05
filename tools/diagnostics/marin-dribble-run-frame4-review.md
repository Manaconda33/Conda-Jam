# Marin Dusk: frame-4 turbo-dribble horizontal contact checkpoint

**Status:** Measured visual discrepancy; no production/source calibration approved.  
**Source:** [GitHub Actions run 42083382393](https://github.com/Manaconda33/Conda-Jam/actions/runs/42083382393), artifact `marin-action-driven-normal-loader` (artifact ID `13442402461`), `report.json`.  
**Exact combined inputs:** main `7e700c0eb392800794167007e076c51ac8357a77`; PR #6 `55a2ab104d6b108cc08132fddc01b32afb958e75`; PR #7 `97119d54fd24c442c15192a798cae1e8a279eb1d`.

## One selected pose, both facings

- Athlete: `marin-dusk`. Visual donor remains `juniper-vale`, selected registered atlas `./public/assets/animation/juniper-vale-dribble-run-right.webp`. Left-facing display uses approved mirroring.
- Scenario: game-driven `dribble-run`, screenshot `step09`, simulation `tick=8`, selected atlas `frame=4`, zoom **120%**.
- Recorded world track for **both** facings: `forward=12.0`, `height=0.25`; the ball is near court level, so visible *vertical* separation from the hand is an intentional part of the bounce.
- Visual measurements on the 842×632 canvas screenshots (hand landmark manually estimated, not computer-vision ground truth):

| Facing | Ball center, approx. px | Extended-hand center, approx. px | Horizontal separation, approx. |
| --- | --- | --- | --- |
| Right | (492, 459) | (435, 424) | 57 px ahead |
| Left | (350, 459) | (408, 424) | 58 px ahead |

**Exact screenshot SHA-256 values** from the artifact report:

- Right: `1300ab1e1eea5119fb139d0994f70f51c916cac39a2ecfbfe90b8cc92f6fdf3f`
- Left: `5c6a4be7f65a5490ec5ee3d4be958702f4f1e6bb8de4368c6c24e291388c296e`

Both screenshots show the ball clearly ahead of the forward arm, in a mirrored pattern. The ball should remain low to the floor at this phase; moving it vertically up to touch the hand would incorrectly erase the bounce.

## Next micro-experiment: horizontal axis only

1. In an **ephemeral scratch runner**, change only Marin's `dribble-run` forward control point(s) that contribute to `tick=8/frame=4`. Start with a modest reduction from the observed 12-unit offset; do not alter `height`, pass timing, dribble, other athletes, or the Juniper visual donor.
2. Capture **only this frame**, left and right at 120% initially, with the same registered loader and game-driven input. Compare ball-to-hand *horizontal* alignment while retaining a visible low bounce.
3. Reject the adjustment if it introduces clipping, a backwards bounce, discontinuity at neighboring frames, or a left/right asymmetry. Then check the immediately adjacent ticks, 100% zoom and the existing pass/catch mechanical tests before expanding.
4. Keep every experimental change out of PRs #6/#7 and `main` until reviewed. This checkpoint is not an art signoff or merge authorization.

Do **not** rerun the full 2,397-assignment audit merely to locate this single defect. The previously recorded baseline remains 706 missing, 40 inherited prompt findings, zero target-frame shortfalls.
