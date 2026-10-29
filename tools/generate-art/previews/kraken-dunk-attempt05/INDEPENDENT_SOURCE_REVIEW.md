# Independent source review — Kraken `dunk`, attempt05

**Verdict: reject. The poses are more readable than attempts01/03, but the baked opaque checkerboard and illustrated rendering fail the source requirements. Do not use as cleanup-ready runtime art.**

## Source and prompt verification

- Current source: `tools/generate-art/sources/kraken-dunk-attempt05-generated-raw.png`, 1983×793 RGB.
- Generation ID: `exec-d7f7b571-8735-4640-85ba-6742a02b0647`.
- Raw SHA-256 `1e2a0b6a2822804e9dca10ec63a5bf929315def8368c937c8786d7db213d8d0d` matches provenance.
- Prompt SHA-256 `45f8f0ada2ce4143183deb37f260e1c1494e713fed11c03e228d79b431c9a785` matches provenance.
- Requested canvas: 960×384 with 5×2 square cells; generated dimensions are larger but retain approximately the same 5:2 aspect ratio.

## Review findings

- **Transparency: fail.** The raw file is RGB, not RGBA. Every pixel is fully opaque; there are 0 transparent pixels. The visible checkerboard is baked into the image, not a transparency preview. Background removal would require segmentation around thin limbs, hair and shoes and risks damaging the dark outlines. This is the decisive rejection reason.
- **Cell separation: partial pass.** Ten figures are laid out in two rows of five with open spacing. Their broad bodies remain separate and generally fit within the implied cells, with useful gutters. However, there are no actual transparent cells or gutters, and the baked checker pattern is not usable as alpha. The output dimensions do not match the requested 960×384 canvas.
- **Pose distinction and action readability: partial pass.** The 10 figures communicate approach, gather, plant, takeoff, overhead action, downward extension, descent, landing and recovery. The bottom-row poses 6–8 are more visibly distinct than the corresponding raised-arm cluster in attempt03. The rising pose5 is weak: it still reads as a running/gather step with arms held back rather than an upward rise with hands gathered above the forehead. The ball-free silhouette does not fully communicate the dunk by itself, but the separate ball could supply that gameplay cue if the poses were otherwise acceptable.
- **Kraken identity and anatomy: pass at gross level.** The same athletic male elf appears throughout, with auburn hair, pointed ears, warm skin, copper amulet, burgundy/dark uniform with copper piping, socks and matching shoes. Limbs remain attached and all full bodies are visible. No basketball or other prop is drawn. Finger separation is visible in raised poses; finer hand anatomy still needs runtime-scale inspection.
- **Pixel-art quality: fail.** The figures use smooth illustrated shading, blended gradients and softened contour detail rather than the prompt's crisp hard-edged pixel clusters and limited discrete palette. Dark outlines help readability but do not make the art a production pixel sprite. This is also a remaining failure from attempts01 and03.
- **Edge/color defects:** There is no alpha channel to assess clean transparency edges. The checkerboard alternates light and dark gray through the full image, including all gutters; it cannot be treated as an acceptable background or as a valid alpha mask. No red glow as conspicuous as attempt03 is evident, but the opaque pattern makes edge inspection under transparent compositing impossible.

## Recommendation

Keep this as rejected source evidence. Do not spend cleanup effort trying to extract the figures from the opaque checkerboard; redrawing the checker-confounded outlines would be extensive and the pixel-art style would still need correction. A future source should return RGBA with zero-alpha empty cells, crisp pixel clusters, and a clearly separated rise / peak / slam / descent sequence. No atlas or ball track is accepted by this review.
