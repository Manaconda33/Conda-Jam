let variants = new WeakMap();
const maxVariantsPerAtlas = 4;

function parseColor(color) {
  const match = /^#([\da-f]{6})$/i.exec(color || '');
  if (!match) return null;
  const value = Number.parseInt(match[1], 16);
  return [value >> 16, (value >> 8) & 255, value & 255];
}

function luminance([r, g, b]) { return .2126 * r + .7152 * g + .0722 * b; }
function hueAndChroma([r, g, b]) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let hue = 0;
  if (delta) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }
  return { hue: (hue + 360) % 360, chroma: delta };
}

function inRegion(x, y, frame, region) {
  const relativeX = (x - frame.x) / frame.w, relativeY = (y - frame.y) / frame.h;
  if (region.polygon?.length >= 3) {
    let inside = false;
    for (let i = 0, j = region.polygon.length - 1; i < region.polygon.length; j = i++) {
      const [xi, yi] = region.polygon[i], [xj, yj] = region.polygon[j];
      const intersects = ((yi > relativeY) !== (yj > relativeY)) &&
        relativeX < (xj - xi) * (relativeY - yi) / ((yj - yi) || Number.EPSILON) + xi;
      if (intersects) inside = !inside;
    }
    return inside;
  }
  return relativeX >= region.x[0] && relativeX <= region.x[1] && relativeY >= region.y[0] && relativeY <= region.y[1];
}
function matchesColor(color, mask) {
  const luma = luminance(color);
  if (luma < mask.luma[0] || luma > mask.luma[1]) return false;
  const { hue, chroma } = hueAndChroma(color);
  if (chroma < mask.chromaMin) return false;
  const [minHue, maxHue] = mask.hue;
  return minHue <= maxHue ? hue >= minHue && hue <= maxHue : hue >= minHue || hue <= maxHue;
}

/** Lazily derive a cached atlas with a reviewed, donor-specific garment mask. */
export function paletteVariantFor(source, sourceId, sourcePalette, targetPalette, frames = [], maskProfile = null, clipId = null) {
  if (typeof document === 'undefined' || !sourcePalette || !targetPalette || !maskProfile || maskProfile.status !== 'accepted') return source;
  const oldColors = sourcePalette.map(parseColor), newColors = targetPalette.map(parseColor);
  if (oldColors.length !== 2 || newColors.length !== 2 || [...oldColors, ...newColors].some(color => !color)) return source;
  if (oldColors.every((color, index) => color.every((channel, i) => channel === newColors[index][i]))) return source;
  let cache = variants.get(source);
  if (!cache) { cache = new Map(); variants.set(source, cache); }
  const cacheKey = `${sourceId}|${maskProfile.id}|${newColors.map(color => color.map(v => v.toString(16).padStart(2, '0')).join('')).join('-')}`;
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    cache.delete(cacheKey);
    cache.set(cacheKey, cached);
    return cached;
  }

  const canvas = document.createElement('canvas');
  canvas.width = source.naturalWidth; canvas.height = source.naturalHeight;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return source;
  context.drawImage(source, 0, 0);
  const image = context.getImageData(0, 0, canvas.width, canvas.height), pixels = image.data;
  const regions = frames.length ? frames : [{ x: 0, y: 0, w: canvas.width, h: canvas.height }];
  const jerseyMask = maskProfile.clips?.[clipId]?.jersey ?? maskProfile.jersey;
  const shortsMask = maskProfile.clips?.[clipId]?.shorts ?? maskProfile.shorts;
  const jerseyBase = luminance(parseColor(jerseyMask.sourceColor));
  const shortsBase = luminance(parseColor(shortsMask.sourceColor));
  for (const frame of regions) for (let y = frame.y; y < frame.y + frame.h; y++) for (let x = frame.x; x < frame.x + frame.w; x++) {
    const i = (y * canvas.width + x) * 4;
    if (pixels[i + 3] === 0) continue;
    const color = [pixels[i], pixels[i + 1], pixels[i + 2]];
    let role = -1, baseLuma = 0;
    if (inRegion(x, y, frame, shortsMask.region) && matchesColor(color, shortsMask)) {
      role = 1;
      baseLuma = shortsBase;
    } else if (inRegion(x, y, frame, jerseyMask.region) && matchesColor(color, jerseyMask)) {
      role = 0;
      baseLuma = jerseyBase;
    }
    if (role < 0 || baseLuma <= 0) continue;
    const ratio = luminance(color) / baseLuma;
    const shade = Math.max(.35, Math.min(1.65, ratio));
    const target = newColors[role];
    pixels[i] = Math.round(Math.max(0, Math.min(255, target[0] * shade)));
    pixels[i + 1] = Math.round(Math.max(0, Math.min(255, target[1] * shade)));
    pixels[i + 2] = Math.round(Math.max(0, Math.min(255, target[2] * shade)));
  }
  context.putImageData(image, 0, 0);
  cache.set(cacheKey, canvas);
  if (cache.size > maxVariantsPerAtlas) cache.delete(cache.keys().next().value);
  return canvas;
}

export function clearPaletteVariantCache() { variants = new WeakMap(); }
