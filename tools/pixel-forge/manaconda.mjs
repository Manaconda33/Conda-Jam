// Manaconda: a character spec (what he is made of) plus his idle frame-0 pose
// (where the joints are in the 64x96 frame). Coordinates measured from the
// image-model reference sprite; every pixel is drawn by the parts library.
import { MANACONDA_RAMPS } from './palette.mjs';

export const manaconda = {
  id: 'manaconda',
  frame: [64, 96],
  ramps: MANACONDA_RAMPS,
  // Part slots -> palette ramps. Re-skinning another character starts here.
  mat: { skin: 'skin', jersey: 'purple', trim: 'gold', sleeve: 'white', sock: 'white', band: 'purple',
    shoe: 'shoe', hair: 'hair', topknot: 'topknot', beard: 'beard', lens: 'lens', scarf: 'scarf' },
  arms: {
    backArm: { upper: [4.2, 3.4], fore: [3.3, 2.7], band: 3, hand: [3.4, 4], sleeve: true, bias: -0.12, deltoid: [4.4, 4], bicep: [3.6, 4.4, -0.6] },
    frontArm: { upper: [4.4, 3.6], fore: [3.5, 2.8], band: 3, hand: [3.4, 4.2], sleeve: false, deltoid: [4.6, 4.2], bicep: [3.8, 4.6, 0.8] },
  },
  legs: {
    backLeg: { thigh: 4.2, sock: [4, 3], bias: -0.1 },
    frontLeg: { thigh: 4.4, sock: [4.2, 3.1] },
  },
  emblem: [
    'Y.....Y',
    'YY...YY',
    '.YYyYY.',
    '..YYY..',
    '...Y...',
  ],
  glasses: [
    '##########',
    '#gLL##gLL#',
    '.#LL#.#L#.',
  ],
};

export const idleFrame0 = {
  topknot: [37, 14],
  topknotTips: [[24, 10], [26, 7], [29, 5], [32, 5], [35, 6], [22, 13], [26, 12], [29, 9], [32, 9], [24, 16], [27, 15], [38, 8], [30, 13]],
  scarf: { strands: [
    { from: [37, 27], step: 4.1, drop: 2.2, wave: 1.9, phase: 0.3, widths: [5.5, 5.3, 5, 4.6, 4.1, 3.4, 2.6, 1.6, 0.6] },
    { from: [33, 33], step: 3.4, drop: 2.1, wave: 1.5, phase: 1.6, widths: [3.8, 3.6, 3.2, 2.8, 2.2, 1.4, 0.6] },
  ] },
  scarfWrap: { centre: [[32, 31], [36, 28], [42, 27], [47, 27], [51, 30]], widths: [4, 4.1, 3.8, 3.5, 2.8] },
  backArm: { shoulder: [31, 32], elbow: [25, 42], wrist: [22, 56], hand: [22, 61] },
  frontArm: { shoulder: [48, 33], elbow: [51, 44], wrist: [53, 56], hand: [54, 61] },
  backLeg: { hip: [32, 63], knee: [28, 70], ankle: [25, 83],
    shoe: [[16, 91], [19, 88], [23, 86], [29, 86], [31, 88], [31, 93], [17, 93]], sole: [[17, 93], [30, 93]], shoeTrim: [[20, 89], [28, 89]] },
  frontLeg: { hip: [45, 63], knee: [44, 70], ankle: [43, 83],
    shoe: [[38, 88], [41, 86], [47, 86], [53, 88], [56, 90], [56, 93], [38, 93]], sole: [[39, 93], [55, 93]], shoeTrim: [[42, 89], [52, 90]] },
  shorts: {
    outline: [[31, 52], [50, 52], [51, 60], [50, 66], [41, 67], [39, 63], [37, 67], [28, 66], [29, 59]],
    stripes: [[[32, 53], [31, 65]]],
    hem: [[29, 66], [37, 66]],
  },
  jersey: {
    outline: [[32, 30], [38, 29], [41, 33], [44, 29], [50, 30], [51, 37], [50, 47], [48, 56], [34, 56], [32, 48], [31, 38]],
    trim: [[[37, 29], [41, 33]], [[41, 33], [45, 29]], [[50, 31], [49, 40]], [[34, 34], [35, 55]], [[47, 41], [47, 55]]],
    emblem: [38, 37],
  },
  head: {
    neck: [[41, 24], [40, 30]],
    center: [43, 19], radius: [7, 8.5],
    ear: [37, 20],
    nose: [50, 19],
    beard: [45, 25.5], beardRadius: [5.4, 4.2],
    mustache: [[43, 22], [49, 22]],
    hair: [[33, 22], [33, 15], [36, 10], [42, 8], [48, 9], [51, 12], [51, 15], [46, 14], [42, 15], [40, 18], [39, 22]],
    sideburn: [[38, 18], [41, 18], [42, 24], [40, 26], [38, 23]],
    strands: [[[37, 12], [43, 11]], [[36, 15], [41, 13]], [[45, 11], [49, 12]]],
    glasses: [40, 16],
  },
};
