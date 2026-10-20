# Asset catalog

| Asset | Source / generator | Current state |
|---|---|---|
| 35 team palettes, crests, slogans, athlete records | `src/content/teams.js` | All franchises and 105 records present; crests are text identifiers, not image files |
| Team picker and captain mini-portraits | `index.html`, `src/main.js`, `src/style.css`, `public/assets/captain-portrait-atlas.png` | Generated original 7×5 RGBA atlas maps all 35 canon captains in manifest order; rendered into all 35 selection cards and selected-team cards. Procedural art remains as a loading fallback |
| Athlete bodies and special species silhouettes | `src/main.js` Canvas drawing functions | Procedural and local; custom fox, dragon, cobra, wombat, jaguar, orangutan-zebra and android branches; signature identities vary in completeness; not sprite atlases |
| Canonical captain cards | Image generation output in `public/assets/captain-portrait-atlas.png`; `drawCaptainCard` and `drawPortraitSignature` in `src/main.js` | Generated original portraits depict signature features for the canonical roster; six nonhuman rigs remain intact in gameplay and the Canvas fallback. Atlas is embedded in `dist/JAMVERSE_96.html` for standalone use |
| Captain atlas recipe | `tools/generate-art/captain-portrait-atlas.prompt.md` | Human-readable prompt, dimensions, manifest-order mapping, integration and validation notes |
| Supporting athlete sprite variation | `drawAthlete` in `src/main.js` | 70 original game-only partners and alternates receive stable seed-based skin tone, hair hue/style and uniform-pattern variation; the on-court renderer uses individual height/archetype metadata and original procedural details, not hand-authored per-player portraits |
| Hardwood, lines, crowd rows, baskets, scoreboard | `src/main.js` Canvas drawing functions | Procedural and local; no external requests |
| Sound cues and arcade music | `src/main.js` and `src/core/music.js` WebAudio oscillators | Original synthesized UI/action cues and repeating bass/lead/percussion loop; master volume only, no recorded samples |
| UI typography | System font stacks | Local/browser fallback only |
| QA screenshots | `tools/e2e_smoke.py` with local Chromium | Title, season ladder, normal and five nonhuman matchups, six canonical creature captain cards, dunk, active FIRE, substitutions, and final result |

Generated captain portraits and synthesized game sounds are original project assets. No third-party attribution is currently required. The screenshot tool is the only non-project runtime needed for E2E and is provided by the environment rather than bundled.
