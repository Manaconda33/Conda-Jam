# Kraken rebound attempt 07 — checked-in production registration review

**Gameplay and loader checks pass; rendered asset verification is blocked by the manifest review gate.**

This run routed no manifest or core module. It used `public/assets/animation/manifest.json`, `src/core/animation.js`, the registered WebP, `loadProductionSprites`, and `selectProductionSprite` as checked in. The manifest SHA matches the loaded WebP (`1edc3d86ccf1ef4029ae49ac48bd056353a5e48a67be4ae7bc046129bb3340d0`); the production loader completed it at 400 pixels wide.

Across both facings at zoom 100 and 120 (four runs, 20 captures), Leo's live miss led to Kraken's rebound and catch. Ownership transferred at tick 5. The production track kept the carried ball exactly on the hand at ticks 5 and 7 (`Δx=0`, `Δz=0`). Score remained 0–0; no browser errors occurred.

The manifest still has `reviewed:false`. As designed, `selectProductionSprite` therefore returns `null`, so the actual registered rebound artwork is not rendered in the game during this run. This verifies the loader, source file, simulation timing, track and ownership, but it does not verify visual frame selection, mirroring, or baseline in the renderer. Do not mark the clip accepted from this run alone. Rerun after the reviewed status is updated through the production review process.
