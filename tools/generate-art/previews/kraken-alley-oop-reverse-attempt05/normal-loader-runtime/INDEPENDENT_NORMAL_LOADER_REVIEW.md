# Independent normal-loader runtime review — Kraken alley-oop reverse

**Verdict: PASS for the registered runtime and gameplay gate.** I reviewed the complete 60-capture set (all 15 animation frames at 100% and 120%, facing right and left), the report, the registered atlas, and the prior cleanup review. This is a true no-injection run: the production renderer selected the manifest atlas and Kraken's registered track.

## Registration and capture integrity

- `report.json` records `runtimeIntegration: true`, `cameraShim: false`, `candidateAtlasInjected: false`, `candidateBallTrackInjected: false`, 60 captures, and no uncaught browser errors.
- Every capture selects `alley-oop-reverse` from `./public/assets/animation/kraken-alley-oop-reverse-right.webp`, and the reported SHA-256 matches both the file and manifest: `c63bea203464bd0744a0918f371e82857679e3bb9ac708c699f2e92faa429828`.
- All runs preserve frame selection/order. Right-facing captures use `flip: false`; left-facing captures use `flip: true`.
- The atlas is a 5×3 sheet with 80×96 frame cells and `baselineY: 92`. The prior cleanup review confirms distinct full-body poses, transparent gutters, crisp binary alpha, aligned baselines, and no cleaned silhouettes touching cell edges.

## Gameplay and visual review

- The production pass sequence is present in each run: Marin's real turbo alley-oop pass targets Kraken; Kraken catches at the authored grab transition and owns the ball through animation frames 5–9. At 120%, the ball remains visually close to the raised hand across the carry; both facings show readable contact without a discontinuous jump.
- Registered track attempt06 was used: `height=[1.15,1.3,1.5,1.5,1.35,0.575,0.85,1.45,1.35,0.7,2.1,1.8,1.3,0.8,0.65]`; `forward=[5,7,9,8,6,4,2,5.5,5.5,5.5,-10,-8,-4,2,4]`. During frames 5–9 the recorded carried-ball delta from the athlete-specific track is zero (within floating-point noise) in all four runs.
- Frames 10–12 read as the reverse finish from both sides: the release occurs at the rim at animation tick 21, frame 11 scores two at tick 23, and the low-hand-behind-body pose remains apparent through frame 12. Frame 14/tick 30 shows landing/recovery. The ball becomes unowned at release and is dead/unowned after scoring; score is awarded to Kraken's team in both home/away orientations.
- I reviewed contact boards for all four facing/zoom combinations and the 120% captures for catch (frame 5), carry (frames 6–9), release (frame 10), score (frame 11), reverse follow-through (frame 12), and recovery (frame 14). Kraken's burgundy/copper appearance remains identifiable, full anatomy is visible, and no ball is baked into the atlas. Marin and the rim do not obscure Kraken during the critical poses.

## Caveats and record cleanup

- The cleanup review measured the visible poses about 16% shorter at median height than Kraken's idle sprites. It also records that two raw cells touched source boundaries before cleanup, although no clipped limb is visible in the cleaned atlas or runtime samples. These remain known quality caveats; this runtime review found no defect that blocks registration.
- `BLOCKER.md` in this directory predates registration and incorrectly says a no-injection run cannot be performed. It is superseded by this successful report and review; preserve it as historical context or mark it superseded in a later documentation pass.
- The ball-track source comment in `src/core/animation.js` still says “production loader review pending”; this review completes that gate. Update the comment/status record during the next integration checkpoint.

**Acceptance:** normal-loader runtime gate passes for this Kraken clip. The report provides runtime evidence only for this clip, not a claim that the full captain animation lane is complete.
