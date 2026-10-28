# Independent J111 `layup-reverse` track review — attempt05

## Verdict: candidate gameplay state passes; full rendered gameplay evidence is not yet acceptable

The dedicated Jam Stage contact captures pass at both facings and both zooms. At tick11/frame4 the separate ball meets Leo's raised hand; at tick12/frame5 it follows the extended hand and becomes an ownerless shot. The atlas selector reports frames4 and5, the correct source path, and horizontal flip only for left-facing. There are no browser errors in the 40-capture native report.

The gameplay state trace also passes the core transitions: Leo owns the ball through tick11; tick12 clears ownership and enters shot mode. Both simulations score at tick108 at the correct opposite hoop: right-facing scores `[3,0]` at x=188.8298, and left-facing scores `[0,3]` at x=11.1702. Both have one field-goal attempt and make.

However, the claimed rendered gameplay follow-up does not visibly prove both directions. The right-facing tick11/12 screenshots show Leo and the ball. The left-facing gameplay tick11/12 screenshots (`gameplay-left-tick011-zoom120.png`, `gameplay-left-tick012-zoom120.png`) show only court/HUD; Leo and the basketball are absent from the canvas even though the JSON state says Leo is at x=100 and the ball is at x≈94. The capture report also includes a stale prior `lastEvent`/event list in some left-facing snapshots. This suggests a fixture/camera/render refresh problem; it does not disprove the simulation result or the separate Jam Stage hand-contact review.

Before runtime integration, rerun the full gameplay capture with a clean match/camera state and verify visible left-facing athlete and ball at release and early flight, as well as the existing ownership and score checks. Do not treat the empty left-facing screenshots as visual approval. Production runtime and manifest remain untouched.
