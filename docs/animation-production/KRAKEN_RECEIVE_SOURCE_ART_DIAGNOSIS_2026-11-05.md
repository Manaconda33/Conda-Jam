# Kraken receive: verified source-art discontinuity

**2026-11-05, review-only corrective diagnosis.** No sprite, renderer, physics, audio, or accepted production source changed. Do not mark the Kraken receive animation visually accepted or merge the dependent PR stack on the basis of passing mechanics alone.

## Finding

**Visual HOLD B has a reproducible source-art cause.** Kraken's accepted `receive` WebP atlas contains four valid frames, but frames **0, 1 and 3** have a markedly darker, less saturated and coarser-looking pixel treatment than **frame 2**, which resembles Kraken's other newer `pass` animation art. This difference already exists inside the original registered atlas and is visible **before any game renderer, mirroring, palette, ball overlay, or gameplay animation code is involved**. The earlier 120% court screenshots magnify the same underlying source discrepancy.

The accepted raw artwork has **not** been altered or corrupted. This is a **style-continuity / original-frame-composition issue**, not a broken hash or demonstrated sprite-selector regression.

## Immutable source, verification and exact frame geometry

- Immutable source: original published PR #6 commit `55a2ab104d6b108cc08132fddc01b32afb958e75`.
- Diagnostic-only export workflow on draft PR #13: [`kraken-receive-source-visual-diagnosis.yml`](https://github.com/Manaconda33/Conda-Jam/blob/maintenance/pr6-pr7-reconciliation-probe/.github/workflows/kraken-receive-source-visual-diagnosis.yml), successful [GitHub Actions run 42168891431](https://github.com/Manaconda33/Conda-Jam/actions/runs/42168891431), original [artifact 13479523465](https://github.com/Manaconda33/Conda-Jam/actions/runs/42168891431/artifacts/13479523465).
- Workflow asserts the exact original PR #6 SHA before reading any assets and exports the four registered, SHA-256-verified WebP atlases (`idle`, `idle-ball`, `receive`, `pass`) and the exact `manifest.json` frame rectangles. No Python or image-generation software in the runner and no production writes.
- `idle`: **6 × 80 × 96** cells, registered atlas SHA-256 `e25a27df957386029a2f08c1f84d8fc3401a8a3a8d28b5835033f731d8deac75`.
- `idle-ball`: **4 × 80 × 96** cells, registered atlas SHA-256 `e3c2de07051b18656e651b0d2cc9b03d3fc5a429b981a12b03dcf378b2400554`.
- `receive`: **4 × 80 × 96** cells, registered atlas SHA-256 `e6676faa9e2deff7ddbb0d94f87d3d02e54538d8a9802ef2c3e98a8bd53cddbb`.
- `pass`: **6 × 80 × 96** cells, registered atlas SHA-256 `dd37b01fcd384ea061b71388e2b40b0fb455e581a769e7cf674ab5e25361f613`.
- Original archive ZIP SHA-256: `b68cae79fc9f3ef74fa74e2f7c64ffd08d744fa48cc2430676733d609aa55d4b`. Original `frame-geometry.json` SHA-256: `56f00a2b7e65ef121d96ce65ad9bee847541781c79bffa6828cc28fed2af0351`.
- Local evidence bundle `kraken-receive-source-qa-evidence.zip`, which contains four exact WebPs, extracted metric JSON, source contact sheet and frame geometry, SHA-256 `ee6f9b81e811c0f017132cda422238510b389d57447a3908f914b01a5e7ebcce`. Source contact sheet SHA-256 `a5c618d3f52b31b3400d5962e0e124e1c7b90c41129e38739eea4d28f504c0c7`. Local analysis was read-only; output contact sheet resizes original frame pixels with nearest-neighbor sampling over a checkerboard.

## Per-frame source-pixel comparison

Color measurements were calculated from original RGBA pixels in each manifest frame rectangle. Visible pixels require alpha at least 32. Saturation = `(max(R,G,B)-min(R,G,B))/max(R,G,B)` when max is nonzero; brightness = `max(R,G,B)/255`. Values are **not** subjective art-quality grades.

| Original source frame | Mean visible saturation | Mean visible brightness | Visible cell coverage | Visible alpha bounding box in 80×96 cell |
| --- | ---: | ---: | ---: | --- |
| Kraken idle 0 | 0.789 | 0.545 | 33.55% | x15–63, y2–93 |
| Kraken idle-ball 0 | 0.790 | 0.537 | 28.10% | x10–68, y17–93 |
| **Kraken receive 0** | **0.608** | **0.471** | **16.89%** | x13–65, y24–93 |
| **Kraken receive 1** | **0.605** | **0.445** | **17.54%** | x5–74, y24–93 |
| **Kraken receive 2** | **0.843** | **0.533** | **18.40%** | x15–64, y24–93 |
| **Kraken receive 3** | **0.609** | **0.453** | **17.68%** | x13–65, y24–93 |
| Kraken pass 0 | 0.829 | 0.531 | 21.12% | x15–64, y21–93 |

Receive frames 0, 1 and 3 average approximately **0.607** saturation, while frame 2 is **0.843** and the six reviewed pass frames average **0.830**. The first-group brightness averages approximately **0.456** versus **0.533** for frame 2 and **0.524** for pass. Their alpha bodies occupy approximately 17–18% of cell area vs 32–34% for Kraken's upright idle frames. The height difference may be partly intentional for action poses, but the color/outline discontinuity between receive frames within the **same clip** is not an interpolation artifact.

### Existing authored-source lineage corroborates this diagnosis

In `tools/generate-art/clean-kraken-receive4-attempt02-cleanup02.py` at the pinned original source, the accepted receiving atlas is composed from **prior attempt-01 frames [0, 1, 3]**, with **frame 2** replaced by a cleaned, newly generated catch pose. This independently corroborates why only one of the four frames has the newer, more saturated presentation.

The prior [independent game-loader review dated October 29, 2026](https://github.com/Manaconda33/Conda-Jam/blob/55a2ab104d6b108cc08132fddc01b32afb958e75/tools/generate-art/previews/kraken-receive4-attempt02/track-candidate/attempt-04/normal-loader/INDEPENDENT_GAMEPLAY_REVIEW_2026-10-29.md) recorded **PASS for registration**, correct frame selection and ball handoff, while explicitly acknowledging a modest source color/style contrast. The present direct atlas comparison and later side-by-side live-gameplay captures elevate that known contrast to a specific **integration visual hold**. Neither review establishes that the original binary is broken.

## Renderer differential and candidate correction path

The existing `src/render/animation-sprites.js` `selectProductionSprite` selects the manifest's correct `receive` frame from Kraken's original authored atlas, mirrors for left-facing as permitted, and does not invoke supporting-player `paletteVariantFor` for captain Kraken. Existing exact source tests confirm catch on `receive` tick 4 = **frame 2**, and tick 5 = **frame 3**; the native Marin-to-Kraken pass validates ownership and catches. The visual change between catch frame 2 and cradle frame 3 is therefore the original source frame sequence being displayed, not evidence of a new global palette-mask issue.

**Recommended next bounded corrective candidate, not yet performed or approved:**
1. Prepare an **isolated four-frame Kraken `receive` candidate** retaining current frame indexing, durations `[2,2,1,3]`, horizontal mirroring and ball track H `[1.3,1.4,1.74,1.2]`, F `[3,4.5,3,2]`. Preserve the accepted frame-2 catch pose and its verified tick-4 ball contact.
2. Replace/refine the inconsistent **frames 0, 1 and 3 only** using original-authored, visually coherent Kraken imagery. Do not simply copy identical pass poses into receive without verifying the intended anticipation, arm reach, and cradle phases.
3. Compare candidate vs original at **source pixel level** and in **real gameplay**, both facings and 100/120 zoom at pass-catch steps 5, 7, 9, 10, 11, then inspect actual wrist/fingertip contact, height, baseline and silhouette transitions. Re-run focused Kraken catch tests and the scoped full test suite if the integrated source is changed.
4. Obtain independent artwork acceptance before replacing any production atlas. Store the source generation/asset lineage and accepted frame hashes permanently. Keep original source recoverable, and preserve all existing PR #6, #7, and #16 original history.

**Do not** change the renderer's global palette, baseline, ball physics, Marin's 9/8/9 turbo calibration, or any accepted source just to make the captures appear less discontinuous.

## Scope and review status

- **Completed:** Original source-art versus renderer differentiation, four atlas SHA checks, 20 original authored frame crops inspected visually, quantitative alpha/palette comparison, archived compositing lineage matched, exact source frame sequence identified.
- **Still HOLD:** Kraken receiving-clip **visual art acceptance**, Marin normal-dribble start/wrap hand-contact review, strict asset backlog, true non-sparse historical checkout, independent integration approval and explicit merge authorization.
- Existing **587/587 scoped gameplay tests** remain green as the last known full scoped run; this diagnostic changed no game source and did not rerun that suite.

**Disposition: DO NOT MERGE / DO NOT DEPLOY.** Draft PR #13 remains diagnostic, draft PR #16 remains source preservation and evidence; original PR #6, PR #7 and `main` remain unchanged.
