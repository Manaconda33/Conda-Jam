# Independent source review — Kraken dunk-double attempt03

**Decision: reject for cleanup/gameplay; preserve the raw attempt.** The broad double-pump story is present, but source-level layout and rendering fail the stated requirements.

## Provenance

- Raw source: `tools/generate-art/sources/kraken-dunk-double-attempt03-generated-raw.png`
- SHA-256: `a30f8b417dbd57006164071bb5f141873536e54480e4fec7fc91c8a580e89fcb`, matching provenance.
- Generation ID: `exec-a853b657-37f8-450d-b8b5-a59b388a2444`.
- Dimensions: 1619×971 RGBA; prompt hash and file match provenance.

## Findings

- The transparent background contains 15 individually readable, ball-free figures. Kraken identity and kit are consistent overall: auburn hair, pointed ears, warm skin, copper pendant, burgundy/copper uniform and burgundy shoes. The figures show complete bodies and recognizable limbs.
- Action order is legible at a glance: approach, takeoff/high one-arm pump, chest recoil/clutch, second rise/high reach, downstroke, follow-through, landing/recovery. Frames 6–10 (1-based) have visible variation: first straight high reach, chest clutch, compact chest hold, bent-arm rise and second high reach. However, the late beats are not fully clean: frame 11 remains a curved overhead arm, with the more obvious forward/down extension arriving in frame 12; the final frame also reads as a forward step rather than a settled stand recovery.
- The raw canvas is not evenly divisible into the requested 5×3 grid, and multiple figures approach or cross nominal cell boundaries. Fixed-cell packing risks clipping limbs or retaining neighboring pixels; a component-based layout would be required.
- The rendering is smooth, shaded illustration with antialiased edges rather than crisp, limited-palette pixel art. A strong red/orange fringe is visible around many figures, directly violating the prompt and remaining conspicuous against both light and dark backgrounds.

## Recommendation

Keep this as a rejected source, rather than investing in normalization. A new attempt should retain the readable chest recoil and second rise, but make frame 11 an unmistakable forward/down rim strike, make frame 15 a stable upright recovery, use a canvas divisible into 5×3 cells with generous gutters, and enforce hard pixel clusters with no red fringe or antialiasing.
