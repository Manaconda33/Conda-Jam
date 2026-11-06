# Captain studio combined baseline acceptance

Accepted local integration baseline: `9b738f32a32ee758f3186e73e4f8a7b24479d767` (`a083c0eb59d6fd85393a7728af42390f3ad6e5a1` tree).

This records acceptance of the reconciled PR #6/#7 candidate for infrastructure validation. It does not merge or change either pull request, accept any captain package, or authorize the 6–8 captain pilot.

## Independent review and tree reconciliation

An independent review accepted this pinned candidate for the integration milestone and reported 72 resolved audit gaps, no added findings, and no increase in missing assignments relative to PR #7. The reviewer also required the PR heads to be verified directly because the candidate is not descended from either open PR head. That follow-up check used Git tree blob IDs, not ancestry or working-tree state:

- PR #6 head: `55a2ab104d6b108cc08132fddc01b32afb958e75`.
- PR #7 head: `97119d54fd24c442c15192a798cae1e8a279eb1d`.
- Both heads have `b8ead76107c6604c8db901b2943c0b134c4b5ebb` as the comparison baseline.
- All 33,123 paths changed by PR #6 and all 60 paths changed by PR #7 exist in the candidate tree.
- Five PR #6 paths and four PR #7 paths have different candidate blobs. These are the reconciled strict-audit outputs, `src/core/animation.js` (PR #6 comparison), and `src/render/animation-sprites.js` (both comparisons). All other changed paths match the corresponding PR head exactly.
- The candidate adds the dedicated Marin-to-Kraken visual review and retains its reviewed catch fix. This review covers both facings, catch/release continuity, and the production loader; it is not a long-gameplay acceptance.

The comparison used complete committed trees: the candidate has 55,134 tracked files. The separate PR heads remain open and unmerged; the accepted integration input is the exact local candidate SHA above.

## Full-set strict audit

A read-only execution of the strict `auditManifest` implementation against the pinned candidate and its complete artwork tree inspected all 105 athletes and 2,397 registered clip assignments. It found 42 unique source libraries, 570 source atlases, and 5,489 unique decoded drawings; 706 clip assignments remain missing, with zero target shortfalls. The 746 findings are those 706 expected missing assignments plus 40 inherited `prompt-not-verbatim` findings. The report is incomplete by design; it is the baseline against which packages must add no findings and resolve only their authorized captain gaps.

The committed candidate audit JSON SHA-256 is `9ed48eb78a02827b1839a2f845397536da332cf5b0d626f174f3e9be9177af27`. A fresh strict audit in the full candidate view returned the same normalized finding-set hash, `be7d86c9ace3a9e0dd27408787f677393c6415223591f0b08fe69434cd303115`, with zero added or resolved findings. The fresh report JSON SHA-256 is `2fb502a14c93e5650b37c75da97e6f0df281bac2c9ada94dc762542950207c5b`; only its run timestamp differs. The infrastructure test fixture now pins these exact findings instead of the stale 710-finding snapshot.

## Full-tree hardlink staging check

A clean full candidate view was assembled with 55,134 tracked files. It matched the accepted candidate commit and tree exactly. The integrator's resource-bounded `createStage` staged all 55,134 regular files as hardlinks on the same filesystem. After staging, the candidate source repository remained clean. SHA-256 and inode checks for `manifest.json`, `kraken-celebrate-right.png`, and `krios-celebrate-right.webp` matched between source and staged tree; each source/staged pair shared one inode. This demonstrates unchanged source assets during full-tree staging. The package mutation path remains unexercised until a valid reviewed package is available.

Focused validation on the infrastructure branch passed 57/57 studio, worker-history, strict-audit-comparison, track-registry, ledger, and review tests. Lint passed for 24 modules and content validation passed for 35 franchises, 105 athletes, and 35 captains. The branch's local checkout is sparse for art assets, so its unrestricted full repository test command is not a valid full-asset result; that is why the focused checks and complete candidate-tree audit/staging are recorded separately.

## Remaining integration gate

No captain studio package manifest exists in the available workspaces. A production package must pass the default validator, including worker-history checks, source and prompt lineage, artwork and track hashes, and independent digest-bound artwork and gameplay approvals. No approval or provenance is fabricated to manufacture an end-to-end pass. The package validation, manifest/registry mutation, post-integration strict audit, and immutable-source checks during those mutations remain pending a genuinely reviewed package. Infrastructure unit and fixture validation can proceed against this accepted baseline; production integration, pilot sessions, merging, and deployment remain separate gates.
