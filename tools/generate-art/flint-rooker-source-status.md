# Flint Rooker — source-only animation status

Flint has seven prepared source clips: five registered baseline locomotion clips (`idle`, `idle-ball`, `dribble`, `run`, `dribble-run`), plus accepted source-only `shoot` (10 poses) and `pass` (6 poses). Neither action atlas is in the shared runtime manifest yet.

Independent review confirmed all 16 action crops are unique and complete, the ball is not painted into either sheet, and Flint's clean-shaven human identity, vivid red curls, and charcoal/ember/white kit remain consistent. Source-sheet margins now meet the prompt's 40px minimum. The `pass` cleanup script reads its recorded raw source and reproduces the cleaned image hash. Reframing, prompt history, previews, layouts, and hashes are preserved in the Flint-prefixed files.

Before runtime integration, add and review Flint-specific `shoot` and `pass` ball tracks. Keep all new source art outside the runtime manifest until those separate paths are implemented and verified.

**Next source key:** `pass-overhead` (6 distinct right-facing poses). Preserve Flint's warm light-olive adult human face, clean-shaven features, vivid spiky curly red hair, charcoal/ember-red/white Scoria kit, and separate runtime ball.

Image generation is blocked by HTTP 429 `usage_limit_reached`, returned during an image edit request on 2026-10-24. The tool reported a reset at 2026-10-24 13:10:15 UTC. No further generation request has been made while blocked.
