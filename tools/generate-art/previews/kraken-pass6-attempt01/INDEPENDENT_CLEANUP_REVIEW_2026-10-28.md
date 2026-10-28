# Kraken J.07 `pass` attempt01 cleanup01 independent review — 2026-10-28

**Cleanup/layout verdict: PASS. Overall source/clip verdict: REJECT for gameplay trials and runtime registration.** The cleanup is technically clean, but it preserves a known pre-release timing defect in the source and cannot make this clip valid.

## Materials reviewed

- Raw-source note `INDEPENDENT_RAW_SOURCE_REVIEW.md` and source rejection `INDEPENDENT_SOURCE_REVIEW_2026-10-28.md`.
- Original raw source `tools/generate-art/sources/kraken-pass6-attempt01-generated-raw.png` (SHA-256 `12ac9be2ea709c4edcb456c5955b354b377633979dd2e72fcc69c12000311316`; generation `exec-fab9a322-b6aa-47cc-8092-07f52cc5a91f`).
- Cleanup script, six extracted pose cells, 576×96 native atlas, light/dark native previews, and light/dark 4× nearest-neighbor previews.
- Registered identity reference `public/assets/animation/kraken-idle-right.webp` (240×192, 3×2 grid of 80×96 cells).

## Cleanup and visual findings

- The six 96×96 cells contain six unique, complete, ball-free Kraken poses. Copper skin, short auburn hair, pointed ear, copper amulet, burgundy/copper Vesper Harbor kit, wristbands, and footwear agree with the registered idle reference. The gold amulet is the only ball-like round detail; no basketball is baked into the art.
- Component isolation preserved the figure pixels and a 1.5 source-pixel original-alpha fringe, then used uniform nearest-neighbor scaling. Light/dark previews show no matte, bright/dark fringe, or visible missing outline pixels. Hands, hair, ears, limbs, and shoes remain intact.
- All cells use 88px sprite height and baseline y94, leaving 6px above and 2px below. Horizontal margins are 20, 17, 7, 4, 3, and 19px respectively; the widest follow-through retains 3px on each side. Cells and baselines are consistent; no frame crosses a cell edge. All six frame hashes differ.
- The artwork is readable at native scale. Frame3's release arm and frame4's follow-through arm are intact, but they remain very similar long forward extensions. Frame2 is already the strongest arms-extended/open-hands pose immediately before the release anchor. That order makes the ball appear released or detached at frame2/tick4, one tick before the specified frame3/tick5 release. Cleanup cannot correct this without inventing/replacing a pose, which would violate source preservation.

## Decision

The extraction/layout implementation is visually sound as a preserved candidate, and its raw source and rejected status should remain recorded. Do not run track calibration or register cleanup01. Attempt01 already failed independent source review for this exact pose-order defect: frame2 lacks the chest gather, while frames2–4 form a continuous extended-pass gesture. A new source with frame2 visibly gathering at the chest is required. No runtime or manifest files were changed by this review.
