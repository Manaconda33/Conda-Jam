# J.103 — Keeg double dunk source notes

## Accepted generation

Fifteen reviewed Keeg poses distinguish the first overhead pump, reset to chest, second higher pump, tick-21 release, follow-through and landing. The sprite art keeps Keeg human, with his full purple mushroom hat, black beard, black hair, purple/lavender/silver kit and matching shoes. The basketball remains a separate game object.

- Generation: `exec-c394e341-4e13-4298-92e9-97119fdaffcf`; date 2026-10-24; direction right-facing; canon K.03.
- Raw source: `tools/generate-art/sources/j103-keeg-dunk-double-generated-raw.png` — SHA-256 `6b7fb70dd7fd1389ee94139e0622daf3b4a9384bfb10554cdbc67194e37db4a8`.
- Cleaned 5×3 source: `tools/generate-art/sources/j103-keeg-dunk-double15.png` — SHA-256 `f563162a8f00bf9b12d72d36edfb9e05637349bcd627ba707741652a97ef2bac`.
- Atlas: `public/assets/animation/keeg-dunk-double-right.webp` — SHA-256 `f600dbba7981c12ee6da6e023827dcd02d5e36b20810dd8b795c2c784c0f55f8`, 71,636 bytes.
- Cleanup: `tools/generate-art/clean-keeg-dunk-double15.py` isolates fifteen alpha-connected bodies, removes high-chroma red artifacts, preserves aspect and provides at least 11 px cell clearance.
- No alternate J.103 candidate was rejected; the other image files produced during parallel generation belong to different tasks and are not part of this record.

## Separate ball track

Keeg’s ball is not painted into the poses. The initial athlete-specific track is recorded in the provenance: height [0.95, 1.1, 1.25, 1.55, 2.15, 2.9, 1.55, 1.75, 2.35, 2.9, 2.35, 2, 1.15, 0.85, 0.65]; forward [7, 5, 3, -4, -8, -1, 2, 5, 4.5, 12.5, 13, 7.5, 4, 3, 3]. The action releases from pose10 at tick21. Runtime hand-contact review is complete: standard and zoom120 native previews select all fifteen poses in both facings, with a clear-hat release at frame10/tick21. J.103 is registered. Full validation passes409 JavaScript tests, lint18 modules, content validation,100-match simulation,55 packer tests, offline build and Chromium full-match/season/touch E2E; standard/zoom120 previews select every pose in both facings. Checkpoint `7f925af` is pushed and deployed in Pages run #141: https://github.com/Manaconda33/Conda-Jam/actions/runs/40049640158.

## Exact prompt

See `tools/generate-art/j103-keeg-dunk-double-prompt.md` for the verbatim generation prompt.

## Production preview evidence

`artifacts/native-render-preview/keeg/report.json` and `artifacts/native-render-preview/keeg-zoom120/report.json` each report 169 loaded images, 87 snapshots, 452 action frames and all 15 J.103 poses selected in both left and right facings. The frame10 release shows the separately rendered ball at Keeg's extended hand, clear of his hat.
