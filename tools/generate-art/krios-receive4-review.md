# J.128 Krios `receive` source review

## Accepted artwork, track pending

The accepted source is attempt02's localized composite followed by cleanup01. Attempt01 generated four clear poses for Krios, but its top-right reach (pose1) contains duplicated/ghosted hands and is rejected as a complete sheet. Attempt02 corrected pose1 but changed substantial pixels in all four cells, so that entire edit is not used. `compose-krios-receive4-attempt02.py` takes only the corrected top-right 690×570 cell from attempt02 and preserves poses0,2,3 pixel-for-pixel from attempt01. The composite report verifies source hashes and the exact pose index/cell mapping.

Cleanup01 sets alpha below96 to zero and alpha96–254 to255 while preserving RGB. It removes 65,180 low-alpha haze pixels. Component inspection finds exactly four athlete silhouettes. Independent source and packed-atlas reviewers approve the four distinct poses, complete Krios anatomy/identity, two coherent arms/hands in the reach, frame2/index2 chest-height catch, frame3 secure recovery, clean transparency, and baseline alignment. No ball is painted into the art. The top-right reach keeps a narrow but visible 4–5px margin in its 104×96 packed cell.

Packed atlas: `public/assets/animation/krios-receive-right.webp`, 520×96 lossless WebP, four original frames and one empty cell. Raw attempts, both verbatim prompts, composite script/report, cleanup script/report and light/dark/checker previews are preserved. The athlete-specific receive ball track and runtime registration remain pending; source-art acceptance does not approve the catch track.

## Rejected work

- Attempt01 ImageGen `exec-226255dc-2b64-48fc-8131-26694dcd12b3`, SHA-256 `a60788274a094bf9d52e198bd6596c42dc2ced41e5a353ec25e16958d45df1bc`: rejected as a whole sheet because pose1 contains ghosted duplicate hands/arms. Poses0,2,3 remain the pixel-preserved base.
- Attempt02 ImageGen edit `exec-daedc623-9405-4aa4-b3f2-617e852955ba`, SHA-256 `428a920ee00efa1c378c7d8aba92e3919a6bde9b0d1d563525acd0a7766b3ef0`: pose1 correction is anatomically acceptable, but the edit changed substantial pixels in all four poses. Only pose1 is retained in the documented composite.

## Track integration update — 2026-10-28

The separate Krios receive track is now calibrated: height `[1.1,2.0,2.1,1.2]`, forward `[5,9,9,5]`. The ball reaches frame2 at receive tick4, then ownership transfers and stays with Krios through recovery. The source and atlas remain ball-free. Candidate capture review covers both facings at100%/120%; the independent integration review notes the capture harness injected candidate art/track before manifest integration, while `tests/captain-track-integration.test.js` verifies the checked-in atlas selector, vectors, catch anchor, provenance and capture report. Track evidence: `tools/generate-art/previews/j128-krios-receive-track-candidate/REVIEW.md`.
