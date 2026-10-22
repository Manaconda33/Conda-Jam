# Jragena locomotion sprite production

Canonical reference: JAMVERSE '96 K.31 and the Jragena gameplay sprite in the captain atlas. Jragena is an adult woman with rich very dark purple skin, visible freckles, hazel-green eyes behind purple cat-eye glasses, long warm mahogany-to-copper hair, ornate curved horns, large dragonlike wings, and a controlled, majestic athlete's presence. The accepted game art keeps the wings folded closely behind her shoulders but visible during movement. The double-ended magical staff is stowed for on-court movement, as canon permits. Uniform stays black and magenta; no permanent flight or extra powers.

## Source generations

- Rejected first 7x6 attempt: `/workspace/generated_images/exec-16ad6f98-b8f3-4e4a-b91b-c962726dbb91.png`. The full sheet looked consistent, but neighboring wing shapes connected into only35 alpha components, so it cannot safely produce42 isolated poses.
- Accepted right-facing 7x6 sheet: `/workspace/generated_images/exec-9290515d-626c-4ce8-a8e9-00b49108d89d.png`. It has42 separate complete figures with true transparency. Purple cat-eye glasses, copper hair, horns, dark-purple skin and folded wings persist across all five action groups. The generic layout maps six idle, four ready, ten stationary-dribble, eleven run and eleven dribble-run frames in reading order.
- The source's separated figures can overlap their nominal grid gutters, chiefly where folded wings approach hair or armor. Packaging uses `--isolate-components` only after confirming42 distinct primary silhouettes. It assigns existing alpha pixels to the nearest source component and does not invent, mirror, interpolate, or duplicate poses. Every accepted silhouette remains fully within the source canvas and the packed atlases are visually reviewed separately.

Prompts request no basketball in the character art; runtime hand tracks own the ball. The mirror policy is canon-reviewed separately: glasses, hair, horns and wings have no fixed side, so right-facing art can be mirrored without changing identity.
