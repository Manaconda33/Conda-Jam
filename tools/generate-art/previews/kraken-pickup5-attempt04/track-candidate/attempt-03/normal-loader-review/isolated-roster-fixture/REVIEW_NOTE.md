# Multi-player capture set — excluded due persistent silhouette overlap

This 32-capture set retained every player in the normally initialized match and moved teammates/opponents to valid far-court coordinates. Visual review still found a second rostered sprite overlapping Kraken at the controlled pickup point, making hand/ball contact ambiguous. Preserve this evidence, but exclude it from identity and pose signoff.

The current `single-player-fixture/` set starts the match normally, allowing `loadProductionSprites` to load the candidate, then narrows `state.players` to Kraken before placing the one-time loose-ball fixture. This changes only the test fixture's active roster; the production renderer, loader, animation selector, and ball/simulation code remain untouched.
