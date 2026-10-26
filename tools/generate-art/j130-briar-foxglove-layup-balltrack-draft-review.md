# J.130 Briar Foxglove `layup` — separate ball track draft

This is a per-athlete draft in source-art cell coordinates; it is not in runtime code and is not production-calibrated. It is based on the current provisional eight-pose diagnostic. The separate ball appears as a review-only overlay layer in the four facing/background previews under `tools/generate-art/previews/j130-briar-foxglove-layup/balltrack-draft/`; the raw athlete cells are not modified.

The draft uses `src/core/animation.js`'s existing cell-to-track conversion: `height=(70.22-y*0.804)/28`, `forward=(x-64)*0.804/2.2`. Selected right-facing contact centers for frames 00–04 are `(82,50)`, `(80,32)`, `(73,25)`, `(75,17)`, and `(84,11)`. This places the frame 04 ball at Briar's open palm at release. Resulting arrays are:

- height: `[1.072, 1.589, 1.790, 2.020, 2.192]` for frames 00–04; frames 05–07 are unresolved
- forward: `[6.578, 5.847, 3.289, 4.020, 7.309]` for frames 00–04; frames 05–07 are unresolved

The draft timing carries the ball through tick 9 and releases on frame 04 at tick 10. Frames 05–07 have no values in this draft because the ball is ownerless after release; complete the runtime schema only after acceptance, using the actual runtime behavior and tests rather than invented samples. Inspect frame interpolation at ticks 9–10 and retain exact hand/ball continuity at release.

**Review state:** independent review confirms the revised frame-00 ball at `(82,50)` meets the near-side hand at the waist/shorts boundary without covering the jersey center, hovering or clipping. The stored coordinates recompute correctly to height `1.072142857` and forward `6.578181818`. Frames 01–04 also look mostly plausible, especially frame 04 release on/near the fingertips. Interpolation is continuous across frames. The current GitHub `main` Jam Stage renderer was used for native Canvas contact and release continuity at100% and120% in both facings. The process-local candidate captures select frames00–04, keep Briar as sole owner at tick9, and switch to ownerless shot mode at tick10; independent visual review finds the ball aligned to her waist hand at frame00 and release fingertips at tick9, with the live shot moving forward/up at release. This is provisional track evidence only, not runtime calibration or accepted art. Recalculate measurements after any accepted atlas repack; the diagnostic cell crop is not the final atlas rectangle.


## Native preview correction — 2026-10-26

The earlier current-main native preview assessment in this file is invalid for candidate art: the harness added the candidate after production sprites were snapshotted, and the tick9 capture bypassed the candidate track override. Those screenshots rendered fallback art and runtime track coordinates. The harness now applies candidate atlas/track overrides before drawing. Current attempt04 frames03–04 contact/release is provisionally reviewed at120% in both facings; the old five frame values above remain source-cell estimates and must not be treated as the reviewed native track. Exact updated preview values and evidence are recorded in `tools/generate-art/j130-briar-foxglove-layup-frame-03-04-balltrack-review.md`. A100% contact review and frames00–02 calibration remain pending; frames05–07 are after release.
