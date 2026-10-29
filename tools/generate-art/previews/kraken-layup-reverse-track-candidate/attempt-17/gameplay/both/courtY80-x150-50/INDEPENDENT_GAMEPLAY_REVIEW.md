# Kraken `layup-reverse` — attempt17 independent gameplay review

**Verdict: reject; remain unregistered.**

I reviewed production Jam Stage captures for both facings at 100% and 120%, focusing on carried ticks10–11, release tick12, flight, and score completion. The report records 52 captures, 2-point scoring in both directions at tick100, expected owner through tick11 and ownerless shot at tick12, and no uncaught browser errors.

The ball is still not visually anchored to Kraken's shooting hand. At ticks10–11 it floats beside the upper body instead of visibly following the hand. On the release frame, the ball is clearly separated from the raised fingertips: in the right-facing 120% capture it is well to the right of the extended hand; in the mirrored left-facing capture it is well to the left. Lowering only height sample5 from 1.4 to 1.0 did not fix release contact.

The actor remains in view and the right hoop is visible, but the left hoop is clipped at the viewport edge at 120%. Score completion still selects Krios's red celebration sprite because Kraken `celebrate` is missing. The display therefore confirms gameplay scoring but does not pass visual acceptance.

Evidence: `gameplay-right-tick010/011/012-zoom120.png`, `gameplay-left-tick010/011/012-zoom120.png`, and the tick100 score captures. Do not register this track.
