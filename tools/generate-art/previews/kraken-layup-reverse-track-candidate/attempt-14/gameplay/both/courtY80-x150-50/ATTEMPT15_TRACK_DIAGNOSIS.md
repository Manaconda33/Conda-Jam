# Kraken `layup-reverse` attempt15 track diagnosis

Change only the carried-ball height samples for frames 3–5, from `1.9, 1.9, 1.9` to `1.4, 1.4, 1.4`. Keep all forward samples from attempt14, keep frames 0–2 unchanged, and keep the `releaseVz: 0.8` shot parameter.

Evidence: attempts09–14 all keep `H[3]` and `H[4]` at 1.9 while varying only later samples. In attempt14, the actor is at `z=1.6629` on tick7/frame3 and `z=2.0` on tick10/frame4, while the carried ball is respectively `z=3.5629` and `z=3.9`: a constant 1.9 world-unit vertical offset. The 120% captures show the ball floating above Kraken's near-side head/hand through tick11. The horizontal offset remains on the same side as the hand in the facing-specific captures, so the forward vector is not the first variable to change.

Lowering only samples 3–5 by 0.5 should bring the ball toward the raised hand through the jump, contact pose, and release approach. Leaving samples 0–2 intact avoids disturbing the earlier gather/carry poses; leaving `F` intact isolates the vertical correction; keeping `releaseVz` preserves attempt14's tested two-point post-release trajectory. Verify ticks7–12 in both facings/zooms, especially tick7/frame3, tick10–11/frame4, and tick12/frame5, before adjusting another variable.
