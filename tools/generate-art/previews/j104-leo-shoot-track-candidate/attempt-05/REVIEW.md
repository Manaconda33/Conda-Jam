# J.104 Leo `shoot` track attempt05 — rejected

This attempt corrected the synthetic jump state in earlier calibration captures. The real `createMatch`/`stepMatch` shoot action reaches release at tick13 with `player.z=2`; captures now use actual jump samples at ticks 8–14 and actual release elevation derived from the production `flightHeightFromHand` mapping.

Track vector: height `[0.95,1.1,2.1,2.1,4.2,8.8,7.5,4.5,2.1,1.05]`; forward `[6,7,6.5,4,3,4,4,4,6.5,5.5]`.

At tick13, frame5 H8.8 maps to gameplay projectile `z=13.4667`. The tick13 ball is above, but close to, the raised right hand in both facings. However, the earlier load at frame4 H4.2 puts the ball visibly above the two-hand gather at ticks10–12. That early mismatch is rejected; do not register this vector.

Capture provenance: `tools/capture-j104-leo-shoot-track.py`, `ATTEMPT=5`, the `TRACK_JSON` vector above, release samples `[4,13.4667]`, `[4.6,14.6301]`, `[5.74,16.879]`, `[7.47,20.0573]`, `[9.79,23.9311]` at ticks13/14/16/19/23. `native/report.json` records 48 current Jam Stage captures across both facings, 100%/120%, all frame selections, mirror flags and zero browser errors. Preserve captures as rejected evidence.
