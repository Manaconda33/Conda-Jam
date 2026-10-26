# J.130 Briar Foxglove `layup` — final integration review

Date: 2026-10-26 UTC. This review supersedes the earlier provisional status notes; the earlier attempts, rejected candidates, and original reviews remain preserved.

## Art and atlas

The selected eight-pose integration candidate is `tools/generate-art/candidates/j130-briar-foxglove-layup-attempt-04-integration/briar-foxglove-layup-8x-integration-candidate.png` (288×190 RGBA; 4×2; cells 72×95; baseline local y=89). The sequence reads approach, takeoff/gather, compressed gather, rising gather, release, follow-through, descent, and grounded recovery. Independent review accepts distinct timing, full anatomy, Briar identity, empty-handed source art, pose separation, and baseline alignment. Corrected native Jam Stage captures select each intended cell in 16 ordinary-frame renders at 100% and 120%, right and left facings. The left-facing renderer mirror is process-local for review.

Per-frame alpha>=16 bounds and L/T/R/B margins in the 72×95 cells: frame0 `[5,6,67,89]` / `[5,6,5,6]`; frame1 `[9,6,62,89]` / `[9,6,10,6]`; frame2 `[10,6,61,89]` / `[10,6,11,6]`; frame3 `[13,6,58,89]` / `[13,6,14,6]`; frame4 `[12,6,59,89]` / `[12,6,13,6]`; frame5 `[14,6,58,89]` / `[14,6,14,6]`; frame6 `[9,6,62,89]` / `[9,6,10,6]`; frame7 `[8,6,64,89]` / `[8,6,8,6]`. Each sprite remains within its cell. Light/dark atlas proofs are stored alongside the candidate.

Pose02 attempt04 is retained from raw ImageGen output through normalized candidate with exact prompt, generation ID, source SHA, layout, and cleanup notes. At alpha>=16 its normalized cell is one 8-connected component. At alpha>=64, 8-connectivity yields one component; 4-connectivity separates three diagonal edge-touch groups (2, 2, and 1 pixels). Visual checks show no detached marks on light/dark proofs or native captures. All pixels are retained without masking or redrawing; this threshold-only connectivity detail is documented in the provenance and alpha-component review.

## Separate ball track

Accepted Briar-specific carried samples through release (frames0–4): height `[1.54,1.635045,1.53,1.550734,1.71701]`, forward `[2.5,2.65,3.6,1.43926,4.2]`. This ends with frame4 at tick10. Tick9 is carried by Briar; tick10 transitions to an ownerless shot. Frames5–7 are post-release flight/follow-through and have no athlete-owned samples; the game simulation controls the projectile. Native contact/release captures pass at 100% and 120%, both facings. Trial vectors 1–9 and their rejection reasons remain in `j130-briar-foxglove-layup-balltrack-trials.json`; track10 is selected.

A temporary copy of the real animation/simulation modules was run with track10, deterministic seed 12345, Briar selected, both facings, and neutral inputs. It confirms tick9 ownership, tick10 ownerless release, continued projectile integration, and one two-point score by tick100 in each facing. This checks release/flight wiring for this deterministic case; it does not claim broad gameplay shot-accuracy calibration. Full sampled output is preserved in `j130-briar-foxglove-layup-live-physics-check.md`.

## Preview harness correction

Older captures are historical and invalid as acceptance evidence: the harness injected candidate sprites after `game.start()` had snapshotted production sprite assets, while the report inspected a separate map; its pre-release ball capture also bypassed the candidate track override. Both orders are fixed. The corrected `final-100/` and `final-120/` reports render the candidate and track through the actual native Jam Stage path.

Exact prompt gaps for discarded pose02 attempt01 and pose04 retry31 parent attempts remain explicitly recorded in `j130-briar-foxglove-layup-prompt-archive-gaps.md`; selected pose02 attempt04 and pose04 retry33 retain their own prompts and provenance.
