// Renderer: draws a character's parts in back-to-front order onto a raster
// canvas, then turns lighting into palette tones in one of two styles.
//   clean     - 3 tones per material, hard dark outline, interior edge lines
//   painterly - 5 hue-shifted tones blended with ordered dithering, coloured outlines
import { createCanvas } from './raster.mjs';
import { stylePalette } from './palette.mjs';
import * as P from './parts.mjs';

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => v / 16 - 0.5);

// Default back-to-front order. A pose can override it (e.g. an arm swung in
// front of the body during a dunk), so layering is data, not code.
export const DEFAULT_ORDER = ['branch', 'hairBack', 'scarfTail', 'backArm', 'frontArm', 'backLeg', 'frontLeg', 'shorts', 'jersey', 'belt', 'head', 'scarfWrap'];

const DRAW = {
  topknot: P.topknot, branch: P.branch, hairBack: P.hairBack, scarfTail: P.scarfTail, shorts: P.shorts, jersey: P.jersey, belt: P.belt, head: P.head, scarfWrap: P.scarfWrap,
  backArm: (cv, pose, spec) => P.arm(cv, pose, spec, 'backArm'),
  frontArm: (cv, pose, spec) => P.arm(cv, pose, spec, 'frontArm'),
  backLeg: (cv, pose, spec) => P.leg(cv, pose, spec, 'backLeg'),
  frontLeg: (cv, pose, spec) => P.leg(cv, pose, spec, 'frontLeg'),
};

export function drawCharacter(spec, pose) {
  const [w, h] = spec.frame, cv = createCanvas(w, h);
  for (const layer of pose.order ?? DEFAULT_ORDER) DRAW[layer](cv, pose, spec);
  return cv;
}

function toneIndex(light, tones, style, x, y) {
  if (style === 'painterly') {
    const v = light * (tones - 1) + BAYER4[(y % 4) * 4 + (x % 4)] * 0.6;
    return Math.max(0, Math.min(tones - 1, Math.round(v)));
  }
  return light < 0.36 ? 0 : light < 0.7 ? 1 : 2;
}

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

export function shade(cv, spec, style) {
  const pal = stylePalette(spec.ramps, style), outline = pal.outline[0];
  const { width: w, height: h } = cv, out = new Uint8Array(w * h * 4);
  const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? -1 : y * w + x);
  const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, o = i * 4;
    if (cv.part[i] < 0) {
      // Exterior outline: a transparent pixel touching the silhouette.
      const n = N4.map(([dx, dy]) => at(x + dx, y + dy)).find(j => j >= 0 && cv.part[j] >= 0);
      if (n === undefined) continue;
      const ramp = pal[cv.material[n]];
      const c = style === 'painterly' ? mix(ramp[0], outline, 0.55) : outline;
      out.set([...c, 255], o);
      continue;
    }
    const ramp = pal[cv.material[i]];
    let t = toneIndex(cv.light[i], ramp.length, style, x, y);
    // Interior edge: darken a pixel that sits just behind a part drawn in front of it.
    const behind = N4.some(([dx, dy]) => { const j = at(x + dx, y + dy); return j >= 0 && cv.part[j] > cv.part[i] && cv.material[j] !== cv.material[i]; });
    if (behind) t = Math.max(0, t - 1);
    out.set([...ramp[t], 255], o);
  }
  return { width: w, height: h, data: out };
}

export function render(spec, pose, style) { return shade(drawCharacter(spec, pose), spec, style); }
