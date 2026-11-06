# J.111 Leo `layup-reverse` track attempt11 — gameplay visibility recapture

## Candidate track

H `[0.40,1.61,1.98,2.60,2.65,2.65,1.45,0.84]`; F `[5.85,6.58,4.02,4.50,5.50,6.80,6.58,5.85]`. Ball remains separate from the accepted eight-frame Leo atlas. Release anchor is animation tick12/frame5.

## Capture setup and camera correction

The prior attempt05 left-facing gameplay view omitted Leo and ball. Inspection found the harness started with Leo on the home roster, then changed his simulation team without matching the selected away team roster; it also reused a camera state between facings. Attempt11 starts a fresh Chromium/Jam Stage page for each facing, selects a real match roster with Leo on the attacking team (home for right-facing, away for left-facing), and starts the diagnostic action close to the correct hoop (x175 right, x25 left; court y90). The team/roster match and normal production renderer now agree, and each facing starts from its own camera state.

After one-time fixture setup, all animation, carried-ball, release, shot and score updates advance through `window.jamverse.tick` / `stepMatch`. No per-tick player or ball coordinates are assigned, no pause overlay is active, and the ball is not baked into the atlas. The capture selected the candidate atlas and verified `flip:false` right-facing / `flip:true` left-facing. Native reports preserve ownership trace, track values and actual screenshots.

## Result

Each facing has 22 actual renders: animation checkpoints, release and flight, then score completion at 100% and 120%. Total 44 screenshots, zero browser errors. Both shots clear ownership at tick12 and score as 2-pointers at simulation tick97: right score `[2,0]`; left score `[0,2]`. At the 120% release frame, Leo's complete body, ball and target basket are in frame for both facings. Left and right reports are under `gameplay/left/report.json` and `gameplay/right/report.json`.

Independent review is pending; do not register or mark the clip accepted until it passes.
