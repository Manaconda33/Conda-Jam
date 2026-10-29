# Kraken J.07 `pickup` cleanup02 track attempt01 — independent review

**Verdict: pass for candidate-injected track trials only. Not approved for runtime registration.**

I reviewed the 32 current Jam Stage screenshots and report for both facings at 100% and 120%. The expected pickup frames are selected at ticks 0, 2, 4, 6, 7, 8, 10, and 11. The ball remains loose and unowned through tick6. At tick7, cleanup02 frame3 puts Kraken's empty cupped hand beside/against the separate ball at ankle height; the production event says “Kraken grabs the ball,” transfers ownership to Kraken, and leaves the score 0–0. The contact reads as an ankle-level retrieval in all four runs. At tick8 and through tick11, the carried ball moves up near Kraken's waist/hip during recovery; it remains visibly close to the hand and body without teleporting.

The mirrored left-facing captures preserve the same contact and held placement. Zoom100 and zoom120 remain legible, with no visible character fallback, crop, HUD collision, browser error, or capture-integrity failure. The track is height `[0.65,0.45,0.2,0,0.75]` and forward `[3.5,4.5,5.5,4.5,4.5]`; no basketball is baked into the atlas.

The captures use an in-memory cleanup02 atlas and Kraken-specific track with a controlled one-time loose-ball fixture, followed by production `stepMatch` ticks. They do not validate the normal asset loader or a user-caused pickup transition, so this pass only supports the next integration trial. Keep the candidate unregistered pending those checks and any final contact adjustment.
