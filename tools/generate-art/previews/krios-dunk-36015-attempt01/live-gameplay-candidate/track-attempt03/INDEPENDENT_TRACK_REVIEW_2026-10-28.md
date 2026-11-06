# Krios `dunk-360` track attempt03 review

**Verdict: REJECT; preserve for calibration only.**

## Evidence

Reviewed 60 current Jam Stage candidate captures covering all 15 frame starts, both facings, and 100%/120% zoom. This remains a candidate-injected track/art trial (`runtimeIntegration:false`). All requested cells select in order, mirrored left-facing presentation is active, and the report records no uncaught browser errors. Court is the current Jam Stage at `courtY90`.

## Findings

- **HUD clearance passes.** The ball at peak frame7/tick14 is fully visible at zoom120 in both directions, with margin below the top HUD.
- **Gather contact still needs correction.** At frame5/tick10 in both facings the ball lies below and overlaps Krios's face/upper torso rather than reading as secured by the two hands gathered at his chest. The gather is not sufficiently legible at native gameplay size.
- **Peak contact is acceptable but close.** At frame7/tick14 the ball is close to the raised hand in both facings and clears the HUD. Tighten slightly toward the hand if it can be done without losing the margin.
- **Pre-release alignment substantially improves but remains inconsistent.** At frame9/tick19 the right-facing ball overlaps the reaching hand; on the mirrored left-facing capture it is close but sits slightly beyond the hand. Tune the forward offset a small amount toward the fingertip and confirm the same relation both ways.
- **Release/gameplay passes.** At tick21 the separate ownerless ball reaches the rim in both facings. Tick23 records Krios's two-point score and the ball becomes dead/unowned. Authored follow-through and landing continue through tick30.
- **Selection/mirroring pass.** All 15 candidate cells select in sequence for right and left, with no fallback or browser errors.

## Calibration guidance

Continue from attempt03: keep peak height within the current HUD margin, adjust frame5 so the ball meets the chest-level two-hand gather, and make a small frame9 forward adjustment toward the fingertips. Repeat 60 captures and then obtain normal-loader verification. Do not register this track yet.
