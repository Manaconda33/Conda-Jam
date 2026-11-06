# Kraken J.07 `pickup` — attempt04 cleanup02

**Preliminary verdict: candidate for Kraken-specific ball-track trials only. Do not register. Independent review and gameplay checks remain pending.**

Cleanup02 combines cleanup01 frames 0, 1, 2, and 4 byte-for-byte with ImageGen pose3 from attempt04. The source generation and exact prompt remain at their original paths; frame-level source lineage, hashes, extraction bounds, and scale are in `cleanup02-layout.json`.

The new pose is isolated from its single alpha-connected figure plus a 1.5-source-pixel alpha fringe. It is uniformly scaled to 54×59 pixels, centered in its 80×96 cell, and aligned to baseline y=90. The other four frames are unchanged. All cells preserve their six-row lower margin. This scale matches the adjacent crouch poses' 52–55 pixel body widths while allowing the extended reaching arm; no nonuniform distortion or redraw is used.

The combined five-pose light native and dark 4× nearest-neighbor previews were inspected. Frame3 now clearly extends an empty cupped hand down beside the front shoe at ankle height. The sequence remains notice/reach, lower, low reach, grab on frame3/tick7, then post-grab recovery. Kraken identity and anatomy are coherent across the transition; the style difference is small and still readable as hard-edged pixel clusters at native size. No basketball is baked in.

Automated checks: 5 unique output frames; preserved frame pixel arrays match cleanup01 for frames 0, 1, 2, and 4; frame3 soles align at y=90 with six transparent rows below; atlas is 400×96; frame durations remain `[2,3,2,1,4]`. The optional `baselineY=90` renderer path has not yet been exercised through the normal loader for this candidate. Do not register before independent visual review, exact tick7 hand/ball contact calibration, and both-facing 100%/120% gameplay validation.
