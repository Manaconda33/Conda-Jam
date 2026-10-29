# Independent source review — Kraken `dunk`, attempt06

**Verdict: reject. The pose sequence is clearer than attempts03/05, but the opaque checkerboard and illustrated rendering still fail the asset requirements. Preserve as rejected source work; no cleanup atlas or registration.**

## Provenance and prompt check

- Raw: `tools/generate-art/sources/kraken-dunk-attempt06-generated-raw.png`, 1536×1024 RGB.
- Generation ID: `exec-9e5bc6f6-aa23-4f78-9b50-1b000f942179`.
- Raw SHA-256 `ff0e9cc6d11a4f6364eacb56acf6378523f924931ddb779eb051278688358625` matches provenance.
- Exact prompt SHA-256 `3441bcec0e10dc0207fc71334d814f556c2f33256ab767cbf8543cd4dfc25ab9` matches provenance.

## Findings

- **Transparency: fail, decisive.** The file is RGB with no alpha channel; all 1,572,864 pixels are opaque. The light/dark checkerboard is real image content, not a transparency display. This violates the prompt's true-alpha and no-checkerboard requirements. Removing the pattern around thin ears, fingers, hair, socks and shoe outlines would require risky foreground segmentation.
- **Cell layout: partial.** Ten poses are visually arranged in five columns by two rows with gutters. The checker pattern fills every gap, so there are no transparent cells. Some reach across nominal column boundaries: the top-row gather pose's extended hand crosses the x≈614 boundary, and the lower-row dunk pose approaches/crosses the same boundary. There is no alpha-safe way to cut each exact cell from this RGB output. The requested 5×2 grid and row-major order are recognizable, but full containment is not reliable.
- **Pose sequence: improved, still imperfect.** The set reads as approach, gather, plant, takeoff, ascent, peak, downward dunk, descent, landing, recovery. The peak, slam and descent silhouettes are more clearly separated than in attempts03/05: the peak reaches overhead, the dunk pose lowers/extends an arm, and the descent curls down. Pose5 is still a one-arm/back-swing shape rather than a clearly rising two-arm gather. Pose9 is an unusually deep, hand-to-floor landing. The broad motion is understandable without a ball, but action specificity needs a separate ball track and live gameplay review.
- **Kraken identity and anatomy: pass at gross level.** The ten figures are consistently the same athletic male elf with auburn hair, pointed ears, warm skin, copper pendant, burgundy/copper costume, socks and shoes. Heads, hands and feet appear attached and full-body. No ball or extra character is baked into the art. The overhead and reaching hands are visible; inspect fine finger shapes at runtime scale if a future source passes other criteria.
- **Pixel-art quality: fail.** The rendering remains a smooth, high-detail illustration with blended shading and antialiased contours, not deliberate hard-edged 16-bit pixel clusters with limited discrete color ramps. This is the same style defect as attempts01/03/05; attempt06 improves the pose flow but does not correct the visual style.

## Comparison and disposition

Attempt06 improves the silhouette progression over attempts03 and05, particularly at peak/dunk/descent, and the ten figures are spaced more regularly. It repeats the hard blocker from attempt05: the checkerboard is baked into fully opaque RGB. Attempt03 had genuine zero-alpha background but poor margins and weak differences between its overhead poses. Attempt01 had a red halo and poor layout. Attempt06 is useful as action-reference material only; reject it as a production or cleanup-ready source. Any new source must deliver genuine RGBA transparency, clear cell gutters, consistent small-sprite scale, and discrete pixel-art shading.
