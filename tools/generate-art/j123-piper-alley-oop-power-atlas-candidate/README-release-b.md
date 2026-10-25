# J.123 Piper `alley-oop-power` release-b atlas candidates

These release-b atlases are review-only; neither is registered or production accepted. Each uses 15 row-major unique frames in a transparent 4×4 grid of128×96 cells, a shared y=87 baseline, <=80px figure height and <=112px width, and one empty final cell. The ball is separate and absent from the source art. No poses were redrawn, duplicated, interpolated or mirrored.

`atlas-bbox-height-release-b` independently fits each alpha crop to80px high (width capped at112px). `atlas-lane-scale-release-b` uses the provisional lane factors in its layout JSON; pose00 receives a .0938 fit because it was generated on a smaller horizontal canvas. Both candidates need further full-sequence scale and native runtime review.

Release-b frame10 uses ImageGen pose10 attempt2 revision-b: the accepted source is `tools/generate-art/j123-piper-alley-oop-power-poses-10-14/layout-candidates/pose10-attempt2b-fit80.png`, with prompt `pose-10-attempt2-revision-b.md`; exact hashes and generation provenance are in `pose-10-attempt2-revision-b.json`. At native128×96, pose09’s closed fist/diagonal arm and release-b pose10’s splayed palm/near-vertical arm are visibly distinct. Exact-size side-by-side and 3× proofs are `atlas-bbox-height-release-b-pose09-10-native-128x96.png`, `atlas-lane-scale-release-b-pose09-10-native-128x96.png`, and corresponding `zoom3x.png` files.

The release-b assembler verifies exact source and prompt hashes and records crop bounds, scale, cell/frame hashes, and margins. It uses premultiplied-alpha Lanczos. Light/dark proofs and 3× native-cell sheets are included. Earlier attempt1 atlases and their proofs remain alongside these outputs unchanged.
