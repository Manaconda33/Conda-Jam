# J.107 — Keeg `alley-oop-reverse` source lane

## Identity and sequence

Keeg is K.03: an adult human male, black hair, neat close beard, very tall ornate purple witch/mushroom hat with silver trim, purple/lavender/silver Moonmorel Hex kit and shoes. The basketball remains separately simulated; no accepted figure contains a painted ball or prop. Exact per-attempt prompts are retained in the sibling `j107-keeg-alley-oop-reverse-pose-*-prompt.md` files.

Pose02 is the takeoff anchor; pose05 is the lob catch at tick10. Pose06 carries the ball around the back/hip as his body turns. Pose07 begins the high reverse cock. Pose10 is the single release at tick21. Poses11–14 follow through, descend, land and recover. Right-facing original poses only; no mirroring, duplication, interpolation, or invented frames.

## Root-lane source review

| Pose | Accepted source | Generation | Cell fit at review | SHA-256 |
|---:|---|---|---|---|
| 00 | `sources/j107-keeg-alley-oop-reverse-pose-00-attempt-04.png` | `exec-3b0bd99d-9ef6-4b04-bc75-d63812b465ee` | 46×90; side41/41; top5/bottom1; alpha corners0 | `b6b6509cfdeef083ef3b7b56c8f2e7e3cc315dac43926a104b423ec25f2532be` |
| 01 | `sources/j107-keeg-alley-oop-reverse-pose-01-attempt-03.png` | `exec-df528c6b-3da1-483c-b53a-418266d51c51` | 69×90; side29/30; top5/bottom1; alpha corners0 | `ec13f33f1e51bb124979d44a935d251a1ff37b4065d1e241011e81224fb07708` |
| 02 | `sources/j107-keeg-alley-oop-reverse-pose-02-attempt-02.png` | `exec-165add6a-064e-4dfc-a287-600ca4612564` | 46×90; side41/41; top5/bottom1; alpha corners0 | `3304c7f05a59f6b0a2420f89f5454b2facff1a734519f78dbcff8b147a6afc84` |
| 03 | `sources/j107-keeg-alley-oop-reverse-pose-03-attempt-05.png` | `exec-a4f411ee-f058-4129-9fa8-3840d933c3b0` | 43×90; side42/43; top5/bottom1; alpha corners0 | `bdf3945e9d2290e0dfeb20dac74f30e2eff8b15c74808de8f44905c4832ccc36` |
| 04 | `sources/j107-keeg-alley-oop-reverse-pose-04-attempt-02.png` | `exec-de27fff7-efde-48fc-9089-d6cf52be2fb6` | 58×90; side35/35; top5/bottom1; alpha corners0 | `ca778bd91d68b375f2b5390abbbab1cb7fec48b911aaa7c46010b61bf427d12d` |
| 05 | `sources/j107-keeg-alley-oop-reverse-pose-05-attempt-04.png` | `exec-fd6cadd0-d78a-432b-ba6a-7442e169de88` | 52×90; side38/38; top5/bottom1; alpha corners0 | `0e6d591b08c2fad68dea287496c6cae3cae1e6f70d262ad86e8e181121733f58` |
| 06 | `sources/j107-keeg-alley-oop-reverse-pose-06-attempt-02.png` | `exec-d9c03d6d-642c-4d47-a277-96be66c32382` | 46×90; side41/41; top5/bottom1; alpha corners0 | `acae5bec8300fa533f0db196fb0253f97e9413d8fcfb44d0846e91274fdee0cc` |
| 07 | `sources/j107-keeg-alley-oop-reverse-pose-07-attempt-05.png` | `exec-aad7bde3-11fe-4c4a-85c8-4ebc7766ab3b` | 55×90; side36/37; top5/bottom1; alpha corners0 | `94d57cac895732984f8bc5d699566a048a0da92170dc9b1c4d74b948142e3e38` |

All accepted-cell previews are saved under `previews/j107-keeg-alley-oop-reverse/`. They were reviewed on light and dark backgrounds for complete anatomy, hat/shoes in bounds, cell margins, no checkerboard/halo, no painted basketball, and pose separation. Pose05's hand gap received a high-resolution review after its first edit retained a white ball-like dot; that edit is rejected and the retry has an empty gap.

## Retry and rejection ledger

- Pose00 attempts01–03 were rejected for back-facing action, insufficient side margin, and opaque checkerboard respectively; attempt04 has correct right-facing approach, true transparency and complete-cell margins.
- Pose01 attempts01–02 had opaque checkerboards; attempt03 is the transparent background edit and matches pose00's identity while showing the longer reach.
- Pose02 attempt01 had a checkerboard; attempt02 is the transparent edit showing the takeoff anchor.
- Pose03 attempts01–03 were not accepted: attempt01's two transparent edits retained a detached red/green pixel by the raised hand; attempt02's checkerboard-edited takeoff remained too similar to pose02. Attempt04 was generated with a more compact turned back; its transparent edit is accepted as attempt05.
- Pose04 attempt01 had checkerboard; attempt02 is the transparent edit. It reaches screen-right with visible clearance from the complete hat.
- Pose05 attempt01 changed the tights to white/silver. Attempt02 had a checkerboard; attempt03 background edit retained a white ball-shaped mark between the hands. Attempt04 removed it and passed an enlarged gap review.
- Pose06 attempt01 had checkerboard; attempt02 background edit shows a distinct low rear sweep after the catch.
- Pose07 attempt01 placed the cocked hand screen-left of the hat and was rejected. Attempt02 had checkerboard; attempt03 edit initially passed in isolation but was deselected after the full sequence review because its high hand was too similar at cell scale to poses08 and10. Attempt04 generated a mid-cock transition and had checkerboard; attempt05 background edit places the bent hand at shoulder/head level on the image-right side, with a clear gap from the hat and distinct cell silhouette. Attempt05 replaces attempt03.
- Pose03 background-edit retry `exec-08601199-8226-47b5-a08e-1d63827d17d9` is retained as a separate rejected raw image because it repeated the detached colored cluster. Its source and edit prompts are in the pose03 prompt/edit files.
- `sources/j107-unassigned-imagegen-output-exec-f22daf56-7868-4d74-87b9-8a9e37f120f2.png` is preserved as unassigned and is excluded because its prompt/pose association is unknown and its outline has a colored halo.

Every raw/checkerboard/edited/rejected candidate, exact prompt, generation ID where verified, cleanup step and review image is retained. The J.107 root and delegated source sets have one source-hash collision: delegated pose08 attempt01 is an accidental byte-for-byte duplicate of root pose00 attempt01 with the same generation ID. The delegated notes mark it invalid and exclude it; accepted pose08 retry02 is unique.


## Accepted atlas and separate ball track

- The accepted 5×3 atlas is `public/assets/animation/keeg-alley-oop-reverse-right.webp` (640×288, lossless WebP, SHA-256 `33409a7268467db62acd617621b32921d77262c525e45573a0f0f4e7969f233e`). The transparent RGBA source atlas is `tools/generate-art/sources/j107-keeg-alley-oop-reverse-atlas.png`.
- Packing alpha-crops at threshold16, uniformly nearest-neighbor fits every silhouette inside76×86 pixels, centers it in a transparent128×96 cell and preserves authored order00–14. Each packed cell is unique. Minimum packed side margins are26px and vertical margins5px. No poses are mirrored, drawn, duplicated or interpolated by the assembler.
- The actual packed atlas review is `previews/j107-keeg-alley-oop-reverse/j107-keeg-alley-oop-reverse-atlas-review.png` (all15 cells on light and dark backgrounds). The former assembler preview height incorrectly cropped rows1–2 from its dark-background section; the script and evidence sheet are corrected, and the independent review confirms every cell.
- Keeg's separate hand track in `src/core/animation.js` is height `[1.22,1.59,2.24,1.82,2.12,1.46,1.12,1.82,2.06,1.75,2.24,1.1,.86,.42,.7]` and forward `[5.85,8.77,5.12,8.77,12.43,7.31,-8.04,7.31,11.7,12.06,12.43,11.7,4.02,-5.12,-1.46]` (simulation world units per pose). Pose05/tick10 is the empty-hand lob catch; the turn carries behind the hip on pose06; poses08–09 align the reverse cock; pose10 is the sole release at tick21. The game ball remains an independent object throughout.
- Native renderer selections cover all15 poses in both facings (30/30) at standard and120% zoom (64 saved frame/tick captures). The actual Canvas report and selected images are under `previews/j107-keeg-alley-oop-reverse/native-render-report.json`; `right-sequence-native-review.png`, `left-sequence-native-review.png`, and `j107-keeg-alley-oop-reverse-native-track-contact.png` show both full sequences, mirrored ball path, catch at tick10, contact through tick20, and rim flight at tick21. The corrected pack preview and native review sheet are separate files.
- Keeg's K.03 mirror policy is reviewed. The J.107 atlas has 15 unique frame hashes; source generations and exact per-pose prompt/edit text remain attached through the `sourceRecords` prompt-file links. Accepted atlas SHA and ball values are included in `j107-keeg-alley-oop-reverse-layout.json` and `j107-keeg-alley-oop-reverse-provenance.json`.
