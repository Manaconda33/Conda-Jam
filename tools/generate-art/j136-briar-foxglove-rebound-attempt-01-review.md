# J.136 Briar Foxglove `rebound` — attempt 01 review

Status: **normalized review candidate; production acceptance pending packed-margin re-review**. No production atlas or runtime registration exists yet.

## Source and cleanup

- Exact prompt: `tools/generate-art/j136-briar-foxglove-rebound-attempt-01-prompt.md`.
- ImageGen ID: `exec-28d42204-d0ee-479a-95d3-e97c2fd33abb`.
- Raw source: `tools/generate-art/sources/j136-briar-foxglove-rebound-attempt-01-raw.png` (1536×1024 RGBA; SHA-256 `152c1aeea028b0304b4b7921f92a7cb429969d5576a42470c113d99a114e822e`).
- Attempt 01 source review identified a warm radial glow around the five bodies. The raw source is preserved unchanged. Cleanup keeps the five alpha≥64 body components and their antialiasing inside a one-pixel dilation, removing glow and other components without redrawing or reordering. See `tools/generate-art/candidates/j136-briar-foxglove-rebound-attempt-01/cleanup-report.json` and the light/dark proof.
- Source reviewer: Briar identity/anatomy and pose order pass; frame 3 is the distinct two-hand overhead grab, frame 4 is the chest gather, no ball is baked in, and cell 5 is empty. Proceed to normalization.
- Normalization yields five distinct 80×96 cells, a transparent sixth cell, shared baseline y=94, and no redrawing. All frame alpha≥16 margins are reported in `normalization-report.json`; the tightest margins are 2 px at frame 2 top and the shared baseline. This is the remaining packed-margin review gate.

## Native review and separate ball track

Native Jam Stage candidate reviews use court Y=75, both facings, 100% and 120% zoom. Trial reports are preserved under `tools/generate-art/previews/j136-briar-foxglove-rebound/attempt-01/native-trial*-{100,120}/`. The preview renderer's process-local candidate support also applies the unowned loose ball to rebound frames before the grab anchor.

Trials 1–6 are recorded in `ball-track-trials.json`. Trials 1–2 leave the carried ball above the chest; trial 3 drops it to the waist; trial 4 places it too near the face; trial 5 is borderline and received differing assessments. **Trial 6** is the current candidate: height `[1.05,1.5,2.1,1.9,1.28]`, forward `[5,7,8,3,0]`, owner `briar-foxglove`. It keeps the ball loose and unowned through frame 2/tick 4, catches at frame 3/tick 5, and secures at frame 4/tick 7. Independent native reviewers pass the overhead catch and upper-chest/forearm hold in both facings at both zooms; all five atlas frames select correctly. Trial 6 remains a review candidate until its atlas margin gate is closed.

## Production integration review

After acceptance, the candidate is registered at `public/assets/animation/briar-foxglove-rebound-right.png` and Briar's own track is added to `src/core/animation.js`. Final production-only Jam Stage captures in `final-100/` and `final-120/` confirm the registered 240×192 source, all five correct frames, right-facing/unflipped and left-facing/mirrored selection, loose/unowned frames0–2, Briar ownership at frames3–4, and the same hand contacts at courtY75. Independent integration review passes. The production atlas and track are accepted; validation and deployment status are recorded in the active handoff.

Retain all track trial configurations, filtered rebound-only reports/captures, raw generation, prompt, cleanup, and light/dark previews. Non-rebound screenshots produced by the shared diagnostic renderer were removed after their output paths were excluded from the retained reports.
