# Kraken layup-reverse attempt14 gameplay review

**Verdict: reject for runtime registration.** This review covers the 52 production Jam Stage captures in both facings at 100% and 120% zoom.

- The candidate plays through the release and scores two points in both directions by tick 100. Ownership is Kraken through tick 11; release occurs at tick 12. The report records no uncaught browser errors.
- Ball-to-hand contact fails visually. At ticks 10–11 (candidate frame 4), the ball floats above and ahead of Kraken’s head while the hands remain lower. At tick 12 (frame 5), the released ball remains visibly separated from the raised hand. The `releaseVz=0.8` adjustment improves the score arc but does not fix release contact.
- The left-facing target rim is clipped at the viewport edge. In both directions, the early flight approaches or is partly hidden by the top HUD; the later tracked ball becomes visible again, but that does not resolve the release/contact defect.
- After scoring, the celebration uses Krios fallback artwork because Kraken has no accepted `celebrate` clip. This is a visible identity discontinuity.

Keep attempt14 as rejected calibration evidence. Do not register the candidate track or clip until contact, framing, and celebration coverage are corrected and reviewed.
