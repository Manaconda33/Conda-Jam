# Independent gameplay review — Kraken dunk-double track attempt01

**Verdict: candidate mechanics pass; hand alignment needs attempt02 tuning.** The trial uses injected candidate art/track and does not validate production registration.

## Frame-by-frame hand alignment at 120%

Reviewed right- and left-facing captures for frames5–10. Mirroring preserves the same contact issue and no art or ball identity mismatch appears.

| Frame | Pose | Review | Suggested height | Suggested forward |
| ---: | --- | --- | ---: | ---: |
| 5 | Early rise | Ball overlaps upper chest/near hand; close enough, slightly forward in the right-facing capture. | 1.20 (keep) | 3.5 (from 4) |
| 6 | Hands rising | Ball is slightly above/in front of the converging hands. | 1.30 (from 1.60) | 3.0 (keep) |
| 7 | First two-hand pump | Ball is close to centered between raised hands. Keep height; a small forward shift improves overlap in both mirrored captures. | 1.90 (keep) | 1.5 (from 1) |
| 8 | Chest recoil/clutch | Ball floats roughly 35–45 screen pixels above the clasped hands in both facings. Lower by about 1.1–1.3 world units; move it modestly toward the hands/front. | 0.35 (from 1.50) | 0.7 (from 0) |
| 9 | Second two-hand rise | Ball is high above the raised fingertips and clips into the HUD region. Lower by about 1.0–1.2 world units; move it toward the front-hand center. | 0.90 (from 2.00) | 2.0 (from 1) |
| 10 | Rim strike/release | Ball reaches the rim and releases cleanly. | 2.10 (keep) | 3.0 (keep) |

The hand-center estimate for 8 and 9 is approximate from 120% screen captures; verify each correction against the next candidate capture instead of treating it as final production data.

## Gameplay checks

The 60 candidate captures cover all 15 frames, both facings, and 100%/120% zoom with zero browser errors. Both facings preserve ownership through frames5–9. Release changes the ball to dunk mode at tick21/frame10; the score updates at tick23/frame11 (home `[2,0]`, away `[0,2]`); the ball remains dead/unowned and recovery completes at tick30/frame14. These mechanics pass, but attempt01's carry positions at frames8–9 do not visually meet the hands closely enough.

## Recommended attempt02 track

Keep all unlisted points unchanged. Suggested arrays:

- `height`: `[0.85,0.95,1.25,1.10,1.25,1.20,1.30,1.90,0.35,0.90,2.10,0.90,0.70,0.45,0.60]`
- `forward`: `[3,4,5,3,2,3.5,3,1.5,0.7,2,3,5,3,2,0]`

Attempt02 remains candidate-only until both facings and zooms are recaptured and the adjusted hand contact is visually reviewed.
