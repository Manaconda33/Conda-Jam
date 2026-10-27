# Captain animation lane checkpoint — 2026-10-27

## Current work

The isolated branch `codex/captain-animation-completion` starts from published `main` at `b8ead761`. It integrates six individually generated, right-facing Leo (captain) clips: `block`, `push`, `fall`, `celebrate`, `pass`, and `pass-overhead`. Leo remains on the original bespoke captain path. No captain assets were shared, recolored, or consolidated.

The source PNGs, exact generation prompts and IDs, original packed atlases, layout files, source notes, and provenance JSON are preserved under `tools/generate-art/`. The originals remain available as candidates; runtime points to separate lossless WebP derivatives. Review found detached alpha fragments in the original packed candidates, so the deterministic cleanup removes only 8-connected components of at most six visible pixels within each authored cell. The cleanup utility and per-frame removals are `tools/generate-art/clean-leo-captain-atlas.mjs` and `tools/generate-art/leo-captain-cleanup-report.json`. Independent review found lingering detached specks in the first derivatives; the cleanup was tightened to remove exterior haze beyond the one-pixel antialias edge and isolated non-canon chromatic edge pixels. The original atlases remain unchanged. Refreshed opaque light/dark 4× proofs were independently reviewed and pass silhouette, anatomy, identity and edge quality. Light/dark enlarged proofs are under `tools/generate-art/previews/leo-captain-support-integration/`.

| Clip | Unique frames | Atlas | Generation ID |
| --- | ---: | --- | --- |
| `block` | 4 | 160×192 | `exec-bb7fb56c-71d7-4739-8d97-d88be6768615` |
| `push` | 11 | 448×288 | `exec-6e7dfbe6-0385-414a-af4f-50119684a5d6` |
| `fall` | 10 | 480×192 | `exec-05b210be-22b1-4b65-8161-c629cdc63e0f` |
| `celebrate` | 10 | 400×192 | `exec-6f1f8451-0ce5-4771-bd09-b5439633c79a` |
| `pass` | 6 | 336×192 | `exec-89d2bf88-8242-466a-8c1a-429d0e79abef` |
| `pass-overhead` | 6 | 288×192 | `exec-e1a09303-9223-46f6-9ecd-e832e2f48083` |

The visual review confirms Leo's pale adult human anatomy, long black hair, mustache, and black/crimson uniform; each sequence has the expected action order and frame count. The four ball-free clips use Leo’s canon-approved mirror policy. Chest pass uses H `[1.65,1.9,1.9,2.05,2,1.05]`, F `[3.75,4.75,8.5,9.75,9,7]`; carry lasts through tick4 and release is tick5. Overhead pass uses H `[1.1,2.3,2.3,2.7,3.2,1.25]`, F `[4.5,4.8,4.7,6.5,7,7]`; carry lasts through tick6 and release is canonical tick7. The overhead prompt says tick5, but the authoritative clip definition says tick7; this mismatch is documented, and gameplay timing remains unchanged. Both tracks passed deterministic release/ownership tests and Jam Stage review in both facings at100%/120%. All eight overhead calibration trials are preserved, including invalid harness runs and rejected heights.

## Audit and validation

The refreshed strict audit decodes 2,331 effective clip assignments from 504 unique atlases and 4,783 unique source drawings. It reports 772 missing assignments, all for captains, and four inherited `prompt-not-verbatim` findings. Leo is at 11/29; 31 captains remain incomplete. Supporting coverage remains 63 derived libraries plus seven retained original libraries. The audit is intentionally still incomplete.

Validation passed on this checkpoint: `npm test` (517 tests), `npm run lint` (21 modules), `npm run validate:content` (35 franchises, 105 athletes, 35 captains), `npm run build`, and the strict report-only animation audit. Six candidate atlases were visually inspected at native pixel scale and at 4× on light and dark backgrounds. Chromium E2E passes the complete production journey suite, including offline standalone start, co-op controls, full match, dunk scenarios, and season progression. The production Jam Stage capture harness was corrected to hold the selected ticks and center Leo in the current court. Its accepted run captured all 35 frames in both facings at 100% and 120% zoom (140 images), with the ball dead and unowned throughout and zero browser errors. Reviewed 100% contact sheets confirm full playable framing, no cropping, coherent actions and safe facing variants for all four clips. Raw captures and per-frame records are under `tools/generate-art/previews/leo-captain-support-integration/native/`. Both pass tracks have production Jam Stage captures under their own calibration folders; J.106 source light/dark proofs are `tools/generate-art/previews/leo-pass-overhead-atlas-light.png` and `tools/generate-art/previews/leo-pass-overhead-atlas-dark.png`.

## Next captain work

Leo `pass` and `pass-overhead` are accepted with separate athlete-specific tracks. Continue Leo’s bespoke captain library by current missing-action order; 14 additional source-only Leo atlases remain in the source workspace, and their tracks, registration evidence and canon/mirror checks must be individually reviewed. Eight more Leo actions still need original art. Then proceed through other captains by current strict-audit priority. Do not count source-only clips until lineage, atlas, mirror policy and any required athlete-specific ball track pass review.

The source workspace `/workspace/Conda-Jam` contains unrelated in-progress J.130/J.131/J.137 art and extensive untracked evidence; it was left untouched. The user-owned J.106 helper remains preserved.
