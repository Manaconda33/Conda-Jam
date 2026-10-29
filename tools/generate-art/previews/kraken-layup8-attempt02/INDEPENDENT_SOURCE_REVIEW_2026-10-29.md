# Kraken layup attempt02 source review

Verdict: **REJECT both full-sheet generations.** Neither is suitable to clean, pack or register.

The two raw generations share the same exact prompt and reference. Both preserve Kraken's auburn hair, pointed ear, copper pendant and burgundy/gold uniform, and their action silhouettes progress through gather, takeoff, ascent, extension and recovery. Pose3→pose4 is distinct and the right arm is plausibly attached. These are not enough to pass the art gate: both render as smooth glossy painted illustrations with gradients, dense highlights and fine contours rather than the approved hard-cluster Kraken pixel style. At runtime size this rendering becomes muddy. A dark ball-like oval also appears between the hands in frame0, violating the separate-ball rule.

Correction to the initial visual note: a displayed brown field was mistaken for an opaque backdrop. Pixel checks confirm alpha-zero background in both raw PNGs; no opaque backdrop defect is claimed. Alpha-zero RGB is hidden residue and does not render. The style mismatch and frame0 mark remain blocking.

Preserved raw generations and provenance:
- `tools/generate-art/sources/kraken-layup8-attempt02-generated-raw.png` (`exec-78c46394-1aa5-4ec6-b284-62813b59d9ca`)
- `tools/generate-art/sources/kraken-layup8-attempt02-reroll01-generated-raw.png` (`exec-428ddc3b-a814-4729-a65e-788fff0072e6`)
- Exact prompt: `tools/generate-art/kraken-layup8-attempt02-imagegen-prompt.txt`

Reviewer: independent candidate review agent. Review date: 2026-10-29.
