# Kraken push attempt03 edited raw — independent source review

**Verdict: reject this edit as a fix for the live contact pose; preserve it as a reviewable edit, but do not register or pack it.** Reviewed raw `tools/generate-art/sources/kraken-push11-attempt03-edited-raw.png` against its edit prompt and lineage. The prompt/provenance numbering is inconsistent with the canonical clip index, so both interpretations matter.

## Count, identity, and action

- The sheet contains 11 full-body figures in a recognizable 4×3 row-major arrangement with the last cell empty. Pose order broadly reads as load/step/drive, anticipation/contact/follow-through/recoil, then recovery/settle/ready. Kraken's auburn hair, pointed ear, copper amulet, burgundy/copper uniform, athletic proportions, and shoes remain coherent. Limbs are connected; no ball is baked in.
- **Literal edit-prompt pose:** the first cell of row two (the fifth pose when counted from 1) now has two visibly distinct forward forearms and open palms. The hands are staggered, and a transparent gap is visible between them in the raw image.
- **Canonical live contact frame:** prior attempt02 provenance identifies contact as zero-based frame 5 at tick8, which is the second cell of row two. That pose still has overlapped/merged hands at its endpoint and does not show two separate palms. The edit therefore changed the preceding anticipation pose, leaving a contact-like palms-out gesture one beat early while failing to fix the actual tick8 contact frame.

## Layout and rendering

- The sheet has true transparent corners and 11 separated alpha components, but safe per-cell margins are not preserved. At a nominal 4-column split of the 1323px sheet, the first cell of row two reaches the column edge, the adjacent contact figure also touches that boundary, and the next long-arm pose crosses well into the following column. Several top-row feet sit at the row boundary. These figures cannot be treated as safely isolated 80×96 cells without a deliberate normalization/crop trial.
- Partial alpha remains high (492,723 pixels with alpha 1–254); bright red/orange edge fringe is still visible on hair, arms, shorts, and shoes. The raw edit does not satisfy the prompt's no-fringe requirement.
- Rendering remains smoothly shaded and illustrated, with blended muscle and cloth gradients rather than the hard-edged pixel clusters requested. Kraken identity is good, but the pixel-style correction did not land.

## Recommendation

Reject as a contact-pose correction. The literal fifth pose has a good separated-palms gesture, but it is shifted one beat earlier than canonical frame5/tick8; the canonical contact pose still merges the palms. A further targeted edit should resolve the frame numbering, put separated palms in zero-based frame5/second cell of row two, preserve anticipation in frame4, and maintain safe per-cell margins while removing red fringe and painterly shading. No production asset was modified.
