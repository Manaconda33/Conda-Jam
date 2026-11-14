// Render Manaconda's idle frame 0 in both styles to tools/pixel-forge/out/.
// Usage: node tools/pixel-forge/build.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import { render } from './render.mjs';
import { manaconda, idleFrame0 } from './manaconda.mjs';

const outDir = new URL('./out/', import.meta.url);
mkdirSync(outDir, { recursive: true });
for (const style of ['clean', 'painterly']) {
  const img = render(manaconda, idleFrame0, style);
  const png = new PNG({ width: img.width, height: img.height });
  png.data = Buffer.from(img.data);
  writeFileSync(new URL(`manaconda-idle-f0-${style}.png`, outDir), PNG.sync.write(png));
  const colors = new Set();
  for (let i = 0; i < img.data.length; i += 4) if (img.data[i + 3]) colors.add(img.data.slice(i, i + 3).join());
  console.log(`${style}: ${img.width}x${img.height}, ${colors.size} colors`);
}
