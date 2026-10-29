# Kraken rebound attempt02 cleanup01 — independent review

**Verdict: PASS for separate ball-track trials only. Not approved for runtime registration.**

Reviewed the cleanup candidate atlas, all five pose crops, light/dark proofs, layout/report, and source lineage. The candidate contains five unique pose hashes, aligned to baselineY94 in 80×96 cells.

- The sequence reads as a ready crouch → jump/reach → overhead rebound grab → ball gather at the chest during descent → settled landing stance. Arms and legs remain connected, and the hands are clearly visible in the overhead and gathered poses. No ball or prop is baked into the artwork.
- Kraken's auburn hair, pointed ear, natural skin, copper amulet and burgundy/copper-gold uniform remain coherent with the accepted sprite. All five figures retain complete anatomy and matching body scale. The compact dimensions reflect the crouched and airborne poses, not inconsistent scaling.
- Frame0 and frame4 are similar ending/start stances (silhouette mask IoU 0.877), but not duplicates: frame4 gathers both hands higher and closer at the chest, while frame0 holds a looser ready crouch. The difference is subtle at 80×96; review this transition in the ball-track trial, where the ball should be caught overhead and visibly gathered by frame4.
- Light/dark proofs show transparent backgrounds with no broad matte or obvious red/orange fringe. Alpha thresholding leaves clean hard edges. Margins are generous horizontally (minimum 23px) and vertically above (minimum 24px); all poses share baseline94 with 2px below the soles.

Proceed with a separate Kraken-specific rebound ball track. Verify hand contact at the frame2 grab, continuous carry through frame3, and a stable chest gather in frame4 in both facings. Revisit frame0/frame4 pose separation if that gameplay review makes the start and finish read as a frozen duplicate. Keep this candidate unregistered pending normal-loader validation.

Reviewer: independent asset audit. Review date: 2026-10-29.
