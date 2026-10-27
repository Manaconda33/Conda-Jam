import { teams } from './teams.js';

const libraryOwners = teams.flatMap(team => team.roster);
const support = libraryOwners.filter(player => !player.captain);
const completed = new Set([
  'reed-ashcroft', 'juniper-vale', 'piper-quickstep', 'moxie-capwell',
  'dorian-mycel', 'nova-stitch', 'echo-catwalk'
]);

function selectDonor(player) {
  // Echo is the only reviewed complete donor whose dark hair and orange skin
  // remain outside the teal kit color family; one source also prevents style
  // changes between the human and athletic-variant clip sets.
  return 'echo-catwalk';
}
function visualScale(player) {
  return player.height === 'towering' ? 1.16 : player.height === 'compact' ? .88 : 1;
}

export const supportingAnimationLibraries = Object.freeze(Object.fromEntries(support.map(player => {
  const donorId = selectDonor(player);
  const donor = libraryOwners.find(candidate => candidate.id === donorId);
  if (completed.has(player.id)) return [player.id, Object.freeze({ mode: 'original', donorId: player.id, classification: 'original-authored', ballTrackSource: donorId, ballTrackScale: visualScale(player) / visualScale(donor) })];
  return [player.id, Object.freeze({
    mode: 'shared', donorId, classification: 'shared-source', ballTrackSource: donorId,
    ballTrackScale: visualScale(player) / visualScale(donor),
    sourcePalette: Object.freeze([...donor.palette]), targetPalette: Object.freeze([...player.palette]),
    transform: 'frame-hsv-garment-mask-v7', maskPolicy: Object.freeze({ primary: 'teal-kit-pixels', secondary: 'violet-cyan-shorts' }), review: 'accepted',
    reviewDetails: Object.freeze({ scope: '35 palettes × 29 clip types; light/dark and enlarged review', evidence: 'docs/animation-production/palette-mask-reviews/attempt-07-shoe-exclusion/' })
  })];
}))) ;

export const supportingLibrarySummary = Object.freeze({
  supportingPlayers: support.length,
  individuallyAuthoredLibraries: [...completed],
  sharedPlayers: support.length - completed.size,
  requiredClipsPerPlayer: 29,
});
