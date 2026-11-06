# Independent gameplay review — Kraken dunk-reverse attempt04, track attempt05

**Verdict: candidate track passes visual/gameplay review and may proceed to a production-loader trial. It is not production accepted.** The capture report explicitly uses an injected cleanup atlas and athlete-specific track, so runtime acceptance remains open.

## Provenance and run integrity

- Atlas SHA-256: `1b3b57281f839449c256308014cf26f8bf87e1c2b5a365fdbe743babb2ecea42` (matches the report).
- Candidate report SHA-256: `a71792bba7087832b441788620469eea5521d79af484d07405b638e603013b6d`.
- Capture script SHA-256: `10a6c1a13f28610379e70931197098aa2007e1631d46e3b0332739321377fd20`.
- The report records `runtimeIntegration:false`, `candidateAtlasInjected:true`, `candidateBallTrackInjected:true`, 60 captures, and an empty browser-error list. It covers 15 frames × both facings × 100%/120% zoom.
- Every run selects frames 0–14 in order from the same Kraken cleanup atlas; right-facing is unflipped and left-facing is correctly mirrored.

## Contact, timing, and scoring

I inspected frames 8–11 and 14 at 120% in both facings. At frame8/tick17, the ball meets the lower hand during the inverted transfer. At frame9/tick19, the ball remains at the lowered hand as the reverse dunk rotates downward; the previous attempt’s large floating gap is closed. The hand/ball relationship is visually consistent after mirroring. Frame10/tick21 places the ball in the rim and begins the dunk release. Frame11/tick23 completes a two-point score, credited to Kraken’s side in each facing. Frame14/tick30 is the upright recovery with a dead, unowned ball. The 100% captures preserve the same sequence, selectors, mirror state, release and score. No HUD occlusion or browser errors appear in the reviewed frames.

The candidate track is separate and Kraken-specific; the report’s track values for frames8/9 are height `[-1.4,-0.1]` and forward `[3.5,1.5]`. This new path restores direct hand contact while maintaining the release timing and two-point path.

The independent cleanup review covers the 15-frame atlas and confirms distinct poses, complete anatomy/identity, binary alpha, baseline and cell fit. This review does not waive the production-loader check: register only after the checked-in normal loader reproduces these contacts and scoring results without candidate injection.
