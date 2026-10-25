# J.124 Piper reverse alley-oop — review-only candidate 1

`atlas-review-only.png` is a transparent 512×384 4×4 contact sheet assembled from the provisionally reviewed 128×96 cells for poses00–14. Cell16 is fully transparent. The selected cells are unique and every alpha>16 margin is at least7px. The source paths, cell hashes, bounds, and proof hashes are recorded in `layout-and-hashes.json`; `assemble-review-sheet.py` reproduces the light/dark proofs and three-times sequence views.

Independent full-sequence review accepts the source poses for continued review: the motion, Piper identity/anatomy, J.123 pixel style, cell transparency, margins, no-ball art, and pose progression read correctly. This candidate remains unaccepted and is not a production-packed atlas.

## Open ball-contact issue

The separate Piper-specific reverse alley-oop ball track is not calibrated. Current pose09 places its closed fist on the forward/right diagonal, while pose10's open release palm is behind the crown on the reverse/left side. A preliminary track would move the carried ball away from pose09's fist between tick19 and release at tick21. Pose09 attempt2 is being generated with a closed fist close to pose10's release hand. Keep this review sheet as candidate1; compare the replacement pose09 and rebuild a distinct candidate2 before accepting or registering any atlas.

No runtime, manifest, or gameplay code is changed here. The ball remains a separate runtime object.
