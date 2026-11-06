# Krios J.128 `layup-reverse` — attempt 01 prompt

Create one production source sheet of **exactly eight individually drawn animation poses** for the same identifiable athlete Krios. Use the supplied approved Krios right-facing animation atlases as strict identity, anatomy, color, costume, and pixel-art references. Draw only Krios. The sheet is a 4-column × 2-row grid in row-major order, one complete pose centered in each equal cell. Keep each entire silhouette inside its own cell with at least 32 px of clear key background at every edge, including curled horns, fingers, beard, boots, and clothing. Keep all poses at a consistent source scale and preserve coherent adult human bipod anatomy. Keep a stable ground baseline for grounded poses and deliberate vertical rise/descent in airborne poses.

Krios is a towering, enormously muscular adult male horned giant with vivid volcanic-red skin, massive curled near-black ram horns, wild charcoal beard and hair, a fierce intelligent face, the black/charcoal Scoria Rams uniform with ember-red and gold trim, and rugged dark high-top boots. Preserve those features and proportions consistently in all eight poses. Do not change his face, horn shape, beard, kit, footwear, body scale, handedness, or facing between frames.

Action: an explosive right-facing reverse layup. Krios gathers low on the inside hip, turns his shoulders partly away from the rim, takes off from the inside foot, rises with his opposite knee driving upward, protects the separate ball across his abdomen/ribs, carries it behind the far side of his head, then releases once with an outward wrist roll and open guide hand. He descends while untwisting and lands in a balanced, staggered bent-knee finish. The move must read clearly as a reverse-side finish rather than a conventional straight layup. Keep the shooting arm, elbow, wrist, knees, feet, and torso articulated naturally. No duplicated or near-duplicate poses.

Pose order and canonical timing (frame duration ticks `[2,3,2,3,2,1,4,4]`; total 21 ticks):

0. Low inside-hip reverse gather; shoulders begin turning away. Frame start tick 0.
1. Inside-foot takeoff; opposite knee rises; ball is protected across abdomen. Tick 2.
2. Partly back-facing rise; ball carried across ribs, shield arm out, knees tucked. Tick 5.
3. Rising behind the rim path; shooting elbow bent beside ear, wrist beginning outward roll. Tick 7.
4. Peak and final carried-ball pose; shoulders rotated, shooting hand behind head toward far side, elbow still bent. Tick 10.
5. Single far-side release at tick 12: fingers open; guide arm fully separated; ball remains absent from the drawing.
6. Descent and untwist, shooting arm lowers, feet prepare to land. Tick 13.
7. Staggered bent-knee landing and balanced finish, eyes returning to target. Tick 17.

The basketball is a separately rendered gameplay object: **do not draw a basketball, ball-shaped object, ball shadow, or ball glow in any cell**. Do not add text, motion streaks, rim, court, props, opponents, duplicate limbs, extra digits, or background scenery.

Background/alpha handling: use a perfectly flat, opaque chroma-key matte of RGB `(0,255,0)` over the entire canvas. No gradients, texture, vignette, halo, shadow, haze, spill, or other background color. Keep the key matte fully separate from Krios: his skin, face, eyes, beard, hair, horns, black kit, red/gold trim, socks, and boots contain no green pixels or green reflected light. Crisp bounded pixel-art silhouette with clean black outlines. Pixel-art shading must come only from the approved Krios palette reference. No glow or soft lighting. Output the complete 4×2 sheet at 1536×1024 if supported; otherwise preserve the 4×2 arrangement and equal cell dimensions.
