# Independent candidate review — Kraken reverse layup attempt27

**Verdict: mechanics and baseline compensation pass at zoom100; zoom120 framing prevents a complete visual acceptance. Candidate-only, not registered.** Reviewed all four facing/zoom report paths and the key contact, release, score, and celebration captures.

- The report confirms the candidate cleanup02 atlas is selected through the Jam Stage renderer for layup-reverse frames, loaded at 320px natural width. Right-facing uses the source orientation; left-facing uses `flip: true`. This run injects only the candidate atlas/track in the page; no production manifest/runtime assets were changed.
- At zoom100, the grounded opening poses show shoes resting on the court around Kraken's player marker/shadow, with no visible hover. The atlas moves the art up two source pixels and uses baselineY=92; the renderer's 94→92 compensation is consistent with preserving the old baseline.
- At both facings, the reverse-carry ball remains with Kraken through tick11. Tick12 selects frame5, clears `player.hasBall`, changes the ball to unowned `shot`, and logs “Kraken launches a 2-pointer.” The 100% captures show the ball leaving the raised behind-head hand; the next follow-through frame continues the shot. The action scores two points at tick99/100 (right `[2,0]`, left `[0,2]`). After scoring, the runtime selects the actual `./public/assets/animation/kraken-celebrate-right.png` celebration and the ball is dead/unowned.
- **Zoom120 visual gate is not complete:** the player is clipped at the screen edge in the grounded start and at the tick12 release captures for both facings (right off the right edge, left off the left edge). The report confirms selection and shot state, but the screenshots cannot verify full-body ground alignment or hand/ball release at 120%. Recenter the fixture/camera before claiming both-zoom visual validation.
- No uncaught browser errors were reported.

The release, two-point score, and post-score celebration pass; run another candidate capture with framing that keeps Kraken fully visible at zoom120 before closing the native visual gate.
