# Krios pickup attempt08 runtime integration review

**Disposition: approved for registration.** Independently reviewed 2026-10-28.

## Runtime evidence

- `native/report.json` records `runtimeIntegration: true`, 32 captures, four actual Jam Stage runs (right/left facing at 100%/120%), and `uncaughtBrowserErrors: []`.
- Each capture selects `./public/assets/animation/krios-pickup-right.webp`; right-facing uses native art and left-facing uses the reviewed horizontal mirror. The selected frame follows the expected pickup progression through frames 0–4.
- The production track in `src/core/animation.js` is `height: [0.65,0.45,0.2,0,1.35]`, `forward: [3.5,4.5,5.5,4.5,0.5]`. The capture route only exposes the existing production track object for reading; it does not replace its values. The report's fixture is assigned once per run, followed by ordinary production `stepMatch` progression.
- At tick6 the loose ball is visible beside the reaching hand in both facings, including 100% zoom. At tick7 the ball meets the low hand and the HUD reports `KRIOS GRABS THE BALL`; the report records `hasBall: true`, `mode: carried`, and owner `krios` in all four runs. At tick8 the ball has moved into a chest-level hold between the hands. The lift is quick but coherent with the recovery animation; the ball remains independently rendered.
- Left-facing placement keeps the ball at Krios's outside hand, and both facings retain the chest hold at tick8. No crop, ownership mismatch, mirroring error, or browser error was found.

Representative images reviewed: `native/actual-right-pickup-tick06-zoom100.png`, `native/actual-right-pickup-tick07-zoom120.png`, `native/actual-right-pickup-tick08-zoom120.png`, and the equivalent left-facing tick06/07/08 captures.

## Report metadata correction

The report's `captureMethod` text still says candidate artwork and track were injected, which is stale for this runtime run. Runtime inspection shows the registered manifest and atlas were used, and the actual production track values were not overwritten. Update the report field before committing the capture bundle; this stale sentence does not change the screenshots or runtime result.
