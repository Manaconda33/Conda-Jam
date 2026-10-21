# Generated animation production checkpoint

2026-10-21. Issue 3 remains **incomplete**. Actual registered total: **146 unique generated drawings across 17 clips and three athletes**. Required production target remains30,765 drawings across105 athletes.

| Athlete | Clips | Authored drawings | Encoded bytes |
| --- | ---: | ---: | ---: |
| manaconda | 6 | 52 | 178,070 |
| reed-ashcroft | 5 | 42 | 143,192 |
| accu | 6 | 52 | 200,024 |

Manaconda: six clips (idle6, idle-ball4, dribble10, run11, dribble-run11, shoot10). Reed: the five locomotion clips42 drawings. Accu: same six clips52 drawings. All drawings were created through imagegen. Cropping, uniform downsampling and transparent atlas packing do not manufacture frames.

## Sources and review

Prompts and exact generation paths are recorded in tools/generate-art/*-provenance.json. Crop rectangles, source hashes, per-source scale and runtime rectangles are in *-layouts.json. Original PNGs remain in /workspace/generated_images. The42-pose motion reference and reading-order layout are committed under tools/generate-art/references.

Reed preserves the existing supporting atlas identity (dark purple locs/topknot, small dark beard, purple/gold uniform). Accu retains green eyes, blunt black bangs, long black ponytails with teal highlights and black/teal/purple uniform. Each full-resolution sheet and all packed cells were inspected over a solid blue background. Clips are explicitly reviewed before rendering; mirror policies are separately recorded.

Manaconda shooting required an imagegen padding repair to restore the top-row crest. Wide shooting poses use96x96 cells, preserving actor height instead of shrinking a character to fit its scarf or hair. The generic packer supports wider cells for anatomy and rejects incomplete grids or clipped main figures.

## Verification and limits

The real src/main.js Canvas renderer loaded the new assets in the native diagnostic adapter:58 images for Chicago vs Emberwood and64 for Neo Runway vs Chicago;15 pose snapshots per matchup plus a real180tick simulation snapshot. This is **not browser/CSS/mobile end-to-end validation**. Chromium still cannot launch in this sandbox. Native outputs live under artifacts/native-render-preview/{manaconda,accu}/.

Full regression suite23 test files passes. Additional Python source-packing checks6 pass. League benchmark100 complete matches,875,572ticks, average8.18/9.51,12 overtime periods. Asset audit is intentionally incomplete:17 decoded clips,70 missing clips among represented athletes and102 missing athletes.

Actual wrist alignment and loop continuity still need browser playtest. Remaining actions use older staged art and do not satisfy issue3. Do not close the issue from metadata, distinct hashes, or passing gameplay tests alone.
