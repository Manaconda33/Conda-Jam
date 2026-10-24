# Flint Rooker — source-only animation status

Five baseline locomotion clips (`idle`, `idle-ball`, `dribble`, `run`, `dribble-run`) are registered in the shared runtime. Two new candidates remain outside the runtime and are not counted as accepted source clips until review issues are fixed:

- `shoot`: 10 distinct poses with matching source/atlas hashes and correct identity. Reframe the fifth pose (2 px top clearance) and first second-row pose (touches row divider) to satisfy the prompt's broad-gutter requirement, then refresh the atlas and hashes.
- `pass`: six distinct poses with matching identity and atlas hashes. Two source poses overrun their nominal columns, leaving only 7 px and 3 px side clearance in packed frames. Reconcile the cleanup script's missing input path with the rejected raw source recorded in provenance so the pack is reproducible.

Next key remains `pass-overhead`. Preserve Flint's warm light-olive adult human face, clean-shaven features, vivid spiky curly red hair, charcoal/ember-red/white Scoria kit, and separate runtime ball.

Image generation is blocked by HTTP 429 `usage_limit_reached`, returned during an image edit request on 2026-10-24. The tool reported reset at 2026-10-24 13:10:15 UTC. No further generation request has been made while blocked.
