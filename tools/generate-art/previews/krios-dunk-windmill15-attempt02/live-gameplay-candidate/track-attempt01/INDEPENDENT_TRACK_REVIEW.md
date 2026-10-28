# Krios J.128 `dunk-windmill` attempt02 / track01 — independent gameplay review

**Verdict: reject track01; keep the source sheet for further calibration. Do not register.**

The candidate harness completed 60 captures on the current Jam Stage court: all 15 frame starts, both facings, and 100%/120% zoom. It selected the candidate atlas and expected frames, retained carried ownership until the tick21 release, scored two points at tick23 in both directions, and reported no browser errors. The simulation path and release marker are correct. The separate ball does not follow the authored one-hand windmill arc in the carried poses.

## Contact failures

- Frame0/tick0: ball is visible at the rear side of Krios, but it sits above the low outside-hip hand. Track01 uses height1.0 / forward−3; lower the ball and move it slightly back toward the drawn hand.
- Frame3/tick7: right-facing zoom120 places the ball well above and left of the low rear-waist hand. Track01 height1.45 / forward−12 is too high and too far back. Lower height substantially (trial around0.5–0.8) and move forward several units toward the hand.
- Frame5/tick10 grab: no ball is visible near the invisible one-hand grip beside the rear shoulder in either facing or zoom. Track01 height2.25 / forward−9 puts the ball outside the readable court area. Reduce height to roughly1.1–1.4 and move forward from−9 toward−4 as a calibration start.
- Frame7/tick14 peak: no ball appears at the raised hand in either facing/zoom. Track01 height2.8 / forward0 lifts the ball out of view. Reduce height to roughly1.2–1.5; then calibrate forward offset against the overhead hand.
- Frame9/tick19 pre-release: no ball appears at the hand extended toward the rim. Track01 height2.5 / forward12 is too high; trial roughly1.2–1.5 height while retaining the forward reach for the next capture.
- Frame10/tick21 release: the live dunk ball is visible centered at the rim, with Krios's arm reaching into the hoop. Frame11 onward has the ball dead/unowned during the follow-through and landing, as expected.

The visible release is not enough to accept the track: the ball must remain on the athlete-specific hand path at the grab, overhead arc, peak and pre-release frames. Retain this trial and its screenshots; use the per-frame adjustments above for track02, then request another independent current-court review.
