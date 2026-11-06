# Krios J.128 `dunk-windmill` attempt02 — independent source review

**Verdict: PASS for ball-track and Jam Stage trials only; not approved for production registration.**

Generation `exec-66309cd7-a49e-40e2-9e8b-ac52791a35ed`; raw SHA-256 `c9e150e90fd60855c1cc0c3ae0a279f816d638c29c0f4365d57588c0f472c83e`.

## Source and cleanup

- The raw 1619×971 RGB sheet has 15 full Krios figures in the 5×3 row-major layout, with no extra figure or missing cell. Krios remains identifiable by volcanic-red skin, curled black ram horns, charcoal beard, large muscular human anatomy, black/ember uniform, and shoes. No chest mark/logo, ball, court, rim, text, or decoration is visible.
- The attempt02 edit corrects the opening pair at target size. Frame0 is a forward moving approach; frame1 now has a visibly lower hip line, loaded/bent lead leg, rear heel lifted, finishing arm lowered/back, and free arm held forward. It reads as a planted load rather than the duplicate run seen in attempt01. The 128×96 close-pose comparison is `target-size-close-pose-review.png`.
- Frames6–7 remain distinct at target size: frame6 has the bent overhead finishing arm and extended free arm; frame7 straightens the finishing arm vertically and drops the free arm. The broad circular windmill arc remains readable through the sheet.
- Cleanup detects exactly 15 components and produces 15 unique pose hashes in 128×96 cells. All figures share baseline y=94, transparent outside pixels, and clear gutters. Tightest alpha bounds are frame7 top y=8 and the shared baseline y=94; left/right clearance is at least 17px. No body part is cropped. The normalized light/dark previews show no obvious green fringe or skin/hair contamination.
- The edit request targeted frame1, but generative editing can alter other poses slightly. They remain visually consistent in silhouette, identity, scale, costume, lighting, and motion order; do not treat them as bit-identical source crops.

## Registration gate still open

This is source/cleanup approval for trials only. The artwork contains no ball. Calibrate a Krios-specific separate track across takeoff, frame5 grab, peak, release at frame10/tick21, finish at frame11/tick23, and landing at frame14/tick30. Then capture all frame starts through the normal loader on the current Jam Stage, both facings and 100%/120% zoom, and independently review ball contact, release, score, landing, transparency and sprite selection before registration.
