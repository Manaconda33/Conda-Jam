# J.107 Keeg `alley-oop-reverse` — isolated pose08–14 lane

This lane created and reviewed seven original isolated Keeg drawings. It does not pack an atlas or edit shared provenance, manifest, or runtime. Pose02 is takeoff and pose05 is the incoming lob catch per clip anchors; poses08–09 continue the reverse-side turn/cock, pose10 is the sole release at tick21, then follow-through, descent, landing, and recovery. The ball remains a separately simulated game object.

## Review method

Each generated output is retained unchanged as `*-raw.png`. A separate review copy clears only alpha values `<=16` and preserves all RGB; clean/raw image dimensions are unchanged. The review helper `review-j107-keeg-alley-oop-reverse-poses08-14.py` crops pixels whose alpha is `>16`, then nearest-neighbor scales the figure to fit a 128×96 transparent cell within 76×86 pixels. This leaves at least 26px horizontal margins and 5px top/bottom margins. Per-pose light/dark review cells and a seven-pose contact sheet are in `previews/j107-keeg-alley-oop-reverse/`.

All accepted drawings preserve K.03 Keeg: adult human anatomy, black hair, neat close beard, very tall purple hat with silver trim and mushrooms, Moonmorel Hex purple/lavender/silver kit and matching shoes. No accepted drawing contains a ball, prop, rim, or effect. Hand contact through poses08–10 stays on screen-right of the hat, consistent with the parent lane’s J.106-side ball track. Pose10 is the only open-hand release; poses11–14 have no ball.

## Accepted sources

| Pose | Generation ID | Review figure / margins (px) | Clean SHA-256 | Raw SHA-256 | Review |
|---:|---|---|---|---|---|
| 08 | `exec-058fa4e8-31ef-4e81-ba33-dd5bf04a1858` | 59×86; L/R 34/35, T/B 5/5 | `ff70fede49c70ab2824130a17f1e1ac9c6ac557d0a1d63243a4c751f7dbf1c7f` | `d5bbed874afc04fd72e2d90f1830f6cf861368339dcc32e1dbd6aa02c2ca90c2` | `j107-keeg-alley-oop-reverse-pose-08-cell-review.png` |
| 09 | `exec-27da6050-a440-447e-90bb-50f4b38ddf3e` | 74×86; L/R 27/27, T/B 5/5 | `f429225ffc98db88b2190dfaaf946f5698dd375a076bef9c4e665a76983249c4` | `bd0f44cb75bb5b71e645e922c456a95184010163f12d71c9d0cc67486d07557c` | `j107-keeg-alley-oop-reverse-pose-09-cell-review.png` |
| 10 | `exec-6e19be67-3a63-467c-9b9e-77a6cc0d0e47` | 76×80; L/R 26/26, T/B 8/8 | `009ad437a88496303335e39fb77588fa494929bb1136f8a8c55a122454124c2b` | `3e1344b5d2b20c8e0c37e81a41997769fbabca136c3e075c42c80480645d482d` | `j107-keeg-alley-oop-reverse-pose-10-cell-review.png` |
| 11 | `exec-8c115c51-8809-4867-9b98-5efbcf441e7b` | 65×86; L/R 31/32, T/B 5/5 | `cd011257d5a294f395aba87b384bf4e6e5507250addcc3b7d1cd606ddfcf2bd2` | `db80cb298d8c9d9867769df388860eb9ad4e8a70ebb49a2e4988ec1ecba840fb` | `j107-keeg-alley-oop-reverse-pose-11-cell-review.png` |
| 12 | `exec-2d81f314-fa2d-48c4-b7f6-9a1839670624` | 50×86; L/R 39/39, T/B 5/5 | `15c22ab139fd38f777ba4a6229a0319625a59d01542df2df698f4ea6b90fb161` | `58149ee98ebba433feb56666fc44f0a6c9ee3f005c5d9a5a14ed00c1cf2aa613` | `j107-keeg-alley-oop-reverse-pose-12-cell-review.png` |
| 13 | `exec-51d533a8-0ed9-433f-bb0c-8c6397bc1e69` | 76×84; L/R 26/26, T/B 6/6 | `c4e61784e0d4fb7fac220e25e024909a22f1494126f8af0f8a86887b2f943c4a` | `ba9687a77b9e0e0dad1aa17a71138b8ceaf64e261368d9c45f8b1b36b983347f` | `j107-keeg-alley-oop-reverse-pose-13-cell-review.png` |
| 14 | `exec-0799230f-9343-4315-96ba-162d2dfa506e` | 35×86; L/R 46/47, T/B 5/5 | `c7cf2dc7b52cf56d20f771bcfae4a468829eabf817d1ac3e6c0fa9c9f6ccdbf4` | `480614960627c216de47b9590170b7ed92e2309c74ac74aa0c40fc69992d8ca5` | `j107-keeg-alley-oop-reverse-pose-14-cell-review.png` |

Per-pose exact prompt text and raw/clean source paths are in `j107-keeg-alley-oop-reverse-pose-{08..14}*prompt.md` and `sources/j107-keeg-alley-oop-reverse-pose-*-attempt-*.png`. All four source corners have alpha0 in the accepted cleaned images. Pose09 raw corner alpha included one alpha1 pixel; its clean copy clears it and has alpha0 at all corners.

## Rejected attempts and provenance exception

Pose08 attempt01 is an accidental cross-lane duplicate, not a valid J.107 image-generation attempt: its raw source SHA-256 exactly matches root-lane pose00 attempt01 (`14ec90c30d7b3b9f7df14e571b84627e12830169bd71b9c8d176e86153df17c7`), and its recorded generation ID is the pose00 ID. The intended pose08 prompt, duplicate source, and diagnostic review remain preserved, but it is excluded from all J.107 generated-pose counts and assembly. Accepted pose08 retry02 is unique and has its own exact prompt, generation ID, raw/clean sources, hashes, and cell review.

| Pose / attempt | Generation ID | Reason | Preserved cell review |
|---|---|---|---|
| 08 / 01 duplicate | invalid duplicate of pose00 attempt01 | Provenance collision; exclude as a generated pose08 candidate and from assembly. | `j107-keeg-alley-oop-reverse-pose-08-attempt-01-cell-review-rejected.png` |
| 09 / 01 | `exec-d0f2892c-ed44-416e-89fa-a71784fd101a` | Too similar to pose08’s lifted-arm silhouette at 128×96; retry02 compresses the torso/knees and moves the hand to screen-right of the hat. | `j107-keeg-alley-oop-reverse-pose-09-attempt-01-cell-review-rejected.png` |
| 10 / 01 | `exec-c17d4d04-c393-4c63-a838-93c1bc9b8dea` | Complete anatomy/margins passed, but generator placed the sole-release hand screen-left of hat, conflicting with accepted screen-right ball-hand side. | `j107-keeg-alley-oop-reverse-pose-10-attempt-01-cell-review-rejected.png` |

Exact retry prompts, all raw/clean candidates and SHA-256 values are retained alongside the sources. No rejected source is used as an accepted pose.

## Sequence review and handoff

`previews/j107-keeg-alley-oop-reverse/j107-keeg-alley-oop-reverse-poses08-14-sequence-review.png` compares the accepted 08–14 poses against light and dark backgrounds. Pose08 is a back-turned high cock, 09 compresses into a bent-elbow coil, 10 extends into the sole release, 11 follows through, 12 descends upright, 13 absorbs impact in a wide low stance, and 14 recovers to a narrow upright stance. Visual review found no touching/crossing silhouettes, cropped limbs, missing hat/shoes, painted ball, edge-haze, or cell-margin violations. The parent should independently compare this lane against poses00–07, confirm the turn into release, then assemble the full sequence and validate the separate ball track in native rendering before registering any source.
