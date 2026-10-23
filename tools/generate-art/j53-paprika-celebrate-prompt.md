# J.53 Paprika celebrate source prompts

## Original right-facing 5×2 pose-sheet prompt

Generate an ORIGINAL transparent RGBA 5-column by 2-row sprite sheet for JAMVERSE ’96. It contains exactly ten separate full-body poses of Paprika, a tiny real four-footed kit fox: low horizontal fox body, russet-orange fur, cream white muzzle/chest/underside, huge triangular ears, bright eyes, pointed muzzle, bushy tail with pale tip, simple fitted purple-and-gold vest. Keep the same identity and scale in every cell. Every pose stays anatomically quadrupedal with animal paws and natural fox spine; only frame3 briefly has all four paws naturally airborne in a small horizontal hop. No bipedal, upright, human arms, hands, fists, human gestures, dancing or anthropomorphic anatomy.

Make ten clearly different, complete, independently articulated drawings in strict left-to-right then top-to-bottom row-major order: frame0 joyful alert four-paw crouch; frame1 tail wag and cheerful weight shift; frame2 compressed spring crouch; frame3 short horizontal happy hop, all paws airborne; frame4 soft four-paw landing; frame5 playful sideways forepaw step supported on the other three paws; frame6 tiny scamper step with tail balancing; frame7 proud low quadruped stance with ears high; frame8 four paws grounded, tail wag; frame9 compact alert joyous finish. Do not repeat a pose. Center one figure in each cell, keep camera and body scale fixed, clear transparent space between all poses and around the outer canvas; do not clip any body part.

TRANSPARENCY IS CRITICAL: the complete silhouette is opaque fox pixels and every pixel outside the silhouette is alpha exactly 0. Thin outlines directly at the silhouette are near-black/dark brown only. Absolutely no vivid red outline, red halo, coral fringe, glow, aura, rim light, colored shadow, colored background or floor. The russet color belongs only to the fox's body and tail, never outside its silhouette. Keep alpha 0 outside every fox, including spaces between tail and body.

Crisp detailed 1990s arcade pixel art with the same warm painted shading used by JAMVERSE ’96 fox sprites. Blank vest without symbols, lettering, logos or numbers. No ball, opponent, court, hoop, floor, shadows, borders, panels, grid lines, text or props.

## Accepted cleanup edit prompt (verbatim)

The attached image contains ten good Paprika fox poses, but EVERY fox has an unwanted bright-red contour glow around its outside edge. That red halo is an ARTIFACT, not part of the illustration. Perform a careful edge cleanup only. Keep the same ten full foxes, exact bodies, faces, ears, paws, tails, clothes, poses, expressions, size, scale and 5x2 row-major positions. Preserve the interior rust-orange fur and cream patches. Remove all bright red/coral pixels outside each true fur silhouette and restore those pixels to fully transparent alpha 0. Finish each silhouette with only the existing thin dark brown/near-black outline directly along the body boundary. No red, pink or orange fringe, glow, outline, light or shadow may remain outside a fox's original silhouette. Delete tiny disconnected specks. Do not redraw, recolor, move, crop, resize, add or remove any of the ten fox figures or body parts. Return the same full-size transparent RGBA sheet and layout.

## Rejected generation history

- `exec-2b110f90-647f-405c-8ff3-a59281b76520` — first original sheet, rejected for vivid red silhouette halos and isolated red fragments.
- `exec-f71a3d4d-c88e-4e51-948b-cc17d374b97d` — edit of attempt1, rejected because red halos remained.
- `exec-97de5faf-d4d3-433c-b15f-f6d205cbaec9` — new sheet with a stricter no-halo prompt, retained as the accepted edit's parent because the edge still needed cleanup.
- Accepted cleanup generation `exec-289b6e9a-b203-4e11-ae1d-e7bcb97554aa` is reviewed and recorded in `paprika-celebrate10-provenance.json`.
