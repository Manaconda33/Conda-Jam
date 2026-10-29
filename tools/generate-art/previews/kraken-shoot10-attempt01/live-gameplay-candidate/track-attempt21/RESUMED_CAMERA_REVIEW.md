# Kraken shoot attempt21 camera review — 2026-10-28

**Verdict: no tested variant is ready for production.** No reviewed combination simultaneously proves 120% late-flight ball clearance, complete near-sideline shadow visibility, and compatibility with the registered shooter.

## Results

- The common projection pan of +32 logical Y at 120% preserves gameplay coordinates, tick13 release, three-point scoring and ball-to-rim geometry. It keeps Kraken's candidate ball visible in the sampled late flight and does not alter 100% framing. However, the production Reed Ashcroft comparison shows the near-sideline shadow ellipse clipped at the bottom of the canvas. The smaller +24 pan leaves late flight in the fixed HUD. Existing `compare-projection-pan28/30/REVIEW.md` evidence shows left-facing late-flight ball/HUD overlap and shadow clipping at those intermediate offsets.
- Combined +32 pan with `floorHeight` 230 or 245, using the current 0.8 shot-flight scale, does not pass: the saved Reed Ashcroft left-facing 120% tick73 captures still put the ball into/behind the fixed launch banner. The court/shadow position shifts, but the ball/HUD defect remains. Candidate Kraken release remains tick13 in the reports.
- Combined +32 pan, `floorHeight` 245 and scale 1.62 also fails the registered-player check: Reed's left-facing late-flight ball is no longer visible in the saved tick73 view. Kraken's sampled late-flight ball is visible, but a Kraken-only pass would introduce a regression for the existing shooter.
- The baseline and scale-only comparisons do not establish a common solution: late flight for the registered shooter is hidden by the fixed HUD in the baseline, and changing only shot-flight scale does not move the fixed HUD or court shadow.

The combined-variant report files show normal current Jam Stage simulation, no recorded browser errors, and Kraken tick13 release. The camera experiments are harness-only; no production renderer or asset registry change is recommended from this evidence. Keep shoot attempt21 as a visual/gameplay candidate and preserve the screenshots, reports and rejected camera settings until a framing solution is tested across both Kraken and Reed.
