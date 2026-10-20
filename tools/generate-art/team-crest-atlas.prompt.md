# Franchise crest atlas recipe

## Output and mapping

- File: `public/assets/team-crest-atlas.png`
- Format: RGBA PNG, transparent outside each crest
- Generated sheet: 8 columns × 5 rows (35 crests; the final row uses its first four positions)
- Runtime order is row-major over `src/content/teams.js`: teams 1–7 in row 1, teams 8–15 in row 2, teams 16–23 in row 3, teams 24–31 in row 4, and teams 32–35 in row 5.
- The generated file is copied into `dist/public/assets/` and inlined in the standalone HTML build.

## Generation prompt

Create an original transparent-background 2D pixel-art emblem atlas for a fictional 1990s arcade basketball league. Grid contains 35 separate unique vector-like pixel crests in row-major sequence, each centered and readable at 20 px, crisp thick outlines, transparent background, no writing, letters, numbers, real sports logos, shadows outside the crest, or panel backgrounds. Original teams and emblem concepts, in order: Chicago Condas, scholar snake with backward driftwood branches and blue glasses; Emberwood Kits, russet fox and flame leaf; Moonmorel Hex, purple mushroom wizard hat and crescent; Neo Runway Precision, teal-violet compass needle; Blackthorn Court Kings, blackthorn crown and basketball; Scoria Rams, red ram horns and molten stone; Vesper Harbor Undertow, burgundy wave and elf amulet; Rainbow Alley Runners, rainbow shoe wing; Firenze Serenity, jade laurel and rose; Lumen Bay Circuits, cyan fish with circuit rays; Crimson Harbor Chains, crimson anchor and chain; New Orleans Fleur Noire, dark fleur-de-lis with camera glint; Thornvale Breakers, thorned wave; Gildforge Titans, glowing anvil and hammer; Nightshade Vale Blooms, purple nightshade blossom and moon; Astral Drift Orbits, blue orbit ring around gold heart; Blueglass Knights, cobalt knight shield and glasses; Darkspire Hellcats, scarlet cat eyes and swept horns; Solstice Coast Surf, teal sun over orange surf; Nocturne City Blankfaces, monochrome blank black mask beneath fedora; Neon Circuit Pilots, cyan-magenta headset and wing; Amp City Thunderchords, electric guitar crossed by lightning; Inkspire Razors, emerald quill and razor blades; Lantern Hollow Wombats, olive wombat head holding gold lantern; Cedarbrook Wardens, green tree roots around turquoise drop; Duskmere Nightwings, violet moth wings with silver moon; Crownfire Sovereigns, navy dragon head and gold crown; Venom Delta Fangs, blue cobra hood with orange fangs; Greenwall Giants, moss green stone fist; London Royal Spots, spotted jaguar paw with subtle red-blue-white accent; Coppermoon Skyblades, copper crescent, wings and twin-ended staff; Cheshire Hollow Grinners, magenta cat grin; Emerald Den Wolves, emerald wolf head; Stripewood Longarms, orangutan-zebra hybrid animal face with long stylized arms and paint orange; Verdant Reach Archers, green elf arrow and golden leaf. No text. Use distinct palette and silhouette in each badge; maintain a clean compact layout and transparent canvas.

## Validation

`tests/crest-atlas.test.js` validates PNG format and sheet dimensions. Chromium verifies all 35 team cards display a generated crest. `npm run build` tests both the copied static asset and embedded standalone art.
