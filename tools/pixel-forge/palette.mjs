// Palette ramps: each material is a list of colors from shadow to highlight.
// Characters reference materials by name, so swapping a ramp re-skins a part.

export const MANACONDA_RAMPS = {
  outline: [[22, 12, 26]],
  skin: [[110, 54, 30], [176, 96, 50], [218, 138, 80], [244, 182, 122]],
  purple: [[30, 10, 76], [62, 22, 140], [96, 44, 196], [140, 98, 232]],
  scarf: [[44, 12, 102], [82, 30, 172], [122, 62, 224], [168, 124, 246]],
  gold: [[124, 74, 10], [198, 140, 26], [246, 206, 78]],
  white: [[148, 146, 180], [214, 212, 234], [250, 250, 255]],
  hair: [[26, 18, 16], [58, 38, 28], [96, 70, 52]],
  silver: [[120, 120, 128], [184, 184, 190], [236, 236, 240]],
  beard: [[38, 30, 28], [86, 80, 78], [156, 152, 152]],
  frame: [[16, 16, 64], [38, 42, 136], [78, 96, 204]],
  lens: [[96, 116, 190], [150, 172, 232], [206, 220, 250]],
  branch: [[64, 34, 16], [112, 64, 30], [160, 104, 54]],
  leaf: [[46, 92, 30], [88, 146, 52], [150, 196, 92]],
  blossom: [[200, 196, 210], [244, 242, 248], [255, 255, 255]],
  pollen: [[200, 150, 20], [240, 196, 50], [255, 232, 120]],
  shoe: [[38, 12, 84], [78, 30, 158], [122, 72, 218]],
};

const lerp = (a, b, t) => a + (b - a) * t;

function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

function hslToRgb([h, s, l]) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [r, g, b].map(v => Math.round((v + m) * 255));
}

// Resample a ramp to `steps` colors. With `hueShift`, shadows drift toward
// violet and highlights toward warm yellow, a common painterly pixel-art trick.
export function resampleRamp(ramp, steps, hueShift = 0) {
  if (ramp.length === 1 || steps === ramp.length && !hueShift) return ramp.slice();
  const out = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1), pos = t * (ramp.length - 1), k = Math.min(ramp.length - 2, Math.floor(pos)), f = pos - k;
    let rgb = ramp[k].map((v, c) => lerp(v, ramp[k + 1][c], f));
    if (hueShift) {
      const [h, s, l] = rgbToHsl(rgb);
      const target = t < 0.5 ? 265 : 50, amount = Math.abs(t - 0.5) * 2 * hueShift;
      let dh = ((target - h + 540) % 360) - 180;
      rgb = hslToRgb([(h + dh * amount * 0.35 + 360) % 360, s, l]);
    }
    out.push(rgb.map(v => Math.round(v)));
  }
  return out;
}

// Build the per-style palette: clean keeps 3 tones per material, painterly 5.
export function stylePalette(ramps, style) {
  const tones = style === 'painterly' ? 5 : 3;
  const shift = style === 'painterly' ? 0.4 : 0;
  return Object.fromEntries(Object.entries(ramps).map(([name, ramp]) =>
    [name, name === 'outline' ? ramp : resampleRamp(ramp, tones, shift)]));
}
