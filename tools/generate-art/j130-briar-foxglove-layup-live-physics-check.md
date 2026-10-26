# J.130 Briar layup: live shot physics check — track10

Validation date: 2026-10-26 UTC. The check runs temporary copies of the repository animation and simulation modules under `/tmp`; only the copied animation module receives the J.130 track10 candidate. Production runtime files and asset registry are not changed by this physics check.

Setup: `createMatch` / `stepMatch`, Emberwood Kits with Briar selected, neutral inputs, practice mode, Rookie difficulty, deterministic seed12345, and both court facings. Candidate carried path: H `[1.54,1.635045,1.53,1.550734,1.71701]`, F `[2.5,2.65,3.6,1.43926,4.2]`.

Assertions pass in both facings:

- At tick9, the ball is carried by `briar-foxglove`.
- At tick10, exactly one shot attempt starts and ownership becomes `null`.
- The ownerless projectile advances through subsequent simulation ticks.
- It scores once for two points by tick100; the score does not repeat.

Facing right: tick9 carried at `(x=172.820,z=3.595)`; tick10 shot at `(174.376,3.305)`, with velocity `(vx=.176,vz=1.062)`; tick80 reaches `(186.668,14.831)`; tick100 scores once. Facing left is symmetric: tick9 `(27.180,3.595)`, tick10 `(25.624,3.305)` with `vx=-.176`; tick80 `(13.332,14.831)`; tick100 scores once for the opposing side.

The complete sampled output is `tools/generate-art/j130-briar-foxglove-layup-live-physics-results.json`, copied from the deterministic rerun. This confirms carried-to-ownerless transition and subsequent physics for this seed and setup; it is not broad shot-accuracy calibration.
