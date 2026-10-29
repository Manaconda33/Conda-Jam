# Kraken pass-overhead track attempt 02 — independent review (2026-10-28)

**Decision: calibration pass only. Keep this as a candidate for a further isolated track trial; do not register or accept it for production.**

Reviewed candidate evidence:

- Track/capture report: `native/report.json`
- Candidate atlas: `tools/generate-art/previews/kraken-pass-overhead6-attempt02/kraken-pass-overhead6-attempt02-runtime-candidate-v2.png`
- Source review: `tools/generate-art/previews/kraken-pass-overhead6-attempt02/INDEPENDENT_SOURCE_REVIEW_2026-10-28.md`
- Cleanup review: `tools/generate-art/previews/kraken-pass-overhead6-attempt02/INDEPENDENT_CLEANUP_REVIEW_V2_2026-10-28.md`

## Source and cleanup gate

The source and v2 cleanup reviews authorize separate ball-track trials only. I inspected their findings and the v2 light preview. The source shows six consistent Kraken poses, full anatomy, no baked-in ball, and an intelligible overhead pass sequence. V2 restores the hands that crossed the source row seam, has a common baseline at y=94, and keeps transparent edges against light and dark previews. V2 is not a registered runtime atlas. The accepted trial status does not elevate the art to production approval.

## Track and renderer findings

- The candidate track is `height [1.05, 1.85, 1.75, 1.9, 2.1, 1.2]`, `forward [5, 3, 4, 6, 10, 14]`. Captures cover all six frame starts at ticks 0, 2, 5, 7, 8, and 10, at zoom 100 and 120, in both facings. All 24 referenced frame captures exist.
- The manifest override selected the v2 candidate atlas and frames 0–5. Facing +1 uses no flip and facing -1 uses the horizontal mirror. I inspected both directions at the gather, wind-up, and release poses; mirroring is consistent and no anatomy or ball-track direction reversal is apparent. This is selector exercise evidence, not proof that production mirror-policy registration is correct.
- The atlas is ball-free. Separately rendered balls are visible at each sampled frame. Frame 3 at tick 7 switches Kraken to ownerless pass state and retains Kraken as last touch in all four facing/zoom combinations. The release sample is aligned near the extended hands. At tick 8 and tick 10 the ball is detached and advancing in flight, as expected after release.
- The ball is broadly near the hands during the sampled pre-release frames, but contact is not fully convincing across the sequence. In particular the tick-0 gather ball sits outside Kraken's hands at the abdomen, and the tick-5 wind-up ball is beside the head/hand area rather than unmistakably held. The tick-2 raised-hand pose reads more closely. These gaps warrant a refined track trial before acceptance.
- The normal pass simulation caught Marin Dusk on step 28 (receive clip tick 4) in all four facing/zoom combinations, with no score change. This confirms that a flight can complete and that the recipient catch path remains functional under this test setup.

## Important harness limit

The candidate is not registered. The harness separately renders its candidate per-frame offsets, but the normal simulation uses the existing generic fallback offsets before release, then injects the candidate frame-3 release position after `passBall` and lets normal simulation resolve flight and receiver catch. Thus the 4/4 catches do **not** validate continuous ownership/contact through ticks 0–6, the actual candidate-driven release transition, or production selection and mirroring. The four pass runs are useful flight/catch smoke evidence only.

## Required before acceptance

Continue isolated calibration to improve hand contact at gather and wind-up, then validate the entire clip against its candidate offsets under simulation (including release at tick 7) and both facing directions. Register only after that integrated validation and a fresh production-selector/mirroring review. This attempt should remain labeled **calibration only / unregistered**.
