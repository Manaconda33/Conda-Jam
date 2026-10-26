# Issue #4 staging preview checkpoint

Date: 2026-10-26

The first renderer-only Jam-stage projection is opt-in with `?stagePreview=1`. The default projection and simulation remain unchanged. This is a Chicago Condas vs Crownfire Sovereigns vertical-slice draft; it is not accepted, deployed, or a completed Issue #4 implementation.

## Projection targets in this draft

- Logical viewport: 480×360.
- Ground band: y=152–360, or 57.8% of viewport height.
- Standard horizontal slice: 50% of court length at midcourt; depth perspective changes the apparent width from 94% at the far sideline to 100% at the near sideline.
- Generated standing sprite: configured at 1.4× renderer scale, with .84–1.0 far-to-near scale. For the current 78px render height this is 25.5% H far / 30.3% H near before athlete-specific scaling.
- Ball: 19px diameter, or 4.0% W.
- Floor boundary and existing court markings use the preview projection; the existing court colors and arena art remain in place. A large basket support is projected from a near-apron world point and depth-sorted against players by ground position.
- Camera follows a copied ball position in preview mode to add attack-end lead. Simulation-owned coordinates are not changed by that camera adjustment.

## Verification and approval gate

`node tests/jam-stage-projection.test.js`, lint, and static build pass in this checkpoint. The build required registering the new projection module in `tools/build.mjs` so the standalone Pages bundle remains self-contained.

Review screenshots could not be captured in this managed environment: local server binding fails with `listen EPERM`, and headless Chromium terminates at startup with `SIGTRAP` after a denied `setsockopt`. Existing `artifacts/screenshots/court-chicago-crownfire.png` is the old baseline; it is not evidence for the preview. Therefore the four Issue #4 frames (near-side dribble, right-basket dunk peak, left-basket shot release, portrait play) remain unmeasured and the owner screenshot approval gate remains open.

Still outstanding before the first-slice approval request: capture the four canonical frames in an unrestricted browser; measure standing, airborne, hoop, floor, court-slice, ball, and portrait dimensions; inspect player/stanchion occlusion and camera motion across each attack end; adjust the preview if measurements or visual inspection fail. No court redraw, portrait camera change, gameplay change, deployment, or issue closure is part of this checkpoint.
