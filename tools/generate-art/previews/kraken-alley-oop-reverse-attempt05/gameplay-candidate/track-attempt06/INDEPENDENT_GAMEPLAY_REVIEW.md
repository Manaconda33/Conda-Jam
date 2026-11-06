# Independent gameplay review — Kraken alley-oop-reverse track attempt06

**Verdict: candidate gameplay passes and may proceed to a checked-in production-loader trial. It is not production accepted.** This review covers an injected candidate atlas and track only.

## Provenance and run checks

- Atlas SHA-256: `f34573531c32521196adfa40ad1d2687f4cebef663ae0dc179c97c442519a899` (matches the report).
- Report SHA-256: `117e3c6a8d1e1f4f6942045b24964adb8f3afb76baf1ed433dca63219c4e37f2`.
- Track JSON SHA-256: `fc6d1911ce83c8be32c16b3aefa90ea2b0116e6a887cb93329b5a5a8b28365bb`.
- Capture script SHA-256: `3bc87907ed6bb36150cefd8e8dccf9aeace98c9943bd0c1d186f5ed76dd5387f`.
- The report records `runtimeIntegration:false`, candidate atlas/track injection, 60 captures (15 frames × two facings × two zooms), and zero browser errors. Both directions select frames0–14 in order; left-facing mirrors correctly.

## Gameplay findings

- The real Marin Dusk turbo alley-oop pass is used. Kraken catches it at the authored grab transition (event at global tick17; sampled action frame5/tick10) and owns the ball thereafter.
- **Carry contact passes frames5–9.** I inspected the 120% screenshots in both facings. Frame5 receives at the hands. The lowered/shifted frame6 ball meets Kraken’s raised hand; frames7 and 8 sit at the raised fingertips; at frame9 the ball meets the reaching hand/forearm as the reverse finish begins. Mirroring preserves the same relationship. No clear floating gap remains in these inspected frames.
- The low-hand reverse finish reads through the frame12 pose in both facings. The ball reaches the rim at frame10/tick21 and is released into dunk mode with owner cleared. Frame11/tick23 completes a two-point score for Kraken’s team in both directions. Frame14/tick30 shows the landing/recovery, with the ball dead and unowned.
- Both 100% and 120% runs preserve the selector/frame order and score path. Kraken, the hoop, and the ball remain visible in the reviewed action frames without HUD obstruction. No browser errors are reported.

The corrected candidate-specific track is recorded in the adjacent JSON and is distinct from the donor track. Re-run these checks against the registered production manifest/loader before accepting the asset.
