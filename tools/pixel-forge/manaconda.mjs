// Manaconda: a character spec (what he is made of) plus his idle frame-0 pose
// (where the joints are in the 64x96 frame). Measured from the image-model
// sprite and the full illustration; every pixel is drawn by the parts library.
import { MANACONDA_RAMPS } from './palette.mjs';

export const manaconda = {
  id: 'manaconda',
  frame: [64, 96],
  ramps: MANACONDA_RAMPS,
  // Part slots -> palette ramps. Re-skinning another character starts here.
  mat: { skin: 'skin', jersey: 'purple', trim: 'gold', sleeve: 'white', sock: 'white', band: 'purple',
    shoe: 'shoe', hair: 'hair', silver: 'silver', beard: 'beard', frame: 'frame', lens: 'lens', scarf: 'scarf',
    branch: 'branch', leaf: 'leaf', blossom: 'blossom', pollen: 'pollen', topknot: 'branch' },
  arms: {
    backArm: { upper: [4.2, 3.4], fore: [3.4, 2.8], band: 3, hand: [3.4, 4], sleeve: true, sleeveFrom: 0.45, bandStar: true, bias: -0.12, deltoid: [4.4, 4], bicep: [3.6, 4.4, -0.6] },
    frontArm: { upper: [4.4, 3.6], fore: [3.5, 2.8], band: 3, hand: [3.4, 4.2], sleeve: false, bandStar: true, deltoid: [4.6, 4.2], bicep: [3.8, 4.6, 0.8] },
  },
  legs: {
    backLeg: { thigh: 4.3, calf: [3.3, 2.6], stripe: -3, tightsTo: 0.3, sockFrom: 0.74, bias: -0.1 },
    frontLeg: { thigh: 4.5, calf: [3.5, 2.7], stripe: 3, tightsTo: 0.3, sockFrom: 0.74 },
  },
  // Open book with laurels and a star above it.
  // Open book with laurels and a star above it.
  emblem: {
    base: [
      '....Y....',
      'y..YYY..y',
      'yY.....Yy',
      '.yYYyYYy.',
      '..YYYYY..',
    ],
    hi: [
      '......Y......',
      '.....YYY.....',
      'y.....Y.....y',
      'yy.........yy',
      '.yY.YYyYY.Yy.',
      '.yYYYYyYYYYy.',
      '..yYYYyYYYy..',
      '....y...y....',
    ],
  },
  number: {
    base: [
      'YYY.YYY',
      '..Y...Y',
      'YYY..YY',
      'Y.....Y',
      'YYY.YYY',
    ],
    hi: [
      '.YYY..YYYY.',
      'Y...Y.....Y',
      '....Y.....Y',
      '...Y...YYY.',
      '..Y.......Y',
      '.Y........Y',
      'YYYYY.YYYY.',
    ],
  },
  // 18x20 face, facing right: silver-streaked curls, ear, navy glasses with an
  // eye, nose, salt-and-pepper beard and a smile.
  face: [
    '......HHhHH.......',
    '....HHgGGgHHH.....',
    '...HhGGgHgGGGHH...',
    '..HHgHHhHHHgGGhH..',
    '.HHhHHHHhHHHHgHHH.',
    '.HhHHhHHHHHHHHSSS.',
    'HHHHHhHHHHHSSSSSSS',
    'HhHHHHHHHHSSLLSSSS',
    'HHHHHhHHHSSMMSSMMS',
    'HhHHHHHSSFFFFSFFFF',
    'HHHHHSsSSFllFFlElF',
    'HHHHSsSSSFFFFSFFFL',
    'HHHHSSsSSSSSSSSSSL',
    'hHHHbSSSSSSSSSsSS.',
    'HHHHbBSSSSSSSSSs..',
    'HhHHBBBSBBBBBBBB..',
    'HHH.BBbBBMMMMBb...',
    'HH..BbBBbBBBBBB...',
    'H...sBBbBBbBBB....',
    '.....sBBBbBB......',
  ],
};

export const idleFrame0 = {
  branch: {
    twigs: [[[34, 13], [26, 8], 1.3, 0.8], [[26, 8], [19, 4], 0.8, 0.4], [[26, 8], [24, 2], 0.7, 0.3], [[30, 10], [22, 11], 0.7, 0.35], [[22, 5], [17, 7], 0.5, 0.3]],
    blossoms: [[19, 4], [24, 2], [21, 11], [28, 6]],
    leaves: [[22, 7], [26, 4], [16, 6]],
  },
  hairBack: {
    curls: [[33, 13, 4, 3.5], [30, 16, 3.5, 3.5], [31, 21, 3.5, 3.5], [28, 24, 3, 3], [31, 26, 3, 3], [34, 24, 3, 3], [27, 19, 2.5, 2.5]],
    silver: [[[29, 13], [34, 11]], [[27, 18], [31, 16]]],
  },
  scarf: { strands: [
    { from: [37, 27], step: 4.1, drop: 2.2, wave: 1.9, phase: 0.3, widths: [5.5, 5.3, 5, 4.6, 4.1, 3.4, 2.6, 1.6, 0.6] },
    { from: [33, 33], step: 3.4, drop: 2.1, wave: 1.5, phase: 1.6, widths: [3.8, 3.6, 3.2, 2.8, 2.2, 1.4, 0.6] },
  ] },
  scarfWrap: { centre: [[32, 35], [36, 33], [42, 32], [47, 32], [50, 33]], widths: [3.6, 3.4, 3, 2.8, 2.4] },
  backArm: { shoulder: [31, 32], elbow: [25, 42], wrist: [22, 56], hand: [22, 61] },
  frontArm: { shoulder: [51, 33], elbow: [54, 44], wrist: [55, 56], hand: [56, 61] },
  backLeg: { hip: [32, 66], knee: [28, 74], ankle: [25, 85],
    shoe: [[17, 91], [20, 87], [22, 84], [29, 84], [30, 88], [31, 93], [18, 93]], sole: [[18, 93], [30, 93]],
    laces: [[23, 86], [28, 85]], star: [25, 89] },
  frontLeg: { hip: [45, 66], knee: [44, 74], ankle: [43, 85],
    shoe: [[38, 88], [39, 84], [46, 84], [48, 87], [54, 89], [56, 91], [56, 93], [38, 93]], sole: [[39, 93], [55, 93]],
    laces: [[40, 85], [45, 85]], star: [45, 89] },
  shorts: {
    outline: [[29, 57], [51, 57], [52, 63], [51, 69], [42, 69], [40, 65], [38, 69], [28, 69], [28, 62]],
    stripes: [[[31, 58], [30, 68]], [[48, 58], [49, 68]]],
    hems: [[[28, 69], [38, 69]], [[42, 69], [51, 69]]],
  },
  jersey: {
    outline: [[32, 30], [38, 29], [41, 33], [44, 29], [48, 30], [49, 37], [49, 47], [50, 55], [30, 55], [32, 47], [31, 38]],
    trim: [[[37, 29], [41, 33]], [[41, 33], [45, 29]], [[48, 31], [48, 40]], [[34, 34], [33, 55]], [[47, 41], [48, 55]]],
    emblem: [36, 33],
    number: [37, 40],
  },
  belt: { span: [[30, 56], [50, 56]], buckle: [41, 56] },
  head: {
    neck: [[41, 24], [40, 30]],
    origin: [33, 8],
    // Procedural head used above base scale (64x96 units, like everything else).
    shapes: {
      skull: [40.5, 15.5, 7.5, 7.5],
      face: [46, 17.5, 5, 6],
      jaw: [45, 21.5, 5.2, 4.5],
      ear: [39.6, 18.8, 1.3, 2],
      earInner: [[39.6, 18.2], [39.6, 19.6]],
      nose: [[49.6, 16.8], [51.2, 19.6], 0.9, 1.3],
      beard: [[39.2, 19], [41, 20], [42.5, 21.5], [45, 22], [48.5, 21.6], [50.5, 22.2], [50.3, 24], [48.6, 26.6], [45.5, 28], [42.2, 27.4], [40, 25], [38.8, 22]],
      mustache: [[46.3, 21.8], [50.4, 21.5], 0.9, 0.7],
      mouth: [[[47, 23.4], [49.6, 23.1]], [[49.6, 23.1], [50.3, 22.5]]],
      hairline: [[34, 15], [35.5, 10], [40, 7.5], [46, 7.2], [50.5, 9.5], [51.2, 11.6], [48.5, 11.2], [45.5, 11.8], [43, 12.6], [41.6, 15], [41, 18.2], [39, 17.4], [37, 19], [35, 18]],
      curls: [[37, 12, 1.2, 1], [39.5, 9.8, 1.3, 1], [36, 15.5, 1.1, 1.1], [43, 9, 1.2, 0.9], [38.5, 14, 1, 1]],
      // Wavy strands: short segments that rise and dip as they sweep back.
      silver: [[[50, 9.6], [47, 8.6], 0.5, 0.45], [[47, 8.6], [44, 9.4], 0.45, 0.4], [[44, 9.4], [40.5, 8.8], 0.4, 0.35], [[48.5, 10.8], [45, 10.2], 0.4, 0.35], [[45, 10.2], [42, 11.2], 0.35, 0.3], [[39.5, 11.8], [36.5, 13.2], 0.35, 0.3]],
      brow: [[44.6, 15.2], [50.2, 14.7]],
      lenses: [[[42.2, 16], [45, 16], [45, 18.6], [42.4, 18.6]], [[46.4, 16], [51, 16], [50.8, 18.8], [46.6, 18.8]]],
      frameBits: [[[45, 16.8], [46.4, 16.8]], [[42.2, 16.6], [39.6, 17.4]]],
      eye: [48.6, 17.4, 0.75, 0.7],
      glint: [48.9, 17.1],
    },
  },
};
