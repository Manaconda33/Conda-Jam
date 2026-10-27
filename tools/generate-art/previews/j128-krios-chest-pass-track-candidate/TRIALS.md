# J128 Krios chest pass ball-track trials

This directory contains native Jam Stage captures for Krios’s unregistered chest-pass atlas. The source art and prompt were accepted in `tools/generate-art/krios-pass6-provenance.json`; this track calibration is separate and is not runtime registration.

## Attempt 01

- Capture script: `tools/capture-j128-krios-chest-pass-track.py`
- Native report and 24 screenshots: `attempt-01/native/`
- Renderer: Chromium production Jam Stage canvas on the Scoria Rams court, court Y 90.
- Grid: six authored frame starts × right/left facing × 100%/120% zoom.
- Candidate track copied from source provenance:
  - Height: `[1.05, 1.15, 1.4, 1.5, 1.35, 1.05]`
  - Forward: `[8, 9, 11, 13, 12, 8]`
- Authored durations are `[2, 2, 1, 1, 2, 3]`; release frame 3 begins at tick 5.
- Ownership staged as Krios-carried through tick 4, then ownerless `pass` at tick 5. Captures include follow-through tick 6 and recovery tick 8.
- Release/flight display samples: tick 5 `[forward 13, height 1.5]`, tick 6 `[19, 1.8]`, tick 8 `[30, 1.6]`. These are visual samples, not a simulated receiver trajectory.
- Validation: all 24 selected production sprites used the candidate atlas and correct cell; left facing used mirrored frames; gameplay art mode was `generated-full-roster-atlases`; no browser errors.
- Visual inspection at 120% in both facings found the carried ball near the hands/body through the gather and aim poses. At release tick 5, the ball meets the forward hands; follow-through and recovery show a plausible separated ball path. No facing-specific alignment defect was seen. This is a promising calibration candidate, pending independent review and actual gameplay pass/receiver trajectory validation before runtime registration.

No candidates have been rejected in this lane yet. Preserve the full attempt even if later trials adjust the track.
