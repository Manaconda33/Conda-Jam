# Independent normal-loader runtime review — Krios J.128 `dunk-power`

**Verdict: PASS for runtime art and track verification.**

## Evidence reviewed

Reviewed all 60 captures in this folder: 15 sampled frames/ticks across right and left facings at 100% and 120% zoom. The capture report confirms production runtime integration, no candidate atlas or ball-track injection, and the registered atlas `public/assets/animation/krios-dunk-power-right.png` with SHA-256 `ddbd2e5d12c04d25e9a9d72c043a340cdd83cd79aff4e2ec8339ad68380073c7`. All requested frame selections resolve to that atlas. Right-facing uses `flip: false`; left-facing uses `flip: true`. The report records the current Jam Stage at courtY90 and no browser or console errors.

## Findings

- **Frame coverage and presentation:** The full 15-frame sequence is present in both directions and remains in court/HUD bounds at both zoom levels. The source reads consistently as Krios through approach, gather, lift, peak, drive, contact, release follow-through, and landing/recovery. Body silhouette and identity are intact; the ball remains a separate runtime object.
- **Release contact:** At tick21/frame10, the ownerless dunk ball is visibly centered at the rim in both facings and zoom levels. Krios's outstretched arm reaches into the ring, so the ball/rim/hand relation reads as a dunk contact. The ball no longer obscures the torso. Rim overlap at the lower edge of the ball supports the contact impression; the hand is close to the ball/rim but partly overlapped by the rim at 120%, which is acceptable at this scale.
- **Ownership and score:** The ball is carried by Krios through tick19/frame09. At tick21 it transitions to mode `dunk` with owner `null`; tick23/frame11 transitions to `dead`, commits exactly two points for Krios's team, and records `Krios scores 2!`. The board and event banner show the expected scoring result in each direction. The ball is absent during follow-through and the final recovery frames, with no duplicate possession or fallback sprite visible.
- **Court and scoring composition:** The stage framing keeps the athlete, ball at contact, hoop, court markings, HUD, and score event legible. The navy arena band at peak reads as intentional backdrop. The zoom100 release view includes a small floating `P1` marker by the backboard; it appears to be a gameplay prompt and does not cover the athlete or contact point.

## Recommendation

The registered art and Krios runtime track pass this independent normal-loader visual/runtime review for `dunk-power`. Preserve this capture set as verification evidence. This review covers the specified 60-frame sample and does not certify unrelated clips or deployment behavior.
