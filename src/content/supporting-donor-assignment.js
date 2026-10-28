const defaultDonors = Object.freeze([
  'reed-ashcroft', 'juniper-vale', 'piper-quickstep', 'moxie-capwell',
  'dorian-mycel', 'nova-stitch', 'echo-catwalk',
]);
const defaultOriginals = new Set(defaultDonors);

function stableHash(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function visualScale(player) {
  return player.height === 'towering' ? 1.16 : player.height === 'compact' ? .88 : 1;
}

function colorDistance(a, b) {
  const parse = color => [1, 3, 5].map(i => Number.parseInt(color.slice(i, i + 2), 16));
  const left = parse(a), right = parse(b);
  return Math.hypot(...left.map((channel, i) => channel - right[i]));
}

function preferenceCost(player, donor, team, seed) {
  const rigCost = player.rig === donor.rig ? 0 : 400;
  const scaleCost = Math.round(Math.abs(visualScale(player) - visualScale(donor)) * 120);
  const teamPalette = team.colors.slice(0, 2);
  const paletteCost = Math.round((colorDistance(teamPalette[0], donor.palette[0]) + colorDistance(teamPalette[1], donor.palette[1])) / 48);
  return rigCost + scaleCost + paletteCost + stableHash(`${seed}|${team.id}|${player.id}|${donor.id}`) % 100;
}

function groupOptions(group, donorById, seed) {
  const available = [...donorById.values()].filter(donor => !group.blocked.has(donor.id));
  const options = [];
  function assign(index, used, selected, cost) {
    if (index === group.recipients.length) {
      const signature = selected.map(item => `${item.player.id}:${item.donor.id}`).join('|');
      options.push({ selected: [...selected], cost: cost + stableHash(`${seed}|${group.team.id}|${signature}`) % 17 });
      return;
    }
    const player = group.recipients[index];
    for (const donor of available) {
      if (used.has(donor.id)) continue;
      used.add(donor.id);
      selected.push({ player, donor });
      assign(index + 1, used, selected, cost + preferenceCost(player, donor, group.team, seed));
      selected.pop();
      used.delete(donor.id);
    }
  }
  assign(0, new Set(), [], 0);
  options.sort((a, b) => a.cost - b.cost || a.selected.map(x => `${x.player.id}:${x.donor.id}`).join('|').localeCompare(b.selected.map(x => `${x.player.id}:${x.donor.id}`).join('|')));
  return options;
}

/**
 * Build a reproducible, balanced donor assignment. This is an offline planning
 * function; runtime consumers use the committed, explicit donor map.
 */
export function assignSupportingDonors(teams, {
  donors = defaultDonors,
  originals = defaultOriginals,
  seed = 'jamverse96-support-donors-issue7-v1',
  derivedPerDonor = 9,
} = {}) {
  const donorIds = [...donors].sort();
  const donorById = new Map();
  const playerById = new Map();
  const teamById = new Map();
  for (const team of teams) for (const player of team.roster) {
    if (player.captain) continue;
    playerById.set(player.id, player);
    teamById.set(player.id, team);
    if (donorIds.includes(player.id)) donorById.set(player.id, { ...player, palette: player.palette });
  }
  if (donorById.size !== donorIds.length) throw new Error('Every donor must be present among noncaptain players');
  for (const id of originals) if (!donorById.has(id)) throw new Error(`Missing original donor owner: ${id}`);

  const result = Object.fromEntries(donorIds.map(id => [id, id]));
  const sharedTeams = [];
  for (const team of [...teams].sort((a, b) => a.id.localeCompare(b.id))) {
    const originalPlayers = team.roster.filter(player => !player.captain && originals.has(player.id));
    const blocked = new Set(originalPlayers.map(player => player.id));
    const recipients = team.roster.filter(player => !player.captain && !originals.has(player.id)).sort((a, b) => a.id.localeCompare(b.id));
    if (!recipients.length) continue;
    if (recipients.length > donorIds.length - blocked.size) throw new Error(`Not enough distinct donors for ${team.id}`);
    sharedTeams.push({ team, blocked, recipients });
  }

  const groups = sharedTeams.map(group => ({ ...group, options: groupOptions(group, donorById, seed) }))
    .sort((a, b) => a.options.length - b.options.length || stableHash(`${seed}|${a.team.id}`) - stableHash(`${seed}|${b.team.id}`) || a.team.id.localeCompare(b.team.id));
  const counts = Object.fromEntries(donorIds.map(id => [id, 0]));
  let solution = null;

  function search(groupIndex, selected) {
    if (groupIndex === groups.length) {
      if (donorIds.every(id => counts[id] === derivedPerDonor)) solution = [...selected];
      return Boolean(solution);
    }
    const group = groups[groupIndex];
    const remainingRecipients = groups.slice(groupIndex + 1).reduce((sum, item) => sum + item.recipients.length, 0);
    for (const option of group.options) {
      const added = Object.fromEntries(donorIds.map(id => [id, 0]));
      for (const { donor } of option.selected) added[donor.id]++;
      if (donorIds.some(id => counts[id] + added[id] > derivedPerDonor)) continue;
      for (const id of donorIds) counts[id] += added[id];
      const deficits = donorIds.reduce((sum, id) => sum + derivedPerDonor - counts[id], 0);
      if (deficits === remainingRecipients) {
        selected.push(option);
        if (search(groupIndex + 1, selected)) return true;
        selected.pop();
      }
      for (const id of donorIds) counts[id] -= added[id];
    }
    return false;
  }

  if (!search(0, [])) throw new Error(`No balanced assignment exists for seed ${seed}`);
  for (const option of solution) for (const { player, donor } of option.selected) result[player.id] = donor.id;

  const expectedPlayers = [...playerById.keys()].sort();
  const actualPlayers = Object.keys(result).sort();
  if (expectedPlayers.length !== actualPlayers.length || expectedPlayers.some((id, index) => id !== actualPlayers[index]))
    throw new Error('Assignment does not cover exactly the noncaptain roster');
  for (const [playerId, donorId] of Object.entries(result)) {
    if (!donorById.has(donorId)) throw new Error(`Invalid donor ${donorId} for ${playerId}`);
    if (originals.has(playerId) && donorId !== playerId) throw new Error(`Original owner ${playerId} must keep its own art`);
    if (originals.has(playerId) && teamById.get(playerId).id !== teamById.get(donorId).id) throw new Error(`Donor owner moved: ${playerId}`);
  }
  return Object.freeze(result);
}

export { defaultDonors as supportingDonorIds, defaultOriginals as originalSupportingDonors };
