# Marin Dusk / Juniper Vale: retained 9 / 8 / 9 ball-track candidate

**Status: REVIEW ONLY. This is a source-code preservation checkpoint, NOT an accepted production merge.**

**Latest checkpoint (2026-11-05): Both the original PR #6 Echo-donor configuration and the combined PR #6/#7 Juniper-donor configuration pass the updated strict Marin regression tests. The combined Juniper run additionally passes the full-bounce and 16-scenario live-transition harness. Independent art acceptance and full non-sparse integration validation are still pending.**

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

## Regression reconciliation and native action-driven validation — 2026-11-05

**Saved tests:** PR #16 includes `tests/animation.test.js` (current Git blob `9456ffdcdf73f397c15a520b48f75a6cc91ca569`; earlier test blob `ec15263acd89508ecc4590671cbbd516f3fc3ee6` is preserved in Git history). The historical Marin idle-ball expectations were **not simply weakened or deleted**: the test strictly asserts `forward=1, height=1.45` for the original non-Juniper baseline and `forward=6, height=1.05` when the authoritative donor mapping selects Juniper. The dedicated migration test strictly checks the 9-tick Juniper 9/8/9 forward path and unchanged canonical bounce; for Echo it strictly checks the **published PR #6 donor track on both axes multiplied by the original 1/.88 visual-size scale**. The original Echo baseline and Juniper candidate have both been separately executed and passed with the current saved tests.

**Exact saved source and saved-test combined validation:**

- [GitHub Actions run 42100248465](https://github.com/Manaconda33/Conda-Jam/actions/runs/42100248465) retrieved the exact PR #16 animation source and test blobs, verified their Git hashes, ran all three selected regression tests **3/3 passed, 0 failed**, and repeated the 36-image full-bounce check **4/4 scenarios passed**.
- [GitHub Actions run 42100569559](https://github.com/Manaconda33/Conda-Jam/actions/runs/42100569559) repeated those same passing tests and bounce checks, then ran the complete original *simulation-driven normal-loader* 16-scenario harness on the pinned PR #6 + #7 combined checkout **with the saved PR #16 candidate source and tests**.
- **16/16 live action scenarios:** idle-ball, normal dribble, turbo-dribble, and genuine Marin-to-Kraken pass/catch, each at both facings and both 100%/120% zooms. **136 PNG screenshots**, **300 simulated frame-state records**, **zero reported browser errors**; every checked Marin atlas was registered Juniper source.
- Kraken received **all four real passes at step 10**, with catch corrections **±0.00909090909 world X and −0.00218181818 world Z**, within the prior **0.02 X / 0.01 Z** acceptance tolerances. These were actual possession transitions, not manually forced catches.
- Preserved temporary [live-scenario screenshot evidence artifact 13449951343](https://github.com/Manaconda33/Conda-Jam/actions/runs/42100569559/artifacts/13449951343) and [36-frame bounce artifact 13449856591](https://github.com/Manaconda33/Conda-Jam/actions/runs/42100569559/artifacts/13449856591).
- For future evidence reconciliation after artifact expiry: downloaded original **live-scenario ZIP SHA-256** `d01c5dcb1a54b3733bc274cc548fd633c4f4d16811b532430ef176b382569d37`; `report.json` SHA-256 `d7cd69ef01947232580134a9f16fb71db20740e626dd1d7fa52c1e80ef94bc5c`. The report contains per-screenshot hashes and frame-by-frame mechanics, but the PNG archive itself remains subject to GitHub Actions retention.
- Per-scene screenshot counts: idle-ball 24, normal dribble 28, turbo-dribble 28, pass/catch 56. All sixteen scenarios and their exact input heads are attributable to the above run.

**This is a passing *review-only compatible source-and-tests candidate*.** The original unmodified combined branch's two historical assertion failures remain intentionally visible in PR #13's original diagnostic job. Do not misread that expected-red baseline job as a failure of the corrected isolated candidate, nor imply the corrected code/test changes have already been integrated into PR #6 or #7.

**Still required:** independent visual/pixel-contact signoff on relevant poses and transitions; non-sparse complete regression suite and archival provenance checks; combined strict audit/status regeneration; and owner review/merge authorization. The temporary screenshots and this mechanical check do not grant production acceptance.

## Echo original-donor backward compatibility — verified, 2026-11-05

- Original source remains **PR #6 commit `55a2ab104d6b108cc08132fddc01b32afb958e75`** and animation source blob `d2540e37cc8cb635e3263a54f5794052fd8d6847`. Its original Echo Catwalk donor mapping and Marin idle-ball expectations (`forward=1`, `height=1.45`) were verified before substituting the saved PR #16 test *only inside the temporary runner*.
- [Initial fail, run 42101493954](https://github.com/Manaconda33/Conda-Jam/actions/runs/42101493954): two legacy assertions and the actual Marin-to-Kraken pass/catch test passed; the new dedicated migration test incorrectly assumed Echo's bounce heights were unscaled Juniper heights. The discrepancy was in the newly authored **test expectation**, not in a demonstrated production regression.
- **Root cause established from the unchanged PR #6 runtime:** the original Echo donor is compact, and Marin's athlete-specific `ballTrackScale` is `1/.88`. Echo's authentic authored forward samples across ticks 4–12 are `[11,11.5,12,12.5,13,13,13,12.5,12]` before scaling; its authored height samples are `[.85,.70,.55,.40,.25,.125,0,.125,.25]` before scaling. The corrected test checks each scaled value within `1e-12`, checks the exact scale and donor identity, and separately requires floor contact at tick 10.
- The improved regression test was committed as immutable Git blob **`9456ffdcdf73f397c15a520b48f75a6cc91ca569`** on this review branch; no game source was altered to satisfy the test.
- [Corrected original Echo run 42101692226](https://github.com/Manaconda33/Conda-Jam/actions/runs/42101692226) **PASSED**: 3/3 strict focused tests, zero failures, original PR #6 source and visual donor untouched.
- [Retested combined Juniper run 42101770297](https://github.com/Manaconda33/Conda-Jam/actions/runs/42101770297) **PASSED** with the *same* saved source and corrected test blobs: 3/3 strict focused regressions, 4/4 complete 9-tick bounce scenarios (36 captures), and 16/16 live idle/normal-dribble/turbo/pass-catch scenarios (136 screenshots), with four genuine Kraken catches, no reported browser errors.
- [36-image full bounce artifact](https://github.com/Manaconda33/Conda-Jam/actions/runs/42101770297/artifacts/13448803495) and [136-image live transition artifact](https://github.com/Manaconda33/Conda-Jam/actions/runs/42101770297/artifacts/13449288211) are subject to GitHub Actions retention. This Markdown record and the exact source/test blobs are durable in the repository.

**Conclusion of this small pass:** PR #6 Echo backward compatibility is verified, and the stricter test is also green on Juniper. Neither passing result constitutes independent visual art signoff, a complete non-sparse integration audit, or merge authorization.

## Additional visual triage and complete normal-dribble capture — 2026-11-05

- **Durable detailed visual evidence:** [Marin rendered-contact triage](./MARIN_RENDERED_CONTACT_TRIAGE_2026-11-05.md) (representative screenshots, SHA-256 hashes, source boundary, visual concerns, unresolved art signoff).
- The previous successful 136-screenshot live-scenario validation stopped the **normal dribble** screenshots at animation tick 8, although its physical floor bounce occurs at **tick 15**. The missing full-cycle visual coverage is now explicitly addressed by a new diagnostic workflow.
- [New full normal-dribble probe run 42103174543](https://github.com/Manaconda33/Conda-Jam/actions/runs/42103174543) **PASSED**: 4/4 direction×zoom combinations, **88 actual gameplay screenshots**, 33 sampled frame states per combination (132 total), unmodified registered Juniper artwork and preserved Marin possession. Validated normal-dribble frame 5 at floor-contact tick 15, and the loop reset at tick 30.
- [Artifact 13451055105](https://github.com/Manaconda33/Conda-Jam/actions/runs/42103174543/artifacts/13451055105) contains the 88 PNGs and reproducible `report.json`. Exact ZIP and report hashes are retained in the triage note.
- Screen review found visually separated wrist and ball during some **airborne** normal-dribble poses; such separation alone does not establish error because the ball is intentionally released between impacts. **No new track values were changed** and no independent art/pixel-contact signoff is claimed. The next art-review action is to assign contact expectations by phase (held/released/ground/catch), not force midair poses to touch a hand.

## Remaining gates, intentionally not waived

1. Independently check actual sprite-to-ball contact and motion (both facings/zooms), including hand, shoe and court-plane bounce. Do not mistake a numerical track match for pixel contact.
2. **Mechanically verified:** idle-ball, normal dribble, turbo dribble, and genuine Marin-to-Kraken live pass/catch completed the 16-scenario native-gameplay matrix in both facings/zooms. **Still open:** independent visual contact acceptance of relevant poses/transitions and broader integration.
3. **Scoped regression migration completed:** historical strict Marin values retained for PR #6 Echo; the Juniper-specific authored values are asserted separately; both saved-source variants pass focused regression checks. **Still open:** full regression suite, independent review, and integration approval. The original unmigrated combined-baseline check remains red by design.
4. Run the full *non-sparse* test suite, source/provenance validation and complete audit as appropriate; a prior sparse runner omitted large raw assets.
5. Reconcile the full integration of PR #6, PR #7 and their dependent PR stack, and produce a separately authorized review-only integration branch with independent QA.

**No merge, deployment, production branch modification, or Myth workspace access is authorized by this checkpoint.** This branch is solely a recoverable, explicit code candidate. Keep PR #13 draft/unmerged and the original PR #6/#7 heads unchanged.
