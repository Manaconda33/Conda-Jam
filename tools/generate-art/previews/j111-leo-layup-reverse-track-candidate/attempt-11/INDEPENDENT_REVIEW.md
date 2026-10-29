# J.111 Leo `layup-reverse` attempt11 — independent gameplay review

**Verdict: REJECTED.** The simulation records support a made two-pointer, but the screenshots do not show the athlete and ball through the full trajectory at both requested zoom levels.

## Evidence reviewed

Reviewed the left and right gameplay reports and the actual PNG captures at 100% and 120%, including ticks 11–13 (carry/release/early flight), 17–20 (flight), 30–60 (late flight), and 97 (score completion). The capture script starts a fresh match per facing, keeps Leo on the selected team roster (`rosterMatch: true`), and selects the accepted atlas with `flip:true` left-facing and `flip:false` right-facing.

## Findings

- **100% framing fails in both facings.** The tick13 100% screenshots show only the court and HUD; Leo and the ball are absent. The report screen positions confirm this: left x is about -140 and right x is about 620, outside the rendered canvas. This also means release and late-flight frames at 100% cannot be visually verified.
- **120% early framing is good.** Tick13 shows Leo’s full body, the ball near his raised hand, and the correct basket for both facings. The release transition is recorded at tick12: `hasBall:false`, `ownerId:null`, and the shot event says “Leo launches a 2-pointer.”
- **120% flight visibility fails.** At tick50 both facings show Leo and the basket but no ball. The reports record ball z≈26.70, consistent with the ball leaving the visible play area. The flight is therefore not continuously reviewable in the actual game view.
- **Simulation scoring passes.** Each report has no uncaught browser errors and records a 2-point score at tick97 (`[0,2]` left and `[2,0]` right), with the “Leo scores 2!” event. The completion screenshot shows the correct score. This does not remedy the missing 100% actor or invisible mid-flight ball.

## Required correction before another review

Reframe the actual 100% camera so the athlete and ball remain on-canvas, and calibrate the shot arc so the ball remains visible through late flight at both zoom levels. Preserve the ball as separately rendered gameplay state and continue using `stepMatch` for progression. Retain attempt11 as rejected evidence; do not register or accept this track based on its simulation score alone.
