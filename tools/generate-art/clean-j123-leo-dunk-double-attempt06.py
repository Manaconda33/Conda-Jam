from collections import deque
from hashlib import sha256
from pathlib import Path
from PIL import Image
import json

ROOT = Path(__file__).resolve().parents[2]
source = ROOT / 'tools/generate-art/sources/j123-leo-dunk-double-attempt06-generated-raw.png'
cleaned = ROOT / 'tools/generate-art/sources/j123-leo-dunk-double-attempt06-cleaned.png'
report_path = ROOT / 'tools/generate-art/j123-leo-dunk-double-attempt06-cleanup-report.json'
im = Image.open(source).convert('RGBA')
pixels = im.load(); w, h = im.size
cleared_low_alpha = 0
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if 0 < a < 16:
            pixels[x, y] = (0, 0, 0, 0)
            cleared_low_alpha += 1

# Remove only tiny detached residual components. Keep all body/hair/shoe groups.
visited = bytearray(w * h)
removed_components = 0
removed_pixels = 0
for y in range(h):
    for x in range(w):
        idx = y * w + x
        if visited[idx] or pixels[x, y][3] == 0:
            continue
        queue = deque([(x, y)]); visited[idx] = 1; component = [(x, y)]
        while queue:
            cx, cy = queue.popleft()
            for ny in range(max(0, cy - 1), min(h, cy + 2)):
                for nx in range(max(0, cx - 1), min(w, cx + 2)):
                    ni = ny * w + nx
                    if not visited[ni] and pixels[nx, ny][3] > 0:
                        visited[ni] = 1; queue.append((nx, ny)); component.append((nx, ny))
        if len(component) <= 6:
            removed_components += 1; removed_pixels += len(component)
            for cx, cy in component:
                pixels[cx, cy] = (0, 0, 0, 0)

im.save(cleaned, format='PNG', optimize=True)
report = {
    'source': str(source.relative_to(ROOT)),
    'cleanedSource': str(cleaned.relative_to(ROOT)),
    'sourceSha256': sha256(source.read_bytes()).hexdigest(),
    'cleanedSha256': sha256(cleaned.read_bytes()).hexdigest(),
    'dimensions': [w, h],
    'cleanup': 'Set alpha 1–15 to zero, then remove only 8-connected visible components of at most six pixels. No color or character pixels were recolored.',
    'clearedLowAlphaPixels': cleared_low_alpha,
    'removedDetachedComponents': removed_components,
    'removedDetachedPixels': removed_pixels,
    'reviewStatus': 'candidate only; independent visual review pending'
}
report_path.write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
