# J.124 poses 05–09 native 128×96 review cells

Review-only cells are rendered from cleaned-alpha source crops. Each crop is uniformly resampled in premultiplied-alpha space, capped at 80 px high and 112 px wide by its alpha>16 bounds, centered horizontally, and aligned with the alpha>16 bottom edge at y=87. Each output remains 128×96 RGBA. Source candidates and prompts are preserved; no runtime or production atlas was modified.

Per-pose JSON in `layouts/` records source and output SHA-256 hashes, crop and content bounds, scale, and alpha>16 margins. `contact-sheets/poses-05-09-native-{light,dark}.png` show the current sequence using pose08 attempt2. The previous contact sheets with attempt1 remain in `rejected-previews/`. A 4× nearest-neighbor light/dark zoom of the replacement grip is included.

## Visual audit

All selected cells render fully within the 128×96 canvas. Every edge row/column is fully transparent. Alpha>16 margins are:

| Pose | Left | Top | Right | Bottom | Native-cell finding |
|---|---:|---:|---:|---:|---|
| 05 | 40 | 7 | 41 | 9 | Two-hand overhead catch reads clearly. |
| 06 | 42 | 7 | 42 | 9 | Compact chest/shoulder gather reads distinctly. |
| 07 | 35 | 7 | 35 | 9 | Crown-level hands and turned torso/leg silhouette distinguish it from pose05. |
| 08 attempt1 | 34 | 7 | 35 | 9 | Rejected: gripping hand merges with ponytail tie; see `../rejections/pose-08-attempt1-review.md`. |
| 08 attempt2 | 26 | 7 | 27 | 9 | Provisional pass: closed grip is visible above/behind the crown and separated from hair and face. Bent forearm route and counterbalancing hand read. |
| 09 | 36 | 7 | 35 | 9 | Diagonal extension and closed fist read; compare against pose10's open palm in the full atlas. |

Attempt2 native-cell file SHA-256: `1288fe7d8203e3b891af249adff9464d20d11b8d7095a29e237196509517f49e`.

Current contact sheets:

- `contact-sheets/poses-05-09-native-light.png` — SHA-256 `63ac5df4e8a09f7bd353be5df542c304b998f2d42e31a9976aa51b3863138504`
- `contact-sheets/poses-05-09-native-dark.png` — SHA-256 `ae383f2513221909fdbdf92bfaf0b987f10c7eaff84a151e9c704d5a8a5b62af`

The old sheets, which still show attempt1, are retained with checksums under `rejected-previews/`.

Pose08 attempt2 4× nearest-neighbor proofs:

- `contact-sheets/pose-08-attempt2-native-4x-light.png` — SHA-256 `98a488f6d49012428d1ee63dcad90aa41b92f0f8dcc90a9a6b0899a3128f3eee`
- `contact-sheets/pose-08-attempt2-native-4x-dark.png` — SHA-256 `337e68b40e67b86e9313a620e37fb7aae452bac84368b1347e145ad20e7d5a0d`

The attempt2 grip passes native-cell review provisionally. Independent full-lane review and complete-sequence review remain pending. These remain review cells, not production atlas frames.
