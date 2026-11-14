// Palette ramps: each material is a list of colors from shadow to highlight.
// Characters reference materials by name, so swapping a ramp re-skins a part.

export const MANACONDA_RAMPS = {
  outline: [[22, 12, 26]],
  skin: [[112, 56, 38], [170, 94, 56], [216, 134, 82], [244, 180, 124]],
  purple: [[34, 10, 82], [66, 22, 146], [100, 46, 200], [146, 102, 234]],
  scarf: [[46, 12, 104], [84, 30, 176], [124, 64, 226], [170, 126, 246]],
  gold: [[118, 70, 8], [192, 136, 22], [242, 202, 70]],
  white: [[146, 146, 178], [212, 212, 232], [250, 250, 255]],
  hair: [[34, 26, 26], [64, 52, 48], [98, 84, 76]],
  topknot: [[92, 52, 12], [160, 98, 20], [218, 160, 54]],
  beard: [[58, 54, 58], [102, 98, 102], [156, 152, 156]],
  lens: [[26, 8, 46], [64, 34, 104], [168, 146, 222]],
  shoe: [[40, 12, 86], [80, 30, 160], [124, 72, 220]],
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
