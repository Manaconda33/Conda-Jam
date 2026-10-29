# Kraken dunk-360 track calibration

The atlas is attempt05/cleanup01. Each complete candidate set contains 60 current-court captures: 15 sampled frames at both facings and 100%/120% zoom. Attempts with `runtimeIntegration: false` inject only the candidate atlas and Kraken-specific ball track; only attempt10 passed candidate gameplay review. Production acceptance is documented separately in `tools/generate-art/previews/kraken-dunk-360-attempt05/PRODUCTION_LOADER_REVIEW.md`.

| Attempt | Review outcome |
| --- | --- |
| 01 | Rejected: ball too high and clipped/hidden near HUD across spin frames5–9. |
| 02 | Rejected: reducing height exposed the ball, but contact remained vertically off. |
| 03 | Rejected: ball fell below the hands/into the legs during frames7–9. |
| 04 | Rejected: restored height overshot above the hands at frames7–9. |
| 05 | Rejected: frames7–8 still low and displaced; frame9 approached the hand. |
| 06 | Rejected: frame7 high, frame8 close, frame9 near contact; needed a narrower hand path. |
| 07 | Rejected: independent review found frame6 high/forward, frame7 low, and frame9 laterally offset. |
| 08 | Rejected: frame6 too low/forward, frame7 low, frame8 close, frame9 too low. |
| 09 | Rejected: frames7–9 aligned, but frame6 was shifted too far behind the athlete. |
| 10 | Candidate pass: frames6–9 contact and visibility pass both facings; tick21 release, tick23 score, tick30 recovery; 60 captures and no browser errors. Independent report is alongside the captures. This became the registered attempt10 track. |

All attempts and screenshots are preserved. They are calibration evidence, not separate production assets.
