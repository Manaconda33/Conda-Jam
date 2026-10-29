# Kraken dunk-windmill attempt03: independent gameplay review

**Verdict:** Frame6–9 hand alignment passes for candidate calibration. This is not production registration.

Reviewed all 60 captures: frames0–14, both facings, and 100%/120% zoom. At 120%, the ball contacts the rotating hand at frame6 hip-level, frame7 extended trailing hand, frame8 bent-behind-head position, and frame9 overhead position. The previous frame7 gap and frame9 high placement are corrected. The sequence remains readable in both facings.

The ball releases into dunk mode at tick21/frame10. Kraken scores at tick23/frame11 on the expected side (right-facing [2,0], left-facing [0,2]) and reaches upright frame14/tick30. All four runs include 15 frames; no uncaught browser errors are recorded.

This run injected the candidate atlas and track (`runtimeIntegration: false`). Recommend carrying these values into a checked-in no-injection normal-loader trial. Keep the track candidate pending that integration check and any final gameplay review.
