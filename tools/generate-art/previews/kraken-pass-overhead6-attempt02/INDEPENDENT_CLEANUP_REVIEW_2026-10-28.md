# Kraken pass-overhead attempt 02 cleanup review (2026-10-28)

**Decision: REJECT this cleanup candidate for separate ball-track trials.** The raw source may be recoverable with corrected segmentation, but this atlas is not anatomically complete as laid out and must not proceed to track trials.

Reviewed source: `tools/generate-art/sources/kraken-pass-overhead6-attempt02-generated-raw.png`  
Generation: `exec-c4431957-32b5-428e-b129-7dfdf0f745b4`  
Source SHA-256: `3c43eac04b5f68b11a3b1948d938392dfdae9831312881a44e27c8e50b14e71f`  
Reviewed cleanup: `tools/generate-art/clean-kraken-pass-overhead6-attempt02.py`  
Atlas/layout: `kraken-pass-overhead6-attempt02-runtime-candidate.png`, `layout.json`, and `cleanup-layout-report.json` in this directory.

## Review findings

- **Blocking anatomy defect (poses 3 and 4):** the row-major cell crop starts both lower-row poses at source y=512, although the figures' raised hands extend above that boundary. `layout.json` records `sourceRectLTRB` y0=512 for both; normalized poses 3 and 4 consequently have a nontransparent bounding box touching y=0. In both previews, fingers/hand silhouettes are visibly severed by the top edge. I also inspected the raw seam around pose 3: the missing top portion is present in the raw sheet just above y=512, so this is a cleanup segmentation/cell-boundary failure rather than proof the source lacks the anatomy. Pose 4 has the same boundary truncation. The cleanup currently processes each 512×512 cell independently and drops those pixels. Recovering this source requires cross-boundary figure extraction with careful isolation from the preceding cell; the current candidate cannot be used.
- **Identity:** all six visible bodies are recognizably Kraken, with copper skin, auburn hair, pointed ear, amulet/gold trim, burgundy Vesper Harbor kit, wrist bands and red shoes. No clip-to-clip character swap is apparent.
- **Sequence and separation:** poses are distinct and legible as gather, overhead lift, wind-up, release, follow-through and recovery. Pose 3 is a plausible release pose for the configured frame-3/tick-7 anchor; poses 3 and 4 differ in arm/wrist articulation, despite their similar overhead extension. Pose 0 is a plausible ball gather. These are not sufficient to override the clipped anatomy.
- **Ball-free art:** no basketball appears in the raw cells, normalized poses, atlas or light/dark previews. The gather hands remain visually separated enough to trial a separate ball track after an anatomically sound cleanup exists.
- **Transparency/background:** the source has a large generated brown/orange haze and alpha range 0–254. The cleanup removes distant haze while retaining source RGBA values near the alpha≥32 silhouette; the light and dark previews show no obvious broad background glow or color-key contamination. This is a promising cleanup method, but it must be adjusted for the cross-cell hand extension.
- **Margins/baseline:** all six poses have distinct hashes, fit their 80×96 cells, and share the configured baseline y=94. The report's minimum cell margins are 10 px left, 21 px top, 10 px right and 2 px bottom. The tight 2 px shoe margin is visible but does not clip the feet. Pose bounds touching the top of the *normalized pose crop* for poses 3–4 are an anatomy-loss issue, not adequate margin.
- **Runtime-scale style:** nearest-neighbor reduction gives crisp readable outlines and retains the hair, uniform trim and limb shapes at 80×96. The shading is denser and more painterly/noisy than Kraken's established idle sprite, but the pixel clusters remain legible at this scale and are not the reason for rejection.

## Required correction before retry

Rework segmentation to include the full raised hands of lower-row poses 3 and 4 above the nominal y=512 cell boundary (and demonstrate that no neighboring pose pixels are incorporated). Regenerate the normalized poses, atlas, layout/report and both-background previews, then independently recheck complete hands, full-body bounds and margins. Preserve the raw source and this rejection record.
