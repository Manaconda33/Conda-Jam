# J.125 — Briar Foxglove `pass` source review

## Selected source

`tools/generate-art/sources/j125-briar-foxglove-pass-generated-raw.png` is the selected six-pose 3×2 sheet from ImageGen `exec-6fb819a2-33d7-42f7-b624-f25eb32ba690`. It was generated against Briar’s accepted J.109 shoot atlas for identity and style. The exact prompt, ID, raw hash, candidate variants, and the later no-op edit are recorded in the prompt/provenance files. No pixel cleanup was needed.

Briar remains an adult human woman with warm deep-brown skin, shoulder-length dark locs, vivid red headband, compact athletic build, russet/cream sleeveless Emberwood uniform, cream socks, and russet/cream shoes. No fox traits or basketball appear in the art. The progression is 00 ready, 01 chest gather, 02 step/rotation, 03 two-hand release with open fingers, 04 follow-through, and 05 recover. Poses 03/04 remain distinguishable by the open release fingers and the follow-through hand posture.

## Candidate review

- Attempt 1a (`exec-c9aff78a-ac04-48da-9c95-fdabd0b7e42c`) and attempt 1b (`exec-11529f69-5bf0-4ee0-aa0e-8179db08ef41`) are preserved as unselected variants.
- Attempt 2 (`exec-6fb819a2-33d7-42f7-b624-f25eb32ba690`) is selected. Independent review confirms all six cells have complete anatomy, remain within their 512×512 cells, show alpha-zero corners, and have no painted ball. The tightest source margin is pose 03 at 15px on the right; all six are then fit with space inside the production cells.
- Attempt 3 background edit (`exec-36523ab3-7d16-492f-b346-9987d4ad81e1`) is rejected as a no-op: it changed no useful art relative to the selected source and was not used. The apparent brown backdrop in the image viewer is transparent; source corners are alpha 0 and the light/dark proof shows clean transparency.

## Production fit and ball review

The action packer isolates the six authored connected figures, crops their bounds, scales uniformly, and places them in a 3×2 atlas; it does not draw, duplicate, or reorder poses. The production atlas is 336×192, with 112×96 cells. The source review contact sheet is `tools/generate-art/previews/j125-briar-foxglove-pass/attempt1-light-dark-review.png`. Native Canvas preview reports and frame captures at 100% and 120% are under `tools/generate-art/previews/j125-briar-foxglove-pass/native-100/` and `native-120/`. Both facings select all six production frames. At tick 4, the separate ball meets the extended hands; at tick 5 it releases into ownerless pass flight.

Briar's ball stays on a separate athlete-specific track. Candidate coordinates are stored in `j125-briar-foxglove-pass-provenance.json` and were checked in actual `src/main.js` Canvas captures. The track uses the existing pass release anchor (frame 3/tick 5).
