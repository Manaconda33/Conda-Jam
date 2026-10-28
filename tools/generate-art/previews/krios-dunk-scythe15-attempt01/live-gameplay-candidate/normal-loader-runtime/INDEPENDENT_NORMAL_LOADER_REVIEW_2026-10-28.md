# Independent normal-loader review — Krios J.128 `dunk-scythe`, track attempt08

**Verdict: REJECT pending correction to ball/hand contact during the lateral sweep.**

## Evidence reviewed

Reviewed all 60 captures: 15 sampled frames/ticks × both facings × 100%/120% zoom. The report confirms normal-loader runtime integration, no candidate atlas or ball-track injection, track attempt08, and registered atlas `public/assets/animation/krios-dunk-scythe-right.png` (SHA-256 `87f16ec492c286c9ddcb61c09acc1f515d6acdfec92719fc1e144d097606f0ac`). Captures use the current Jam Stage at courtY90; selected source/frame metadata and left-facing mirror flags are consistent. No browser or console errors are reported.

## Findings

- **Lateral sweep hand contact:** Frames6–9 show the ball sweeping around Krios, with clear hand contact at frames8–9. However at frame06/tick12 the ball is visibly separated below and behind the raised hand by more than the ball radius in both facings and zooms; the gap is large enough to read as a loose/floating ball while simulation state still says Krios carries it. Frame07/tick14 moves back toward the hand, frame08/tick17 makes contact, and frame09/tick19 continues toward the basket. Correct frame6's track position to keep the carried ball at the hand (or make the state transition intentional if it is meant to be released), then recapture.
- **Release and score:** At tick21/frame10 the ownerless ball is visible at the rim with the reaching arm; at tick23/frame11 the ball is gone and the two-point score/event are correct in both directions.
- **Landing/HUD/fallbacks:** Tick30/frame14 shows a stable landing/recovery. Peak and action margins remain within the stage view; no missing sprite, fallback, spill, HUD collision, or rendering error is apparent.

## Recommendation

Do not accept track attempt08 yet. Correct and recapture the frame06/tick12 lateral sweep contact in both facings and zooms. The registered atlas selection, subsequent contact, release, score, landing, and overall stage framing otherwise pass this capture review.
