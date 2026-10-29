# Kraken push attempt04 cleanup/layout — independent review

**Decision: suitable for current-court candidate trials only; not accepted or registered.** Reviewed the cleanup/layout report, runtime candidate atlas, all eleven normalized pose crops, and light/dark proofs.

- All 11 row-major poses are present and visually separable; the twelfth cell is empty. Kraken's identity and anatomy remain coherent across the sequence. The canonical contact frame5 retains two distinct forward forearms and staggered open palms after fitting; the hands remain separate at the normalized size. Frame4 reads as preparation and frame6 as follow-through.
- The cleanup layout resolves the raw cell spill. The 512×336 atlas uses 128×112 cells with one shared scale, common baseline y=104, and reported minimum margins L/R/T/B of 8/9/8/8 px. Frame5 keeps 12 px side margins, frame6—the widest—keeps 8/9 px. No hair, hands, shoes, or limbs are clipped.
- The layout retains exactly 11 components; no detached fragments are visible in the atlas or per-pose previews. The unused cell is transparent. Recoloring the one-pixel antialias fringe removes the raw red/orange halo; light and dark proofs show no conspicuous red fringe or edge residue.
- The pixel look is much more coherent at the normalized sprite scale, though shading remains somewhat blended. Frame0 and frame10 both read as ready stances and are similar, but their hand/weight positions remain distinguishable enough for a candidate gameplay check.

Proceed with separate current-court trials to verify contact under opponent overlap and real draw order. This review supports candidate trials only; production registration and final art acceptance remain pending.
