# Kraken J.07 `pickup` attempt01 independent track review — 2026-10-28

**Verdict: PASS for further integration review only. Not accepted or registered.**

## Materials and evidence

- Reviewed the attempt02 source and cleanup reviews, candidate layout and light/dark previews, attempt01 `report.json`, and representative tick00, tick07, tick08, and tick11 captures for both facings at 100%/120% zoom.
- The capture uses the current Jam Stage. It injects the candidate atlas and Kraken-specific track in page memory, initializes one loose-ball fixture per run, then advances the real `stepMatch` path without per-tick ball/player teleports. It is not a normal-loader capture of a registered asset.
- All 32 screenshot paths and SHA-256 entries match. No browser errors or failed requests were recorded.

## Findings

- The candidate selects the expected atlas and all five authored frames. Right-facing captures use the source without flip; left-facing captures mirror it. The athlete remains on-screen at both zoom settings.
- The source maintains Kraken's auburn hair, pointed ear, copper amulet, burgundy/copper uniform, and full anatomy. Hands are ball-free in the cleaned art. The source/cleanup reviewers permit these pixels for track trials, not runtime packing; the bottom clearance is only 2 px and the illustrative shading remains a style concern.
- The loose ball stays unowned through tick6. At tick7/frame3, the normal simulation emits “Kraken grabs the ball” and transfers ownership to Kraken. At tick8/frame4 and through tick11, the ball remains carried by Kraken. This timing and ownership sequence is consistent in both facings and both zooms.
- At the grab frame, the ball is adjacent to the low reaching hand; the screenshots do not prove exact pixel contact at every intermediate point. Post-grab placement remains near the low hand/waist as Kraken recovers.

## Remaining gates

This is a candidate-only fixture, not validation from a normal user gameplay entry or normal-loader asset registration. Before acceptance, run the candidate through the standard loader with an actual loose-ball gameplay transition, verify contact through all five poses, and review the atlas packing margin. Keep the candidate unregistered until those checks pass.
