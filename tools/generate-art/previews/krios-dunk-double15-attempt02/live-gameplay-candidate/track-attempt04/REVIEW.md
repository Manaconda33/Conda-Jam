# Independent review: Krios `dunk-double` track attempt 04

**Disposition: pass as an unregistered candidate for parent review.** The tick-17 adjustment clears Krios's face while keeping the ball at the raised hand. Captures validate the injected candidate only; no runtime registration was performed.

## Capture setup

- Current Jam Stage production renderer and actual queued `dunk-double` gameplay action.
- 60 screenshots: right/left facing at 100%/120% zoom, with 15 action ticks per run.
- Candidate atlas and ball track injected for capture only. No shared runtime registry/core edits.
- Zero uncaught browser errors; expected atlas, frame, and flip selected in all captures.

## Exact candidate track

Height: `[1.0, 0.9, 1.2, 1.6, 0.85, 1.0, 0.85, 0.75, 1.9, 1.55, 2.0, 1.2, 1.0, 0.8, 0.7]`

Forward: `[5, 4, 3, 5.0, 1.5, -1, -1, -1, 4.0, 2.0, 12, 10, 8, 6, 4]`

Relative to attempt03, **only** the tick-17/frame08 forward sample changed, from `1.2` to `4.0`. Height and every other sample are unchanged.

## Review findings

- **Tick 17 / frame08: pass.** At both facings and zooms Krios's face is visible, and the ball is outward from the face at the raised-hand area. It remains clear of the HUD. Evidence: `right-frame08-tick17-zoom120.png`, `left-frame08-tick17-zoom120.png`, plus their 100% versions.
- **Tick 7 / frame03: pass, preserved.** Ball remains outward from the side of Krios's face and at the raised-hand area in both facings. Evidence: frame 03 at 100% and 120%.
- **Tick 9 / frame04: pass, preserved.** Ball returns to the upper torso, face stays clear, and the fold/resecure reads as controlled.
- **Tick 19 / frame09: pass, preserved.** Overhead second-pump contact remains legible in both facings after the frame08 change.
- **Tick 21 release/contact and tick 23 score: pass.** At tick21 the ball is in dunk mode with no owner and score 0; tick23 records Krios's 2-point score for the correct team in each facing.
- **Tick 30 landing: pass.** Krios is grounded and stable in both facings.
- **HUD/framing/mirroring: pass.** Action stays in frame and legible at both zooms; no HUD collision, clipping, missing sprite, or discontinuity observed.

Attempt04 is suitable for parent review as the next unregistered track candidate.
