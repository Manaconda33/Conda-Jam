# J125 Leo dunk-scythe ball track review

Track calibration used the native production Jam Stage and `selectProductionSprite` selector. No manifest, runtime, or gameplay files were changed by this calibration. Each trial preserves 60 canvas captures: all 15 canonical timing samples, both facings, and 100%/120% zoom. Every capture selected the exact candidate atlas; left facing used safe mirroring; no uncaught browser errors. Exact vectors, release coordinates, selector proof, and capture reports are in `track-trials.json` and each `attempt-NN/native/report.json`.

## Best current candidate: attempt 06

Attempt 05 raised the carried ball at ticks 19–20 above the descending fingertips. Attempt 06 moved it partway back down. In reviewed right-facing 100% and left-facing 120% captures, the ball sits within roughly one ball radius of the fingertips at ticks 19–20. Gather tick 10 and peak tick 14 retain the close contacts from attempt 03. The separate ownerless tick 21 release remains close to the lowered hand. Review `attempt-06/native/` at both facings and both zooms.

Attempts 01–04 preserve the rejected initial and intermediate adjustments. Attempt 05 is rejected as slightly high on the finish.

Residual: still captures show a small vertical contact gap at ticks 19–20 and do not prove the moving action's real handoff timing. The candidate provides a materially closer visual match; integrate only after parent review of the native evidence and a gameplay action check.
