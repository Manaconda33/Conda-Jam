# Kraken J.07 `pass-behind` registered runtime — independent review

**Verdict: accept the registered gameplay and track integration.**

The normal Jam Stage loader reads `./public/assets/animation/kraken-pass-behind-right.webp` from the production manifest. The six authored frame selections match ticks 0, 2, 4, 7, 8, and 10. Facing right selects the right-facing source; facing left safely flips it. No atlas, manifest, selector, or simulation override is used.

The four actual gameplay runs cover both facings and 100%/120% zoom. Kraken releases at tick 7 from the rear hand. Marin faces Kraken, the ball reaches her receiving hands at tick 28, and the carry transition looks natural. The step 27 ball is `(96.873, 78.011, 1.964)`; the catch attaches at `(97.2, 79, 1.7)`, about 1.075 units of observed movement. The predicted free-flight point differs from the hand attachment by about 1.17 units, which remains visually natural in the captures.

The ball stays airborne through the catch without a floor bounce. Marin owns it after the pass; the score remains 0–0. The court and HUD are clear, with no browser errors or failed requests. The source retains a tight two-pixel lower margin, but the shoes are complete and remain visible in the registered captures.

Evidence: `report.json` and all registered runtime captures in this directory; candidate-source and cleanup reviews remain with attempt 01.
