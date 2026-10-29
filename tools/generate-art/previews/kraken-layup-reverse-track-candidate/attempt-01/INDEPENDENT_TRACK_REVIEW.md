# Independent track review — Kraken `layup-reverse`, attempt01

**Verdict: FAIL for hand-contact calibration. Retain as a rejected track trial; do not register or pack.**

Reviewed all 32 current Jam Stage captures, the capture report, and the candidate atlas/track metadata. The four runs cover both facings at 100% and 120% zoom.

## Checks that passed

- All 32 captures select the intended eight-frame candidate atlas at the expected frame ticks. Right-facing uses no flip; left-facing uses the horizontal flip. The separate ball track returns the expected values in each run.
- No browser errors occurred, and the forced-possession review harness kept the ball carried with the score at 0–0 in all samples.
- Kraken's anatomy and recognizable auburn-haired, pointed-eared identity remain legible through the sequence. The reviewed source/cleanup atlas remains suitable for continued track trials only.

## Blocking visual defects

- At frame3/tick7 through frame5/tick12, the ball is too high relative to Kraken's hands. It floats above the raised arm, with the peak samples close to the top scoreboard/HUD edge at both zoom levels. It does not read as controlled hand contact at the pre-release peak or release pose.
- At frame6/tick13 the ball shifts abruptly down and to the front of the torso while the pose has already passed the release. This does not establish a coherent carry-to-release hand path.
- The frame5/tick12 image is still a forced-carry sample. It does not test the actual shot release, ball ownership transition, or scoring trajectory. Gameplay timing and release therefore remain unvalidated.

The tested estimate was H `[0.9,1.25,1.7,2.15,2.3,2.35,1.4,0.8]`, F `[4,5.5,4,3,-4,-1,5,4]`, sampled at ticks `[0,2,5,7,10,12,13,17]`. Recalibrate Kraken's height/forward values around the raised far-side hand, then rerun native captures and a live two-facing release/score check. Keep the candidate unregistered until the contact, HUD clearance, and gameplay checks pass.
