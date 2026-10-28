# Kraken pickup attempt03 — independent normal-loader review

**Verdict: pass for this normal-loader integration trial. Not production registration approval.**

I reviewed the 32 captures in `isolated-roster-fixture/native/` across both facings and zoom100/zoom120, including the full approach and recovery sequence. The report and capture script use the production `loadProductionSprites` path and `selectProductionSprite` selector. Candidate manifest and track entries, plus the candidate atlas response, are injected through browser-only Playwright response overlays; checked-in runtime and manifest files are unchanged. The fixture is set once as a loose unowned ball, then normal Jam Stage ticks advance it. This is not a user-initiated pickup.

The selector returns the Kraken candidate atlas URL for every capture with `baselineY:90`; the production loader reports the candidate image at 400 pixels wide. The expected frame sequence is selected at ticks 0, 2, 4, 6, 7, 8, 10 and 11. Left-facing captures set `flip:true`; right-facing captures use `flip:false`. The visible player is Kraken's selected maroon candidate artwork, with no alternate sprite or fallback apparent. Framing keeps the full athlete and ball in view at both tested zooms; HUD elements remain legible and do not cover the action. Feet and ground shadow remain consistently placed at the court baseline.

At tick7/frame3, the separately rendered ball reaches the low cupped hand in both facings and remains visibly distinct from the athlete atlas. The ball is still carried near the hip/waist at ticks8, 10 and11. This includes the expected quick rise from height0.2 at tick7 to0.5 at tick8 as Kraken straightens into recovery. Ownership changes from loose/unowned to Kraken at tick7 and remains with Kraken through tick11. The score stays 0–0.

The isolated-roster report records all four facing/zoom runs as passed. I verified 32 screenshots exist and every file SHA-256 matches its report entry; all selected sources and baselines match the candidate; there are no browser errors or failed requests. `initial-overlap/` is a separate earlier capture set and is not used for this verdict; this review covers the isolated-roster fixture only.

The art and track are still candidate assets supplied by temporary browser overlays. The review establishes normal production loader/selector behavior and fixture-driven gameplay integration, not the normal checked-in manifest path or a user-action pickup transition. No runtime or manifest edits were made.
