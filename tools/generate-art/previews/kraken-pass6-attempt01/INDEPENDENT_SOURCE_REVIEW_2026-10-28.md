# Kraken J.07 `pass` attempt01 source review — 2026-10-28

> **Superseded, invalid provenance:** This note names generation `exec-ebc33ece-dc6d-48a4-a5b8-074f4719a81c` and raw SHA `c520b18386f096116312f7052be977abc8fc12665222c6839b40f9d814c48e9c`, which do not match attempt01's authoritative provenance (`exec-fab9a322-b6aa-47cc-8092-07f52cc5a91f`, SHA `12ac9be2ea709c4edcb456c5955b354b377633979dd2e72fcc69c12000311316`). Preserve this mismatched review artifact for audit history; use `INDEPENDENT_RAW_SOURCE_REVIEW.md` and `INDEPENDENT_CLEANUP_REVIEW_2026-10-28.md` as the matching reviews for attempt01.

**Verdict: REJECT for cleanup and separate ball-track trials.** Preserve the raw generation and prompt; do not normalize or register this sheet.

## Source identity and integrity

- ImageGen generation: `exec-ebc33ece-dc6d-48a4-a5b8-074f4719a81c`.
- Raw: `tools/generate-art/sources/kraken-pass6-attempt01-generated-raw.png`, SHA-256 `c520b18386f096116312f7052be977abc8fc12665222c6839b40f9d814c48e9c`, 1402×1122 RGBA.
- The background is genuinely transparent (alpha range 0–255). The six detected figures are separate and complete in the source. Kraken's copper skin, short auburn hair, pointed ear, copper amulet, and burgundy/copper kit are recognizable against `kraken-idle-right.webp`. All six poses have full head-to-shoes anatomy and are distinct. Hands are ball-free; no basketball or unrelated prop appears.
- The sheet has six large transparent components with substantial separation. The second-row first and second silhouettes have overlapping horizontal bounding boxes, but remain vertically/diagonally separated by at least 87 source pixels; they do not physically overlap. The extended first-row right pose ends 13 pixels from the right edge at alpha≥16. Fourteen low-alpha fringe pixels touch the extreme right edge; cleanup would need to verify these are matte fringe and retain the hand outline.

## Rejection reason

- **Frame 2 (third cell in the first row) is already an arms-extended, open-palmed pass pose rather than the requested chest gather.** The canonical `pass` release anchor is frame 3, first active at tick 5. Frame 2 remains the last pre-release pose, but its hands are already extended well in front of the body. Frames 3 and 4 continue the same extended gesture. A separate ball would have to remain visibly carried through an already released-looking pose immediately before the anchor; that risks a one-frame early release or detached-ball discontinuity and breaks the timing called for by the prompt. The gather is better represented at frame 1, leaving the requested frame-2 gather missing.
- Because that pose-order/timing mismatch precedes ball calibration, the sheet is rejected before cleanup and gameplay track trials. Do not invent or redraw the missing gather during cleanup.

The other five poses read as ready, gather, release, follow-through, and recovery in a broadly coherent pass sequence. A new source should hold the ball-free pose sequence at frame 2 in a clear chest gather, then begin extension at frame 3/tick 5; preserve the reference identity, full anatomy, transparency, and cell gutters.
