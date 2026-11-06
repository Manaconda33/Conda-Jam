# PR #17: Proven complete non-sparse integration checkout (2026-11-06)

**Gate conclusion: complete non-sparse checkout and full available test suite PASS.**
**Not strict art acceptance, not an independent reviewer approval, and not authorization to merge/deploy.**

## Immutable verification and reproducibility

- Tested exact integration commit: `8af10815ce9cb9d03040c788e9fd9c0c11c59f6b`
- New read-only verification workflow: `.github/workflows/pr17-nonsparse-object-probe.yml`
- Successful run: https://github.com/Manaconda33/Conda-Jam/actions/runs/42263232001
- Downloadable 7-day detailed evidence artifact (full logs, physical checkout manifest, fetched original pinned trees, audit JSON/Markdown, per-finding identity delta): https://github.com/Manaconda33/Conda-Jam/actions/runs/42263232001/artifacts/13525269744
- Artifact ZIP SHA-256: `210f61d4ef36b3823705f844f207290879fc61690009b1864acbd7d7ee4a1ae2`
- Workflow does not merge branches, write to original refs, create imagery or deploy.

The workflow first fetches pinned original PR #6 head `55a2ab104d6b108cc08132fddc01b32afb958e75` as a tree-only reference and records its tree inventory. It then explicitly disables sparse checkout on the exact assembled PR #17 head in an ephemeral runner. The full checkout completed with **55,024 tracked paths, zero absent physical paths** and no sparse-checkout mode.

With project-required ImageMagick installed and the complete physical source tree present, it ran the original unmodified `npm test`: **587/587 PASS, zero failures and skips**. The real-tree `tools/audit-animation-assets.mjs --report-only` succeeded and the pinned `tools/check-pr17-audit-identities.mjs` gate passed:

| Combined-tree measure | Verified result |
| --- | ---: |
| Athletes | 105 |
| Inspected clips | 2,397 |
| Source libraries / atlases / drawings | 42 / 570 / 5,489 |
| Derived-palette clips / original-authored clips | 1,827 / 570 |
| Inherited missing captain clips | 706 |
| Disclosed non-verbatim prompt findings | 40 |
| Frame target shortfalls | 0 |
| Exact identities preserved | 746 / 746 |
| Introduced, removed or duplicate audit findings | 0 / 0 / 0 |
| Strict art acceptance (`audit.ok`) | **false** |

Historical baseline source blob SHA pins are preserved in `PR17_AUDIT_EXPECTED_SIGNATURES.json`. The real-tree audit results confirm the prior scoped results, without requiring manual restoration of the 120 historical fixtures.

## Historical `14b5d774` object: separate unresolved maintenance issue

The prior attempt to replay the original historical PR #6 merge on a partial clone failed with `upload-pack: not our ref 14b5d774b41ff4a4602e52347bc2d7d10a155617`. The new verified workflow queried GitHub REST and still received HTTP **404** for that object; it queried `7fb06e8242ff4cbf1d8cca4d4bab390188eb021c` and received **200**.

Complete `git ls-tree -r` traversal of both the pinned PR #6 head and the current assembled PR #17 tree returned success and found **no direct blob-tree entry** for the absent `14b5d774` object in either tree. That does not establish the error's original internal cause, but shows it is **not required to materialize the current assembled integration head**. Do not synthesize the missing object or rewrite original Git history. Retain the original failed diagnostic in [MARIN_COMBINED_TEST_PROVENANCE_TRIAGE_2026-11-05.md](MARIN_COMBINED_TEST_PROVENANCE_TRIAGE_2026-11-05.md) for any later repository-object maintenance.

An independent separate full-checkout corroboration also predates this probe: [Pages PR verify run 42252954138](https://github.com/Manaconda33/Conda-Jam/actions/runs/42252954138) checked out all 55,021 files from PR #17's synthetic merge commit and passed 587/587 tests. Its merge commit tree and directly tested integration commit `da88109` have identical Git tree SHA `c8f86e04f88fb33d6f6e5743ee91c7b4ef01aaae`. The Pages deployment job was **skipped** for the pull-request event.

## Diagnostic correction transparency

The first workflow attempt [42262191686](https://github.com/Manaconda33/Conda-Jam/actions/runs/42262191686) had a **successful complete checkout** of 55,024 paths, but its test/audit gate failed because the new diagnostic omitted the ImageMagick `convert` program (`spawn convert ENOENT`). Its decoder-dependent audit misleadingly listed 2,397 `image-unreadable` entries. This was an ephemeral test-runner dependency mistake, not a proven asset failure. The single setup correction added the same ImageMagick dependency already installed by the repository's standard Pages workflow. The next run passed all full-suite and audit-identity gates without changing runtime code, animation assets, source fixtures or test assertions.

## Remaining HOLD gates

**Integration checkout/test gate: CLOSED, proven on real full tree.**

Still open: 706 inherited missing authored clips and 40 honestly disclosed prompt warnings; Marin Dusk normal-dribble hand-contact visual acceptance; Kraken receive source-art continuity; independent code review of renderer/donor integration; deliberate acceptance/regeneration of the still-stale checked-in historical `ASSET_AUDIT_LATEST.json/md` and `ASSET_STATUS.md`; and explicit user-approved dependency-aware merge sequence.

The previous historical PR6 merge-route object's 404 remains documented but is **not evidence that the assembled PR17 tree failed a full checkout**. Original PR #6, #7, #13, #16, `main`, and protected unpublished Myth assets were not changed.
