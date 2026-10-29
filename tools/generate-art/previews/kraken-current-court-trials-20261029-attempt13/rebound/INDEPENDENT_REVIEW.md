# Kraken rebound attempt02 track attempt05 — independent review

**Verdict: PASS for proceeding to normal-loader verification; not a runtime approval.**

Reviewed attempt13's rebound captures at ticks 0, 2, 4, 5 and 7 for both facings and zoom100/120, plus the report. This is still candidate-only (`candidateOverridesOnly: true`, `productionRegistration: false`); every sample selects the cleanup01 candidate atlas. Facing-left uses `flip: true` and facing-right uses `flip: false`.

The scenario is a live Leo three-point miss (`shotMade: false`) followed by a loose rebound and Kraken possession. All four runs report a rebound and catch on Vesper Harbor Undertow vs Blackthorn Court Kings at courtY75. Score remains 0–0 and there are no browser errors.

Attempt05's track H `[0.4, 0.2, 0.65, 0.95, 0.9]`, F `[3, 2.5, 0, 0, 1]` corrects the previous low catch. At tick5/frame3 the ball now meets Kraken's chest-level gathered hands in both directions and at both zoom levels; its center sits over the upper torso with the arms closing around it, rather than at the pelvis or above the head. By tick7/frame4 it remains in front of the chest/upper torso without drifting away. The tick4 overhead image is partly occluded by Kraken's raised arms/head while the report still has the ball loose; the tick5 catch is visually clear and the reported transfer occurs at the expected frame/tick. The tick0/2 positions are the live incoming loose-ball flight before track ownership, not a carried-ball offset; I see no initial carried-ball jump or late hold drift.

The change is consistent across all four view configurations and the mirrored placement remains on Kraken's front side. No visual ball-placement blocker remains for normal-loader verification. Keep this attempt unregistered until that production-path check passes.

Reviewer: independent gameplay audit. Review date: 2026-10-29.
