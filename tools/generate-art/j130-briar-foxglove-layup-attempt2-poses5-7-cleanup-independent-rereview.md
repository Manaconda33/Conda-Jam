# J.130 frames 5–7 corrected cleanup independent re-review

Date: 2026-10-25. Result: **PASS for corrected cleanup candidates, all three frames**.

This review supersedes the cleanup rejection for the earlier hashes recorded in `j130-briar-foxglove-layup-attempt2-poses5-7-cleanup-independent-review.md`. It does not register or accept a production atlas.

Reviewed the corrected `clean-j130-briar-layup-poses5-7.py`, regenerated candidate JSON and light/dark preview, preserved original retry1 sources, and regenerated PNGs. The source largest-component mask is now applied before cropping. Only frame 5 creates a detached pixel during resizing; independent measurement confirms that pixel has alpha 1 and is removed.

| Frame | Nonzero-alpha components | Components at alpha >=64 / >=128 | Margins L/T/R/B | Post-resize pixels removed | Verdict |
| --- | ---: | --- | --- | ---: | --- |
| 5 | 1 | 1 / 1 | 429/251/430/251 | 1, alpha 1 | Pass |
| 6 | 1 | 1 / 1 | 392/257/393/257 | 0 | Pass |
| 7 | 1 | 1 / 1 | 415/314/416/314 | 0 | Pass |

All nonzero-alpha margins meet ceil(1254 × 20%) = 251 pixels. There are no surviving disconnected alpha components. Original edge antialiasing and near-opaque authored figure alpha remain; cleanup correctly preserves them instead of flattening the entire figure's alpha.

Independent reconstruction from each original largest component, documented resize and centered placement, followed by removal of the single frame-5 resampling satellite, matches the complete candidate RGBA arrays exactly. Frame 6 retains all 131,096 source-main-component pixels and frame 7 retains all 132,602, including exact nonzero RGBA values after translation. Frame 5 retains the complete figure through its documented 0.9960264900662251 scale to 395 × 752, with 116,130 final nonzero pixels; exact source sample equality does not apply to this resampled frame. No undocumented transformation or anatomy/costume deletion was found.

The corrected preview preserves the raw poses' visual integrity: complete locs, fingers, shoes and uniform, two arms/two legs, bare wrists, empty hands, and no prohibited number or logo. The trio remains sequence-distinct: high follow-through/early descent in frame 5, lowered balancing arms and extended lead leg in frame 6, grounded two-foot crouch in frame 7. Briar identity, brown skin, red headband, dark locs and russet/cream costume remain consistent with the reviewed raw sources and recognizable against accepted shoot/receive/idle references. Larger leaf accents remain as previously noted; cleanup introduces no additional costume change. No visible residue or lost anatomical detail appears on light or dark backgrounds.

Source and candidate hashes independently match the regenerated metadata. Independently measured bounds match metadata. Reviewed candidate hashes:

- Frame 5: `b77e97ae8c5f7e488f76bf7c83994c03cf1bebe1c09ddaf180b67f52db37964a`
- Frame 6: `1035a9fd8432c479b6018536b691e7572513bc1d410699728f300b50c46acb07`
- Frame 7: `2794a97ef551cb07f7fa62f640a06ea986cd998bdae91793687b2ff881c355ec`

No additional preview was needed. This review modifies no candidate, source, script, status document or J.106 helper. Full-sequence/native assembly review remains a separate step.
