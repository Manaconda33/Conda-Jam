# Krios J.128 regular layup candidate track — attempt07 review

**Disposition: right-facing contact/release trial is promising. Do not register or accept attempt07 yet; left-facing gameplay and coverage remain invalid because Krios is assigned to the home team while facing left, leaving the player off screen and the shot aimed toward the wrong basket. Correct the facing/team/camera fixture, rerun, then review the candidate again.** This capture injected both the candidate atlas and candidate track; it is not registered-runtime evidence.

## Evidence reviewed

- Current Jam Stage candidate report: `tools/generate-art/previews/j128-krios-layup-track-candidate/attempt-07/native/report.json`
- 64 captures over both facing values and 100%/120% zoom; report shows no browser errors and candidate atlas selection through all eight layup frames.
- Candidate atlas: `tools/generate-art/previews/krios-layup8-attempt06/krios-layup8-attempt06-runtime-candidate.png`
- Candidate track H `[0.9,1.15,1.55,2.05,2.25,2.0,1.1,0.7]`, F `[4,4.5,4.5,5,6,6,6,4]`, releaseVz `0.45`.
- Current Jam Stage court geometry, Krios staged at `courtY=90` near the attacking basket. This is a production stepMatch/render capture with candidate-only asset and track injection.

## Right-facing review

The candidate selector chooses frames 0–7 at canonical start ticks `[0,2,5,8,10,11,14,18]`; the release frame is selected at tick10. Krios retains the ball through tick9 with `ownerId:'krios'`, then releases once at tick10 (`mode:'shot'`, `ownerId:null`) on the expected frame4 release anchor. At tick9/zoom100 the ball sits close to the raised shooting hand; at tick9/zoom120 it also remains near the hand. The approach, takeoff, extension, release, descent and landing artwork are legible on the current Jam Stage. The separate ball follows the move into the rim and the shot scores two points at tick49 in both right-facing zoom runs. No candidate atlas fallback or browser error appears in the right-facing report.

These results support continuing calibration with the right-facing contact points and timing. The release ball rises above the fingertips on the first post-release capture; inspect its exact separation after the facing fixture is corrected and before runtime registration.

## Left-facing failure

The capture report records left-facing selector output and `flip:true`, but this is not sufficient. The screenshot `actual-left-tick09-zoom100.png` shows the current court without Krios or the ball. The left run retains Krios on the home roster/team while placing him at x=24 and setting `facing=-1`; the camera is still around x=83.8 at tick9, far from the athlete. The trial also retains warmup events such as `Krios scores 2!`, and then logs a new three-pointer instead of a close layup. At tick49 the ball is still in `mode:'shot'` and there is no score. Left-facing contact, release presentation, shot outcome and baseline are therefore unreviewed.

## Required correction before a new review

Run left-facing Krios on the away/scoring team at the left end, with matching possession/score indexing and a fresh match or cleared event log. Warm the camera to the correct end before triggering the action (or use a fresh browser process per facing), then verify the player and ball remain in-frame at tick9, release once at tick10, and score after flight. Repeat both facings at 100% and 120%. Keep the current attempt07 captures intact as evidence of the fixture failure.
