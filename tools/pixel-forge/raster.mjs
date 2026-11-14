// Raster primitives. A canvas stores, per pixel, which part covers it, its
// material and a lighting value (0 = deep shadow, 1 = full light). Shapes are
// drawn back to front; the renderer turns lighting into palette tones later.

const LIGHT = normalize([-0.55, -0.7, 0.45]); // from the upper left, toward the viewer

function normalize(v) { const l = Math.hypot(...v) || 1; return v.map(x => x / l); }

// `s` is the resolution scale: poses and parts are written in 64x96 units and
// every primitive multiplies its coordinates and sizes by s.
export function createCanvas(width, height, s = 1) {
  return { width, height, s, part: new Int16Array(width * height).fill(-1),
    material: new Array(width * height).fill(null), light: new Float32Array(width * height), parts: [] };
}

function beginPart(cv, name) { cv.parts.push(name); return cv.parts.length - 1; }

function plot(cv, x, y, partId, material, light) {
  if (x < 0 || y < 0 || x >= cv.width || y >= cv.height) return;
  const i = y * cv.width + x;
  cv.part[i] = partId; cv.material[i] = material; cv.light[i] = Math.max(0, Math.min(1, light));
}

// Lambert shading of a rounded surface from a 2D offset normalised to its radius.
function shadeRound(nx, ny, bias = 0) {
  const r2 = nx * nx + ny * ny, nz = Math.sqrt(Math.max(0, 1 - Math.min(1, r2)));
  const d = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
  return 0.18 + 0.82 * Math.max(0, d) + bias;
}

// Filled ellipse, shaded as a dome.
export function ellipse(cv, name, material, cx, cy, rx, ry, { bias = 0 } = {}) {
  const id = beginPart(cv, name);
  cx *= cv.s; cy *= cv.s; rx *= cv.s; ry *= cv.s;
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry;
      if (nx * nx + ny * ny <= 1) plot(cv, x, y, id, material, shadeRound(nx, ny, bias));
    }
  return id;
}

// Tapered capsule from a (radius ra) to b (radius rb), shaded as a cylinder.
export function capsule(cv, name, material, a, b, ra, rb, { bias = 0 } = {}) {
  const id = beginPart(cv, name);
  a = sc(cv, a); b = sc(cv, b); ra *= cv.s; rb *= cv.s;
  const dx = b[0] - a[0], dy = b[1] - a[1], len2 = dx * dx + dy * dy || 1, rmax = Math.max(ra, rb);
  for (let y = Math.floor(Math.min(a[1], b[1]) - rmax); y <= Math.ceil(Math.max(a[1], b[1]) + rmax); y++)
    for (let x = Math.floor(Math.min(a[0], b[0]) - rmax); x <= Math.ceil(Math.max(a[0], b[0]) + rmax); x++) {
      const px = x + 0.5, py = y + 0.5;
      const t = Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / len2));
      const cx = a[0] + dx * t, cy = a[1] + dy * t, r = ra + (rb - ra) * t;
      const ox = px - cx, oy = py - cy;
      if (ox * ox + oy * oy <= r * r) plot(cv, x, y, id, material, shadeRound(ox / r, oy / r, bias));
    }
  return id;
}

// Filled polygon with a simple top-left gradient (cloth panels, shoe soles).
export function polygon(cv, name, material, pts, { bias = 0, curve = 0.5, axis = null, speckle = 0 } = {}) {
  const id = beginPart(cv, name);
  pts = pts.map(p => sc(cv, p));
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = (x1 - x0) / 2 || 1, ry = (y1 - y0) / 2 || 1;
  for (let y = Math.floor(y0); y <= Math.ceil(y1); y++)
    for (let x = Math.floor(x0); x <= Math.ceil(x1); x++) {
      if (!inside(pts, x + 0.5, y + 0.5)) continue;
      // axis 'x' shades like an upright cylinder (torsos, shorts), otherwise like a dome.
      const nx = ((x + 0.5 - cx) / rx) * curve, ny = axis === 'x' ? -0.25 : ((y + 0.5 - cy) / ry) * curve;
      // speckle adds a fixed per-pixel variation (salt-and-pepper beard, worn cloth).
      plot(cv, x, y, id, material, shadeRound(nx, ny, bias) + (speckle ? (hash(x, y) - 0.5) * speckle : 0));
    }
  return id;
}

const sc = (cv, p) => [p[0] * cv.s, p[1] * cv.s];
function hash(x, y) { let h = (x * 374761393 + y * 668265263) >>> 0; h = ((h ^ (h >>> 13)) * 1274126177) >>> 0; return (h % 1000) / 1000; }

function inside(pts, x, y) {
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

// Line (trim, stripes, glints) at a fixed lighting value; 1 pixel thick at
// base scale, thicker as the resolution scale grows.
export function line(cv, name, material, a, b, light = 0.75, { thin = false } = {}) {
  const id = beginPart(cv, name);
  a = sc(cv, a); b = sc(cv, b);
  const t = thin ? 1 : Math.max(1, Math.round(cv.s)), off = Math.floor((t - 1) / 2);
  const steps = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), 1);
  for (let s = 0; s <= steps; s++) {
    const f = s / steps, x = Math.round(a[0] + (b[0] - a[0]) * f), y = Math.round(a[1] + (b[1] - a[1]) * f);
    for (let dy = 0; dy < t; dy++) for (let dx = 0; dx < t; dx++) plot(cv, x - off + dx, y - off + dy, id, material, light);
  }
  return id;
}

// Pixel stamp from text rows: each character maps to [material, light].
// `rows` is either a list of rows or { base, hi }. Above base scale a hand-drawn
// `hi` version is drawn 1:1, centred on where the base stamp would land;
// without one the base stamp is enlarged nearest-neighbour (blocky).
export function stamp(cv, name, x0, y0, rows, key) {
  const id = beginPart(cv, name);
  const base = Array.isArray(rows) ? rows : rows.base, hi = Array.isArray(rows) ? null : rows.hi;
  if (cv.s !== 1 && hi) {
    const px = Math.round((x0 + base[0].length / 2) * cv.s - hi[0].length / 2), py = Math.round((y0 + base.length / 2) * cv.s - hi.length / 2);
    hi.forEach((row, dy) => [...row].forEach((ch, dx) => { const k = key[ch]; if (k) plot(cv, px + dx, py + dy, id, k[0], k[1]); }));
    return id;
  }
  base.forEach((row, dy) => [...row].forEach((ch, dx) => {
    const k = key[ch];
    if (!k) return;
    for (let y = Math.floor((y0 + dy) * cv.s); y < Math.floor((y0 + dy + 1) * cv.s); y++)
      for (let x = Math.floor((x0 + dx) * cv.s); x < Math.floor((x0 + dx + 1) * cv.s); x++) plot(cv, x, y, id, k[0], k[1]);
  }));
  return id;
}

// Ribbon: a strip of cloth along a centre line with a width per point. Each
// segment is a quad; folds come from a sine of the distance along the strip,
// so cloth reads as rippled rather than tubular.
export function ribbon(cv, name, material, centre, widths, { folds = 1.3, foldDepth = 0.32, base = 0.55, border = null } = {}) {
  const id = beginPart(cv, name);
  centre = centre.map(p => sc(cv, p)); widths = widths.map(w => w * cv.s);
  const borderPx = Math.max(1, Math.round(cv.s));
  const normals = centre.map((p, i) => {
    const a = centre[Math.max(0, i - 1)], b = centre[Math.min(centre.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l];
  });
  const edge = (i, s) => [centre[i][0] + normals[i][0] * widths[i] * s, centre[i][1] + normals[i][1] * widths[i] * s];
  for (let i = 0; i < centre.length - 1; i++) {
    const quad = [edge(i, -1), edge(i + 1, -1), edge(i + 1, 1), edge(i, 1)];
    const xs = quad.map(p => p[0]), ys = quad.map(p => p[1]);
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++)
      for (let x = Math.floor(Math.min(...xs)); x <= Math.ceil(Math.max(...xs)); x++) {
        if (!inside(quad, x + 0.5, y + 0.5)) continue;
        // Position along (u) and across (v) the strip drive the fold shading.
        const ax = centre[i + 1][0] - centre[i][0], ay = centre[i + 1][1] - centre[i][1], l2 = ax * ax + ay * ay || 1;
        const u = i + Math.max(0, Math.min(1, ((x + 0.5 - centre[i][0]) * ax + (y + 0.5 - centre[i][1]) * ay) / l2));
        const n = normals[i], v = ((x + 0.5 - centre[i][0]) * n[0] + (y + 0.5 - centre[i][1]) * n[1]) / (widths[i] || 1);
        const fold = base + foldDepth * Math.sin(u * folds + v * 0.9) - 0.12 * v;
        // Optional trim: the outermost pixel along each long edge uses another material.
        const onBorder = border && widths[i] > 1.6 * cv.s && Math.abs(v) > 1 - (borderPx + 0.1) / widths[i];
        plot(cv, x, y, id, onBorder ? border : material, onBorder ? fold + 0.2 : fold);
      }
  }
  return id;
}
