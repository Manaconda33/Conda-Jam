# J.131 Briar Foxglove `layup-reverse` — attempt 02 review

## Disposition: rejected, preserve raw

Raw ImageGen output `exec-864ed115-d1e5-499a-9f8a-34d715914d49` is preserved with its exact prompt and provenance. Light and dark previews are also retained. It was not normalized, packed, or registered.

## Why it failed

- Briar's face, locs, and red headband remain recognizable, and the takeoff/peak/release/descent progression is more distinct than attempt 01.
- The kit still changes materially: black shorts panels and a new pale chest motif are visible, unlike the accepted game atlas. There is also a dark rounded shape at the gathered hands in pose 2 that must be treated as possible painted-ball contamination.
- Shading remains smooth and anti-aliased instead of matching the accepted atlas's small-scale crisp pixel sprite style.
- At 1774x887, inferred 4x2 cells are approximately 443x443. Alpha-positive pixels reach or cross the nominal cell edges in poses 2–4 and 6, so figures do not have the requested safe cell margins.
- No cleanup, candidate extraction, normalization, packing, or runtime registration was performed.

Independent review confirmed rejection for uniform drift, style mismatch, and edge-touching/crossing figures. For attempt 03, use the newly accepted J.130 Briar `layup` gameplay sheet as the primary appearance/style reference, strengthen per-cell containment, and inspect both gathered hands for ball contamination.
