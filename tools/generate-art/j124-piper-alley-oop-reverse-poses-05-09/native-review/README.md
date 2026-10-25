# J.124 poses 05–09 native 128×96 review cells

Review-only cells are rendered from cleaned-alpha source crops. Each crop is uniformly resampled in premultiplied-alpha space, capped at 80px high and112px wide by alpha>16 bounds, centered horizontally, and aligned with the alpha>16 bottom edge at y=87. Pose09 attempt2 uses the same policy as pose10 for direct hand-point comparison. Every selected cell remains 128×96 RGBA; no source candidate, prompt, runtime or production atlas was overwritten.

Per-pose JSON in `layouts/` records source and output SHA-256 hashes, crop and content bounds, scale and alpha>16 margins. Current sequence sheets use pose08 and pose09 attempt2. Earlier contact sheets are retained under `rejected-previews/`.

## Visual audit

All selected cells render fully inside the 128×96 canvas. Every edge row and column has zero nontransparent pixels. Alpha>16 margins are:

| Pose | Left | Top | Right | Bottom | Native-cell finding |
|---|---:|---:|---:|---:|---|
| 05 | 40 | 7 | 41 | 9 | Two-hand overhead catch reads clearly. |
| 06 | 42 | 7 | 42 | 9 | Compact chest/shoulder gather reads distinctly. |
| 07 | 35 | 7 | 35 | 9 | Crown-level hands and turned torso/leg silhouette distinguish it from pose05. |
| 08 attempt1 | 34 | 7 | 35 | 9 | Rejected: gripping hand merges with ponytail tie. |
| 08 attempt2 | 26 | 7 | 27 | 9 | Provisional pass: grip visible above/behind crown, distinct from hair and face; free arm counterbalances. |
| 09 attempt1 | 36 | 7 | 35 | 9 | Rejected: screen-right fist misses pose10's reverse-side release point. |
| 09 attempt2 | 37 | 7 | 37 | 9 | Provisional pass: closed fist on screen-left/back side near crown, aligned with pose10's open palm. |

Attempt2 cell hashes: pose08 `1288fe7d8203e3b891af249adff9464d20d11b8d7095a29e237196509517f49e`; pose09 `c72ee51d6b0f8d56cc2a6fd6bc663c21fd17c5a4a90e2a45b5a19aab4e69d70e`.

Current selected native contact sheets:

- `contact-sheets/poses-05-09-native-light.png` — SHA-256 `e221a8af34f5d1a9cbf3471416f201c4d1bcc0efbf1447c570b8c812db2987d3`
- `contact-sheets/poses-05-09-native-dark.png` — SHA-256 `9c226d8f5bd4067fef28240e4cd99b3db72735539292b24d66a8d518a614a08e`

Native pose09-to-pose10 hand-point comparisons:

- `contact-sheets/pose-09-10-hand-points-light.png` — SHA-256 `642e6c9546d2167ee03b6f006ed52bc3f0b6825c5954483a6c6891862690ee3d`
- `contact-sheets/pose-09-10-hand-points-dark.png` — SHA-256 `e1afd633659d67b9998291b2cb21816f0bb498bc0724a1f641715cc343605307`
- 4× nearest versions are saved alongside, with hashes in `layouts/pose-09-10-hand-alignment.json`.

Visual hand-center estimate: pose09 closed fist (41,14), pose10 open palm (42,15), delta about1.4 cell pixels. The visible sequence changes from closed fist to open palm at the same reverse-side point. This supports, but does not establish, track continuity. A first-pass H/F track hypothesis is documented in the lane README; parent Canvas overlay review must verify it before acceptance.
