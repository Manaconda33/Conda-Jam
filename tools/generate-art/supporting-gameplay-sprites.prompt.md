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
| 15–16 | Rainbow Alley Runners | Pixel O'Keeffe | Fern Tempo |
| 17–18 | Firenze Serenity | Luca Velori | Sera Bellini |
| 19–20 | Lumen Bay Circuits | Mira Wavelength | Azul Voss |
| 21–22 | Crimson Harbor Chains | Roxie Coil | Vanta Slate |
| 23–24 | New Orleans Fleur Noire | Sylvie Shutter | Noelle Pinstripe |
| 25–26 | Thornvale Breakers | Cade Brixton | Fenn Static |
| 27–28 | Gildforge Titans | Ember Rivet | Bronze Calder |
| 29–30 | Nightshade Vale Blooms | Violet Lorne | Cassian Quill |
| 31–32 | Astral Drift Orbits | Sol Meridian | Mist Halo |
| 33–34 | Blueglass Knights | Wren Bravado | Eden North |
| 35–36 | Darkspire Hellcats | Raven Lux | Thorn Sable |
| 37–38 | Solstice Coast Surf | Kai Suncrest | Talia Kestrel |
| 39–40 | Nocturne City Blankfaces | Detective Halftone | Trace Noire |
| 41–42 | Neon Circuit Pilots | Jett Byte | Cass Pixel |
| 43–44 | Amp City Thunderchords | Riff Voltage | Fret Nova |
| 45–46 | Inkspire Razors | Thorn Script | Nyx Steel |
| 47–48 | Lantern Hollow Wombats | Moss Quarry | Digger Finch |
| 49–50 | Cedarbrook Wardens | Willow Root | Rowan Bark |
| 51–52 | Duskmere Nightwings | Moth Vale | Owl Argent |
| 53–54 | Crownfire Sovereigns | Auric Scale | Cinder Royal |
| 55–56 | Venom Delta Fangs | Nox Striker | Viper Veil |
| 57–58 | Greenwall Giants | Moss Granite | Thump Alder |
| 59–60 | London Royal Spots | Camden Union | Poppy Stitch |
| 61–62 | Coppermoon Skyblades | Draya Staffwind | Kael Rune |
| 63–64 | Cheshire Hollow Grinners | Lilt Smile | Violet Wink |
| 65–66 | Emerald Den Wolves | Fern Howl | Koa Vale |
| 67–68 | Stripewood Longarms | Scribble Turner | Palette Spry |
| 69–70 | Verdant Reach Archers | Sage Fletch | Hazel Bloom |

## Validation

`tests/supporting-gameplay-atlas.test.js` checks PNG RGBA format, exact output dimensions, and visible transparent art in each of the 70 mapped cells. `drawRosterGameSprite` uses the table order above. The standalone builder embeds the sheet so all playable athletes retain their art offline.
