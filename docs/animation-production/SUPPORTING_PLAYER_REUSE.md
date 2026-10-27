# Supporting-player animation reuse

Updated 2026-10-27. This authorized model applies only to the 70 noncaptains. All 35 captains keep the original authored-art requirement and are excluded from the reuse map.

## Current implementation

- Seven complete supporting libraries are retained as original artwork: Reed Ashcroft, Juniper Vale, Piper Quickstep, Moxie Capwell, Dorian Mycel, Nova Stitch and Echo Catwalk.
- The other 63 players have explicit assignments to Echo Catwalk's complete reviewed library. Echo was selected as one human-like source for both the `human` and `athletic-variant` support rigs because its dark hair and orange skin are visually distinct from its teal kit colors. Recipient height controls runtime scale; recipient simulation and timing remain unchanged. Existing recipient ball-carry/contact tracks take precedence and remain athlete-specific. Any missing track data resolves to Echo's reviewed track and scales by recipient/donor visual scale; the seven retained original libraries use that fallback only for gaps. Ball-free clips (`idle`, `run`, `block`, `push`, `fall`, `celebrate`) stay under free/dead-ball simulation.
- `src/render/uniform-palette.js` implements a lazy, per-source/per-palette cached canvas transform. It preserves transparency and modifies only pixels inside the visually reviewed frame-relative garment mask; approved assignments are active while unreviewed assignments remain excluded.
- The canvas cache retains at most four recent target palettes per source atlas. Echo's 29 atlases decode to about 12.5 MiB of RGBA pixels; the worst-case four-variant cache is about 50 MiB, versus about 400 MiB if all 32 mapped palettes were retained for every atlas. This is a decoded-memory upper bound; generated variants add no files to the repository. First use still pays a one-time per-atlas recolor cost for each active team palette.
- `tools/audit-animation-assets.mjs` reports effective clip classifications separately from unique source libraries, atlas files and decoded source drawings. Shared lineage and derived palette clips are not counted as new authored drawings. Captains continue to be audited against their own manifest entries.

## Visual gate and current coverage

The first output review found visible hair and skin contamination in color-distance candidates. Six iterations tested Echo's source palette and increasingly specific torso/shorts masks. V3 contaminated the forehead band; v4-v5 left source garment colors behind. V6 removed garment color leaks but enlarged inspection found shoe accents had changed. V7 tightens lower-body bounds and received independent visual acceptance: all 35 team palettes × 29 clip types were reviewed on light/dark boards, with enlarged rows confirming preserved headband, shoes, hair, skin, outlines and alpha. Complete evidence and source hashes are in `docs/animation-production/palette-mask-reviews/attempt-07-shoe-exclusion/`.

The code enables v7 for the 63 mapped players after independent mask acceptance; the seven original libraries remain unaffected. Current audit classification counts the 63 as derived palette coverage while retaining their single Echo source library and source drawings as authored art. All 70 support players resolve all 29 clips in both facings. Latest audit missing clips all belong to 31 captains and remain under their protected bespoke pipeline.

## Review evidence and next implementation step

The approved visual candidate is reproducible with `src/render/uniform-palette.js` and the exact source atlases in `public/assets/animation/`. Automated coverage selects all 29 clips for all 70 supporting players in both facings and verifies recipient or donor track lineage for every ball-bearing clip. Chromium E2E passes desktop, mobile, standalone, full-match and season journeys. No ball is baked into the shared artwork.

## Coverage and efficiency

- Supporting coverage: **70/70 players, 2,030 effective clip assignments**. Seven players use their 203 original reviewed clips; 63 use **1,827 derived palette clip assignments** from one complete Echo library. The shared source has 293 distinct reviewed drawings across 29 types, avoiding an estimated **18,459 bespoke drawings and 1,827 bespoke clip atlases**.
- Measured storage: Echo's 29 source atlases total **1,781,192 bytes**. Derived variants are generated in memory and add **zero persisted atlas bytes**. Estimated bespoke art storage avoided is about **112.2 MB**, using Echo's compressed atlas size as a per-player proxy; actual bespoke art sizes would vary.
- Memory: the source atlases contain **12.5 MiB** of RGBA pixels. The four-variant LRU per atlas bounds derived canvases at about **50.0 MiB**, versus about **400.1 MiB** if all 32 target palettes were retained. These are pixel-buffer estimates, not measured browser heap snapshots.
- Chromium smoke/E2E passed desktop/mobile interaction, offline standalone, a full match and season progression. No before/after frame-time benchmark was run, so runtime speed change is unmeasured. First use incurs a synchronous per-atlas recolor; later draws use the bounded cache.
- Latest strict audit: **2,325 effective/existing clips**, **4,736 unique source drawings** across 42 source libraries, 1,827 derived clips and 778 missing clips. All 778 missing clips belong to 31 captains; four inherited prompt-provenance findings also remain. The global audit correctly remains incomplete while captain assets follow their protected process.

No production atlas, image-generation attribution, provenance, or original-frame hash is rewritten by this reuse layer. The active Briar J.131/J.138 source and review files are preserved separately and were not modified by the reuse implementation.
