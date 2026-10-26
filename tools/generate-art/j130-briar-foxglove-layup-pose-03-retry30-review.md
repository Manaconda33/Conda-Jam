# J.130 Briar layup frame 03 — retry 30 review

Generation: `exec-c4baa567-b154-493a-958e-84eff2583af4`  
SHA-256: `591405edc1978c672a4bad41579196d8977c86271aa039c78a62bebdb4c99a97`  
Raw dimensions: 1254×1254 RGBA  
Source proof: `tools/generate-art/previews/j130-briar-foxglove-layup/pose-03-retry30/light-dark-review.png`  
Normalized diagnostic: `tools/generate-art/previews/j130-briar-foxglove-layup/pose-03-retry30/normalized-light-dark-review.png`

**Provisional candidate only; not accepted or registered.** Independent review finds a complete human pose with Briar's dark locs, red headband, deep-brown skin and russet/cream kit, no wristbands or ball, and good gesture separation from the selected pose2 candidate: the shooting palm is beside the face below the headband, the guide hand remains chest-high, and the torso is more upright than pose2. The tucked legs are similar and require whole-sequence review.

The raw source has 1,056 alpha>=1 components and its alpha>=1 bbox touches the left edge, but the alpha>=16 mask has four components and alpha>=64 has one. The largest alpha>=16 component is the complete figure at `(498,325)-(859,987)`; the light/dark raw proof shows no visible exterior halo. The review-only cleanup isolates that largest component, uniformly fits it to 47×86, and places it at `(40,5)` in a 128×96 cell, giving margins L/T/R/B `40/5/41/5`. This is not final sequence normalization. Preserve the raw unchanged and resolve low-alpha source residue before any acceptance.
