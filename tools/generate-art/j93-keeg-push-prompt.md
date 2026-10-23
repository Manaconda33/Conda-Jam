# J.93 — Keeg press/push

## Action and canon

Eleven right-facing Keeg poses for the defensive press/push clip. Keeg remains an adult human witch with black hair, a close black beard, the full extremely tall purple hat with silver trim and mushroom ornaments, layered purple/lavender/silver basketball clothes and human anatomy. Both hands remain empty. Contact is pose5 / tick8; follow-through and recovery run through pose10. The live ball stays a separate game object, owned by its actual carrier or loose after a legal contact; Keeg has no carried-ball track for this clip. Canon K.03 permits body mirroring.

## Generation and cleanup

Accepted generation `exec-9bfd12b6-5c08-429c-a1a9-8d18966dc6d7`, raw source `tools/generate-art/sources/j93-keeg-push-generated-raw.png`, SHA-256 `32f847cee7d9a5224d505ad80a08db8ea90e0f6ee56333e31e46643399dd5039`. The image service returned a 1280×1229 transparent RGBA sheet, with eleven large separate poses in the expected 4×3 source order; the last cell is empty. Identity, full hats and limbs remain visible. The initial render has vivid-red edge debris, so it was cleaned with `tools/generate-art/clean-dunk-halo.py` at a 4px silhouette margin. Cleanup cleared89,660 exterior pixels, including4,411 vivid-red/coral artifact pixels; all eleven body components remain complete and separate, and no active red artifacts remain.

Accepted cleaned source `tools/generate-art/sources/j93-keeg-push11.png` SHA-256 `302c2d09c2c06fd42ce6ab5260fc86544478bdda152e37bca3150f9a59a3bfd2`. The packer records each component’s source bounds, component-only crop isolation, normalized scale and atlas cell in `tools/generate-art/keeg-push11-layouts.json`.

## Exact generation prompt

> Create an original transparent RGBA sprite sheet for JAMVERSE '96, exact canvas 1600x1536, with 11 separate complete full-body drawings arranged row-major in a 4-column by3-row grid. Each of the first eleven 400x512 cells contains exactly one pose, and the final bottom-right cell is empty. All poses face right, are fully visible, clearly separated from neighboring cells, with minimum36px transparent padding inside each cell. Preserve the same consistent character scale and bottom baseline. No sheet background, text, grid lines, cell borders, court, floor, shadow, hoop, ball, trails, effects, or props. True transparent space around the sprites.
>
> The repeated athlete is Keeg of Moonmorel Hex: flamboyant adult male human witch, athletic natural adult human anatomy, black hair and close neatly trimmed black beard, very tall ornate purple witch hat with silver trim and tiny mushroom ornaments fully visible, layered lavender/purple/silver basketball uniform with subtle jewelry and mushroom motifs, matching athletic shoes. Keep his face and body recognizably the same in all eleven poses. Preserve his complete hat, hair and beard. Both hands stay empty in every frame; never paint a basketball into the sprite.
>
> This is an eleven-frame defensive press/push action, not a steal, shot, pass, block, or dunk. Sequentially: 0 grounded defensive stance; 1 shift weight and lower center; 2 draw near arm back and set shoulder; 3 take a short forward step; 4 rotate hips and shoulders into a firm athletic shove; 5 CONTACT at simulation tick8: forearm/shoulder drives forward into an unseen opponent, fingers open and empty, strong balanced stance; 6 follow through as the opponent recoils offscreen; 7 retract the arm while keeping feet grounded; 8 recover to an upright guard; 9 take one settling step back; 10 finish in a ready stance. Make each pose distinctly different with plausible human joints and a clear action arc. Keep the contact side arm and tall hat separate with no overlap, do not show an opponent or ball. Generous transparency on every cell edge; no body, hand, ornament or shoe may touch or cross a cell boundary.

## Visual review

The cleaned source was composited on white for frame-by-frame review. All eleven distinct Keeg silhouettes are complete; the hat, ornaments, hair and beard remain stable. The empty hands stay clear of any painted ball, and frame5 makes the forward press contact readable before the recovery poses. The runtime keeps the basketball separate. Atlas review, crop hashes and provenance are recorded in the layout and provenance files.
