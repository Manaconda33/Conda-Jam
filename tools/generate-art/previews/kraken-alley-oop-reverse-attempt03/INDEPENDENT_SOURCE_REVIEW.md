# Independent source review — Kraken alley-oop reverse, attempt 03

**Verdict: reject as a source candidate in its current form.** The 15-pose sequence is more readable than attempt 02, including a distinct catch/control/downward-action progression, but it misses the specified per-cell padding and hard opaque pixel-art rendering. Some critical action is still a little ambiguous as a reverse dunk without the ball.

## Provenance and integrity

- Prompt: `tools/generate-art/kraken-alley-oop-reverse-attempt03-imagegen-prompt.txt`
- Prompt SHA-256: `9c4cc7237871096cb0fcef2370b955c2beb6519dbec0f12b92a21cbcbd2e4f1f` (matches provenance)
- Raw source: `tools/generate-art/sources/kraken-alley-oop-reverse-attempt03-generated-raw.png`
- Raw SHA-256: `3792c883603269d3fd5f4a79fb6dc13c930262aa1e8473b0b6964e26ce8dc769` (matches provenance)
- Image properties: PNG, 1536×1024, RGBA; provenance records fresh ImageGen generation with `transparent_background=true`.

## Findings

- **Transparency and edge artifacts:** Empty regions are transparent, but the silhouette edges are not hard opaque as requested. Alpha ranges 0–254; 647,783 pixels are partially transparent and no pixel reaches alpha 255. The soft colored fringe/antialiasing is visible around the outlines, conflicting with the strict pixel-art prompt.
- **Count, anatomy, identity:** There are exactly 15 row-major full-body poses. All figures read with head, torso, both arms/hands, both legs, and shoes. Kraken’s auburn hair, pointed ears, copper amulet, burgundy uniform with copper trim, dark socks, and shoes remain broadly consistent. The rear views naturally hide some face/amulet details. No obvious missing or extra limbs.
- **Cell margins:** The layout is 5×3, but it fails the prompt’s minimum 12% padding on many cells. Several silhouettes touch or nearly touch a cell boundary: poses 3 and 4 reach the bottom of row 1; pose 7 reaches the right edge of its cell; pose 8 reaches the left and top edges; pose 9 reaches the top of row 2; pose 11 is about 2 px below row 3’s top; pose 12 has only about 12–13 px at its horizontal sides. These are based on the alpha ≥128 silhouette bounds. Other cells also fall short of the requested padding.
- **Poses 9–12:** Pose 9 presents one open hand high behind the crown. Pose 10 is a distinct catch-like pose with one arm behind the head and the other reaching outward. Pose 11 brings both hands together behind the head/nape, reading as control. Pose 12 is a separate downward action, with the torso facing away and one arm lowered behind the body while the other counterbalances outward. It follows the requested downward direction and does not raise the arms, though the hand’s path across the far side is not unmistakable, so the reverse dunk read remains somewhat ambiguous without the ball.
- **Pixel style/artifacts:** The outlines and clustered shapes evoke pixel art, but the image has too many soft alpha edge pixels and many color shades for the requested crisp, hard-edged, limited-palette result. No ball, hoop, text, or other prop is visible.

Review is limited to the raw source and recorded prompt/provenance. No cleanup or production registration was performed.
