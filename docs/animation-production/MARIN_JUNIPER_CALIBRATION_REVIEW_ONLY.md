# Marin Dusk / Juniper Vale: retained 9 / 8 / 9 ball-track candidate

**Status: REVIEW ONLY. This is a source-code preservation checkpoint, NOT an accepted production merge.**

## Why this exists

GitHub [draft diagnostic PR #13](https://github.com/Manaconda33/Conda-Jam/pull/13) repeatedly demonstrated that combining published PR #6's captain animation source with PR #7's supporting-player donor mapping moves Marin Dusk's *visual* animation to Juniper Vale while inherited ball-track selection does not adequately match Juniper hand geometry. Earlier work existed only as ephemeral GitHub Actions runner-local `src/core/animation.js` edits. This branch preserves the measured candidate in **real version-controlled game source**, without changing original PR #6, PR #7, or `main`.

### Source lineage and guarded compatibility

- Original shared base: `b8ead76107c6604c8db901b2943c0b134c4b5ebb`
- Protected PR #6 captain head: `55a2ab104d6b108cc08132fddc01b32afb958e75`; **this review branch is based on that exact commit**.
- Protected PR #7 supporting-donor head: `97119d54fd24c442c15192a798cae1e8a279eb1d`; its donor map assigns `marin-dusk` to `juniper-vale`.
- Post-CI main checkpoint used in the diagnostic: `7e700c0eb392800794167007e076c51ac8357a77`.
- Previously unavailable Myth composite `9b738f32a32ee758f3186e73e4f8a7b24479d767`: **not claimed equivalent**, not accessed or modified.

The code is gated by `supportingAnimationLibraries['marin-dusk']?.donorId === 'juniper-vale'`. This guarantees that **PR #6 alone keeps its preexisting runtime ball tracks**. For the combined PR #6 + PR #7 runtime, the guard restores Marin-specific per-action tracks after the original source's legacy reassignment. It does **not** alter animation art, any captain sprites, other supporting athletes, the Juniper donor selection, universal simulation timing, camera, vertical dribble heights, or ball ownership.

## Saved controls and measurements

| Marin action | Retained review-only values | Validation limitations |
| --- | --- | --- |
| `dribble-run` forward | `[8,9,10,9,8,9,11,10,9,8,8]` | Frames 3/4/5 = **9/8/9**, derived from full-bounce visual review |
| `dribble` forward | `[6,7,8,9,10,10,9,8,7,6]` | Preserved individual track; not part of the full-bounce visual acceptance |
| `idle-ball` height | `[1.05,.75,.65,.9]` | Candidate from earlier 40-frame scratch review |
| `idle-ball` forward | `[6,7,7,6]` | Earlier regression's legacy expectation must be separately reviewed |
| `receive` height | `[1.0,2.0,1.7,1.75]` | Candidate only; native catch needs full independent visual signoff |
| `receive` forward | `[9,10,2,1]` | Candidate only |
| `pass` height | `[1,1.05,1.2,1.6,1.3,1] / .88` | Historic Echo pass candidate scaled for Juniper target |
| `pass` forward | `[5,4,13,19,16,8] / .88` | Candidate only |

**Important:** The `dribble-run` *height* track remains the existing canonical animation sequence. In the nine-tick captured window the measured relative heights were `[.85,.70,.55,.40,.25,.125,0,.125,.25]`. Do not move the ball vertically to force an artificial hand contact at the court-plane bounce.

### Reproducible full-bounce evidence

The final two scenarios used the pinned PR6 + PR7 **runner-local combined checkout**, with preexisting scratch Marin overrides. The source candidate in this branch preserves the same values, conditionally under the actual PR7 donor mapping. Successful diagnostic screenshots are evidence for the **scratch values**, not an independent validation of this newly committed source branch.

- **First coordinated candidate [9,8,10]:** [GitHub Actions run 42096129966](https://github.com/Manaconda33/Conda-Jam/actions/runs/42096129966), [36 screenshot + JSON report artifact](https://github.com/Manaconda33/Conda-Jam/actions/runs/42096129966/artifacts/13446493550).
- **Refined candidate [9,8,9]:** [GitHub Actions run 42096646184](https://github.com/Manaconda33/Conda-Jam/actions/runs/42096646184), [36 screenshot + JSON report artifact](https://github.com/Manaconda33/Conda-Jam/actions/runs/42096646184/artifacts/13446578832).
- Final scoped run: **4/4** facing/zoom combinations (left/right, 100%/120%), **36/36** screenshots and zero reported browser errors. Registered `juniper-vale` animation atlases were selected and actual simulation maintained Marin's ball ownership.
- Nine simulation tick samples **4–12**: source frames `[2,2,3,3,4,4,5,5,6]`.
- Facing-local horizontal path **[10,9.5,9,8.5,8,8.5,9,10,11]**. Largest consecutive horizontal delta: **1 world unit**.
- Relative vertical ball heights **[.85,.70,.55,.40,.25,.125,0,.125,.25]**; court contact preserved.
- The visual review found tighter horizontal placement at frames 3 and 4, and a closer low frame 5 at the final 9/8/9 values, with the expected vertically separated bounce. **Pixel-landmark contact was not independently certified.**

### Exact versioned-source validation (after this branch was committed)

- **Draft source PR:** [PR #16](https://github.com/Manaconda33/Conda-Jam/pull/16), based on PR #6 head. The source file's verified Git blob is `2b1413fce2582fd588f7df111bfb719e8605f046`.
- **Recheck:** [GitHub Actions run 42099107812](https://github.com/Manaconda33/Conda-Jam/actions/runs/42099107812) on diagnostic PR #13. This separate workflow retrieved the *exact saved source blob* from GitHub, verified its SHA-1 with `git hash-object`, installed it only into a runner-local PR #6 + PR #7 combined checkout, and repeated the full nine-tick bounce test.
- **Result: PASS**, 4 facing/zoom combinations × 9 simulation steps = **36 screenshots**, registered Juniper donor and Marin ball ownership retained, expected horizontal and vertical trajectories reproduced, no reported gameplay/browser errors.
- **Saved visual evidence:** [artifact 13447929263](https://github.com/Manaconda33/Conda-Jam/actions/runs/42099107812/artifacts/13447929263) (36 PNGs plus `report.json`; temporary artifact retention).
- **Important limitation:** Only the scoped full-bounce game-driven harness passed. The historical original combined-checkout regressions, whole-play pass/catch/normal dribble transitions, full nonsparse test corpus, independent pixel-contact acceptance, and merge gates remain unresolved. Do not present this as a release pass.

These GitHub Actions artifacts have finite retention. The exact control values, simulation sample arrays, baseline IDs, source code and links above remain version-controlled even after artifacts expire.

## Remaining gates, intentionally not waived

1. Independently check actual sprite-to-ball contact and motion (both facings/zooms), including hand, shoe and court-plane bounce. Do not mistake a numerical track match for pixel contact.
2. Exercise live `idle-ball`, `dribble`, `dribble-run`, pass, receive, and genuine Marin-to-Kraken handoff transitions; verify timing, mirroring and ball ownership.
3. Resolve the two original combined-source regression assertions **without silently weakening legitimate tests**. The previous scratch `idle-ball` expectation replacements are not approved production tests.
4. Run the full *non-sparse* test suite, source/provenance validation and complete audit as appropriate; a prior sparse runner omitted large raw assets.
5. Reconcile the full integration of PR #6, PR #7 and their dependent PR stack, and produce a separately authorized review-only integration branch with independent QA.

**No merge, deployment, production branch modification, or Myth workspace access is authorized by this checkpoint.** This branch is solely a recoverable, explicit code candidate. Keep PR #13 draft/unmerged and the original PR #6/#7 heads unchanged.
