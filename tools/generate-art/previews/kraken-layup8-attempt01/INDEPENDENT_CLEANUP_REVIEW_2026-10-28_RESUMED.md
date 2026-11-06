# Kraken J.07 `layup` attempt01 resumed independent cleanup review — 2026-10-28

**Decision: FAIL for ball-track trials and packing. Preserve this attempt as rejected review evidence.** The cleanup has good isolation and readability, but the release hand cannot be identified with enough certainty across frames 2–5 to calibrate the ball without risking a hand switch.

## Scope and evidence

Reviewed the untouched generated raw sheet, exact prompt and provenance, cleanup script, layout/cleanup reports, all eight normalized pose PNGs, 4×2 runtime candidate, and light/dark composites under `tools/generate-art/previews/kraken-layup8-attempt01/`.

## Checks that pass

- Eight distinct full-body poses are separated in the requested row-major order. Kraken's auburn hair, copper skin, pointed ear, burgundy/gold kit, wrist details, shoes and chest amulet are coherent. No basketball is baked into the athlete art.
- The cleanup's full-component bounds preserve the complete body and hands across the sheet seam. The 4×2, 80×96 atlas reads at runtime size, with a common baseline and visible pose separation.
- Light/dark previews show true transparency without a broad matte or obvious recoloring. Minimum margins are 16 px left, 21 px top, 17 px right and 2 px bottom; no pixels are clipped, though the bottom margin is tight.
- The action sequence reads as gather, takeoff, rise, extension, release, descent, landing approach and finish. Poses 2 and 3 clearly show the shooting hand raised beside/above the head; pose 4 is the release pose and pose 5 is follow-through.

## Blocking finding

The apparent shooting hand changes screen-side against the torso around pose 4. Pose 4's substantial torso turn could explain this, but the pixels do not make the same anatomical right arm traceable from pose 2 through pose 5 with confidence. In particular, pose 4 is the exact release frame; assigning a separate ball there would make any hand-side assumption gameplay-visible. Static inspection does not establish continuous same-hand carry through pose 3 and release at pose 4.

## Required correction

Revise or replace pose 4 so the anatomical shooting arm is unambiguous relative to the shoulders and torso, then review the complete sequence again. Keep this raw source and cleanup as rejected evidence. Do not start ball-track calibration, pack, or register this atlas based on the current sheet.
