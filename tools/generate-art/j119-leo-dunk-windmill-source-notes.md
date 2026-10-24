# J.119 — Leo windmill dunk source notes

The accepted sheet contains fifteen distinct right-facing poses. Leo remains a pale adult human man with long wavy black hair, a refined mustache and controlled bearing, wearing his black uniform with restrained crimson details. His arms, legs, hair and shoes remain readable in the full-body poses. No ball is painted into the sheet. Exact required-key inventory: 21/29 source atlases, with `dunk-reverse` next.

- Canon: K.05, Blackthorn Court Kings.
- Original generation prompt: `tools/generate-art/j119-leo-dunk-windmill15-prompt.md`.
- Original raw generation: `tools/generate-art/sources/j119-leo-dunk-windmill-generated-raw.png`.
- Background edit attempt: `tools/generate-art/sources/leo-windmill-edit-rejected.png`; rejected because it rendered a visible checkerboard in place of transparency. Its C2PA identifier and SHA-256 are retained in the provenance file.
- The accepted cleanup masks only near-neutral light gray/white components connected to the sheet edge. Enclosed bright character pixels are retained. Exact cleanup implementation: `tools/generate-art/clean-leo-dunk-windmill.py`.
- Accepted cleaned source: `tools/generate-art/sources/j119-leo-dunk-windmill15.png`.
- Source review: `tools/generate-art/sources/leo-dunk-windmill15-review.jpg`; atlas preview: `tools/generate-art/leo-dunk-windmill-atlas-preview.png`.
- Atlas packaging: `tools/generate-art/package-dunk15.py leo dunk-windmill ... --isolate-components`; crops and uniformly scales the fifteen reviewed poses without adding frames.
- The separate Leo ball track follows the right hand through the low windmill circle and overhead finish; frame10/tick21 is the single release. Track coordinates are preserved in `src/core/animation.js` and mirrored in the provenance record, without editing runtime files here.

The output was checked on a light checkerboard review composite. All fifteen figures remain separated, the checkerboard matte is absent from the alpha channel, and the final atlas remains source-only pending central integration.
