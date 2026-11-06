# J111 Leo `layup-reverse` attempt20 registered-runtime review

**Disposition: rejected for runtime integration acceptance.** The gameplay record is valid, but both-facing framing is not reliable enough to approve this registered run.

## Evidence reviewed

- `runtime/both/report.json`: `runtimeIntegration: true`; production Jam Stage renderer using `public/assets/animation/leo-layup-reverse-right.webp` and registered Leo-specific ball track.
- Track H `[0.4,1.61,1.98,2.6,2.65,2.65,1.45,0.84]`, F `[5.85,6.58,4.02,4.5,5.5,6.8,6.58,5.85]`; `releaseVz: 0.45`.
- 32 captures: both facings, 100% and 120%, ticks 11, 12, 13, 17, 20, 30, 40 and 50. Ownership clears at tick12; both shots score two points at tick49; `uncaughtBrowserErrors` is empty.
- Inspected release and flight screenshots across both zooms and facings, including left ticks11/13/40/50 and right ticks11/13/30/40.

## Findings

Gameplay data reports a correct shot arc and score in both directions. Some right-facing captures show Leo and the independent ball at release and the ball approaching the rim. The runtime report also confirms the public registered atlas and production track were used.

However, the actual images fail the framing check. Left-facing tick11 and tick13 at 100% show only empty court; left-facing tick40 and tick50 at 120% show Leo cut off at the left screen edge. Right-facing tick11 at 120% shows empty court, while right-facing tick40 at 120% clips Leo at the right edge. This prevents review of the full registered animation and ball relationship for both facings and zooms. The report does not provide per-capture selected-frame/flip values, so mirrored frame selection is not independently evidenced by its JSON either.

Do not treat attempt20 as acceptance evidence. Recapture after fixing the camera/setup so Leo, ball, and hoop remain in frame at every sampled facing and zoom; include selector/flip evidence and repeat the registered-runtime review.
