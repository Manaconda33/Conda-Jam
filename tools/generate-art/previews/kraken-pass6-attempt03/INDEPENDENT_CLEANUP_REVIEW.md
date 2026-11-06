# Kraken J.07 `pass` attempt03 cleanup trial — independent review — 2026-10-28

**Verdict: PASS for visual cleanup/layout trials only. Not a gameplay or runtime acceptance.** The six-figure extraction, pose order, and 96×96 layout are usable for the next separate-track trial. Minor pale edge flecks and the softer-than-idle pixel style remain visible at enlarged preview scale and should be considered before any final registration.

## Provenance and hashes

- ImageGen generation: `exec-6af62d0f-5c3d-4f21-a213-93f524e77291`; exact prompt path `tools/generate-art/kraken-pass6-attempt03-imagegen-prompt.txt` (the provenance identifies this prompt and the raw source; prompt text matches the described loaded frame3/release frame4 sequence).
- Raw source `tools/generate-art/sources/kraken-pass6-attempt03-generated-raw.png`: SHA-256 `44c042bf175ca1337c24c3f06fc569eefab0d971c3207b9ce4f1222fa32a2075`, matching provenance and trial report.
- Trial atlas `tools/generate-art/previews/kraken-pass6-attempt03/review-trial-96/pass6-attempt03-trial-96x96.png`: SHA-256 `238faaf806fadcc4186699c56c4737683704bb31880837dd342c93ad52883bcd`, matching the report.
- Compared native/light/dark/4× views and the registered reference `public/assets/animation/kraken-idle-right.webp`. This is a candidate cleanup only; no runtime or gameplay files were changed.

## Pose, identity, and anatomy

- All six extracted poses are unique and sequence in the reviewed row-major order: setup, windup, loaded step, release, follow-through, recovery.
- **Frame3 (the third drawing) remains chest-loaded:** bent elbows and both hands held near the sternum, despite the forward step. It is distinct from frame4 and does not read as an early release.
- **Frame4 is the only release pose:** both empty hands extend forward. Frame5's arms are lower/softer with weight transferred forward and rear heel raised, so the follow-through is distinguishable, though the two silhouettes remain close enough to check again in playback.
- Hands are empty; the copper chest medallion is not a ball. Full hair, pointed ear, hands, arms, legs, and shoes remain visible in every cell. Short auburn hair, copper skin, amulet, burgundy/copper kit, wristbands, shoes, and three-quarter right-facing identity remain coherent with the registered Kraken idle.

## Layout, alpha, and style

- The atlas uses a shared scale of `0.1529636711`, 96×96 cells, and baseline y90. Sprite heights are 79–82px, top margins 8–11px, bottom margins 6px, and horizontal margins at least 8px. The broad release/follow-through arms fit without touching or crossing cell borders.
- The light and dark native previews show no opaque matte or broad gray halo. The 4× light preview exposes a small number of pale/gray edge flecks around some contours, most noticeable near hair/hand edges; the dark preview makes these much less visible. They are localized, not a continuous broad halo. Keep the raw source authoritative and document any further fringe cleanup.
- The cleanup report records retention of only near-silhouette alpha within a 3-source-pixel neighborhood (191 detached non-main pixels) and exclusion of 3,823 distant pixels across 1,274 small components; no removed pixel appears necessary for complete anatomy in the reviewed cells. Do not use a blind largest-component-only rule if revising cleanup.
- At actual size the figures remain recognizable and close to Kraken's scale. Compared with the registered compact, hard-clustered idle atlas, this source has smoother/high-resolution shading that becomes chunkier when nearest-neighbor reduced. It is acceptable as a trial but is not a perfect pixel-cluster style match.

## Scope

This review passes only the cleanup/layout trial for further visual and separate ball-track trials. It does not accept ball calibration, release/catch timing, mirroring, gameplay selection, or production registration. Re-review pale flecks and release-to-follow-through continuity at runtime scale before final acceptance.
