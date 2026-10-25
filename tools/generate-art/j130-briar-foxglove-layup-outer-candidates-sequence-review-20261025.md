# J.130 Briar layup outer-candidate sequence review — 2026-10-25

**Decision: advance these five provisional candidates to whole-sequence normalization/review only. None is accepted for atlas packing or registration.** Frames 2–4 remain unresolved, so the action cannot yet be judged end to end.

## Evidence inspected

Compared the cleaned candidates for frames 0, 1, 5, 6 and 7 against their raw-source review records, alpha measurements, and the light/dark sequence proof at `tools/generate-art/previews/j130-briar-foxglove-layup/outer-cleanup-candidates-sequence-review-20261025.png`. Reviewed the untouched sources, cleanup metadata and accepted Briar art references cited by their candidate records.

All five figures retain recognizable Briar identity: adult human anatomy, warm brown skin, shoulder-length dark locs, red headband, and russet/cream Emberwood kit. Each has two arms, two hands, two legs and two shoes; wrists are bare, hands are empty, and no ball is painted into the art. The action reads as a grounded gather (0), one-foot takeoff (1), airborne follow-through (5), descent/stride (6), then grounded crouch (7). No missing or extra body parts, visibly lost features, or pose collisions were found in these candidates. The larger cream leaf accents remain as in the generated source and accepted cleanup review; no edits were made to them.

Corrected candidate files and hashes:

| Frame | Candidate SHA-256 | Bounds in 1254px cell (LTRB, exclusive) | Minimum margin | Cleanup scale |
|---:|---|---|---:|---:|
| 0 | `e33c80885df99cd2ab08e44077622d4b738bcf6d5d2daa95d44f430118e9a509` | 322, 219, 931, 1034 | 219px (17.464%) | 0.93570608 |
| 1 | `39f31e75aec7dcb4448550af2ac4821c42fd1226520cef40ecf916ca10333abd` | 364, 219, 890, 1034 | 219px (17.464%) | 0.87918015 |
| 5 | `b77e97ae8c5f7e488f76bf7c83994c03cf1bebe1c09ddaf180b67f52db37964a` | 429, 251, 824, 1003 | 251px (20.016%) | 0.99602649 |
| 6 | `1035a9fd8432c479b6018536b691e7572513bc1d410699728f300b50c46acb07` | 392, 257, 861, 997 | 257px (20.494%) | 1.0 |
| 7 | `2794a97ef551cb07f7fa62f640a06ea986cd998bdae91793687b2ff881c355ec` | 415, 314, 838, 940 | 314px (25.040%) | 1.0 |

Frames 0–1 miss their requested 17.5% padding by one pixel: 17.5% of 1254 is 219.45px, requiring at least 220 whole pixels. Frames 5–7 meet their recorded 20% margin threshold. The corrected frames 5–7 each have one connected nonzero-alpha component after cleanup; the only removed post-resize satellite was one alpha-1 pixel from frame 5. The 0–1 independent review confirms their declared masks and resampling, while noting a few removed alpha-8/9 pixels in frame 0. These operations are cleanup/scale/placement only; no anatomy was redrawn.

## Sequence-level blockers

The visible figure heights are 815px, 815px, 752px, 740px and 626px respectively. The shorter frame 7 silhouette is consistent with a deep crouch, so equal bounding-box heights would distort the pose. However, these were independently fitted and positioned; cleanup scales differ materially (0.879–1.0), so relative head/body scale and trajectory must be verified against frames 2–4 before acceptance.

The present coordinates also do not share a grounded anchor: frames 0–1 end at y=1034, while grounded frame 7 ends at y=940. Simply moving frame 7 down 94px to match that baseline would lower its bottom clearance from 314px to 220px, below its 251px minimum. Whole-sequence normalization must choose a common scale/layout and appropriate ground line, preserve all required cell padding, and keep frames 5–6 on the airborne trajectory. Do not pack the current individually centered candidates as-is.

## Source records

- Frames 0–1: `tools/generate-art/candidates/j130-briar-foxglove-layup-poses01-cleanup-retry1/review-metadata.json` and `independent-review-poses01-silhouette-20261025.md`.
- Frames 5–7: `tools/generate-art/j130-briar-foxglove-layup-attempt2-poses5-7-retry1-clean-candidate.json` and `tools/generate-art/j130-briar-foxglove-layup-attempt2-poses5-7-cleanup-independent-rereview.md`.
- Their original prompts and generation provenance remain in their frame-specific `pose*-retry1-prompt.md` and `pose*-retry1-provenance.json` records. Original raw sources remain untouched.

This review changes no source, cleanup candidate, prompt, production atlas, status document, or J.106 helper.
