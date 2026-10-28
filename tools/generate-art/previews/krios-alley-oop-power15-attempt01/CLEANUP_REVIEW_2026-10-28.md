# Krios `alley-oop-power` attempt01 cleanup review

**Verdict: PASS for separate ball-track trials only. Do not register yet.**

The final candidate `krios-alley-oop-power15-attempt01-runtime-candidate.png` contains 15 unique original poses in a 1920×96 atlas (15 cells of 128×96). Component extraction preserves all 15 full Krios figures in row-major order. Each pose has at least 5px side margin, at least 8px top margin, and a shared baseline at y=94. All three source rows normalize to the same baseline. Every output pose hash is unique.

Green cleanup uses an edge-connected chroma key plus enclosed green-hole removal. It preserves small green pixels isolated in the upper head region for Krios's green hair tie. The cleanup report confirms zero opaque saturated-green pixels outside the head region; light and dark individual- and contact-sheet previews show no visible green spill around hair, limbs, or shoes. The transparency corners are clear. Palette, dark outlines, anatomy, and costume detail remain intact at 128×96 native cell size.

The first cleanup trial left green background islands around limb/foot gaps and is retained under `cleanup-trial01/` with its atlas and previews. The revised cleanup keys those holes while preserving the hair tie.

The raw source review accepts the sheet for track trials only. This cleanup does not constitute gameplay validation: no separate ball track is calibrated, no Jam Stage timing/contact review is complete, and nothing is registered.
