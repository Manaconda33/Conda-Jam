# Krios J.128 `layup` attempt06 cleanup/layout trial review

**Disposition: retain as a cleanup and layout trial; do not approve as production art, final atlas, or runtime source yet.** The pose sheet is a strong source candidate and the individual frame separation is now numerically solved, but visible green contamination remains and the current vertical placement is not baseline/action aligned.

## Reviewed files

- Raw generated source: `tools/generate-art/sources/krios-layup8-attempt06-chromakey-generated-raw.png`
- Prompt: `tools/generate-art/krios-layup8-attempt06-chromakey-prompt.md`
- Source review: `tools/generate-art/previews/krios-layup8-attempt06/INDEPENDENT_SOURCE_REVIEW.md`
- Cleanup script/report: `tools/generate-art/clean-krios-layup8-attempt06.py`, `tools/generate-art/previews/krios-layup8-attempt06/cleanup-layout-report.json`
- Transparent 4×2 sheet and light/dark proofs: `krios-layup8-attempt06-keyed-layout-trial.png`, `light-preview.png`, `dark-preview.png`

## Art and pose review

All eight cells show a full, recognizable Krios with red skin, curled dark horns, charcoal beard, dark Rams uniform with red/gold piping, socks and boots. The sequence reads as gather, takeoff, ascent, extension, release/peak, descent, landing approach, and finish. Limbs remain coherent and pose silhouettes are distinct. The green ball-shaped fragment visible by pose7's hands in the raw source is absent from the cleaned layout. I do not see a ball baked into the cleaned pose art.

## Cleanup findings

The output has binary transparency and preserves the large exterior matte as transparent. At 2× nearest-neighbor inspection on a white background, residual green fringe is still visible on the outside silhouette, especially around pose0's horns, hair, shoulder and boot (also present on other poses). Green flecks are visible in the horn curls. They are small but distinct against both light and dark previews. The local RGB repair reduces some green pixels but does not remove the remaining visible spill. Apply a more precise local edge decontamination step, preserving black outlines and red/gold pixels, then regenerate both proofs and review at 100% and enlarged scale. Do not use a broad green threshold across all character pixels; that creates holes in the red/black artwork.

The cleanup report's pixel counts describe its source-alpha stage and should not be compared directly to the resized final sheet's alpha-pixel count. The script and report make the raw source hash and key/layout transforms auditable. Update the generation provenance's cleanup fields once the cleanup trial is recorded; it currently still says cleanup has not been performed.

## Layout and runtime suitability

All eight resulting source cells meet the stated 24px transparent-margin requirement under the report's alpha-bounds method. The tightest is frame3 at 24px on its right/bottom edge; frame4 has 26px at the bottom. No figure is clipped by its 384×512 cell. One uniform source scale (`0.995708...`) is applied to every pose, so no frame-specific enlargement is hidden in the layout.

However, the trial centers each figure vertically in its cell. Resulting bottom bounds in cell coordinates range from y=409 (frame0) to y=488 (frame3), a 79px variation. This trial must not be packed directly into the production atlas: the next layout pass needs the action's intended vertical travel and a consistent ground baseline for poses that are grounded. Preserve deliberate airborne lift for takeoff/ascent/peak/descent while aligning the relevant ground contacts, rather than centering every crop independently. Calibrate the separate athlete-specific ball track only after this action-aligned pack is rendered in the registered runtime.

## Recommendation

Proceed to a second cleanup/layout trial. Preserve the raw source and this review; keep attempt06 classified as a generated source candidate pending cleanup/layout approval. After removing remaining green spill, make an action-aligned atlas candidate with the 24px crop margins retained, check both facings, then perform actual registered-runtime ball-track review. This review does not approve runtime registration or claim the layup clip complete.

## 2026-10-28 04:51 UTC — updated runtime-size layout review

The regenerated files were re-inspected: `krios-layup8-attempt06-keyed-layout-trial.png`, `runtime-candidate-light.png`, `runtime-candidate-dark.png`, `runtime-layout.json`, and `cleanup-layout-report.json`. I also enlarged the runtime candidate 4× with nearest-neighbor interpolation and checked its retained pixels.

**Updated disposition: proceed to ball-track trials with this runtime-size atlas candidate, pending actual registered-runtime review.** The green fringe and the green flecks in the horns that were visible in the earlier transparent-sheet proof are no longer apparent in either runtime preview or the enlarged atlas. A pixel scan of the packed runtime candidate found zero opaque pixels meeting `G >= 50`, `G-R >= 4`, `G-B >= 4`. This supports the visual result; it is not by itself a replacement for edge inspection. The current cleanup report records a local RGB repair and matte-edge alpha clearing. Preserve this report and the raw source so the repair remains attributable.

The runtime pack now applies one fixed `.18` scale, horizontally centers all eight crops, and places their alpha bounds at baseline y=94. Per-frame scaled sprite sizes range from 37×81 to 58×55 px; the differing heights read as the generated pose silhouettes rather than inconsistent resampling. All remain within the 128×96 cells, with two transparent rows below the baseline as reported. The enlarged preview shows the small but readable Krios figure, full anatomy, intact outlines, and all poses distinct in sequence.

The action-aligned placement resolves the previous 79px baseline variation. This is suitable for separate athlete-specific ball-track calibration trials because the layout is now fixed at runtime dimensions and the release/peak pose is frame4. It remains unapproved for production: validate hand placement, ball contact/release/ownership, scoring, both facings, and 100%/120% actual registered rendering before registration. Update attempt06 provenance cleanup status and runtime candidate status if this candidate advances.

## 2026-10-28 04:55 UTC — final source and atlas art disposition

**Art-source disposition: accept attempt06's cleaned and fixed-scale native 128×96 candidate for production registration.** This accepts the source artwork and its transparent atlas derivation only; it does not approve a gameplay track, clip timing, runtime behavior, or claim `layup` complete.

I rechecked the exact raw source, verbatim prompt hash, generation ID, cleanup script/notes/report, derived sheet hash, runtime atlas hash, and runtime layout. The raw source is preserved and unchanged. The accepted derived images match the recorded hashes. The processing is deterministic from the reviewed source bounds and documented thresholds/repairs; no pose was redrawn, duplicated, or synthesized.

The runtime candidate has eight complete, distinct poses, consistent Krios identity/anatomy and uniform treatment, binary alpha with transparent surroundings, and no basketball in the accepted art. The isolated green ball-shaped artifact from the generated raw sheet is removed in the accepted derivation. I inspected the corrected runtime atlas and enlarged nearest-neighbor frames on a light background; no green fringe or horn contamination is visible. The packed atlas has zero opaque pixels matching either the recorded strong key predicate (`G >= 130`, `G-R >= 40`, `G-B >= 40`) or the weak spill predicate (`G >= 50`, `G-R >= 4`, `G-B >= 4`). It retains complete outlines and no visible holes. The transparent 4×2 source-cell layout also meets every 24px minimum margin in the report.

All eight runtime frames use the same `.18` resampling scale, horizontal centering, and y=94 bottom baseline within 128×96 cells; the alpha bounds fit without clipping. I checked the native right-facing art and a mirrored proof of the release pose. The curled horns, beard, kit, anatomy, and raised shooting arm read coherently in both facings; the uniform contains no readable asymmetric number/text or directional prop. The canonical Krios mirror policy is marked safe. Thus the artwork is suitable for both facing selections, while right/left ball placement and ownership remain to be calibrated and verified independently in the registered runtime.

The prior ball-track-trial-only disposition is superseded for source/atlas artwork. The remaining approval boundary is gameplay integration: add the atlas/provenance to production registration only with accurate source classification, then complete the separate athlete-specific ball track and actual runtime review for release/contact, scoring, both facings, and clip transitions. This art-source acceptance is not a full `layup` clip acceptance.
