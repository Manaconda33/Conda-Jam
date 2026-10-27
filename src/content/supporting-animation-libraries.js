import { teams } from './teams.js';

const libraryOwners = teams.flatMap(team => team.roster);
const support = libraryOwners.filter(player => !player.captain);
const completed = new Set([
  'reed-ashcroft', 'juniper-vale', 'piper-quickstep', 'moxie-capwell',
  'dorian-mycel', 'nova-stitch', 'echo-catwalk'
]);

function selectDonor(player) {
  if (player.rig === 'athletic-variant') return 'echo-catwalk';
  if (player.height === 'compact') return 'juniper-vale';
  return 'reed-ashcroft';
}

export const supportingAnimationLibraries = Object.freeze(Object.fromEntries(support.map(player => {
  if (completed.has(player.id)) return [player.id, Object.freeze({ mode: 'original', donorId: player.id, classification: 'original-authored' })];
  const donorId = selectDonor(player);
  const donor = libraryOwners.find(candidate => candidate.id === donorId);
  const shortsMask = donorId === 'reed-ashcroft' ? 'neutral-light-shorts' : donorId === 'juniper-vale' ? 'neutral-dark-shorts' : 'cool-dark-shorts';
  return [player.id, Object.freeze({
    mode: 'shared', donorId, classification: 'shared-source',
    sourcePalette: Object.freeze([...donor.palette]), targetPalette: Object.freeze([...player.palette]),
    transform: 'frame-relative-garment-mask-v2', maskPolicy: Object.freeze({ primary: 'source-kit-color-inside-torso-zone', secondary: shortsMask }), review: 'pending'
  })];
}))) ;

export const supportingLibrarySummary = Object.freeze({
  supportingPlayers: support.length,
  individuallyAuthoredLibraries: [...completed],
  sharedPlayers: support.length - completed.size,
  requiredClipsPerPlayer: 29,
});
