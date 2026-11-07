# Captain Studio source-evolution verification policy v1

**Proposed November 7, 2026 | Review-only engineering change.**
This is an independent versioned verification policy for source changes *after* the previously accepted, immutable [PR #20](https://github.com/Manaconda33/Conda-Jam/pull/20) snapshot. It is **not** a new artwork baseline, a production-resource measurement, a waiver, or owner authorization to launch Captain Studio lanes.

## Two distinct historical and current-state checks

1. **Historical snapshot evidence is immutable.** PR #20 merged at Git commit `2654be8c094900200dd03910a99552b6cf1c2c07`. The 17 critical source blobs were pinned at its pre-merge source `895ff9c598689ce58980b504876b3b36c027f6a5`. The strict verifier now checks each historic Git object **at that historical commit** rather than expecting all subsequent live source files to remain byte-identical. The baseline JSON, baseline Markdown, 706-gap CSV, original `baseline-contract.mjs` and its tests must also remain exactly byte-identical to the Git objects preserved in the PR #20 merge.
2. **HEAD source evolution is separately verified.** The verifier derives the *complete* changed-path set from `git diff 2654be8c... HEAD`, checks every changed path and its actual Git blob ID, and rejects deletions, unrelated files, changed original baseline records, and any unreviewed source implementation. This proposed v1 policy has a small, explicit path inventory and **exact SHA-1 Git blob pins** for known source variants. It is not an extension wildcard.

## Exact version-1 evolution inventory

| Change | Scope | Git status |
| --- | --- | --- |
| Original v1 verification contract and CI migration | Five review-visible documentation/workflow/verifier/test files listed in `V1_VERIFIER_FILES` | Proposed in its own PR. Changing the verification policy itself still needs independent review and owner authorization. |
| PR #21 end-to-end synthetic integration tests | `tests/captain-studio-export.test.js` at blob `3d9a9079dc0c17908f7f0f617e4bb285899c47b5` | Already merged to main at `d18a65f1eee7f00ee9fa4d5946f3859e9108d5f1`. |
| PR #22 package file-count enforcement | `tools/captain-studio/integrate-batch.mjs` at blob `87627b0702ce037f8268848003bac20b585a0357`; `tests/captain-studio-integration.test.js` at blob `6ef46fbbdc2877e8d15f38489d6a6e3cf7555380` | **Not merged or authorized**. These exact hashes may be *evaluated by CI* after the verifier migration is separately approved. Passing does not authorize PR #22's merge. |

Current-head content must remain identical to original source pins **except** when a precise reviewed policy record permits an exact new Git blob. Neither a new README nor a candidate-authored package manifest can grant itself write permission. Future new source versions require a new reviewed version of this policy; never retroactively repin or edit the PR #20 historical source record.

## CI and review requirements

- Continue the strict, **read-only, freshly regenerated artwork audit** and compare all 746 original finding identities, including 706 missing directional captain clips and 40 historical prompt disclosures. The zero-new-finding result is *not* an artist's acceptance or a release endorsement.
- Check a full 17/17 set of historical pinned source blob IDs, immutable PR #20 metadata, complete per-file Git evolution diff and exact approved file bytes, alongside the normal full test/lint/league CI.
- Keep the existing dedicated required job name `exact-baseline` and continue publishing verification results without rewriting tracked audit reports. Any candidate changing assets, roster, production manifests, non-allowlisted code, or baseline records **must fail** unless separately reviewed under a new policy.
- Distinguish three owner gates: **approval of this verifier migration**, **a separate PR #22 resource-guard merge decision**, and **a future pilot/art-production activation decision**. None implies the next.
- Independently review the verifier migration itself because any PR touching checking code changes the rules that check it. Branch protection and human review must not be replaced by self-reported green CI.

## Recovery and deployment boundaries

The original unpublished Myth Codex workspace remains missing from the running environment, and its local recovery/provenance is a separate support-managed workstream. Myth still has 21 unregistered directional clips in the last accepted GitHub audit; a passing package fixture cannot fill those gaps. Preserve branches, untracked source and review evidence, original pinned assets, and unresolved [Marin #18](https://github.com/Manaconda33/Conda-Jam/issues/18) / [Kraken #19](https://github.com/Manaconda33/Conda-Jam/issues/19).

No artwork generation, new captain lanes, pilot launch, production-ref promotion, merge, or storage cleanup is authorized by this policy.
