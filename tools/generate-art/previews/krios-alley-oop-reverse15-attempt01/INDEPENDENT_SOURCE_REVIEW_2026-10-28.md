# Independent source review — Krios J.128 `alley-oop-reverse` attempt01

**Verdict: REJECT for cleanup/track trials in this source form. Do not register.**

Reviewed the raw 1536×1024 sheet and exact prompt/provenance. The sheet has a readable 5×3 arrangement and contains no basketball or other prop. Krios's red-brown skin, black tied-back curls/green band, beard, black-and-gold uniform, and muscular anatomy are broadly consistent. The reverse-side sequence is generally visible: takeoff and high reach, gathered hands, turned-back apex, arm wrapped behind the head, and descent/landing/recovery poses are distinguishable.

## Blocking source defect

Top-row cell 5 (zero-based frame04, the full-extension catch pose) places the shoe directly against and underneath the heavy horizontal gridline at y≈339–341. The lower part of the shoe is clipped by the cell boundary and overdrawn by the gridline. This violates the required complete anatomy and cell-margin check. The line also makes the exact crop ambiguous. See `source-frame04-cropped-shoe-gridline-evidence.png`.

The high-contrast black separators can be removed inside clear gutters in other cells, but frame04's shoe has no recoverable margin below the line; removing the line cannot restore the missing footwear. Hand-painting or inventing pixels would be inappropriate. Preserve this raw attempt as rejected and generate a corrected sheet with clear spacing and all feet inside each cell before cleanup.

## Other review notes

- The release frame (frame10) has an open hand and rotated body, but the exact reverse-side ball release is somewhat ambiguous without the ball; track review must establish contact/timing on a future corrected sheet. Evidence crop: `source-frame10-release-pose-evidence.png`.
- Frame03 and frame04 are both high reaching poses and need target-size separation on a corrected sheet.
- No cleanup atlas, transparent preview, or ball track was produced because the crop failure blocks accepting this source for trials. The exact prompt, raw image, generation ID and raw SHA-256 remain in `tools/generate-art/krios-alley-oop-reverse15-attempt01-provenance.json`.
