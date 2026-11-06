# J125 Leo dunk-scythe ball track review

## Accepted: attempt 06

Calibration used the native production Jam Stage and `selectProductionSprite` selector. Each trial preserves 60 canvas captures: all 15 canonical timing samples, both facings, and 100%/120% zoom. Every capture selected the exact candidate atlas; left facing used safe mirroring; no uncaught browser errors. Exact vectors, release coordinates, selector proof, and capture reports are in `track-trials.json` and each `attempt-NN/native/report.json`.

Independent review of attempt06 found the ball within a few pixels of the descending fingertips at ticks19–20 (less than a quarter ball radius), with gather tick10, peak tick14 and separate tick21 release all visually sound in both facings/zooms. The small clearance is consistent across the sampled captures; no handoff break, wrong atlas, HUD issue, or mirror defect was found.

Gameplay test verifies Leo’s track values and separate ball positions in both facings, held ownership through tick20, one release at tick21, score at tick23 and landing frame/tick30. Track is registered with attempt06. Attempts01–05 remain preserved as rejected adjustments with evidence.
