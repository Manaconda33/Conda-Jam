# Captain animation lane checkpoint — 2026-10-27

## Current work

The isolated branch `codex/captain-animation-completion` starts from published `main` at `b8ead761`. It integrates four individually generated, right-facing Leo (captain) clips whose source art was already present as unregistered work: `block`, `push`, `fall`, and `celebrate`. Leo remains on the original bespoke captain path. No captain assets were shared, recolored, or consolidated.

The source PNGs, exact generation prompts and IDs, original packed atlases, layout files, source notes, and provenance JSON are preserved under `tools/generate-art/`. The originals remain available as candidates; runtime points to separate lossless WebP derivatives. Review found detached alpha fragments in the original packed candidates, so the deterministic cleanup removes only 8-connected components of at most six visible pixels within each authored cell. The cleanup utility and per-frame removals are `tools/generate-art/clean-leo-captain-atlas.mjs` and `tools/generate-art/leo-captain-cleanup-report.json`. Independent review found lingering detached specks in the first derivatives; the cleanup was tightened to remove exterior haze beyond the one-pixel antialias edge and isolated non-canon chromatic edge pixels. The original atlases remain unchanged. Refreshed opaque light/dark 4× proofs were independently reviewed and pass silhouette, anatomy, identity and edge quality. Light/dark enlarged proofs are under `tools/generate-art/previews/leo-captain-support-integration/`.

| Clip | Unique frames | Atlas | Generation ID |
| --- | ---: | --- | --- |
| `block` | 4 | 160×192 | `exec-bb7fb56c-71d7-4739-8d97-d88be6768615` |
| `push` | 11 | 448×288 | `exec-6e7dfbe6-0385-414a-af4f-50119684a5d6` |
| `fall` | 10 | 480×192 | `exec-05b210be-22b1-4b65-8161-c629cdc63e0f` |
| `celebrate` | 10 | 400×192 | `exec-6f1f8451-0ce5-4771-bd09-b5439633c79a` |

The visual review confirms Leo's pale adult human anatomy, long black hair, mustache, and black/crimson uniform; each sequence has the expected action order and frame count. These four clips have no athlete-owned ball path. They use Leo's existing canon-approved mirror policy for the opposite facing. No animation timing definitions were changed.

## Audit and validation

The refreshed strict audit decodes 2,329 effective clip assignments from 502 unique atlases and 4,771 unique source drawings. It reports 774 missing assignments, all for captains, and four inherited `prompt-not-verbatim` findings. Leo is at 9/29; 31 captains remain incomplete. Supporting coverage remains 63 derived libraries plus seven retained original libraries. The audit is intentionally still incomplete.

Validation passed on this checkpoint: `npm test` (513 tests), `npm run lint` (21 modules), `npm run validate:content` (35 franchises, 105 athletes, 35 captains), `npm run build`, and the strict report-only animation audit. Four candidate atlases were visually inspected at native pixel scale and at 4× on light and dark backgrounds. The full Chromium E2E suite also passed (offline startup, roster, controls, full game, dunk/fire, and season journeys); generated baseline screenshots were restored. A supplemental 140-capture native canvas attempt ran without browser errors, but its player placement did not put Leo in the visible playfield, so it is explicitly not counted as visual acceptance. The reviewed opaque atlas proofs are the visual acceptance evidence for these four clips; native gameplay inspection remains open.

## Next captain work

Continue Leo's original art first. The active source workspace contains 16 additional reviewed source-only Leo atlases; twelve remain ball-bearing clips whose athlete-specific track values and contact/release timing require reconciliation and native review before registration. Eight further Leo actions still need original captain art. Then proceed through other captains by current audit priority. Do not count source-only clips until source lineage, atlas, mirror policy, and any required Leo-specific ball track pass review.

The source workspace `/workspace/Conda-Jam` contains unrelated in-progress J.130/J.131/J.137 art and extensive untracked evidence; it was left untouched. The user-owned J.106 helper remains preserved.
