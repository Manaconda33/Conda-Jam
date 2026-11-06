# J128 Krios shoot ball track calibration

This is calibration evidence for the unregistered Krios shoot candidate atlas. It does not register or accept the clip. The capture script temporarily overrides the manifest in the page and uses the production Jam Stage at `courtY=90`; each attempt captures ten timing samples across both facings and 100%/120% zoom (40 captures). `report.json` in each attempt records the exact candidate vectors, frame selection, facing, zoom, ball state and paths.

Source atlas: `public/assets/animation/krios-shoot-right.webp` (candidate only). The controlled visual target was the shooting hand at release frame 5 / tick 13, with the ball remaining carried through tick 12 and becoming free at tick 13.

## Preserved attempts

| Attempt | Result | Review |
| --- | --- | --- |
| 01 | Rejected | Provenance track placed the release ball far to the right and below the raised hand. Kept unchanged under `attempt-01/native/`. |
| 02 | Rejected | Release ball was far above the hand; frame 4/tick 10 was also below the hands. Kept under `attempt-02/native/`. |
| 03 | Rejected as a complete track | Release contact was visually close in both facings, but frame 4/tick 10 put the ball too high. Kept under `attempt-03/native/`. |
| 04 | Rejected | Frame 4/tick 10 remained too high. Kept under `attempt-04/native/`. |
| 05 | Rejected | Frame 4/tick 10 remained too high. Kept under `attempt-05/native/`. |
| 06 | Best reviewed candidate | Frame 4/tick 10 and frame 5/tick 13 hand contact visually align at 100% in right-facing view. The release contact also appears aligned in the mirrored 120% left-facing capture. This remains a candidate for parent review, not an accepted runtime track. Kept under `attempt-06/native/`. |

## Candidate from attempt 06

Height vector, frames 0–9: `[1.0, 1.2, 1.4, 1.8, 2.0, 1.7, 4.0, 2.0, 1.0, 0.0]`.

Forward vector, frames 0–9: `[5, 5, 5, 4, 3.1, 0.7, 2, 4, 6, 7]`.

Release/free-ball samples: tick 13 `[0.7, 4.7]`, tick 14 `[3, 6]`, tick 16 `[8, 8]`, tick 19 `[20, 10]`, tick 23 `[38, 8]` (forward, height). Clip timing is unchanged; frame 5 begins at tick 13 under the clip duration schedule reviewed for this candidate.

The sprite and capture selection were confirmed on the production renderer for all 40 captures in attempt 06. The script reported zero uncaught browser errors and selected the requested atlas/frame with the expected mirrored flip in every capture. Visual review covered the full ten-frame right-facing sequence at 100%, release at both facings and zooms, and frame 4 at 100%. Earlier frame contacts and the full 120% sequence still need independent review before runtime acceptance. The free-flight positions after release are provisional calibration samples; tune against the actual hoop trajectory before integrating.
