# Krios J.128 regular layup candidate track — attempt08 review

**Disposition: candidate atlas and ball track clear for registered-runtime validation. This is not production acceptance:** attempt08 injects the atlas and track into the current Jam Stage and does not test registered manifest/runtime behavior.

## Evidence reviewed

- Report: `tools/generate-art/previews/j128-krios-layup-track-candidate/attempt-08/native/report.json`
- 64 screenshots across right/left facing and 100%/120% zoom; zero uncaught browser errors.
- Court: current Jam Stage court geometry from this worktree, Scoria Rams vs Blackthorn Court Kings, `courtY=90`.
- Candidate art: `tools/generate-art/previews/krios-layup8-attempt06/krios-layup8-attempt06-runtime-candidate.png`.
- Candidate track: H `[0.9,1.15,1.55,2.05,2.25,2.0,1.1,0.7]`; F `[4,4.5,4.5,5,6,6,6,4]`; releaseVz `0.45`.
- Source action frame starts are `[0,2,5,8,10,11,14,18]`; canonical release/peak frame4 is tick10.

## Selector, facing, and timing

All eight candidate frames are selected from the candidate atlas at their frame-start ticks in both facings. Right-facing uses the native atlas (`flip:false`); left-facing uses the same approved right-facing candidate with the renderer's horizontal flip (`flip:true`). The corrected fixture uses Scoria at the right attacking end for the right-facing run and Scoria at the left attacking end against Blackthorn for the left-facing run. Both athletes remain visible on the current court at 100% and 120% zoom.

At tick9, both runs retain `ball.mode:'carried'` and `ownerId:'krios'`; the ball sits at Krios's raised shooting hand in the inspected right and left contact captures. At tick10, frame4 is selected and the ball transfers once to `mode:'shot'` with no owner, matching the release anchor. Subsequent flight is separate from the athlete art. The right-facing and left-facing runs both score two points at tick49. The corrected report starts with empty event logs; the only action events are `Krios launches a 2-pointer` and `Krios scores 2!`.

The gather, takeoff, ascent/extension, tick9 contact, tick10 release, follow-through, descent, and landing frames read coherently in the current court captures. Light/dark transparency is established by the separate art cleanup review; this gameplay pass did not detect a candidate atlas fallback during the layup frames.

## Limitations and next check

Attempt08 corrects attempt07's invalid left-facing setup by using a fresh page per facing, matching Scoria's roster end to facing, resetting events, and warming the end camera through 100 ordinary carried-ball ticks. The shot completes in both directions. At tick49 the layup has ended and the app changes to its ordinary celebration/fallback selection; attempt08's candidate atlas only covers `layup`, so that later frame is outside the candidate atlas claim.

Proceed to actual registration with the reviewed art and this track, then run a fresh registered-runtime check on the same current Jam Stage across both facings and both zooms. Confirm the public manifest atlas is selected, tick9 contact/tick10 release are unchanged, there is no sprite fallback during the clip, and both shots score at tick49 with clean event logs and no browser errors. Do not treat attempt08's candidate-injection captures as registered-runtime acceptance.
