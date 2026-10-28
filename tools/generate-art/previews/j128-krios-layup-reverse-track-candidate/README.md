# Krios J.128 `layup-reverse` ball-track calibration

All captures use the current Jam Stage source. These attempts inject the unregistered native candidate and Krios track before startup; they are candidate calibration only, not registered-runtime proof. The capture script now creates a fresh match/page per facing and warms the appropriate end camera.

- `attempt-01`: first track candidate using the initial positive forward values, tested in the first harness version. Preserve as an exploratory calibration.
- `attempt-02`: revised release hand forward offset using the first harness version; preserve as an exploratory calibration.
- `attempt-03`: current candidate: H `[0.9,1.25,1.7,2.15,2.3,2.35,1.4,0.8]`, F `[4,5.5,4,3,-4,-1,5,4]`, releaseVz `.45`. It carries through tick11 and releases once on frame5/tick12. Report shows 64 captures / four fresh runs at 100%/120%, both facing-specific rosters, score at tick49, clean event logs, and zero browser errors.

The independent review is pending. Registration requires review of the reverse-side held-ball contact at frames4/tick10–11 and open-hand release frame5/tick12, both facings/zooms, scoring and no fallback.
