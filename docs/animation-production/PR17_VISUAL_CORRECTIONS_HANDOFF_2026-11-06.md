# PR #17: visual hold correction acceptance handoff (November 6, 2026)

**Status: EXACT REPRODUCTION VERIFIED; TWO VISUAL HOLDS OPEN.** This note is a targeted evidence handoff to the existing authorized animation/art production lane. It is **not** a generated sprite, accepted correction, permission to alter original PR branches or authorization to merge despite these holds.

## Engineering baseline (no reason to change working gameplay)

- Full actual combined PR #17 CI after isolated per-action uniform cache correction: [Actions run 42272204285](https://github.com/Manaconda33/Conda-Jam/actions/runs/42272204285) **588/588 original + added tests PASS**, lint, full content, league simulation, build, audit-identity and authoritative report comparison all PASS. The regenerated report retains **706 missing authored clips**, **40 disclosed non-verbatim prompts**, **0 novel finding identities** and **strict artwork status `ok=false`**.
- [Previously proven non-sparse actual full-tree validation](https://github.com/Manaconda33/Conda-Jam/actions/runs/42263232001) physically checked 55,024 paths, with no missing file.
- A clear engineering test signal does not establish acceptable contact or source-art continuity. Do not change global ball physics, frame sampling, palette masks, title-screen or preview renderer to conceal original sprite discontinuities.
- The owner has approved the inherited art/provenance backlog exception and dependency-aware integration order, but **has not independently accepted either of the specific visual defects here**.

## Visual HOLD A: Marin Dusk normal-dribble hand/ball contact

Source evidence is already in [MARIN_CONTACT_VISUAL_QA_HOLD_2026-11-05.md](MARIN_CONTACT_VISUAL_QA_HOLD_2026-11-05.md). I re-inspected the original normal-loader screenshots from successful [Action 42103174543](https://github.com/Manaconda33/Conda-Jam/actions/runs/42103174543), artifact [13451055105](https://github.com/Manaconda33/Conda-Jam/actions/runs/42103174543/artifacts/13451055105) (88 frames, all four facing/zoom combinations). No replacement art was generated.

**Repro**: `right-zoom120-dribble-step01-dribble-idle.png`, `step02`, `step31` and `step32`, and corresponding left-facing files. At loop entry and wrap, the projected ball sits around Marin's face/upper torso while the visible forward working palm is lower. The simulator's `expectedHandMarin` agrees with the ball's mathematical position, **not necessarily the hand pixels**. The mismatch is therefore not fixed by a passing hand-anchor assertion. Step 0 `idle-ball` has a different pose and contact relationship. Floor bounce steps 15–18 remain visually plausible; the existing court impact is precisely at tick 15.

**Required correction decision**: first identify the right-facing Juniper `dribble` frame-0 wrist/fingertip center in source atlas and match it to the ball's onscreen radius. Establish which phases truly require touch (release, bounce, reacquisition) versus intentional airborne separation. If the error is the Marin-specific normal-dribble anchor, change only Marin's normal-dribble horizontal/vertical track at affected ticks or frame boundaries, preserving interpolation smoothness and existing floor contact; do not change the verified `dribble-run` turbo forward sequence **9/8/9** at frames 3/4/5, nor original Echo/other donor behavior.

**Acceptance captures**: original and revised steps 0–3, 14–18, 29–32, across left/right facings and 100%/120% zoom; include genuine action-driven simulation, *not* forced-pose shots alone. Review hand-ball contact at the actual visible palm for the held/recovery phases, plausible arc and no instant jumps between loop ticks, court impact at tick 15, no scene errors or game-mechanic regressions. Log per-frame pixel annotations and chosen scale, unchanged source-art hashes, and corrected source blob/test provenance.

## Visual HOLD B: Kraken receive source-art continuity

Source evidence and cause: [KRAKEN_RECEIVE_SOURCE_ART_DIAGNOSIS_2026-11-05.md](KRAKEN_RECEIVE_SOURCE_ART_DIAGNOSIS_2026-11-05.md). I re-inspected original source WebP atlases from [run 42168891431](https://github.com/Manaconda33/Conda-Jam/actions/runs/42168891431), [artifact 13479523465](https://github.com/Manaconda33/Conda-Jam/actions/runs/42168891431/artifacts/13479523465). The originals and `frame-geometry.json` are byte-preserved evidence from PR #6, not new art.

**Repro**: `kraken-receive-right.webp` has four 80×96 frames in 2×2 layout. Frames **0, 1, and 3** use a visibly darker, thinner/simpler silhouette, cooler/duller garment treatment and less saturated shading than the more coherent and saturated **frame 2**. Comparison to `kraken-pass-right.webp` (six frames, 3×2) shows the later richer treatment. This visual mismatch is **already in original authored source**, before the runtime selects or mirrors the frames; it is not caused by the newly reviewed palette-cache fix (captain sprites never enter donor palette derivation).
- Original registered receive atlas SHA-256: `e6676faa9e2deff7ddbb0d94f87d3d02e54538d8a9802ef2c3e98a8bd53cddbb`.
- Historical frame arrangement: 0 anticipation, 1 reach, **2 catch**, 3 securing/recovery. Source composite lineage includes attempt-01 frames 0/1/3 and cleaned attempt-02 frame 2.
- Measured mean saturation: frame 0 `0.608`, frame 1 `0.605`, frame 2 `0.843`, frame 3 `0.609`; `pass` average approximately `0.830`.

**Required correction**: the authorized art production lane should prepare *original-authored* improved versions of **frames 0, 1 and 3**, preserving the accepted frame-2 catch pose and its precise timing/hand position. Preserve four registered frame slots and source/attempt genealogy; do **not** simply duplicate/recolor original `pass` frames, spoof authoring provenance, or use uniform palette manipulation to hide the contrast. Retain intended anticipation, reach, ball trap and recovery poses. Keep existing `receive` durations **[2,2,1,3]**, exact ball height **[1.3,1.4,1.74,1.2]** and forward **[3,4.5,3,2]** unless a separately measured hand-contact issue justifies a per-action change.

**Acceptance captures**: rehash revised source frame crops, compare skin/garment/outline/brightness against accepted frame 2 and `pass` baseline, validate per-pose alpha silhouette and baseline. Run real Marin→Kraken pass/catch at steps **5,7,9,10,11**, both facings and both zooms. Verify actual wrist/fingertip contact, ownership handoff, zero browser errors and no mismatched line weight/brightness jump within `receive` or during transition to/from `idle`/`pass`. Independently inspect original against candidate and accept only reviewed source, then rerun focused and complete integrated CI.

## Disposition and protected boundaries

This pass **confirmed both holds from original archived evidence** without changing art or gameplay. Reviewer accepts the previous engineering checks, not visual-quality signoff. Keep the two visual issues open until independently approved corrected source or explicit separately documented acceptance of the existing exact visual appearance.

Preserve original published PR #6, #7, #13, #16, `main`, and protected Myth workspace. Owner-approved sequence **PR #17→PR #6→main** remains conditional on both specific visual holds and required post-correction checks. Do not merge a red/unknown visual state just because the current 588-test engineering gate is green.
