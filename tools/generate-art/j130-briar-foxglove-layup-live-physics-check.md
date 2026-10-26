# J.130 Briar layup: live shot physics check

A temporary copy of `src/core/animation.js` and `src/core/simulation.js` was created under `/tmp`; only the copy received the five reviewed-draft Briar `layup` H/F values. No runtime file or registered manifest was changed. The check used `createMatch`/`stepMatch`, Emberwood with Briar selected, neutral inputs, practice mode, deterministic seed12345, and both court directions.

Assertions passed:

- tick9 remains carried and owned by `briar-foxglove`;
- tick10 creates one shot attempt and changes to `mode:"shot"`, `ownerId:null`;
- the ball advances through ticks11,14,18,30,45,60 and80 under the real simulation integrator;
- the deterministic attempt scores once by tick100 in each facing, with no repeated scoring.

For facing right, the sampled ball progressed x174.772 at tick10 to x186.727 at tick80, following a rising then falling arc; it scored at tick100. For facing left, it progressed symmetrically x25.228 to x13.273 and scored once at tick100. The check confirms that the live projectile does not stall after the per-athlete track releases ownership. It does not establish shot accuracy across normal gameplay seeds or constitute final artist approval of frames00–02.
