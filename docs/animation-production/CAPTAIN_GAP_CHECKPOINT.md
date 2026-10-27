## Current J.118 Leo `dunk-power` checkpoint — 2026-10-27

J.118 is accepted and registered from generation `exec-9e936652-930b-4365-acbc-2b351c6a34d0`. Its 15 original poses retain Leo's pale human identity, long wavy black hair, mustache, full anatomy and black/crimson kit; the packed 4×4 atlas has 15 populated cells, a transparent cell16 and baseline y=94. Original source, exact prompt, raw PNG/hash, layout and light/dark previews remain preserved.

The Leo-specific accepted track (height `[.95,1.1,1.25,1.45,1.5,2.3,2.1,2.3,1.7,.5,-.9,1.4,1.3,.9,.65]`, forward `[6,8,6,2,0,-3,-5,5.5,0,5,5,10,7,5,6]`) is attempt05. Five complete track attempts and their 60-capture Jam Stage reports are preserved under `tools/generate-art/previews/leo-dunk-power-track-candidate/`; attempt01–03 were rejected for visible hand gaps, attempt04 passed to final fine-tuning, and attempt05 passes independent review at both facings and 100%/120%. Deterministic simulation verifies carry through tick20, one ownerless release on tick21, and scoring at finish tick23. See `tools/generate-art/j118-leo-dunk-power-track-trials.json`.

Validation: `npm test` 527/527; lint 21 modules; content validation 35 franchises / 105 athletes / 35 captains; static build PASS; focused Leo dunk simulation PASS. Strict report-only audit generated 2026-10-27: 2,338 inspected clip assignments, 511 source atlases, 4,834 unique source drawings, 765 missing captain assignments across 29 incomplete captains, zero target shortfalls and four inherited prompt findings. Leo has 15 registered clips. Next roster-order target: J.119 Leo `dunk-windmill`; its reviewed source is ready for native track and runtime review.

# Captain animation lane checkpoint — 2026-10-27

## Current work

### J.111 Leo `layup-reverse` remains source-only

The original eight-pose source is preserved under the J.111 files, but it is not accepted for runtime. Its full-size release pose has a visible profile and mustache; both become indistinct in the packed 80×96 cell. A separate reviewer confirmed the face is not legible at runtime resolution, so the atlas and proposed Leo ball track remain unregistered. Four correction generations are preserved with exact prompts, IDs, raw outputs, hashes and rejection reasons in `tools/generate-art/j111-leo-layup-reverse-attempts.json`. The attempts repeatedly produced an opaque brown backdrop or, once, extra ball props. Further correction must solve face readability at packed size while preserving transparent pixel-art output.

The isolated branch `codex/captain-animation-completion` starts from published `main` at `b8ead761`. It integrates twelve individually generated, right-facing Leo (captain) clips: `block`, `push`, `fall`, `celebrate`, `pass`, `pass-overhead`, `pass-behind`, `receive`, `pickup`, `layup`, `steal`, and `rebound`. Leo remains on the original bespoke captain path. No captain assets were shared, recolored, or consolidated.

The source PNGs, exact generation prompts and IDs, original packed atlases, layout files, source notes, and provenance JSON are preserved under `tools/generate-art/`. The originals remain available as candidates; runtime points to separate lossless WebP derivatives. Review found detached alpha fragments in the original packed candidates, so the deterministic cleanup removes only 8-connected components of at most six visible pixels within each authored cell. The cleanup utility and per-frame removals are `tools/generate-art/clean-leo-captain-atlas.mjs` and `tools/generate-art/leo-captain-cleanup-report.json`. Independent review found lingering detached specks in the first derivatives; the cleanup was tightened to remove exterior haze beyond the one-pixel antialias edge and isolated non-canon chromatic edge pixels. The original atlases remain unchanged. Refreshed opaque light/dark 4× proofs were independently reviewed and pass silhouette, anatomy, identity and edge quality. Light/dark enlarged proofs are under `tools/generate-art/previews/leo-captain-support-integration/`.

| Clip | Unique frames | Atlas | Generation ID |
| --- | ---: | --- | --- |
| `block` | 4 | 160×192 | `exec-bb7fb56c-71d7-4739-8d97-d88be6768615` |
| `push` | 11 | 448×288 | `exec-6e7dfbe6-0385-414a-af4f-50119684a5d6` |
| `fall` | 10 | 480×192 | `exec-05b210be-22b1-4b65-8161-c629cdc63e0f` |
| `celebrate` | 10 | 400×192 | `exec-6f1f8451-0ce5-4771-bd09-b5439633c79a` |
| `pass` | 6 | 336×192 | `exec-89d2bf88-8242-466a-8c1a-429d0e79abef` |
| `pass-overhead` | 6 | 288×192 | `exec-e1a09303-9223-46f6-9ecd-e832e2f48083` |
| `pass-behind` | 6 | 336×192 | `exec-2ff99ab9-fa21-4f68-882c-76c419637383` |
| `receive` | 4 | 192×192 | `exec-69fdeb9a-c4fe-4d0b-a424-412012469435` |
| `pickup` | 5 | 336×192 | `exec-3367d441-68b5-4b6a-8591-5dfbbe77ace3` |
| `layup` | 8 | 320×192 | `exec-ed078327-ebab-4bd1-b390-ef2fde79cbce` |
| `steal` | 8 | 448×192 | `exec-10be67e6-cd16-4ffe-aedb-e1ed4c7982b5` |
| `rebound` | 5 | 144×192 | `exec-bd4af4d4-34e8-4379-ad24-594842a49409` |

The visual review confirms Leo's pale adult human anatomy, long black hair, mustache, and black/crimson uniform; each sequence has the expected action order and frame count. The six ball-free clips use Leo’s canon-approved mirror policy. Chest pass uses H `[1.65,1.9,1.9,2.05,2,1.05]`, F `[3.75,4.75,8.5,9.75,9,7]`; carry lasts through tick4 and release is tick5. Overhead pass uses H `[1.1,2.3,2.3,2.7,3.2,1.25]`, F `[4.5,4.8,4.7,6.5,7,7]`; carry lasts through tick6 and release is canonical tick7. The overhead and behind-pass prompts say tick5, but their authoritative clip definitions say tick7; the discrepancies are documented, and gameplay timing remains unchanged. All three pass tracks passed deterministic release/ownership tests and Jam Stage review in both facings at100%/120%. All eight overhead and four behind-pass calibration trials are preserved, including invalid harness runs and rejected placements.

J.110 `layup` is accepted with eight distinct ball-free poses and Leo-specific track H `[0.95,0.8,2.0,2.6,2.35,1.8,0.95,0.6]`, F `[5,3,5,4.5,14,11,7,5]`. Attempt04 closes the tick8/9 raised-hand gap; attempts01–03 and their reports remain preserved. Its 36 captures cover both facings and 100%/120%; the actual simulation verifies carry to canonical tick10 release exactly once, correct release anchors and ownerless flight through finish. Light/dark previews and full provenance are retained.

J.109 `pickup` is accepted with five distinct, ball-free poses. Its Leo-specific track H `[0.95,0.65,0.1,0,1.1]`, F `[6,9,12,11.5,8]` aligns the separate ball at frame3/tick7 ground contact and carries it through recovery. Attempts01–03 are retained and rejected for contact/recovery placement; attempt04 has 28 native captures across seven action ticks, both facings, 100%/120%, and zero browser errors. A real simulation test proves the ball remains loose through tick6, Leo owns it from tick7, and recovery continues through tick8 in both facings. The source reviewer confirmed the five poses, empty sixth cell, clear identity/anatomy, no ball art, and no clipping. Light/dark proofs are preserved.

J.108 `receive` is accepted as a four-pose, ball-free original. The source has complete Leo identity/anatomy and safe mirrored presentation. Its catch anchor remains tick4. The accepted Leo-specific track is H `[1.15,2.0,1.9,1.45]`, F `[8,13,8,3]`; frame1 reaches, frame2 meets the hands, and frame3 carries at chest through recovery. Attempt01 (F `[8,13,16,11]`) is preserved but rejected for overshooting. Attempt02 has 24 Jam Stage captures across ticks0/2/3/4/5/7, both facings, 100%/120% zoom. A separate real-simulation test confirms possession remains with the passer through tick3, changes to Leo at tick4, and follows the accepted track through recovery. Light/dark source previews and both attempts are retained.

### J.113 Leo `steal` accepted

The eight-pose Leo source passes independent identity, anatomy, contact-pose and atlas review. Frame3/tick5 reaches an open hand; no ball is baked into the art. The registered separate track is H `[1.05,1.0,0.8,1.15,1.25,1.1,1.1,1.1]`, F `[6,9,12,12.5,6,7,7,6]`. A first successful steal jars the opponent's ball loose at tick5; simulation schedules a second steal catch and gives Leo sole possession at its tick5 grab. Jam Stage attempt04 shows frame3 contact and frame4 recovery contact at100%/120% in both facings. Attempts01–03, exact candidate tracks, screenshots and rejection reasons are retained under `tools/generate-art/previews/leo-steal-track-candidate/`; independent review accepts attempt04. Deterministic simulation checks confirm loose-ball and ownership transitions in both facings.

### J.115 Leo `rebound` accepted

Five poses pass independent source review; the sixth atlas cell is empty. Leo's separately rendered track H `[1.1,1.55,2.25,1.85,1.25]`, F `[5,7,10,4.5,4.5]` meets the frame3/tick5 catch and follows the pull-down at frame4/tick7. The ball remains loose/unowned through tick4; deterministic simulation gives Leo sole ownership at tick5 in both facings. Attempt01's catch was too high and too far forward; attempt02 passes independent Jam Stage review in both facings at100%/120%, with 32 captures and zero browser errors. All trials, light/dark proofs and provenance are retained under J.115 files.

## Audit and validation

The refreshed strict audit decodes 2,337 effective clip assignments from 510 unique atlases and 4,819 unique source drawings. It reports 766 missing assignments, all for captains, and four inherited `prompt-not-verbatim` findings. Leo is at 17/29; 29 captains remain incomplete. Supporting coverage remains 63 derived libraries plus seven retained original libraries. The audit is intentionally still incomplete.

Validation passed on this checkpoint: `npm test` (64 test files pass), `npm run lint` (21 modules), `npm run validate:content` (35 franchises, 105 athletes, 35 captains), `npm run build`, and the strict report-only animation audit. Twelve registered candidate atlases were visually inspected at native pixel scale and at 4× on light and dark backgrounds. Chromium E2E passed the offline, full-match and season journeys on this checkpoint; J.108–J.115 simulation checks pass independently. The production Jam Stage capture harness was corrected to hold the selected ticks and center Leo in the current court. Its accepted run captured all 35 frames in both facings at 100% and 120% zoom (140 images), with the ball dead and unowned throughout and zero browser errors. Reviewed 100% contact sheets confirm full playable framing, no cropping, coherent actions and safe facing variants for the six ball-free clips. Raw captures and per-frame records are under `tools/generate-art/previews/leo-captain-support-integration/native/`. All three pass tracks have production Jam Stage captures under their own calibration folders. J.106 and J.107 source light/dark proofs are `tools/generate-art/previews/leo-pass-overhead-atlas-light.png` and `tools/generate-art/previews/leo-pass-overhead-atlas-dark.png`.

## Next captain work

Leo `layup`, `pickup`, `receive`, `rebound`, `steal`, `pass`, `pass-overhead`, and `pass-behind` are accepted with separate athlete-specific tracks. Continue Leo’s bespoke captain library by current missing-action order; 8 additional source-only Leo atlases remain in the source workspace; their tracks, registration evidence and canon/mirror checks must be individually reviewed. Two Leo actions still need original art. Then proceed through other captains by current strict-audit priority. Do not count source-only clips until lineage, atlas, mirror policy and any required athlete-specific ball track pass review.

The source workspace `/workspace/Conda-Jam` contains unrelated in-progress J.130/J.131/J.137 art and extensive untracked evidence; it was left untouched. The user-owned J.106 helper remains preserved.
