# J.54 — Paprika power dunk

## Generation and review

- Athlete: Paprika (`paprika`), canon K.02.
- Clip: fifteen right-facing `dunk-power` poses. Shared markers are takeoff tick4, peak tick14, release tick21, scoring finish tick23, and land tick30.
- The sprite never contains a ball; a Paprika-specific muzzle/forepaw track follows the separate gameplay ball until release.
- Canonical body mirroring is safe under the existing K.02 review.
- Accepted generation: `exec-0c273fc4-56e3-4eaf-a837-10cdf323951d`, an edge-only correction of `exec-3e7f5d5b-9363-416b-b8a7-f4d0875d51a2`.
- Accepted source: `tools/generate-art/sources/j54-paprika-dunk-power15.png` (1619×971 RGBA; SHA-256 `b9a145a97a0afe7c96e5ff5daf77870a569b5c9475611389fab237a10026d856`).
- Source inspection: fifteen large, distinct alpha components in a 5×3 row-major layout; zero nontransparent outer-edge pixels; no figure touches the canvas edge. Image and packed atlas are reviewed against K.02, and the generated art is checked at game scale.
- C2PA/XMP: no claim or instance metadata returned by the image-generation tool.

## Rejected candidates

- `exec-3c4b67fe-7053-43cd-8ffa-2df50c391044` — 15 separated poses, rejected for bright red contour fringes and 44 nontransparent pixels on the canvas edge. Preserved as `sources/j54-paprika-dunk-power-attempt1-rejected-halo.png`.
- `exec-d7f1aa45-3b80-4f06-8dac-9bd3666ef374` and `exec-c5638dde-f607-4e55-9c57-6557fb21b1e0` — cleanup retries left bright red/coral alpha fringes. Preserved as attempts2–3.
- `exec-fd68ff71-7481-4ca0-9791-f972ab6d0075` — reference-guided edge cleanup still left colored fringes. Preserved as attempt5.
- `exec-d2f100db-ad2f-48d4-af22-e4eabce7fbe8` — edge-only cleanup still left the same outer fringe. Preserved as attempt6.
- Attempt4 (`exec-3e7f5d5b-9363-416b-b8a7-f4d0875d51a2`) is the parent of the accepted border correction; it remains preserved as `sources/j54-paprika-dunk-power-attempt4-rejected-red-halo.png`.

## Initial generation prompt (rejected attempt1)

```text
Create one original transparent RGBA action sheet for Paprika's JAMVERSE '96 POWER DUNK. It must contain EXACTLY fifteen separate, complete, full-body poses of the same tiny real four-footed kit fox, arranged in five columns by three rows in strict left-to-right, top-to-bottom order. Paprika's canonical identity is fixed: a compact low horizontal wild fox body, russet-orange fur, cream-white muzzle, chest and underside, very large triangular ears, bright expressive fox eyes, pointed muzzle, a large bushy tail with a pale tip, and a simple fitted purple-and-gold sports vest. Keep her small-fox proportions, face, colors, vest, tail and natural animal anatomy consistent in every frame. She is NEVER humanoid, anthropomorphic, upright or bipedal; she has four fox legs and animal paws, no hands, fingers, shoes, shorts or cloak.

Use the crisp, richly shaded, cleanly outlined 1990s arcade pixel-art style of a JAMVERSE basketball sprite. Keep a consistent right-facing three-quarter gameplay view, camera, character size, and ground-foot baseline. The game applies the jump translation, so do not move the character progressively upward within the sheet. Keep the entire head, both ears, all visible paws and the complete pale tail tip comfortably inside each pose area. All pixels outside each complete fox silhouette must be truly transparent alpha 0. Leave wide, clean transparent gutters between all fifteen figures. No touching, overlap, fusion, stray pixels, cropping, or clipped art. No cell borders, panels, grid lines, backdrop, colored halo, glow, rim light, floor, ground shadow, or checkerboard.

This is a high-flying but anatomically natural quadruped power dunk. Paprika carries the separate gameplay basketball with her forward muzzle and near forepaw; she does not hold it in a human hand. The ball is rendered by the game and must NOT appear in any pose. Likewise do not draw the hoop or rim. Frame order and action are exact: frame0 compact alert four-paw approach stance, body horizontal and ball-ready; frame1 crouch and gather, forepaws lower and hindquarters coil; frame2 takeoff marker, hind legs extend while the forequarters lift naturally; frame3 spring forward, all four fox legs articulate in a running leap and the tail counterbalances; frame4 rise with forepaws tucked forward and muzzle tracking the separate ball; frame5 midair gather at the gameplay grab marker, near forepaw and nose cup the invisible ball close to her muzzle; frame6 drive upward, one forepaw reaches forward and up while the other balances, hind legs tucked and tail flowing behind; frame7 highest power-dunk peak, full horizontal fox body in a heroic forward stretch, one near forepaw leads toward the unseen rim lane, all four animal legs remain clearly identifiable, tail streams backward; frame8 continue forward through the air with the nose and leading paw aimed upward; frame9 extend the leading forepaw and muzzle toward the imaginary rim, with the other forepaw and hind legs naturally counterbalancing; frame10 gameplay release marker, a sharp compact forward paw-and-muzzle flick through the invisible rim lane, still unmistakably a four-legged fox; frame11 scoring finish marker, follow through below the imaginary rim with the leading paw drawing down and the horizontal body still airborne; frame12 descend with forepaws reaching toward the ground and hind legs trailing; frame13 absorb the landing on four paws, tail balancing; frame14 land fully in a compact alert four-paw stance, ready to run. Every frame is a different coherent pose, with no duplicated or mirrored copies.

Keep one whole fox in each of the fifteen positions, with no other bodies or characters. No basketball, hoop, rim, person, opponent, court, floor, shadow, text, numbers, lettering, logo, props, scenery, aura or effects. Blank purple-and-gold vest only. Return a true transparent RGBA sprite sheet and nothing else.
```

## Verbatim parent-generation prompt for the accepted source

```text
Generate an original transparent PNG sprite sheet for JAMVERSE '96 containing exactly fifteen separate complete full-body poses of Paprika, a TINY REAL FOUR-FOOTED FOX. Show a natural small wild fox: low horizontal orange-tawny body, cream muzzle/chest/underside, very large triangular ears, bright fox eyes, pointed muzzle, bushy tail with a pale tip, fitted purple-and-gold sports vest. Four animal legs and paws in every frame. Absolutely no humanoid or anthropomorphic anatomy, no upright biped, human hands or fingers, shoes, shorts or cloak. Keep the same fox face, proportions, colors and vest in every pose.

Sprite grid: exactly five columns by three rows; fifteen unique poses; strict left-to-right, top-to-bottom order. Crisp clean 1990s arcade pixel art with dark brown or near-black outlines directly at the fur edge. Same right-facing three-quarter view, camera, size and ground baseline. The gameplay supplies the vertical jump translation. Keep every ear, paw and pale tail tip complete and comfortably away from cell and image edges; wide transparent gutters. True RGBA transparency, alpha 0 everywhere outside the fox silhouettes. No touching, overlap, fusion, duplicate pose, cell border, grid, backdrop, floor, court, ground shadow, glow, rim light, aura, selection highlight, noise, fragments or stray pixels.

IMPORTANT COLOR RULE: use NO red, scarlet, coral, hot pink or magenta pigment anywhere in the sheet. The fur is golden russet / tawny orange INSIDE the silhouette only. The ONLY silhouette outline is dark brown/near-black directly on the fur edge. Every pixel beyond that outline is fully transparent alpha 0. Absolutely no red edge effect, outer contour, red highlight, rim light, fringe or red pixel. Do not draw effects of any kind.

Action: a heroic but anatomically natural high-flying power dunk. The basketball is a separate in-game object and must never be drawn. Paprika controls it with her forward muzzle and near forepaw. Frame0 alert four-paw approach; frame1 crouch and coil; frame2 takeoff with hind legs extending; frame3 forward leap with natural legs and tail balancing; frame4 rising with forepaws tucked and muzzle tracking the separate ball; frame5 airborne gather at gameplay tick10, near paw and nose cup the invisible ball by her muzzle; frame6 drive up, one forepaw reaches forward/up; frame7 maximum jump at gameplay tick14, fully horizontal stretched fox with near forepaw leading, four legs readable and tail streaming back; frame8 fly forward with nose and paw aimed up; frame9 leading paw and muzzle reach toward an invisible rim lane; frame10 ball-release at gameplay tick21, compact forward paw-and-muzzle flick, still fully quadrupedal; frame11 scoring finish at tick23, lead paw draws down below invisible rim while body is airborne; frame12 descend, forepaws reach ground; frame13 absorb landing on four paws; frame14 fully grounded compact alert ready stance. Each pose clearly distinct. Keep one complete fox in each grid position.

No basketball, hoop, rim, opponent, person, scenery, background, text, number, logo, props or effects. Blank purple-and-gold vest. Return only the clean transparent RGBA sprite sheet.
```

## Verbatim final border-correction prompt

```text
In this exact Paprika sprite sheet, remove only the few tiny stray pixels that touch the extreme outer image border. No fox is near the outer canvas edge: all fifteen full figures have wide margins, so every pixel on the top row, bottom row, first column and last column is unwanted stray art and must be fully transparent alpha 0. Preserve all fifteen complete fox figures, every pose, their scale, position, row-major 5x3 layout, colors, anatomy, fur, vest, tail, outlines, shading, and all other transparent spacing exactly. Do not crop or resize the sheet or any fox. Do not change any pixel of a fox figure or its outline. Do not add a halo, glow, red edge, background, floor, ball, hoop, text or effect. Return the same-size transparent RGBA sheet.
```
