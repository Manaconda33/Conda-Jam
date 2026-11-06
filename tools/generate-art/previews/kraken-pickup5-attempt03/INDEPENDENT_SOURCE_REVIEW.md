# Kraken J.07 `pickup` — attempt03 independent source review

## Verdict

**Pass for careful cleanup and layout trials only. Do not register or count as accepted source art yet.** The five actions read in order and Kraken is recognizable throughout, but the sheet is not a clean, uniform sprite atlas. The raw art requires per-pose isolation, alpha cleanup, scale/baseline normalization, and small-runtime style review.

## Review findings

- ImageGen source: `tools/generate-art/sources/kraken-pickup5-attempt03-generated-raw.png`; prompt and provenance are retained next to it.
- Kraken identity is consistent: short auburn hair, pointed elf ears, copper amulet, athletic natural-skinned adult male, burgundy kit with copper trim. All five figures appear to be the same character. No obvious injury or detached anatomy is present.
- The five action silhouettes are distinguishable: initial reach; deeper crouch; low floor reach; grab/curl at low level; and balanced recovery with hands miming a carried ball. The fourth image is the only intended grab. The fourth hand reads closer to lower-knee/ankle level than a clearly open ankle-height cup, so inspect after normalization; this is not yet a firm timing/contact pass.
- No basketball is visible. The poses are right-facing three-quarter views and appear mirrorable, subject to detailed cleanup and native capture review.
- All visible hair, ears, hands and shoes are inside the raw canvas. At alpha threshold 32, vertical occupancy is y=238–674 of 793 overall, leaving at least 119px below the lowest visible content. This is enough vertical room for 80×96 normalization with a shared grounded baseline and several pixels of bottom clearance.
- The source is not already divided into five evenly spaced cells. Arm and shoe extents approach the adjacent pose regions, so do not split by equal-width columns. Isolate each figure from actual transparent gaps and verify no neighboring pixels are clipped or included.
- Alpha is almost entirely transparent/near-opaque: 1,169,154 pixels at alpha 0, 402,956 partially transparent, and 409 at alpha 255. Most sampled interior colors are alpha 252–253, but there is visible partial-alpha fringe around silhouettes. Preserve antialiasing selectively, remove any low-alpha haze/fringe, and inspect on light and dark previews before packing.
- The rendering is much more highly detailed and softly shaded than Kraken's small existing 80×96 pass atlas. It has some crisp dark pixel outlines and discrete clusters, but reads more like a scaled-up illustration. Review the cleaned 80×96 result at native and enlarged nearest-neighbor scales; reject if it looks soft or inconsistent with the existing game sprites.

## Next gate

Create per-pose crops and a review-only normalized atlas with the exact durations `[2,3,2,1,4]`, common y baseline, safe clear margins, genuine transparent background, and no ball. Then run joint source/cleanup review and both-facing candidate selection/ball-track trials. The current candidate remains unaccepted, unregistered, and without a ball track.
