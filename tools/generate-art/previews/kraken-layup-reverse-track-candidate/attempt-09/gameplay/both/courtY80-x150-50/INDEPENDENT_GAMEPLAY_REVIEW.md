# Kraken J.07 `layup-reverse` attempt09 gameplay review — 2026-10-28

## Verdict

**Harness correction passes; the animation/track candidate is not accepted.** The refreshed captures use the current Jam Stage, keep Kraken visible through the action, and prove the intended two-point score. The release ball does not stay visually attached to the raised hand, the late flight is hidden at 120%, and the rim is clipped in the left-facing 120% view.

## Evidence reviewed

- The attempt09 `report.json` and all 52 screenshots in `courtY80-x150-50/`.
- Both facings and 100%/120% zoom at ticks 0, 2, 5, 7, 10, 11, 12, 13, 17, 20, 30, 60 and 100 (the report contains 52 captures across four runs).
- Candidate atlas selection, frame indices, ownership/ball mode, score, camera fixture, and browser error data.
- Representative 120% images for both facings at ticks 0, 10–12, 17, 20 and 100.

## Findings

- The previous frozen-camera failure is fixed in the new harness. It lets Jam Stage render and update its camera during each controlled production tick; the actor remains in frame throughout active poses in both facings and zooms.
- The current candidate atlas is selected for poses 0–7. The report confirms Kraken owns the ball through tick11, then becomes ownerless at the tick12 release. All four runs finish with a two-point score by tick100; no browser errors are recorded.
- The ball is carried through tick11, but the tick12 release image puts it well above and away from Kraken’s raised hand. Contact is not visually continuous across release in either facing; the separate ball track needs recalibration.
- At 120% the ball reaches the fixed HUD boundary by tick17 and is outside the visible court by tick20 while the report still records `ball.mode="shot"`. The target rim is also clipped at the left edge in the left-facing run; the right-facing rim has very little clearance beneath the HUD.
- The score-complete capture shows Krios fallback artwork because Kraken’s `celebrate` clip is not registered. This is a separate captain coverage gap, but it remains an incorrect visual transition in this end-to-end run.

## Decision

Keep attempt09 as a corrected camera-harness and gameplay diagnostic. Do not register the atlas or track yet. Recalibrate the athlete-specific release contact and obtain viewport-safe late-flight/rim captures at 120%. Recheck the score transition after Kraken’s celebration artwork is available.
