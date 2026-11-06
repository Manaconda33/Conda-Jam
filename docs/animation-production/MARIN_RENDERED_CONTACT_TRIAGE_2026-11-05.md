# Marin Dusk / Juniper Vale: rendered-contact triage, 2026-11-05

**Classification: diagnostic visual triage, NOT independent art acceptance or approval to merge.**

## Exact evidence and source scope

This review examines actual registered-gameplay screenshots, not schematic or mockup sprite renders. The test input combines immutable main `7e700c0eb392800794167007e076c51ac8357a77`, PR #6 `55a2ab104d6b108cc08132fddc01b32afb958e75`, and PR #7 `97119d54fd24c442c15192a798cae1e8a279eb1d` **inside a read-only CI runner checkout** with the exact saved source `src/core/animation.js` Git blob `2b1413fce2582fd588f7df111bfb719e8605f046`. Marin's rendered donor is **Juniper Vale** and the turbo frame 3/4/5 forward controls are **9/8/9**. No published/source branches were altered.

- Existing full live-transition probe: [run 42101770297](https://github.com/Manaconda33/Conda-Jam/actions/runs/42101770297), [artifact 13449288211](https://github.com/Manaconda33/Conda-Jam/actions/runs/42101770297/artifacts/13449288211): 136 screenshots across 16 gameplay direction/zoom/action scenarios, no browser errors, four actual Kraken catches. Archive SHA-256 `fe9bf63641ce4b7872f8f51701679e6ba763fd156e643d073441a59d5540e582`.
- **Coverage deficiency discovered in the source capture list:** the original normal `dribble` scenario captured only steps `[0,1,2,3,5,7,9]`; `dribble` duration is 30 simulation ticks with its floor-contact frame 5 at tick 15. Those earlier images stop at normal-dribble tick 8, *before* ground contact. The previous evidence supported pass/catch and turbo full-bounce mechanics, but **not a complete normal-dribble visual review**.
- To close that gap, [new dedicated diagnostic workflow](https://github.com/Manaconda33/Conda-Jam/blob/maintenance/pr6-pr7-reconciliation-probe/.github/workflows/marin-full-normal-dribble-visual-probe.yml) was committed on PR #13 at `2acdf48988a5a8b6a13229d5f15ca92a2db91a87`. The runner uses the exact saved PR #16 animation source. No sprite or gameplay production source was modified.
- **New [full-cycle run 42103174543](https://github.com/Manaconda33/Conda-Jam/actions/runs/42103174543): PASS.** [88 screenshot + JSON evidence artifact 13451055105](https://github.com/Manaconda33/Conda-Jam/actions/runs/42103174543/artifacts/13451055105): left/right × 100%/120% × **22 real screenshot samples** each, through initial idle, the entire descending bounce, floor contact, ascending rebound, and loop wrap; 4 runs × 33 frame-state samples = **132 simulated states**.
- New ZIP SHA-256 `5b9d428f1eb7a4acb0e642e237e35da4503c7ff1d06b449a6ccd9957640487c9`; exact extracted `report.json` SHA-256 `d2254bcee95013c730bc492c159f10cdd243bd2d8e76a79bc51eaeca4d3db7ef`. These hashes can later identify the original images/report but are **not substitutes for retaining their binary bytes**.

## Findings grounded in visible rendered frames

| Scene / selected sample | On-screen observation | Disposition |
| --- | --- | --- |
| Idle-ball, steps 0, 8, 24 (both facings, 120%) | Separate orange ball remains near Marin's forward/low ball-ready arm through pose changes, mirrored directions show corresponding placement | No obvious major tracking discontinuity in representative images; detailed hand/palm pixel contact still **unapproved** |
| Normal dribble, steps 2 and 7 (both facings at 120%, also viewed at 100%) | Ball is visibly separated from Marin's extended fist while descending, at times projected nearer the face than the low reaching wrist. A dribbled ball should be airborne away from the palm during release, so **gap alone is not proof of an animation defect** | **Art review needed:** specify intended hand-contact/release pose and judge timing against sprite arm motion before changing horizontal or vertical values |
| **Normal-dribble floor contact**, step 16 / simulated tick 15 / sprite frame 5, across 4 facing/zoom combinations | Ball is visibly near court height in front of Marin's leading foot; in-frame descent and subsequent rebound continue smoothly, consistently mirrored | Ground contact **mechanically verified** `ball.z - marin.z = 0` at tick 15. No evidence warrants moving the ball vertically to touch the raised hand. Fine-grained ball-to-court edge contact and ball-to-wrist distances remain uncertified |
| Normal-dribble restart, step 31 / simulated tick 30 / sprite frame 0 | Visual sprite/ball returns to the first normal-dribble pose after completing the bounce loop | Mechanically verified at tick 30: `height=1.2`, atlas frame 0, possession retained; no teleport apparent in sampled sheets |
| Turbo dribble, steps 3, 5, 7, 9 (both facings 120%) plus prior dedicated frames 3–5 review | The corrected 9/8/9 sequence brings the low ball nearer the forward-hand horizontal lane through bounce poses; mirroring is consistent. Some vertical separation is expected during flight | Continue with independent **pixel-contact** signoff. Do not assume mathematical `expectedHand` fields are actual sprite fingertip coordinates |
| Genuine pass/catch, steps 5, 7, 9, 10, 11 (both facings 120%) | Ball visibly travels from Marin toward Kraken; the catch occurs, with a distinct receive stance. The apparent visual scale/pose changes between earlier ball-ready and full-throw sprites merit an **art consistency review**, not an automatic defect claim | Mechanics passed (four actual catches, small corrections), but hand/ball overlay and pose scale cannot be certified from the numerical test alone |

**Important visual-review scope:** contact sheets were formed from actual PNGs and representative poses were inspected across right/left and 100%/120% captures. This is a *single-assistant diagnostic examination*, not an external artist's independent approval. It does not certify all 224 screenshots at a pixel-landmark level, prove correct fingertip contact for every pose, or establish an original Myth source identity.

## Full-cycle machine checks and representative immutable screenshot hashes

Full normal-dribble `dribble` duration: 30 ticks. Test input is a genuine gameplay input, not direct hand-position rendering. The runner verified **4/4** direction/zoom combinations, **88/88** screenshots, **0** reported browser errors, `marin-dusk` continuous carried-ball ownership, selected registered `juniper-vale` source atlas, horizontal world motion no greater than 0.335 units per tick across the first 29 tick transitions, floor contact at tick 15 and seamless source-clip loop at tick 30. Ball's measured heights near the ground-contact event, ticks 12–18: `[0.20,0.1333,0.0667,0,0.0833,0.1667,0.25]`. These are **simulation heights**, not pixels measured against the court art.

Representative file SHA-256 values, preserved to recover/verify exported screenshots:
- **Right 120%, step 2**, `right-zoom120-dribble-step02-dribble-idle.png`: `48334a21cf4182c635233ebb548814f4e0e78e3054e4b4be0b0b59a58868ce56`
- **Left 120%, step 2**, `left-zoom120-dribble-step02-dribble-idle.png`: `a9d8afea11cb1f2e34139babd2b4f305f634dabb36b77cbbba08b588c55b7ab2`
- **Right 120%, step 7**, `right-zoom120-dribble-step07-dribble-idle.png`: `9a19e397fe4e5956bcc12a82529515a7e23db3cdab4d20e738f8174bfcac70f3`
- **Left 120%, step 7**, `left-zoom120-dribble-step07-dribble-idle.png`: `c8bfb6591c7efd648ad5ffa3cc19b059298c847e8d9d8f9c0f1b9e320df2449e`
- **Right 120%, tick 15**, `right-zoom120-dribble-step16-dribble-idle.png`: `1241af4fb7681c2cd07febb17cb16b8db25eb9141b78c00d72375f3702d4127a`
- **Left 120%, tick 15**, `left-zoom120-dribble-step16-dribble-idle.png`: `617ad7db9a5e07e1aadbc1fab50b0a08abe73be4b9779a60bdbe2dac8db8ed5f`
- **Right 100%, tick 15**, `right-zoom100-dribble-step16-dribble-idle.png`: `94a8ae58b60dfec0b5a82e3654881c69f2e69a9dbe3127f480550b428d0ec692`
- **Left 100%, tick 15**, `left-zoom100-dribble-step16-dribble-idle.png`: `5d1d7411f46e937185d10209f00919678b21cea3d2eee64520ee7667ed4aec13`

## Decision and future work

1. **No further speculative horizontal or vertical track edits in this bite-sized pass.** The covered poses establish a sound physical bounce but do not prove or refute intended fingertip contact. First define whether each pose is intended as *hand-carry*, *ball release/flight*, *court impact* or *catch* and inspect full-resolution screenshots against those contact expectations. Do not force air/ground phases into the hand.
2. Seek **independent art/pixel-landmark acceptance** of Marin's wrist/fingertip relative to ball center/radius at identified release/contact poses; also investigate the visible pose-size shift in pass frames against production atlas dimensions and intended camera motion.
3. Proceed with the separate **full non-sparse test and provenance** integration gate after visual triage; preserved prior mechanical checks and two-donor regression migration remain green.
4. Keep the diagnostic PR #13 and source review PR #16 draft/unmerged. Original PR #6/#7, `main`, all remote production art, and unavailable original Myth workspace remain untouched.

**Artifacts are time-limited** (GitHub Actions retention 7 days in the diagnostic workflows). This Markdown record, pinned source SHA, report/archive hashes, stage timing and screenshot names remain committed, but future pixel review must occur before expiry or be performed again from the reproducible workflow.
