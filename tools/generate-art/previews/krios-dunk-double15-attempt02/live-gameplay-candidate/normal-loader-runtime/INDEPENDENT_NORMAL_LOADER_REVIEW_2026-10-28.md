# Independent normal-loader review — Krios J.128 `dunk-double`, track attempt03

**Verdict: PASS for the reviewed normal-loader capture set.**

## Evidence reviewed

Reviewed all 60 captures: 15 sampled frames/ticks × right/left facings × 100%/120% zoom. The report confirms normal-loader runtime integration, no candidate atlas or ball-track injection, track attempt03, registered atlas `public/assets/animation/krios-dunk-double-right.png` (SHA-256 `d18b4abe52b67b46fdf5294fc8398293ab39a0bb6cde205994d90a5eb9e395a9`), and production frame selection for each capture. Right-facing is unflipped and left-facing is mirrored. Captures use the current Jam Stage at courtY90; no browser or console errors are recorded.

## Findings

- **Tick7 face clearance:** At frame03/tick07 the ball passes beside Krios's head; the face remains visibly clear in both directions and zooms. HUD and stage margins are clean.
- **Tick9 fold:** Frame04/tick09 is a compact folded/tucked pose with the ball held close at the torso. It reads as a distinct gather transition and remains anatomically coherent.
- **Gather/contact at ticks17/19:** The separate ball stays close to the raised hands through frames08–09. At tick17 it passes directly in front of the head and briefly obscures most facial detail; the head/horns remain identifiable, and by tick19 the ball has moved above the hands with the face clear. The brief overlap reads as a close gather rather than detached or misplaced art, though it is the sequence's tightest visual contact.
- **Release and score:** At tick21/frame10 the ownerless ball is visible centered at the rim, with Krios reaching into the basket. Tick23/frame11 removes the ball and commits the expected two points; the scoreboard and `Krios scores 2!` event agree in both directions.
- **Landing and completeness:** Tick30/frame14 shows a stable planted landing/recovery. All sampled cells resolve from the registered atlas, with no missing sprite, incorrect fallback, spill, or court/HUD crop.

## Recommendation

The registered `dunk-double` atlas and track attempt03 pass this independent normal-loader runtime review. Note the brief tick17 ball/face overlap when considering polish; it does not prevent the gather, release, or scoring action from reading correctly in these captures.
