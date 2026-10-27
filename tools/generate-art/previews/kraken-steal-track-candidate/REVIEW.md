# Kraken J.07 `steal` ball-track trials

These captures are calibration evidence for the separate gameplay ball only. They temporarily override the atlas in the production Jam Stage and do not register or modify the candidate art.

| Attempt | Height | Forward | Result |
| --- | --- | --- | --- |
| 01 | `[1.0, 0.9, 0.75, 0.55, 0.75, 0.95, 1.05, 1.0]` | `[5, 8, 10, 12, 11, 8, 6, 5]` | Rejected: at grab frame index 3 / tick 5 the ball was substantially past the low inward-hook hand. Original 32 captures and report are preserved under `attempt-01/native/`. |
| 02 | `[1.0, 0.9, 0.55, 0.55, 0.7, 0.9, 1.0, 1.0]` | `[5, 7, 6, 6, 7, 8, 7, 5]` | Rejected: the harness called `jamverse.start()` twice, so independent review observed duplicate/offset athlete rendering. Preserve the original 32 captures under `attempt-02/native/`. |
| 02 single-start | same as attempt 02 | same as attempt 02 | Rejected: this intermediate harness correction overrode the manifest after starting, so the renderer used its fallback athlete art and did not show the staged ball. Preserve its 32 captures under `attempt-02-single-start/native/`. |
| 02 single-start-atlas-first | same as attempt 02 | same as attempt 02 | Corrected capture: atlas override happens before the only `jamverse.start()`. Stage contains one Kraken player and one visible Jam Stage canvas; one separate loose ball appears. All 32 selector checks pass with no browser errors. Captures/report are under `attempt-02-single-start-atlas-first/native/`. |

All trials used Kraken J.07, the cleanup01 candidate atlas, the Vesper Harbor Undertow court against Blackthorn Court Kings, and the canonical starts `0, 2, 4, 5, 6, 8, 10, 13` at 100% and 120% zoom. The corrected capture report verifies the selected atlas and all 8 frame indices, both mirror states, the native `generated-full-roster-atlases` renderer, one staged player, one visible game canvas, and zero uncaught browser errors. The orange hand beside Kraken's face in the grab pose belongs to the source sprite (visible in atlas cell 3); it is not another ball. The loose basketball is the separate orange sprite at the lower reaching hand.

Attempt 02 calibrates a loose ball across the authored poses. The game must still apply the steal grab event at frame index 3 / tick 5 and transfer ownership on a successful steal; after that event the held-ball track should follow the active hand instead of continuing this loose-ball path. Confirm the later catch/ownership transition in actual gameplay before registering a final track. These trials do not bake a ball into the sprite art.


## Final J.07 acceptance — 2026-10-27

The corrected attempt02 capture set (`attempt-02-single-start-atlas-first/native/`) passed independent review: one player/canvas, correct selected frame/mirror for all 32 samples, low-hook ball contact at tick5 in both facings and zooms, no baked-in ball, no stray artifact, clear HUD. The attempt's track H `[1,.9,.55,.55,.7,.9,1,1]`, F `[5,7,6,6,7,8,7,5]` is registered for Kraken. The steal grab now releases the separate ball from the active defender hand position before loose-ball physics; `tests/animation.test.js` validates tick5 contact, ownership loss, holder stun and loose ball in both facings. `tests/animation-sprites.test.js` verifies all eight frames and mirroring. All rejected harness runs remain preserved above.
