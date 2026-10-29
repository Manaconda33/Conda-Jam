# Captain studio infrastructure progress

Infrastructure implementation is authorized on reviewable development branches. Pilot activation, merges, and deployments remain separately gated.

## Pinned reconciliation inputs

- main: b8ead76107c6604c8db901b2943c0b134c4b5ebb
- PR6: 55a2ab104d6b108cc08132fddc01b32afb958e75 (open)
- PR7: 97119d54fd24c442c15192a798cae1e8a279eb1d (open)
- Approved documentation: PR9 at a12a6abb6d61482d23945f5d82872808b0ca7eaa. Local documentation commit aa2fcfef0 has the same reviewed file bytes; API publication produced different commit ancestry.

Local Git object reconciliation applied PR6 content first (tree 97b303f2e3c7338e329440275b46f3fe55c133f6), then PR7 (unresolved tree 447cbe436204ade67a74275e79346a1df7b16822). Audit JSON and Markdown conflict; renderer/status merged automatically but still need semantic review. No candidate is accepted or promoted. No production baseline is pinned.

A full isolated checkout exhausted storage. Git removed its failed partial checkout; only the newly created scratch reconciliation checkout was removed afterward. Existing worktrees/artwork remain intact. The infrastructure worktree is sparse. Available space after cleanup: 5.2 GiB; source/evidence directory alone is 7.0 GiB. No resource caps have been inferred or production limits fabricated.

## Implemented foundation only

Canonical JSON, separate artwork/track/final-package hashing, safe path inventories, and exact baseline finding comparison. Normalized audit output excludes generatedAt and orders finding/result sets. Full schema, review-request validation, collector, exporter, registry migration, integrator, resource profiler and assignments remain pending. Hash helpers do not constitute approval verification or prove whole-tree integration determinism.

Ruling: implement independently testable digest/audit primitives while reconciliation is blocked; they are development-only and do not alter runtime registries or activate assets. Task1 and all activation gates remain incomplete.

## Validation and review

New focused tests pass (two test files). Existing full source checkout suite passes 89/89 test files. Sparse infrastructure checkout cannot independently run existing asset-sensitive suites until its required assets are materialized. Independent foundation review found unsorted artwork inventories and getter-backed arrays; reproducing tests failed first, both fixes now pass. Reversed audit finding/result ordering is also covered. No visual or gameplay change is claimed.
