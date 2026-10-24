# Sable Regent — steal (corrected retry)

- Accepted generation: `exec-7d5fb2fd-c25e-43a4-920b-f5a8f26eee83`
- Corrected retry prompted after the previous candidate failed isolation: poses 2 and 3 touched as one component.
- Canon references: `tools/generate-art/references/sable-regent-portrait-reference.png`, `tools/generate-art/references/sable-regent-gameplay-reference.png`
- Cleanup: `tools/generate-art/clean-sable-regent-steal.py` removes the connected neutral checkerboard the edit model placed behind the figures. The accepted source has eight isolated full-body components, checked on white and black backgrounds.

## Exact generation prompt

```text
Correct this sprite sheet into a production-ready transparent RGBA sprite sheet, 1536x1024, 4 columns by 2 rows, exactly eight distinct complete full-body right-facing poses in row-major order. Preserve the exact Sable Regent identity and crisp 1990s arcade pixel-art look. She is the same warm-brown adult human woman with black gathered curls, a red headband, black/crimson/white Blackthorn kit, wristbands, knee pads and shoes. No two figures may touch; give every pose generous transparent margins inside its own cell, especially separate the two top-right figures that are currently connected. Poses: defensive ready, lower/reach, low lunge, low right-hand steal anchor, gather, turn/rise, recover, reset. No basketball, opponent, words, floor, shadow, glow or matte. Keep all anatomy intact. Return only the corrected sheet.
```
