const rows = [
  ['Chicago','Condas','Manaconda',92,'Reed Ashcroft','Juniper Vale','#443b92','#d7a84b','all-round','human','gray-streaked curls, beard, rectangular blue glasses, backward driftwood crest'],
  ['Emberwood','Kits','Paprika',90,'Piper Quickstep','Briar Foxglove','#b64d27','#f2d6aa','speed','quadruped-fox','tiny four-footed russet kit fox, large ears and pale-tipped bushy tail'],
  ['Moonmorel','Hex','Keeg',89,'Moxie Capwell','Dorian Mycel','#743eb5','#c5c6e8','passing','human','tall ornate purple witch hat, trimmed beard, mushroom details'],
  ['Neo Runway','Precision','Accu',92,'Nova Stitch','Echo Catwalk','#159d9b','#773ec2','shooter','human','green eyes, blunt bangs, long black twin ponytails, cropped sides'],
  ['Blackthorn','Court Kings','Leo',91,'Sable Regent','Marco Vellum','#24242a','#a93343','shooter','human','pale, long wavy black hair, refined mustache'],
  ['Scoria','Rams','Krios',94,'Flint Rooker','Ash Harth','#c83f2c','#35383c','power','horned-giant','huge red muscular giant, black ram horns, dark beard'],
  ['Vesper Harbor','Undertow','Kraken',89,'Marin Dusk','Cove Knell','#773c49','#bd865f','defender','elf','natural-skinned elf man, short hair, pointed ears, copper amulet'],
  ['Rainbow Alley','Runners','Lavi',88,"Pixel O'Keeffe",'Fern Tempo','#15904f','#f2d64a','speed','human','woman, short ginger curls, freckles, green eyes, silver glasses, rainbow laces'],
  ['Firenze','Serenity','Ria',88,'Luca Velori','Sera Bellini','#398d78','#9c394f','passing','human','elegant woman, dark softly wavy iridescent hair'],
  ['Lumen Bay','Circuits','Gummiefish',90,'Mira Wavelength','Azul Voss','#20b9c8','#2d61df','shooter','human','woman, vivid blue hair and fish hairpin, subtle circuit texture'],
  ['Crimson Harbor','Chains','Colossus',91,'Roxie Coil','Vanta Slate','#25212a','#b52d41','defender','human','pale woman, silver-white hair, red round glasses, crimson flowers'],
  ['New Orleans','Fleur Noire','McFleurdel',89,'Sylvie Shutter','Noelle Pinstripe','#ddd9d1','#715381','passing','human','goth-punk woman, black-white hair, fleur detail, photographer'],
  ['Thornvale','Breakers','Toph',87,'Cade Brixton','Fenn Static','#29282c','#713a79','defender','human','shaggy blond hair, teal eyes, rectangular glasses, gauges, pinned beanie, thorn hoodie'],
  ['Gildforge','Titans','Heph',91,'Ember Rivet','Bronze Calder','#295485','#dfa949','defender','artisan-deity','blue-gray skin with glowing gold fracture lines, white hair and long beard'],
  ['Nightshade Vale','Blooms','Liv',89,'Violet Lorne','Cassian Quill','#7855a1','#201e27','shooter','elf','fair elf scholar, silver eyes, light-lavender hair, nightshade motifs'],
  ['Astral Drift','Orbits','E. Indigo',92,'Sol Meridian','Mist Halo','#347ac0','#e1bd44','dunker','cosmic-humanoid','azure skin, icy hair, small blue antlers, mismatched sclera, tilted face ring, golden heart'],
  ['Blueglass','Knights','Myth',89,'Wren Bravado','Eden North','#31579a','#171a21','all-round','human','brown shoulder-length waves, bright blue rectangular glasses, wide smile'],
  ['Darkspire','Hellcats','Wicked',90,'Raven Lux','Thorn Sable','#b91e36','#25202a','speed','horned-human','long vivid red hair, swept-back horns, black leather fashion'],
  ['Solstice Coast','Surf','Anna',90,'Kai Suncrest','Talia Kestrel','#398e82','#df8544','all-round','human','bronzed strong athletic woman, blue-green eyes'],
  ['Nocturne City','Blankfaces','Alexithymia',89,'Detective Halftone','Trace Noire','#242c37','#9098a1','defender','blank-screen-android','android in noir coat and fedora, perfectly blank black display face'],
  ['Neon Circuit','Pilots','Alex',90,'Jett Byte','Cass Pixel','#26bad0','#d03d9f','passing','human','blonde side-swept hair, blue eyes, glasses, headset, cyan-magenta cheek nodes'],
  ['Amp City','Thunderchords','Avek',92,'Riff Voltage','Fret Nova','#bd5a2f','#eee6d5','dunker','masked-rock-deity','masked metal deity, heavy-rock armor, signature guitar in portrait'],
  ['Inkspire','Razors','Cilia',91,'Thorn Script','Nyx Steel','#256346','#262c2b','defender','human','pale woman, intense red hair, green eyes, dark tattoos and piercings'],
  ['Lantern Hollow','Wombats','Steeb',88,'Moss Quarry','Digger Finch','#5b7041','#d6a64b','rebounder','wombat','small stocky gray-brown wombat, round ears, blunt muzzle, warm amber lantern'],
  ['Cedarbrook','Wardens','Jennifer',89,'Willow Root','Rowan Bark','#315e3e','#34a3a0','defender','human','tall druidic herbalist, purple wire glasses, chocolate curls, botanical robes'],
  ['Duskmere','Nightwings','EOW',88,'Moth Vale','Owl Argent','#423760','#b0a7c0','defender','human','very pale woman, long straight dark-brown hair, elegant nocturnal motifs'],
  ['Crownfire','Sovereigns','Dragon Queen',93,'Auric Scale','Cinder Royal','#18385d','#d8ad49','dunker','dragon','full nonhumanoid navy dragon, gold flecks and eyes, wings, four limbs and long tail'],
  ['Venom Delta','Fangs','Suga',92,'Nox Striker','Viper Veil','#142f63','#1c9bdd','speed','cobra','dark navy-electric blue cobra, wide hood, yellow eyes, orange markings and mask'],
  ['Greenwall','Giants','6foot10',92,'Moss Granite','Thump Alder','#427944','#858c69','power','orc','huge muscular green tuskless orc, messy high top-knot'],
  ['London','Royal Spots','GB Design',89,'Camden Union','Poppy Stitch','#244985','#d84949','shooter','jaguar','anthropomorphic spotted jaguar, feline snout and ears, British flag accents'],
  ['Coppermoon','Skyblades','Jragena',93,'Draya Staffwind','Kael Rune','#734e62','#b35c43','dunker','winged-humanoid','very dark purple skin, freckles, glasses, curved horns, copper hair, dragonlike wings'],
  ['Cheshire Hollow','Grinners','Dea',89,'Lilt Smile','Violet Wink','#be4bbb','#e5bfd5','all-round','feline-human','pale woman with feline ears, red eyes, broad Cheshire grin, magenta jacket'],
  ['Emerald Den','Wolves','Pack Mama',89,'Fern Howl','Koa Vale','#18804e','#39a9a0','passing','human','teal hair, wolf-eared hood, rich emerald athletic dress'],
  ['Stripewood','Longarms','Quirky',90,'Scribble Turner','Palette Spry','#252528','#e27136','steal','orangutan-zebra','zebra-striped orangutan hybrid with very long arms and animal face'],
  ['Verdant Reach','Archers','Lula',90,'Sage Fletch','Hazel Bloom','#538b45','#dfa94c','shooter','elf','green-haired elf with long ears, amber eyes, facial runes and leaf attire']
];

const archetypeStats = {
  'all-round': [79,80,77,75,80,76,72,75,78,76], speed: [94,77,75,76,79,91,63,72,92,68],
  passing: [78,79,78,70,94,80,69,76,79,73], shooter: [77,78,93,70,78,72,62,67,77,66],
  power: [66,73,61,96,69,65,86,92,76,96], defender: [74,74,70,68,78,82,92,90,74,85],
  dunker: [82,77,73,94,77,72,84,83,85,88], rebounder: [78,77,65,75,75,71,85,96,79,86], steal: [92,75,74,70,78,96,68,74,88,71]
};
const names = [
  ['Manaconda','Reed Ashcroft','Juniper Vale','Indigo / bark gold'],['Paprika','Piper Quickstep','Briar Foxglove','Russet / cream'],['Keeg','Moxie Capwell','Dorian Mycel','Purple / silver'],['Accu','Nova Stitch','Echo Catwalk','Teal / violet'],['Leo','Sable Regent','Marco Vellum','Black / crimson'],['Krios','Flint Rooker','Ash Harth','Ember red / charcoal'],['Kraken','Marin Dusk','Cove Knell','Burgundy / copper'],['Lavi',"Pixel O'Keeffe",'Fern Tempo','Emerald / rainbow'],['Ria','Luca Velori','Sera Bellini','Jade / wine'],['Gummiefish','Mira Wavelength','Azul Voss','Aquamarine / electric blue'],['Colossus','Roxie Coil','Vanta Slate','Black / blood-red'],['McFleurdel','Sylvie Shutter','Noelle Pinstripe','Monochrome / fleur violet'],['Toph','Cade Brixton','Fenn Static','Black / thorn-purple'],['Heph','Ember Rivet','Bronze Calder','Sapphire / molten gold'],['Liv','Violet Lorne','Cassian Quill','Lavender / night-black'],['E. Indigo','Sol Meridian','Mist Halo','Azure / gold'],['Myth','Wren Bravado','Eden North','Cobalt / black'],['Wicked','Raven Lux','Thorn Sable','Scarlet / black'],['Anna','Kai Suncrest','Talia Kestrel','Sea-green / orange'],['Alexithymia','Detective Halftone','Trace Noire','Black / steel'],['Alex','Jett Byte','Cass Pixel','Cyan / magenta'],['Avek','Riff Voltage','Fret Nova','Copper / electric white'],['Cilia','Thorn Script','Nyx Steel','Forest-green / black'],['Steeb','Moss Quarry','Digger Finch','Olive / amber'],['Jennifer','Willow Root','Rowan Bark','Forest green / turquoise'],['EOW','Moth Vale','Owl Argent','Deep violet / silver'],['Dragon Queen','Auric Scale','Cinder Royal','Navy / royal gold'],['Suga','Nox Striker','Viper Veil','Navy / electric blue'],['6foot10','Moss Granite','Thump Alder','Moss green / stone'],['GB Design','Camden Union','Poppy Stitch','Cobalt / red / white'],['Jragena','Draya Staffwind','Kael Rune','Copper / violet'],['Dea','Lilt Smile','Violet Wink','Magenta / violet'],['Pack Mama','Fern Howl','Koa Vale','Emerald / teal'],['Quirky','Scribble Turner','Palette Spry','Black/white stripes / paint orange'],['Lula','Sage Fletch','Hazel Bloom','Leaf green / amber']
];

export const teams = rows.map((r, index) => {
  const [city, mascot, captain, captainOvr, partner, alternate, primary, secondary, role, rig, features] = r;
  const group = names[index];
  const themedRig = rig;
  const roster = [captain, partner, alternate].map((name, slot) => {
    const base = [...archetypeStats[role]];
    const offset = slot === 0 ? 0 : slot === 1 ? -1 : -4;
    const ratings = base.map((v, n) => Math.max(58, Math.min(99, v + offset + ((index * 3 + n * 5 + slot) % 5) - 2)));
    const ovr = slot === 0 ? captainOvr : slot === 1 ? [84,83,82,84,84,82,83,83,82,84,83,83,84,83,82,83,82,84,82,82,85,83,82,81,83,82,84,82,82,83,83,82,82,82,83][index] : [79,78,80,78,78,78,78,77,79,79,77,80,79,78,80,77,80,78,78,79,78,78,79,78,78,77,78,78,79,78,79,78,79,78,78][index];
    return {
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), name, number: [3, 12, 27][slot],
      captain: slot === 0, ovr, height: slot === 0 && ['Krios','Colossus','Dragon Queen','6foot10'].includes(name) ? 'towering' : slot === 2 ? 'compact' : 'tall',
      rig: slot === 0 ? themedRig : (slot === 1 ? 'human' : index % 4 === 0 ? 'human' : 'athletic-variant'),
      archetype: slot === 0 ? role : (slot === 1 ? ['passing','speed','shooter','defender','dunker'][index % 5] : ['rebounder','all-round','steal','power','shooter'][index % 5]),
      palette: [primary, secondary], visualSeed: index * 97 + slot * 31 + 11,
      style: slot === 0 ? role : slot === 1 ? 'playmaker' : 'utility', features: slot === 0 ? features : `${name}: original game-only ${slot === 1 ? 'playmaker' : 'utility'} athlete with an individual face, silhouette and team palette`,
      stats: Object.fromEntries(['speed','two','three','dunk','pass','steal','block','rebound','turbo','strength'].map((k, n) => [k, ratings[n]]))
    };
  });
  return { id: `${city}-${mascot}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'), city, name: `${city} ${mascot}`, mascot, colors: [primary, secondary, ['#f4dfae','#29a4b4','#e2b64e','#7767b0','#58ad76'][index % 5]], logo: `crest-${index + 1}`, slogan: ['Own the lane','Run it down','Make some noise','Fly higher','Defend the hardwood'][index % 5], role, roster };
});

export function validateLeague(league) {
  const errors = [], all = league.flatMap(team => Array.isArray(team?.roster) ? team.roster : []);
  const renderableRigs=new Set(['artisan-deity','athletic-variant','blank-screen-android','cobra','cosmic-humanoid','dragon','elf','feline-human','horned-giant','horned-human','human','jaguar','masked-rock-deity','orangutan-zebra','orc','quadruped-fox','winged-humanoid','wombat']);
  const skillKeys=['speed','two','three','dunk','pass','steal','block','rebound','turbo','strength'];
  if (league.length !== 35) errors.push(`expected 35 teams, got ${league.length}`);
  if (all.length !== 105) errors.push(`expected 105 athletes, got ${all.length}`);
  if (new Set(all.map(p => p.id)).size !== all.length) errors.push('duplicate athlete id');
  if (new Set(all.map(p => p.visualSeed)).size !== all.length) errors.push('duplicate visual seed');
  for (const t of league) {
    if (!t || !Array.isArray(t.roster)) { errors.push('team is missing a roster'); continue; }
    if (t.roster.length !== 3 || t.roster.filter(p => p.captain).length !== 1) errors.push(`${t.name}: invalid roster/captain`);
    if (!t.city || !t.name || !Array.isArray(t.colors) || t.colors.length < 3 || !t.colors.every(Boolean) || !t.logo || !t.slogan) errors.push(`${t.name}: missing presentation`);
    if (new Set(t.roster.map(p=>p.name)).size!==t.roster.length) errors.push(`${t.name}: duplicate roster name`);
    if (new Set(t.roster.map(p=>p.number)).size!==t.roster.length) errors.push(`${t.name}: duplicate uniform number`);
    for (const p of t.roster) {
      if (!p.id || !p.name || !p.rig || !p.features || !Number.isInteger(p.number) || p.number<0 || p.number>99 || !p.height || !p.archetype || !Number.isInteger(p.ovr) || p.ovr<0 || p.ovr>99) errors.push(`${t.name}: invalid athlete identity or sprite metadata ${p.name}`);
      if (!renderableRigs.has(p.rig)) errors.push(`${t.name}: unsupported sprite rig ${p.rig}`);
      if (!Number.isInteger(p.visualSeed)) errors.push(`${t.name}: missing or invalid visual seed ${p.name}`);
      if (!p.stats || skillKeys.some(k=>!Number.isInteger(p.stats[k])||p.stats[k]<0||p.stats[k]>99)) errors.push(`${t.name}: invalid skill vector ${p.name}`);
    }
  }
  return { teams: league.length, athletes: all.length, captains: all.filter(p => p.captain).length, errors };
}
