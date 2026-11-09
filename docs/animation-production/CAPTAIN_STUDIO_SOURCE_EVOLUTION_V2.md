# Captain Studio source-evolution verification policy v2

**Proposed November 9, 2026 | Independent review required | Not merged.**

## Purpose and authorization boundaries

PR #23's v1 verification policy merged at `1e145e7be3317fde6839632e85ac58daab516d00` and was independently verified by manual CI. PR #22's original file-inventory guard ran *after* `collectCaptainContribution()` had read and hashed worker Git blobs. This v2 proposal permits **only** the separately reviewed corrected two-file PR #22 candidate, whose manifest-inventory limit runs **before** worker-history collection. It does not approve PR #22 for merge, establish a measured production file cap, produce/accept artwork, or authorize production/pilot operation.

## What is unchanged

- Original PR #20 merge `2654be8c094900200dd03910a99552b6cf1c2c07`, historical source commit `895ff9c598689ce58980b504876b3b36c027f6a5`, 17 original source pins and five frozen snapshot artifacts remain immutable.
- Preserve all three non-overlapping v1 verifier records (v1 contract, tests, documentation) *byte-identical* to the accepted PR #23 merge. The v2 migration may change only the two shared verifier/workflow files and add three named v2 contract/test/documentation files.
- The strict audit must still match all 746 inherited identities (706 missing directional assignments, 40 historical prompt disclosures) without any new art acceptance or production authorization.

## Two separately gated pull requests

1. **This v2 verifier migration:** exact base `1e145e7be3317fde6839632e85ac58daab516d00`. The complete PR diff must contain *exactly five files*: the existing read-only baseline workflow, `tools/captain-studio/verify-baseline.mjs`, and new `source-evolution-contract-v2.mjs`, `captain-studio-source-evolution-v2.test.js`, `CAPTAIN_STUDIO_SOURCE_EVOLUTION_V2.md`. No unrelated source, artwork, or historical file modification is permitted.
2. **PR #22 corrected code:** a later source-only diff may contain only the two proposed pinned files, `tools/captain-studio/integrate-batch.mjs` (Git blob `6fe561d3ae87760d903da65470ca968cd68930e7`) and `tests/captain-studio-integration.test.js` (Git blob `215ab7c722eb87b3b4bf93c8b78a83bece62ba48`). The original v1 candidate hashes are deliberately **not** permitted under v2.

The already merged PR #21 export-test source variant remains byte-pinned to `3d9a9079dc0c17908f7f0f617e4bb285899c47b5`. Every other cumulative source change since PR #20 is rejected. v2 makes no permissive wildcard for verifier files on future PRs: any further verifier-policy change needs a new separately reviewed policy.

## Limits of the preflight guard

The corrected guard reads the *declared manifest inventory* and checks its count immediately after loading the manifest. Oversized declared inventories are rejected before `collectCaptainContribution()` enters worker Git history, before content hashing, before package validation and before staging. The package-bytes check repeats the limit as defense in depth.

**Threat-model limit:** a dishonest manifest that underreports changed files may still cause worker-history inspection before a history-to-inventory mismatch is found. This is a declared-inventory preflight, **not** an independently measured bound on Git objects or package byte volume. The `maxPackageFiles: 64` test fixture is synthetic, not an accepted production resource measurement. Additional Git-tree metadata bounds or production limits require new measurement, tests, and owner approval.

## Evidence and approval

Run full test/lint/content/league CI plus read-only strict-baseline audit on this v2 verifier PR. Before altering PR #22's source branch, independently review and obtain separate owner authorization to merge this v2 policy. Then reconcile PR #22 to the new approved base, introduce the exact corrected source/test blobs, rerun both checks, independently review, and request a separate PR #22 merge decision. Keep PR #22 draft until that gate. Preserve original Myth work and historical branches; do not recover, rebuild, delete, or reset them here.
