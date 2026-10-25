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

Frames4–7 first generation: separate untouched 1254×1254 RGBA sources. Independent review rejected frame4's extended trailing leg. Frames5–7 had clear sequence but red wristbands absent from accepted references, so fresh bare-wrist poses were generated.

Frames0–3 first generation: independent review rejected frame2 for an early hand height and frame3 for a release-like dropped wrist. Frames0–1 showed grounded approach/takeoff but have loose source alpha.

Frames5–7 retry1 use bare wrists and pass independent pose/identity review for cleanup. Their files, hashes and metrics are recorded in tools/generate-art/j130-briar-foxglove-layup-attempt2-poses5-7-retry1-review.json. Low-alpha residue needs isolation; frame5 visible top margin is19.94% versus its20% prompt, while frames6–7 exceed20%. Leaf accents are larger than references but remain costume decoration. No final source is accepted.

Frames0–3 retry1 are reviewed in tools/generate-art/j130-briar-foxglove-layup-attempt2-pose0-3-retry1-review.json: frames0–1 pass for cleanup; frame2 hand is above forehead rather than beside cheek; frame3's hand is overhead and its skin palette is too orange/light. A later palm-up prerelease source originally overwritten into the pose3-retry1 path was recovered as pose3-retry3, and the exact original retry1 file was restored from git history. The corrected review records which generation each preview showed. Pose3-retry3 has the right palm-up/open-off-hand gesture but its rear leg is too straight.

Frame4 retry1 fixes the folded leg but has a chest marking and color drift; retry2 has a blank shirt and bare wrists, but independent review finds the skin lighter/oranger than canon and alpha residue, with visible top clearance23.76% against a25% prompt. Frame3 retry1 and retry2 remain rejected for hand height/palette/margin; additional exact prompts, raws, hashes and notes are preserved. No candidate sheet is assembled, accepted or packed.

Preserve every exact prompt, generation ID, raw source, SHA-256, dimensions, bounds, preview and rejection/acceptance decision. Do not invent, duplicate, redraw, mirror or reorder poses. Keep the ball on Briar's separate runtime track.
