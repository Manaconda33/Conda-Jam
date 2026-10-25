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

Frames4–7 first generation: separate untouched 1254×1254 RGBA sources. Independent review rejected frame4's extended trailing leg. Frames5–7 had clear pose sequence but inconsistent red wristbands and low-alpha residue, so new prompts removed the bands.

Frames0–3 first generation: separate untouched sources, exact prompts, hashes, measurements and combined light/dark preview. Independent review rejected frame2 for hand height/trailing-leg articulation and frame3 for using a release-like dropped wrist. Frames0–1 had grounded approach/takeoff poses but inconsistent wristbands. Low-alpha edge residue appears in all eight.

Frames5–7 retry1 now use bare wrists and pass independent pose/identity review for cleanup. Their exact files, hashes and metrics are in tools/generate-art/j130-briar-foxglove-layup-attempt2-poses5-7-retry1-review.json. Low-alpha residue still needs isolation; frame5 visible top margin is19.94% versus its20% prompt, while frames6–7 exceed20%. Leaf accents are larger than references but remain consistent costume decoration. These are not accepted until the assembled sheet and native frames pass review.

Frames0–3 retry1 are generated but under independent review. Initial observations: wristbands are removed; frame2 still has a high hand; frame3 has an upward prerelease palm but a trailing leg that remains too extended. Low-alpha residue still needs isolation. Frame4 retry1 fixed the leg but has an unwanted chest marking and skin-color drift. Frame4 retry2 has the correct folded-leg pose and a blank chest, but independent review found the skin lighter/oranger than canon and alpha residue contaminated; the saved prompt requested25% margins while visible top clearance is23.76%. Frame3 retry1 and retry2 were rejected for pose/identity/transparency findings. Their exact prompts, raw sources, hashes and review records remain preserved; focused retry and identity-edit work continues.

Preserve every exact prompt, generation ID, raw source, SHA-256, dimensions, bounds, preview and rejection/acceptance decision. Do not invent, duplicate, redraw, mirror or reorder poses. Keep the ball on Briar's separate runtime track. No candidate sheet is assembled, accepted or packed.
