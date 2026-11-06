"""Combine four reviewed Kraken pickup poses with the new attempt04 grab pose."""
from __future__ import annotations
import hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
RAW = ROOT / 'tools/generate-art/sources/kraken-pickup5-attempt04-pose03-generated-raw.png'
PRIOR = ROOT / 'tools/generate-art/previews/kraken-pickup5-attempt03'
OUT = HERE / 'poses'
CROPS = OUT / 'source-crops'
OUT.mkdir(exist_ok=True)
CROPS.mkdir(exist_ok=True)
CW, CH, BASELINE = 80, 96, 90
ATLAS_PATH = HERE / 'kraken-pickup5-attempt04-cleanup02-atlas-candidate.png'
DURATIONS = [2, 3, 2, 1, 4]
POSE_NAMES = ['notice-reach', 'lower-reach', 'low-reach', 'grab-tick07', 'post-grab-recovery']

# Reuse accepted-for-trials cleanup01 cells 0,1,2,4 byte-for-byte.
prior_paths = [
    PRIOR / 'poses/pose-00-notice-reach-80x96.png',
    PRIOR / 'poses/pose-01-lower-reach-80x96.png',
    PRIOR / 'poses/pose-02-low-reach-80x96.png',
    None,
    PRIOR / 'poses/pose-04-post-grab-recovery-80x96.png',
]
cells = [Image.open(p).convert('RGBA') if p else None for p in prior_paths]

# Isolate the new pose by its single alpha-connected silhouette; do not crop by
# guessed proportions. Keep original source colors and a small original-alpha edge.
raw_im = Image.open(RAW).convert('RGBA')
rgba = np.asarray(raw_im)
alpha = rgba[:, :, 3]
labels, n = ndimage.label(alpha >= 32, structure=np.ones((3, 3), dtype=np.uint8))
sizes = np.bincount(labels.ravel(), minlength=n + 1)
ids = [i for i in range(1, n + 1) if sizes[i] >= 100_000]
if len(ids) != 1:
    raise RuntimeError(f'Expected one principal pose, found {len(ids)}')
component_id = int(ids[0])
y, x = np.where(labels == component_id)
bounds = [int(x.min()), int(y.min()), int(x.max() + 1), int(y.max() + 1)]
x0, y0, x1, y1 = bounds
ex0, ey0, ex1, ey1 = max(0, x0-3), max(0, y0-3), min(raw_im.width, x1+3), min(raw_im.height, y1+3)
main = labels[ey0:ey1, ex0:ex1] == component_id
local_alpha = alpha[ey0:ey1, ex0:ex1]
dist = ndimage.distance_transform_edt(~main)
keep = main | ((local_alpha > 0) & (dist <= 1.5))
crop_pixels = np.array(rgba[ey0:ey1, ex0:ex1], copy=True)
crop_pixels[:, :, 3] = np.where(keep, crop_pixels[:, :, 3], 0).astype(np.uint8)
crop = Image.fromarray(crop_pixels, 'RGBA')
crop_path = CROPS / 'pose-03-grab-tick07-attempt04-source-crop.png'
crop.save(crop_path)

# Match attempt03 cleanup01 frame3's 53px body width, rounded to 54px to avoid
# a half-pixel centering bias. This keeps the new wide-reaching pose in scale
# with its neighbors; one uniform scale is applied to this single-source figure.
target_width = 54
scale = target_width / crop.width
width, height = target_width, round(crop.height * scale)
if height > 73 or width > 70:
    raise RuntimeError(f'New grab pose exceeds safe 70x73 art area: {width}x{height}')
normalized = crop.resize((width, height), Image.Resampling.NEAREST)
cell3 = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
cell3.alpha_composite(normalized, ((CW-width)//2, BASELINE-height))
cells[3] = cell3
cell3_path = OUT / 'pose-03-grab-tick07-80x96.png'
cell3.save(cell3_path)

atlas = Image.new('RGBA', (CW*5, CH), (0, 0, 0, 0))
for i, cell in enumerate(cells):
    if cell.size != (CW, CH):
        raise RuntimeError(f'Frame {i} has wrong cell size {cell.size}')
    atlas.alpha_composite(cell, (i*CW, 0))
atlas.save(ATLAS_PATH)

frames = []
for i, cell in enumerate(cells):
    box = cell.getchannel('A').getbbox()
    frames.append({
        'index': i, 'name': POSE_NAMES[i], 'duration': DURATIONS[i],
        'anchors': ['grab'] if i == 3 else [],
        'x': i*CW, 'y': 0, 'w': CW, 'h': CH,
        'bboxInCell': list(box),
        'marginsLTRB': [box[0], box[1], CW-box[2], CH-box[3]],
        'baselineY': BASELINE,
        'pixelHash': hashlib.sha256(cell.tobytes()).hexdigest(),
    })
for theme, bg in [('light', (244, 242, 235, 255)), ('dark', (28, 25, 38, 255))]:
    proof = Image.new('RGBA', (CW*5, CH), bg)
    for i, cell in enumerate(cells): proof.alpha_composite(cell, (i*CW, 0))
    proof.convert('RGB').save(HERE / f'cleanup02-{theme}-native.png')
    proof.resize((CW*5*4, CH*4), Image.Resampling.NEAREST).convert('RGB').save(HERE / f'cleanup02-{theme}-nearest4x.png')

metadata = {
    'classification': 'derived-original-imagegen-source-composite-candidate',
    'status': 'candidate for Kraken-specific ball-track trials only; independent review required',
    'athlete': 'J.07 Kraken', 'clip': 'pickup', 'attempt': 4, 'cleanup': 2,
    'frameSize': [CW, CH], 'columns': 5, 'rows': 1,
    'baselineY': BASELINE,
    'frameDurations': DURATIONS, 'grabFrame': 3, 'grabTick': 7,
    'ballBakedIn': False,
    'atlasCandidate': str(ATLAS_PATH.relative_to(ROOT)),
    'atlasSha256': hashlib.sha256(ATLAS_PATH.read_bytes()).hexdigest(),
    'lineage': [
        {'frame': 0, 'sourceAtlas': str((PRIOR/'kraken-pickup5-attempt03-cleanup01-atlas-candidate.png').relative_to(ROOT)), 'sourceGeneration': 'exec-8b97fb33-86c2-4f42-90d6-6bfd4ac91265', 'sourcePixelHash': frames[0]['pixelHash']},
        {'frame': 1, 'sourceAtlas': str((PRIOR/'kraken-pickup5-attempt03-cleanup01-atlas-candidate.png').relative_to(ROOT)), 'sourceGeneration': 'exec-8b97fb33-86c2-4f42-90d6-6bfd4ac91265', 'sourcePixelHash': frames[1]['pixelHash']},
        {'frame': 2, 'sourceAtlas': str((PRIOR/'kraken-pickup5-attempt03-cleanup01-atlas-candidate.png').relative_to(ROOT)), 'sourceGeneration': 'exec-8b97fb33-86c2-4f42-90d6-6bfd4ac91265', 'sourcePixelHash': frames[2]['pixelHash']},
        {'frame': 3, 'sourceImage': str(RAW.relative_to(ROOT)), 'sourceGeneration': 'exec-fa7b159c-0083-48d9-b25e-0da6650e06cc', 'prompt': 'tools/generate-art/kraken-pickup5-attempt04-pose03-imagegen-prompt.txt', 'sourceSha256': hashlib.sha256(RAW.read_bytes()).hexdigest(), 'sourceFigureBoundsLTRB': bounds, 'cropBoundsLTRB': [ex0,ey0,ex1,ey1], 'cropSha256': hashlib.sha256(crop_path.read_bytes()).hexdigest(), 'fitScale': scale, 'outputSize': [width,height], 'sourcePixelHash': frames[3]['pixelHash']},
        {'frame': 4, 'sourceAtlas': str((PRIOR/'kraken-pickup5-attempt03-cleanup01-atlas-candidate.png').relative_to(ROOT)), 'sourceGeneration': 'exec-8b97fb33-86c2-4f42-90d6-6bfd4ac91265', 'sourcePixelHash': frames[4]['pixelHash']},
    ],
    'effectiveBodyScale': {'reference': 'attempt03 cleanup01 common scale 0.165909091', 'pose3FitMethod': 'uniform nearest-neighbor scale to 54px visible width; compact crouch silhouette height then baseline-aligned; no nonuniform distortion'},
    'alphaCleanup': 'Connected component alpha>=32; retain original alpha and RGB only within component or 1.5px source-pixel fringe; no color-key recoloring.',
    'frames': frames,
}
(HERE/'cleanup02-layout.json').write_text(json.dumps(metadata,indent=2)+'\n')
candidate_metadata = {
    'classification': 'original-authored-source-composite-candidate',
    'athlete': 'J.07 Kraken', 'clip': 'pickup',
    'attempt': 4, 'cleanup': 2,
    'status': 'pass for Kraken-specific ball-track trials only; not approved for runtime registration',
    'atlasCandidate': str(ATLAS_PATH.relative_to(ROOT)),
    'atlasSha256': hashlib.sha256(ATLAS_PATH.read_bytes()).hexdigest(),
    'frameSize': [CW, CH], 'frameCount': len(frames), 'uniquePixelFrames': len({f['pixelHash'] for f in frames}),
    'baselineY': BASELINE, 'clearRowsBelowSoles': CH-BASELINE,
    'frameDurations': DURATIONS, 'grabFrame': 3, 'grabTick': 7,
    'ballBakedIn': False,
    'provenance': str((HERE/'cleanup02-layout.json').relative_to(ROOT)),
    'lineage': metadata['lineage'],
}
(HERE/'candidate-metadata.json').write_text(json.dumps(candidate_metadata,indent=2)+'\n')

print(json.dumps({'sourceBounds':bounds,'cropSize':crop.size,'fitScale':scale,'outputPose3':[width,height],'baselineY':BASELINE,'marginsPose3':frames[3]['marginsLTRB'],'uniqueFrames':len({f['pixelHash'] for f in frames}),'atlas':str(ATLAS_PATH.relative_to(ROOT))},indent=2))
