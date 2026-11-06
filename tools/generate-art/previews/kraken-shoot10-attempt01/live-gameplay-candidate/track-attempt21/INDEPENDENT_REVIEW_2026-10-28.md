# Kraken J.07 shoot attempt21 independent review — 2026-10-28

## Verdict

**PASS as a current-court separate-ball track candidate for production integration review.** The reported and visually inspected captures support the attempt across both facings at 100% and 120% zoom. This review does not register the candidate or independently rerun the game.

## Evidence reviewed

- `report.json` and all 72 referenced captures, including SHA-256 integrity results.
- Release and flight state vectors for the four facing/zoom combinations.
- 120% right- and left-facing late-flight samples (`flight-sample033`), plus 120% score-complete captures.
- The changes in `src/main.js`, `src/render/jam-stage.js`, and `tests/jam-stage-projection.test.js`.

## Findings

- The harness uses the current Jam Stage court. The action selects Kraken's candidate shoot atlas and reaches the canonical release at frame5/tick13. The ball is carried through frame4/tick10, then the actual simulation owns a free shot ball; the harness records no later writes to its coordinates.
- Both orientations mirror correctly. All four runs finish as three-point scores, with the score on the correct side for each facing. The player remains visible, the ball is visible in sampled flight, and the late sample places it beside the target hoop without covering the P1 marker or fixed HUD.
- `report.json` records 72 unique capture paths; every file exists and matches its recorded SHA-256. Browser-error and failed-request lists are empty, and no terminal miss is recorded.
- I found no visible contact break at release or facing-specific discontinuity in the captures I reviewed.
- Renderer scope is localized to Jam Stage ball presentation: the new helper uses a 0.8 scale for rendered `shot` height and preserves 1.62 for other non-dunk flight and 1.82 for dunk contacts. It does not change simulation vectors, ball ownership, release timing, scoring, or the fixed HUD. The focused test asserts those scale selections.

## Follow-up consideration

The 0.8 value applies to all Jam Stage shots, not only Kraken. This attempt's evidence shows why the stage presentation needed adjustment and validates Kraken's three-point path. Since this review contains no comparison capture from another shooter, check at least one different shot animation against the fixed hoop before considering the renderer change broadly settled.
