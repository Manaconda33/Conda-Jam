# Kraken rebound attempt 06 — production loader path candidate check

**Result: candidate gameplay and loader path pass; this is not a production acceptance.**

The browser capture uses the production `loadProductionSprites` function and `selectProductionSprite`, exposed by the test harness. A review-only route supplies the unregistered candidate manifest entry and attempt05 Kraken track. The atlas itself remains a candidate PNG, not a registered production asset.

Source art: `tools/generate-art/previews/kraken-rebound5-attempt02/cleanup01/kraken-rebound5-attempt02-cleanup01-atlas-candidate.png` (five 80×96 cells in one row).

Track: `tools/generate-art/previews/kraken-rebound-track-candidate/attempt-05/track.json`; height `[0.4, 0.2, 0.65, 0.95, 0.9]`, forward `[3, 2.5, 0, 0, 1]`.

Across both facings and zoom 100/120, 20 captures selected all five source frames. A live Leo miss triggered Kraken’s rebound; ownership transferred at tick 5, the ball remained carried through tick 7, and the computed ball-to-hand offset was exactly zero at ticks 5 and 7. Score remained 0–0 and there were no browser errors. `review-contact-sheet.jpg` shows each facing and sampled frame.

The test harness needed two corrections from the older trial: the atlas is five columns by one row, and the catcher must stay at x=69 for both facings while only its facing value changes. Earlier malformed harness attempts did not validate the asset and are preserved in the script’s development history, not included as passing evidence.
