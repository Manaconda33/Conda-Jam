# J.111 — Leo reverse-layup source notes

Eight full-body poses show an image-right approach, gather, shoulder turn away, far-side reach, reverse-side release and recovery. The release pose's profile is visible in the raw sheet, but becomes too small to read as Leo's face and mustache in the packed 80×96 cell. Independent review confirmed this at runtime resolution. Do not register or accept this atlas until the release-face readability defect is corrected and the packed result is reviewed. The original candidate and all rejected correction outputs remain preserved.

- Original candidate generation: `exec-09ac073c-ba6b-415f-946e-9bce6ec80993`; date 2026-10-24; canon K.05. Source-only; not accepted for runtime.
- Raw sheet: `tools/generate-art/sources/j111-leo-layup-reverse-generated-raw.png`; source/atlas hashes in `tools/generate-art/j111-leo-layup-reverse8-provenance.json`.
- Atlas: `public/assets/animation/leo-layup-reverse-right.webp`; layout: `tools/generate-art/leo-layup-reverse8-layouts.json`.
- Packer/cleanup: `tools/generate-art/package-leo-action8.py`; it isolates eight original components without inventing frames. The source pose contains a profile at full size, but the packing reduction obscures the defining face and mustache details.
- Verbatim prompt: `tools/generate-art/j111-leo-layup-reverse8-prompt.md`. Four face-readability correction generations were rejected; see `tools/generate-art/j111-leo-layup-reverse-attempts.json` for generation IDs, exact prompts, raw paths, hashes and review reasons.

Initial separate Leo ball track: height `[0.95,1.2,1.3,1.85,2.1,2.25,1.3,0.6]`; forward `[5,7,8,5,2,1.5,7,5]`. Far-side release is frame5/tick12. This track remains an unreviewed proposal; runtime hand-contact tuning and manifest registration await acceptance of readable artwork.
