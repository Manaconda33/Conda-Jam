# Asset catalog

| Asset | Source / generator | Current state |
|---|---|---|
| 35 team palettes, crests, slogans, athlete records | `src/content/teams.js` | All franchises and 105 records present; crests are text identifiers, not image files |
| Team picker and captain mini-portraits | `index.html`, `src/main.js`, `src/style.css` | 35-button grid and original runtime Canvas cards show selected canonical captain and palette; no full roster portraits yet |
| Athlete bodies and special species silhouettes | `src/main.js` Canvas drawing functions | Procedural and local; custom fox, dragon, cobra, wombat, jaguar, orangutan-zebra and android branches; signature identities vary in completeness; not sprite atlases |
| Canonical captain cards | `drawCreatureCaptainCard`, `drawPortraitSignature` in `src/main.js` | 35 captain cards; six creature rigs use nonhuman bodies, and human cards draw selected canonical crest, hat, horn, antler, glasses, face, mask, lantern and instrument features from original local Canvas shapes |
| Supporting athlete sprite variation | `drawAthlete` in `src/main.js` | 70 original game-only partners and alternates receive stable seed-based skin tone, hair hue/style and uniform-pattern variation; the on-court renderer uses individual height/archetype metadata and original procedural details, not hand-authored per-player portraits |
| Hardwood, lines, crowd rows, baskets, scoreboard | `src/main.js` Canvas drawing functions | Procedural and local; no external requests |
| Sound cues | `src/main.js` WebAudio oscillator tones | Original synthesized UI/action cues, limited effects; no music or recorded samples |
| UI typography | System font stacks | Local/browser fallback only |
| QA screenshots | `tools/e2e_smoke.py` with local Chromium | Title, season ladder, normal and five nonhuman matchups, six canonical creature captain cards, dunk, active FIRE, substitutions, and final result |

All generated visuals and sounds are original project assets. No third-party attribution is currently required. The screenshot tool is the only non-project runtime needed for E2E and is provided by the environment rather than bundled.
