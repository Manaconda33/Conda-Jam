# Kraken J.07 `pickup` — cleanup01 independent review

## Verdict

**Pass for Kraken-specific ball-track trials only. Not approved for runtime registration or production.** The extracted sheet reads as five distinct poses with coherent Kraken identity and safe layout margins. The frame3 grab gesture is still too ambiguous to accept without a separate ball/contact trial, and gameplay alignment has not been checked through the actual loader.

## Findings

- Verified the exact generation/source references and attempt03 cleanup script/report. The raw remains intact. The output is derived from the original source; it is not new ImageGen output.
- Identity persists across the five figures: auburn hair, pointed elf ears, copper amulet, athletic natural-skinned adult male anatomy, burgundy uniform with copper/gold trim, wrist details and shoes. No obvious anatomy is cropped or detached.
- The poses are unique and readable in order: standing reach, lower two-handed reach, deepest low reach, low grab, and raised recovery mime. The fifth frame differs from the crouched contact frame.
- No basketball is visible in the raw source, crops, or atlas. Frame3 is correctly assigned the one-tick grab anchor at tick7, but its hand appears curled near the lower knee/shin rather than unmistakably cupped at ankle height. Track contact remains an open acceptance gate.
- The cleanup correctly segments five figures by connected alpha components rather than equal-width slicing. Original RGB values are retained; low-alpha canvas haze is removed outside a 1.5-source-pixel fringe. On the light and dark native previews, I see no obvious background haze or detached colored pixels.
- The 80×96 atlas has five unique frames, one shared scale, and aligned visible soles at y=90. Measured alpha bounds end at y=90 for every cell; six rows remain below the soles. Horizontal margins are at least 5 px and top margins at least 17 px. `candidate-metadata.json` records `baselineY: 90`; the new renderer offset can compensate to the legacy ground line, but normal-loader gameplay has not yet demonstrated it.
- At 80×96 and 4× nearest-neighbor, the result reads as crisp pixel clusters with intact outlines, though the shading is more detailed/soft than Kraken's accepted pass atlas. The difference is noticeable but not disqualifying for track trials; review it again during in-game rendering.

## Required before acceptance

Calibrate and independently review a separate Kraken-specific ball track, especially empty-hand contact at frame3/tick7 and carried placement in frame4. Then validate through the normal loader at both facings and 100%/120% zoom with the optional baseline offset active. Do not register before those checks pass.
