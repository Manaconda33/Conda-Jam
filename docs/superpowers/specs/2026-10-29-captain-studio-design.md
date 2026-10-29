# Parallel Captain Studio Architecture

**Status:** Architecture proposal for review. It does not start captain production, merge PRs, or deploy.

## Intent

Once the repository has one clean, accepted baseline containing the Kraken-complete captain lane and reconciled support-player changes, produce the remaining bespoke captain libraries through independent captain lanes. Keep each lane constrained to one captain, preserve accepted art and provenance, and prevent concurrent workers from racing on the shared runtime manifest.

The current registry is a single-writer surface: `tools/register-animation-atlas.mjs` mutates `public/assets/animation/manifest.json` and regenerates `src/content/animation-assets.js`; ball tracks currently live in `src/core/animation.js`. Workers therefore need an isolated contribution format and an integrator that alone owns global outputs.

## Goals

- Keep captain art bespoke and captain-specific. Do not use supporting-player donors or edit captain assets already accepted on the pinned base.
- Assign one stable owner and one namespaced output area per incomplete non-Kraken captain.
- Make a captain's contribution portable, immutable, hash-verifiable, and reviewable without direct worker writes to shared registries.
- Reject stale, incomplete, ambiguous, conflicting, or unreviewed contributions before they affect active assets.
- Combine a batch from one pinned base in one deterministic integration pass; generate the canonical manifest and runtime asset registry once.
- Keep track data, provenance, review evidence, audit results, and accepted/rejected status attached to the exact art they describe.
- Launch only the bounded 6–8 captain wave after the integrated base and this architecture pass review; measure real acceptance and integration throughput before any scale-up.

## Non-goals and anti-goals

- This design does not launch production lanes, generate art, merge PR #6 or #7, deploy, or authorize expansion past the first 6–8 lanes.
- It does not weaken captain frame, identity, anatomy, facing, ball-contact, provenance, or independent-review requirements.
- Workers do not edit `manifest.json`, `src/content/animation-assets.js`, `src/core/animation.js`, shared render/simulation code, global audit summaries, team/roster code, CI, or another captain's files.
- No “last writer wins”, silent overwrite, inferred approval, borrowed support art, or generated-frame/hash inflation is allowed.

## Chosen approach

Use a **captain-scoped Git contribution package** plus a **single-writer batch integrator**.

Each worker branch contains one package under `tools/generate-art/studio/<captain-id>/` and adds captain-unique runtime atlas files under `public/assets/animation/`. The package records paths to those assets, hashes, layouts, provenance, independent review evidence, and per-clip ball tracks. The Git commit is the portable package boundary; a canonical package digest covers a path-sorted list of package and atlas file hashes. This avoids duplicating large binary atlases into a second archive while keeping the entire contribution retrievable from its branch/commit.

The coordinator collects one package per captain for each integration batch. The integrator validates all packages against the exact pinned baseline, applies the accepted clip deltas in memory to a temporary manifest and track registry, runs structural/content checks, generates the runtime registries once, and stages an integration report. Only a passing batch is atomically promoted to an integration branch/commit. Failed packages remain unchanged and receive a machine-readable rejection report with reason codes; a corrected package gets a new digest and commit.

### Why this approach

- Direct concurrent registry edits are ruled out by the shared manifest and generated registry.
- Sequential cherry-picking of worker changes still allows worker PRs to contain conflicting global edits, and makes silent overwrite/rebase mistakes hard to detect.
- A detached ZIP would duplicate the large binary assets and would need a second delivery path to get them into Git review. A namespaced Git package keeps the assets and the package metadata together, remains portable, and uses existing repository history and review.

## Package contract

One package represents the full missing-clip delta for one captain, not a partial stream. This makes the assignment single-owner and avoids same-captain package ordering within a batch. The captain can be marked complete only after its package passes integration and post-integration review.

The package manifest is versioned JSON with at least:

- `schemaVersion`, `packageId`, `captainId`, `baseCommit`, `createdAt`, and `producer`.
- `expectedCaptainStateSha256`, computed from canonical serialization of that captain's manifest entry and track state at `baseCommit`.
- `updates[]`: one row per added direction/clip, with `direction`, `clip`, `assetPath`, `assetSha256`, source/packed layouts, cell rectangles, baseline, frame anchors, and `trackPath`/`trackSha256`.
- `trials[]`: every generated or edited attempt, including rejected candidates, with exact prompt and prompt hash, generation ID, timestamp, raw source path/hash, cleanup/source-to-packed lineage, reviewer, disposition, and a specific rejection reason when rejected. New packages fail closed if a required generation ID or raw source is absent.
- `acceptance`: accepted state and separate named evidence for source/art review, anatomy/identity and costume consistency, transparency/layout review, action timing and anchors, separate-ball track review, and native normal-loader gameplay review. Each evidence file is path-bound and hashed. Timing records include frame durations/loop behavior and applicable release, catch, grab, takeoff, peak, landing, and scoring events.
- `dependencies`: only explicitly reviewed shared-engine/integration dependencies; package acceptance fails if a dependency is absent from the pinned baseline.
- `reviewRecord`: the worker branch/PR or equivalent traceable review reference, author/owner, independent reviewer identity, and review disposition for this captain package. The owner may not approve their own work; the validator rejects matching owner/reviewer identities.

`packageId` is SHA-256 over canonical JSON with `packageId` omitted, followed by sorted relative path/SHA-256 pairs for every other package asset, trial, evidence file, and runtime atlas; the manifest file itself is excluded from the path list to avoid a circular hash. Paths must be normalized, remain within the captain package or `public/assets/animation/`, and contain no symlink or traversal component. Preserve the user-owned `tools/generate-art/review-j106-keeg-alley-oop-pose.py` byte-for-byte; the package collector and integrator must reject any change to that path.

The package cannot claim a clip already accepted on the base. A worker may add only the missing clips and explicit facing variants from its assignment. Existing entries and files are immutable. All 29 actions and required directions are checked after integration; atlas files are checked against their actual decoded bytes, frame rectangles and unique-frame minimums. Ball art stays separate from sprites; track arrays and action anchors must match the clip and required gameplay events.

## Baseline and batch rules

- A production wave has one recorded `baseCommit` shared by all packages. The coordinator records the base manifest hash, captain roster/gap matrix, mirror policy, support-library state, and strict audit hash alongside the assignment sheet.
- Each package's expected captain-state hash must match the corresponding captain in that same base. This permits independent captain packages to share the pinned base without tolerating a stale or changed captain entry.
- A batch contains at most one package per captain and no duplicate runtime paths. Packages are first validated independently against the same base; a rejected package does not block unrelated valid captains from that wave. Integrate only the valid subset into one batch commit. A rejected package remains in the rejection ledger and must be rebased, regenerated with a new digest, and re-reviewed against the next base before reconsideration.
- A new wave must pin the previous accepted integration commit and regenerate its gap inventory. Packages from a prior wave are stale and require explicit rebase/re-review; the integrator does not silently adapt them.
- Until PR #6/#7 overlap is reconciled, there is no production base SHA and no worker assignments. The architecture branch may be based on Kraken-complete PR #6 only for design review.

## Deterministic single-writer integration

The integrator takes an explicit base commit, a package directory/list, and an output directory. It must:

1. Verify the base SHA and audit/manifest hashes, captain-only scope, roster identity, current clip state, expected captain-state hash, package digest, all file hashes, and every review/evidence reference.
2. Fail closed for stale bases, duplicate captain ownership, duplicate/occupied asset paths, unsupported clips/directions, accepted-clip replacement, invalid frame geometry/counts/hashes, missing raw/prompt/provenance/review evidence, invalid anchors/tracks, dependency mismatch, path traversal, and malformed JSON.
3. Decode each atlas and compare real file/frame hashes; never trust supplied frame hashes as proof of pixel content.
4. Apply sorted package and clip deltas to a copy of the pinned manifest and structured track data. Preserve all unrelated captain and support entries byte-for-byte where practical.
5. Render the generated asset/track registries deterministically and write all outputs into a temporary tree. Run the strict report-only audit, require no new errors or missing assignments for accepted packages, and retain the audit plus accepted/rejected package ledger.
6. Create one integration commit from the fully verified temporary Git tree and update an explicitly allowlisted review/integration branch with an expected-old-SHA check. Reject `main`, release, deployment, and any unapproved protected ref before commit promotion. That ref update is the promotion boundary; a crash before it leaves the active branch untouched, while an unreferenced completed commit can be verified and safely retried. Never expose a partially rewritten multi-file registry as an active integration.

Existing athlete tracks are embedded in `src/core/animation.js`, which is not a safe generated target. Before pilot integration, add a separate reviewed infrastructure change that moves the track data into a deterministically generated `src/content/animation-ball-tracks.js`, preserves the current track-source/fallback behavior, and proves exact gameplay parity. Captain packages then contribute to that data registry without worker edits to runtime code. This infrastructure change must be reviewed and integrated independently before any lane uses the package importer.

## QA and production control

Every accepted package must have exact prompts, generation IDs, source hashes, cleanup/source-to-packed layouts, rejected-candidate history, independent art/anatomy review, light/dark previews, native Jam Stage normal-loader captures for every pose and required facing at 100%/120%, separate athlete-specific ball-track review, and real gameplay validation for action timing and possession events. After integration, an independent reviewer checks visual identity, costume, silhouette, anatomy, motion continuity, and action coverage across the captain's complete 29-clip set, including the accepted clips retained from the base. Runtime tests must assert genuine registered selector/atlas use, correct mirror behavior, no candidate injection, no fallback, and zero browser errors.

The scoreboard is a versioned coordinator artifact with captain ID, lane/owner, base SHA, existing accepted clips, missing clips, accepted since start, review/reject counts, blocker, package digest, integration commit, and QA state. A timestamped lane/event log also records generation attempts and rate-limit failures, CPU/memory/worktree/build bottlenecks, rejection and rework frequency, integration conflicts, and elapsed integration cycle time. Its states are `not_started`, `art_in_progress`, `review`, `approved_package`, `integration_pending`, `integrated`, `complete`. Throughput is measured from actual timestamps and accepted packages; no linear scaling claim is made.

The initial wave is 6–8 non-Kraken captains with unique owners. Stop/hold expansion if resource or ImageGen usage blocks progress, package QA rejects too often, or the integrator cannot keep up. Any 12–16 or larger wave requires demonstrated results and separate user authorization.

## Pre-activation dependencies

1. Reconcile PR #6 and PR #7 on a clean reviewed baseline, including their shared audit/status/renderer files. Preserve the captain branch's Kraken work and the support branch's donor work. Do not merge/deploy without separate authorization.
2. Refresh and reconcile the strict audit against the exact combined baseline. The 2026-10-29 Kraken branch audit reports 706 missing directional assignments across 28 non-Kraken captains, but the assignment matrix must be regenerated after PR reconciliation.
3. Implement and independently review the structured track-registry prerequisite and package schema/validator/integrator as infrastructure changes, with positive and fail-closed fixtures.
4. Only after these dependencies are reviewed and the user authorizes activation, create the 6–8 stable captain lanes from one base SHA and start production.

## Decisions left to the implementation plan

- Exact module and CLI names for package export, validation, integration, and audit ledger.
- Canonical JSON rules and package digest implementation details.
- Exact track registry migration scope and parity fixture list.
- Whether the coordinator stages by package commit or by a read-only package collector; both must preserve the same immutable package digest and pinned-base checks.
- Resource limits for package count, atlas bytes, and image decode pixels, set from measured repository constraints before the first production batch.
