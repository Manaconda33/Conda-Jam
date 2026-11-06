# Krios J.128 celebrate attempt01 — independent cleanup review

**Verdict: PASS for gameplay trials only.** This does not accept the atlas for registration or gameplay completion.

I compared the corrected extracted atlas, per-pose isolates, light/dark previews, cleanup report, raw sheet, and the independent source review. The atlas is 1280×96 with ten distinct frames in row-major action order: recognition, build, raise, victory peak, flourish, personal triumph, second cheer, release cheer, settle, finish. All ten decoded frame hashes are unique. The shared nearest-neighbor scale is 0.1638095; each frame is centered in a 128×96 cell and shares baseline y=94. Reported pose bounds stay within their cells, with clear transparent margins. Alpha is strictly 0 or 255. The green sheet background and cell separators are absent from the output.

The image scan found **0 opaque green-dominant pixels** at the threshold G>R+20, G>B+15, G>60 (and also zero at the stricter source-background threshold). The corrected int16 edge despill touches only green-dominant pixels; Krios's red skin, black horns/beard/contours and charcoal/ember uniform remain visually intact. Light and dark previews read consistently, and the ten silhouettes remain distinct at 64×96 review scale. I see no disconnected limb or crop introduced by extraction; the extracted poses retain the source's clear anatomy and identity.

The vertical poses are naturally narrow in the 128-pixel cell (roughly 37–47 px wide at the shared scale), while keeping a common height and baseline. This is acceptable for gameplay trials and preserves the consistent source scale; check side-by-side body size against Krios's registered clips in Jam Stage before production acceptance.

Next: capture candidate frames through the current Jam Stage, then validate actual post-score celebration selection, facing, and ball state. The image contains no ball; the game ball must remain a separate runtime object. Do not register based on this cleanup review alone.
