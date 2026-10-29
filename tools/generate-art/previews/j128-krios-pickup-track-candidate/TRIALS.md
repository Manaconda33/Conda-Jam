# Krios pickup track trials

## Candidate track

- Current best candidate (attempt07): H `[0.65,0.45,0.2,0,1.35]`, F `[3.5,4.5,5.5,4.5,0.5]`.
- Earlier candidate (attempts01–04): H `[0.65,0.45,0.2,0,0.75]`, F `[3.5,4.5,5.5,4.5,4.5]`.
- Grab anchor frame3 / action-local tick7; pickup clip frame durations `[2,3,2,1,4]`.
- Attempts01–05 and 07 captured 32 actual Jam Stage screenshots across five sampled local ticks, both facings, and 100%/120% zoom; see each `attempt-*/native/report.json`. Attempt06 consists of two failed distance probes documented below.

## Trial fixtures and disposition

| Attempt | One-time loose-ball fixture | Outcome and disposition |
| --- | --- | --- |
| 01 | Forward 2.5, z 0.2, vz 0, courtY 90. | Gameplay/ownership assertions pass. Preserved as first candidate; visual review incomplete. |
| 02 | Forward 3.8, z 0.2, vz 0, courtY 90. | Gameplay/ownership assertions pass. Still unclear pre-catch ball visibility; preserved, not approved. |
| 03 | Forward 3.8, z 0.2, vz 0, courtY 50. | Gameplay/ownership assertions pass. Court placement variation did not establish visible contact approach; preserved, not approved. |
| 04 | Forward 3.8, z 0.6, vz 0.1, courtY 50. | Best current fixture for review: ball is visible at tick7 after the catch, but the live ball is not visibly discernible at tick6 in reviewed 120% screenshots. Candidate track not approved. |
| 05 | Same fixture as 04; track changes only at frame4 to H=1.35, F=0.5. | Visually improved carry: reviewed right and left tick8 screenshots show the ball centered against Krios's chest between his hands. Best current track candidate; full independent review still pending. |
| 06a | Forward 7.0, z 0.2, vz 0, courtY 50; attempt05 track. | Rejected distance probe: did not complete the tick7 ownership assertion, so no capture report was emitted. |
| 06b | Forward 6.0, z 0.2, vz 0, courtY 50; attempt05 track. | Rejected distance probe: did not complete the tick7 ownership assertion, so no capture report was emitted. |
| 07 | Forward 3.8, lateral offset +1.5, z 0.2, vz 0, courtY 50; attempt05 track. | Best result. Loose ball is visible near the reaching hand at tick6 on right and left; tick7 contact and tick8 chest carry are visible on both facings. Gameplay assertions pass in all four facing/zoom runs. |

Every trial uses one initial fixture assignment followed by normal production `stepMatch` ticks, with no per-tick teleporting. Across four facing/zoom runs per trial, the selector picks the candidate atlas, right facing is unflipped, left facing is mirrored, action reaches tick7 grab, Krios receives ownership, and the carried ball persists through tick11. No browser errors were reported. These gameplay assertions do not establish visual contact quality.

### Current visual review

Reviewed attempt04 screenshots: right tick06/07 at 120% and left tick06 at 120%. With no lateral offset, at tick06 Krios reaches toward the floor but the orange ball is not visible. Attempt05 right and left tick08 at 120% show the frame4 ball too low/right; attempt07's revised H=1.35/F=0.5 places it at the chest between the hands on both facings. In attempt07, visually inspected right/left tick06 and tick07 at 120%, right/left tick08 at 120%, and right/left tick06 at 100%. The +1.5 court-depth offset makes the loose ball visible beside the reaching hand on both facings, without breaking the tick7 catch. Tick7 shows the ball at the floor-contact hand; tick8 shows it secured at chest height. The one-tick lift is visually abrupt but coherent with the pickup recovery pose. Broader review of all sampled frames and zooms remains pending independent review before runtime integration.

The capture tool is `tools/capture-j128-krios-pickup-track.py`. Set `ATTEMPT` and `TRACK_JSON` to preserve additional calibration trials without overwriting prior results. The fixture sets the loose ball and players once; all later movement uses production simulation ticks. Atlas/source provenance is recorded in `tools/generate-art/krios-pickup-attempt01-provenance.json` and `tools/generate-art/previews/krios-pickup-attempt01/ATLAS_REVIEW.md`.
