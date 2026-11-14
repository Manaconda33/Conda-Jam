// Reusable body, clothing and feature parts. Every part reads joint positions
// from the pose and material names from the character spec, so the same part
// can be posed for any frame or re-skinned for another character.
import { ellipse, capsule, polygon, line, stamp, ribbon } from './raster.mjs';

const add = (p, dx = 0, dy = 0) => [p[0] + dx, p[1] + dy];

export function topknot(cv, pose, spec) {
  const base = pose.topknot;
  ellipse(cv, 'topknot-bun', spec.mat.topknot, base[0], base[1], 3, 2.6);
  pose.topknotTips.forEach((tip, k) => capsule(cv, 'topknot-spike', spec.mat.topknot, base, tip, 1.1, 0.25, { bias: k % 3 === 0 ? -0.2 : k % 3 === 1 ? 0.05 : 0.15 }));
}

// A flowing scarf: cloth ribbons that start at the neck and trail away from
// the body. Animations move the anchor and wave phase; the cloth follows.
export function scarfTail(cv, pose, spec) {
  for (const strand of pose.scarf.strands) {
    const { from, step, drop, wave, phase, widths } = strand, centre = [];
    for (let i = 0; i < widths.length; i++)
      centre.push([from[0] - i * step, from[1] + i * drop + Math.sin(i * 1.1 + phase) * wave]);
    ribbon(cv, 'scarf-tail', spec.mat.scarf, centre, widths, { folds: 1.6, foldDepth: 0.3 });
  }
}

export function scarfWrap(cv, pose, spec) {
  ribbon(cv, 'scarf-wrap', spec.mat.scarf, pose.scarfWrap.centre, pose.scarfWrap.widths, { folds: 2.2, foldDepth: 0.25, base: 0.6 });
}

// An arm: upper arm, forearm (optionally a sleeve), wristband and hand.
export function arm(cv, pose, spec, side) {
  const j = pose[side], look = spec.arms[side];
  capsule(cv, `${side}-upper-arm`, spec.mat.skin, j.shoulder, j.elbow, look.upper[0], look.upper[1], { bias: look.bias ?? 0 });
  // Deltoid and bicep bulges sit on the upper arm (a muscular build).
  if (look.deltoid) ellipse(cv, `${side}-deltoid`, spec.mat.skin, j.shoulder[0], j.shoulder[1] + 1, look.deltoid[0], look.deltoid[1], { bias: look.bias ?? 0 });
  if (look.bicep) { const m = [(j.shoulder[0] + j.elbow[0]) / 2 + look.bicep[2], (j.shoulder[1] + j.elbow[1]) / 2]; ellipse(cv, `${side}-bicep`, spec.mat.skin, m[0], m[1], look.bicep[0], look.bicep[1], { bias: look.bias ?? 0 }); }
  const wrist = j.wrist, bandTop = add(wrist, 0, -look.band);
  capsule(cv, `${side}-forearm`, look.sleeve ? spec.mat.sleeve : spec.mat.skin, j.elbow, bandTop, look.fore[0], look.fore[1], { bias: look.bias ?? 0 });
  capsule(cv, `${side}-wristband`, spec.mat.band, bandTop, wrist, look.fore[1] + 0.3, look.fore[1] + 0.3);
  ellipse(cv, `${side}-hand`, spec.mat.skin, j.hand[0], j.hand[1], look.hand[0], look.hand[1], { bias: (look.bias ?? 0) - 0.05 });
}

// A leg below the shorts: a little thigh, a knee-high sock and a sneaker.
export function leg(cv, pose, spec, side) {
  const j = pose[side], look = spec.legs[side];
  capsule(cv, `${side}-thigh`, spec.mat.skin, j.hip, j.knee, look.thigh, look.thigh - 0.4, { bias: look.bias ?? 0 });
  capsule(cv, `${side}-sock`, spec.mat.sock, j.knee, j.ankle, look.sock[0], look.sock[1], { bias: look.bias ?? 0 });
  polygon(cv, `${side}-shoe`, spec.mat.shoe, j.shoe, { curve: 0.8, bias: look.bias ?? 0 });
  const [s0, s1] = j.sole;
  line(cv, `${side}-midsole`, spec.mat.sock, add(s0, 0, -1), add(s1, 0, -1), 0.95);
  line(cv, `${side}-sole`, spec.mat.trim, s0, s1, 0.55);
  line(cv, `${side}-shoe-trim`, spec.mat.trim, j.shoeTrim[0], j.shoeTrim[1], 0.8);
}

export function shorts(cv, pose, spec) {
  polygon(cv, 'shorts', spec.mat.jersey, pose.shorts.outline, { curve: 0.8, axis: 'x', bias: -0.22 });
  for (const [a, b] of pose.shorts.stripes) { line(cv, 'shorts-stripe', spec.mat.trim, a, b, 0.85); line(cv, 'shorts-stripe', spec.mat.trim, add(a, 1), add(b, 1), 0.55); }
  line(cv, 'shorts-hem', spec.mat.trim, pose.shorts.hem[0], pose.shorts.hem[1], 0.7);
}

export function jersey(cv, pose, spec) {
  polygon(cv, 'jersey', spec.mat.jersey, pose.jersey.outline, { curve: 0.9, axis: 'x', bias: -0.2 });
  for (const [a, b] of pose.jersey.trim) line(cv, 'jersey-trim', spec.mat.trim, a, b, 0.8);
  if (pose.jersey.hem) line(cv, 'jersey-hem', spec.mat.trim, pose.jersey.hem[0], pose.jersey.hem[1], 0.6);
  const [x, y] = pose.jersey.emblem;
  stamp(cv, 'emblem', x, y, spec.emblem, { Y: [spec.mat.trim, 0.95], y: [spec.mat.trim, 0.45] });
}

export function head(cv, pose, spec) {
  const h = pose.head;
  capsule(cv, 'neck', spec.mat.skin, h.neck[0], h.neck[1], 3.4, 3.6, { bias: -0.08 });
  ellipse(cv, 'head', spec.mat.skin, h.center[0], h.center[1], h.radius[0], h.radius[1]);
  ellipse(cv, 'ear', spec.mat.skin, h.ear[0], h.ear[1], 1.4, 2, { bias: -0.18 });
  ellipse(cv, 'beard', spec.mat.beard, h.beard[0], h.beard[1], h.beardRadius[0], h.beardRadius[1], { bias: -0.1 });
  if (h.sideburn) polygon(cv, 'sideburn', spec.mat.beard, h.sideburn, { curve: 0.6, bias: -0.15 });
  line(cv, 'mustache', spec.mat.beard, h.mustache[0], h.mustache[1], 0.5);
  ellipse(cv, 'nose', spec.mat.skin, h.nose[0], h.nose[1], 1.3, 1.8, { bias: 0.05 });
  polygon(cv, 'hair', spec.mat.hair, h.hair, { curve: 0.9 });
  for (const [a, b2] of h.strands ?? []) line(cv, 'hair-strand', spec.mat.hair, a, b2, 0.85);
  const [gx, gy] = h.glasses;
  stamp(cv, 'glasses', gx, gy, spec.glasses, { '#': [spec.mat.lens, 0], L: [spec.mat.lens, 0.4], g: [spec.mat.lens, 1] });
}
