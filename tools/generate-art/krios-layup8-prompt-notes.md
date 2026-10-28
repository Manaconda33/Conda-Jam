# Krios layup prompt notes

Source: `tools/generate-art/pose-catalog.json` action `layup` (8 frames). The prompt maps its named events without changing timing: takeoff frame1/tick2, release+peak frame4/tick10, finish frame7/tick18. It keeps all eight separate-ball poses on one right-facing rig and puts the release on the canonical frame. The packer can crop/normalize the 4×2 generated sheet into the existing 104×96 Krios atlas format after source review.

Identity/style reference: use an approved current Krios atlas such as `public/assets/animation/krios-pass-overhead-right.webp` or `krios-shoot-right.webp`; prompt text explicitly protects Krios's red skin, curled black horns, charcoal beard, Scoria Rams kit, muscular proportions and boots. No ball or hoop is included in the artwork.

Review risks for the generated candidate: check the high-forward release hand fits within its cell with clear margin; confirm both guide and shooting arms remain distinct on the frame4 release; keep horns/beard complete during jump poses; and inspect the smooth-versus-pixel-art rendering at packed/gameplay size. The prompt assigns a right-hand layup as the regular action. Validate mirror behavior and the separate Krios ball track independently before runtime acceptance.
