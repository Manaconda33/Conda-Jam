# J.131 Briar Foxglove `layup-reverse` — ImageGen prompt, attempt 04

Make one transparent PNG sprite atlas for the game. The whole canvas is landscape 3:2 (1536 by 1024 pixels). Divide it into exactly four columns and two rows: eight portrait cells, each 384 by 512 pixels, corresponding to production sprites of 72 by 95 pixels. Leave 12% fully transparent padding on all four sides of every cell. The single figure in each cell must occupy at most 68% of the cell height and 70% of the cell width, centered horizontally. The feet in grounded poses align on one shared baseline. Do not draw any alpha pixels in the padding. No overlap, touching, crop, blur, trails, echoes, or ghost duplicates.

Use the accepted J.130 Briar Foxglove layup atlas as the exact character and rendering reference. Match its face, deep warm-brown skin, dark locs, red headband, compact athletic proportions, russet/cream Emberwood uniform, chest mark, shorts panels, socks and shoes exactly. Keep the same pixel scale, palette, crisp clusters, and compact game-sprite finish. Do not add or remove any kit mark, trim, color block, accessory, or logo. The accepted gameplay idle sprite is secondary identity reference only. Do not turn the atlas into a smooth illustration, 3D render, painterly image, gradient shaded image, or antialiased portrait.

Each cell has exactly one isolated complete Briar figure with exactly two arms, two natural hands, two legs, and two shoes. Every hand is empty. No ball or ball-shaped object is drawn. No court, hoop, shadows, scenery, cell border, grid, labels, text, effects, or background. True transparent pixels between and around figures.

Create this right-facing reverse-layup sequence in cell reading order; every item is a single still pose without motion echo:
1. Approach: upright running stride toward the right, arms low, not yet gathering.
2. Takeoff at runtime tick 2: lead knee rises, body begins a turn, arms are still separated and readable.
3. Rising cross-under: clearly airborne, torso rotated, one arm across the body and the other balancing low; distinct from the takeoff.
4. Far-side gather: visibly different torso twist and arm arrangement from pose 3, compact preparation before the peak.
5. Peak at runtime tick 10: highest, most compact airborne pose, knee tucked, opposite leg extended, empty hand cocked near the head.
6. Release at runtime tick 12: arm fully extended overhead with open hand and a distinct wrist flick; visibly different from the cocked peak. No ball.
7. After release: descending, release arm lowered across the body, shoulders unwinding, legs opening for landing; no overhead extension.
8. Finish at runtime tick 17: grounded soft landing, balanced upright recovery, arms down.

Do not prescribe which side of Briar's head the shooting arm crosses. Maintain Briar's exact appearance through her turn. At the target 72x95 display size, all eight complete silhouettes must remain crisp, distinct, anatomically clear, and safely inside their separate portrait cells.
