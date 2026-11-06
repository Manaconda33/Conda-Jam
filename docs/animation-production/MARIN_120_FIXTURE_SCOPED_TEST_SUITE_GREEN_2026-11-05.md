# Marin / Juniper: scoped full `npm test` suite GREEN

**Verified on 2026-11-05. Review-only evidence, NOT a merge, deployment, full non-sparse provenance acceptance, or independent visual-contact signoff.**

## What passed

[GitHub Actions run **42131202002**](https://github.com/Manaconda33/Conda-Jam/actions/runs/42131202002) concluded **success** for the diagnostic [`marin-onepass-full-tests.yml`](https://github.com/Manaconda33/Conda-Jam/blob/maintenance/pr6-pr7-reconciliation-probe/.github/workflows/marin-onepass-full-tests.yml). The final job's enforced `npm test` exit code was **0**. The uploaded native Node test runner log independently reports:

| Metric | Verified result |
| --- | ---: |
| Tests executed | **587** |
| Passed | **587** |
| Failed | **0** |
| Skipped / cancelled | **0 / 0** |
| Duration of test command | approximately 17.8 s |
| Hash-verified historical fixtures restored | **120 of 120** |
| Bytes restored for those fixtures | **39,776,140** |

**Evidence:** [GitHub Actions artifact 13463925766](https://github.com/Manaconda33/Conda-Jam/actions/runs/42131202002/artifacts/13463925766) contains `full-test.log`, `full-test.exit`, `provenance.txt`, and a JSON manifest of every restored fixture path and its verified Git blob SHA. Its lifetime is controlled by GitHub Actions retention.

Archive ZIP SHA-256: `6f9d0b64c81729fe90176c70acd6207f81388fe7db6e84013db3de1e3a9fc6b2`.
Full `npm test` log SHA-256: `5a606b5036b371a50c7ac677b2f1effb301293f4bc13930015ba07f14903896b`.
Verified fixture JSON manifest SHA-256: `d3124172ab3168134ac0cdad17517e1c713bc51decd526d8664511d047122027`.

## Immutable source and test provenance

- Main base commit: `7e700c0eb392800794167007e076c51ac8357a77`.
- Original PR #6 commit: `55a2ab104d6b108cc08132fddc01b32afb958e75`.
- Original PR #7 commit: `97119d54fd24c442c15192a798cae1e8a279eb1d`.
- Exact committed PR #16 Marin animation Git blob: `2b1413fce2582fd588f7df111bfb719e8605f046`; retains Juniper-specific 9 / 8 / 9 turbo-dribble controls.
- Exact committed strict Echo/Juniper migration test blob: `9456ffdcdf73f397c15a520b48f75a6cc91ca569`.

The diagnostic assembled PR #6 and PR #7 **only in the GitHub runner**; its two known conflicts were generated audit-status files provisionally selected from the PR #6 side for diagnostic purposes, not accepted or merged. It installed the exact saved PR #16 source and test blobs into that disposable checkout. The 120 historical fixtures came from the **specific PR #6 revision** and were each fetched from GitHub Git blob storage, checked for byte-length and verified using `git hash-object` before the test run. The workflow itself preserves the compressed path manifest so that the test can be repeated even after the artifact expires.

## How this resolves the previous failure series

The original scoped full-suite diagnostic failed on historical `tools/generate-art/` and provenance files absent from a deliberate sparse checkout, rather than on a demonstrated Marin source assertion failure. Five incremental waves restored 111 files but exposed further dependencies. A fixed corpus of 115, then 118, then 119, and finally **120** verified files brought the suite to **587/587**. No previously asserted gameplay expectations were weakened or disabled to produce the green run. The earlier red run logs remain linked in [the detailed test provenance triage](./MARIN_COMBINED_TEST_PROVENANCE_TRIAGE_2026-11-05.md).

## Still unwaived: required before merging

1. **Genuine full non-sparse historical checkout**: a prior attempt at [run 42108460440](https://github.com/Manaconda33/Conda-Jam/actions/runs/42108460440) could not hydrate a missing Git promisor object during local PR #6 merge. This green run uses all selected runtime/test/public asset paths plus specifically restored fixtures, not every historical repo object.
2. **Strict source-provenance / asset acceptance**: the previous report-only audit executed but classified the available game art catalog as `ok=false` (706 missing clip findings and 40 prompt-not-verbatim findings, zero inspected clip target-frame shortfalls). Those issues were not fixed, waived, or retested as part of this specific green test job.
3. **Independent pixel-level visual-contact review** and combined animation/provenance acceptance of rendered Marin/Juniper hand, release, ball, and court contact across facings and zooms.
4. **Explicit authorization and independent integration review** before any PR merge or deployment, including correct ordering across the dependent PR stack and any source audit conflicts.

**Disposition:** Scoped complete test command PASS. Overall integration **HOLD**. Keep diagnostic PR #13 and source-preservation PR #16 draft/unmerged. PRs #6 and #7, `main`, remote production art, and the protected unpublished Myth workspace were not modified.
