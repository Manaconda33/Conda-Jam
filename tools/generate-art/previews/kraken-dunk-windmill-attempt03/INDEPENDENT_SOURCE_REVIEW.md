# Independent source review — Kraken dunk-windmill attempt03

**Decision: reject this source for cleanup/gameplay. Regenerate or revise the windmill action first.** Read-only review; no cleanup or registration was performed.

## Provenance and file checks

- Raw: `tools/generate-art/sources/kraken-dunk-windmill-attempt03-generated-raw.png`
- SHA-256: `aae6128c9463079730fe910fa83ae18b8d9a7b9383923bc9530a8f2fa54ff20b`, matching `tools/generate-art/kraken-dunk-windmill-attempt03-provenance.json`.
- Provenance generation ID: `exec-37d97ee9-2993-4fbd-82fa-cd9b6a5a868a`; dimensions 1619×971 RGBA.
- Prompt: `tools/generate-art/kraken-dunk-windmill-attempt03-imagegen-prompt.txt`; its recorded SHA-256 matches the prompt file.

## Findings

- There are 15 visually separate Kraken figures and the transparent gutters are real; the background is not a baked checkerboard. Identity is broadly consistent across the sheet (auburn hair, pointed ears, warm skin, copper pendant, burgundy/copper kit). Limbs and shoes are generally present, with no ball or other prop baked into the sprites.
- The source does not meet the requested hard-edged pixel style. It is smooth, shaded illustration with antialiased contours and a conspicuous bright red/orange fringe around most silhouettes. This fringe is particularly visible against the transparent black view and would remain distracting at sprite scale.
- The strict equal-cell layout is not clean. The raw is 1619×971, not evenly divisible by 5×3. Several silhouettes approach or cross nominal cell boundaries; notably the top-row fourth figure extends into the fifth column, and figures in lower rows cross their nominal row starts. A fixed row-major crop would clip or retain neighboring-edge pixels; component extraction/repacking would be necessary even if the art were otherwise viable.
- The windmill sequence is not a clear five-beat circle. Frames 7–10 progress from an extended/backward arm toward raised overhead positions, but frame 11 (bottom-left) remains curled over the head. The first clear forward/down arm extension appears in frame 12, so the specified “whips forward/down” beat is late and the overhead portion repeats rather than resolving as requested. The final forceful follow-through and the transition into descent are consequently compressed.

## Recommendation

Do not spend cleanup effort on this raw sheet. Preserve it as a rejected attempt. A retry should retain the recognizable Kraken kit but explicitly draw five distinct windmill arm silhouettes ending in a forward/down rim strike at frame 11, then a separate frame-12 follow-through; request true binary-edged pixel clusters and a measured red-free outline, and use a divisible 5×3 canvas with generous gutters.
