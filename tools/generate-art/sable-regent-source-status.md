# Sable Regent — source-only animation status

Sable has 15 of 29 source clips prepared: five baseline locomotion clips and ten independently reviewed action atlases (`shoot`, `pass`, `pass-overhead`, `pass-behind`, `receive`, `pickup`, `layup`, `layup-reverse`, `block`, `steal`). The ten actions have matching raw/source/atlas hashes, accepted prompts and provenance, expected frame counts, unique crops, transparent background, and complete source poses. Sable's warm-brown adult human identity, gathered black curls, red headband, and black/crimson/white kit remain consistent. No basketball is painted into the art.

Each action's numeric ball path is recorded separately in its provenance. The runtime currently has Sable-specific tracks only for `idle-ball`, `dribble`, and `dribble-run`. Keep the action atlases outside the manifest until their athlete-specific tracks are integrated and verified in roster order.

The next Sable source action is `push`. Its exact prompt and HTTP 429 quota blocker are preserved in `sable-regent-push11-*`; no source image or atlas exists. An orphan draft prompt for shoot attempt 2 contains an unresolved title placeholder and has no associated result/provenance; it is not part of the accepted shoot package.
