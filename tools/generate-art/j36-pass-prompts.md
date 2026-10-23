# Action 01 — Reed Ashcroft and Juniper Vale, standard pass

Create original six-pose right-facing standard chest-pass clips for the two Chicago Condas support athletes. Each clip is a 3-column × 2-row transparent RGBA sprite sheet and supplies the six frames required by `pass` in `src/core/animation.js`. Runtime supporting cells are Reed0 and Juniper1 in `public/assets/supporting-player-gameplay-sprites.png`; portrait/gameplay crops and six-row locomotion contact sheets reconstructed from the registered atlases are attached as strict identity/style references.

## Reed Ashcroft — supporting cell0

**Generation prompt:**

> Create exactly6 original complete full-body basketball animation drawings of Reed Ashcroft on one transparent RGBA sprite sheet, arranged 3 columns by 2 rows in strict row-major order. Use the attached Reed cell0 portrait, Reed cell0 isolated gameplay crop, and his current 42-pose locomotion contact sheet reconstructed from the registered atlases as strict identity and style references. Preserve his medium-brown skin, dark eyes and brows, small dark goatee, dark-purple/black braids swept into a high topknot, athletic natural human proportions, and Chicago Condas purple-and-gold basketball uniform. Keep the small braids and goatee clear and consistent. He is the young adult human man from the references: no glasses, gray beard, wooden crest, cape, scarf, armor, animal traits or fantasy props.
>
> Draw one right-facing three-quarter full-body Reed centered in each equal cell. Match the locomotion sheet's scale, camera, linework, purple/gold kit, white lower-leg wear and matching shoes. Keep all6 figures complete, separate, in bounds and anatomically natural, with generous transparent gutters between neighboring cells and at least12% transparent padding around each full silhouette. No touching, clipping, overlap or fused figures. Hands remain empty because the real game ball is separate. No floor, cast shadow, glow, text, numbers, logos, checkerboard, panel, border, grid line, extra person or duplicated pose.
>
> Pose sequence, left-to-right then top-to-bottom: cell0 settles into a balanced passing stance with hands open near the waist; cell1 gathers the invisible ball at the chest and turns the shoulders slightly; cell2 bends both elbows and loads a clear chest-pass windup; cell3 steps forward and extends both arms at chest height in the marked pass-release pose, wrists finishing forward; cell4 holds a distinct open-hand follow-through with weight over the lead foot; cell5 recovers to a balanced ready stance. All poses show the same right-facing three-quarter view. Draw exactly6 distinct complete poses.

## Juniper Vale — supporting cell1

**Generation prompt:**

> Create exactly6 original complete full-body basketball animation drawings of Juniper Vale on one transparent RGBA sprite sheet, arranged 3 columns by 2 rows in strict row-major order. Use the attached Juniper cell1 portrait, Juniper cell1 isolated gameplay crop, and her current 42-pose locomotion contact sheet reconstructed from the registered atlases as strict identity and style references. Preserve her light warm skin, dark eyes, focused adult face, abundant dark-purple curls gathered high with the small gold tie, compact natural human athletic proportions, and Chicago Condas purple-and-gold basketball uniform. Keep her hair and gold tie consistent and attached. She is the human woman from the references: no pointed ears, fantasy features, glasses, extra jewelry, armor or props.
>
> Draw one right-facing three-quarter full-body Juniper centered in each equal cell. Match the locomotion sheet's scale, camera, linework, purple/gold kit, dark knee pads and matching shoes. Keep all6 figures complete, separate, in bounds and anatomically natural, with generous transparent gutters between neighboring cells and at least12% transparent padding around each full silhouette. No touching, clipping, overlap or fused figures. Hands remain empty because the real game ball is separate. No floor, cast shadow, glow, text, numbers, logos, checkerboard, panel, border, grid line, extra person or duplicated pose.
>
> Pose sequence, left-to-right then top-to-bottom: cell0 settles into a balanced passing stance with hands open near the waist; cell1 gathers the invisible ball at the chest and turns the shoulders slightly; cell2 bends both elbows and loads a clear chest-pass windup; cell3 steps forward and extends both arms at chest height in the marked pass-release pose, wrists finishing forward; cell4 holds a distinct open-hand follow-through with weight over the lead foot; cell5 recovers to a balanced ready stance. All poses show the same right-facing three-quarter view. Draw exactly6 distinct complete poses.

## Acceptance and mapping

Accept a sheet only if it contains exactly6 separate complete figures in reading order, all6 have empty hands, the release pose is cell3, alpha margins are clear, and face/hair/skin/build/kit match the exact cell reference. Preserve rejected generations whole. Map source poses0–5 directly to the6 runtime `pass` frames; no pose may be redrawn, copied, mirrored, interpolated or omitted. Package the six original drawings into a 3×2 atlas after uniform resize and transparent placement only. Review source, packed atlas, both-facing native previews and the separate hand/ball release track before marking production art accepted.

## J.36 generation and review record

The first two candidates were rejected for tight margins. The retry generated Reed `exec-94a3b947-5c84-4f7f-bec1-3cfd3ea45ac2` and Juniper `exec-b1ddd048-e998-45af-a528-863ed75cde0f`; Reed had a basketball baked into pose2, and Juniper had jersey numerals. Those complete sheets are preserved in `tools/generate-art/sources/` with their SHA-256 values in the per-athlete provenance JSON. An image-edit retry removed Juniper's numerals but was kept as nonproduction; Reed's edit still contained the ball and was rejected.

The accepted ball-free generations use only the portrait and clean gameplay crop as identity references, avoiding the locomotion contact sheets' visible basketballs. Exact accepted prompts, reference paths, rejected source IDs, SHA-256 values and review notes are stored in `reed-ashcroft-pass6-provenance.json` and `juniper-vale-pass6-provenance.json`.

| Athlete | Accepted generation | Accepted source SHA-256 | Atlas | Runtime cell |
|:--|:--|:--|:--|--:|
| Reed Ashcroft | `exec-0e26b6d0-e4f5-4527-b1b8-548be2e2f5b7` | `899ecb696c14b5407e66859d1698d037b4dafec79545a6e0c7129e1be139da3a` | `reed-ashcroft-pass-right.webp` (112×96 cells) | 0 |
| Juniper Vale | `exec-f2e97d9c-1237-4926-80de-a09db756662a` | `37d0b5cdbc55085872c3b0007bd300d1716660822a6007f33ae702e2ffa5b764` | `juniper-vale-pass-right.webp` (96×96 cells) | 1 |

Both accepted 1536×1024 RGBA sources contain six complete, unique connected bodies at alpha threshold64 using eight-neighbor connectivity. Their outstretched release arms cross a nominal contact-sheet cell edge, so packaging isolates the six existing bodies by alpha component, orders them by center (row-major), and scales only those source pixels. Every source figure remains within the full sheet and separate from its neighbors; no pose is synthesized, cloned, mirrored or redrawn. Frame3 maps to the standard `pass` release anchor at tick5. Lossless WebP atlases have six distinct decoded frame hashes.

The reviewed mirror policy is safe for both human athletes. Separate `pass` ball tracks are registered in `src/core/animation.js`: Reed's frame3 release offset is18 world units; Juniper's is15, matching the different atlas widths. Native Canvas previews at standard and zoom120 load110 images and capture87 frames per athlete; all six pass poses select production art in both facings. The ball sits at each extended hand on frame3 in both directions. Captures are under `artifacts/native-render-preview/{reed-ashcroft,juniper-vale}{,-zoom120}`; dark/light packed atlas reviews are under `artifacts/asset-review/j36/`.
