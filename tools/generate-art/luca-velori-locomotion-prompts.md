# Luca Velori (J.09) locomotion source

Firenze Serenity's game-only teammate. The existing supporting portrait is the identity authority: warm olive skin, thick dark-teal hair brushed back in a flowing wave, neat dark beard and teal/jade jersey with burgundy and white trim.

## Canon references

Use `tools/generate-art/references/luca-velori-portrait-reference.png` for identity and `tools/generate-art/references/luca-velori-gameplay-reference.png` for the established on-court sprite style. Keep the requested action categories in exact order.

## Accepted image-generation prompt

Create exactly 42 distinct complete full-body animation drawings of Luca Velori as a transparent 7-column by 6-row sprite sheet. Use the first attached image as his identity reference: match the adult male face, warm olive skin, thick dark-teal hair brushed back with a flowing wavy shape, substantial neat dark beard and teal/jade basketball jersey with thin burgundy and white trim. His dark-teal hair and beard are mandatory in every frame. Do not give him plain black short hair, a clean-shaven face, or a jade-only costume. The second image is only a pose-sequence reference. Exact reading order: idle 1-6, low ball-ready 1-4, stationary dribble 1-10, running strides 1-11, low turbo dribble-run strides 1-11. Right-facing three-quarter view; one complete separate character per cell; consistent scale and feet baseline; low dribble hand reaches close to floor. Empty hands; no basketball because gameplay renders it separately. Human anatomy. Teal/jade uniform with restrained burgundy trim. Original detailed 1990s arcade sprite, crisp pixel clusters, clean silhouette. Transparent gaps and margins, no grid lines/borders, no floor/shadow/glow, no text/numbers/logos/watermark, no clipped/touching bodies, no extra limbs. Exactly six full rows, seven figures in every row.

## References and review

Identity reference: `tools/generate-art/references/luca-velori-portrait-reference.png`, cropped from supporting-portrait-atlas cell16. The earlier composite pose reference is retained in `luca-velori-locomotion-attempts-provenance.json` and was not used to claim additional authored frames. Accepted generated output: `/workspace/generated_images/exec-1ad7a2e0-8e1c-45c7-896e-92e0a0f1e203.png`. Its 42 distinct full-body components, alpha background, borders and 7×6 order were checked before packing. Dark-teal hair, beard, teal jersey and burgundy trim match the established identity.


## Actual action map correction

Pose-by-pose review shows the 42 source drawings group as idle6, stationary dribble14, running8 and low dribble-run14. The source contains no standing ball-ready action; four crouched dribble drawings previously mislabeled `idle-ball` are now correctly placed into the dribble sequence. The production set registers idle6, dribble14, run8 and dribble-run14; `idle-ball` remains on the existing fallback art. Run meets its minimum but is below its11-frame target. The corrected source-cell map is `tools/generate-art/references/locomotion42-support-short-layout.json`.
