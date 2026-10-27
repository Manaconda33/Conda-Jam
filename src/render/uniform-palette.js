let variants = new WeakMap();
const distanceLimit = 52;

function parseColor(color) {
  const match = /^#([\da-f]{6})$/i.exec(color || '');
  if (!match) return null;
  const value = Number.parseInt(match[1], 16);
  return [value >> 16, (value >> 8) & 255, value & 255];
}

function luminance([r, g, b]) { return .2126 * r + .7152 * g + .0722 * b; }
const shortsSourceColor = Object.freeze({ 'neutral-light-shorts': '#d8d5ce', 'neutral-dark-shorts': '#30313a', 'cool-dark-shorts': '#243a4e' });

/** Lazily derive a cached canvas; callers must pass a reviewed donor and palette. */
export function paletteVariantFor(source, sourceId, sourcePalette, targetPalette, frames = [], maskPolicy = {}) {
  if (typeof document === 'undefined' || !sourcePalette || !targetPalette) return source;
  const oldColors = sourcePalette.map(parseColor), newColors = targetPalette.map(parseColor);
  if (oldColors.length !== 2 || newColors.length !== 2 || [...oldColors, ...newColors].some(color => !color)) return source;
  if (oldColors.every((color, index) => color.every((channel, i) => channel === newColors[index][i]))) return source;
  let cache = variants.get(source);
  if (!cache) { cache = new Map(); variants.set(source, cache); }
  const cacheKey = `${sourceId}|${newColors.map(color => color.map(v => v.toString(16).padStart(2, '0')).join('')).join('-')}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const canvas = document.createElement('canvas');
  canvas.width = source.naturalWidth; canvas.height = source.naturalHeight;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return source;
  context.drawImage(source, 0, 0);
  const image = context.getImageData(0, 0, canvas.width, canvas.height), pixels = image.data;
  const regions = frames.length ? frames : [{ x: 0, y: 0, w: canvas.width, h: canvas.height }];
  for (const frame of regions) for (let y = frame.y; y < frame.y + frame.h; y++) for (let x = frame.x; x < frame.x + frame.w; x++) {
    const i = (y * canvas.width + x) * 4;
    if (pixels[i + 3] === 0) continue;
    const color = [pixels[i], pixels[i + 1], pixels[i + 2]], relativeY = (y - frame.y) / frame.h, relativeX = (x - frame.x) / frame.w;
    let best = -1, bestDistance = distanceLimit ** 2;
    if ((frame.h < 8 || relativeY >= .41 && relativeY <= .69) && (frame.w < 8 || relativeX >= .25 && relativeX <= .75) && luminance(color) >= 48 && luminance(color) <= 248) {
      const base = oldColors[0], dr = color[0] - base[0], dg = color[1] - base[1], db = color[2] - base[2], distance = dr * dr + dg * dg + db * db;
      if (distance < bestDistance) { best = 0; bestDistance = distance; }
    }
    if ((frame.h < 8 || relativeY >= .66 && relativeY <= .86) && (frame.w < 8 || relativeX >= .38 && relativeX <= .62)) {
      const [r, g, b] = color, chroma = Math.max(r, g, b) - Math.min(r, g, b), luma = luminance(color), policy = maskPolicy.secondary;
      const shortsMatch = policy === 'neutral-light-shorts' ? chroma <= 40 && luma >= 130
        : policy === 'neutral-dark-shorts' ? chroma <= 34 && luma >= 30 && luma <= 100
          : policy === 'cool-dark-shorts' ? chroma <= 90 && luma >= 24 && luma <= 100 && b >= r
            : false;
      if (shortsMatch) { best = 1; bestDistance = 0; }
    }
    if (best < 0) continue;
    const baseLuma = best === 1 ? luminance(parseColor(shortsSourceColor[maskPolicy.secondary])) : luminance(oldColors[best]);
    const ratio = baseLuma > 0 ? luminance(color) / baseLuma : 1;
    const target = newColors[best];
    const shade = Math.max(.35, Math.min(1.65, ratio));
    pixels[i] = Math.round(Math.max(0, Math.min(255, target[0] * shade)));
    pixels[i + 1] = Math.round(Math.max(0, Math.min(255, target[1] * shade)));
    pixels[i + 2] = Math.round(Math.max(0, Math.min(255, target[2] * shade)));
  }
  context.putImageData(image, 0, 0);
  cache.set(cacheKey, canvas);
  return canvas;
}

export function clearPaletteVariantCache() { variants = new WeakMap(); }
