# J.104 attempt07 actual physics review — rejected H7.5 contact

The requested gameplay-render set is preserved under `rendered-courty90/`; the initial center-court capture set is separately preserved under `rendered-courty50/`. Both were driven with repeated real `window.jamverse.tick()` / `stepMatch` calls. The post-release ball uses only `integrateBall` physics; the launch point was installed once at the actual release boundary.

The shots release at tick13, clear ownership correctly, and score in both facings. However, H7.5 is visibly too high in the actual renderer. At 120% the release ball is about 80 screen pixels above Leo's raised hand. The static track grid omitted the game's last-touch elevation compensation and concealed this mismatch. Attempt07 is therefore not accepted for production.

The captured player/ball states, release values, scoring results, and 24 screenshot paths are in `rendered-courty90/report.json`. It records both directions, ticks13/14/16/19/23, score completion, 100%/120%, owner clearing, and no browser errors. Do not delete either rendered set.

The 120% gameplay view also places late flight near/behind the top HUD. This is independent of attempt07's high H7.5 release mismatch and remains visible as a general shot-camera framing limitation in the lower-height attempt09 captures.
