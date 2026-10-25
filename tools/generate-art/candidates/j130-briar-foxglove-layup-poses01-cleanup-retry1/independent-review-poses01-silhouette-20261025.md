# Independent J.130 poses0–1 cleanup review — 2026-10-25

Reviewer: poses0–3 source reviewer, independently inspecting the committed cleanup candidates.

Decision: both poses are suitable to bring into sequence-level review as provisional candidates. This is not production acceptance. Exact 17.5% zero-alpha padding still needs a one-pixel placement/size correction before strict prompt compliance can be claimed.

## Evidence

Read the cleanup script, metadata and review; inspected the light/dark preview and compared against the untouched raw sources and accepted Briar shoot/receive/idle references previously inspected in this review session. Independently measured actual alpha bounds, verified source/candidate SHA256 against metadata, and reconstructed the declared transform in memory. Both candidates exactly match the declared masked source → premultiplied uniform Lanczos resize → transparent canvas composite. Neither source was edited.

- Pose0: RGBA 1254×1254; all-nonzero-alpha bounds `(322,219,931,1034)`; actual L/T/R/B margins `322/219/323/220` px. Occupancy 815/1254 = 64.9920% vertically.
- Pose1: RGBA 1254×1254; all-nonzero-alpha bounds `(364,219,890,1034)`; actual L/T/R/B margins `364/219/364/220` px. Occupancy 815/1254 = 64.9920% vertically.
- Both have fully transparent pixels outside those bounds. The smallest margin is 219/1254 = 17.4641%, slightly below the prompt's exact 17.5% (219.45 px; therefore at least 220 whole pixels). Both exceed 15%.
- Pose0 mask removed 10,390 nonzero pixels; maximum removed alpha 9/255. Only three removed pixels have alpha ≥8: `(528,383)` alpha9, `(623,798)` alpha8 and `(623,799)` alpha8. All alpha≥10 pixels survive the mask.
- Pose1 mask removed 7,629 nonzero pixels; maximum removed alpha 6/255. All alpha≥7 pixels survive the mask.

## Visual preservation and pose review

No visible authored face, hand, hair strand, clothing panel, trim or shoe silhouette is lost. The loc tips and gaps remain legible; no hard cutoff appears in either figure. The mask evidence shows preservation of all materially opaque source pixels, but does not justify claiming every faint authored pixel survives: the method deliberately removes very faint pixels and Lanczos resamples the preserved figure. The tiny removed alpha8–9 pixels in pose0 do not form a visible strand or clothing feature in the source comparison.

Pose0 still reads as grounded approach/gather, hands low near hip, knees flexed and forward foot planted. Pose1 reads as one-foot takeoff, hands lifting toward chest, opposite knee raised and pushing leg extended. Their action silhouettes are clearly distinct.

Both retain recognizable Briar identity, human anatomy, warm brown skin with golden highlights, dark locs and vivid red headband. Bare wrists, empty hands, russet/cream kit, socks and trainers remain consistent with the sources. The large cream leaf graphics are unchanged from the generated source and remain more prominent than the accepted references. That is an existing costume consistency concern for sequence review; this cleanup did not repair or worsen it.

The candidate process independently fits each figure to the same height. Pose1 consequently has a smaller head/torso than pose0 in the proof. Relative body scale, ground/air trajectory and frame registration must be settled when all eight poses are available. These candidates are ready for that review, subject to the exact-padding note above; they are not ready for packing, registration or production acceptance.

No source assets, shared status documents, production atlases or J.106 helper were changed.
