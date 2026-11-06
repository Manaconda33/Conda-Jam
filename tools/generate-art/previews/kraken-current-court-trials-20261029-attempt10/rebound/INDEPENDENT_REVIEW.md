# Kraken rebound attempt02 track attempt03 — independent review

**Verdict: FAIL for track acceptance; retain candidate-only evidence and recalibrate the catch frame. Do not register.**

Reviewed attempt10's five rebound tick captures (0, 2, 4, 5, 7) at both facings and 100%/120% zoom, along with the report. The trial is candidate-only (`candidateOverridesOnly: true`, `productionRegistration: false`) and selects the attempt02 cleanup01 atlas. Facing-left uses `flip: true`; facing-right uses `flip: false` throughout.

The scenario is a live Leo three-point shot with `shotMade: false`, followed by a loose rebound and Kraken possession. All four runs report an actual rebound and catch; the court is Vesper Harbor Undertow vs Blackthorn Court Kings at courtY75. The score remains 0–0 and the report has no browser errors.

The new H `[0.4, 0.2, 0.65, 0.25, 0.75]`, F `[3, 2.5, 0, 0, 1]` track improves tick7: the ball is now around Kraken's gathered torso in frame4. The catch still misses visually at tick5/frame3. In both facings and both zoom levels, the ball appears below the hands around the pelvis/upper legs while Kraken's frame3 hands gather at chest level (`right-zoom120-rebound-tick05.png`, `left-zoom120-rebound-tick05.png`). At tick7 it is higher at the torso, so the ball appears to rise from the lower body into the hold after possession has already transferred. The grab event/owner state alone does not demonstrate hand contact. The inbound loose-ball trajectory is also high: tick2 shows the ball above the raised hands, and the tick4 apex is not visibly at the hands in the inspected view; the shot's existing physics controls those loose-ball frames, but catch timing/placement should ensure the ball meets the hands before transfer.

The lower carry position at tick7 is closer, and horizontal mirroring is consistent, but the tick5 catch needs correction before normal-loader review. Raise/adjust frame3's carried-ball placement toward the gathered hands and tune the loose-ball catch point so the transfer occurs at visible contact; then review again at both facings and zooms.

Reviewer: independent gameplay audit. Review date: 2026-10-29.
