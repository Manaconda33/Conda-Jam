# Kraken J.07 `pickup` cleanup02 track attempt02 — independent gameplay review

**Verdict: pass for candidate-injected track trials, with a recovery-timing caveat. This does not approve normal-loader/runtime registration.**

I reviewed the 32 valid captures in `native/` across both facings and zoom100/zoom120, including the approach frames, all four tick7 contact views, and the carried recovery through tick11. The valid candidate track is height `[0.65, 0.45, 0.2, 0.2, 0.75]`, forward `[3.5, 4.5, 5.5, 4.5, 4.5]`, with frame durations `[2, 3, 2, 1, 4]`.

At tick7 the selected pose is frame3 in all four runs. The separate ball reaches the ankle-level cupped hand with better vertical overlap than attempt01, where its lower edge sat visibly below and just away from the hand. In attempt02 the hand meets the ball at its upper-left edge in both mirrored views; the contact reads as a pickup rather than a nearby loose ball. Zoom100 and zoom120 retain enough detail to read that contact. The ball is not baked into the candidate atlas.

The trial state agrees with the pictures: the ball is loose and unowned through tick6, then at tick7 the event says “Kraken grabs the ball,” `hasBall` becomes true, and ownership transfers to Kraken. At tick8 the ball is visibly carried near the hip/waist and stays at that placement through tick11. The mirrored left-facing captures put it on the opposite side of the body and keep it close to the hand. Score remains 0–0. The report records all 32 captures present with matching hashes, no browser errors, and no wrong frame selection or facing flag.

**Recovery caveat:** frame3/tick7 uses ball height 0.2 and frame4/tick8 uses 0.75, so the ball rises from ankle level to the hip in one simulation tick. The held placement is coherent after the transition, but that single-tick rise is a visible snap at both zooms and facings. This is unchanged in principle from attempt01; attempt02 improves only the contact pose. Judge the snap against the intended pickup tempo before selecting a production track.

These screenshots use the in-memory candidate atlas and candidate Kraken ball track with a controlled one-time loose-ball fixture, then advance ordinary production simulation ticks. They validate this injected trial only. The normal asset loader, user-action pickup path, and runtime registration remain untested; keep the candidate unregistered until those checks are performed.
