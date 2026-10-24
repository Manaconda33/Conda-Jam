# Leo — source-only animation review

Leo has five locomotion atlases already registered plus 16 action atlases in the reviewed source-only package, for 21 of 29 keys. The eight absent actions are `dunk-reverse`, `dunk-360`, `dunk-tomahawk`, `dunk-double`, `dunk-clutch`, `dunk-scythe`, `alley-oop-power`, and `alley-oop-reverse`. None of these new action atlases is registered in the runtime manifest.

The source review confirmed all 21 atlas/layout pairs use the expected frame counts; every atlas cell is distinct and in bounds. For the 16 action packages, exact prompt references, accepted/rejected history, raw and cleaned source hashes, atlas hashes, dimensions and byte counts match the files on disk. Identity remains Leo's adult human build, long black hair, and black/red kit; the frames do not paint in basketballs.

Runtime integration remains blocked on ball-track reconciliation:

- There is no `athleteBallTracks.leo` override.
- J.104–J.117 source notes do not record numeric action tracks.
- J.118 `dunk-power` records a ball path that differs from the shared runtime track.
- J.119 `dunk-windmill` records the shared windmill path, but has no Leo-specific override.

J.119's accepted C2PA generation ID is also reused in its rejected edit history, so that lineage remains ambiguous. The five locomotion layouts point to a missing external raw source path; the runtime atlases themselves are present. Keep all new Leo assets source-only until the lineage and separate athlete-specific ball paths are recorded and reviewed. These source clips do not contribute to the registered strict audit.
