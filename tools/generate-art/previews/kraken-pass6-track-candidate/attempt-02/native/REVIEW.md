# Kraken J.07 chest pass track — attempt 02

**Verdict: pass for independent candidate review only; not production acceptance.**

Attempt01 is retained and rejected in `../attempt-01/native/REVIEW.md`; its reused Krios chest-pass offsets placed the ball forward of Kraken's hands during the carry. Attempt02 reduces the horizontal offsets on held frames0–2, raises the opening chest contact slightly, and aligns the frame3 release with the extended hands. Source artwork is unchanged.

## Candidate track

- Height: `[1.25, 1.25, 1.3, 1.5, 1.35, 1.05]`
- Forward: `[2, 4, 5, 6, 12, 8]`
- Release: frame3 at tick5

## Review findings

The 44 candidate-only current Jam Stage captures cover authored frame starts at ticks `[0, 2, 4, 5, 6, 8]` and post-release flight at ticks `[11, 14, 18, 22, 26]`, with both facings at100% and120% zoom. I visually reviewed both facings at both zoom levels:

- Frames0–2 keep the ball against Kraken's clasped/gathering hands through tick4. The near-contact placement stays readable and avoids the forward gap from attempt01.
- The real production pass action reaches authored release frame3 at tick5. At release the ball separates cleanly, has no owner, retains Kraken as last touch and targets his teammate. The release ball is adjacent to the extended hands in both directions and zooms.
- The pass remains a separate moving ball after release. Marin Dusk catches by tick22 in all four runs; the score remains `[0, 0]` as expected for a chest pass.
- All six authored frame starts select the candidate atlas and correct cell. Left-facing selection uses horizontal mirroring; no browser errors or fallback sprites occurred.
- The 80×96 source art remains unregistered. Manifest and track overrides exist only in the capture page.

## Evidence

`report.json` records the exact track, all capture and simulation values, selected atlas/frame/mirror, held-ball deltas, receiver possession, score, clock, event messages and screenshot paths. `frame-00`, `frame-02` and `frame-04` show the held contacts; `frame-05` is the tick5 release; later frames show ownerless flight and the teammate catch. The source/cleanup review is `tools/generate-art/previews/kraken-pass6-attempt02/INDEPENDENT_CLEANUP_REVIEW_2026-10-28.md`.

This is ready for an independent gameplay review. Do not register from this self-review alone.
