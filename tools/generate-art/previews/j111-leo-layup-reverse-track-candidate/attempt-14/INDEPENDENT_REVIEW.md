# J111 Leo `layup-reverse` attempt14 independent gameplay review

**Disposition: approved for integration review.** The candidate is suitable to proceed to registry integration and a fresh registered-runtime validation.

## Evidence reviewed

- Both `gameplay/left/report.json` and `gameplay/right/report.json`: 16 captures per facing, at 100% and 120%, with sampled local ticks 11, 12, 13, 17, 20, 30, 40 and 50. Both report zero uncaught browser errors.
- Candidate atlas: `tools/generate-art/sources/j111-leo-layup-reverse-attempt06-facefix-cleanup01-atlas.png`.
- Candidate track: H `[0.4,1.61,1.98,2.6,2.65,2.65,1.45,0.84]`, F `[5.85,6.58,4.02,4.5,5.5,6.8,6.58,5.85]`; candidate `releaseVz` 0.45.
- Capture starts a fresh Jam Stage match with Leo on the matching scoring roster and uses one diagnostic setup fixture. The production `stepMatch` function advances animation, takeoff, ball attachment, release, trajectory and score; there is no per-tick teleporting.
- Manually inspected left tick11/tick13/tick30/tick50 at 100%, and right tick13/tick40 at 120%, along with the reports for both facing/zoom runs.

## Findings

- At tick11, Leo and the independent ball meet at the elevated hand by the rim; the event is the expected layup release on the next step (reported tick12). The player and ball are in-frame in both orientations. Left-facing uses the mirrored sprite; right-facing uses the native sprite.
- The reduced candidate launch velocity keeps the ball visible in the actual court view during the sampled trajectory, including approach to the basket and score. The shot reaches the expected rim target and scores two points at tick49 in each facing; the tick50 capture shows final score `[0,2]` for left and `[2,0]` for right. Ball ownership clears on release and there is no ball baked into the atlas.
- The 100% and 120% captures retain the player and ball in frame across the reported samples. No discontinuity, fallback, or browser error was observed.

This approves the candidate captures and values for integration work. It does not substitute for validating the registered manifest/core track after the candidate is installed.
