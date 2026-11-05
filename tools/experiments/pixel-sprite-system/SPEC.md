# Componentized Sprite System Spec v1

## Purpose and boundaries

Prove whether bespoke pixel-art construction can move from one-off whole-character scripts into a reproducible modular asset pipeline for Conda Jam. **A well-designed component engine is necessary but not sufficient for high-quality artwork.** A pilot remains gated on independent visual review. This is neither an image-model replacement mandate nor an automatic conversion of every current player asset.

### Preservation contract

- Keep `src/`, `public/assets/`, existing animation manifests and ongoing production PRs unmodified.
- Generate code-defined RGBA assets only; no procedural copy of reference image pixels and no source PNG-to-vector tracing.
- Preserve Manaconda's right-facing on-court identity: olive-brown skin; gray-streaked curls; salt-and-pepper beard; rectangular deep blue spectacles; **flowering temple branches sweeping backward toward his pack**, not upward antlers; purple-indigo scarf; violet/gold uniform; white sleeve; white tights; basketball shoes; no baked-in ball or external shadow.
- Reed Ashcroft is the reuse pilot: medium-brown skin, dark braided topknot, short goatee, Condas palette, no glasses/crest/scarf.

## Coordinates and schemas

- **Raster:** 128×192 logical pixels, origin `(0,0)` at upper left, transparent RGBA. Reference facing RIGHT three-quarter view.
- **Baseline:** both shoe soles at y184, with at least three pixels transparent gutter. Atlas tiles must be disjoint and contain no dividers, background, labels, balls or ground-shadow pixels.
- **Order:** compositor uses a deterministic back-to-front `Rig.depth` list. A part must return *only* a new transparent full-cell layer. Compositor clips no other part, and may remove or replace exactly one layer.
- **Rig anchors:** head, jaw, neck, rear/front temple, scarf root, rear/front shoulders, elbows, wrists, hips, knees, ankles, heels, toes, chest and pelvis. Every anchor exists in `Rig.anchors()` for each pose.
- **Recipe:** data-only frozen `Recipe`, with IDs, rig/build, material palettes, hair/beard/eyewear/crest/scarf IDs, white sleeve/tights/shoes IDs and dimensionless part parameters (`glasses_thickness`, `crest_length`, `blossom_count`, `scarf_length`, `beard_fullness`). No global mutable character state.
- **Pose:** data-only frozen `Pose`, encoding breathing, crouch, head/shoulder positions, hand positions, scarf wave. No hidden transforms or synthesis from existing animation PNGs.

## Rendering and edit architecture

```
Recipe + Pose
       |
       v
  humanoid Rig (named joints)
       |
       v
  19 independent component layers
       |     (each RGBA 128x192)
       v
  ordered alpha compositor
       |
       +-- single idle transparent PNG
       +-- 3x2 six-frame idle atlas
       +-- 19x6 workbench part atlas
       +-- variant part atlas (4 edited pieces x 6 poses)
       +-- QA previews and metadata
```

The browser workbench composes 19 pre-rendered parts. The artist or developer can toggle visibility, swap an alternative part, inspect anchors, change athlete, and play poses. It cannot generate novel anatomy by sliders alone: a structural edit requires updating `components.py` and rerunning `build_pilot.py`. This makes the editing boundary explicit rather than pretending everything is fully parametric.

## Component inventory and reuse designation

| Part group | Component layers | Reusable scope |
| --- | --- | --- |
| Anatomy | `rear_leg`, `front_leg`, `rear_arm`, `front_arm`, `neck`, `head` | Humanoid with proportion parameters |
| Footwear | `rear_shoe`, `front_shoe` | Reusable across athletic humanoids |
| Uniform | `shorts`, `torso`, `uniform_emblem` | Franchise palette, material, identity patch |
| Head identity | `hair`, `beard`, `glasses`, `facial_highlights` | Swappable identity overlays, some bespoke |
| Signature hero art | `crest_back`, `crest_front`, `scarf_back`, `scarf_knot` | Character-specific, motion-controlled attachments |

A broader asset library would store individual variants behind stable IDs and avoid naming recipes after a user's ethnicity or biometric traits. The current source combines anatomy and skin under one recipe because this is an original character only.

## Delivered milestones

1. **Foundational engine:** component registry, raster painter, alpha compositor and deterministic recipe/rig/pose structure.
2. **Manaconda rig:** 19 independently generated layers, plus static idle composition.
3. **Six-frame idle:** six distinct joint/cloth keyframes in a 384×384 sheet.
4. **Edit locality:** glasses, blossom, scarf and beard edits in distinct component layers; tests enforce no unrelated layer changes.
5. **Reuse proof:** Reed Ashcroft constructed from same humanoid rig, cloth/uniform/leg/shoe components and six poses, while changing skin/hair/face/beard/glasses/crest/scarf recipe details.
6. **Workbench:** direct layer swapping and pose preview with optional skeleton overlay, completely offline.
7. **Acceptance harness:** pixel format, transparent gutters, pose uniqueness, anchor articulation, edit locality, exported atlas reconstruction, reproducibility.

## Acceptance gates

### A. Automated integrity (implemented)

- exact dimensions, RGBA and at least 3-pixel transparency around every frame, including fantasy accessories
- 19 separately addressable layers, all available for both athletes, empty layers accepted when a recipe omits an accessory
- six unique idle images, knees/hips/wrists visibly change positions, feet remain anchored
- deterministic re-render and exported atlas reconstructs exact full image for all poses
- each isolated edit touches exactly its intended layer
- no generated paths in production asset registry

### B. Visual acceptance (manual, not yet passed)

- Manaconda still unmistakably identifiable at actual in-game draw size, including glasses, scarf, beard, and *backward* crest
- no joints that read as sticks, disconnected apparel, hand/arm clipping, faceless helmets or inappropriate proportions
- six-frame loop not visually jittery (pixel center shift, heel pops, ankle/hip mismatches)
- no visible seams when parts move across each other
- the generated source is not judged as an improvement unless the user accepts the art at **native size**, **near-field court size**, **far-field court size**, and **both horizontal facings**

### C. Integration and gameplay (not attempted)

- opt-in renderer/manifest selector using the existing game's image loader and frame timing; original sprites remain authoritative default
- official frame pacing measured in browser, 480×360 logical viewport
- ball ownership, hand position and facing checked in production native stage at 100% and 120%; no hard-coded physics change
- regression suite, lint, test:e2e and current GitHub CI pass before any production asset replacement can be proposed

## Next technical milestones

1. **Art QA loop:** revise sculptural anatomy against the target, particularly heads, shoulders, hands, pants and expressive cloth. Treat this as an art-director acceptance gate, not an automatic next production phase.
2. **Perspective-aware rig:** rear/front layer ordering, hand orientation, walk/turn behavior and independent face orientation, rather than simple mirrored identity.
3. **Motion primitives:** deterministic interpolation with pose keyframes and motion-arc constraints; prevent foot sliding, limb separation and scarf intersection.
4. **First action experiment:** only after approving idle, create run/idle-ball for Manaconda; compare against original registered clips in a side-by-side native game stage.
5. **Scale test:** reproduce a third humanoid with a different body profile and measure total time and per-character code/asset change size.
6. **Nonhumanoid family:** separately specify quadruped fox, dragon, cobra, wombat and long-arm hybrid rigs; do **not** force existing fox/dragon/cobra anatomy into humanoid anchors.
7. **Packaging:** if accepted, introduce component dependency graph, palette swap tables, template metadata, caching, and versioned hashed generated sprites.

## Objective success metrics

- edits to a selected head/scarf/crest part must leave every unrelated layer bitwise unchanged
- no default-game visual regression and no new production dependency
- two character recipes use identical rig and output contracts, both passing gutter and pose checks
- visual reviewers score identity and anatomy at actual court resolution before additional roster rollout
- later work should track effort and quality vs ImageGen baseline; code generation is not automatically superior or cheaper at this level of manual detailing
