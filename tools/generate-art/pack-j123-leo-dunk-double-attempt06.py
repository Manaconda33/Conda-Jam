from hashlib import sha256
from pathlib import Path
from PIL import Image
from collections import deque
import numpy as np
import json

ROOT = Path(__file__).resolve().parents[2]
source_path = ROOT / 'tools/generate-art/sources/j123-leo-dunk-double-attempt06-cleaned.png'
atlas_path = ROOT / 'public/assets/animation/leo-dunk-double-attempt06-right.webp'
layout_path = ROOT / 'tools/generate-art/j123-leo-dunk-double-attempt06-layout.json'
preview_dir = ROOT / 'tools/generate-art/previews'
source = Image.open(source_path).convert('RGBA')
W, H = source.size
cols, rows = 5, 3
cell_w, cell_h = 128, 128
atlas_cols, atlas_rows = 4, 4
atlas = Image.new('RGBA', (atlas_cols * cell_w, atlas_rows * cell_h), (0, 0, 0, 0))
source_rects = []; destination_rects = []; transforms = []; frames = []
scale_x = 65 / W * cols
scale_y = 72 / H * rows
assert abs(scale_x - scale_y) < 0.002, (scale_x, scale_y)
for i in range(15):
    col, row = i % cols, i // cols
    sx0, sx1 = round(col * W / cols), round((col + 1) * W / cols)
    sy0, sy1 = round(row * H / rows), round((row + 1) * H / rows)
    cell = source.crop((sx0, sy0, sx1, sy1))
    mask = cell.getchannel('A').point(lambda a: 255 if a >= 16 else 0)
    bbox = mask.getbbox()
    if bbox is None:
        raise ValueError(f'empty source pose {i}')
    # Preserve one global scale and row-major cell registration. Each full
    # source cell is uniformly sampled into 64x71 with nearest-neighbor pixels.
    fitted = cell.resize((65, 72), Image.Resampling.NEAREST)
    # Nearest-neighbor reduction can disconnect a few anti-aliased source
    # pixels that were attached before scaling. Remove only tiny detached
    # visible components after the resize; preserve the source image intact.
    fa = fitted.getchannel('A')
    visible = np.asarray(fa) >= 16
    seen = np.zeros(visible.shape, dtype=bool)
    removed_components = []
    for yy, xx in zip(*np.where(visible)):
        if seen[yy, xx]:
            continue
        q = deque([(int(yy), int(xx))]); seen[yy, xx] = True; component = []
        while q:
            cy, cx = q.popleft(); component.append((cy, cx))
            for ny in range(max(0,cy-1), min(visible.shape[0],cy+2)):
                for nx in range(max(0,cx-1), min(visible.shape[1],cx+2)):
                    if visible[ny,nx] and not seen[ny,nx]:
                        seen[ny,nx] = True; q.append((ny,nx))
        if len(component) <= 6:
            for cy, cx in component: fitted.putpixel((cx,cy),(0,0,0,0))
            removed_components.append({'count':len(component),'bbox':[min(x for y,x in component),min(y for y,x in component),max(x for y,x in component)+1,max(y for y,x in component)+1]})
    atlas_col, atlas_row = i % atlas_cols, i // atlas_cols
    dx, dy = 31 + atlas_col * cell_w, 28 + atlas_row * cell_h
    atlas.alpha_composite(fitted, (dx, dy))
    dest = {'x': dx, 'y': dy, 'w': 65, 'h': 72}
    frames.append(dest)
    source_rects.append({'x': sx0, 'y': sy0, 'w': sx1 - sx0, 'h': sy1 - sy0})
    destination_rects.append(dest)
    transforms.append({'poseIndex': i, 'scaleX': 65 / (sx1 - sx0), 'scaleY': 72 / (sy1 - sy0), 'filter': 'nearest', 'sourceVisibleBoundsWithinCell': {'x': bbox[0], 'y': bbox[1], 'w': bbox[2] - bbox[0], 'h': bbox[3] - bbox[1]}, 'postScaleDetachedComponentsRemoved': removed_components, 'margins': {'left': dx - atlas_col * cell_w, 'top': dy - atlas_row * cell_h, 'right': atlas_col * cell_w + cell_w - (dx + 65), 'bottom': atlas_row * cell_h + cell_h - (dy + 72)}})

atlas.save(atlas_path, format='WEBP', lossless=True, method=6)
for name, bg_color in [('light', (242, 244, 248)), ('dark', (22, 24, 30))]:
    bg = Image.new('RGBA', atlas.size, bg_color + (255,)); bg.alpha_composite(atlas)
    bg.convert('RGB').save(preview_dir / f'j123-attempt06-atlas-{name}.png', optimize=True)
layout = {
    'athlete': 'leo', 'direction': 'right', 'clip': 'dunk-double',
    'sourceImage': 'tools/generate-art/sources/j123-leo-dunk-double-attempt06-cleaned.png',
    'rawSourceImage': 'tools/generate-art/sources/j123-leo-dunk-double-attempt06-generated-raw.png',
    'src': './public/assets/animation/leo-dunk-double-attempt06-right.webp',
    'columns': atlas_cols, 'rows': atlas_rows, 'frames': frames,
    'sourceColumns': cols, 'sourceRows': rows, 'sourceDimensions': [W, H], 'atlasDimensions': list(atlas.size), 'cellSize': [cell_w, cell_h],
    'baselineY': 100, 'sourceRects': source_rects, 'destinationRects': destination_rects,
    'transforms': transforms,
    'packing': 'Five-by-three source cells mapped row-major into a four-by-four atlas with one uniform nearest-neighbor scale to 65x72 content within 128x128 transparent cells; 32px left/right and 28px top/bottom alpha-zero margins; one blank cell.',
    'sourceSha256': sha256(source_path.read_bytes()).hexdigest(), 'atlasSha256': sha256(atlas_path.read_bytes()).hexdigest(),
    'prompt': 'tools/generate-art/j123-leo-dunk-double-attempt06-prompt.md',
    'promptFileSha256': sha256((ROOT / 'tools/generate-art/j123-leo-dunk-double-attempt06-prompt.md').read_bytes()).hexdigest(),
    'generatedAt': '2026-10-27', 'generationId': 'exec-c4722cc1-7062-4dd8-9135-87582aae6fbf',
    'cleanupReport': 'tools/generate-art/j123-leo-dunk-double-attempt06-cleanup-report.json',
    'packingScript': 'tools/generate-art/pack-j123-leo-dunk-double-attempt06.py',
    'reviewStatus': 'unreviewed candidate; not registered'
}
layout_path.write_text(json.dumps(layout, indent=2) + '\n')
print(json.dumps({'atlas': str(atlas_path.relative_to(ROOT)), 'atlasSha256': layout['atlasSha256'], 'dimensions': atlas.size, 'frames': len(frames), 'baselineY': 100, 'minimumMargins': [min(t['margins'][k] for t in transforms) for k in ('left','top','right','bottom')]}, indent=2))
