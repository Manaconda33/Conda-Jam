# Supporting athlete gameplay sprite atlas

## Output and mapping

- File: `public/assets/supporting-player-gameplay-sprites.png`
- Format: transparent RGBA PNG, 1500×1049 px
- Layout: 10 columns × 7 rows, 70 unique sprites, partner then alternate for each team
- Runtime index: `teamIndex * 2 + rosterIndex - 1` for roster indices 1 and 2
- These game-only supporting athletes are not additional canon characters and must not imitate their captain

## Generation direction

Generate 70 distinct original full-body JAMVERSE basketball athletes in the exact row-major order below. Match the saturated late-1990s arcade raster style of `captain-gameplay-sprites.png`: crisp pixel clusters, dramatic blue/magenta/gold highlights, bold readable silhouettes, sleeveless original uniforms and court shoes. Each character must have a visibly different face, build, skin tone, hair and gear, with a distinct number and palette borrowed from their team. They do not hold or touch a basketball. One complete character per transparent cell; no text, backdrop, court, panels, real marks, duplicated bodies, or contact between cells. Most are human basketball athletes. They are fictional partners and alternates, not canonical additions and not disguised mascots or captains.

## Exact row-major roster order

| Slot | Team | Partner | Alternate |
|---:|---|---|---|
| 1–2 | Chicago Condas | Reed Ashcroft | Juniper Vale |
| 3–4 | Emberwood Kits | Piper Quickstep | Briar Foxglove |
| 5–6 | Moonmorel Hex | Moxie Capwell | Dorian Mycel |
| 7–8 | Neo Runway Precision | Nova Stitch | Echo Catwalk |
| 9–10 | Blackthorn Court Kings | Sable Regent | Marco Vellum |
| 11–12 | Scoria Rams | Flint Rooker | Ash Harth |
| 13–14 | Vesper Harbor Undertow | Marin Dusk | Cove Knell |
| 15–16 | Rainbow Alley Runners | Luca Velori | Sera Bellini |
| 17–18 | Firenze Serenity | Mira Wavelength | Azul Voss |
| 19–20 | Lumen Bay Circuits | Roxie Coil | Vanta Slate |
| 21–22 | Crimson Harbor Chains | Sylvie Shutter | Noelle Pinstripe |
| 23–24 | New Orleans Fleur Noire | Cade Brixton | Fenn Static |
| 25–26 | Thornvale Breakers | Ember Rivet | Bronze Calder |
| 27–28 | Gildforge Titans | Violet Lorne | Cassian Quill |
| 29–30 | Nightshade Vale Blooms | Sol Meridian | Mist Halo |
| 31–32 | Astral Drift Orbits | Wren Bravado | Eden North |
| 33–34 | Blueglass Knights | Raven Lux | Thorn Sable |
| 35–36 | Darkspire Hellcats | Kai Suncrest | Talia Kestrel |
| 37–38 | Solstice Coast Surf | Detective Halftone | Trace Noire |
| 39–40 | Nocturne City Blankfaces | Jett Byte | Cass Pixel |
| 41–42 | Neon Circuit Pilots | Riff Voltage | Fret Nova |
| 43–44 | Amp City Thunderchords | Thorn Script | Nyx Steel |
| 45–46 | Inkspire Razors | Moss Quarry | Digger Finch |
| 47–48 | Lantern Hollow Wombats | Willow Root | Rowan Bark |
| 49–50 | Cedarbrook Wardens | Moth Vale | Owl Argent |
| 51–52 | Duskmere Nightwings | Auric Scale | Cinder Royal |
| 53–54 | Crownfire Sovereigns | Nox Striker | Viper Veil |
| 55–56 | Venom Delta Fangs | Moss Granite | Thump Alder |
| 57–58 | Greenwall Giants | Camden Union | Poppy Stitch |
| 59–60 | London Royal Spots | Draya Staffwind | Kael Rune |
| 61–62 | Coppermoon Skyblades | Lilt Smile | Violet Wink |
| 63–64 | Cheshire Hollow Grinners | Fern Howl | Koa Vale |
| 65–66 | Emerald Den Wolves | Scribble Turner | Palette Spry |
| 67–68 | Stripewood Longarms | Sage Fletch | Hazel Bloom |
| 69–70 | Verdant Reach Archers | Sage Fletch | Hazel Bloom |

## Validation

`tests/supporting-gameplay-atlas.test.js` checks PNG RGBA format, exact output dimensions, and visible transparent art in each of the 70 mapped cells. `drawRosterGameSprite` uses the table order above. The standalone builder embeds the sheet so all playable athletes retain their art offline.
