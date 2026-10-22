# Dorian Mycel (J.03) locomotion source

Moonmorel Hex's game-only alternate. The existing supporting portrait is the identity authority: warm medium-brown skin, short dense vivid-purple curls, strong brows and purple/silver basketball kit.

## Canon references

Use `tools/generate-art/references/dorian-mycel-portrait-reference.png` for identity and `tools/generate-art/references/dorian-mycel-gameplay-reference.png` for the established on-court sprite style. Keep the requested action categories in exact order.

## Image-generation prompt

Create exactly 42 distinct complete full-body animation drawings of Dorian Mycel as a transparent 7-column by 6-row sprite sheet. Use the first attached image as his identity reference: match the adult male face, warm medium-brown skin, short dense vivid purple curls, strong eyebrows and purple/white Moonmorel basketball top. Short purple curls and his warm skin tone are mandatory in every frame. Do not give him black hair, a silver forelock, a beard, or a pale face. The second image is only a body-pose/layout reference. Make the 42 frames in exact reading order: idle 1-6, low ball-ready 1-4, stationary dribble 1-10, running strides 1-11, low turbo dribble-run strides 1-11. Right-facing three-quarter view; one complete separate character per cell; consistent scale and feet baseline; low dribble hand reaches close to floor. Empty hands, no basketball because gameplay renders it separately. Human anatomy, violet and silver team colors, original detailed 1990s arcade game sprite with crisp clustered pixels and clean silhouette. Transparent gaps and margins, no grid lines/borders, no floor/shadow/glow, no text/numbers/logos/watermark, no clipped or touching figures, no extra limbs. Exactly six full rows, seven figures in every row.

## Accepted source and reviewed action map

Imagegen returned a five-row sheet of35 distinct poses at `/workspace/generated_images/exec-cf4c1551-2d2a-4899-8978-3e7bc3c89a69.png`. Pose-by-pose review found the actual groups are idle6, stationary dribble8, running14 and low dribble-run7; no standing ball-ready poses were generated. The registered clips use idle6, dribble8, run13 and dribble-run8. The run-to-low-dribble transition pose supplies the eighth turbo-dribble frame. `idle-ball` remains on existing fallback art. Every registered clip meets its minimum, while dribble and dribble-run remain below target counts. Source identity and all four packed atlases were reviewed; exact provenance and cell mapping are recorded in the provenance and layout files.
