# Kraken dunk-tomahawk attempt01: independent gameplay review

**Verdict:** Release/scoring work, but ball visibility/contact fails through the cocked-behind-head and overhead-to-strike poses. Retune before another candidate trial; no production registration.

Reviewed all 60 captures (frames0–14, both facings, 100% and 120%) and the cleanup01 atlas. The 15-frame art has a readable sequence: poses6–7 cock the right hand behind the crown, pose8 carries the hand overhead, pose9 brings the hand down below the head for the strike. The art’s pose anatomy is consistent with the intended motion.

At 120%, however, the ball is markedly too high and too far forward during poses6–8; it is cut by the top HUD or floats above the hand rather than staying in contact. At pose9, the hand has already driven down but the ball remains near head height and forward of the hand. The issue appears in both facings. Ball release/dunk mode occurs at tick21/frame10, the correct side scores at tick23/frame11 (right-facing [2,0], left-facing [0,2]), and Kraken is upright at frame14/tick30. Four runs cover every sampled frame, with zero uncaught browser errors. This candidate run injected art and track (`runtimeIntegration: false`).

## Suggested attempt02 retune

Lower and route the ball back during the cocked/overhead arc, then lower it sharply for the pose9 downstrike. These are first estimates from screenshots; recapture before accepting:

| Frame | Current H/F | Suggested H/F |
|---|---|---|
| 5 | 2.10 / 8 | 1.60 / 5 |
| 6 | 2.20 / 6 | 1.40 / 1 |
| 7 | 2.30 / 4 | 1.30 / -2 |
| 8 | 2.10 / 3 | 1.50 / 1 |
| 9 | 1.80 / 5 | 0.90 / 4 |

This smooths the turn behind the crown, keeps the ball nearer the hand through the overhead arc, and lowers it into the downstrike hand. Keep all points candidate-only. Check frames5–10 at both facings/zooms and confirm the ball does not clip the HUD before making any further adjustment.
