# Krios J.128 `dunk-power` attempt02 — independent Jam Stage candidate review

**Verdict: HOLD. Candidate art can proceed to a corrected track trial; attempt02 art plus track-attempt02 is not ready for gameplay or registration.**

I reviewed the 60 capture files (15 frame starts × two facings × 100%/120%) produced by the normal current Jam Stage renderer. The report records candidate atlas SHA-256 `ddbd2e5d12c04d25e9a9d72c043a340cdd83cd79aff4e2ec8339ad68380073c7`. Candidate injection happened before game start, so these images do select the trial atlas. The report records zero uncaught browser errors.

## Art and presentation

- Krios remains recognizable at court scale: red skin, black ram horns, charcoal beard, muscular human anatomy and black/ember kit. The chest is visually cleaner than attempt01's noncanonical mark. No ball is baked into the atlas; the orange ball in these captures is the separate stage ball.
- Silhouettes are complete and readable at both zooms. Approach, takeoff, forward drive and landing poses remain distinct. The candidate is mirrored coherently in the left-facing captures; body details and the ball stay on the athlete-facing side.
- The source review's concern about close overhead poses is confirmed: frames5–7 differ only modestly and read as a held overhead action. Frames9–11 show incremental reach changes; the open-finger release is present, but its separation from adjacent poses is subtle at 100%.
- The stage images use a center-court, manually staged actor. They do not include a dunk target or live approach/camera motion, so they cannot validate rim alignment, dunk timing, scoring, or landing physics.

## Ball-track findings

- The attempt02 candidate track is visibly too low at the grab/peak. At frame5/tick10 and frame7/tick14, the ball sits at Krios's face/upper torso while his hands are overhead. This fails the authored two-hand overhead grab and peak contacts. Frame4/tick9 is closer to the face/forehead and is also slightly off the intended gather.
- Both facings show the same relative mismatch, so this is track calibration rather than mirror policy. The forward offsets also place the ball to the side of the overhead hands on these frames.
- Frame10 onward is rendered as a manually staged released ball, not production dunk physics. Its placement at center court has no meaningful rim/contact significance.

## Required next work

Retain the candidate and capture set as trial evidence. Adjust the athlete-specific hand height and forward offsets for frames4–7 against the actual hand centers, then capture both facings/zooms again. Review the release at the live hoop and run the actual Krios dunk simulation before considering registration. The packed source's 8px top clearance also needs packed/runtime-margin confirmation.
