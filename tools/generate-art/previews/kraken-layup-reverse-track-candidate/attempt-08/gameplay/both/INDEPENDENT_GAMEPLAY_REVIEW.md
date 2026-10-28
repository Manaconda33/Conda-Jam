# Independent gameplay review — Kraken layup-reverse attempt 08

**Verdict: gameplay timing and scoring pass; visual acceptance at 120% zoom fails.** Do not treat these captures as full gameplay approval until the edge and top clipping at 120% is corrected and recaptured.

## Scope and evidence

Reviewed the 56 production Jam Stage Chromium captures in this folder: both facings at 100% and 120%, including takeoff, contact, release, shot flight, score, and dead-ball completion. The matching `report.json` records the production `stepMatch` path, the actual source selected by the sprite renderer, image-cache readiness, player/ball state, and browser errors. I inspected representative key frames visually at each zoom and facing.

The captured active clip resolves from `tools/generate-art/previews/kraken-layup-reverse8-attempt03/kraken-layup-reverse8-attempt03-runtime-candidate.png`. The image-cache entry is present, complete, and 320 pixels wide. Frames 0–7 select that candidate source; the renderer subsequently returns to the normal idle asset after the clip completes. The candidate is rendered for the actual Kraken roster instance, with the expected unflipped right-facing and mirrored left-facing presentation. No missing-sprite fallback occurs during the action. The report contains **zero uncaught browser errors**.

## Gameplay findings

- At tick 10 (animation frame 4, contact pose) and tick 11, the ball remains in `carried` mode, `ownerId` is `kraken`, and `playerHasBall` is true in both facings and both zoom settings.
- At tick 12 (frame 5, release), ownership becomes null, `playerHasBall` becomes false, and the ball enters `shot` mode. The report logs the launch event at simulation tick 11, immediately preceding the captured tick-12 state.
- The ball follows a continuous production trajectory without manual per-tick placement. At tick 110 the shot resolves to `dead`, `scored` is true, Kraken has one made field goal, and the score is exactly 2 points for Kraken's team in both facings and both zooms.
- At 100%, the contact and release poses are fully on-screen in both directions. The ball is near the raised hand at contact and visibly separates into flight at release. The pose, outfit, and action remain legible; the HUD does not cover the athlete or ball.
- Shot flight and completion proceed without reported errors. No ball ownership or scoring discrepancy was found.

## Blocking visual defect at 120%

At 120%, the action is not fully visible in either direction. At tick 0 the athlete is cropped at the outer horizontal edge: the right-facing setup extends past the right edge, and the left-facing setup extends past the left edge. At ticks 10–12, the raised athlete is also clipped by the top of the gameplay viewport immediately below the HUD; portions of the body are outside the frame in both facings. The ball/contact relationship and full pose therefore cannot be independently judged from those zoomed captures. Flight captures also move toward or beyond viewport edges.

The report's projected screen x coordinates confirm the horizontal crop at 120%: right-facing starts at x=487.97 (beyond the 480 logical-pixel canvas width), and left-facing starts at x=17.05, with the sprite extending beyond that edge. At 100%, the corresponding starting positions are x=147.68 and x=95.60 and the sampled action remains visible. This is a camera/viewport framing issue, not a simulation or sprite-cache failure, but it prevents acceptance of the requested two-zoom visual check.

## Recommendation

Keep the timing, ownership, release, and score findings as validated. Do not mark attempt 08 as fully gameplay-reviewed yet. Adjust the diagnostic camera/fixture or capture framing so the athlete and ball remain inside the 120% viewport through contact and release, then recapture and inspect both facings. No production artwork, manifest, or registration was changed during this review.
