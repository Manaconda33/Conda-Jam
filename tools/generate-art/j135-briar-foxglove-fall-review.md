# J.135 Briar Foxglove `fall` — accepted and registered locally

Attempt 03 is accepted as the J.135 production source and registered in the local manifest. It contains ten complete, distinct, ball-free poses in a 5×2 atlas. The normalized 560×192 PNG uses 112×96 cells, ten unique decoded frames, and shared baseline y=94. Identity, anatomy, pose order, transparency, margins, and the russet/cream palette against Briar's accepted push sprites passed independent source, packed-size, and native reviews.

The alpha≥16 packed margin minimum is2px at the shared baseline; frame3 has6px left and7px right. Independent reviewers approved these measurements at packed scale. Native Jam Stage preview reports use court y=75, both facings, and 100%/120% zoom; all ten frames select their corresponding production pose at ticks `[0,2,4,6,9,12,16,21,27,33]`. Frame9 is the finish anchor at tick33 of the 40-tick clip. Across all captures the ball is dead and unowned. No Briar carry track applies during fall.

- Attempt00 (`exec-1cdabf76-988a-434d-bcc2-b7719a7e749d`) is rejected because its prompt contradicted Briar canon (high ponytail/side fringe and a misgendered pose description). The raw image and exact submitted prompt remain preserved.
- Attempt01 (`exec-f49bcbcc-81d0-4e25-af10-490456437dc8`) is rejected for pose2/3 cell spill, tight right clearance, and bright red/white kit colors.
- Attempt02 (`exec-ed884ebf-c2ac-467d-a573-2e0716544469`) is superseded and remains preserved; attempt03 was edited from it.
- Attempt03 (`exec-a1140609-9874-4d6d-bc22-86f311bcb31a`) is accepted. The source review measured13px minimum alpha≥16 raw-cell clearance. The normalizer isolated exactly ten cell-mapped body components and discarded no components; it did not redraw or invent poses. The final PNG is `public/assets/animation/briar-foxglove-fall-right.png` (SHA-256 `8c9d118d7e75aaa4989189eb8bc415f80e016b22251f778b6c657904f1dc58fb`).

Verbatim prompts, all generation IDs, raw images and hashes, rejected/superseded sources, light/dark proofs, cell margins, normalized layout, and native captures are indexed in `tools/generate-art/j135-briar-foxglove-fall-provenance.json`. The normalization script is `tools/generate-art/normalize-j135-briar-foxglove-fall-attempt-03.py`. Native reports and captures are under `tools/generate-art/previews/j135-briar-foxglove-fall/attempt-03/native-{100,120}/`.
