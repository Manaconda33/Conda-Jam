# Krios source art and provenance status

Krios’s existing source history is in `krios-locomotion42-final-provenance.json`, and the 42-pose source it references was generated at `/workspace/generated_images/exec-c9be9074-0b45-4b72-964f-25da095c8e51.png`, then cleaned at `/workspace/generated_images/exec-acd3d6ef-cfaf-42db-996d-17b41ef59aaa.png`. Both historical files are absent from the current workspace, so their original full-resolution pose sheet cannot be reopened. The exact prompts and both generation-history entries remain available in the provenance JSON.

Before new animation work, the five existing compiled Krios locomotion atlases and the Krios crop in `public/assets/captain-gameplay-sprites.png` were visually inspected. They confirm his enormous muscular bright-red body, large curled black ram horns, dark beard in the compiled action art, black/charcoal kit with ember-red and gold trim, and heavy dark boots. The master specification also requires his wild dark beard and imposing build. New Krios frames use his compiled art and source notes for identity anchoring; no existing assets or provenance were altered.


## Source-only action package — `pass-overhead`

Krios has eight of 29 source clips prepared (five locomotion clips, `shoot`, `pass`, and this `pass-overhead`). The strict registered runtime count remains seven of 29 because no shared runtime, manifest, tests, or docs were changed. Next missing runtime key: `pass-behind`.

The first generated candidate `exec-3358cd0c-bbf2-4f2d-babe-641183e0edaa` is preserved as rejected because it placed the release one pose after runtime frame index 3. Accepted generation `exec-b419627e-9307-4368-8ef7-21e1fa1c0548` places the release on pose index 3. Its raw source `tools/generate-art/sources/krios-pass-overhead6-generated-raw.png` SHA-256 is `bd5fdf53129e3b4574a50076da6582a55145e509885d3cfc1cf76cd78afce345`; cleaned source `tools/generate-art/sources/krios-pass-overhead6.png` SHA-256 is `aff74fcebcb4b1e60ab92f505e953231ee6124929def67507d545f093820477d`. The rejected raw sheet is retained at `tools/generate-art/sources/krios-pass-overhead6-attempt1-rejected.png`.

The exact accepted prompt, rejected prompt/reason, cleanup script, white/dark source review preview, six-frame layout, separate Krios ball height/forward tracks and generation provenance are recorded in the matching `krios-pass-overhead6-*` files. The accepted atlas `public/assets/animation/krios-pass-overhead-right.webp` is 520×192, lossless WebP, SHA-256 `bee3fbdb043d448533ad70c52daeac90e83b7013ed84d84a2b5957a78c46c019`. Identity review confirms Krios's massive red body, curled black horns, dark beard, charcoal/ember uniform and boots across all six poses; no ball is painted into the poses.
