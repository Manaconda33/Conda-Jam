# Kraken push attempt02 source and layout trial

**Status: candidate art may proceed to a separate current-court trial; not accepted or registered.**

## Source evidence

- Exact prompt: `tools/generate-art/kraken-push11-attempt02-imagegen-prompt.txt`
- Selected raw: `tools/generate-art/sources/kraken-push11-attempt02-generated-raw.png`
- Generation: `exec-4f79be8a-f48c-43f1-855a-93e90aec0cd7` (`2026-10-29T03:32:00Z`)
- Duplicate generated result, preserved but unselected: `tools/generate-art/sources/kraken-push11-attempt02-initial-unreviewed-raw.png`, generation `exec-574fbbbe-e2af-427e-9543-db8c680abf14`.
- Reference pixels: accepted `public/assets/animation/kraken-idle-right.webp` and `public/assets/animation/kraken-block-right.webp`.

## Source review

The selected raw PNG is 1322×1190 RGBA with real transparency and eleven connected full-body figures. The component order is 4/4/3, with the eleventh pose in the third row, third column. Hair, pointed ear, hands, shoes and costume are in bounds. Identity and palette match Kraken's auburn hair, natural skin, copper amulet and burgundy/copper kit. There is no opponent or basketball baked into the art. All eleven pose crops have distinct hashes.

The push motion is readable in sequence. Pose5 is the strongest contact pose and differs from pose4 anticipation and pose6 follow-through. Its palms and forearms overlap heavily in the side-facing view, however; check at native gameplay scale that viewers can still read the two-hand push. Shading is a little more blended than the sharpest accepted Kraken block pixels, though the color clusters and dark outline remain coherent with the idle art. This is source review for a track trial, not final runtime approval.

## Cleanup and layout review

The cleanup script preserves the raw source and source colors, extracts the eleven RGBA components, and applies nearest-neighbor scaling with one shared scale. It writes a 512×336 atlas with 4×3 cells at 128×112, aligns all grounded feet at baseline y=104, retains at least 8 transparent pixels on every cell edge, and leaves cell 12 transparent. Light and dark previews show clean outlines, no visible keyed-color fringe, complete anatomy, and clear gutters.

The first layout trial at 80×96 was **rejected** and preserved under `rejected/independent-scale-80x96/`. That version independently resized each pose to fit the cell. The widest arm-extension pose shrank substantially compared with upright poses, creating a visible size pop. The selected wider cells allow a single scale across poses. Any later browser trial must inject the selected 128×112 frame rectangles and recalibrate the separate ball track against this actual atlas.

## Remaining blockers

- Confirm at gameplay scale whether the overlapped contact pose still reads as two hands.
- Run a separate Vesper Harbor vs Blackthorn current-court candidate trial at both facings and 100/120 zoom with real ball-carrying opponents.
- Calibrate/review Kraken's separate push ball track against this atlas; no ball position is baked into the art.
- Obtain independent visual review before accepting or registering any asset.

## Duplicate generated result

The first same-prompt call completed but its tool output wrapper failed to surface the image result. A second generation was made before the first had been visually reviewed. Both raw images and generation IDs are retained in provenance. After review, the first result showed the same sequence and similar quality but no clear improvement; it is preserved as an unselected duplicate, not used for another cleanup and not followed by more generation retries.
