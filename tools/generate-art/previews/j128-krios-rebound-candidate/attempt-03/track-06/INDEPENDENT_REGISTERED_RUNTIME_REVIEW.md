# Independent registered runtime review — J.128 Krios rebound, track-06

**Result: PASS for registered-runtime integration and gameplay trial.** I reviewed all 20 captures (five sampled frames, both facings, at 100% and 120%) in `registered-runtime/` and its `report.json`.

## Runtime selection and mechanics

- The report identifies the production Chromium Jam Stage renderer, `runtimeIntegration: true`, and `candidateAtlasInjected: false`. Every capture selects `./public/assets/animation/krios-rebound-right.webp`; right-facing uses `flip: false`, left-facing uses `flip: true`. Selected frames match expected frames 0–4 in all four runs. This confirms the registered atlas and track are used through the normal loader and mirrored selection.
- The deterministic live sequence is present: Leo launches at tick 13, the miss produces `Rebound!` at tick 97, the ball remains loose and unowned through local ticks 0/2/4, and Krios catches it at local tick 5 / global tick 103. At ticks 5 and 7, `hasBall` is true, owner is Krios, and rebounds is 1. The carried ball has zero reported hand-relative x/z delta. Actors are positioned once before the shot; subsequent movement uses normal simulation ticks, with no per-tick teleporting reported.
- Track values are H `[1.1, 1.7, 2.0, 2.1, 1.3]`, F `[4, 3, 1, 0.5, 1]`. In the captures, the loose ball approaches the raised hands, meets them at the frame-3/tick-5 catch, then remains carried beside the upper chest/raised hand at frame-4/tick-7. The left-facing captures show the mirrored relationship consistently.

## Visual inspection

- All five poses read as distinct and coherent in both facings and at both zooms. Krios remains fully visible, with readable limbs and no apparent atlas fallback, pose clipping, or collision with the hoop/post at the catch. The ball is visible at the overhead catch and remains attached during recovery.
- The HUD and score/timer panels render normally. I saw no conspicuous green/matte fringe on the athlete in the 20 captures. The registered WebP atlas is 640×96; an independent scan found zero opaque green-dominant pixels using signed channel comparisons.
- The other on-court characters are close together at the far edge of some 120% views, but this is outside Krios's sprite and does not obscure the reviewed action.

This passes as a normal-loader registered-runtime integration review for this Krios rebound clip. It does not certify the full captain library or unrelated clips.
