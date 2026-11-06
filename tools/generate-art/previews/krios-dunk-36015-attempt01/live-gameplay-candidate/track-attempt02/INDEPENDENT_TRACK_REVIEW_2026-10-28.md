# Krios `dunk-360` track attempt02 review

**Verdict: REJECT; preserve for calibration only.**

## Evidence

Reviewed all 60 current Jam Stage candidate captures covering 15 frame starts, both facings, and 100%/120% zoom. This is a candidate-injected trial (`runtimeIntegration:false`), not production loader acceptance. The report confirms the expected atlas cells and mirror selection, no uncaught browser errors, and the current Jam Stage court at `courtY90`.

## Findings

- **HUD clearance passes.** The peak ball at frame7/tick14 is fully visible at zoom120 in both facings. Frame5 and frame9 also clear the HUD.
- **Frame5 gather alignment is still low.** In both facings at zoom120 the ball overlaps the torso below Krios's gathered hands at the chest. It does not read as secured cleanly through the two-hand gather.
- **Frame7 peak is improved but contact is borderline.** The ball is near the raised hand and clears the HUD, but sits slightly below the hand in both facings. Inspect and tighten this contact before acceptance.
- **Frame9 pre-release contact remains weak.** The ball is offset from the reaching hand in both facings at zoom120: it sits down and inward from the right-facing hand, and down/outward from the mirrored left-facing hand. Raise it slightly and tune its forward offset toward the fingertip/hand.
- **Release and gameplay transitions pass.** At tick21 the ownerless dunk ball is at the rim in both facings. Tick23 records Krios's two-point score and the ball becomes dead/unowned. Follow-through and recovery continue through tick30 without fallback.
- **Selection and mirroring pass.** All 15 intended cells are selected in order; both directions use the safe horizontal mirror with no browser errors.

## Calibration guidance

Keep the peak height low enough to preserve the new HUD clearance. Raise the ball at frame5 to meet the two-hand chest gather; make a small height and forward adjustment at frame7 to center on the raised hand; and move frame9 toward the raised fingertips. Recheck both facings at zoom120, then recheck all 60 captures before normal-loader verification. Do not register this track yet.
