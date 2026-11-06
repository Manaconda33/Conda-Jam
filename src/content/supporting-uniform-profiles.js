/**
 * Garment-only palette masks for the approved supporting-player donors.
 * Coordinates are normalized to each atlas cell. Source-color hue and value
 * ranges were sampled from the source atlases; the body zones intentionally
 * exclude heads, forearms, shoes and most accessories.
 */
const profiles = {
  'reed-ashcroft': {
    id: 'reed-body-mask-v1', status: 'accepted',
    jersey: { region: { x: [.28, .73], y: [.34, .64] }, hue: [235, 305], chromaMin: 24, luma: [16, 150], sourceColor: '#443b92' },
    shorts: { region: { x: [.29, .72], y: [.64, .81] }, hue: [235, 305], chromaMin: 24, luma: [12, 145], sourceColor: '#443b92' },
  },
  'juniper-vale': {
    id: 'juniper-body-mask-v6', status: 'accepted',
    jersey: { region: { x: [.39, .73], y: [.38, .65] }, hue: [235, 305], chromaMin: 24, luma: [16, 150], sourceColor: '#443b92' },
    shorts: { region: { x: [.39, .74], y: [.64, .82] }, hue: [235, 305], chromaMin: 24, luma: [12, 145], sourceColor: '#443b92' },
    clips: { fall: {
      jersey: { region: { x: [.62, .95], y: [.76, .94], polygon: [[.64,.83],[.76,.76],[.91,.8],[.95,.89],[.79,.94],[.65,.91]] }, hue: [235, 305], chromaMin: 24, luma: [16, 150], sourceColor: '#443b92' },
      shorts: { region: { x: [.05, .55], y: [.81, .95] }, hue: [235, 305], chromaMin: 24, luma: [12, 145], sourceColor: '#443b92' },
    } },
  },
  'piper-quickstep': {
    id: 'piper-body-mask-v2', status: 'accepted',
    jersey: { region: { x: [.31, .75], y: [.34, .65] }, hue: [350, 18], chromaMin: 50, luma: [12, 165], sourceColor: '#b64d27' },
    shorts: { region: { x: [.32, .74], y: [.64, .82] }, hue: [350, 18], chromaMin: 48, luma: [10, 155], sourceColor: '#b64d27' },
    clips: { fall: {
      jersey: { region: { x: [.32, .59], y: [.61, .78] }, hue: [350, 18], chromaMin: 50, luma: [12, 165], sourceColor: '#b64d27' },
      shorts: { region: { x: [.38, .8], y: [.73, .87] }, hue: [350, 18], chromaMin: 48, luma: [10, 155], sourceColor: '#b64d27' },
    } },
  },
  'moxie-capwell': {
    id: 'moxie-body-mask-v4', status: 'accepted',
    jersey: { region: { x: [.39, .73], y: [.36, .64] }, hue: [245, 310], chromaMin: 20, luma: [16, 165], sourceColor: '#743eb5' },
    shorts: { region: { x: [.38, .73], y: [.63, .82] }, hue: [245, 310], chromaMin: 18, luma: [12, 160], sourceColor: '#743eb5' },
    clips: { fall: {
      jersey: { region: { x: [.55, .8], y: [.67, .82] }, hue: [245, 310], chromaMin: 20, luma: [16, 165], sourceColor: '#743eb5' },
      shorts: { region: { x: [.24, .72], y: [.75, .92] }, hue: [245, 310], chromaMin: 18, luma: [12, 160], sourceColor: '#743eb5' },
    } },
  },
  'dorian-mycel': {
    id: 'dorian-body-mask-v5', status: 'accepted',
    jersey: { region: { x: [.38, .72], y: [.28, .58] }, hue: [260, 325], chromaMin: 24, luma: [12, 225], sourceColor: '#743eb5' },
    shorts: { region: { x: [.38, .72], y: [.5, .74] }, hue: [260, 325], chromaMin: 20, luma: [10, 220], sourceColor: '#743eb5' },
    clips: { fall: {
      jersey: { region: { x: [.24, .74], y: [.5, .92], polygon: [[.27,.59],[.4,.53],[.58,.57],[.73,.7],[.68,.82],[.52,.9],[.32,.84],[.24,.73]] }, hue: [260, 325], chromaMin: 24, luma: [12, 225], sourceColor: '#743eb5' },
      shorts: { region: { x: [.45, .82], y: [.7, .93], polygon: [[.45,.72],[.66,.69],[.82,.79],[.79,.91],[.59,.93],[.48,.85]] }, hue: [260, 325], chromaMin: 20, luma: [10, 220], sourceColor: '#743eb5' },
    } },
  },
  'nova-stitch': {
    id: 'nova-body-mask-v1', status: 'accepted',
    jersey: { region: { x: [.42, .78], y: [.36, .65] }, hue: [155, 205], chromaMin: 28, luma: [12, 155], sourceColor: '#159d9b' },
    shorts: { region: { x: [.42, .77], y: [.64, .83] }, hue: [155, 205], chromaMin: 24, luma: [10, 150], sourceColor: '#159d9b' },
  },
  'echo-catwalk': {
    id: 'echo-v7-reviewed', status: 'accepted',
    jersey: { region: { x: [.08, .92], y: [.28, .82] }, hue: [165, 215], chromaMin: 22, luma: [24, 248], sourceColor: '#159d9b' },
    shorts: { region: { x: [.18, .82], y: [.53, .79] }, hue: [195, 310], chromaMin: 28, luma: [18, 160], sourceColor: '#243a4e' },
    legacyV7: true,
  },
};

export const supportingUniformProfiles = Object.freeze(Object.fromEntries(Object.entries(profiles).map(([id, profile]) => [
  id,
  Object.freeze({
    ...profile,
    status: 'accepted', review: Object.freeze({
      status: 'accepted', reviewedAt: '2026-10-28', reviewer: 'independent visual review',
      scope: '9 mapped target palettes × 29 required clips per donor; enlarged pose-family checks; source alpha compared across every derived clip frame',
      evidence: `docs/animation-production/supporting-donor-palette-reviews/${id}/`,
      alphaMismatchPixels: 0,
    }),
    jersey: Object.freeze({ ...profile.jersey, region: Object.freeze({ x: Object.freeze([...profile.jersey.region.x]), y: Object.freeze([...profile.jersey.region.y]) }), hue: Object.freeze([...profile.jersey.hue]), luma: Object.freeze([...profile.jersey.luma]) }),
    shorts: Object.freeze({ ...profile.shorts, region: Object.freeze({ x: Object.freeze([...profile.shorts.region.x]), y: Object.freeze([...profile.shorts.region.y]) }), hue: Object.freeze([...profile.shorts.hue]), luma: Object.freeze([...profile.shorts.luma]) }),
    clips: Object.freeze(Object.fromEntries(Object.entries(profile.clips ?? {}).map(([clip, roles]) => [clip, Object.freeze(Object.fromEntries(Object.entries(roles).map(([role, mask]) => [role, Object.freeze({ ...mask, region: Object.freeze({ x: Object.freeze([...mask.region.x]), y: Object.freeze([...mask.region.y]), ...(mask.region.polygon ? { polygon: Object.freeze(mask.region.polygon.map(point => Object.freeze([...point]))) } : {}) }), hue: Object.freeze([...mask.hue]), luma: Object.freeze([...mask.luma]) })])))]))),
  }),
])));
