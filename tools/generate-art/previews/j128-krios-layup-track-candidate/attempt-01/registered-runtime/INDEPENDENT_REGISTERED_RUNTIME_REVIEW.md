# Independent registered-runtime review — J.128 Krios `layup`

**Disposition: registered-runtime review passes the sampled gameplay and visual checks.**

Reviewed the 64 captures in `report.json` across four current Jam Stage runs: right and left facing at 100% and 120% zoom. `runtimeIntegration` is true, `uncaughtBrowserErrors` is empty, and every clip capture reports the public manifest source `./public/assets/animation/krios-layup-right.webp`; this is registered-runtime evidence, not candidate injection.

- The clip uses the expected 8-frame timing (`[2,3,3,2,1,3,4,4]`). Ball ownership remains with Krios through tick 9. Tick 10 selects frame 4 and releases the ball once; ownership clears and the launch event appears. The ball is placed just above the raised hand at release in both facings.
- Both directions score two points by tick 49, with the expected launch and score events. The player/ball run is horizontally reversed consistently, with no browser errors.
- I rechecked the apparent dark offset on the 120% tick 10 capture against the exact fifth (frame 4) 128×96 atlas cell at enlarged scale. It is one figure: the dark regions are the source frame's black/charcoal hair, outline, and costume shading around the head, torso, and trailing arm/leg, aligned with the same areas in the rendered sprite. There is no second silhouette or runtime afterimage. My earlier report mistook these shaded parts for a duplicate; the atlas-to-runtime comparison resolves that concern.

The registered runtime is cleared by this review for the sampled gameplay timing, both facings, and visual presentation. This is a capture review; automated project validation remains separate.
