# Marin Dusk / PR #6 + PR #7: standard-suite and provenance triage, 2026-11-05

**Review-only diagnostic. The full non-sparse suite is NOT green or complete, and this report does NOT authorize merging PR #13, PR #16, PR #6 or PR #7.**

## Immutable inputs

- Published main: `7e700c0eb392800794167007e076c51ac8357a77`
- Published PR #6: `55a2ab104d6b108cc08132fddc01b32afb958e75`
- Published PR #7: `97119d54fd24c442c15192a798cae1e8a279eb1d`
- Exact PR #16 Marin corrected animation source Git blob: `2b1413fce2582fd588f7df111bfb719e8605f046`
- Exact PR #16 strict Echo/Juniper migration tests Git blob: `9456ffdcdf73f397c15a520b48f75a6cc91ca569`
- All checkout, source/test blob installation, audit generation and test fixture materialization were **local-only in GitHub Actions**. No published Git branch, game source, sprite atlas, PR #6/#7 head, `main`, deployment or unavailable Myth workspace was changed.

## Gate A: attempt a genuinely non-sparse historical checkout

[Run 42108460440](https://github.com/Manaconda33/Conda-Jam/actions/runs/42108460440) attempted to materialize the complete main tree (no sparse checkout) and integrate pinned PR #6 and PR #7. Main tree checkout succeeded, but merging PR #6 failed during Git's partial-clone promisor fetch with the following object errors:

- `fatal: remote error: upload-pack: not our ref 14b5d774b41ff4a4602e52347bc2d7d10a155617`
- `fatal: could not fetch 7fb06e8242ff4cbf1d8cca4d4bab390188eb021c from promisor remote`

GitHub REST's object API likewise returned **404** for the first identifier. Because the immutable checkout could not be assembled, **none of the full-checkout tests or audits ran in that attempt**. Do not characterize that failure as an animation regression; it is a repository-object availability / historical materialization blocker. Do not manufacture or replace unknown blobs to bypass it.

## Gate B: standard commands on pinned source, test and complete production runtime-asset paths

The proven source-and-runtime-asset checkout (not the full historical repository) includes all selected `src/`, `tests/`, `public/` and the required CLI scripts. It contains **925 physical production animation asset files (56,535,628 bytes)**. Its PR6+PR7 assembly uses the known two audit-report conflicts provisionally resolved *only in the runner*; those historical audit files were not accepted.

Source: [PR #13 diagnostic workflow `marin-full-suite-runtime-corpus-probe.yml`](https://github.com/Manaconda33/Conda-Jam/blob/maintenance/pr6-pr7-reconciliation-probe/.github/workflows/marin-full-suite-runtime-corpus-probe.yml).

[Run 42109116274](https://github.com/Manaconda33/Conda-Jam/actions/runs/42109116274) completed the complete `npm test` command but only **502/570 cases passed; 68 failed**, each with missing historical archive/source/report/provenance inputs. Lint, `validate:content`, `simulate:league` and isolated `build` each returned **exit 0**. No assertion failures were identified in those 68 failures. [Evidence artifact 13451824791](https://github.com/Manaconda33/Conda-Jam/actions/runs/42109116274/artifacts/13451824791).

### Exact pinned fixture-recovery experiments

A subsequent workflow change retrieves only paths reported as `ENOENT` under `tools/generate-art/` or `docs/LOSSLESS_ATLAS_PROVENANCE.json`. Every recovered file is fetched from the **exact original PR #6 commit**, then verified by `git hash-object` against its GitHub metadata blob SHA before being written to the **temporary runner**. No saved tests, game code or generated production artwork were altered.

- [Run 42109959117](https://github.com/Manaconda33/Conda-Jam/actions/runs/42109959117): first **58/58** missing fixture paths recovered, no unavailable blobs; standard `npm test` then **553 passed / 574 total**, **21 missing-file failures**.
- [Run 42110543688](https://github.com/Manaconda33/Conda-Jam/actions/runs/42110543688): first **58/58**, second **21/21**, total **79 hash-verified missing historical fixture files** recovered; standard `npm test` then **571 passed / 587 total**, **16 missing-file failures**. No assertions failed in this run. [Complete logs, two recovery manifests, full generated audit artifact 13453931269](https://github.com/Manaconda33/Conda-Jam/actions/runs/42110543688/artifacts/13453931269).
- All 79 recovered files existed at the published PR #6 commit. Recovery followed newly exposed chained dependencies, explaining why test registration/counts increased from 570 to 587 as additional fixture modules could initialize. **Do not interpret 571/587 as 98% of all eventual tests if still more historical modules could be enabled by additional fixtures.**

### Historical checkpoint: sixteen missing paths after wave two (all recovered in wave three)

```text
tools/generate-art/previews/j126-briar-foxglove-pass-overhead/native-120/report.json
tools/generate-art/previews/j127-briar-foxglove-pass-behind/native-120/report.json
tools/generate-art/previews/j128-briar-foxglove-receive/native-120/report.json
tools/generate-art/previews/marco-vellum-pass-behind/native-100/report.json
tools/generate-art/previews/marco-vellum-pass-overhead/native-100/report.json
tools/generate-art/previews/marco-vellum-pass/native-100/report.json
tools/generate-art/previews/marco-vellum-receive/native-100/report.json
tools/generate-art/previews/marco-vellum-shoot/native-100/report.json
tools/generate-art/sources/marco-vellum-pickup5.png
tools/generate-art/sources/marco-vellum-receive-attempt6-generated-raw.png
tools/generate-art/sources/marco-vellum-shoot-attempt7-clean-candidate-v2.png
tools/generate-art/piper-quickstep-pass-attempt2-edit-layouts.json
tools/generate-art/piper-quickstep-pass-behind-attempt1-layouts.json
tools/generate-art/piper-quickstep-pass-overhead-attempt2-edit-layouts.json
tools/generate-art/piper-quickstep-receive-attempt4-layouts.json
tools/generate-art/sources/j71-reed-ashcroft-dunk-scythe-attempt1-rejected-muddled-sweep.png
```

Archive identity checks for the latest diagnostic: artifact ZIP SHA-256 `8830e83a4e971d8d245a8e3c9eef433840fe00c632e57bc1423f2b5189dd8f81`; third full-test log SHA-256 `c2ad0d9d51eb3df56d2aeb490125e9224bcf072b6981711e36772de2b7040907`; report-only audit JSON SHA-256 `4af1dc9d571eab73ddbed0bbde5a6516ac20dd551180c16191414c76a28ad395`.

## Third bounded fixture recovery: original sixteen resolved, eleven newly exposed

The next diagnostic commit **`f2aec04295e6e3f50ba1c4a4a9364f88081c72ba`** adds a third narrowly scoped fixture-recovery step to the isolated workflow on PR #13. It uses the same pinned PR #6 metadata, permits only `tools/generate-art/` historical artifacts and the specifically authorized provenance document, downloads the exact blob, and verifies each byte stream with `git hash-object` **before writing to temporary runner storage**. Game source and tests remain unchanged.

- [Third recovery Actions run 42114465183](https://github.com/Manaconda33/Conda-Jam/actions/runs/42114465183): **16/16** new missing fixtures recovered, **0 unavailable**. Total recovered across three passes: **58 + 21 + 16 = 95 distinct observed dependencies**.
- Final standard `npm test` on the scoped production-runtime-asset checkout: **576 passed, 11 failed, 587 executed, zero skipped/cancelled**. All eleven remaining failures were `ENOENT` for additional archived fixture paths. No assertion failures were identified in the last captured log. The full suite **remains red**, and its total number of runnable tests could still increase as historical source files become accessible.
- [Versioned CI artifact 13456175254](https://github.com/Manaconda33/Conda-Jam/actions/runs/42114465183/artifacts/13456175254) contains all four full-test outputs, three per-wave recovery manifests, exact source/test pins, and the regenerated pixel-audit JSON. Artifact ZIP SHA-256: `0f0264f2df8e44f6428f6c32884722c3a922c64876cf761da75024fe48b53474`. Final test log SHA-256: `8c4c65ded1507b1881620bb2412fbc16743932dd1b2b3f1a17104cfc556efccb`; third hydration manifest SHA-256: `2eecbb16832c563a8c34d5f915e424e6fdef6294d752c32539190828309555ea`.
- Syntax lint, content verification, league simulation, and isolated build all returned **0**. Report-only production pixel-audit execution also returned **0**, but audit status remains `ok=false` with **706 missing clips and 40 non-verbatim prompts**, unchanged. Audit JSON SHA-256 from this run: `24305f97abfddb5a2130ab5553238e565f2a741b5ad2d848aac1abc1e0ce6859`.

### Eleven currently missing historical test fixtures

```text
tools/generate-art/previews/marco-vellum-pass-behind/native-120/report.json
tools/generate-art/previews/marco-vellum-pass-overhead/native-120/report.json
tools/generate-art/previews/marco-vellum-pass/native-120/report.json
tools/generate-art/previews/marco-vellum-receive/native-120/report.json
tools/generate-art/previews/marco-vellum-shoot/native-120/report.json
tools/generate-art/sources/marco-vellum-receive-attempt6-clean-candidate.png
tools/generate-art/j71-reed-ashcroft-dunk-scythe-retry-prompt.md
tools/generate-art/previews/piper-quickstep-pass-behind/native-review.json
tools/generate-art/previews/piper-quickstep-pass-overhead/native-review.json
tools/generate-art/previews/piper-quickstep-pass/native-review.json
tools/generate-art/previews/piper-quickstep-receive/native-review.json
```

The eleven paths include both absolute working-directory paths and project-relative file references in the original Node.js `ENOENT` logs. The next bounded pass should restore and hash-verify exactly these paths from pinned PR #6, then rerun tests. **No fixture should be manufactured from a missing image or report.**

## Source-pixel and provenance audit, run-to-run stable

The scoped diagnostics regenerated audit from the entire available `public/assets/animation` production sprite corpus:

| Metric | Regenerated value |
|---|---:|
| Canonical athletes | 105 |
| Existing inspected clips | 2,397 |
| Unique source atlases | 570 |
| Decoded unique source drawings | 5,489 |
| Missing clip entries | **706** |
| Non-verbatim prompt findings | **40** |
| Target-frame shortfalls among inspected clips | **0** |
| Total audit findings | **746** |
| Audit `ok` | **false: incomplete** |

A zero command exit from `--report-only` means the audit **executed**, not that the asset corpus passed strict acceptance. These inherited 706 missing clips and 40 prompt findings remain unwaived. Do not overwrite accepted audit reports or assert completion merely because the values match a previous diagnostic.

## Disposition and bounded next action

- **Completed and recorded:** Core Marin Echo and Juniper strict regressions, 9/8/9 full bounce, live transitions, both-facing visual triage, actual normal-dribble floor bounce, four catch mechanics, normal build, lint, roster and league checks. These prior scoped validations remain green.
- **Still RED:** Overall repository `npm test` on scoped checkout, with **11 missing historical fixture dependencies** after three recovery waves. Execute a bounded fourth fixture recovery and rerun, preserving the baseline failure log; never weaken assertions, synthesize image content, or skip unavailable test cases.
- **Still BLOCKED:** True full non-sparse checkout until the missing historic Git object can be retrieved/repaired through a legitimate repository maintenance path.
- **Still INCOMPLETE:** strict full source-provenance audit with 706 missing clip and 40 prompt findings; independent pixel-level artwork contact review; combined integration/provenance acceptance.
- **Absolutely no merges or deployments** until source/provenance, tests and independent acceptance are reconciled and explicit user authorization is given. Draft PR #13 remains diagnostic; draft PR #16 remains code preservation. Original PR #6/#7 and unpublished Myth workspace remain unchanged.
