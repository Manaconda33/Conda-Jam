# Independent review — attempt16 production capture confirmation

Approved. I compared `gameplay/rendered-production-courty95/` with attempt14 and confirmed the same accepted Leo shoot track and registered `releaseVz: 0.65` are exercised through the production path.

The report records `candidateReleaseVz: null`; the capture script's `USE_CANDIDATE_TRACK` defaults to false and `RELEASE_VZ` defaults to NaN, so neither calibration override is active. The capture loop leaves carried-ball hold, release, and post-release trajectory to the production animation track, `makeShot`, and `stepMatch`/ball integration. The report independently reads `productionReleaseVz: 0.65`, records release at tick13, and shows the post-gravity tick value `vz: 0.624` in both facings.

As in attempt14, the tick13 ball meets the raised fingertips, clears the hand at tick14, and follows a clean arc through tick23. Both facings score at 3–0. The actual renders show the ball and Leo fully visible at 120% through score completion; the 100% views are also clean. There are 24 captures and zero uncaught browser errors. No code was changed for this review.
