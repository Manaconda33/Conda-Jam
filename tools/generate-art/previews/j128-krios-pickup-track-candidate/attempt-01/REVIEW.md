# J.128 Krios pickup track — attempt01 evidence (superseded candidate)

## Attempt01 vectors

- Height: `[0.65,0.45,0.2,0,0.75]`
- Forward: `[3.5,4.5,5.5,4.5,4.5]`
- Grab anchor: frame3 / local tick7, matching `pose-catalog.json` and the five-frame pickup clip duration map `[2,3,2,1,4]`.

## Capture and simulation evidence

`native/report.json` contains 32 screenshots: ticks0,2,4,6,7,8,10,11, both facings, and 100%/120% zoom. The production atlas selector chooses the five-frame Krios pickup atlas in every capture; right-facing is unflipped and left-facing is safely mirrored. Gameplay phase remains active and there are no browser errors.

Each trial initializes one loose, low basketball near Krios once. Thereafter normal `window.jamverse.tick` / `stepMatch` advances loose-ball physics, schedules the pickup, and reaches the grab anchor. No per-tick player or ball positions are assigned. At frame3/tick7, the catch event is `Krios grabs the ball`; ownership transfers exactly once to Krios and the same action continues into frame4. All four facing/zoom runs finish with `hasBall=true`, `ballMode=carried`, owner `krios`, and pickup tick11. At the catch, the ball is placed at the frame3 track point and follows the frame4 carried-ball point.

## Review status

Attempt01 is superseded by attempt07 for the current ball track candidate. Attempt07 uses H `[0.65,0.45,0.2,0,1.35]`, F `[3.5,4.5,5.5,4.5,0.5]`, and a one-time loose-ball setup offset +1.5 along court depth; see the parent `TRIALS.md` and `attempt-07/native/report.json`. Visual inspection of attempt07 right/left tick06, tick07, and tick08 at 120%, plus right/left tick06 at 100%, shows the loose ball visible beside the reaching hand before contact, contact at tick7, then a brief lift into a centered chest carry at tick8. The rise is abrupt but coherent with the recovery pose. It passed four facing/zoom gameplay runs with tick7 ownership, correct mirror selection, and no browser errors. Track remains a candidate pending full independent review across all sampled frames/zooms; no runtime registration is authorized by this evidence. The atlas was accepted for track calibration only. Source/art provenance is in `tools/generate-art/krios-pickup-attempt01-provenance.json`; the candidate atlas source review is `tools/generate-art/previews/krios-pickup-attempt01/ATLAS_REVIEW.md`.
