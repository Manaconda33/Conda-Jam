# Krios J.128 fall attempt01 — independent cleanup review

**Verdict: REJECT this cleanup output for gameplay trials pending a chroma-spill correction.** The raw source remains suitable for cleanup attempts; this is not a rejection of the generated poses.

## Checks passed

- Ten frames are present in the requested order, and all ten atlas cell hashes are distinct.
- The component extraction omits the white cell separators. Each frame has a transparent background, alpha is strictly 0 or 255, and the reported crops do not cross cell boundaries.
- One shared nearest-neighbor scale and baseline y=94 are applied across the ten poses. The atlas uses 128×96 cells and preserves full silhouettes. The pose progression reads hit reaction, stagger, fall, impact, sprawl, roll, brace, kneel, stand-up, finish.
- Krios's red skin, curled black horns, beard, charcoal/ember uniform, shoes, and connected human anatomy remain consistent. No ball or other figure is present.

## Blocking defect

The candidate still has green-dominant opaque pixels after cleanup. An independent scan found 107 pixels using `G > R+20`, `G > B+15`, and `G > 60`; several bright green pixels are visible at the horns and on body edges in the enlarged preview. This is inconsistent with Krios's black horns and the uniform's red/charcoal palette, and will create a visible matte against the court. The current report describes a spill correction but uses `G > 80`, leaving some lower-value spill untreated. Correct those green edge pixels without changing red skin, regenerate the atlas and previews, and repeat this review before candidate gameplay trials.

The image remains readable at 64×96. Poses 3–5 are naturally low and therefore occupy less vertical space while sharing the required baseline; this is coherent for a fall/recovery sequence and does not require moving the sprite within its cells.

## Review 02 — regenerated despill candidate (2026-10-28)

**Verdict: PASS for gameplay trials only. This is not production acceptance.** The original rejection above remains as the record of the superseded cleanup output.

The regenerated atlas is `krios-fall10-attempt01-runtime-candidate.png`, SHA-256 `571ce9902a6c6f069b062e575ddcca147a3aeb0b066c41b61b8a2e73ccbdbd11`. The corrected spill threshold uses widened `int16` comparisons (`G > R+20`, `G > B+15`, `G > 60`) before changing only the green channel on component-owned opaque edge pixels. Rechecking with this review's prior exact green-dominance scan finds **0** opaque green-dominant pixels. The light and dark previews and 4× nearest-neighbor inspection show no visible green fringe at the horns, skin, or garment edges. The red skin remains red; the correction is confined to green-dominant pixels.

The regenerated report still records ten distinct ordered frame hashes, 128×96 cells, the shared scale and y=94 baseline, full silhouettes, and alpha values only 0/255. All poses retain clear transparent margins; the white cell separators are absent. Identity, connected anatomy, charcoal/ember kit, and the hit-to-recovery sequence remain coherent. The low poses naturally occupy less height while remaining baseline-aligned. I found no cleanup defect that blocks gameplay trials.

Proceed to current-court gameplay trials; keep registration pending source/runtime timing and visual review.
