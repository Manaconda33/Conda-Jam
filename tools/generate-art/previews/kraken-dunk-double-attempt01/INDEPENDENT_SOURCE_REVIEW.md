# Kraken `dunk-double` attempt01 — independent source review

**Verdict: reject this raw source for production; do not clean up or register it.** It is a useful action thumbnail, but it fails the requested pixel-art treatment and strict cell-margin standard. The first and second dunk beats are not sufficiently distinct to support acceptance without inventing/reworking poses.

## Provenance check

- Prompt: `tools/generate-art/kraken-dunk-double-attempt01-imagegen-prompt.txt`
- Prompt SHA-256: `ff73116a0cdf8df01505890436897a14467854e6ece01d1dc1b2c20d7ea2e113` (matches provenance).
- Raw: `tools/generate-art/sources/kraken-dunk-double-attempt01-generated-raw.png`
- Raw SHA-256: `3094935f22e9bf29c96bb0658a019fa540eea6ae4adc951f388a0dd020146311` (matches provenance).
- Generation ID: `exec-ef33077d-0aa9-4050-b9ad-974e38f25c22`; 1536×1024 RGBA.

## Findings

- **Alpha:** The brown appearance in the preview is not an opaque backdrop. The corners have alpha 0 (some nearby empty pixels alpha 1); 966,089 pixels are fully transparent. The source also has substantial semitransparent edge pixels (alpha extrema 0–254), so edge cleanup would still be needed. No checkerboard is baked in.
- **Grid and margins:** There are 15 recognizable figures arranged in the intended 5×3 order, but source art does not maintain safe per-cell margins. Using the 307×341 nominal cells, alpha>128 figure bounds touch or cross cell edges in multiple places: poses 2, 4, 5, 6, 7, 9, 10, 11, 12 and 15 have at least one edge at the cell boundary. Examples include pose 2 reaching the row bottom, poses 4/5 meeting at the column boundary, pose 7 touching its left and bottom edges, pose 10 touching left and bottom edges, and pose 15 touching left/top. The source cannot be packed as-is; recropping risks clipping limbs or changing scale.
- **Anatomy and identity:** The same auburn-haired, pointed-ear elf in burgundy/copper uniform and pendant is recognizable throughout. Most silhouettes show head, torso, two arms, two legs and shoes. No ball is baked into the art. The wide poses make full anatomy vulnerable to clipping at the cell edges noted above.
- **Pose sequence/action:** The sheet reads as approach, gather, ascent, airborne extension/rebound, descent and recovery. Several individual poses are distinct, but the double-finish action is ambiguous: the first slam/release is not clearly shown, and the two raised-arm peaks (poses 7 and 12) and extended downward-action poses (8 and 13) are visually similar. Without a ball or hoop by design, the difference between first finish, rebound, second finish and ordinary airborne motion is not legible enough. Do not fill the gap by inventing new frames during cleanup.
- **Style:** Reject. The rendering uses soft painted gradients, blended muscle shading and antialiased contours rather than crisp pixel clusters and a limited retro palette. This is a substantial style mismatch, not a minor edge-cleanup issue.

## Reuse / acceptance status observed during this review

At review time, `public/assets/animation/manifest.json` lists these 20 Kraken right-facing clips as reviewed: `idle`, `idle-ball`, `dribble`, `run`, `dribble-run`, `block`, `steal`, `celebrate`, `shoot`, `pass`, `pass-overhead`, `pass-behind`, `pickup`, `receive`, `layup`, `fall`, `push`, `layup-reverse`, `rebound`, and `dunk-power`. `dunk-double` is absent from the manifest and remains unaccepted.

There is a documentation mismatch to resolve at the next status refresh: `docs/animation-production/ASSET_STATUS.md` still says Kraken is 19/29 and lists `dunk-power` as a gap, while the manifest marks `dunk-power` reviewed. Its current provenance and `normal-loader-runtime/INDEPENDENT_NORMAL_LOADER_REVIEW.md` include 60 normal-loader captures across both facings and 100%/120%, and the report hash matches the packed atlas, so I found no evidence that `dunk-power` was accepted solely from the earlier candidate-injected trial. The status/audit should be refreshed to include it before reporting counts. No other incorrectly accepted Kraken clip was established by this read-only audit.
