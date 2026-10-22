# Alexithymia locomotion atlas prompts

Canonical source: JAMVERSE '96 specification, K.20. Alexithymia is the tall Android detective in a noir suit, fedora, and long split-tail coat. The display face is always a perfectly blank black screen. Never add human facial anatomy, eyes, screen graphics, lens, earpiece, or glow. All panels below face right; the manifest policy authorizes mirroring this character after review. Game code draws the ball separately.

All sources were created with the image generation tool as transparent contact sheets, then visually reviewed. Complete isolated silhouettes use minimum three source-pixel alpha margins when packed, allowing cell edges to be traced without clipping.

- **idle:** six restrained breathing/head-tilt poses (3x2), source `exec-fb899cbc-b747-4e56-a99e-38d62b23ffd7.png`.
- **idle-ball:** four receiving/pass-ready poses (2x2), source `exec-f72e1324-2dbe-4b18-844f-090099598a39.png`.
- **dribble:** ten grounded bounce-cycle poses (5x2), source `exec-79dca7ac-b2b2-4810-8efe-eeb44252981d.png`; final pose uses the matching ready pose from idle-ball because the generated final dribble cell cropped the fedora at the sheet edge.
- **run:** eleven distinct alternating strides (4x3, last cell blank), source `exec-c90d6cea-7184-4f82-84ba-bae531949000.png`.
- **dribble-run:** eleven low-hand running-dribble poses (4x3, last cell blank), source `exec-e4996cd9-66e7-4960-bc20-73ab29052a05.png`.

Each atlas is losslessly packed as WebP at a normalized pose height of 72 pixels and baseline 94 in 96-pixel cells. Source image hashes and exact extracted rectangles are recorded in `alexithymia-locomotion-layouts.json`.
