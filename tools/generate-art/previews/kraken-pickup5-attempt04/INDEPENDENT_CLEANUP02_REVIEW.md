# Kraken J.07 `pickup` — cleanup02 independent review

## Verdict

**Pass for Kraken-specific ball-track trials only. Not approved for runtime registration or production.** The new frame03 corrects the ambiguous grab pose well enough to calibrate a separate ball track; no candidate track or normal-loader gameplay review is present yet.

## Review findings

- Cleanup02 combines attempt03 cleanup01 poses 0, 1, 2, and 4 with the separate attempt04 ImageGen pose03. The four reused cells compare pixel-identically with cleanup01. Raw sources and exact prompts remain preserved at their original paths; frame lineage, bounds and hashes are recorded in `cleanup02-layout.json`.
- Frame03 source is generation `exec-fa7b159c-0083-48d9-b25e-0da6650e06cc`, a single Kraken figure. It has a distinct alpha-connected silhouette, and the cleanup retains original RGB/alpha only on that component and a 1.5px edge fringe. No ball or orange ball-shaped object is visible in the new pose or combined atlas.
- Sequence reads at native 80×96 and at 4× nearest-neighbor: notice/reach, lower, deepest low reach, empty ankle-level grab on frame03/tick7, then post-grab recovery. The new hand is open and curled beside the front shoe, separated from the knee/thigh; the following frame brings both hands to waist level. The timing semantics are legible, though the one-tick hand contact still needs the separate runtime ball to prove exact placement.
- Kraken identity/anatomy remain coherent across the sequence: auburn hair, pointed ear, copper amulet, natural skin, burgundy/copper kit and shoes. All figures are full-body, with visible hands/feet and no apparent detached anatomy. The new pose is a little brighter and more blocky than its neighbors, but remains a good crisp pixel-art match at native scale.
- Effective body scale is consistent at runtime size: reused frames retain their cleanup01 dimensions; the new wide reach is 54×59 px, matching adjacent crouch widths (52–55 px) without nonuniform distortion. The atlas is 400×96 with five distinct frames. All visible soles align at cell coordinate y=90; each frame has six fully transparent rows below. Frame03 margins are 13/13px horizontally and 31px above.
- `baselineY: 90` is correctly recorded in candidate metadata. The optional renderer baseline offset has not yet been exercised with this atlas via the normal loader, so that remains a required integration check.

## Required before acceptance

Calibrate the separate Kraken-specific pickup track with the ball meeting the open hand at the frame03/tick7 anchor and following the recovery pose. Then test normal-loader selection, baseline continuity, both facings and 100%/120% zoom. Do not register before those checks and independent gameplay review pass.
