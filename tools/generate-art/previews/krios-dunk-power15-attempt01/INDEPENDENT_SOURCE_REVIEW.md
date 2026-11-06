# Krios J.128 dunk-power attempt01 — independent source review

**Verdict: PASS for careful cleanup and layout trials only. This raw sheet is not approved for registration.**

Generation: `exec-b4f2d93c-13cb-498b-b496-d84404acea8a`
Raw SHA-256: `8fce5864f9e45b4e0ec38daacb4667091cccd6a3750d88becca4d80378bd6e22`
Prompt SHA-256: `396b18c0740bb63b0762ff674137ad19c722a4d5bbc697fd38dc4ccbdedddda8`

## Checks that pass for cleanup trials

- The sheet contains fifteen full-body Krios drawings arranged in the requested 5×3 row-major order. Each figure is separated by green background and has all horns, hands, shoes and legs inside the source bounds; there are no white grid rules or baked basketballs.
- Krios remains recognizable across the sheet: volcanic-red skin, curled black ram horns, charcoal beard, broad muscular human anatomy, dark Scoria uniform and ember-red piping. Every pose has two connected arms and legs. The action reads from low cradle and load through ascent, two-hand overhead gather, forward dunk/release, and controlled landing.
- The pixel-art rendering is consistent enough to test at the target sprite scale. The generated chest ram/skull mark is repeated across frames, and the body orientation stays predominantly right-facing.
- The pose sheet can be segmented by its green background without needing to reconstruct anatomy. Cleanup must preserve the complete outer silhouettes, remove the green around the horn curls, and keep a shared scale and baseline.

## Production cautions

Frames 6–8 (grab, late ascent and peak) are close together in silhouette; frames 9–12 (descent, pre-release, release and finish) also have a similar forward reach. Verify all fifteen extracted 64×96 images remain visibly distinct at native size. Frame 11 is the required release pose; keep its open fingers distinct from frame 10's still-gripping hands and frame 12's post-release follow-through. Preserve the actual no-ball artwork in every cell.

The red chest emblem is not established by the supplied uniform description and is more prominent than on the existing Krios push reference. Compare the cleaned sprite against accepted Krios art at native scale. If it reads as an unintended costume change, reject this generation rather than silently painting over it.

This review covers only the raw source. Cleanup, native-size separation, alpha, margins, alignment, ball-track calibration, gameplay anchors, and registered-runtime inspection remain required before production acceptance.
