# J.123 Piper `alley-oop-power` atlas candidates

These two atlases are review-only; neither is registered or production accepted. Each uses 15 row-major unique frames in a transparent 4×4 grid of128×96 cells, a shared y=87 baseline, <=80px figure height and <=112px width, and one empty final cell. The ball is separate and absent from the source art. No poses were redrawn, duplicated, interpolated or mirrored.

`atlas-bbox-height` independently fits each alpha crop to80px high (width capped at112px). `atlas-lane-scale` uses the explicitly provisional lane factors in its layout JSON; pose00 receives a .0938 fit because it was generated on a smaller horizontal canvas. This comparison needs parent review for cross-pose head/torso scale and for readability of closed-fist pose09 vs open-hand pose10 at runtime size.

The assembler verifies exact prompt/source hashes and records crop bounds, scale, frame hash and cell margins per source. It uses premultiplied-alpha Lanczos. Light/dark proofs and 3× native-cell sheets are included. Input prompts, raw images, and selected source provenance remain in the three pose-lane directories.
