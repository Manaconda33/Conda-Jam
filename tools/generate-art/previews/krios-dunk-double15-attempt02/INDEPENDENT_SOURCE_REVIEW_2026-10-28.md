# Krios `dunk-double` attempt02 independent source review

**Review date:** 2026-10-28  
**Verdict:** PASS FOR SEPARATE BALL-TRACK TRIALS ONLY; NOT ACCEPTED FOR REGISTRATION

## Evidence reviewed

Reviewed attempt02's raw ImageGen edit, its exact edit prompt, the canonical `dunk-double` pose catalog, 15 isolated 128×96 cells, the cleanup report, and light and dark atlas previews. Compared the complete raw sheet with rejected attempt01.

## Findings

- **Frame07 correction passes:** the apex now shows Krios airborne with the absent ball held low at his chest and elbows bent. This is distinct from frame06's dip and from frames08–09's second upward pump. It restores the missing second-gather/apex beat that rejected attempt01.
- The first overhead pump remains visibly held in frame03, folds down in frame04, and returns to the chest in frames05–06. Frames08–09 rise into the second extension; frame10 opens the hands for the one release; frame11 has a distinct extended follow-through; frames12–14 descend and land. These differences read at the normalized target size.
- Krios remains recognizable throughout: volcanic-red skin, curled black ram horns, charcoal beard, muscular human anatomy, black/ember uniform and dark shoes. All figures are complete; no ball, ball-like prop, text or logo is baked into the artwork.
- Cleanup produced exactly 15 separate components and 15 unique normalized frame hashes. The RGBA atlas is 1920×96 with 128×96 cells, shared baseline y94, 8 px minimum top margin, and 22/23 px minimum horizontal margins. The light/dark proofs show no distracting green fringe. Nearest-neighbor scaling retains crisp edges.
- **Edit scope caveat:** although the edit prompt requested changing only frame07, pixel comparison against attempt01 shows changes in all 15 raw cells. The other fourteen poses were visually reviewed and remain within the same action beats, Krios identity and costume, but they are regenerated variants rather than pixel-preserved cells. No source-frame hashes are claimed as preserved.
- The next gate remains separate-ball-track calibration followed by normal-loader review on the current Jam Stage court. Pay particular attention to ownership through the first held pump, the lower frame07 apex, the second pump, release tick21, score tick23 and landing tick30.

## Provenance checked

- Generation ID: `exec-5467febc-134f-4649-9c28-ba27f649f325`
- Raw source SHA-256: `2e108cda8e0aef9d1c4e0790f00e419d706566be682cd68f9c44ff9a4bbeb1cf`
- Exact edit prompt: `tools/generate-art/krios-dunk-double15-attempt02-imagegen-edit-prompt.txt`
- Edit prompt SHA-256: `e878032001419cf0e6aed399e314a59380572dfeb46570f7d139a4e556f18541`
- Cleanup layout: `cleanup-layout-report.json`
- Candidate atlas SHA-256: `d18b4abe52b67b46fdf5294fc8398293ab39a0bb6cde205994d90a5eb9e395a9`
- Parent attempt: `tools/generate-art/sources/krios-dunk-double15-attempt01-generated-raw.png` (attempt01 rejected for frame07 pose mismatch)
