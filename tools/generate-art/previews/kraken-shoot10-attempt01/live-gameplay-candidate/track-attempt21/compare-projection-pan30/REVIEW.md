# Jam Stage projection-pan 30 candidate — 2026-10-28

**Verdict: rejected as a complete framing solution.** Harness-only renderer route changed `projectJamStagePoint` by `+30 * clamp((zoom-100)/20,0,1)` logical Y pixels. This leaves 100% unchanged and moves the projected court, hoop, players, ball and shadows together at 120%; simulation, clips and ball tracks stayed untouched.

## Normal simulation runs

- Reed Ashcroft, right, 100%: release tick 13, score [3, 0], browser errors 0, failed requests 0.
- Reed Ashcroft, left, 100%: release tick 13, score [0, 3], browser errors 0, failed requests 0.
- Reed Ashcroft, right, 120%: release tick 13, score [3, 0], browser errors 0, failed requests 0.
- Reed Ashcroft, left, 120%: release tick 13, score [0, 3], browser errors 0, failed requests 0.
- Kraken candidate, right, 100%: release tick 13, score [3, 0], browser errors 0, failed requests 0.
- Kraken candidate, left, 100%: release tick 13, score [0, 3], browser errors 0, failed requests 0.
- Kraken candidate, right, 120%: release tick 13, score [3, 0], browser errors 0, failed requests 0.
- Kraken candidate, left, 120%: release tick 13, score [0, 3], browser errors 0, failed requests 0.

## Visual review at 120%

Reviewed Reed's late-flight screenshots at both facings and Kraken's frame19 screenshots at both facings. At 28 and 30 pixels, the left-facing late ball overlaps the fixed `LAUNCHES A 3-POINTER` banner near the hoop; it is not fully clear of HUD. Right-facing shots have the ball visible below the fixed scoreboard. At both settings the near-sideline actor's shoes remain visible, but the ground shadow ellipse is clipped by the bottom edge. Pan30 exposes slightly more of the ball vertically than pan28, but clips more of the shadow.

Evidence: `reed-ashcroft/` and `kraken/` contain exact run reports, hashes, and screenshots. `visual-review-contact.png` contains the four 120% facing samples.

## Tradeoff

Neither 28 nor 30 clears the left-facing HUD while retaining the full near-sideline shadow. The 24-pixel trial keeps the shadow but has more HUD overlap. The 32-pixel trial clears the ball in both facings but still clips some shadow. No tested common pan satisfies both constraints; the renderer needs another framing choice if both are required.
