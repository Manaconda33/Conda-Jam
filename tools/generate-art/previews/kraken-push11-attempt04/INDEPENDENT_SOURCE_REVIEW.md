# Kraken push attempt04 edited raw — independent source review

**Decision: proceed to a careful cleanup/layout trial, but do not accept or register yet.** Reviewed `tools/generate-art/sources/kraken-push11-attempt04-edited-raw.png` against the saved edit prompt and canonical zero-based contact frame5 (second row, second column).

## Contact pose

The canonical frame5 now has two distinct forward forearms and open palms. The hands are staggered and visibly separated by a transparent channel in the source; they no longer merge into one palm as in attempt03. Frame4 remains a bent-elbow preparatory reach, and frame6 is a lower-wrist follow-through. This is a meaningful fix to the live contact gesture.

## Remaining source gates

- **Count/order and anatomy:** 11 figures read row-major with the final cell empty. The push sequence is coherent. Kraken's pointed ear, auburn hair, copper amulet, burgundy/copper kit and athletic anatomy remain consistent. No ball or extra prop appears.
- **Cell isolation/margins:** fail in the raw sheet. At a nominal 4×3 split of the 1323×1189 image, canonical frame5's component reaches from x338 to x695, crossing the second-column boundary near x662; the neighboring long-arm follow-through also crosses its nominal cell boundary. The contact figure's palm is at risk of being cropped by a direct cell split. A component-based normalization/layout trial must preserve both hands and create real gutters before native testing.
- **Transparency/fringe:** the background corners are alpha zero and the figures are separable, but 509,208 pixels remain partially transparent. Red/orange halo pixels are still visible around silhouettes; low-alpha residue also reaches the bottom canvas edge. This requires light/dark edge cleanup review.
- **Pixel style:** still smoothly shaded and painterly, with blended muscle/cloth gradients rather than the requested hard pixel clusters. Kraken's identity is strong, but the prompt's style correction is incomplete.

The contact gesture itself is now viable for normalization testing. Keep the raw and provenance unchanged, preserve both palms when fitting, and hold acceptance until the normalized light/dark proofs and native current-court contact are reviewed.
