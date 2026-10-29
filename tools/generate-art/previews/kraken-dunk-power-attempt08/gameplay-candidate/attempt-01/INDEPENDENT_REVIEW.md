# Kraken dunk-power attempt01 — candidate gameplay review

**Verdict: candidate route/selection and score pass; ball-track contact fails before the dunk.** The candidate atlas and track are explicitly injected for this trial (`runtimeIntegration: false`, `candidateAtlasInjected: true`, `candidateBallTrackInjected: true`); this is not normal-loader or production-registration evidence.

## Coverage and runtime behavior

- Reviewed all 60 scheduled captures across right/left facing and 100%/120% zoom: 15 sampled frames per run. Every capture selects the expected frame 0–14 from the cleanup04 candidate atlas. Right-facing uses `flip: false`; left-facing uses `flip: true`. Kraken remains visible with full anatomy, and the hoop/HUD do not hide the action.
- The actual simulation runs the injected candidate track. Both facings score two points (right `[2,0]`, left `[0,2]`); the dunk action is at tick21/frame10, and the score/dead-ball state appears by tick23/frame11. At tick30/frame14, Kraken is grounded in recovery, with no ball owner. Browser error list is empty.
- The cleanup04 art reads as a coherent approach/jump/dunk/landing animation at gameplay scale. Peak and slam are visible, and frames 12–14 give a readable descent/landing/recovery. There is no ball baked into the art.

## Ball contact blockers

- **Frame3 / tick7:** with `height=1.45, forward=0`, the ball overlaps Kraken's head/face instead of meeting the hands extended in front of his torso. This is visible in both facings and zooms. Starting correction to try: lower height to about `1.0` and move forward to about `4.5`.
- **Frames4–5 / ticks9–10:** the ball rides above Kraken's head while he plants/loads; the raised ball is visibly detached from the carrying hands. The current heights are `1.75` and `1.7`. Starting corrections: reduce these to about `0.9` and `0.8` while keeping forward values near `3` and `2`, then recheck the gather/plant contact.
- **Frame9 / tick19:** the ball is around 50–65 screen pixels ahead of the overhead hand in both facings at 120% (still clearly separated at 100%). The current forward value `12` places it near/over the hoop before the dunk begins. Reduce `forward[9]` from `12` to about `6` as the first horizontal correction; the vertical gap is much smaller than the horizontal error, so retain `height[9]=1.8` for that pass.
- **Frame10 / tick21 release:** this anchor is sound for a first trial. Possession clears, ball mode changes to `dunk`, and the ball meets the rim while Kraken's arm reaches through the hoop. The score follows at tick23. Frame11 is post-release and correctly has no athlete-owned ball.

The Krios-seeded vector needs Kraken-specific adjustment around frames3–5 and9 before further contact claims. These are visual starting values for the next candidate trial, not production values. No production files or tracks were changed.
