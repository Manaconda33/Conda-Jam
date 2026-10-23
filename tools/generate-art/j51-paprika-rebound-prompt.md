# J.51 — Paprika rebound

## Action and canon review

- Athlete: Paprika (`paprika`), canon K.02: a tiny four-footed kit fox.
- Clip: five right-facing `rebound` poses; frame3 is the grab anchor at tick5.
- The gameplay ball remains separate. A Paprika-specific muzzle/forepaw track aligns the catch.
- Body mirroring is safe under the existing K.02 review.

## Rejected attempt 1

- Generation ID: `exec-26843936-1eb5-4e92-9440-bbab3891aae3`.
- Source: `tools/generate-art/sources/j51-paprika-rebound5-attempt1-rejected-background.png` (1536×1024 RGBA; SHA-256 `57811ea1b8ef1198cbcec393877793ffd6a66d979592ba0fccbdfd224f0b8d14`).
- Rejected because the sheet carried visible brown background haze. Its five body components remained isolated but the backdrop compromised clean atlas crops.

Verbatim rejected generation prompt:

```text
Create one original transparent RGBA sprite sheet of exactly five distinct complete right-facing rebound action poses for Paprika in the JAMVERSE '96 game. Use the attached Paprika push and steal atlases only as strict character identity, palette, proportion and pixel-sprite references; do not copy their poses. Paprika is canonically a REAL TINY FOUR-FOOTED KIT FOX with a horizontal compact fox body, russet-orange fur, cream-white muzzle/chest/underside, huge triangular ears, bright fox eyes, pointed muzzle, a large bushy tail with pale tip, and fitted purple-and-gold sports vest. Keep her small wild-fox proportions and natural quadruped anatomy in every pose. Never make her humanoid, bipedal, upright, human-shaped, or equipped with hands, shoes, shorts, or cloak.

Arrange EXACTLY five separately drawn, complete full-body fox poses in a 3-column by 2-row transparent sheet, strict left-to-right then top-to-bottom row-major order; leave the bottom-right sixth cell fully empty and transparent. Same right-facing three-quarter side view, camera, figure scale and baseline. Leave clear transparent margins around every silhouette and between cells. Keep both tall ears, all four fox paws, pointed muzzle and entire pale tail tip in bounds. No clipping, cropping, touching, overlap, fused silhouettes, duplicate poses, background, border, panels or grid lines. Every pose is independently articulated and visibly distinct. The game renders the basketball as a separate object: do not draw a ball or any object.

Five-pose quadruped rebound sequence: frame0 look sharply upward after a missed shot, crouch on all four paws and brace; frame1 coil low and shift weight onto hind legs, near forepaw lifting naturally while tail balances; frame2 leap upward and forward with all anatomy unmistakably fox-like, forepaws reaching toward the unseen descending ball, hind legs extended and tail counterbalancing; frame3 GRAB anchor at runtime tick5: airborne compact fox reaches with the near forepaw and pointed muzzle toward the unseen ball at chest/muzzle height, other paw and hind legs tucked naturally, eyes focused on the catch; frame4 descend and land softly on all four paws, alert muzzle forward and ready to carry the separately rendered ball. No human arms, hands, standing posture, clothes other than the fitted vest, opponent or floor. Match the attached atlases' crisp richly shaded 1990s arcade pixel art with clear outlines and true transparent background. No ball, props, court, hoop, shadows, glow, text, numerals, lettering, logos or scenery.
```

## Accepted background-correction retry

- Generation ID: `exec-df2d86c5-6674-4047-a1b3-0d38fc48ec81`; edits attempt1 while preserving its five fox poses.
- Source: `tools/generate-art/sources/j51-paprika-rebound5.png` (1536×1024 RGBA; SHA-256 `7afb8d42e7a9df04ed1573a349d50a83ef1a4c3c2b3fa1837ececf59155fdfc8`).
- Review: five alpha-separated full-body foxes occupy cells0–4 in row-major order; cell5 is empty. The full silhouettes remain in bounds, with zero alpha at the sheet edge. Frame3 is the forepaw/muzzle catch at the runtime marker. All five poses retain Paprika's natural quadruped anatomy, russet/cream coat, large ears, pale-tipped tail and purple/gold vest. No ball, props, text, numerals or logos appear.
- C2PA/XMP: no claim or instance metadata was returned by the image-generation tool.

Verbatim accepted edit prompt:

```text
Edit the attached five-pose Paprika rebound sprite sheet. Preserve exactly the same five fox figures, poses, faces, proportions, russet/cream fur, purple-and-gold vest, outlines, shading, row-major 3-column by 2-row positions and scale. Make only a background correction: remove the entire dark brown gradient/backdrop and all halo or haze around the figures so every non-figure pixel is fully transparent RGBA alpha 0. Keep all five complete fox figures intact and isolated, with the sixth bottom-right cell empty and fully transparent. Do not redraw, move, crop, simplify, recolor, retouch, duplicate or add any figure or parts. Do not add a ball, object, opponent, floor, shadow, text, border or background. Return the full transparent sheet.
```
