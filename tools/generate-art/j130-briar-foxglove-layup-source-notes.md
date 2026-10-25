# J.130 — Briar Foxglove `layup` source work

## Target and canon

The canonical clip is nonlooping, eight frames, durations `[2,3,3,2,1,3,4,4]` for 22 ticks. Takeoff begins frame1/tick2; peak and one-hand release are frame4/tick10; the grounded finish is frame7/tick18. The pose catalog is `tools/generate-art/pose-catalog.json`.

Briar is an adult human woman with warm deep-brown skin, shoulder-length dark locs, vivid red headband, compact athletic build, russet/cream sleeveless Emberwood kit, cream socks and matching trainers. No fox traits. Draw right-facing three-quarter poses with consistent scale and complete anatomy. The source remains ball-free; fit a separate Briar-specific ball track to the accepted hand positions and carry through tick9, release at tick10. Native review must cover carry, release and flight in both facings at100% and120% zoom.

## Attempt 1 — rejected

Exact prompt: `tools/generate-art/j130-briar-foxglove-layup-prompt-attempt1.md`.

- Generation `exec-06e10426-25c6-4665-bbd0-f104ce0020a8`; raw `tools/generate-art/sources/j130-briar-foxglove-layup-attempt1-raw.png`; SHA-256 `460e81a5e09abc0386e6b88d027ad45fb0767a8e568ed8bb0daac0946b8eda38`; 1774×887 RGBA.
- Review: `tools/generate-art/j130-briar-foxglove-layup-attempt1-review.json`; light/dark preview: `tools/generate-art/previews/j130-briar-foxglove-layup/attempt1-light-dark-review.png`.
- The eight poses are distinct and broadly retain Briar's identity/anatomy. Reject the sheet because frame0 contains a baked basketball, low-alpha residue reaches the cell borders, and the closest alpha>=64 figure margin is4px at frame3's bottom (frame4 has11px top). No cleanup, normalization, packing, registration or acceptance was performed.

## Attempt 2 — individual poses in progress

Generate eight individually prompted full-body poses as separate untouched source files, then review uniqueness, identity/anatomy, actual transparency, detached components and safe margins before assembling any candidate sheet. Preserve every exact prompt, generation ID, raw source, SHA-256, dimensions, bounds, preview and rejection/acceptance decision. Do not invent, duplicate, redraw, mirror or reorder poses. Keep the ball on Briar's separate runtime track.
