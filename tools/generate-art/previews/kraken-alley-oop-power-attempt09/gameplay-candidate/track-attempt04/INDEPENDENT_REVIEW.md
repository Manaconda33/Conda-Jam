# Independent review — Kraken alley-oop-power attempt09, track attempt04

**Verdict: gameplay candidate passes visual/track review and may proceed to a checked-in normal-loader trial. It is not production accepted.** The atlas and track were injected in this run, so this report cannot prove production integration.

## Evidence and provenance checks

- Atlas SHA-256: `05166032d55daf5cf538a1069877b838fd903f0dfd99accbe4c76842f3f23f89` (matches `report.json`).
- Capture report SHA-256: `c678a0685b827934a04ff2e4828f53d463248c2f99e3e89f20c459b88b2a42f5`.
- Capture script SHA-256: `f8f44ddb35476e6c2c55e49c4ad1cef15824cf8815eae6da9b5736c3011cd266`.
- README SHA-256: `e29937ea257c3959a98eeb118dead6299843109f8f78c8b8fa6b1b91cb584f7e`.
- The report explicitly records `runtimeIntegration:false`, `candidateAtlasInjected:true`, and `candidateBallTrackInjected:true`; it captures 60 screenshots across both facings and 100%/120% zoom. All 15 expected frames are selected in order, with the left run mirrored.
- A real Marin Dusk turbo pass reaches Kraken at tick10; he owns the ball through the aerial carry, releases at tick21, and scores two at tick23 in each facing. No browser errors were recorded.

## Visual and gameplay findings

I inspected a side-by-side set of 120% captures at frames 5–10, 11, and 13 for both facings. At the catch, the ball meets Kraken’s extended hand; the gather and aerial-control poses keep it close to the raised hand through the peak. The rim-contact/release frame places the ball at the hoop. The mirrored sequence preserves the same contact relationship. The downstroke, follow-through, descent, landing, and recovery are visibly distinct. Kraken remains the auburn-haired, warm-skinned, pointed-ear player in the burgundy/copper uniform. The teammate/defender remains Marin Dusk; no Krios-like fallback appears. At these sampled frames the athlete remains anatomically complete and visible at 120% with no HUD obstruction.

The track values in `report.json` are Kraken-specific and achieve near-zero carried-ball motion relative to Kraken on the sampled frames; the actual Marin pass transitions from aerial-targeted pass to Kraken ownership. Both score directions complete correctly.

## Metadata boundary

The cleanup implementation in `tools/generate-art/clean-kraken-alley-oop-power-attempt09-cleanup04.py` and `cleanup-layout-report.json` both specify removal of isolated components smaller than 64 output pixels. The final finding in `cleanup04/INDEPENDENT_CLEANUP04_REVIEW.md` that claims the report says `<12` is stale review text; the current script/report agree, so this is a documentation mismatch rather than a visible-output defect. The candidate provenance JSON still contains an outdated top-level `status` mentioning cleanup02 as awaiting review; its `derivedCandidateStatus` correctly says cleanup04 art passed for candidate gameplay only. Update those stale strings before production acceptance. This independent gameplay pass permits a production-loader trial but does not override that provenance cleanup requirement.
