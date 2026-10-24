# J.106 Keeg `alley-oop-power` — delegated pose08–14 lane

This lane generates and reviews each pose separately. It does not register an atlas or edit the shared manifest/provenance/runtime ball track. Keeg identity reference is K.03 and the existing `dunk-power` atlas. The basketball is never painted into pose art.

## Pose08 — ascent/cock transition

- Generation: `exec-1d0e611c-f4a4-4499-b60d-a658578aacb6`.
- Prompt: `tools/generate-art/j106-keeg-alley-oop-power-pose-08-prompt.md`.
- Raw source: `tools/generate-art/sources/j106-keeg-alley-oop-power-pose-08-attempt-01-raw.png`; SHA-256 `cc55f98cb62c5208ff29fa073947c241c59d9c91e549eab9759da47779efc934`.
- Clean review source: `tools/generate-art/sources/j106-keeg-alley-oop-power-pose-08-attempt-01.png`; SHA-256 `f38f00e4af6630c1dab110bed30eec15bbc2819615fcd20ab3e0866b6f65ea7d`.
- Cleanup: preserve RGB and alpha >16, clear alpha≤16 with `clean-j106-keeg-alley-oop-pose.py`; raw retained.
- Alpha bounds threshold16 `(67,91,989,1485)`, corners `[0,0,0,0]`. The 128×96 cell has a 60×90 figure with 34px side margins, 5px top and1px bottom.
- Preview: `tools/generate-art/previews/j106-keeg-alley-oop-power/j106-keeg-alley-oop-power-pose-08-cell-review.png`.
- Review: human anatomy/identity, full hat/hands/shoes, empty screen-right hand, no ball and cell margins/transparency pass. Hand height and leg shape differ from pose07; accepted as an isolated component only.

## Pose09 — high cock attempt01 rejected

- Generation: `exec-c0862aa3-59bd-4a97-9cc5-c03d77bed4b5`; exact prompt: `tools/generate-art/j106-keeg-alley-oop-power-pose-09-prompt.md`.
- Raw SHA-256 `31bea1c1859abf55419f2a4fc58e5f7040b45e634cee62d6e6b205a9c229ca80`; clean review SHA-256 `4ec1a7fd103315ef1ab1da34c09747298f51b267ca64d8621addb227ee269f13`.
- Its transparent cell fit is 60×90 with34px side margins,5px top/1px bottom; original and light/dark preview are preserved.
- Rejected after cell comparison: arm bend/hand position and torso silhouette are too close to pose08's ascent reach. Retry as a more compressed, leaned-back high windup.

### Pose09 retry02 rejected

- Generation: `exec-fa2995f9-5e9e-45ae-b81b-644958f70044`; prompt: `tools/generate-art/j106-keeg-alley-oop-power-pose-09-retry-02-prompt.md`.
- Raw SHA-256 `5df806fc5d1b94246b94af7e7ff24938c48d5c3fad38f8cc26f15052f6298b43`; clean review SHA-256 `89847f428f374b1bee69518dbffd24855a3ba0bf3dc71ce705606fbe75ca5508`.
- Transparent 56×90 cell,36px side margins; previews preserved. The more compact windup is distinct, but the raised ball-hand landed screen-left/behind the hat, opposite the approved track side and too close to ornaments. Retry with the palm screen-right of the hat as in accepted pose07.

## Pose09 — high windup retry03 accepted as component

- Generation: `exec-b1dde26f-367a-43ca-bacd-f3369e99091c`; exact prompt `tools/generate-art/j106-keeg-alley-oop-power-pose-09-retry-03-prompt.md`.
- Raw SHA-256 `9679b61433afce1b6986848a030b00bcc240034d122dca2eac254c3be5000fd3`; clean SHA-256 `d2d387dfb1d3f9c7d8eff931e1d3b43598b5afacd2370e8f66370c893a567f90`.
- 128×96 cell fit is 53×90,37/38px side margins,5px top/1px bottom. Transparent cleanup and complete anatomy pass; bent hand is screen-right of hat with a gap; pose is more compressed than pose08. No ball is drawn.
- Attempt01 and attempt02 rejected sources/prompts/reviews are retained above with their separate reasons.

## Pose10 — sole release

- Generation: `exec-5a8efa8e-0a92-4704-8be3-4db8e3b33844`; prompt `tools/generate-art/j106-keeg-alley-oop-power-pose-10-prompt.md`.
- Raw SHA-256 `dec07aada76e34a751d5977c65e541d3c33a94f0a6d14d58c25ad3f79480af52`; clean SHA-256 `2189f2ec9b350171672b36d8bb31f1d1ae4d9cfacc6ab0d872b1fdef2530d744`.
- Cell figure 58×90,35px side margins,5px top/1px bottom; white/dark review `tools/generate-art/previews/j106-keeg-alley-oop-power/j106-keeg-alley-oop-power-pose-10-cell-review.png`.
- Complete anatomy/identity and clear raised open hand pass; no ball is drawn. Pose10 is distinct from pose09's bent windup and is the only release frame; ball leaves sprite art and simulation resolves to the rim at tick21.

## Pose11 — post-release follow-through accepted

- Generation `exec-922b9b34-1bf9-4087-b011-541e2f4ca5d1`; prompt `tools/generate-art/j106-keeg-alley-oop-power-pose-11-prompt.md`.
- Raw SHA-256 `920b1c7a087a9f717852d7c6dcf6dd18bf524d9f0ef18719012e45d6b9f634aa`; clean SHA-256 `2f4c83b3f390030d4e9a0d6503a84de907e3e868bff644f2c89a0acbb8480d13`.
- Alpha cleanup preserves raw and zeros alpha≤16. Cell is 61×90 with33/34px sides,5px top/1px bottom; full human anatomy/identity and no-ball requirement pass. Relaxed wrist/fingers distinguish it from release pose10. Preview: `tools/generate-art/previews/j106-keeg-alley-oop-power/j106-keeg-alley-oop-power-pose-11-cell-review.png`.

## Pose12 — descent accepted

- Generation `exec-278e9559-a20d-456c-a09c-f313c3fc2453`; prompt `tools/generate-art/j106-keeg-alley-oop-power-pose-12-prompt.md`.
- Raw SHA-256 `4b790b4a19433e356651acf10314aa854df68f5ffdcf9907860441b6ad94179a`; clean SHA-256 `702fc874ccedd8f83e3900fc76008ccb1942bcffcce5e0f9fb1ce17efcabac4f`.
- Cell 58×90,35px side margins,5px top/1px bottom. Light/dark review confirms controlled descent, full anatomy/identity, clean alpha, no ball. Preview: `tools/generate-art/previews/j106-keeg-alley-oop-power/j106-keeg-alley-oop-power-pose-12-cell-review.png`.

## Pose13 — two-foot landing compression accepted

- Generation `exec-c64ed971-8ede-4f60-ac74-38adeb115f86`; prompt `tools/generate-art/j106-keeg-alley-oop-power-pose-13-prompt.md`.
- Raw SHA-256 `54244dea01368228a21dab3ee4dd9a66af4e4cff0dbdc8e0554fd3dd7c31b24e`; clean SHA-256 `1b46dc0e91a4f01965c6db826583a4df6b499322ade1a7255bce4b053809a5fa`.
- Full 1212×1297 image, alpha bounds `(109,39,1146,1279)`; 75×90 cell with26/27px sides,5px top/1px bottom. White/dark preview confirms both feet planted, knee compression, full anatomy/identity and no ball.

## Pose14 — stable recovery accepted

- Generation `exec-33da20b2-57d3-4e77-aceb-1ffc3e683d25`; prompt `tools/generate-art/j106-keeg-alley-oop-power-pose-14-prompt.md`.
- Raw SHA-256 `9ac3652305b8e304301824442254d6675aaee4c8beb0041a19c2f195c498b5b5`; clean SHA-256 `a39f64e1700ca95ba5b1ae6e7586b3df577aa35802aec93b3421f48b2e472694`.
- Alpha bounds `(352,21,906,1267)` in1212×1297; 40×90 cell with44px side margins,5px top/1px bottom. White/dark review confirms stable upright recovery distinct from pose13's wide landing compression. Full identity/anatomy/shoes pass; no ball.

## Sequence comparison

- Seven-cell strip: `tools/generate-art/previews/j106-keeg-alley-oop-power/j106-keeg-alley-oop-power-poses08-14-sequence-review-small.png`; individual light/dark cell previews remain beside it.
- Reviewed poses08–14 in order: ascent/cock, compressed high windup, sole extended-hand release, relaxed wrist follow-through, controlled descent, two-foot landing compression, upright recovery. Pose09 was retried twice because attempt01 was too similar to pose08 and retry02 put the hand behind/too close to the hat. Retry03 clears the hat on screen-right. Each pose has a separate silhouette at cell size; identity, full anatomy, transparency, cell margins, and absence of a painted ball passed visual review. Pose14 is intentionally narrower than the landing stance and has 44px side margins.
- All seven isolated sources are available for parent independent review. This lane has not edited shared provenance/runtime files and has not packed an atlas.

## Lane status

The primary agent independently verified the complete 00–14 sequence, packed the reviewed sources, and completed the separate-track native preview. This delegated lane itself did not register the clip or edit shared runtime/provenance files.

- Poses08–14: reviewed and accepted as isolated components for parent review; not yet registered or atlas-packed.
- Pose09 attempt01 and retry02: rejected and preserved with their exact prompts, raw/clean sources, previews, hashes, and reasons above.
- Raw generator outputs are retained. Clean review files preserve RGB and clear alpha≤16; each prompt file records the exact prompt text.
- Parent should independently verify source/cell correspondence before integrating. No runtime/atlas acceptance is claimed here.
