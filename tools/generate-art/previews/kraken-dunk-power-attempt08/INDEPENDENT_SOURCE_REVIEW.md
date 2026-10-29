# Kraken dunk-power attempt08 — independent source review

**Verdict: reject for production, but retain as a pose/layout reference.** The raw image has 15 poses, a transparent background, and the main silhouettes fit within their implied cells. The painterly rendering still fails the game's pixel-art style requirement, and some cells have no safe margin at the grid edges.

## Provenance and alpha

- Raw: `tools/generate-art/sources/kraken-dunk-power-attempt08-generated-raw.png`, 1536×1024 RGBA. Generation ID: `exec-70464830-b9cf-44ba-ba73-ee7444aced0a`.
- Raw SHA-256 `9042a57fd4f003a8a3a7050ea611d88d8cd27ecf9d36e3504ca3101883e98322` and prompt SHA-256 `fc61e2fb6000950034fbeb22f3a56a3baff1bfa397a56e4b3136bba3c447fb77` match provenance.
- **Transparency: pass for the background.** The previously reported center samples were body pixels, not backdrop; that alpha conclusion was wrong. All six specified gutter samples (and other tested inter-cell points) are alpha 0. Composites on light and dark backgrounds show clear transparent gutters rather than a baked brown field. The file does contain many partially transparent edge pixels (alpha range 0–254; 135,863 pixels at alpha 1–15) and 88 faint nonzero pixels along the top edge (maximum alpha 3), so inspect antialiasing/fringe after any reduction, but there is no broad opaque or semitransparent backdrop.

## Art review

- **Count and broad order: pass for count, partial for action.** There are 15 row-major figures. The broad movement reads as approach, gather, load, takeoff/ascent, peak, downward action, follow-through/descent, landing and recovery. The raised-hand peak is distinct. The slam/follow-through frames are less decisive: the first lower-row pose has one arm still high while the other reaches down, so the exact downward slam beat is not unmistakable at this sheet scale.
- **Grid and boundaries: partial pass.** At alpha ≥16, the 15 main connected silhouettes are each contained within the nominal 5×3 grid cells; the earlier claim that the hands cross row boundaries was incorrect. However, some margins are zero or nearly zero: the bottom of row 1 columns 4–5 and row 2 columns 1 and 5 touches the row boundary, and row 3 columns 2–3 touch their shared column edge. Cropping on the implied grid does not cut the main silhouettes, but these cells lack the generous transparent padding requested and need careful fit/normalization.
- **Pose count/order: pass with a minor readability concern.** All 15 row-major figures are present. The action reads from approach/gather through load, takeoff, ascent, peak, downward follow-through, descent, landing and recovery. Peak, slam and recovery are distinct; the downward-slam gesture would benefit from in-game ball-track review if the art were restyled.
- **Identity/anatomy: pass at source scale.** The figures consistently show Kraken's auburn hair, pointed ears, warm skin, copper pendant, burgundy/dark uniform, socks and shoes. No ball is visible. Heads, limbs, hands and shoes appear connected and complete.
- **Style: fail, decisive.** Muscle and fabric surfaces use blended gradients and fine painted detail, with smooth antialiased edges. The result does not match the crisp, limited-palette pixel-art style required for the production sprites.

The corrected review leaves style as the production blocker; the source can inform a future pixel-art redraw. No production files were changed.
