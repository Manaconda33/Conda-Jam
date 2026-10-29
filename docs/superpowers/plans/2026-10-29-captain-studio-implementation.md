# Parallel Captain Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Keep the architecture and production gates below active.

**Goal:** Safely package, validate, and integrate bespoke animation contributions for incomplete non-Kraken captains, then run the authorized 6–8-lane pilot without concurrent writes to shared registries.

**Architecture:** Workers submit one immutable Git package per captain from one pinned base. A fail-closed validator checks the package and its visual/gameplay evidence; a single writer applies an accepted batch to temporary manifest and track data, generates runtime registries once, verifies the strict audit, and promotes one Git commit with an expected-old-SHA ref update.

**Tech Stack:** Node.js ES modules, Git, JSON manifests, existing `tools/animation-assets.mjs` decoder/auditor, current browser/Jam Stage capture harnesses, npm scripts.

**Spec:** `docs/superpowers/specs/2026-10-29-captain-studio-design.md`

## Global Constraints

- The current PR #6 head `55a2ab104d6b108cc08132fddc01b32afb958e75` is a Kraken-complete design base only; it is not the final production base while PR #6/#7 remain unreconciled.
- Do not merge PR #6 or #7, deploy, implement code, or launch captain sessions without separate user authorization.
- Keep Kraken excluded; preserve all accepted assets, original prompts, generations, cleanup lineage, rejected work, and review evidence.
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
- A package with valid JSON but missing raw/rejected trial lineage, a generation ID, independent review, or normal-loader evidence must not become active.
- A new generation without an exposed ID must be quarantined with its prompt/tool response/source hash; never fabricate an ID or call it legacy. An unchanged accepted baseline record may retain its historical missing metadata.
- A technically complete atlas with missing action anchors, bad facing/mirror behavior, or an unrelated ball track must not be counted accepted.
- An interrupted integration must leave the integration ref on its old SHA; valid packages in a wave must remain usable when another package is rejected, with rejected packages re-based and re-reviewed.
- A valid manifest cannot hide a forbidden worker-commit change; every commit and the complete tree diff must pass the captain path/mode allowlist.
- Independent artwork approval must bind to an immutable artwork digest computed before review; the final package digest is computed afterward and includes that approval/evidence without being referenced by it.
- Re-running an identical batch under a different clock or with additional activity-log entries must produce the identical Git tree; volatile audit metadata and logs stay outside that tree.

---

### Task 1: Reconcile PR candidates and pin the production baseline

**Files:**
- Read/update after authorized PR reconciliation: `docs/animation-production/CAPTAIN_STUDIO_BASELINE.json` (create).
- Read/update after authorized PR reconciliation: `docs/animation-production/CAPTAIN_GAP_MATRIX.csv` (create).
- Create after profile: `tools/captain-studio/resource-limits.json`.
- Create: `tools/captain-studio/profile-baseline.mjs` and `tools/captain-studio/compare-audits.mjs`.
- Test: `tests/captain-studio-baseline.test.js`.
- Refresh from exact baseline: `docs/animation-production/ASSET_AUDIT_LATEST.json` and `.md`.
- Protect and review: `HANDOFF.md`, `docs/SESSION_HANDOFF.md`, `docs/animation-production/ASSET_STATUS.md`.

- [ ] **Step 1: Pin all three candidate refs.** Record exact `main`, PR #6, and PR #7 head/base SHAs and a clean workspace SHA/status; make no remote ref changes.
- [ ] **Step 2: Create a local-only reconciliation candidate.** In a disposable clean scratch worktree from pinned `main`, apply PR #6 first, then rebase/apply PR #7 on top. Do not merge either GitHub PR or push the scratch branch.
- [ ] **Step 3: Resolve and independently inspect the exact overlapping paths.** Regenerate `docs/animation-production/ASSET_AUDIT_LATEST.json`, `docs/animation-production/ASSET_AUDIT_LATEST.md`, and `docs/animation-production/ASSET_STATUS.md` only after both source trees are combined. Manually combine `src/render/animation-sprites.js`, preserving PR #6 captain selection/mirroring and PR #7 donor palette behavior. Record each resolution and source lines/behavior retained.
- [ ] **Step 4: Verify candidate preservation before selecting a base.** Compare captain atlas/manifest/track/provenance hashes against PR #6, and donor assignment/uniform profile/palette output hashes plus all 2,030 support clips against PR #7. Run tests, content validation, strict audit, build, registered-loader visual review, and support/captain regression review on the scratch candidate. A separate reviewer records the candidate tree hash and unresolved findings.
- [ ] **Step 5: Stop for separate merge authorization.** If the candidate is accepted but the user has not authorized merging PR #6/#7, keep it local and stop; do not assign lanes or claim it as a production baseline.
- [ ] **Step 6: Re-run strict audit on the exact authorized combined base.** Run `node tools/audit-animation-assets.mjs --report-only --json docs/animation-production/ASSET_AUDIT_LATEST.json --markdown docs/animation-production/ASSET_AUDIT_LATEST.md`.
- [ ] **Step 7: Pin the full baseline error set and exact directional gap matrix.** Store the complete audit, canonical per-error detail hashes, counts by code, and every missing `(captainId,direction,clip)`. Do not infer directional gaps only from `coverageByPlayer.missingClips`.
- [ ] **Step 8: Compare later audits without suppression.** Treat only exact hashed baseline findings as inherited/expected; retain them visibly. Each batch must add no unexplained error or frame shortfall and must not increase missing directional assignments. Resolve assigned missing clips by removing those exact baseline entries from the gap set. League completion requires zero missing assignments; inherited prompts remain visible until resolved with evidence.
- [ ] **Step 9: Profile and pin resource limits.** Set `maxBatchPackages=8`, `maxDecodedPixelsPerImage=64000000`, and `maxInputFileBytes=67108864`. Scan existing per-captain source/evidence histories and set package file/byte caps to 125% of the largest observed complete bundle, rounded up to MiB. Set `maxBatchBytes` no higher than measured available workspace after reserving build/checkout space. Record measured inputs and exact values in `resource-limits.json`.
- [ ] **Step 10: Validate counts and exclusions.** Assert 35 captains, Kraken complete/excluded, zero completed captain gaps reopened, and support assignment state/hash unchanged from the authorized combined baseline.

**Gate:** stop if any audit finding is not in the pinned baseline set, any support/captain source-preservation check fails, resource limits cannot be set within measured storage, the base is dirty/ambiguous, or PR overlap remains unresolved. The current Kraken-branch reference audit has 706 missing assignments and four inherited prompt findings; these are expected reference findings, not reasons to suppress errors or abort the candidate review.

### Task 2: Move athlete ball tracks into a generated data registry

**Files:**
- Create: `src/content/animation-ball-tracks.js`.
- Create fixture: `tests/fixtures/animation/ball-track-runtime-baseline.json`.
- Create fixture: `tests/fixtures/animation/tracked-action-runtime-baseline.json`.
- Modify: `src/core/animation.js` to import the registry and remove only inline track data definitions.
- Create: `tools/register-animation-ball-tracks.mjs` for deterministic serialization.
- Test: `tests/animation-ball-tracks-parity.test.js`.
- Test: `tests/captain-track-integration.test.js` and `tests/animation.test.js`.

- [ ] **Step 1: Capture exact before-migration fixtures from the final combined baseline.** Use public `athleteBallTrackSource`, `sampleBallHeight`, `sampleBallForward`, `sampleBallReleaseVz`, and `animationClips` APIs over every athlete/clip at every integer tick, loop boundary, duration, and endpoint. Record resolved track source/fallback precedence, sampled values, frame durations, loops, release/catch/grab/takeoff/peak/landing/scoring anchors, and mirrored selector decisions. Assert the current implementation matches both fixtures before changing track storage.
- [ ] **Step 2: Add a generated registry with the exact data shape.** Export `athleteBallTracks` and a companion `athleteBallTrackProvenance` map as plain JSON-compatible data; preserve all keys, vectors, tick arrays, release velocities, and provenance. Keep the existing donor fallback lookup via `supportingAnimationLibraries[athleteId].ballTrackSource` in `src/core/animation.js` unchanged.
- [ ] **Step 3: Add deterministic registry writer.** Implement `renderBallTrackRegistry(data) -> string` and `writeBallTrackRegistry(data, outputPath) -> Promise<void>`; sort newly supplied captain/clip keys without reordering or altering baseline values, write via same-directory temp file and rename.
- [ ] **Step 4: Switch `src/core/animation.js` to imported track data.** Keep exported selectors and `sampleBallHeight`, `sampleBallForward`, `sampleBallReleaseVz`, ownership and facing behavior unchanged.
- [ ] **Step 5: Verify exact track/action parity.** Run `node --test tests/animation-ball-tracks-parity.test.js tests/captain-track-integration.test.js tests/animation.test.js`; require exact equality for every athlete/clip/tick, own-track-over-donor and donor-over-default precedence, track scale, durations, loops, and anchors.
- [ ] **Step 6: Verify normal-loader camera/scoring/facing parity.** Compare pre/post fixture traces for tracked gameplay events (shot, pass/receive, pickup, rebound, layup, dunk/alley-oop, fall/recovery) in both facings, including frame selection, attached/free ball coordinates, possession owner, release/catch/grab/score ticks, camera target/zoom, scoreboard, and recovery state. Require exact equality except timestamps/image encoders.
- [ ] **Step 7: Run all existing track-sensitive tests.** Run `npm test`; review any fixture that assumed inline storage without changing runtime behavior.
- [ ] **Step 8: Submit this infrastructure change as a separate reviewed PR.** Do not merge it without authorization; package integration cannot proceed until the change is in the accepted baseline.

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

- [ ] **Step 1: Add schema fixtures and tests that fail first.** Cover valid one-captain package, multiple captains, schema version mismatch, missing trial, missing generation ID/raw file, absent independent review, owner self-approval, absent full-29-set review, invalid states, and missing dependency. Distinguish unchanged legacy accepted baseline entries from new packages; new art missing an ID must quarantine.
- [ ] **Step 2: Test artwork digest and review-request order.** Freeze artwork inputs and compute the artwork digest before issuing the one-use review nonce. Bind the request, reviewer dispatch/session, report, and captures to that artwork digest and scope, never to a not-yet-computed final package digest. Reject missing/reused nonce, same worker/reviewer session, mismatched digest, free-text-only identity, fabricated session ID, absent dispatch record, or artwork mutation after approval. Permit the same GitHub login only with independently dispatched distinct reviewer-session evidence and evidence hashes. State that this is auditable session separation, not cryptographic identity; if stable session/task evidence is absent, require a distinct human GitHub reviewer or quarantine.
- [ ] **Step 3: Test final package digest ordering.** After artwork/track approvals and all package evidence are frozen, compute `packageId` including the approval and evidence hashes. Verify approval/evidence do not contain or depend on `packageId`; changing artwork invalidates the artwork approval, changing track inputs invalidates gameplay review, and changing approval/evidence changes the final package digest without changing frozen artwork/track digests.
- [ ] **Step 4: Test new-source ID quarantine.** Verify an absent generation ID is never synthesized or treated as legacy; package state is `quarantined`, with exact prompt/tool response/time/raw hash/retry history retained, and it cannot export/integrate. Existing baseline metadata remains unchanged.
- [ ] **Step 5: Test path and hash rejection.** Cover `..`, absolute paths, symlink, path normalization/case collisions, missing files, altered asset/evidence hashes, artwork digest mismatch, final package digest mismatch, duplicate asset paths, protected-helper modification, and invalid Git modes/object types.
- [ ] **Step 6: Implement canonical JSON and both digests.** Fix each digest's ordered inputs exactly as the design specifies, normalize LF, preserve array order, and ensure deterministic results regardless of input object key order.
- [ ] **Step 7: Implement package and review-request validator.** Enforce one captain, only missing base clips, no overwrites, approved state, exact per-clip provenance/trials/evidence, coordinator-issued artwork-digest-bound review distinct from the worker session, final digest verification after evidence freeze, baseline/mirror-policy hashes, timing/anchor structure, and safe package/runtime paths.
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

- [ ] **Step 1: Write failing exporter tests.** Verify namespaced output, one captain ID, all assigned missing directions/actions included, existing accepted clips excluded, original prompt/raw/rejected-trial lineage referenced, tracks/evidence included, and package digest reproducible.
- [ ] **Step 2: Test full worker-history collection.** Make a two-commit valid fixture pass. Make invalid fixtures fail if any commit adds a hidden unrelated file, edits/deletes accepted art, deletes an earlier rejected trial, adds symlink/submodule/executable/LFS pointer, uses a case-colliding path, or hides a forbidden path behind a valid package manifest.
- [ ] **Step 3: Implement full Git object collector.** Require a clean worker checkout and enumerate every commit between exact base and worker SHAs; inspect raw per-commit diffs with renames represented as delete+add, plus the final tree diff. Check object types, modes, sizes, hashes, branch ancestry, merge commits and `.gitattributes`. Allow only new regular non-executable files under `tools/generate-art/studio/<captainId>/{prompts,sources,layouts,tracks,reviews,previews,rejected}/` plus `package.json`, and exact `.png`/`.webp` runtime atlases for assigned missing `(clip,direction)` pairs. Reject all other paths, modifications, deletions, renames, executable mode, symlinks (120000), submodules (160000), LFS pointers unless a separately reviewed policy permits them, unreferenced files, path/case-fold collisions, shared-file/other-captain edits, and protected-helper changes.
- [ ] **Step 4: Add stable append-only package ledger.** Record package ID, captain, base/worker commits, timestamp, full diff path/mode/object/hash inventory, accepted/quarantined/rejected state, reviewer request/evidence references, and reason codes without rewriting prior entries.
- [ ] **Step 5: Implement exporter from verified inventory.** Do not let package JSON define the allowlist. Require all raw generations, prompts, rejected trials, layouts, provenance, tracks, and review evidence under the captain namespace. Require exact equality between collected changed paths and the package's declared additions/evidence. Quarantine missing-ID generations, retry only through an ID-producing route, and if unavailable retain evidence and request the user's explicit exception/alternate-source decision.
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

**Gate:** do not enter this task until the user separately authorizes code implementation, the track-registry and package/integrator infrastructure have been independently reviewed and integrated on an authorized branch, PR #6/#7 reconciliation is complete under separate merge authorization, the strict audit/gap matrix is pinned to that exact base, and the user then explicitly authorizes pilot activation.

**Files:**
- Create only after activation approval: `tools/generate-art/studio/<captainId>/assignment.json` for 6–8 captains.
- Create only after activation approval: one worker instruction/PR template under `docs/animation-production/studio/`.
- Do not create tasks, branches, or packages before the gate and later explicit activation authorization.

- [ ] **Step 1: Recompute exact inventory on the accepted integrated baseline.** Exclude Kraken and every 29/29 captain; carry canonical reference art, accepted clips, missing list, mirror policy and rejected-candidate history.
- [ ] **Step 2: Assign 6–8 unique captain owners.** Pin one base SHA and one branch/worktree per captain; verify paths are namespaced and shared files forbidden.
- [ ] **Step 3: Verify lane prompts and permissions.** Workers may only add original atlases with the assigned captain prefix and records under that captain's namespace, including raw generations, exact prompts, rejected trials, layouts, provenance, tracks, and review evidence. No ImageGen run starts until this step has a recorded activation gate. New art without a generation ID is quarantined; retry using a verified route that returns an ID, and if none is available stop the lane and ask the user whether to permit a documented exception or alternate source. Never fabricate an ID or use the legacy-baseline allowance for new art.
- [ ] **Step 4: Seed scoreboard and event log.** Record start time, owner, base SHA, prior clips/missing clips, quota/tool state, and initial resource/workspace measurements.

### Task 8: Independently review packages and integrate pilot results

**Files:**
- Per-captain package and review evidence: `tools/generate-art/studio/<captainId>/`.
- Runtime atlas additions: `public/assets/animation/<captainId>-<clip>-<direction>.<format>`.
- Integration records: `docs/animation-production/studio/integrations/<batchId>/`.
- Refresh: `docs/animation-production/ASSET_AUDIT_LATEST.json`, `.md`, `ASSET_STATUS.md`, `CAPTAIN_GAP_CHECKPOINT.md`, `HANDOFF.md`, `docs/SESSION_HANDOFF.md`, `docs/QA_REPORT.md`.

- [ ] **Step 1: Prepare the complete-set visual boards.** Compare every new and retained base clip for identity/costume/anatomy consistency, pose continuity, transitions, timing, and action coverage. Assemble actual-size, light/dark, and zoom previews without granting approval before digest freeze.
- [ ] **Step 2: Freeze artwork and issue its review request.** Finalize the artwork inventory, compute its immutable `artworkDigest`, and issue the coordinator's one-use review request bound to that digest and scope. Do not record approval at this step.
- [ ] **Step 3: Inspect and approve the fixed artwork digest.** Check character identity, costume, anatomy/species, pose distinctness, alpha, margins, baseline, timing, facing, no baked ball, and source/rejected lineage against the frozen artwork digest and its previews. Only after verifying the digest may the reviewer approve; record request/session identity and evidence hashes without referencing the future final package digest. Any artwork change after approval requires a new digest and review.
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
- Native visual/gameplay capture and desktop/mobile/full-match/season E2E must be run on the combined accepted baseline and each integrated batch; automated tests are not visual proof.
