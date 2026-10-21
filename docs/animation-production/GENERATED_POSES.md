# Generated animation production checkpoint

2026-10-21. Issue 3 remains **incomplete**. Actual registered total: **462 unique generated drawings across 48 clips and 6 athletes**. Required production target remains30,765 drawings across105 athletes.

| Athlete | Clips | Authored drawings | Encoded bytes |
| --- | ---: | ---: | ---: |
| manaconda | 18 | 202 | 882,822 |
| reed-ashcroft | 6 | 52 | 184,348 |
| accu | 6 | 52 | 200,024 |
| nova-stitch | 6 | 52 | 229,296 |
| juniper-vale | 6 | 52 | 223,912 |
| echo-catwalk | 6 | 52 | 177,280 |

All six Chicago and Neo Runway athletes have idle6, idle-ball4, dribble10, run11, dribble-run11 and shoot10. Manaconda additionally has chestpass6, receive4, pickup5, seven dunk styles15 each (all except360), and two alley-oop finishes15 each. All drawings were created through imagegen. Cropping, alpha-component extraction, uniform downsampling and transparent atlas packing do not manufacture frames.

## Sources and review

Prompts and exact generation paths are recorded in tools/generate-art/*-provenance.json. Crop rectangles, source hashes, per-source scale and runtime rectangles are in *-layouts.json. Original PNGs remain in /workspace/generated_images. The42-pose motion reference and reading-order layout are committed under tools/generate-art/references.

Reed preserves the existing supporting atlas identity (dark purple locs/topknot, small dark beard, purple/gold uniform). Accu retains green eyes, blunt black bangs, long black ponytails with teal highlights and black/teal/purple uniform. Each full-resolution sheet and all packed cells were inspected over a solid blue background. Clips are explicitly reviewed before rendering; mirror policies are separately recorded.

Shooting and ball-action sheets received explicit imagegen repairs for clipped hair, stray scarf inheritance, backward crest direction and baked floor objects. Failed source provenance is marked rejected; unregistered test packs are excluded from public.

The15-pose power dunk repair produced15 disconnected complete figures with overlapping bounding rectangles. Optional component isolation retains each existing primary figure and its nearest antialiased edge pixels, preventing neighboring fragments without inventing poses. A synthetic overlap test verifies exact visible pixel preservation, with a separate low-alpha test.

Wide poses use wider cells rather than shrinking the entire athlete for scarves/hair. The authoring packer rejects incomplete grids, clipped main figures and explicitly rejected provenance. Nine Python validation checks pass.

## Verification and limits

The real src/main.js Canvas renderer loaded the new assets in the native diagnostic adapter:77 images /42 pose snapshots for Chicago vs Emberwood after windmill integration; prior Neo Runway vs Chicago pass loaded87 images /15 snapshots plus a real180tick simulation snapshot. This is **not browser/CSS/mobile end-to-end validation**. Chromium still cannot launch in this sandbox. Native outputs live under artifacts/native-render-preview/{manaconda,accu}/.

Windmill uses distinct per-frame carried-ball height and forward offsets for the backward/low/upward sweep. Mirrored directions and pause are regression covered. Native peak alignment was adjusted against the actual packed hand position.

Full regression suite24 test files passes, including exact RGBA equality for eleven lossless WebP delivery derivatives. Additional Python source-packing checks9 pass. League benchmark100 complete matches,875,202ticks, average8.08/9.39,12 overtime periods. Asset audit is intentionally incomplete:48 decoded clips,126 missing clips among represented athletes and99 missing athletes.

Actual wrist alignment and loop continuity still need browser playtest. Remaining actions use older staged art and do not satisfy issue3. Do not close the issue from metadata, distinct hashes, or passing gameplay tests alone.

Latest seven-style dunk and aerial integration:65 focused animation tests pass. Hand tracks are estimated against packed pixels and inspected in the native renderer, not a browser precision guarantee. Two attempted360 repairs still fail the left-profile rotation review and remain excluded.
