# J.130 Briar Foxglove layup: provisional frames 03–04 ball track review

The previous packed-native captures used the current Jam Stage renderer but did not draw the candidate atlas. `tools/render-preview.mjs` inserted the candidate manifest after `game.start()` had snapshotted production sprite assets. Its report read a separate image map, so the captures actually showed legacy fallback sprites. In addition, the pre-release tick9 branch bypassed its candidate ball-track override. Those captures are retained as diagnostics but are not valid art/contact evidence.

The preview harness now injects the candidate before `game.start()` and uses its draft track at tick9. Its right-facing atlas is process-locally mirrored for the left-facing review. The raw/source asset and checked-in runtime registry are unchanged.

For the current 72×95 candidate cell, frame03/04 trial values are:

- height: `1.550734`, `1.717010`
- forward: `1.439260`, `4.600867`

The full five-point trial track in the integration candidate is H `[1.136218, 1.635045, 1.829033, 1.550734, 1.717010]`, F `[6.306216, 5.651797, 3.157357, 1.439260, 4.600867]`. Frames00–02 remain estimates awaiting hand-contact review. After frame04 release, isolated pose captures preserve the release position; they do not advance gameplay physics. Review the ownerless projectile trajectory in live simulation rather than inventing athlete-owned frame05–07 samples.

Independent native review at120%, both facings: at tick9 the ball contacts the forward hand area; at tick10 it separates slightly forward and upward with a plausible release gap. This is provisional contact/release evidence only. Independent review at100% also passes in both facings: tick9 contacts the presenting hands and tick10 separates slightly forward/up. No zoom-dependent contact defect was found. No ball is baked into Briar's art, and the draft is not runtime-calibrated or registered.

Evidence: `tools/generate-art/previews/j130-briar-foxglove-layup/attempt-04/track1-contactfix-120/` and `/track1-contactfix-100/`; candidate atlas and exact values: `tools/generate-art/candidates/j130-briar-foxglove-layup-attempt-04-integration/`.
