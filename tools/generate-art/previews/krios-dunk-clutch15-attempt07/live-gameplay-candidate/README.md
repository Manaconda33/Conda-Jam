# Krios dunk-clutch attempt07 live gameplay track trials

All trials inject only the reviewed attempt07 atlas and the trial-specific Krios ball track through Playwright response routes. No shared source, manifest, registry, or runtime asset is edited. Each `track-attemptNN/track.json` preserves the exact 15-point vectors; `native/report.json` and captures preserve the corresponding two-facing, two-zoom run.

| Trial | Status | Summary |
|---|---|---|
| 01 | Rejected | Frames 5–9 placed the ball too high; interpolation toward frame10 sent it toward the rim at tick20 before release. |
| 02 | Rejected | Frame6 fell below the hands, frame7/8/9 missed contact, and the frame9→10 interpolation still advanced early. |
| 03 | **Pass for candidate-track review** | Frames 5–9 visually follow the changing hand positions; release, score, and land assertions pass at ticks 21, 23, and 30 for both facings at 100% and 120%. |

Trial03 remains candidate-only. It is not runtime-registered and the shared Krios track is unchanged.
