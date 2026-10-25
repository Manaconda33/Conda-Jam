# J.123 Piper Quickstep `alley-oop-power`, poses 10–14 source review

Five separate ImageGen outputs were selected as isolated source candidates; no combined sheet or atlas was generated. The exact per-pose prompt, source, generation ID/date, hashes, alpha measurements, cleanup, and review evidence are in `prompts/`, `sources/`, `cleaned/`, `provenance/`, and `attempts.json`.

| Pose | Beat | Attempt | Review |
|---|---|---:|---|
| 10 | Sole tick-21 open-palm release | 1 | PASS: empty open hand, airborne full anatomy, ball absent. |
| 11 | Empty-handed follow-through | 1 | PASS: forward/down relaxed release arm, rear balance arm, distinct airborne pose. |
| 12 | Controlled descent | 2 | PASS: asymmetrically bent legs, lower leading foot, open balance hands; no impact yet. |
| 13 | Two-foot landing compression | 1 | PASS: both shoes at shared floor level, both knees flexed, hips low, hands balanced. |
| 14 | Upright recovery | 1 | PASS: planted stance, nearly straight knees, relaxed shoulders and hands. |

The five selected images read as a distinct release, follow-through, descent, compression, and standing recovery. Each retains Piper’s warm-brown skin, dark eyes, attached orange high ponytail, blank russet-red/cream uniform, white socks, and red/cream shoes. Every figure is complete; all are right-facing, ball-free, with transparent RGBA backgrounds. Dark/light proof sheets show no attached background panels, cell borders, or visible alpha speckles after cleanup.

ImageGen returned 1254×1254 RGBA images even though the prompts requested generous clear margins. Raw alpha>16 and alpha>128 bounds retain at least80px of transparency on every side; pose11’s narrowest margin is85px on the right and pose14’s is89px on the bottom. The raw generations include low-alpha detached components and occasional pixels at distant canvas edges. `clean-alpha-components.py` preserves the largest 8-connected alpha>0 figure component and its original alpha values, clears detached pixels only, and leaves RGB unchanged. Cleaned alpha>0 margins remain at least82px on every side. Raw sources remain unchanged.

Parent review of the dark/light contact sheets confirms the full 10–14 sequence reads correctly. These are accepted isolated source candidates only. J.123 remains incomplete until poses00–09 are integrated and the full sequence, atlas layout, ball-free art, and Piper-specific separate-ball track pass review. No source in this lane has been packed.
