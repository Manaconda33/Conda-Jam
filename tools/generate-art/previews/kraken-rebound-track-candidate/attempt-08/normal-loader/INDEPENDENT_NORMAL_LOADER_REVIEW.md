# Kraken rebound attempt 08 — independent production-loader review

**Verdict: PASS for production sprite selection and gameplay integration.**

The browser capture routed no manifest or animation-core module. It loaded the checked-in manifest, core track, and WebP through production `loadProductionSprites`; the only `main.js` route exposes the existing image map and loader to the review harness. The checked-in WebP SHA-256 is `1edc3d86ccf1ef4029ae49ac48bd056353a5e48a67be4ae7bc046129bb3340d0`, matching manifest metadata. The loader reports a complete 400px image. `reviewed` is true.

Four runs cover both facings at zoom 100 and 120, with 20 screenshots total. The actual selector chose frames 0–4 at ticks 0, 2, 4, 5 and 7. Right-facing selections are unflipped; left-facing selections are flipped. I inspected the contact sheet and full-size captures: the poses show a clear reach, jump, overhead catch, chest gather and landing; anatomy stays connected, the auburn hair, pointed ear, copper pendant and burgundy/copper trim remain consistent, and no ball is baked into the art.

In each run, Leo's live miss triggers the Kraken rebound (catch sequence begins at simulation step 86). The ball is loose through tick 4, transfers to Kraken at tick 5, and remains carried through tick 7. The checked-in track places the carried ball exactly on the hand at ticks 5 and 7 (`Δx=0`, `Δz=0`). Score remains 0–0, and there are no browser errors.

The registered `baselineY:92` is within the 96px frame. The production renderer applies `(94−92)×renderedHeight/96`, preserving the legacy baseline. No source, manifest or track routes were overridden in this check.
