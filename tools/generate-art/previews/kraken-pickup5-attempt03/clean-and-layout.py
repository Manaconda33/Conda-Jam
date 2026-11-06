"""Non-runtime cleanup/layout trial for Kraken J.07 pickup attempt03."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
SOURCE = ROOT / 'tools/generate-art/sources/kraken-pickup5-attempt03-generated-raw.png'
POSE_DIR = HERE / 'poses'
CROP_DIR = POSE_DIR / 'source-crops'
ATLAS_PATH = HERE / 'kraken-pickup5-attempt03-cleanup01-atlas-candidate.png'
CW, CH, BASELINE = 80, 96, 90
POSE_DIR.mkdir(exist_ok=True)
CROP_DIR.mkdir(exist_ok=True)

im = Image.open(SOURCE).convert('RGBA')
rgba = np.asarray(im)
alpha = rgba[:, :, 3]
labels, count = ndimage.label(alpha >= 32, structure=np.ones((3, 3), dtype=np.uint8))
sizes = np.bincount(labels.ravel(), minlength=count + 1)
ids = [i for i in range(1, count + 1) if sizes[i] >= 20_000]
if len(ids) != 5:
    raise RuntimeError(f'Expected exactly 5 principal figures at alpha >=32, found {len(ids)}')
components = []
for component_id in ids:
    ys, xs = np.where(labels == component_id)
    components.append({
        'id': int(component_id),
        'strongPixels': int(sizes[component_id]),
        'boundsLTRB': [int(xs.min()), int(ys.min()), int(xs.max() + 1), int(ys.max() + 1)],
        'centerX': float(xs.mean()),
    })
components.sort(key=lambda c: c['centerX'])

# A single scale preserves comparative proportions. The common y=90 baseline
# reserves six transparent rows below the feet; the renderer's optional clip
# baseline offset keeps the soles on the production ground line.
maxw = max(c['boundsLTRB'][2] - c['boundsLTRB'][0] for c in components) + 6
maxh = max(c['boundsLTRB'][3] - c['boundsLTRB'][1] for c in components) + 6
scale = min(70 / maxw, 73 / maxh)
atlas = Image.new('RGBA', (CW * 5, CH), (0, 0, 0, 0))
frames = []
pose_names = ['notice-reach', 'lower-reach', 'low-reach', 'grab-tick07', 'post-grab-recovery']
for index, comp in enumerate(components):
    x0, y0, x1, y1 = comp['boundsLTRB']
    # Include a 3px source halo around each connected silhouette, then retain
    # original-alpha pixels only within 1.5 source pixels of the main figure.
    # This preserves edge antialiasing without carrying detached canvas haze.
    ex0, ey0 = max(0, x0 - 3), max(0, y0 - 3)
    ex1, ey1 = min(im.width, x1 + 3), min(im.height, y1 + 3)
    main = labels[ey0:ey1, ex0:ex1] == comp['id']
    local_alpha = alpha[ey0:ey1, ex0:ex1]
    dist = ndimage.distance_transform_edt(~main)
    retained = main | ((local_alpha > 0) & (dist <= 1.5))
    crop_rgba = np.array(rgba[ey0:ey1, ex0:ex1], copy=True)
    crop_rgba[:, :, 3] = np.where(retained, crop_rgba[:, :, 3], 0).astype(np.uint8)
    crop = Image.fromarray(crop_rgba, 'RGBA')
    crop_path = CROP_DIR / f'pose-{index:02d}-{pose_names[index]}-source-crop.png'
    crop.save(crop_path)

    width, height = round(crop.width * scale), round(crop.height * scale)
    if width > 70 or height > 73:
        raise RuntimeError(f'Pose {index} exceeds fit bounds: {width}x{height}')
    normalized = crop.resize((width, height), Image.Resampling.NEAREST)
    px, py = (CW - width) // 2, BASELINE - height
    cell = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    cell.alpha_composite(normalized, (px, py))
    cell_path = POSE_DIR / f'pose-{index:02d}-{pose_names[index]}-80x96.png'
    cell.save(cell_path)
    atlas.alpha_composite(cell, (index * CW, 0))
    bbox = cell.getchannel('A').getbbox()
    frames.append({
        'index': index,
        'name': pose_names[index],
        'duration': [2, 3, 2, 1, 4][index],
        'anchors': ['grab'] if index == 3 else [],
        'x': index * CW, 'y': 0, 'w': CW, 'h': CH,
        'sourceRectLTRB': [ex0, ey0, ex1, ey1],
        'sourceFigureBoundsLTRB': comp['boundsLTRB'],
        'sourceMainComponentPixels': comp['strongPixels'],
        'fitScale': scale,
        'visibleSize': [width, height],
        'offsetInCell': [px, py],
        'baselineY': BASELINE,
        'marginsLTRB': [bbox[0], bbox[1], CW - bbox[2], CH - bbox[3]],
        'bottomClearance': CH - bbox[3],
        'cropSha256': hashlib.sha256(crop_path.read_bytes()).hexdigest(),
        'cellSha256': hashlib.sha256(cell_path.read_bytes()).hexdigest(),
        'pixelHash': hashlib.sha256(cell.tobytes()).hexdigest(),
    })
atlas.save(ATLAS_PATH)

# Inspect both backgrounds at native pixel scale and 4x nearest neighbor.
for theme, bg in [('light', (244, 242, 235, 255)), ('dark', (28, 25, 38, 255))]:
    native = Image.new('RGBA', (CW * 5, CH), bg)
    for i in range(5):
        native.alpha_composite(atlas.crop((i * CW, 0, (i + 1) * CW, CH)), (i * CW, 0))
    native.convert('RGB').save(HERE / f'cleanup01-{theme}-native.png')
    enlarged = native.resize((CW * 5 * 4, CH * 4), Image.Resampling.NEAREST)
    enlarged.convert('RGB').save(HERE / f'cleanup01-{theme}-nearest4x.png')

layout = {
    'status': 'cleanup/layout trial; independent visual quality and alignment review pending',
    'athlete': 'kraken', 'canonicalSection': 'J.07', 'clip': 'pickup',
    'source': str(SOURCE.relative_to(ROOT)),
    'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    'atlasCandidate': str(ATLAS_PATH.relative_to(ROOT)),
    'atlasSha256': hashlib.sha256(ATLAS_PATH.read_bytes()).hexdigest(),
    'columns': 5, 'rows': 1, 'frameWidth': CW, 'frameHeight': CH,
    'baselineY': BASELINE, 'uniformScale': scale,
    'frameDurations': [2, 3, 2, 1, 4], 'grabFrame': 3, 'grabTick': 7,
    'ballPolicy': 'No ball is in the source or derived atlas; keep a separate Kraken-specific runtime track.',
    'segmentation': 'Alpha>=32 connected components with 8-connectivity, select 5 principal figures by area>=20000, order by center X; expanded crop 3 source pixels; retain original-alpha fringe only within 1.5 source pixels of the main component.',
    'resampling': 'Nearest-neighbor with one shared scale.',
    'baselineOffsetPolicy': 'Pack source pixels with soles aligned to y=90 and six transparent rows below; optional runtime clip baselineY=90 preserves contact with the established ground baseline.',
    'frames': frames,
}
(HERE / 'cleanup01-layout.json').write_text(json.dumps(layout, indent=2) + '\n')
metadata = {
    'classification': 'original-imagegen-source-cleanup-candidate',
    'athlete': 'J.07 Kraken', 'clip': 'pickup',
    'generationId': 'exec-8b97fb33-86c2-4f42-90d6-6bfd4ac91265',
    'baselineY': 90,
    'frameSize': [CW, CH],
    'frames': len(frames), 'uniquePixelFrames': len({f['pixelHash'] for f in frames}),
    'frameDurations': [2, 3, 2, 1, 4], 'grabFrame': 3, 'grabTick': 7,
    'atlasCandidate': str(ATLAS_PATH.relative_to(ROOT)),
    'ballBakedIn': False,
    'status': 'unreviewed cleanup candidate; no runtime registration',
}
(HERE / 'candidate-metadata.json').write_text(json.dumps(metadata, indent=2) + '\n')

print(json.dumps({
    'components': len(components), 'scale': scale,
    'frames': len(frames), 'unique': len({f['pixelHash'] for f in frames}),
    'baselineY': BASELINE,
    'marginsLTRB': [min(f['marginsLTRB'][j] for f in frames) for j in range(4)],
    'visibleSizes': [f['visibleSize'] for f in frames],
    'atlas': str(ATLAS_PATH.relative_to(ROOT)),
}, indent=2))
