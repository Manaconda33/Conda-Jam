# J.123 Piper Quickstep `alley-oop-power`, poses 10–14 source review

Five separate ImageGen outputs were selected as isolated source candidates; no combined sheet or atlas was generated. The exact per-pose prompt, source, generation ID/date, hashes, alpha measurements, cleanup, and review evidence are in `prompts/`, `sources/`, `cleaned/`, `provenance/`, and `attempts.json`.

| Pose | Beat | Attempt | Review |
|---|---|---:|---|
| 10 | Sole tick-21 open-palm release | 2b | PASS: open splayed hand and near-vertical leading arm distinguish it from pose09 at 128×96; full anatomy, ball absent. |
| 11 | Empty-handed follow-through | 1 | PASS: forward/down relaxed release arm, rear balance arm, distinct airborne pose. |
| 12 | Controlled descent | 2 | PASS: asymmetrically bent legs, lower leading foot, open balance hands; no impact yet. |
| 13 | Two-foot landing compression | 1 | PASS: both shoes at shared floor level, both knees flexed, hips low, hands balanced. |
| 14 | Upright recovery | 1 | PASS: planted stance, nearly straight knees, relaxed shoulders and hands. |

The five selected images read as a distinct release, follow-through, descent, compression, and standing recovery. Each retains Piper’s warm-brown skin, dark eyes, attached orange high ponytail, blank russet-red/cream uniform, white socks, and red/cream shoes. Every figure is complete; all are right-facing, ball-free, with transparent RGBA backgrounds. Dark/light proof sheets show no attached background panels, cell borders, or visible alpha speckles after cleanup.

ImageGen returned 1254×1254 RGBA images even though the prompts requested generous clear margins. For poses11–14, raw alpha>16 and alpha>128 bounds retain at least80px of transparency on every side; pose11’s narrowest margin is85px on the right and pose14’s is89px on the bottom. Pose10 attempt2b initially had edge specks and a 31px cleaned top/bottom margin; alpha-only cleanup removed 460 detached pixels, then a uniform scale/placement layout candidate yields 80px transparent margins on every side with no redraw. `clean-alpha-components.py` preserves original RGB and retained alpha. Raw sources remain unchanged. Attempt2a is preserved as rejected because its arm line remained too similar to pose09.

Pose10’s light/dark source and 128×96 comparisons are in `previews/pose-10-attempt2/`; the selected attempt2b reads distinctly from pose09 at both scales. Parent review of the dark/light contact sheets confirms poses11–14 read in the intended sequence. These are accepted isolated source/layout candidates only. J.123 remains incomplete until poses00–09 are integrated and the full sequence, atlas layout, ball-free art, and Piper-specific separate-ball track pass review. No source in this lane has been packed.
