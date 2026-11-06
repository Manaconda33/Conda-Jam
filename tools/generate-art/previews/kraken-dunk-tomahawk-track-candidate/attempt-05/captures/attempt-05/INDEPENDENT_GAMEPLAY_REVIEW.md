# Kraken dunk-tomahawk attempt 05 gameplay review

**Verdict: pass as a calibration candidate; advance to a registered normal-loader trial.**

I inspected the 120% contact captures for frames 6–9 in both facings, plus the dunk/score frames 10–11. Contact now follows the intended tomahawk sequence: the ball stays on the raised arm through the overhead gather and is close to the extended hand on frame 9. The close frame 6 ball/head overlap is consistent with the hand tucked behind the ball, and does not read as a detached ball. Left-facing mirroring preserves the same placements. No further H/F adjustment is indicated from these captures.

The report records 60 captures (15 sampled frames at 100% and 120% for both facings), zero uncaught browser errors, and the expected score in both directions. Kraken releases/scores at tick 23 for two points and the last sampled pose shows recovery. This is a candidate-injected gameplay calibration only: the candidate atlas and track were injected, and `runtimeIntegration` is false. It is not evidence of registered production-loader integration.

The tested candidate track is height `[1, 1.15, 1.4, 1.7, 1.95, 1.6, 1.4, 1.5, 1.9, 0.95, 1.5, 1.25, 1, 0.75, 0.65]` and forward `[6, 8, 10, 12, 10, 5, -4, -6, -2, 8, 8, 12, 10, 7, 6]`. The complete capture set and metadata are in this directory.
