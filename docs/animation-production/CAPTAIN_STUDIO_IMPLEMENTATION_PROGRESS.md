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

## Audit schema correction and continued infrastructure

PR10 review comment 6502961040 identified that targetShortfalls is an array of structured findings in strict JSON, not the CLI count. The comparator now validates that schema, hashes exact shortfall details with multiplicity, normalizes their order, and rejects missing-count/context mismatches. A provenance-linked fixture extracted from the actual Kraken audit retains all 706 directional gaps and four inherited prompt findings. Unchanged real JSON accepts itself; changed shortfall details at equal count are rejected. The original count-based tests were insufficient.

Independent review also identified missing directional context validation; a failing regression now covers it. Continued infrastructure adds a read-only resource profiler (measured bytes/files and explicit reserve; no production caps committed) and trusted-coordinator review-request checks. The latter bind dispatch evidence to a hash of the exact nonce, digests and scope, and reject malformed replay ledgers. These are auditable orchestration records, not cryptographic identity. Persistent review ledger, human-review fallback, package schema/validator and atomic consumption are still pending.

Local verification commands:

- node --test tests/captain-studio-*.test.js (in sparse infrastructure worktree): four files pass.
- node --test tests/*.test.js tests/integration/*.test.js /workspace/captain-studio-infra/tests/captain-studio-package.test.js /workspace/captain-studio-infra/tests/captain-studio-baseline.test.js (in existing full captain checkout): 91/91 files pass after audit fix.
- node --test tests/*.test.js tests/integration/*.test.js /workspace/captain-studio-infra/tests/captain-studio-*.test.js (same full checkout plus four infrastructure files): 93/93 pass after final review-dispatch fixes. This is local source/foundation evidence, not reconciled-candidate acceptance or remote Actions verification.

## Complete readable scratch candidate

A local-only sparse validation view at /workspace/captain-studio-reconciliation materializes source, runtime atlases, tests and tooling from the combined Git tree. Only tools/generate-art is referenced through an absolute validation-only directory link to the existing full captain checkout. Both Git source/evidence subtree hashes are exactly 33f0c6e1b813bc620ccb6db14373352af2c57be2; the original tracked subtree is clean. This avoids duplicating 7.0 GiB, leaving approximately 5.0 GiB free after materialization. The link is not a contribution, must never be staged/promoted, and no source-cleanup or generation command is allowed through it. All source/art validation must verify readable bytes and preserve originals. No Git tree-only check is claimed as visual acceptance.

Actual candidate strict audit completed: 706 missing assignments,40 inherited prompt findings,zero target shortfalls. Comparing to PR7's full audit with the corrected comparator yields zero added findings and72 resolved missing entries (PR7 had778). The higher prompt count than the captain-only reference is inherited from PR7, not suppressed.

Independent static reconciliation review proves candidate runtime atlas and source/evidence trees, core animation, generated registry and mirror policy match PR6; all seven donor mappings/profiles/palette implementation and donor manifest entries match PR7. Renderer retains both implementations. Status aggregates remain to be reconciled to the actual candidate audit.

Candidate lint (24 modules), content validation and build pass. Initial candidate suite:87/90 pass. One failure was the sparse view omitting docs/LOSSLESS_ATLAS_PROVENANCE.json; materializing its exact Git blob makes that test pass. Two remaining failures require diagnosis before candidate acceptance: supporting lead-hand assertion for Marin's dribble and Marin-to-Kraken receive continuity (x correction about -4.64545). These are not failures in the reported 93-file source/foundation run; that run uses the existing captain baseline. Full combined candidate, visual/gameplay acceptance, production baseline pinning and track migration remain gated.

Independent diagnosis of candidate failures: PR6's late Marin receive/idle assignment replaced her entire earlier track record, erasing own dribble overrides. Echo's fallback masked this; PR7's Juniper donor has no locomotion-forward track, exposing generic default1.5. The local-only scratch candidate now merges receive/idle overrides into the retained Marin record; the existing animation test passes. This proposed reconciliation change is not promoted into any production branch.

The remaining pass/catch issue is distinct: Marin's donor pass release changes from Echo forward21.590909/height1.81818 to Juniper forward17.045455/height1.70455 at tick5. Kraken's incoming catch was calibrated for the earlier release. It produces an approximately4.64545px correction in the actual combined interaction. Do not weaken the test or transplant Echo's art track solely to make it pass; donor-aligned calibration and rendered gameplay review are required before accepting the combined baseline. Candidate remains unaccepted, and registry migration has not started.

## Marin-to-Kraken reconciliation correction and candidate validation

In the isolated reconciliation worktree only, Marin now has a separate pass track calibrated for the Juniper-derived animation and the existing Kraken receive track. The release pose keeps the previous donor-scaled track except at the release point, adjusted to forward21.590909 and height1.815909; this places the incoming ball at Kraken's existing frame2 hand point on the tick4 grab. The focused `kraken-receive.integration.test.js` passes both facings with the original x/z snap tolerances, receive timing, Kraken artwork, and Kraken track intact. No artwork was changed. This calibration has not been independently visually inspected as a player-specific rendered capture.

Combined-candidate checks pass: 90/90 `npm test` files, lint24 modules, content validation (35 franchises / 105 athletes / 35 captains), static standalone build, and Chromium E2E smoke. The E2E smoke covers game journeys and the offline standalone file but does not script the Marin/Kraken matchup; the focused test exercises that interaction through simulation and registered sprite selection. Strict audit: 2,397 inspected clips,42 source libraries,570 source atlases,5,489 source drawings,706 missing assignments,40 inherited prompt findings,zero frame shortfalls. Full-detail comparison with PR7: zero added findings,72 missing assignments resolved. Candidate status and refreshed audit live only in the local reconciliation worktree; no merge, publication, or baseline acceptance occurred.

## Captain package collector implementation on infrastructure branch

Added `tools/captain-studio/collect-worker-diff.mjs` and `tests/captain-studio-collector.test.js`. The collector requires a clean checkout at the exact worker commit and the pinned base as an ancestor; it rejects merge commits, modifications to any base file, historical deletions, out-of-scope paths, wrong or missing assigned atlas pairs, extension duplicates against the base, path case/Unicode collisions, unsafe modes, LFS pointers at every changed commit, and files over64MiB before loading their bytes. It returns each final changed blob with Git mode/object ID, SHA-256, size, and coordinator-derived disposition; package metadata does not establish its own allowlist.

The collector suite has seven tests, including multi-commit success, historical transient symlink/LFS rejection, changed base and deleted rejected evidence rejection, merge rejection, dirty/mismatched checkout, incomplete assignment, path collisions, logical atlas occupancy across extensions, and oversized blob rejection. All 26 focused captain-studio tests pass; syntax checks, infrastructure lint, and `git diff --check` pass. Independent review found the history, size, HEAD, merge-test, and cross-extension risks; those were corrected and covered by regression tests. Package schema validation, evidence-to-inventory equality, exporter, and append-only ledger remain incomplete. The collector does not authorize or implement the pilot.

## Append-only package ledger foundation

Added `tools/captain-studio/package-ledger.mjs` and `tests/captain-studio-ledger.test.js`. The ledger validates strict canonical JSONL entries, unique event/package IDs, captured Git object IDs/types and content hashes, safe relative evidence references, accepted/quarantined/rejected reason requirements, and path/alias collisions. An accepted entry must reference a hashed review-evidence file and contain a runtime atlas. It confines writes to a caller-specified trusted root, refuses corrupted prior lines and symlinked paths, and appends without rewriting earlier bytes under an exclusive lock. Entries are sidecar activity records and are not inputs to deterministic integration-tree hashes. After a crash, the adjacent lock records PID and host; operators must confirm the recorded process is gone and no coordinator is writing before removing a stale lock. This append helper follows the plan's single-writer coordinator model; it is not a transactional multi-writer database.

Final independent review of the collector and ledger found no remaining material issues after the documented corrections. The complete infrastructure-focused suite now passes 30/30 tests; syntax checks and lint pass, and `git diff --check` is clean. Browser E2E was run on the full combined candidate, not on this sparse infrastructure worktree.
