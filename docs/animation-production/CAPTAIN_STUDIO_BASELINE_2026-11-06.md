# Captain Studio post-PR11 source baseline (candidate)

**Snapshot date:** November 6, 2026  
**Source of truth:** `Manaconda33/Conda-Jam` `main` at [`895ff9c598689ce58980b504876b3b36c027f6a5`](https://github.com/Manaconda33/Conda-Jam/commit/895ff9c598689ce58980b504876b3b36c027f6a5)  
**Git tree:** `d077bcda30b9238bb58af020170b356666e08038`  
**Status:** **Source-pinned candidate.** The separately proposed, read-only strict audit must pass on this exact source, and owner acceptance is required before using this as a production activation baseline. No new-artwork, pilot, workspace or release authorization is implied.

## Integrated foundation

- [PR #9](https://github.com/Manaconda33/Conda-Jam/pull/9): Captain Studio architecture and plan, merged.
- [PR #10](https://github.com/Manaconda33/Conda-Jam/pull/10): deterministic package collector/validator/integrator and generated track registry, merged; 3,045 / 3,045 current-main action parity and complete tests previously verified. The user-authorized fixes prevent dropped tracked-but-ignored evidence and redundant Git object copying.
- [PR #11](https://github.com/Manaconda33/Conda-Jam/pull/11): rejected-only cleanup policy, merged; 657 / 657 prior full tests passed. Never-used rejected artifacts may be omitted **only after dependency checks** with truthful summaries. Accepted/material inputs still require exact prompt, genuine generation ID, hashes, source-to-packed lineage, independent digest-bound review and fail-closed validation.

The historical [`CAPTAIN_STUDIO_BASELINE_ACCEPTANCE.md`](CAPTAIN_STUDIO_BASELINE_ACCEPTANCE.md) describes an **older local PR6/PR7 composite**. Do not substitute that older, previously not-fully-reachable candidate SHA for the present merged `main` source.

## Pinned last authoritative strict-audit state

| Measure | Recorded value |
| --- | ---: |
| Athletes / captains / support athletes | 105 / 35 / 70 |
| Action definitions per athlete | 29 |
| Registered clips inspected | 2,397 |
| Original authored / support derived clips | 570 / 1,827 |
| Unique source libraries / atlases / decoded drawings | 42 / 570 / 5,489 |
| Missing bespoke captain directional assignments | **706** |
| Captains with outstanding assignments | **28** |
| Missing left-facing / right-facing assignments | 48 / 658 |
| Non-verbatim historical source-prompt disclosures | **40** |
| Frame target shortfalls | 0 |
| Strict art audit `ok` | **false** |

The machine-readable [`CAPTAIN_STUDIO_BASELINE.json`](CAPTAIN_STUDIO_BASELINE.json) pins 17 critical Git blob IDs, strict expected counts and all gates. The [`CAPTAIN_GAP_MATRIX.csv`](CAPTAIN_GAP_MATRIX.csv) is the complete **706-row** directional list sourced from the immutable [746 exact accepted-source findings](PR17_AUDIT_EXPECTED_SIGNATURES.json), not a loose headcount. It includes Myth's **21 still missing** registered clips, preserves both facings for `e-indigo` and `gb-design`, and excludes the 29/29 complete Kraken.

**Important:** The most recent tracked audit summary predates this baseline branch. The verification workflow regenerates a full report against the source-pinned runtime and assets without rewriting tracked audit reports; it must match all 746 individual error identities, not just totals. Until its result is confirmed, this is a **candidate**, not an independently re-audited accepted production baseline. Passing the audit-identity check does not turn strict `ok=false` into art acceptance.

## Outstanding gates

1. Obtain an actual **passing** [`captain-studio-baseline-verify.yml`](../../.github/workflows/captain-studio-baseline-verify.yml) run against this candidate and independently review its identity and manifest/source pins; do not assume a workflow has passed before GitHub reports it.
2. Measure disk and package caps using `tools/captain-studio/profile-baseline.mjs` on real complete reviewed bundles and the active machine's available space. Do **not** invent `resource-limits.json` values from old samples.
3. Protect the **one existing Myth-only Codex lane**, its unpublished local workspace and pinned composite. Candidate art with a gameplay PASS is not automatically a registered or independently accepted package. Do not replace Myth's local base with `main` without direct reconciliation.
4. Leave visual issues [#18, Marin hand contact](https://github.com/Manaconda33/Conda-Jam/issues/18) and [#19, Kraken receive continuity](https://github.com/Manaconda33/Conda-Jam/issues/19) open until separately reviewed and resolved.
5. No 6–8 captain pilot, new parallel worker lanes, production-ref changes, or artwork promotions without **fresh and explicit owner authorization** after baseline and resource checks.

## Historical branch retirement audit

| Historical branch | Git head | Commits ahead of merged main |
| --- | --- | ---: |
| `codex/captain-studio-architecture` | `fd61909ce7f51a636805e3023a406eb0c6404f8c` | 0 |
| `codex/captain-studio-infrastructure` | `475b63de08cbfb0ed0f6f17daab9a1fa8e55688f` | 0 |
| `codex/rejected-prompt-exception` | `690ec780343a164f40bf1d8053d2f55676668fe6` | 0 |

All three heads are true ancestors of `main`; none has unmerged GitHub commits and there are zero open dependent pull requests. **Not yet proven:** whether any branch is checked out by an active or offline Codex worktree, or needed to recover unpublished art. The connected GitHub operations cannot inspect Codex local worktrees or delete these remote branches. Before a human deletes them: inspect `git worktree list --porcelain`, `git status` on active/retired worktrees, untracked/ignored and unpublished Myth evidence, and reachable refs before branch deletion. Never run destructive worktree cleanups, GC or force deletion to satisfy this checklist. No remote branch was deleted by this review.

**Disposition:** Ready to review as a reproducible baseline proposal. Not an asset-completion announcement and not an automatic activation instruction.
