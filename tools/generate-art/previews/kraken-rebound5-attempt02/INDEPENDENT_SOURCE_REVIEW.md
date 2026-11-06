# Kraken rebound attempt 02 — independent source review

**Decision: rejected; do not run cleanup, track, pack, or runtime trials from this source.** Preserve the raw file and provenance as a rejected generation.

Reviewed on 2026-10-28. Source: `tools/generate-art/sources/kraken-rebound5-attempt02-generated-raw.png`; generation ID `exec-d6e7e8e7-8e91-4cac-891a-7ab3fdaedc51`; SHA-256 `176da790dad1bdbae5ceb0787afe85cf0010495aa861109167df8fb615149417`. Prompt: `tools/generate-art/kraken-rebound5-attempt02-edit-prompt.txt`.

The five poses are distinguishable and retain Kraken's auburn hair, pointed ear, copper pendant, burgundy uniform, and athletic anatomy. The sequence broadly reads as ready, crouch/reach, jump, overhead grab, and descent. This is not enough for use: the output repeats attempt01's broad brown vignette despite explicitly requesting transparent background. Pixel inspection finds 1,572,864 pixels with alpha below 255 out of 1,572,864 total, with 362,696 partially transparent pixels; thus the dark scene is a large soft-alpha field rather than transparent gutters. The illustration also remains painterly and airbrushed rather than crisp runtime pixel art. Extracting the figure matte risks cutting into its dark outlines, shoes, hair, and gold trim; the previous rebound source already demonstrated this failure mode.

Because the backdrop contaminates essentially the full sheet and the required pixel-art treatment is absent, destructive matte cleanup would not be a reliable route to an approved atlas. Retain this file for provenance only. Generate a new source with true transparent gutters and crisp pixel clusters before considering rebound track trials. No ball is baked into the poses, which is correct.
