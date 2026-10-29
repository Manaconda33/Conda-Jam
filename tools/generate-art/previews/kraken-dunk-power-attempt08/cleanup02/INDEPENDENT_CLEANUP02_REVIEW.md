# Kraken dunk-power attempt08 cleanup02 — independent review

**Verdict: reject as a production candidate; retain for pose reference.** Nearest-neighbor reduction and a shared palette improve the raw sheet's edge character, but do not bring it to the quality of Kraken's production pixel art. Four frames retain obvious detached fragments.

## Checks

- **Alpha and source isolation:** the output uses binary alpha with transparent gutters. It has 15 80×96 cells, `baselineY: 92`, and the layout reports 15 distinct frame hashes. The original brown field is absent.
- **Detached artifacts: fail.** The light/dark previews show isolated pixels at the bottom of several cells. Connected-component inspection confirms secondary components in frame 3 (15 px), frame 4 (37 px and 16 px), frame 5 (23 px), and frame 9 (29 px). The largest examples in frame 4 resemble clipped hand/foot fragments; the smaller bits read as detached sprite residue. They remain conspicuous against both backgrounds and should not be accepted as-is.
- **Anatomy and identity:** each main component preserves the auburn-haired, pointed-ear Kraken with warm skin, copper pendant, burgundy/copper kit, socks and shoes. No ball is baked in. The main body silhouettes remain connected after fitting; the extra pieces are not needed anatomy.
- **Margins and baseline:** all 15 cells share baselineY92 with a 4 px bottom margin. Left/right margins are 8–39 px, and top margins 8–20 px. The main silhouettes fit inside their cells, although several arms/legs are quite small after the common 0.2302 scale.
- **Pose sequence:** all 15 frames remain distinct. The approach, load, ascent, peak, downward action, follow-through, landing and recovery are readable in sequence. The airborne peak poses 8–10 are similar in overall direction but change arm reach and leg tuck; the slam/follow-through separation is visible. At native 80×96 size, gesture detail is reduced and should be validated in gameplay if the art is revised.
- **Style:** **still fails.** Nearest-neighbor resizing and the 24-color shared palette create hard pixel edges, but they preserve the source's illustrated shading as coarse, noisy color patches. Compared with Kraken's production idle sprite, the body/face clusters are muddy and less deliberately grouped. This is pixelated illustration rather than matching pixel-art sprite craft; normalization does not resolve the style concern.

Candidate-only review; no production files changed.
