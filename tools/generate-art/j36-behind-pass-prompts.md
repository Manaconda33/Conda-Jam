# Action 03 — Reed Ashcroft and Juniper Vale, behind-the-back pass

Create six original right-facing full-body poses for the `pass-behind` clip, in a 3×2 transparent row-major sheet. Runtime durations are `[2,2,3,1,2,3]`, with frame3 released at tick7. Each exact prompt and source record is in the matching `*-pass-behind6-provenance.json`.

## Pose and identity constraints

The sequence is (0) open-hand ready stance; (1) rotate shoulders and hips toward the near hip; (2) load the throwing hand behind the waist while balancing with the other hand; (3) extend the throwing arm behind the body at hip height for the marked release; (4) low rearward follow-through; (5) recover to ready. The release hand must read clearly behind the torso, distinct from chest and overhead passes. The prompt prohibits any basketball or held object in all six drawings.

Reed's prompt preserves cell0 medium-brown skin, dark eyes/brows, small goatee, dark-purple braids in a high topknot, natural human build, purple/gold Condas kit and white lower-leg wear. Juniper's preserves cell1 light-warm skin, dark eyes, high dark-purple curls and gold tie, compact natural human build, purple/gold kit and dark knee pads. Both prompts use the athlete's portrait/gameplay crops as identity references and clean standard-pass atlases for scale/style.

## Accepted sources and atlases

| Athlete | Cell | Source SHA-256 | C2PA claim | Packed atlas |
|:--|--:|:--|:--|:--|
| Reed Ashcroft | 0 | `5e143021d547aa3bc77c6f3c7174a1d67ce0cd06ca5f4b8ffffa242328183ee7` | `urn:c2pa:9fbc1ede-d3d1-499c-8584-69226e6b761d` | `reed-ashcroft-pass-behind-right.webp` |
| Juniper Vale | 1 | `db6cc001535e969934c74d13f3104d5569eb75de756e934e32d8eb7ef17bbb0b` | `urn:c2pa:343053b0-b094-41b6-ae31-51a783aaa5ae` | `juniper-vale-pass-behind-right.webp` |

Both 1536×1024 RGBA sources contain six distinct complete bodies at alpha threshold64, ordered row-major. Review over light/dark backgrounds confirms empty hands, no jersey numerals, and a visible rear-hand frame3 release. The PNG C2PA claim and XMP instance identifiers are retained because the image-generation response did not expose a separate job ID. Component isolation packs only original pixels into lossless 288×192 atlases with 96×96 cells; all six decoded frame hashes differ. Source rectangles and scale are recorded in the `*-pass-behind6-layouts.json` files.

Canon mirror review approves horizontal body mirroring. Separate athlete tracks put the frame3 ball at height1.25 with forward offsets−14.5 (Reed) and−14 (Juniper); both remain behind the torso. Standard and zoom120 native Canvas previews load114 images and capture87 snapshots per athlete. Each pass clip selects production art in both facings, and the ball meets the rear hand at release. Captures are under `artifacts/native-render-preview/{reed-ashcroft,juniper-vale}{,-zoom120}`; dark/light atlas sheets are under `artifacts/asset-review/j36/`.
