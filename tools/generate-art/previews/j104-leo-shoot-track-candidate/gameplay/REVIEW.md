# J.104 Leo `shoot` attempt04 gameplay-relative review

Date: 2026-10-28 UTC

## Result: hold; do not register attempt04

The native Jam Stage captures establish a static contact candidate, but attempt04 does not yet establish the runtime release point. Its release sample `[4,14.5]` was staged with player `z=3`, so the ball was rendered at a hand-authored world height independent of the simulation's jump.

I ran the actual `createMatch`/`stepMatch` shoot action using Leo from Blackthorn Court Kings, with defenders moved clear, practice mode enabled, and both facing values. The simulation reaches the authored release anchor `shoot/release` at tick13 with player `z=2.0` in both directions. Applying attempt04's frame5 track height `H=11.5` at that point gives a hand height of `13.5`; `flightHeightFromHand(11.5, 2.0)` maps it to projectile `z=16.1667`. The native capture's `[4,14.5]` release point is therefore 1.6667 world units lower than the actual gameplay-relative candidate. With the existing unregistered Leo shoot track, the same simulation seed releases at `z=8.8343`, so this candidate would increase release elevation by roughly 7.33 units.

A manual continuation using the production shot arc equations, the candidate release elevation, and both facings did score, but flight took about 100 simulation steps. This is not a production validation: the runtime Leo `shoot` track was not registered, and the original attempt04 screenshots do not show this actual gameplay-relative release. Scoring alone does not resolve whether the ball leaves the correct hand or whether its unusually high arc reads naturally.

## Required correction

Recalibrate the separate ball path at the real simulation jump height (`z=2` at release), not at the synthetic `z=3` used in attempt04. Capture the gameplay-relative release and following ticks on Jam Stage in both facings at 100% and 120%. Keep the ball at the shooting hand on tick13, ensure the tick14 departure reads as continuous, and review the resulting actual shot flight. Preserve attempt04 and this review as rejected/provisional evidence; do not replace its files.

## Reproduction details

- Runtime code path exercised: `createMatch`, `stepMatch`, `createInput`; Leo's real `shoot` action and tick13 release anchor.
- Court geometry: team0 rim at `x=188.8298`, Leo set at `x=130`, `y=50`; defenders moved away from the shot lane.
- Candidate transform: `flightHeightFromHand(11.5, player.z)`.
- Facing `+1`: release player `z=2`, candidate projectile `z=16.1667`, manually continued shot scored in 100 steps.
- Facing `-1`: release player `z=2`, candidate projectile `z=16.1667`, manually continued shot scored in 101 steps.
- Simulation follow-through manually applied candidate release z and recomputed the launch arc with the same equation used by `makeShot`; it does not substitute for a visual gameplay capture or production-track integration.
