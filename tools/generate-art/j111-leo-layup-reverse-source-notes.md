# J.111 — Leo reverse-layup source notes

Eight full-body poses show an image-right approach, gather, shoulder turn away, far-side reach, reverse-side release and recovery. The accepted production source is the attempt06 cleanup01 atlas; its face and mustache remain readable at packed 80×96 scale, and only two off-palette transparent edge pixels were cleaned without repainting athlete pixels. This replaces the earlier source-only hold described in the dated history below. The source, rejected corrections, and all runtime attempts are preserved.

Runtime integration completed on 2026-10-28. The accepted athlete track is height `[0.4,1.61,1.98,2.6,2.65,2.65,1.45,0.84]`, forward `[5.85,6.58,4.02,4.5,5.5,6.8,6.58,5.85]`, release velocity `0.45`; release occurs at tick12. Attempt21 uses the registered public atlas and production track in a fresh browser process per facing, covers both facings at 100%/120%, scores at tick49 in each direction, and is independently approved. Attempt20 remains preserved as a rejected camera-framing failure. Review: `tools/generate-art/previews/j111-leo-layup-reverse-track-candidate/attempt-21/INDEPENDENT_RUNTIME_REVIEW.md`.

- Original candidate generation: `exec-09ac073c-ba6b-415f-946e-9bce6ec80993`; date 2026-10-24; canon K.05. Source-only; not accepted for runtime.
- Raw sheet: `tools/generate-art/sources/j111-leo-layup-reverse-generated-raw.png`; source/atlas hashes in `tools/generate-art/j111-leo-layup-reverse8-provenance.json`.
- Atlas: `public/assets/animation/leo-layup-reverse-right.webp`; layout: `tools/generate-art/leo-layup-reverse8-layouts.json`.
- Packer/cleanup: `tools/generate-art/package-leo-action8.py`; it isolates eight original components without inventing frames. The source pose contains a profile at full size, but the packing reduction obscures the defining face and mustache details.
- Verbatim prompt: `tools/generate-art/j111-leo-layup-reverse8-prompt.md`. Four face-readability correction generations were rejected; see `tools/generate-art/j111-leo-layup-reverse-attempts.json` for generation IDs, exact prompts, raw paths, hashes and review reasons.

The first separate Leo track proposal was superseded by the accepted attempt14/attempt21 profile above. Far-side release remains frame5/tick12.


## Frame5 correction iteration — 2026-10-27

Attempts 1–4 remain rejected as recorded above. New face-fix attempt05 (`exec-d93365ce-0ee6-46e0-862c-2ea73eb4c9bf`) was rejected after independent packed-scale review because the profile and mustache still did not read at 80×96. Attempt06 (`exec-ad359e27-75b9-43c1-af84-f9911bd6e978`) exposes the profile, eye, nose and upper-lip mustache at packed scale; reviewer approved the face/body. Two isolated low-alpha yellow/olive edge pixels were targeted and removed in cleanup01 without repainting athlete pixels. Cleaned atlas and light/dark/zoom10 previews are retained; independent cleanup review is pending. Do not register until that review and J111’s separate ball track are calibrated and validated.


Head-only attempt07 (`exec-434fd6ee-da85-431c-9eba-2ba7ce6acf3d`) is preserved but rejected as the production correction: its larger-scale face was not a localized patch and it reworked the neck/shoulder/body crop. Attempt06 cleanup01 remains the selected source because independent review confirmed the face and mustache, and confirmed cleanup changed only two transparent off-palette pixels. J111 track calibration is now underway.
