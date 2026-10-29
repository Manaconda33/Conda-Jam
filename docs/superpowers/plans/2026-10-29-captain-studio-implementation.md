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
- Do not claim throughput improvements from concurrency without measured accepted-package data.

## Review Focus

- A package whose `baseCommit` matches but whose captain subtree or support dependencies changed must be rejected by expected-state hashes.
- Package paths with traversal, absolute paths, symlinks, case-fold collisions, or duplicate runtime asset paths must never escape the staging root or overwrite accepted assets.
- A package with valid JSON but missing raw/rejected trial lineage, a generation ID, independent review, or normal-loader evidence must not become active.
- A technically complete atlas with missing action anchors, bad facing/mirror behavior, or an unrelated ball track must not be counted accepted.
- An interrupted integration must leave the integration ref on its old SHA; valid packages in a wave must remain usable when another package is rejected, with rejected packages re-based and re-reviewed.

---

### Task 1: Pin and reconcile the production baseline

**Files:**
- Read/update after authorized PR reconciliation: `docs/animation-production/CAPTAIN_STUDIO_BASELINE.json` (create).
- Read/update after authorized PR reconciliation: `docs/animation-production/CAPTAIN_GAP_MATRIX.csv` (create).
- Refresh from exact baseline: `docs/animation-production/ASSET_AUDIT_LATEST.json` and `.md`.
- Protect and review: `HANDOFF.md`, `docs/SESSION_HANDOFF.md`, `docs/animation-production/ASSET_STATUS.md`.

- [ ] **Step 1: Block execution until PR #6/#7 have an explicitly reviewed integration order and clean combined base.** Do not merge them in this task without authorization.
- [ ] **Step 2: Re-run strict audit on the exact combined base.** Run `node tools/audit-animation-assets.mjs --report-only --json docs/animation-production/ASSET_AUDIT_LATEST.json --markdown docs/animation-production/ASSET_AUDIT_LATEST.md`.
- [ ] **Step 3: Generate captain-only gap matrix from roster plus audit errors.** Record every missing `(captainId,direction,clip)`; do not use `coverageByPlayer.missingClips` alone because non-mirror-safe captains can have explicit left-direction gaps.
- [ ] **Step 4: Pin baseline evidence.** Record base commit, manifest SHA-256, audit SHA-256, 35-captain roster hash, mirror-policy hash, support-library state/hash, and generation tool versions in `CAPTAIN_STUDIO_BASELINE.json`.
- [ ] **Step 5: Validate counts and exclusions.** Assert 35 captains, Kraken complete/excluded, 0 completed captain gaps reopened, and support assignment state unchanged from the combined baseline.

**Gate:** stop if the audit errors, support state changed unexpectedly, the base is dirty/ambiguous, or PR overlap remains unresolved.

### Task 2: Move athlete ball tracks into a generated data registry

**Files:**
- Create: `src/content/animation-ball-tracks.js`.
- Modify: `src/core/animation.js` to import the registry and remove only inline track data definitions.
- Create: `tools/register-animation-ball-tracks.mjs` for deterministic serialization.
- Test: `tests/animation-ball-tracks-parity.test.js`.
- Test: `tests/captain-track-integration.test.js` and `tests/animation.test.js`.

- [ ] **Step 1: Capture a failing runtime-parity test without exposing private state.** Use the current public `athleteBallTrackSource`, `sampleBallHeight`, `sampleBallForward`, and `sampleBallReleaseVz` APIs over every roster athlete, clip, integer tick, and loop boundary; serialize the observed source IDs and sampled values as a frozen fixture. Assert the current implementation matches it.
- [ ] **Step 2: Add a generated registry with the exact data shape.** Export `athleteBallTracks` and a companion `athleteBallTrackProvenance` map as plain JSON-compatible data; preserve all keys, vectors, tick arrays, release velocities, and provenance. Keep the existing donor fallback lookup via `supportingAnimationLibraries[athleteId].ballTrackSource` in `src/core/animation.js` unchanged.
- [ ] **Step 3: Add deterministic registry writer.** Implement `renderBallTrackRegistry(data) -> string` and `writeBallTrackRegistry(data, outputPath) -> Promise<void>`; sort newly supplied captain/clip keys without reordering or altering baseline values, write via same-directory temp file and rename.
- [ ] **Step 4: Switch `src/core/animation.js` to imported track data.** Keep exported selectors and `sampleBallHeight`, `sampleBallForward`, `sampleBallReleaseVz`, ownership and facing behavior unchanged.
- [ ] **Step 5: Verify parity.** Run `node --test tests/animation-ball-tracks-parity.test.js tests/captain-track-integration.test.js tests/animation.test.js`; require exact equality for all baseline tracks and representative interpolated tick samples including loops and endpoints.
- [ ] **Step 6: Run all existing track-sensitive tests.** Run `npm test`; review any fixture that assumed inline storage without changing runtime behavior.
- [ ] **Step 7: Submit this infrastructure change as a separate reviewed PR.** Do not merge it without authorization; package integration cannot proceed until the change is in the accepted baseline.

### Task 3: Define and validate captain package schema

**Files:**
- Create: `tools/captain-studio/package-schema.json`.
- Create: `tools/captain-studio/canonical-json.mjs`.
- Create: `tools/captain-studio/package-hash.mjs`.
- Create: `tools/captain-studio/validate-package.mjs`.
- Test: `tests/captain-studio-package.test.js`.

**Interfaces:**
- `canonicalJson(value: unknown): string` recursively sorts object keys, preserves array order, rejects non-JSON values, and emits UTF-8 JSON with no insignificant whitespace.
- `computePackageDigest({ manifest, files }): string` hashes canonical manifest with `packageId` omitted followed by sorted path/SHA-256 pairs for all other package and runtime asset files.
- `validatePackage({ packageRoot, baseRoot, baseCommit, baseline }): Promise<{ok:boolean, packageId:string, captainId:string, updates:Update[], errors:Issue[]}>` is read-only and returns stable reason codes.

- [ ] **Step 1: Add schema fixtures and tests that fail first.** Cover valid one-captain package, multiple captains, schema version mismatch, missing trial, missing generation ID/raw file, absent independent review, owner self-approval, absent 29-set review, invalid states, and missing dependency.
- [ ] **Step 2: Test path and hash rejection.** Cover `..`, absolute paths, symlink, path normalization/case collisions, missing files, altered asset/evidence hashes, manifest digest mismatch, duplicate asset paths, and protected-helper modification.
- [ ] **Step 3: Implement canonical JSON and digest.** Fix the digest inputs exactly as the design specifies; ensure deterministic results regardless of input object key order.
- [ ] **Step 4: Implement schema validator.** Enforce one captain, only missing base clips, no overwrites, approved state, exact per-clip provenance/trials/evidence, review owner differs from author, baseline and mirror-policy hashes, timing/anchor structure, and safe package/runtime paths.
- [ ] **Step 5: Run `node --test tests/captain-studio-package.test.js`.** Require all negative fixtures to fail with their expected stable reason code and valid fixture to pass.
- [ ] **Step 6: Verify read-only behavior.** Hash all files under the fixture base before/after validation and assert byte equality.

### Task 4: Create the captain package exporter and package ledger

**Files:**
- Create: `tools/export-captain-package.mjs`.
- Create: `tools/captain-studio/export-package.mjs`.
- Create: `tools/captain-studio/package-ledger.mjs`.
- Create fixtures under: `tests/fixtures/captain-studio/packages/`.
- Test: `tests/captain-studio-export.test.js`.

**Interface:**
- `exportCaptainPackage({ baseRoot, contributionRoot, captainId, baseCommit, outputRoot }): Promise<PackageSummary>` creates only `tools/generate-art/studio/<captainId>/package.json` and package metadata; references captain-unique atlases already in `public/assets/animation/` without copying the atlas a second time.

- [ ] **Step 1: Write failing exporter tests.** Verify namespaced output, one captain ID, all assigned missing directions/actions included, existing accepted clips excluded, original prompt/raw/rejected-trial lineage referenced, tracks/evidence included, and package digest reproducible.
- [ ] **Step 2: Add stable package ledger format.** Record package ID, captain, source commit, timestamp, file hashes, accepted/rejected state, review references, and reason codes; append-only updates create new ledger entries rather than rewriting prior package history.
- [ ] **Step 3: Implement exporter with allowlist-only reads.** Require raw generations, exact prompts, rejected trials, layouts, and review evidence under `tools/generate-art/studio/<captainId>/`; permit runtime additions only at `public/assets/animation/<captainId>-<clip>-<direction>.<format>`. Reject files outside those paths and any changes to global manifest/runtime registries/shared code, another captain, or the protected helper.
- [ ] **Step 4: Run exporter fixture tests.** Run `node --test tests/captain-studio-export.test.js`; assert the source branch tree is unchanged apart from namespaced package files.

### Task 5: Implement deterministic batch validation and integration

**Files:**
- Create: `tools/integrate-captain-packages.mjs`.
- Create: `tools/captain-studio/integrate-batch.mjs`.
- Create: `tools/captain-studio/integration-report.mjs`.
- Modify only as coordinator: `public/assets/animation/manifest.json`, generated `src/content/animation-assets.js`, generated `src/content/animation-ball-tracks.js`.
- Test: `tests/captain-studio-integration.test.js`.
- Test: `tests/fixtures/captain-studio/baselines/` and `packages/`.

**Interface:**
- `integrateCaptainBatch({ baseRoot, baseCommit, packageRoots, outputRoot }): Promise<IntegrationResult>` validates every package against the same base, integrates the valid subset, records stable rejection codes for invalid packages, and returns the temp commit/tree metadata without moving a ref.
- `promoteIntegration({ repositoryRoot, expectedRefSha, integrationCommit, targetRef }): Promise<void>` performs only an expected-old-SHA ref update after all checks pass.

- [ ] **Step 1: Add positive and fail-closed integration fixtures.** Assert stale base, mismatched captain-state hash, duplicate captain, duplicate/occupied path, accepted-art replacement, unsupported clip/direction, invalid geometry/hash, invalid timing/track, missing evidence, support/captain cross-scope, and dependency mismatch are rejected.
- [ ] **Step 2: Test valid-subset behavior.** Give the batch two valid captain packages and one invalid package; require the two valid packages to stage, the invalid package to be logged with reason, and the rejection ledger to mark rebase/re-review required.
- [ ] **Step 3: Test deterministic rendering.** Run identical fixture inputs twice and assert identical manifest bytes, asset-registry bytes, track-registry bytes, audit bytes excluding a separately recorded wall-clock field, and integration tree hash.
- [ ] **Step 4: Implement temporary tree construction.** Verify all packages share one base SHA, run package validation, copy baseline to isolated temporary Git tree, apply sorted manifest and track deltas, and regenerate each runtime registry once.
- [ ] **Step 5: Run strict audit against staged output.** Require no new errors, all integrated captain clips/facings present, no frame shortfalls, source asset hashes correct, support coverage unchanged, and no already accepted base file changed.
- [ ] **Step 6: Implement promotion with compare-and-swap ref update.** Build one commit from the verified tree; allow only an explicit review/integration branch ref and reject `main`, release, deployment, and unapproved protected refs. Use expected old ref SHA. Test simulated crash before ref update leaves the target ref unchanged and rerun verifies/reuses or discards the orphan commit safely; assert protected refs are rejected before promotion.
- [ ] **Step 7: Run `node --test tests/captain-studio-integration.test.js tests/captain-studio-package.test.js tests/captain-studio-export.test.js`.** Then run `npm test`, `npm run lint`, `npm run validate:content`, `node tools/audit-animation-assets.mjs --report-only`, and `npm run build` on the infrastructure branch.

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

**Files:**
- Create only after activation approval: `tools/generate-art/studio/<captainId>/assignment.json` for 6–8 captains.
- Create only after activation approval: one worker instruction/PR template under `docs/animation-production/studio/`.
- Do not create tasks, branches, or packages before the gate and later explicit activation authorization.

- [ ] **Step 1: Recompute exact inventory on the accepted integrated baseline.** Exclude Kraken and every 29/29 captain; carry canonical reference art, accepted clips, missing list, mirror policy and rejected-candidate history.
- [ ] **Step 2: Assign 6–8 unique captain owners.** Pin one base SHA and one branch/worktree per captain; verify paths are namespaced and shared files forbidden.
- [ ] **Step 3: Verify lane prompts and permissions.** Workers may only add original atlases with the assigned captain prefix and records under that captain's namespace, including raw generations, exact prompts, rejected trials, layouts, provenance, tracks, and review evidence. No ImageGen run starts until this step has a recorded activation gate.
- [ ] **Step 4: Seed scoreboard and event log.** Record start time, owner, base SHA, prior clips/missing clips, quota/tool state, and initial resource/workspace measurements.

### Task 8: Independently review packages and integrate pilot results

**Files:**
- Per-captain package and review evidence: `tools/generate-art/studio/<captainId>/`.
- Runtime atlas additions: `public/assets/animation/<captainId>-<clip>-<direction>.<format>`.
- Integration records: `docs/animation-production/studio/integrations/<batchId>/`.
- Refresh: `docs/animation-production/ASSET_AUDIT_LATEST.json`, `.md`, `ASSET_STATUS.md`, `CAPTAIN_GAP_CHECKPOINT.md`, `HANDOFF.md`, `docs/SESSION_HANDOFF.md`, `docs/QA_REPORT.md`.

- [ ] **Step 1: Run independent source/art review.** Check exact canonical character identity, costume, anatomy/species, pose distinctness, alpha, margins, baseline, timing, mirrored facing, no baked ball, all source/rejected lineage, actual-size and light/dark/zoom boards.
- [ ] **Step 2: Run independent track/gameplay review.** Use separate captain-specific tracks and native Jam Stage; inspect ball placement, hand/prop contact, ownership, release/catch/grab, action anchors, scoring, landing/recovery, both directions, 100%/120%, no fallback/injection/browser errors.
- [ ] **Step 3: Review complete 29-clip set.** Compare every integrated clip with retained accepted base clips for visual continuity and transition consistency before marking complete.
- [ ] **Step 4: Validate packages and integrate only the valid subset.** Record rejected packages without loss; rejected lanes must rebase/regenerate/re-review before resubmission.
- [ ] **Step 5: Run full validation per accepted batch.** Run focused captain tests, `npm test`, lint, content validation, strict audit, standalone build, desktop/mobile rendering, full-match and season E2E required by the repository's CI/tooling.
- [ ] **Step 6: Inspect actual runtime visuals.** Review every clip type and source family in native playback; passing audits/tests is not visual acceptance.
- [ ] **Step 7: Publish measured pilot report.** Calculate accepted clips per lane/day, retries/rate limits, rejection/rework, resource/build bottlenecks, integration conflicts/cycle time, effective source drawings, and comparison to the sequential baseline from recorded timestamps only.

### Task 9: Hold expansion and report the activation decision

- [ ] **Step 1: Stop at the 6–8 lane pilot.** Do not launch 12–16 or remaining lanes under this plan.
- [ ] **Step 2: Report accepted coverage, blockers, risks, resource use, QA failures/rework, and measured throughput.** Keep rejected and unresolved work counted as incomplete.
- [ ] **Step 3: Request separate user authorization before scaling or merging/deploying.** This plan does not authorize either action.

## Required validation commands

- Focused fixtures: `node --test tests/captain-studio-*.test.js tests/animation-ball-tracks-parity.test.js tests/captain-track-integration.test.js`
- Full automated suite: `npm test`
- Lint: `npm run lint`
- Roster validation: `npm run validate:content`
- Strict report-only asset audit: `node tools/audit-animation-assets.mjs --report-only --json docs/animation-production/ASSET_AUDIT_LATEST.json --markdown docs/animation-production/ASSET_AUDIT_LATEST.md`
- Standalone build: `npm run build`
- Native visual/gameplay capture and desktop/mobile/full-match/season E2E must be run on the combined accepted baseline and each integrated batch; automated tests are not visual proof.
