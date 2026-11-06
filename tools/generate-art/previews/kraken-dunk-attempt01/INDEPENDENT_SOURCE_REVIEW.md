# Independent source review — Kraken `dunk`, attempt01

**Verdict: reject for cleanup/layout trial as a production source. Preserve the raw and provenance; do not pack or register.**

## Source and prompt verification

- Current source: `tools/generate-art/sources/kraken-dunk-attempt01-generated-raw.png`, 2172×724 RGBA.
- Generation ID: `exec-3f137c61-57ff-46a0-aa1c-5b1880d89aab`, generated `2026-10-29T03:57:00Z` per provenance.
- Source SHA-256: `7a42a714009b449a864e9f2b7c14a9cb728d3a45e5c360679e87f3e1f949ccd2`; matches saved provenance.
- Exact prompt: `tools/generate-art/kraken-dunk-attempt01-imagegen-prompt.txt`, SHA-256 `b6c89fbcbb8b1f36445091c3647331288bbb4f22859492352eee7075e5b7c241`; matches saved provenance.

## Visual findings

- **Identity and costume: pass with minor detail limits.** The ten figures consistently read as the same athletic elf-like Kraken: auburn hair, pointed ear, natural skin, copper amulet, and burgundy/gold Vesper Harbor uniform. No tentacles, horns, blue skin, opponent, or obvious costume changes are present. The far ear is not clearly visible in every side-facing pose, but the head/ear identity stays coherent.
- **Gross anatomy: mostly pass.** All ten poses show a complete body with arms, hands, legs and shoes; no obvious extra limbs or detached body parts. Overhead hands are crowded, and the transparent halos approach the canvas edge. Large-fringe clipping makes edge anatomy integrity untrustworthy without a new source.
- **Action readability and pose distinction: partial.** The sheet reads as approach, gather, plant, takeoff, rise, overhead peak, slam, descent, landing, recovery. Frames 6–8 cluster around nearly identical arms-raised silhouettes; the ball-free hands do not clearly distinguish peak, contact and post-slam. Because the ball must be separate, this sequence needs stronger body/hand changes to show the slam without relying on a baked ball. Frames 0/1/2 and 9/10 are distinct enough at sheet scale.
- **Full silhouette, margins and layout: fail.** There are ten main figures at alpha≥32, but they are irregularly spaced rather than contained in ten equal cells. Several silhouette bounds overlap nominal 217px columns. The first figure's threshold-32 silhouette starts at x=3, and the final threshold-32 silhouette reaches x=2170 of 2172; low-alpha halo pixels touch all four canvas edges (41 top, 66 left, 100 right; none bottom). There is effectively no safe margin around some raised hands and shoes, so crop-and-scale would require careful re-segmentation and may lose anatomy.
- **Transparency and fringe: fail.** Alpha is technically RGBA with range 0–255 and 1,022,759 zero-alpha pixels, but 548,877 pixels are partially transparent. At alpha≥32 there are ten connected main figures; at alpha≥1 halos connect neighboring figures into nine large components plus many small fragments. The raw has a conspicuous bright red fringe around hair, arms, shorts and shoes, contrary to the prompt's clean one-pixel outline/no-fringe requirements. Low-alpha pixels touch the canvas border, confirming the halo itself is clipped.
- **Pixel-art/style compatibility: fail.** The source is smoothly shaded, antialiased illustration with soft color transitions and red glow-like spill, not crisp 16-bit arcade pixel art with hard-edged clusters and a clean dark outline. Scaling and alpha cleanup might isolate the poses, but cannot correct the rendering style without substantial redrawing.
- **Basketball separation: pass.** No visible basketball, hoop, net, floor, or other prop is baked into the athlete art.

## Recommendation

Reject this generation rather than spending cleanup effort on a runtime atlas. Preserve it as rejected source work with its exact prompt and provenance. A new source should keep the coherent Kraken design and approach/jump/landing poses, but use true low-resolution pixel clusters, remove red edge glow, give each pose clear gutters and margins, and make the overhead peak, slam, and descent visibly different while keeping the ball separate. No track calibration or gameplay acceptance is supported by this source.
