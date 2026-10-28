# Kraken `layup-reverse` attempt02 source review

**Verdict: PASS for isolated cleanup trials only. Not approved for packing or runtime.**

- Generation ID: `exec-db27e4db-8722-4c66-a191-928f78c9c134`
- Raw: `tools/generate-art/sources/kraken-layup-reverse8-attempt02-generated-raw.png`
- SHA-256: `a6cc035aae8375be8d121165473044e2107f5b168ba7b7e75272a14d0e1aef22`
- Prompt: `tools/generate-art/kraken-layup-reverse8-attempt02-edit-prompt.txt`

The sheet contains eight distinct full-body poses in a clear 4×2 reading order. Kraken's pointed ear, auburn hair, copper amulet, burgundy-and-gold kit, and athletic proportions remain consistent. The sequence reads as gather, takeoff, turn/ascent, behind-head rise, release, descent, and balanced recovery. Hands and feet appear present in each pose, with no visible baked ball or extra character. The raised arm and release hand are readable, though pose4's far-side hand partly overlaps the head silhouette and should be checked at runtime scale.

The source has an opaque brown vignette and painterly shading. Its dark outlines give the figures good contrast, so a cleanup trial may test a careful matte/background extraction and nearest-neighbor runtime reduction. Preserve the raw; do not use a crude global color key. Inspect hair, ears, hand edges, shoe edges, and garment outlines for brown contamination. The cleanup must demonstrate clean true-alpha previews and an acceptable crisp pixel-art appearance before any track work. If it cannot remove the vignette without edge damage or the runtime scale still reads as painterly, reject the source rather than pack it.
