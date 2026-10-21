# Manaconda authored locomotion assets

Update: a separately generated ten-pose jump shot is now registered as a sixth clip, bringing Manaconda to52 authored drawings. See `GENERATED_POSES.md`, `manaconda-shoot-provenance.json`, and `manaconda-shoot10-layouts.json`. The table below documents the original locomotion batch only.

Generated 2026-10-21 using `image_gen.imagegen`, with the first captain-gameplay atlas cell as the visual reference. These assets cover one athlete, five right-facing clips, and 42 authored poses. They do not establish completion of the full roster.

| Clip | Actual unique frames | Sheet grid | Gameplay cell | Encoded bytes |
| --- | ---: | --- | --- | ---: |
| idle | 6 | 3×2 | 64×96 | 26,822 |
| idle-ball | 4 | 2×2 | 64×96 | 13,646 |
| dribble | 10 | 5×2 | 64×96 | 29,510 |
| run | 11 | 4×3 | 64×96 | 29,774 |
| dribble-run | 11 | 4×3 | 64×96 | 31,672 |

Total: 131,424 bytes. Each run sheet has an unused transparent twelfth cell. Original twelve-pose generation PNGs retain the extra poses outside runtime registration.

## Sources and reproducibility

- Prompts: `tools/generate-art/manaconda-prompts.md`.
- Integer runtime rectangles and original source rectangles: `tools/generate-art/manaconda-layouts.json`.
- Actual decoded hashes and visible-pixel counts: `tools/generate-art/manaconda-inspection.json`.
- Packaging: `python tools/generate-art/manaconda-package.py`.
- Original generated PNGs remain under `/workspace/generated_images`; their exact paths are recorded per source rectangle.

Five original action sheets were generated independently. The idle sheet received an imagegen transparency cleanup edit. Two additional stationary dribble poses were separately generated from the original eight-pose sheet and captain reference to reach the ten-pose target.

Packaging locates the actual alpha components rather than assuming that imagegen obeyed an exact grid. It crops existing figures, preserves their pose variations, uniformly downsamples each source sheet, and pads into 64×96 transparent cells. The separate two-pose dribble source is uniformly normalized to the original dribble sheet's average figure height. Final WebP quality is 88 with alpha quality 100. No transforms, duplication, interpolation, or mirrored copies were used to manufacture missing poses.

## Inspection and review limits

Actual post-encoding files decode as RGBA with alpha range 0–255. All registered crops contain visible pixels and all required counts remain distinct after gameplay downsampling. Idle transparency was also inspected after composition over a solid blue background. Fully invisible RGB is normalized before encoding, because image viewers can display the hidden RGB of alpha-zero pixels as colored blocks or gradients.

Visual review found the reference identity legible: blue glasses, gray-streaked dark beard, backward branching crown, purple scarf and gold-trimmed purple uniform, white tights, and sneakers. Idle changes head, chest, shoulder and knee articulation. Dribble changes hand heights and elbow shape; the two additional poses have distinct silhouettes. Run and dribble-run change leg extension, knee lift and arm positions. No basketballs are baked into the sheets.

Runtime motion ordering, transitions, ball-hand alignment and final timing require review in the game. The two extra stationary dribble poses are appended after the original eight; they are genuinely new artwork but may benefit from timing/order adjustment. Run phase transitions are generated poses rather than a mechanically guaranteed animation loop.

The root integration owner reviewed the character as safe for runtime mirroring: the sleeve side is not canonical and crown/crest direction remains coherent relative to facing. That decision belongs to the shared manifest review; this art task did not edit or approve the shared manifest. No independent left-facing sheets were generated.
