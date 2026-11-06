"""Conservatively isolate the eleven Kraken push poses into 80x96 cells."""
from pathlib import Path
from hashlib import sha256
import json

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'tools/generate-art/sources/kraken-push11-attempt02-generated-raw.png'
OUT = ROOT / 'tools/generate-art/previews/kraken-push11-attempt02'
POSES = OUT / 'poses'
CW, CH = 128, 112
BASELINE = 104
MAX_W, MAX_H = 112, 96
OUT.mkdir(parents=True, exist_ok=True)
POSES.mkdir(parents=True, exist_ok=True)

raw = np.asarray(Image.open(SOURCE).convert('RGBA')).copy()
alpha = raw[:, :, 3]
labels, count = ndimage.label(alpha >= 32, structure=np.ones((3, 3), dtype=np.uint8))
sizes = np.bincount(labels.ravel(), minlength=count + 1)
components = []
for label_id in range(1, count + 1):
    if sizes[label_id] < 5000:
        continue
    ys, xs = np.where(labels == label_id)
    components.append({
        'label': int(label_id), 'pixels': int(sizes[label_id]),
        'bounds': [int(xs.min()), int(ys.min()), int(xs.max() + 1), int(ys.max() + 1)],
        'center': [float(xs.mean()), float(ys.mean())],
    })
if len(components) != 11:
    raise RuntimeError(f'Expected 11 connected figures, found {len(components)}')

# The source generator uses irregular gutters. Recover visual row-major order by
# clustering component centers into three y bands, then sorting by x.
components.sort(key=lambda c: c['center'][1])
rows = [components[i:i + 4] for i in range(0, len(components), 4)]
if [len(row) for row in rows] != [4, 4, 3]:
    raise RuntimeError('Could not recover the expected 4/4/3 pose rows')
ordered = []
for row in rows:
    row.sort(key=lambda c: c['center'][0])
    ordered.extend(row)

atlas = Image.new('RGBA', (CW * 4, CH * 3), (0, 0, 0, 0))
frames = []
global_scale = min(MAX_W / max(c['bounds'][2] - c['bounds'][0] for c in ordered),
                   MAX_H / max(c['bounds'][3] - c['bounds'][1] for c in ordered))
for index, component in enumerate(ordered):
    x0, y0, x1, y1 = component['bounds']
    crop = Image.fromarray(raw[y0:y1, x0:x1], 'RGBA')
    bbox = crop.getchannel('A').getbbox()
    crop = crop.crop(bbox)
    scale = global_scale
    width, height = round(crop.width * scale), round(crop.height * scale)
    if width > MAX_W or height > MAX_H:
        raise RuntimeError(f'Pose {index} exceeded safe dimensions: {width}x{height}')
    crop = crop.resize((width, height), Image.Resampling.NEAREST)
    col, row = index % 4, index // 4
    xoff = (CW - width) // 2
    yoff = BASELINE - height
    if yoff < 8 or CH - (yoff + height) < 8 or xoff < 8 or CW - (xoff + width) < 8:
        raise RuntimeError(f'Pose {index} violates required 8px margins')
    atlas.alpha_composite(crop, (col * CW + xoff, row * CH + yoff))
    crop_path = POSES / f'pose-{index:02d}-normalized.png'
    crop.save(crop_path)
    cell = atlas.crop((col * CW, row * CH, (col + 1) * CW, (row + 1) * CH))
    pose_box = cell.getchannel('A').getbbox()
    frames.append({
        'frame': index, 'slot': [col, row], 'sourceBounds': component['bounds'],
        'sourceCorePixels': component['pixels'], 'scaledSize': [width, height],
        'offsetInCell': [xoff, yoff], 'baselineY': BASELINE,
        'marginsLTRB': [pose_box[0], pose_box[1], CW - pose_box[2], CH - pose_box[3]],
        'poseSha256': sha256(crop_path.read_bytes()).hexdigest(),
    })

atlas_path = OUT / 'kraken-push11-attempt02-runtime-candidate.png'
atlas.save(atlas_path)
for variant, background in (('light', (238, 241, 246, 255)), ('dark', (27, 23, 39, 255))):
    preview = Image.new('RGBA', (1024, 672), background)
    for frame in frames:
        col, row = frame['slot']
        cell = atlas.crop((col * CW, row * CH, (col + 1) * CW, (row + 1) * CH))
        preview.alpha_composite(cell.resize((256, 224), Image.Resampling.NEAREST), (col * 256, row * 224))
    preview.convert('RGB').save(OUT / f'kraken-push11-attempt02-{variant}-preview.png')

report = {
    'status': 'candidate source cleanup/layout trial; independent visual review and separate current-court trial required; not registered',
    'source': str(SOURCE.relative_to(ROOT)),
    'sourceSha256': sha256(SOURCE.read_bytes()).hexdigest(),
    'atlas': str(atlas_path.relative_to(ROOT)),
    'atlasSha256': sha256(atlas_path.read_bytes()).hexdigest(),
    'sourceDimensions': [int(raw.shape[1]), int(raw.shape[0])],
    'segmentation': 'Connected components with alpha >= 32, retain exactly eleven figures of at least 5000 core pixels; preserve all source RGBA pixels within each figure crop.',
    'resampling': f'Nearest-neighbor at one shared uniform scale of {global_scale:.6f}; maximum pose box 112x96; center horizontally and align all feet to baseline y=104 in 128x112 cells. A shared scale prevents apparent athlete-size changes when poses extend their arms.',
    'rawPreserved': True,
    'sheetLayout': {'columns': 4, 'rows': 3, 'frameCount': 11, 'unusedCell': [3, 2], 'cellSize': [128, 112]},
    'canonicalDurations': [2, 2, 2, 1, 1, 2, 2, 3, 3, 3, 3],
    'contact': {'frame': 5, 'tick': 8},
    'uniqueFrames': len({f['poseSha256'] for f in frames}),
    'minimumMarginsLTRB': [min(f['marginsLTRB'][i] for f in frames) for i in range(4)],
    'frames': frames,
}
(OUT / 'cleanup-layout-report.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({k: report[k] for k in ('sourceDimensions', 'uniqueFrames', 'minimumMarginsLTRB', 'atlasSha256')}, indent=2))
