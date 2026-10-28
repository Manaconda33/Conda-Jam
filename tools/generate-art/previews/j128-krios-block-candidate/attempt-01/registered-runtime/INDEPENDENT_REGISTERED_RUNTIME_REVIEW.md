# Independent registered-runtime review — J.128 Krios `block`

**Disposition: reject this registered-runtime capture for acceptance; resolve the left-facing frame0 fallback and recapture.** The atlas is not accepted for production yet.

I reviewed all 16 screenshots and `report.json`: right and left facings at 100% and 120% on current Jam Stage courtY=90. The report records `runtimeIntegration: true`, `candidateAtlasInjected: false`, the public source `./public/assets/animation/krios-block-right.webp`, and no browser errors. Its frame table reports frame0 at tick1, frame1 at tick2, apex frame2 at tick5, and finish frame3 at tick8. Ball state is dead/unowned and Krios has no ball in every captured row.

The visual evidence does not match the report's selector rows for left frame0. `left-frame0-tick1-zoom100.png` and `left-frame0-tick1-zoom120.png` visibly render a large white-bearded red figure with different proportions and pose, rather than the registered Krios crouch used for right frame0 and all later block frames. The other 12 facing/zoom/frame captures show the expected Krios atlas art and are fully visible without HUD/hoop overlap. The left frame0 mismatch invalidates the mirror/runtime check even though the separately reported selector result says `src` is the registered atlas with `flip: true`.

This discrepancy indicates the report's selector diagnostic is not sufficient evidence of the actual canvas sprite for that frame. Confirm which atlas the renderer selects and why the first left-facing frame falls back, then recapture both facings at 100%/120%. Do not accept the block clip or rely on this capture for mirroring until the actual rendered frame0 matches Krios artwork.
