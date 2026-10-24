# J.104 — Keeg clutch dunk source notes

## Accepted generation

Fifteen distinct right-facing poses show a two-hand gather, jump, overhead clutch, single tick-21 release, empty-handed descent and balanced landing. Keeg stays an adult human with his black hair, close black beard, full purple mushroom hat with silver trim, and purple/lavender/silver Moonmorel Hex kit. The basketball remains a separate game object.

- Generation: `exec-e4a19c0e-2ec3-474d-901d-6629f6f7f468`; date 2026-10-24; direction right-facing; canon K.03.
- Raw source: `tools/generate-art/sources/j104-keeg-dunk-clutch-generated-raw.png` — SHA-256 `44977e83c30769085d5ec38062dfecdea3557046962a49e76e4aa99a822fe519`.
- Accepted cleaned 5×3 sheet: `tools/generate-art/sources/j104-keeg-dunk-clutch15.png` — SHA-256 `c0fa2538c8be63ed0edab0010a5734da3585c103b7613790a4593058b2d7752c`.
- No alternate candidate was rejected for J.104. The first unsaved generation call was discarded before review and is not a J.104 source candidate.
- Cleanup isolates fifteen connected figures, removes isolated high-chroma red artifact pixels when present, centers them in the 5×3 grid, and preserves at least11px cell clearance. Layout and cleanup records are in `j104-keeg-dunk-clutch-cleanup-layout.json`.
- Exact accepted prompt: `j104-keeg-dunk-clutch-prompt.md`.

## Separate ball track

The ball is never painted into the poses. Keeg gathers with both hands, carries the ball through the two-handed overhead clutch, releases at pose10/tick21, then follows through empty-handed. The athlete-specific `height` and `forward` samples are preserved in `j104-keeg-dunk-clutch15-provenance.json`.
