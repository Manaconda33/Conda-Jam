# Parallel Captain Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Keep the architecture and production gates below active.

**Goal:** Safely package, validate, and integrate bespoke animation contributions for incomplete non-Kraken captains. Prepare, but **do not start**, a bounded 6-8-lane pilot until the already authorized infrastructure has been reviewed on the current merged base and the owner separately authorizes pilot activation.

**Architecture:** Workers submit one immutable Git package per captain from one pinned base. A fail-closed validator checks the package and its visual/gameplay evidence; a single writer applies an accepted batch to temporary manifest and track data, generates runtime registries once, verifies the strict audit, and promotes one Git commit with an expected-old-SHA ref update.

**Tech Stack:** Node.js ES modules, Git, JSON manifests, existing `tools/animation-assets.mjs` decoder/auditor, current browser/Jam Stage capture harnesses, npm scripts.

**Spec:** `docs/superpowers/specs/2026-10-29-captain-studio-design.md`

## Current repository checkpoint (November 6, 2026)

- **Historic integration completed:** [PR #17](https://github.com/Manaconda33/Conda-Jam/pull/17) merged into [PR #6](https://github.com/Manaconda33/Conda-Jam/pull/6), which merged into `main` at `3a25c24c9e9ef5e3341dca52d61df0b4263d3172`. The current documentation-only `main` head at this review is `e9ccf5bdc6c17dd2cdf868c434fa3f28d6919097`, after the [PR #13 diagnostic archive](https://github.com/Manaconda33/Conda-Jam/blob/main/docs/animation-production/PR13_DIAGNOSTIC_ARCHIVE_2026-11-06.md). Re-read/pin the latest SHA at actual baseline selection. Do not replay PR #6/#7.
- **Provenance/coverage:** Final combined CI [42272204285](https://github.com/Manaconda33/Conda-Jam/actions/runs/42272204285) passed 588/588 tests, and the [main-targeted PR #6 check](https://github.com/Manaconda33/Conda-Jam/actions/runs/42274091954) passed. Current strict audit remains `ok=false`: **706 missing bespoke captain clips, 40 disclosed historical non-verbatim prompt findings, 0 frame shortfalls, 746 inherited findings**. These were approved only as a transparent carry-forward backlog for the completed merge; no visual/art completion is implied.
- **Still unreviewed/unmerged infrastructure:** [PR #10](https://github.com/Manaconda33/Conda-Jam/pull/10) already implements a proposed generated track registry, package validator/collector/exporter and deterministic integrator on an isolated draft branch. [PR #11](https://github.com/Manaconda33/Conda-Jam/pull/11) implements the owner-approved rejected-only cleanup rule as a draft child of #10. Neither is production-approved or automatically current with the new `main` baseline.
- **Unresolved visual exceptions:** [Marin #18](https://github.com/Manaconda33/Conda-Jam/issues/18) and [Kraken #19](https://github.com/Manaconda33/Conda-Jam/issues/19) were accepted only for the previous merge, not visually fixed; the original Myth-only workspace/pinned unpublished composite remains protected. No new lane, pilot, merge, deploy or production-ref promotion is authorized by this plan.

## Global Constraints

- The original PR #6 head `55a2ab104d6b108cc08132fddc01b32afb958e75` is **historical**. PR #6 and the reconciled PR #7 donor source are on `main`; the future Captain Studio production base must be freshly pinned and approved after PR #10/#11 infrastructure review. Do not substitute the protected unpublished Myth composite with `main` without verified reconciliation.
- Isolated infrastructure implementation on PR #10 and rejected-only policy implementation on PR #11 already occurred with earlier authorization; **those drafts remain unmerged and require fresh technical review, tests and separate owner merge approval**. PR #9 only updates documentation. Do not start new captain sessions, the 6-8-lane pilot, deploy or promote any production ref without explicit future permission.
- Keep Kraken excluded; preserve all accepted art, original prompts/generation/source and packing lineage, active/HOLD and required gameplay review evidence. Apply the owner-approved October 30 exception only to **unreferenced, never-used rejected-only images/edit outputs/previews and unavailable exact rejected-only prompts**, after verifying no accepted-art dependency and retaining truthful compact rejection summaries and measured cleanup results.
- All 35 captains remain individually authored. Never use a support-player donor, shared palette variant, or another captain's artwork.
- Captain workers may not edit `public/assets/animation/manifest.json`, `src/content/animation-assets.js`, `src/content/animation-ball-tracks.js`, `src/core/animation.js`, shared render/simulation code, team/roster files, global audit summaries, CI, or another captain's files.
- Preserve `tools/generate-art/review-j106-keeg-alley-oop-pose.py` byte-for-byte.
- One captain owner per assignment; all packages in a batch share one pinned base SHA; only one package per captain per batch.
- A captain is complete only after all 29 actions and required facings are accepted, registered, audited, gameplay-verified, and independently reviewed across the whole set.
- Independent agent reviews under one GitHub login require a coordinator-issued review request plus a separately dispatched, uniquely identified reviewer session/task and digest-bound evidence; free-text reviewer names and GitHub login alone are insufficient. Record that orchestration evidence is auditable but not cryptographic authentication. If no separate stable session evidence exists, require an external reviewer with a distinct GitHub identity or quarantine the package.
- New source without a required ImageGen ID is quarantined, never fabricated or grandfathered; preserve its exact prompt/tool response/source hash and ask the user whether to authorize an explicit exception only after the documented retry path fails.
- Do not claim throughput improvements from concurrency without measured accepted-package data.

## Review Focus

- A package whose `baseCommit` matches but whose captain subtree or support dependencies changed must be rejected by expected-state hashes.
- Package paths with traversal, absolute paths, symlinks, case-fold collisions, or duplicate runtime asset paths must never escape the staging root or overwrite accepted assets.
- A package with valid JSON but missing **material accepted-art** source/raw/prompt lineage, authentic required generation ID, independent review, or normal-loader evidence must not activate. Missing unused rejected-only binaries/prompts are allowed only if dependency checks passed, no dangling references remain, and compact rejection evidence is truthful.
- A new **accepted/material art** generation without an exposed ID must be quarantined with its prompt/tool response/source hash; never fabricate an ID or claim it as legacy. After the verified retry route fails, ask for a specific owner exception or alternate source before export/integration. Unreferenced discarded-only rejections must not masquerade as accepted art or make unsupported source/provenance claims.
- A technically complete atlas with missing action anchors, bad facing/mirror behavior, or an unrelated ball track must not be counted accepted.
- An interrupted integration must leave the integration ref on its old SHA; valid packages in a wave must remain usable when another package is rejected, with rejected packages re-based and re-reviewed.
- A valid manifest cannot hide a forbidden worker-commit change; every commit and the complete tree diff must pass the captain path/mode allowlist.
- Independent artwork approval must bind to an immutable artwork digest computed before review; the final package digest is computed afterward and includes that approval/evidence without being referenced by it.
- Re-running an identical batch under a different clock or with additional activity-log entries must produce the identical Git tree; volatile audit metadata and logs stay outside that tree.

---

### Task 1: Pin a fresh post-merge Captain Studio baseline (do not re-merge PR #6/#7)

**Status:** The earlier PR #6/#7 scratch reconciliation and separate merge-authorization steps are **completed historical work**. The original Oct 29 PR #6 head is not a production base. Pin and independently verify the *current* integrated `main` as the starting candidate, and do not activate production until the separate Studio prerequisites and approvals pass.

**Files:**
- Create/update after Studio baseline acceptance: `docs/animation-production/CAPTAIN_STUDIO_BASELINE.json` and `docs/animation-production/CAPTAIN_GAP_MATRIX.csv`.
- Create from measured constraints: `tools/captain-studio/resource-limits.json`.
- Inspect or expand draft PR #10's `tools/captain-studio/profile-baseline.mjs`, `tools/captain-studio/compare-audits.mjs`, and `tests/captain-studio-baseline.test.js`; do not reimplement blindly.
- Regenerate and compare from the exact candidate base: `docs/animation-production/ASSET_AUDIT_LATEST.json`, `.md`, and truthful status/history. Preserve `HANDOFF.md`, `docs/SESSION_HANDOFF.md`, and `docs/animation-production/ASSET_STATUS.md`; do not erase historical or owner-accepted findings.

- [x] **Historical prerequisite: PR #6/#7 integration completed.** PR #17 was merged into PR #6, and PR #6 merged into `main`; 588-test candidate, final main-targeted verification and post-merge preview passed. PR #7 was closed as superseded rather than merged separately. Do not replay those old PR heads.
- [ ] **Step 1: Pin the actual current integrated base.** Re-read `main` SHA at execution (as of this review `e9ccf5bdc6c17dd2cdf868c434fa3f28d6919097`); record Git tree, manifest, roster, runtime/track/donor-map blobs, mirror policy, full raw audit, normalized finding-set fingerprints and source-art evidence. Keep coordinator working tree clean and preserve Myth's separate unpublished base.
- [ ] **Step 2: Verify canonical integrated coverage, hashes and protected exclusions.** Require 35 captains/105 athletes, Kraken 29/29 accepted and excluded, 70 support athletes correctly mapped to seven original donor families, exact registered atlas/track selection, and no accepted art changes. Preserve original PR #6/#7 provenance as historical input; no new simulated scratch merge is needed.
- [ ] **Step 3: Refresh strict audit on the exact pinned candidate.** Run the report-only audit into review outputs, compare complete canonical error signatures and direction-level gaps to the authoritative combined reports. Current reference is **706 missing captain clips, 40 non-verbatim historical prompt disclosures, 0 frame shortfalls and 746 inherited findings**; `ok=false` is expected until the art backlog is actually resolved. Investigate any new/unexplained finding or increased gap. Only genuine, independently accepted source evidence may resolve specific recorded missing entries.
- [ ] **Step 4: Generate exact gap matrix and Studio candidate sheet.** Store every missing `(captainId,direction,clip)` against the pinned baseline; do not infer missing directions only from a summarized count. Exclude Kraken and all 29/29 complete captains. Record per-captain original accepted clips, mirror safety and outstanding review/provenance obligations.
- [ ] **Step 5: Reconcile existing draft infrastructure against the newly pinned source.** Independently inspect PR #10 registry migration, package/export/collector/integrator, normalized audit, resource/track tests, same-filesystem staging and baseline assumptions. Inspect PR #11's rejected-only cleanup policy and schema/validator changes. Require no gameplay/track changes outside reviewed migration parity, and do not treat draft code or old successful CI as current source acceptance.
- [ ] **Step 6: Profile resource limits.** Set `maxBatchPackages=8`, `maxDecodedPixelsPerImage=64000000`, `maxInputFileBytes=67108864`; derive per-package file/byte caps from 125% of the largest measured complete accepted captain evidence bundle, rounded up to MiB. Set batch-byte cap no higher than available workspace after build/checkout reserve and protect the active Myth worktree. Do not silently increase caps.
- [ ] **Step 7: Revalidate integrated candidate and record accepted baseline.** On the future Studio-ready source, run full tests, lint, content, league, strict audit comparison, build and native registered-loader visual/gameplay checks. Record exact accepted Studio baseline SHA, audit and gap matrix only after required independent review and separate owner permission to integrate the infrastructure. Passing tests cannot mark the inherited 706/40 or issues #18/#19 as artistically resolved.
- [ ] **Step 8: Hold activation until authorized.** Do not assign captains, create new worker branches/packages or launch the 6-8-lane pilot from this plan. The original Myth-only lane and local published/unpublished evidence remain protected; obtain new explicit owner authorization after this baseline and the infrastructure have been accepted.

**Gate:** Stop if main-base hashes or complete finding identities drift unexpectedly, an accepted asset/evidence source is missing, support/captain semantics change, PR #10/#11 fail fresh review, storage limits cannot be met, or Myth's protected workspace could be disturbed. A current passing engine build with strict audit `ok=false` is not full captain-art acceptance.

### Task 2: Independently review and integrate the proposed generated track registry (PR #10 is draft, not on main)

**Files:**
- Create: `src/content/animation-ball-tracks.js`.
- Create fixture: `tests/fixtures/animation/ball-track-runtime-baseline.json`.
- Create fixture: `tests/fixtures/animation/tracked-action-runtime-baseline.json`.
- Modify: `src/core/animation.js` to import the registry and remove only inline track data definitions.
- Create: `tools/register-animation-ball-tracks.mjs` for deterministic serialization.
- Test: `tests/animation-ball-tracks-parity.test.js`.
- Test: `tests/captain-track-integration.test.js` and `tests/animation.test.js`.

- [ ] **Step 1: Re-pin current before-migration fixtures from post-PR6/PR17 `main`.** Use public `athleteBallTrackSource`, `sampleBallHeight`, `sampleBallForward`, `sampleBallReleaseVz` and `animationClips` over every athlete/clip at each integer tick, loop boundary, duration and endpoint. Include **seven-family support donor fallback and Marin's reviewed Juniper 9/8/9 behavior**, owner precedence, release/catch/scoring anchors and mirrored selector decisions. Compare with draft PR #10's existing fixtures before modifying code; it was built on an earlier source.
- [ ] **Step 2: Add a generated registry with the exact data shape.** Export `athleteBallTracks` and a companion `athleteBallTrackProvenance` map as plain JSON-compatible data; preserve all keys, vectors, tick arrays, release velocities, and provenance. Keep the existing donor fallback lookup via `supportingAnimationLibraries[athleteId].ballTrackSource` in `src/core/animation.js` unchanged.
- [ ] **Step 3: Add deterministic registry writer.** Implement `renderBallTrackRegistry(data) -> string` and `writeBallTrackRegistry(data, outputPath) -> Promise<void>`; sort newly supplied captain/clip keys without reordering or altering baseline values, write via same-directory temp file and rename.
- [ ] **Step 4: Switch `src/core/animation.js` to imported track data.** Keep exported selectors and `sampleBallHeight`, `sampleBallForward`, `sampleBallReleaseVz`, ownership and facing behavior unchanged.
- [ ] **Step 5: Verify exact track/action parity.** Run `node --test tests/animation-ball-tracks-parity.test.js tests/captain-track-integration.test.js tests/animation.test.js`; require exact equality for every athlete/clip/tick, own-track-over-donor and donor-over-default precedence, track scale, durations, loops, and anchors.
- [ ] **Step 6: Verify normal-loader camera/scoring/facing parity.** Compare pre/post fixture traces for tracked gameplay events (shot, pass/receive, pickup, rebound, layup, dunk/alley-oop, fall/recovery) in both facings, including frame selection, attached/free ball coordinates, possession owner, release/catch/grab/score ticks, camera target/zoom, scoreboard, and recovery state. Require exact equality except timestamps/image encoders.
- [ ] **Step 7: Run all existing track-sensitive tests.** Run `npm test`; review any fixture that assumed inline storage without changing runtime behavior.
- [ ] **Step 8: Review PR #10's existing isolated infrastructure against the fresh base.** Do not create duplicate code merely because this historical checklist said `Create`. Require parity/normal-loader evidence and full-stack validation, then seek separate owner merge authorization. The presence of generated track files on PR #10 does not make them available on `main`.

### Task 3: Define and validate captain package schema

**Files:**
- Create: `tools/captain-studio/package-schema.json`.
- Create: `tools/captain-studio/canonical-json.mjs`.
- Create: `tools/captain-studio/package-hash.mjs`.
- Create: `tools/captain-studio/validate-package.mjs`.
- Create: `tools/captain-studio/review-requests.mjs`.
- Test: `tests/captain-studio-package.test.js`.

**Interfaces:**
- `canonicalJson(value: unknown): string` recursively sorts object keys, preserves array order, rejects non-JSON values, and emits UTF-8 JSON with no insignificant whitespace.
- `computeArtworkDigest({ artworkInventory }): string` hashes canonical sorted assignments, source/runtime artwork paths and byte hashes, source-to-packed lineage, and layout/cell geometry before any artwork review request is issued.
- `computeTrackDigest({ trackInventory }): string` hashes canonical sorted per-clip ball tracks and action anchors before gameplay/track review.
- `computePackageDigest({ manifest, files }): string` runs only after approvals/evidence are frozen; it hashes canonical manifest with `packageId` omitted (including `artworkDigest`, `trackDigest`, and approval records) followed by sorted path/SHA-256 pairs for all other package and runtime asset files.
- `validatePackage({ packageRoot, baseRoot, baseCommit, baseline }): Promise<{ok:boolean, packageId:string, captainId:string, updates:Update[], errors:Issue[]}>` is read-only and returns stable reason codes.

- [ ] **Step 1: Review schema fixtures for accepted/material evidence and rejected-only exceptions.** Include a valid one-captain package, multiple captains, schema mismatch, missing accepted/material trial/raw/prompt/ID, absent independent review, owner self-approval, missing full-29 review, invalid state/dependency, and a **permitted unreferenced rejected-only summary without binary/prompt**. New accepted art missing its authentic generation ID must quarantine; do not weaken accepted-art requirements.
- [ ] **Step 2: Test artwork digest and review-request order.** Freeze artwork inputs and compute the artwork digest before issuing the one-use review nonce. Bind the request, reviewer dispatch/session, report, and captures to that artwork digest and scope, never to a not-yet-computed final package digest. Reject missing/reused nonce, same worker/reviewer session, mismatched digest, free-text-only identity, fabricated session ID, absent dispatch record, or artwork mutation after approval. Permit the same GitHub login only with independently dispatched distinct reviewer-session evidence and evidence hashes. State that this is auditable session separation, not cryptographic identity; if stable session/task evidence is absent, require a distinct human GitHub reviewer or quarantine.
- [ ] **Step 3: Test final package digest ordering.** After artwork/track approvals and all package evidence are frozen, compute `packageId` including the approval and evidence hashes. Verify approval/evidence do not contain or depend on `packageId`; changing artwork invalidates the artwork approval, changing track inputs invalidates gameplay review, and changing approval/evidence changes the final package digest without changing frozen artwork/track digests.
- [ ] **Step 4: Test new-source ID quarantine.** Verify an absent generation ID is never synthesized or treated as legacy; package state is `quarantined`, with exact prompt/tool response/time/raw hash/retry history retained, and it cannot export/integrate. Existing baseline metadata remains unchanged.
- [ ] **Step 5: Test path and hash rejection.** Cover `..`, absolute paths, symlink, path normalization/case collisions, missing files, altered asset/evidence hashes, artwork digest mismatch, final package digest mismatch, duplicate asset paths, protected-helper modification, and invalid Git modes/object types.
- [ ] **Step 6: Implement canonical JSON and both digests.** Fix each digest's ordered inputs exactly as the design specifies, normalize LF, preserve array order, and ensure deterministic results regardless of input object key order.
- [ ] **Step 7: Review the existing PR #10/#11 package and reviewer validator before merging.** Enforce one captain, only missing base clips, no overwrites, exact accepted/material source and review evidence, truthful compact discarded-only rejection summaries, coordinator-issued artwork-digest review separate from the worker, digest verification after evidence freeze, baseline/mirror-policy hashes, timing/anchor structure and safe paths.
- [ ] **Step 8: Run `node --test tests/captain-studio-package.test.js`.** Require all negative fixtures to fail with expected stable reason codes and the valid fixture to pass.
- [ ] **Step 9: Verify read-only behavior.** Hash all files under the fixture base before/after validation and assert byte equality.

### Task 4: Create the captain package exporter and package ledger

**Files:**
- Create: `tools/export-captain-package.mjs`.
- Create: `tools/captain-studio/export-package.mjs`.
- Create: `tools/captain-studio/collect-worker-diff.mjs`.
- Create: `tools/captain-studio/package-ledger.mjs`.
- Create fixtures under: `tests/fixtures/captain-studio/packages/`.
- Test: `tests/captain-studio-export.test.js`.
- Test: `tests/captain-studio-collector.test.js`.

**Interface:**
- `collectCaptainContribution({ repositoryRoot, baseCommit, workerCommit, captainId, assignment }): Promise<ContributionInventory>` verifies the full worker commit history and tree diff using Git objects/modes, and returns every changed path/blob/hash/disposition or stable rejection codes. Require the exact pinned base to be an ancestor; reject merge commits.
- `exportCaptainPackage({ baseRoot, contributionRoot, captainId, baseCommit, workerCommit, assignment, outputRoot }): Promise<PackageSummary>` creates only `tools/generate-art/studio/<captainId>/package.json` and metadata; references captain-unique atlases in `public/assets/animation/` without copying the atlas a second time.

- [ ] **Step 1: Review exporter tests.** Verify namespaced output, one captain, all assigned missing clips/directions, accepted base clips excluded, **exact accepted/material prompt/source lineage**, truthful omitted rejected-only summaries, track and independent review evidence, and reproducible package digests.
- [ ] **Step 2: Test full worker-history collection.** A two-commit additive contribution must pass. Reject hidden unrelated changes, edits/deletions of accepted art, deletion of any protected baseline or required evidence (including accepted/material review files), symlink/submodule/executable/LFS pointer, case collisions and hidden paths. Owner-approved unused rejected-only cleanup happens in a **separate dependency-checked coordinator/workspace-retirement operation**, not as an arbitrary worker commit deleting base files; a package may omit already-discarded unused rejected-only files.
- [ ] **Step 3: Review the draft full Git object collector.** Verify complete commit and tree diffs, allowed regular additive captain-scoped files and original missing-clip atlases, raw Git modes/sizes/hashes/ancestry and collision checks. Reject forbidden modifications/deletions/renames, executable modes, symlinks (`120000`), submodules (`160000`), unreviewed LFS pointers, unreferenced or hidden paths and protected-helper changes. Never treat absent *unreferenced rejected-only* binaries/prompts as required package files, but never allow deletion of protected baseline art, material sources or review evidence from worker history.
- [ ] **Step 4: Add stable append-only package ledger.** Record package ID, captain, base/worker commits, timestamp, full diff path/mode/object/hash inventory, accepted/quarantined/rejected state, reviewer request/evidence references, and reason codes without rewriting prior entries.
- [ ] **Step 5: Verify the draft exporter against collected inventory.** Manifest declarations do not determine allowed paths. Require complete **retained accepted/material** raw source, exact prompt and lineage, tracks and independent review evidence within the captain scope; rejected-only never-used attempts may be compactly summarized without dangling file references following dependency checks. Compare all collected changed paths with declared retained additions/evidence. Quarantine new accepted-art source lacking an authentic ID; ask for a specific owner exception or alternate source only after the verified retry route fails.
- [ ] **Step 6: Run collector/export fixture tests.** Run `node --test tests/captain-studio-collector.test.js tests/captain-studio-export.test.js`; verify collection/export does not change the worker commit or source tree and no undeclared path enters the package.

### Task 5: Implement deterministic batch validation and integration

**Files:**
- Create: `tools/integrate-captain-packages.mjs`.
- Create: `tools/captain-studio/integrate-batch.mjs`.
- Create: `tools/captain-studio/integration-report.mjs`.
- Create: `tools/captain-studio/integration-ledger.mjs`.
- Modify only as coordinator: `public/assets/animation/manifest.json`, generated `src/content/animation-assets.js`, generated `src/content/animation-ball-tracks.js`.
- Test: `tests/captain-studio-integration.test.js`.
- Test: `tests/fixtures/captain-studio/baselines/` and `packages/`.

**Interface:**
- `integrateCaptainBatch({ baseRoot, baseCommit, packageRoots, outputRoot }): Promise<IntegrationResult>` validates every package against the same base, integrates the valid subset, records stable rejection codes for invalid packages, and returns the temp commit/tree metadata without moving a ref.
- `promoteIntegration({ repositoryRoot, expectedRefSha, integrationCommit, targetRef }): Promise<void>` performs only an expected-old-SHA ref update after all checks pass.
- `canonicalSerialize(value: unknown): Buffer` uses recursively sorted object keys, array order unchanged, UTF-8, normalized LF, and no insignificant whitespace.

- [ ] **Step 1: Add positive and fail-closed integration fixtures.** Assert stale base, mismatched captain-state hash, duplicate captain, duplicate/occupied path, accepted-art replacement, unsupported clip/direction, invalid geometry/hash, invalid timing/track, missing evidence, support/captain cross-scope, dependency mismatch, any new/unexplained audit error, and increase to the pinned missing set are rejected.
- [ ] **Step 2: Test valid-subset behavior.** Give the batch two valid captain packages and one invalid package; require the two valid packages to stage, the invalid package to be logged with reason, and the rejection ledger to mark rebase/re-review required.
- [ ] **Step 3: Test deterministic rendering and idempotence.** Run identical fixture inputs twice under different clocks, timezone/locale settings, file enumeration order, and activity-log contents. Assert identical canonical runtime registry, normalized audit finding report, timestamp-free integration-ledger bytes, and Git tree SHA. The in-tree audit links only to a stable normalized-audit fingerprint; keep the raw timestamped audit hash and lane activity logs in append-only sidecars outside the tree, keyed by batch ID and tree SHA. Derive the batch ID from a canonical record containing `baseCommit`, sorted final package IDs, integrator implementation commit/version, schema and registry-generator versions, strict-audit configuration and baseline finding-set hashes, mirror-policy hash, and resource-policy hash. Replaying a batch whose review ref already points to its exact integration commit is a no-op success; the same batch ID with a different tree hash fails closed.
- [ ] **Step 4: Implement temporary tree construction.** Verify all packages share one base SHA, run package validation, copy baseline to an isolated temporary Git tree, apply sorted manifest and track deltas, regenerate each runtime registry once, and include only deterministic outputs in the tree. Store timestamps, elapsed durations, and activity events in sidecars that cannot affect the tree hash.
- [ ] **Step 5: Compare strict audit to pinned baseline.** Keep baseline findings visible and hash-identical; allow exact missing entries to be resolved by the current package, reject any new/unexplained finding, any increase in missing assignments, or any new frame shortfall. Require all clips/facings for each integrated captain present, source hashes correct, support coverage unchanged, and no accepted base file changed. Do not require global zero gaps until final league completion.
- [ ] **Step 6: Enforce resource limits before materializing packages.** Read `resource-limits.json`; enforce ≤8 packages, ≤64,000,000 decoded pixels/image, ≤64 MiB/input file, per-package observed cap, and batch bytes ≤ measured workspace budget. Reject over-limit inputs before decode/copy and record stable reason code.
- [ ] **Step 7: Implement promotion with compare-and-swap ref update.** Build one commit from the verified tree; allow only explicit review/integration refs and reject `main`, release, deployment, and unapproved protected refs. Use a real Git expected-old-SHA lease. Simulated crashes before ref update leave all active refs/registries unchanged. Retry succeeds only if target ref is still the expected old SHA or already equals the exact expected integration commit; if it moved, reject stale and require new base. Test both cases and protected-ref rejection.
- [ ] **Step 8: Run `node --test tests/captain-studio-integration.test.js tests/captain-studio-package.test.js tests/captain-studio-export.test.js tests/captain-studio-collector.test.js`.** Then run `npm test`, `npm run lint`, `npm run validate:content`, strict report-only audit comparison, and `npm run build` on the infrastructure branch.

### Task 6: Build a fresh stable assignment matrix and scoreboard

**Files:**
- Create: `tools/build-captain-studio-assignments.mjs`.
- Create: `docs/animation-production/CAPTAIN_STUDIO_ASSIGNMENTS.json`.
- Create: `docs/animation-production/CAPTAIN_STUDIO_SCOREBOARD.json`.
- Create: `docs/animation-production/CAPTAIN_STUDIO_EVENT_LOG.jsonl`.
- Test: `tests/captain-studio-assignments.test.js`.

**Interface:**
- `buildCaptainAssignments({ audit, teams, completedExclusions, seed, laneCount }): AssignmentPlan` selects only incomplete non-Kraken captains, assigns each once, carries exact missing directional clips, and records the seed, base SHA, roster/audit hashes, owners, and stage state.

- [ ] **Step 1: Write roster tests.** Use the combined baseline fixture to assert captain-only assignments, Kraken excluded, completed captains excluded, one owner per captain, exact clip/direction coverage, and 6–8 initial unique captains.
- [ ] **Step 2: Test stable deterministic assignment.** Same seed/base yields byte-identical matrix; changed roster/audit/base invalidates the assignment and requires regeneration.
- [ ] **Step 3: Test stage transitions and metrics.** Validate only allowed states and append-only events for generation attempts/rate limits, CPU/memory/build constraints, rejection/rework, conflicts, accepted clip throughput, and integration duration.
- [ ] **Step 4: Implement matrix and scoreboard generator.** Do not freeze the current 706-clip estimate; regenerate from the combined strict audit and include both right and non-mirror-safe left gaps.
- [ ] **Step 5: Run `node --test tests/captain-studio-assignments.test.js`.** Confirm a 6–8 captain plan with stable one-to-one owners.

### Task 7: Prepare the bounded pilot lanes (requires later activation approval)

**Gate:** do not enter this task until the currently merged `main` baseline has been freshly pinned/verified, the existing PR #10 and #11 track-registry/package/integrator changes have passed independent review and *separately authorized integration*, strict audit and exact gap matrix have been accepted against that base, Myth's protected local-only workspace is not displaced, and the owner **separately authorizes the new 6-8-captain production pilot**. Historical PR #6/#7 reconciliation is complete; it is not a task to repeat.

**Files:**
- Create only after activation approval: `tools/generate-art/studio/<captainId>/assignment.json` for 6–8 captains.
- Create only after activation approval: one worker instruction/PR template under `docs/animation-production/studio/`.
- Do not create tasks, branches, or packages before the gate and later explicit activation authorization.

- [ ] **Step 1: Recompute exact inventory on the newly approved Studio-specific pinned baseline.** Exclude Kraken and every 29/29 captain; retain canonical art, accepted clips, direction-level missing list, mirror policy, and **accepted/material** source lineage with truthful compact unreferenced rejected-only history. Do not assume archived Oct 29 audit values are the latest.
- [ ] **Step 2: Assign 6–8 unique captain owners.** Pin one base SHA and one branch/worktree per captain; verify paths are namespaced and shared files forbidden.
- [ ] **Step 3: Verify lane prompts and permissions.** After the recorded activation gate only, workers may add new original atlases with their assigned captain prefix and required accepted/material raw generation, exact prompt, source-to-packed lineage, track and review evidence inside their captain namespace. Never require disposable, unused rejected-only binaries/prompts as proof of accepted art; preserve honest compact rejected-only summaries. A new accepted source without an authentic generation ID is quarantined; retry via a verified route, then request a documented owner exception or alternate source, never fabricate an ID or apply legacy-baseline allowances to new accepted art.
- [ ] **Step 4: Seed scoreboard and event log.** Record start time, owner, base SHA, prior clips/missing clips, quota/tool state, and initial resource/workspace measurements.

### Task 8: Independently review packages and integrate pilot results

**Files:**
- Per-captain package and review evidence: `tools/generate-art/studio/<captainId>/`.
- Runtime atlas additions: `public/assets/animation/<captainId>-<clip>-<direction>.<format>`.
- Integration records: `docs/animation-production/studio/integrations/<batchId>/`.
- Refresh: `docs/animation-production/ASSET_AUDIT_LATEST.json`, `.md`, `ASSET_STATUS.md`, `CAPTAIN_GAP_CHECKPOINT.md`, `HANDOFF.md`, `docs/SESSION_HANDOFF.md`, `docs/QA_REPORT.md`.

- [ ] **Step 1: Prepare the complete-set visual boards.** Compare every new and retained base clip for identity/costume/anatomy consistency, pose continuity, transitions, timing, and action coverage. Assemble actual-size, light/dark, and zoom previews without granting approval before digest freeze.
- [ ] **Step 2: Freeze artwork and issue its review request.** Finalize the artwork inventory, compute its immutable `artworkDigest`, and issue the coordinator's one-use review request bound to that digest and scope. Do not record approval at this step.
- [ ] **Step 3: Inspect and approve the fixed artwork digest.** Check character identity, costume, anatomy/species, distinct poses, alpha/margins/baseline, timing, facing, no baked ball, and **accepted/material** source lineage against the frozen artwork digest and its previews. Unused rejected-only attempt summaries cannot masquerade as source evidence. Verify digest first, then record distinct reviewer request/session and hashed approval without referencing future package digest. Any artwork change requires new digest/review.
- [ ] **Step 4: Run independent track/gameplay review.** Freeze and hash track/action inputs as `trackDigest`; use native Jam Stage to inspect ball placement, contact, ownership, release/catch/grab, action anchors, scoring, landing/recovery, both directions, 100%/120%, and no fallback/injection/browser errors. Record evidence against the frozen track digest and artwork digest where visual contact is involved.
- [ ] **Step 5: Finalize package digest after approvals.** Freeze all approval and evidence records, then calculate and verify the final `packageId` over the package manifest and every package/runtime asset. This digest incorporates approval and supporting evidence but is not an input to them. Any later evidence edit invalidates the package digest; any artwork or track edit invalidates its corresponding approval and requires re-review.
- [ ] **Step 6: Validate packages and integrate only the valid subset.** Record rejected packages without loss; rejected lanes must rebase/regenerate/re-review before resubmission.
- [ ] **Step 7: Review the complete 29-clip set in the registered runtime.** Compare all new and retained base clips for visual identity, continuity, transitions, timing, and action coverage before marking complete.
- [ ] **Step 8: Run full validation per accepted batch.** Run focused captain tests, `npm test`, lint, content validation, strict audit baseline comparison, standalone build, desktop/mobile rendering, full-match and season E2E required by the repository's CI/tooling.
- [ ] **Step 9: Inspect actual runtime visuals.** Review every clip type and source family in native playback; passing audits/tests are not visual acceptance.
- [ ] **Step 10: Publish measured pilot report.** Calculate accepted clips per lane/day, retries/rate limits, rejection/rework, resource/build bottlenecks, integration conflicts/cycle time, effective source drawings, and comparison to the sequential baseline from actual timestamps in sidecar activity records.

### Task 9: Hold expansion and report the activation decision

- [ ] **Step 1: Stop at the 6–8 lane pilot.** Do not launch 12–16 or remaining lanes under this plan.
- [ ] **Step 2: Report accepted coverage, blockers, risks, resource use, QA failures/rework, and measured throughput.** Keep rejected and unresolved work counted as incomplete.
- [ ] **Step 3: Request separate user authorization before scaling or merging/deploying.** This plan does not authorize either action.

## Required validation commands

- Focused fixtures: `node --test tests/captain-studio-*.test.js tests/animation-ball-tracks-parity.test.js tests/captain-track-integration.test.js tests/animation.test.js tests/jam-stage-projection.test.js`
- Full automated suite: `npm test`
- Lint: `npm run lint`
- Roster validation: `npm run validate:content`
- Strict report-only asset audit: `node tools/audit-animation-assets.mjs --report-only --json docs/animation-production/ASSET_AUDIT_LATEST.json --markdown docs/animation-production/ASSET_AUDIT_LATEST.md`
- Standalone build: `npm run build`
- Native visual/gameplay capture and desktop/mobile/full-match/season E2E must run on the **freshly pinned, Studio-approved integrated source** and each resulting accepted batch; automated tests cannot replace visual signoff. Current issues #18/#19 stay open until independently corrected.
