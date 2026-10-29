# Kraken J.07 `pickup` attempt05 — current-court track calibration

All current-court trials use the production Jam Stage matchup Vesper Harbor Undertow vs Blackthorn Court Kings at courtY75. Each run advances normal `stepMatch` after one setup fixture; candidate atlas and track are injected in page memory only. The current report has 32 captures: ticks0,2,4,6,7,8,10,11 × both facings × 100%/120%, with zero browser errors and correct mirrored frame selection.

- Attempt03 is retained but invalid for acceptance: the copied setup started Vesper Harbor vs Scoria Rams. CourtY75 alone did not make that the current matchup.
- Attempt04 confirms the tick7 loose-ball grab but is rejected for carry placement: the ball sits by the forward knee/shin at ticks8/10/11.
- Attempt05 is retained as rejected: frame4 H1.4/F2.5 places the ball at the face/head.
- Attempt06 is the current candidate: H `[0.65,0.45,0.2,0.2,0.68]`, F `[3.5,4.5,5.5,4.5,2.5]`. Visual checks at both facings and 120% place the frame4 ball over Kraken's gathered hands at abdomen height. Independent gameplay review is pending; this candidate has not been run through the normal loader or registered.
