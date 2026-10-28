import { teams } from './teams.js';
import { supportingDonorMap, supportingDonorCounts, supportingDonorSeed } from './supporting-donor-map.js';
import { supportingUniformProfiles } from './supporting-uniform-profiles.js';

const players = teams.flatMap(team => team.roster);
const support = players.filter(player => !player.captain);
const completed = new Set([
  'reed-ashcroft', 'juniper-vale', 'piper-quickstep', 'moxie-capwell',
  'dorian-mycel', 'nova-stitch', 'echo-catwalk',
]);

function visualScale(player) {
  return player.height === 'towering' ? 1.16 : player.height === 'compact' ? .88 : 1;
}

export const supportingAnimationLibraries = Object.freeze(Object.fromEntries(support.map(player => {
  const donorId = supportingDonorMap[player.id];
  const donor = players.find(candidate => candidate.id === donorId);
  if (!donor) throw new Error(`No approved support donor is mapped for ${player.id}`);
  if (player.captain || donor.captain) throw new Error(`Captain artwork cannot enter support reuse: ${player.id} -> ${donorId}`);
  if (completed.has(player.id)) return [player.id, Object.freeze({
    mode: 'original', donorId: player.id, classification: 'original-authored',
    ballTrackSource: player.id, ballTrackScale: 1,
  })];
  const profile = supportingUniformProfiles[donorId];
  if (!profile) throw new Error(`No reviewed uniform profile exists for donor ${donorId}`);
  return [player.id, Object.freeze({
    mode: 'shared', donorId, classification: 'derived-palette', lineage: 'shared-source', ballTrackSource: donorId,
    ballTrackScale: visualScale(player) / visualScale(donor),
    sourcePalette: Object.freeze([...donor.palette]), targetPalette: Object.freeze([...player.palette]),
    transform: profile.id, maskProfile: profile, review: profile.status,
    reviewDetails: Object.freeze({ scope: 'seven donor families × 29 clip types; mapped team palettes; light/dark and enlarged review', evidence: 'docs/animation-production/supporting-donor-palette-reviews/' }),
  })];
}))) ;

export const supportingLibrarySummary = Object.freeze({
  supportingPlayers: support.length,
  individuallyAuthoredLibraries: [...completed],
  sharedPlayers: support.length - completed.size,
  requiredClipsPerPlayer: 29,
  effectiveClipAssignments: support.length * 29,
  derivedClipAssignments: (support.length - completed.size) * 29,
  uniqueSupportingSourceLibraries: completed.size,
  donorSeed: supportingDonorSeed,
  derivedRecipientsPerDonor: supportingDonorCounts,
  totalAppearancesPerDonor: Object.freeze(Object.fromEntries(Object.entries(supportingDonorCounts).map(([id, count]) => [id, count + 1]))),
});
