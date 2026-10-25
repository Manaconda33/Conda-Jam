# J.122 Piper Quickstep `dunk-scythe`, poses 00–04 source review

## Source scope

Five isolated original Piper generations are retained unchanged under `sources/`. Their verbatim prompts, generation IDs, original hashes, and initial alpha measurements are in each `pose-XX-prompt.md` and `pose-XX-provenance.json`. Separate alpha-cleaned candidates are in `cleaned/`; the selected sources are now included in the accepted J.122 lane-scale production atlas and accepted Piper-specific runtime ball-track review; this historical lane record otherwise preserves its original source review scope.

The reviewed motion sequence follows the accepted J.105 Keeg scythe references and the 15-pose `dunk-scythe` runtime clip: pose00 right-facing approach, pose01 gather, pose02 grounded two-foot plant/coil, pose03 first airborne takeoff with the carry hand dropping behind the hip, pose04 low rearward airborne sweep. J.105 pose05 is the deepest point of the sweep.

## Hand mapping

Piper faces image-right in these views. The image-left, rear/trailing hand is the single invisible-ball carry hand through all poses 00–04. The image-right/front hand is the empty counterbalance hand. This names the visible limb and path consistently without making an ambiguous anatomical left/right claim. No ball, blade, scythe, or other object is drawn; the game ball remains on its separate athlete-specific track.

## Cleanup and proof

Raw PNGs remain immutable. The cleaned candidates were created in two alpha-only passes using the existing `clean-disconnected-speckles.py` (one expected figure, 2px edge margin) followed by `clean-alpha-fringe.py`. RGB channels were verified byte-for-byte identical between raw and cleaned images; only alpha was cleared. Per-pose counts, source hashes, cleaned hashes, dimensions, and alpha margins are recorded in the provenance JSON files. Light/dark full-resolution proofs and contact sheets are in `proofs/cleaned/`.

## Pose-by-pose decision

| Pose | Source generation | Cleaned canvas margins L/T/R/B at alpha >16 | Review |
|---|---|---:|---|
| 00 | `exec-c6727d52-9e41-432e-bbb9-773a4b1ec15d` | 180 / 161 / 115 / 83 px | Accept as isolated approach source. Piper identity, complete anatomy, visible empty hands, no ball, pose separation, alpha cleanup, and >=40px margin pass. |
| 01 | `exec-4851ccdb-2ff1-4eb7-9af5-d581bdb1f1e2` | 241 / 106 / 222 / 64 px | Accept as isolated gather source. Distinct lower gather; identity/anatomy, empty hands, no ball, cleanup, and >=40px margin pass. |
| 02 | `exec-6cc75863-bec7-41e2-be06-9a8659103c39` | 385 / 93 / 261 / 48 px | Accept as isolated grounded plant/coil source. Distinct two-foot plant; identity/anatomy, empty hands, no ball, cleanup, and >=40px margin pass. |
| 03 | `exec-7045c6af-49fa-4dbd-be67-da922cb1f7f9` | 218 / 113 / 114 / 56 px | Accept as isolated first takeoff source. Carry hand is low behind the hip; identity/anatomy, empty hands, no ball, cleanup, and >=40px margin pass. |
| 04 | `exec-2825a6a0-9b0b-444a-a5de-9e3d9c1bf0f8` | 270 / 72 / 173 / 88 px | Accept as isolated canonical low-rear-sweep source. Independent review confirms the image-left/trailing carry hand is behind the hip near hip/upper-thigh height; pose05 remains the deepest point with a lower hand and deeper torso lean. The verbatim source prompt says “lowest point”; see `pose-04-canonical-correction.md` and do not carry that wording forward. |

## Selected uniform-scale layout candidates (included in accepted atlas)

To satisfy the verbatim prompts' >=80px alpha>16 clearance without redrawing or stretching the athlete, each accepted cleaned source now has a 0.90 uniform-scale layout candidate centered in the original canvas. These were candidates when the original lane review was written. The complete lane-scale atlas has since passed independent full-sequence and parent review and is registered for production. Raw and cleaned sources remain unchanged. `layout-candidates-80px/layout-candidates.json` records the exact input/output SHA-256 hashes, 0.90 scale, source crop and placement, and alpha>16/128 bounds and margins. Individual light/dark proofs and contact sheets are in `proofs/layout-candidates-80px/`.

| Pose | Selected candidate alpha>16 margins L/T/R/B | Review |
|---|---:|---|
| 00 | 195 / 171 / 196 / 174 px | Meets >=80px prompt clearance. |
| 01 | 274 / 137 / 274 / 136 px | Meets >=80px prompt clearance. |
| 02 | 361 / 117 / 364 / 118 px | Meets >=80px prompt clearance. |
| 03 | 214 / 135 / 215 / 136 px | Meets >=80px prompt clearance. |
| 04 | 267 / 129 / 268 / 130 px | Meets >=80px prompt clearance. Use as low rear sweep; pose05 remains deepest. |

The earlier cleaned sources remain valid isolated sources but poses02–04 fell short of the prompt's 80px target; the selected 0.90 layout candidates resolve that clearance shortfall. The accepted complete atlas and Piper-specific ball track are reviewed in the J.122 parent integration records. This source group remains limited to pose00–04 provenance. Preserve pose04's verbatim prompt and the separate wording correction in `pose-04-canonical-correction.md`; do not describe pose04 as the deepest sweep.

Independent post-cleanup review accepted poses00–04 as isolated source candidates; pose04 includes a documented wording correction to preserve canonical distinction from pose05. No generated source was rejected in this group. Raw originals are preserved alongside the alpha-cleaned review candidates so the full history remains recoverable.
