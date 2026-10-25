# J.130 — Briar Foxglove `layup` source work

## Target and canon

The canonical clip is nonlooping, eight frames, durations `[2,3,3,2,1,3,4,4]` for 22 ticks. Takeoff begins frame1/tick2; peak and one-hand release are frame4/tick10; the grounded finish is frame7/tick18. The pose catalog is `tools/generate-art/pose-catalog.json`.

Briar is an adult human woman with warm deep-brown skin, shoulder-length dark locs, vivid red headband, compact athletic build, russet/cream sleeveless Emberwood kit, cream socks and matching trainers. No fox traits. Draw right-facing three-quarter poses with consistent scale and complete anatomy. The source remains ball-free; fit a separate Briar-specific ball track to the accepted hand positions and carry through tick9, release at tick10. Native review must cover carry, release and flight in both facings at100% and120% zoom.

## Attempt 1 — rejected

Exact prompt: `tools/generate-art/j130-briar-foxglove-layup-prompt-attempt1.md`.

- Generation `exec-06e10426-25c6-4665-bbd0-f104ce0020a8`; raw `tools/generate-art/sources/j130-briar-foxglove-layup-attempt1-raw.png`; SHA-256 `460e81a5e09abc0386e6b88d027ad45fb0767a8e568ed8bb0daac0946b8eda38`; 1774×887 RGBA.
- Review: `tools/generate-art/j130-briar-foxglove-layup-attempt1-review.json`; light/dark preview: `tools/generate-art/previews/j130-briar-foxglove-layup/attempt1-light-dark-review.png`.
- The eight poses are distinct and broadly retain Briar's identity/anatomy. Reject the sheet because frame0 contains a baked basketball, low-alpha residue reaches the cell borders, and the closest alpha>=64 figure margin is4px at frame3's bottom (frame4 has11px top). No cleanup, normalization, packing, registration or acceptance was performed.

## Attempt 2 — individual poses in progress

Frames4–7 first generation: separate untouched 1254×1254 RGBA sources. Independent review rejected frame4's extended trailing leg. Frames5–7 had clear sequence but red wristbands absent from accepted references, so fresh bare-wrist poses were generated.

Frames0–3 first generation: independent review rejected frame2 for an early hand height and frame3 for a release-like dropped wrist. Frames0–1 showed grounded approach/takeoff but have loose source alpha.

Frames5–7 retry1 use bare wrists and pass independent pose/identity review for cleanup. Their files, hashes and metrics are recorded in tools/generate-art/j130-briar-foxglove-layup-attempt2-poses5-7-retry1-review.json. Low-alpha residue needs isolation; frame5 visible top margin is19.94% versus its20% prompt, while frames6–7 exceed20%. Leaf accents are larger than references but remain costume decoration. No final source is accepted.

Cleanup-only candidates now exist for poses0–1 and5–7. Poses0–1 preserve their complete authored silhouettes and keep the grounded gather distinct from one-foot takeoff; the independent comparison is `tools/generate-art/candidates/j130-briar-foxglove-layup-poses01-cleanup-retry1/independent-review-poses01-silhouette-20261025.md`. Their minimum threshold-1 margin is219px/17.464%, one pixel below the requested17.5%, and independent crop sizing makes pose1 smaller than pose0. Preserve these as provisional only; whole-sequence scale and placement must be normalized before further review. For poses5–7, the first cleanup script omitted applying its component mask; independent review `j130-briar-foxglove-layup-attempt2-poses5-7-cleanup-independent-review.md` caught remaining disconnected specks. The corrected script applies the largest 8-connected alpha component before cropping and removes at most one post-resize detached pixel. Independent re-review `55c3ab64` confirms each corrected candidate has one nonzero-alpha component, >20% clean margins, and retained anatomy. They also remain provisional until full-sequence normalization/review.

Frames0–3 retry1 are reviewed in tools/generate-art/j130-briar-foxglove-layup-attempt2-pose0-3-retry1-review.json: frames0–1 pass for cleanup; frame2 hand is above forehead rather than beside cheek; frame3's hand is overhead and its skin palette is too orange/light. A later palm-up prerelease source originally overwritten into the pose3-retry1 path was recovered as pose3-retry3, and the exact original retry1 file was restored from git history. The corrected review records which generation each preview showed. Pose3-retry3 has the right palm-up/open-off-hand gesture but its rear leg is too straight.

### Pose2/3 retry generations (all rejected)

- Pose2 retry2: generation `exec-30ce7e37-acfb-411f-8a31-b90228bafa53`, SHA-256 `d37b346999c2aceb0a44da3d2ba6f925439cf5dee29354732047e8c4e143e529`. The folded rear leg and cheek-level carry are improved, but skin/shoes remain too orange/russet, visible top clearance misses the prompt, and raw low-alpha residue touches the canvas edge. Exact prompt, raw, metrics, and rejection are in the `pose2-retry2` prompt/provenance/review files.
- Pose3 retry4: generation `exec-ae7b24c9-4322-44c7-a9e5-53c8f58f6aaa`, SHA-256 `720ef642a834401417a4cc4acf5d744f7824eeac0dce047bf0307e95775ae59f`. The folded rear leg and palm-up guide-hand separation improve, but skin remains bronze/orange and fingertips rise above the crown; edge residue and margins also fail. Its exact prompt, raw, metrics and review remain in the matching `pose3-retry4` files.
- Pose2 retry3: generation `exec-e7e6c4eb-bd8b-492b-9474-ea72e9de1d89`, SHA-256 `83bc2d417df0ad6d28b3bce79ad5e658e0e6f3a1f778b1b09cf5dba1144812dd`. It retains the folded leg but remains bronze/orange with russet-dominant shoes; fingers reach brow height rather than cheek. Left/top edge contamination and the stricter 25% correction margin fail. Independently rejected in `j130-independent-pair-pose2r3-pose3r5-review-20261025.json`.
- Pose3 retry5: generation `exec-a2d5d24f-e267-44d2-97bb-0e99113064d7`, SHA-256 `c5cde3e69a7e4f4a8d3e5db99bfdcc05b9646b3129112574e19c988980d4a4ce`. Cream shoes improve and the folded leg/palm-up gesture read, but skin remains bronze/orange and fingertips reach crown height. Raw alpha residue touches the canvas edge. It is independently rejected in the same pair review. Neither pose2 nor pose3 is accepted or eligible for cleanup/assembly yet.

Frame4 retry1 fixes the folded leg but has a chest marking and color drift; retry2 has a blank shirt and bare wrists, but independent review finds the skin lighter/oranger than canon and alpha residue, with visible top clearance23.76% against a25% prompt. Frame4 retry3 edit darkens the skin toward canon and keeps the peak/release pose and blank shirt, but it redraws the silhouette/details and changes placement substantially, so the requested exact-shape edit fails; independent review rejects it. Frame4 retry4 is a fresh pose but restores a red wristband, retains orange/bronze skin, and misses its clear-margin requirement. All prompts, raw sources, hashes, provenance, previews and rejection notes remain preserved. No candidate sheet is assembled, accepted or packed.

Preserve every exact prompt, generation ID, raw source, SHA-256, dimensions, bounds, preview and rejection/acceptance decision. Do not invent, duplicate, redraw, mirror or reorder poses. Keep the ball on Briar's separate runtime track.
