# Kraken `pass-overhead` candidate-driven gameplay — attempt 04

**Status: gameplay mechanics trial passes; no production approval or registration.**

The trial uses the v2 Kraken overhead-pass candidate atlas and the attempt03 track: height `[1.05,1.85,1.75,1.9,2.1,1.2]`, forward `[2.5,3,2,6,10,14]`. A Playwright route injects that track into the served `animation.js` module in memory, while an in-page manifest override selects the candidate atlas. No production source, renderer, registry, or manifest files are changed. From pass input onward the actual `stepMatch` loop advances the ball from carried contact through normal release, free-flight, and Marin's catch; the harness never moves the ball after launch.

The production simulation produced an ownerless pass at animation tick 7 in all four runs (both facings × 100%/120% zoom). Marin Dusk caught it at step 22 in every run. Final ownership transferred to Marin, the score remained 0–0, the pass event was recorded, and there were no uncaught browser or failed-request errors. The 24 static frame/mirror captures and four real gameplay traces are in `report.json` and the adjacent PNGs. `gameplay-release-facing+1-zoom120.png` and `gameplay-release-facing-1-zoom120.png` show the candidate-selected release frame and separate live ball; `gameplay-catch-*` shows the teammate catch.

The mechanics check establishes that this trial track reaches the actual simulation release and delivers to the receiver without post-release repositioning. It does not establish independent visual approval of ball-to-fingertip contact over every carried frame, nor normal-loader registry behavior. The source atlas and track remain unregistered pending independent visual review and full normal-loader verification.

## Harness startup failures retained

Initial launches on ports 4237 and 4329 without network permission failed before capture with `listen EPERM` while binding loopback. No screenshots or candidate state were produced by those runs. The same harness then ran successfully with an already-started local Jam Stage server under the sandbox's granted network capability; the successful capture report has zero browser/request errors.
