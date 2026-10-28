# Independent normal-loader review — Krios J.128 `dunk-reverse`

**Verdict: PASS for the reviewed normal-loader runtime captures.**

## Evidence reviewed

Reviewed all 60 captures: 15 sampled frames/ticks × right/left facings × 100%/120% zoom. The report confirms normal-loader runtime integration, no candidate atlas or track injection, registered atlas `public/assets/animation/krios-dunk-reverse-right.png` (SHA-256 `5ff3a4093b2f414aeb163479b6d903d555236a1f3b8492a2da9ae3813d378d75`), and expected atlas/frame selection for each capture. Right-facing uses `flip: false`; left-facing uses `flip: true`. Current Jam Stage at courtY90 is reported, with no browser or console errors.

## Findings

- **Pose selection and transitions:** The selected sequence reads as approach and planted load (frames0–2), gather and lift (3–7), pre-release drive (8–9), reverse finish/contact (10), follow-through (11–13), and landing (14). Frames4–7 have a compact run of related gathered poses, but the hand/torso/leg positions change enough across both zooms to read as progression rather than a stuck frame. Frames9–11 distinguish the ball held near the head, rim contact, and arms-extended follow-through.
- **Ball path and peak margin:** The separate ball follows the gathered hands through the high arc. At frame07/tick14 it remains fully inside the stage view and clear of the top HUD in both facings at 100% and 120%. No apparent ball/athlete overlap defect occurs during the difficult transitions.
- **Release/contact:** At tick21/frame10, the ownerless ball is visibly centered at the rim in both directions; the finishing arm reaches into the basket. The ball/rim/hand relationship reads as reverse-dunk contact without obscuring Krios's torso. At tick23/frame11 the ball is absent as the follow-through continues.
- **Ownership and score:** Capture state shows Krios carrying through tick19, `dunk` mode with no owner at tick21, then `dead` mode at tick23 with exactly two points and the `Krios scores 2!` event. Scoreboard and event banner match in each direction.
- **Landing and framing:** Tick30/frame14 shows a controlled two-foot recovery pose. Athlete, hoop, baseline, court markings, and HUD remain in view at both zooms; no crop, missing sprite, or spill is apparent.

## Recommendation

The registered `dunk-reverse` atlas and runtime ball track pass this independent 60-capture review for selector/mirroring, pose progression, ball contact, scoring, and landing.
