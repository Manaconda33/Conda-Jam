# GB Design locomotion generation prompts

Canonical reference: Master specification section K.30. GB Design is an anthropomorphic jaguar with a readable feline muzzle and ears and a spotted coat. The basketball kit uses a small correctly oriented Union Jack chest badge and restrained red, white, and blue piping. Never render a flag costume. All generated sources are transparent RGBA with one complete character per cell. The right-facing and left-facing sheets are independently authored three-quarter sprites.

- `idle`: six subtle breathing and weight-shift poses, 3x2 sheet; source `exec-7b0f39b9-21d5-4f48-8424-8868b0977091.png`.
- `idle-ball`: four ready/receive poses, 2x2 sheet. The game draws the ball separately; no ball appears in source art. Source `exec-6902b570-0722-492d-aead-2a848aa53283.png`.
- `dribble`: ten phases of a low dribble, 5x2 sheet. The game draws the ball separately. Source `exec-63b5231b-d7a6-4417-a668-7269bd008e3f.png`; frame 8 uses the low dribble pose at cell 8 of the dribble-run sheet because the original cell touched its top edge.
- `run`: eleven alternating push-off, airborne stride, and landing poses, 4x3 sheet. Source `exec-4661738f-a8ce-4b32-895f-543751a9c3ca.png`; frame 9 uses a clean full-body stride from cell 10 of the dribble-run sheet because the original cell touched its right edge.
- `dribble-run`: eleven moving dribble poses, 4x3 sheet, cell 11 empty. Source `exec-f714eebf-04ba-4e14-b111-132413165a35.png`.

Every source cell is inspected and the single main jaguar silhouette is isolated at alpha >64 before packing. No poses are mirrored; the chest flag's diagonal orientation is preserved.

## Independently authored left-facing sheets

- `idle`: six subtle idle frames, all noses point left; source `exec-9b5b39da-294a-4a3f-bef3-be530ac2c53c.png`.
- `idle-ball`: four ready and receive poses; source `exec-563ad557-8b3d-4bdb-8214-5d8a0e26b729.png`. Two cells with edge contact use valid left-facing idle frames.
- `dribble`: ten low dribble frames; source `exec-911d8a1e-98fb-407d-8874-0175ed59cd27.png`. The edge-touching frame uses a valid left-facing low dribble from `exec-b6289eb7-64f7-4b9f-9e44-6044e466397d.png`.
- `run`: eleven leftward running frames; source `exec-b8e6faba-ff3f-428f-9e53-9223c0a3b024.png`. Frames 4 and 7 use valid low-stride poses from `exec-b6289eb7-64f7-4b9f-9e53-9223c0a3b024.png`; frame 8 uses a valid alternate from `exec-0bbf49d1-4a0d-40d5-991f-af3de4272301.png`.
- `dribble-run`: eleven leftward dribble-run poses; compact-tail sheet `exec-6c162b0c-fb78-4f42-b7f1-950e39246bc3.png`; edge-touching cells 2, 4 and 8 use independently drawn compact-tail poses from `exec-32e06747-a99f-4148-945c-c9920d71b085.png` and `exec-9b0a1c57-f59d-4cc0-abc3-698db5206032.png`.

All left-facing cells were visually checked for direction and are independently authored. Every accepted cell is checked for a complete body component and transparent edge margins before packing.
- The left `run` frames whose original cells touched edges use valid strides from `exec-b6289eb7-64f7-4b9f-9e44-6044e466397d.png` and `exec-0bbf49d1-4a0d-40d5-991f-af3de4272301.png`.
- Compact-tail left `dribble-run` replaces three edge-touching frames with poses from `exec-9b0a1c57-f59d-4cc0-abc3-698db5206032.png` and `exec-32e06747-a99f-4148-945c-c9920d71b085.png`.
