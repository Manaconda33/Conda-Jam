// Reusable body, clothing and feature parts. Every part reads joint positions
// from the pose and material names from the character spec, so the same part
// can be posed for any frame or re-skinned for another character.
import { ellipse, capsule, polygon, line, stamp, ribbon } from './raster.mjs';

const add = (p, dx = 0, dy = 0) => [p[0] + dx, p[1] + dy];
const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// Keys shared by text stamps: a letter picks a material slot and a light level.
function stampKey(spec, extra = {}) {
  const m = spec.mat;
  return {
    H: [m.hair, 0.15], h: [m.hair, 0.7], G: [m.silver, 0.9], g: [m.silver, 0.45],
    S: [m.skin, 0.55], s: [m.skin, 0.2], L: [m.skin, 0.95], M: [m.skin, 0],
    B: [m.beard, 0.15], b: [m.beard, 0.75], F: [m.frame, 0.5], f: [m.frame, 0.8], l: [m.lens, 0.5], E: [m.frame, 0],
    Y: [m.trim, 0.95], y: [m.trim, 0.45], P: [m.jersey, 0.3], W: [m.blossom, 0.95], w: [m.blossom, 0.4],
    O: [m.pollen, 0.8], V: [m.leaf, 0.7], v: [m.leaf, 0.3], ...extra,
  };
}

export function topknot(cv, pose, spec) {
  const base = pose.topknot;
  ellipse(cv, 'topknot-bun', spec.mat.topknot, base[0], base[1], 3, 2.6);
  pose.topknotTips.forEach((tip, k) => capsule(cv, 'topknot-spike', spec.mat.topknot, base, tip, 1.1, 0.25, { bias: k % 3 === 0 ? -0.2 : k % 3 === 1 ? 0.05 : 0.15 }));
}

// A branch growing from the hair: twig capsules, then blossoms and leaves.
export function branch(cv, pose, spec) {
  const b = pose.branch;
  for (const [from, to, r0, r1] of b.twigs) capsule(cv, 'branch', spec.mat.branch, from, to, r0, r1, { bias: -0.05 });
  for (const [x, y] of b.leaves) stamp(cv, 'leaf', x, y, ['vV'], stampKey(spec));
  for (const [x, y] of b.blossoms) stamp(cv, 'blossom', x - 1, y - 1, ['.W.', 'WOW', '.w.'], stampKey(spec));
}

// Long curly hair falling behind the head: overlapping curl ellipses with a
// few silver strands. Curls are data, so other hairstyles reuse the part.
export function hairBack(cv, pose, spec) {
  pose.hairBack.curls.forEach(([x, y, rx, ry], k) => ellipse(cv, 'hair-curl', spec.mat.hair, x, y, rx, ry, { bias: k % 2 ? -0.15 : 0 }));
  for (const [a, b] of pose.hairBack.silver) line(cv, 'hair-silver', spec.mat.silver, a, b, 0.6);
}

// A flowing scarf: gold-bordered cloth ribbons that start at the neck and
// trail away from the body. Animations move the anchor and wave phase.
export function scarfTail(cv, pose, spec) {
  for (const strand of pose.scarf.strands) {
    const { from, step, drop, wave, phase, widths } = strand, centre = [];
    for (let i = 0; i < widths.length; i++)
      centre.push([from[0] - i * step, from[1] + i * drop + Math.sin(i * 1.1 + phase) * wave]);
    ribbon(cv, 'scarf-tail', spec.mat.scarf, centre, widths, { folds: 1.6, foldDepth: 0.3, border: spec.mat.trim });
  }
}

export function scarfWrap(cv, pose, spec) {
  ribbon(cv, 'scarf-wrap', spec.mat.scarf, pose.scarfWrap.centre, pose.scarfWrap.widths, { folds: 2.2, foldDepth: 0.25, base: 0.6 });
}

// An arm: upper arm (with deltoid and bicep), forearm or sleeve, wristband, hand.
export function arm(cv, pose, spec, side) {
  const j = pose[side], look = spec.arms[side], bias = look.bias ?? 0;
  capsule(cv, `${side}-upper-arm`, spec.mat.skin, j.shoulder, j.elbow, look.upper[0], look.upper[1], { bias });
  if (look.deltoid) ellipse(cv, `${side}-deltoid`, spec.mat.skin, j.shoulder[0], j.shoulder[1] + 1, look.deltoid[0], look.deltoid[1], { bias });
  if (look.bicep) { const m = lerp2(j.shoulder, j.elbow, 0.5); ellipse(cv, `${side}-bicep`, spec.mat.skin, m[0] + look.bicep[2], m[1], look.bicep[0], look.bicep[1], { bias }); }
  const bandTop = add(j.wrist, 0, -look.band);
  // A compression sleeve can start above the elbow; laurel embroidery runs along it.
  const sleeveFrom = look.sleeve ? lerp2(j.shoulder, j.elbow, look.sleeveFrom ?? 1) : j.elbow;
  if (look.sleeve) {
    capsule(cv, `${side}-sleeve`, spec.mat.sleeve, sleeveFrom, j.elbow, look.upper[1] + 0.2, look.fore[0], { bias });
    capsule(cv, `${side}-sleeve`, spec.mat.sleeve, j.elbow, bandTop, look.fore[0], look.fore[1], { bias });
    for (let t = 0.12; t < 0.95; t += 0.16) { const p = lerp2(sleeveFrom, bandTop, t); line(cv, 'sleeve-laurel', spec.mat.trim, [p[0] - 1, p[1]], [p[0], p[1] + 1], 0.75); }
  } else capsule(cv, `${side}-forearm`, spec.mat.skin, j.elbow, bandTop, look.fore[0], look.fore[1], { bias });
  capsule(cv, `${side}-wristband`, spec.mat.band, bandTop, j.wrist, look.fore[1] + 0.3, look.fore[1] + 0.3);
  if (look.bandStar) stamp(cv, 'wristband-star', Math.round(j.wrist[0]), Math.round(j.wrist[1] - look.band / 2 - 1), ['Y'], stampKey(spec));
  ellipse(cv, `${side}-hand`, spec.mat.skin, j.hand[0], j.hand[1], look.hand[0], look.hand[1], { bias: bias - 0.05 });
}

// A leg: compression tights to below the knee, bare calf, striped sock and a
// high-top sneaker with a star.
export function leg(cv, pose, spec, side) {
  const j = pose[side], look = spec.legs[side], bias = look.bias ?? 0;
  const tightsEnd = lerp2(j.knee, j.ankle, look.tightsTo ?? 0.25), sockTop = lerp2(j.knee, j.ankle, look.sockFrom ?? 0.7);
  capsule(cv, `${side}-calf`, spec.mat.skin, tightsEnd, sockTop, look.calf[0], look.calf[1], { bias });
  capsule(cv, `${side}-tights`, spec.mat.sock, j.hip, j.knee, look.thigh, look.thigh - 0.4, { bias });
  capsule(cv, `${side}-tights`, spec.mat.sock, j.knee, tightsEnd, look.thigh - 0.4, look.calf[0] + 0.2, { bias });
  line(cv, `${side}-tights-stripe`, spec.mat.trim, add(j.hip, look.stripe, 1), add(tightsEnd, look.stripe, -1), 0.7);
  capsule(cv, `${side}-sock`, spec.mat.sock, sockTop, j.ankle, look.calf[1] + 0.1, look.calf[1], { bias });
  line(cv, `${side}-sock-stripe`, spec.mat.band, add(sockTop, -2, 1), add(sockTop, 2, 1), 0.5);
  polygon(cv, `${side}-shoe`, spec.mat.shoe, j.shoe, { curve: 0.8, bias });
  const [s0, s1] = j.sole;
  line(cv, `${side}-midsole`, spec.mat.sock, add(s0, 0, -1), add(s1, 0, -1), 0.95);
  line(cv, `${side}-sole`, spec.mat.trim, s0, s1, 0.55);
  line(cv, `${side}-laces`, spec.mat.trim, j.laces[0], j.laces[1], 0.8);
  stamp(cv, `${side}-shoe-star`, j.star[0] - 1, j.star[1] - 1, ['.Y.', 'YYY', '.Y.'], stampKey(spec));
}

export function shorts(cv, pose, spec) {
  polygon(cv, 'shorts', spec.mat.jersey, pose.shorts.outline, { curve: 0.8, axis: 'x', bias: -0.22 });
  for (const [a, b] of pose.shorts.stripes) { line(cv, 'shorts-stripe', spec.mat.trim, a, b, 0.85); line(cv, 'shorts-stripe', spec.mat.trim, add(a, 1), add(b, 1), 0.55); }
  for (const [a, b] of pose.shorts.hems) line(cv, 'shorts-hem', spec.mat.trim, a, b, 0.7);
}

export function jersey(cv, pose, spec) {
  const jz = pose.jersey;
  polygon(cv, 'jersey', spec.mat.jersey, jz.outline, { curve: 0.9, axis: 'x', bias: -0.2 });
  for (const [a, b] of jz.trim) line(cv, 'jersey-trim', spec.mat.trim, a, b, 0.8);
  stamp(cv, 'emblem', jz.emblem[0], jz.emblem[1], spec.emblem, stampKey(spec));
  if (jz.number) stamp(cv, 'number', jz.number[0], jz.number[1], spec.number, stampKey(spec));
}

export function belt(cv, pose, spec) {
  const [a, b] = pose.belt.span, y = a[1];
  polygon(cv, 'belt', spec.mat.jersey, [[a[0], y - 1], [b[0], y - 1], [b[0], y + 1], [a[0], y + 1]], { bias: -0.35 });
  line(cv, 'belt-trim', spec.mat.trim, [a[0], y - 1], [b[0], y - 1], 0.75);
  line(cv, 'belt-trim', spec.mat.trim, [a[0], y + 1], [b[0], y + 1], 0.5);
  stamp(cv, 'buckle', pose.belt.buckle[0] - 1, y - 1, ['.Y.', 'YPY', '.Y.'], stampKey(spec));
}

// The head: neck capsule, then a hand-placed face stamp (likeness lives here),
// written as text rows of palette keys so it still re-skins with the ramps.
export function head(cv, pose, spec) {
  const h = pose.head;
  capsule(cv, 'neck', spec.mat.skin, h.neck[0], h.neck[1], 3.4, 3.6, { bias: -0.1 });
  stamp(cv, 'head', h.origin[0], h.origin[1], spec.face, stampKey(spec));
}
