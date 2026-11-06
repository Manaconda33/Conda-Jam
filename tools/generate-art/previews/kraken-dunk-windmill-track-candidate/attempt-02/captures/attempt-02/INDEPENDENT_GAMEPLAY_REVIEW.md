# Kraken dunk-windmill attempt02: independent gameplay review

**Verdict:** Scoring and release pass; hand alignment improved at frames 6 and 8, but frame7 still misses the extended hand and frame9 is now too high. Retune before candidate acceptance.

## Coverage and integration

Reviewed all 60 captures across frames 0–14, both facings, and 100%/120% zoom, with frame6–9 at 120% inspected directly. Four runs contain every sampled frame. `uncaughtBrowserErrors` is empty. This trial injected the candidate atlas and track (`runtimeIntegration: false`), so it does not validate the normal loader.

## Hand path and gameplay

- **Frame 6 (h0.6, f−1):** Ball now sits at the hip/hand area and is substantially better aligned than attempt01.
- **Frame 7 (h1.4, f−3):** Improvement, but the ball remains around the shoulder/upper arm while the rotating hand is farther back at the end of the extended arm. Move it farther backward along facing direction; height is close.
- **Frame 8 (h1.6, f−3):** Ball aligns with the bent hand behind the head in both facings. This point passes.
- **Frame 9 (h2.1, f−1):** Ball is above the raised hand and is partly obscured by the top HUD in both facings. The attempt01 point was slightly low/behind; attempt02 overcorrected. Lower it and shift back slightly.
- **Release/score/recovery:** Ball transitions to dunk at tick21/frame10, Kraken scores at tick23/frame11 on the correct side (right-facing [2,0], left-facing [0,2]), and frame14/tick30 is upright recovery. These mechanics pass.

## Suggested attempt03 values

Retain the other track points. Estimated frame6–9 values:

- `height`: `[0.6, 1.4, 1.6, 1.9]`
- `forward`: `[-1, -6, -3, -3]`

The frame7 move is a further 3-unit shift toward the trailing hand; frame9 returns toward attempt01's height with a modestly more backward offset. Re-capture both facings and zooms before settling these estimates. Candidate only; no production registration.
