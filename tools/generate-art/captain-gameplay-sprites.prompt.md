# Captain gameplay sprite atlas

## Output

- File: `public/assets/captain-gameplay-sprites.png`
- Source output: transparent RGBA PNG, 1484×1060 px
- Layout: 7 columns × 5 rows, exact 212×212 px cells, row-major in `src/content/teams.js` order
- Content: one full-body, high-contrast arcade basketball action sprite per canonical captain; no ball, background, labels, or cell dividers
- Runtime: `drawRosterGameSprite` selects the captain's cell from the team index and renders the separate simulated ball, labels, depth scaling, pose motion, and effects

## Generation and cleanup prompt

Create an original transparent PNG atlas of exactly 35 distinct full-body playable 2D basketball characters, precisely arranged in 7 equal columns × 5 equal rows, one centered sprite per cell in canonical team manifest order. Use the supplied JAMVERSE arcade gameplay screenshot as visual direction: saturated late-1990s raster art, crisp chunky pixel clusters, bright neon edge light, expressive athletic body shapes, original uniforms, and readable silhouettes at 60 pixels tall. Keep complete figures inside their cells and transparent between them. Preserve the exact canonical identities and anatomy described in the full master specification and in `captain-portrait-atlas.prompt.md`: Manaconda's beard, blue glasses, and backward temple driftwood; Paprika's four-footed fox body; Keeg's mushroom hat; Accu's twin ponytails; Krios's horns; Kraken's elf ears; E. Indigo's antlers, orbit and heart; Alexithymia's blank black android screen; Avek's mask; Steeb's compact wombat form and lantern; Dragon Queen's whole four-legged body, wings and tail; Suga's cobra hood; GB Design's jaguar muzzle; Jragena's horns/wings; Dea's feline ears/grin; Pack Mama's wolf-eared hood but human body; Quirky's striped orangutan-zebra hybrid and long arms; Lula's elf ears; and every other captain's canonical traits. Do not turn nonhumans into humans or costumes. No ball, lettering, real marks, scenery, panels, shadows outside the sprites, or duplicated characters.

The first generated draft preserved all character designs and the exact atlas order but included balls in players' hands. Apply a second image edit to that generated atlas: preserve all 35 poses, anatomy, colors, outfits and transparent cell layout; remove each basketball and naturally restore the small hand/paw area; keep identity props such as Steeb's lantern and Avek's guitar. The final file is the edited no-ball sheet.

## Validation

`tests/captain-gameplay-atlas.test.js` checks PNG RGBA format, exact dimensions, and transparent visible art in all 35 tiles. The E2E match journey requires the captain and supporting gameplay atlases to load before the full match starts. `npm run build` embeds the sheet in `dist/JAMVERSE_96.html`.
