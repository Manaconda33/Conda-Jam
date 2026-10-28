from pathlib import Path
import hashlib, json
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'tools/generate-art/sources/krios-alley-oop-power15-attempt01-generated-raw.png'
OUT = ROOT / 'tools/generate-art/previews/krios-alley-oop-power15-attempt01'
OUT.mkdir(parents=True, exist_ok=True)
raw = np.asarray(Image.open(SOURCE).convert('RGB'))
h, w = raw.shape[:2]

# Matte only green-dominant pixels connected to the outer sheet. This retains
# Krios's dark green hair tie and other interior green accents.
rgb16 = raw.astype(np.int16)
green = (rgb16[:, :, 1] > rgb16[:, :, 0] + 12) & (rgb16[:, :, 1] > rgb16[:, :, 2] + 12) & (rgb16[:, :, 1] > 50)
labels, _ = ndimage.label(green, structure=np.ones((3, 3), dtype=np.uint8))
edge_labels = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
edge_labels = edge_labels[edge_labels != 0]
edge_background = green & np.isin(labels, edge_labels)

# Find figures before removing enclosed key holes. This lets cleanup preserve
# small green accents in the head (Krios's dark green hair tie) while keying
# enclosed green gaps between limbs and around feet.
components, _ = ndimage.label(~edge_background, structure=np.ones((3, 3), dtype=np.uint8))
regions = []
for ident, sl in enumerate(ndimage.find_objects(components), 1):
    if sl is None:
        continue
    owned = components[sl] == ident
    area = int(owned.sum())
    if area < 5000:
        continue
    y0, y1 = sl[0].start, sl[0].stop
    x0, x1 = sl[1].start, sl[1].stop
    regions.append({'id': ident, 'area': area, 'bbox': [x0, y0, x1, y1], 'cx': (x0+x1)/2, 'cy': (y0+y1)/2})
if len(regions) != 15:
    raise SystemExit(f'expected 15 complete figures after edge-connected key removal, found {len(regions)}')
regions.sort(key=lambda p: p['cy'])
rows = [regions[i*5:(i+1)*5] for i in range(3)]
for row in rows:
    row.sort(key=lambda p: p['cx'])
if any(len(row) != 5 for row in rows):
    raise SystemExit('expected 5 figures in each of 3 rows')
regions = [p for row in rows for p in row]

edge_set = set(int(i) for i in edge_labels)
label_counts = np.bincount(labels.ravel())
key_hole_labels = []
preserved_head_accents = []
for ident in range(1, len(label_counts)):
    if ident in edge_set or label_counts[ident] == 0:
        continue
    ys, xs = np.where(labels == ident)
    cy, cx = float(ys.mean()), float(xs.mean())
    owner = next((p for p in regions if p['bbox'][0] <= cx < p['bbox'][2] and p['bbox'][1] <= cy < p['bbox'][3]), None)
    if owner is None:
        key_hole_labels.append(ident)
        continue
    x0, y0, x1, y1 = owner['bbox']
    small_head_accent = label_counts[ident] <= 120 and cy <= y0 + 0.40*(y1-y0)
    if small_head_accent:
        preserved_head_accents.append(ident)
    else:
        key_hole_labels.append(ident)
background = edge_background | (green & np.isin(labels, key_hole_labels))

scale = min(118/max(p['bbox'][2]-p['bbox'][0] for p in regions), 86/max(p['bbox'][3]-p['bbox'][1] for p in regions))
frames, pose_reports = [], []
for idx, p in enumerate(regions):
    x0, y0, x1, y1 = p['bbox']
    rgb = raw[y0:y1, x0:x1].copy()
    alpha = np.where(background[y0:y1, x0:x1], 0, 255).astype(np.uint8)
    size = (max(1, round((x1-x0)*scale)), max(1, round((y1-y0)*scale)))
    sprite = Image.fromarray(np.dstack([rgb, alpha]), 'RGBA').resize(size, Image.Resampling.NEAREST)
    cell = Image.new('RGBA', (128, 96), (0,0,0,0))
    cell.alpha_composite(sprite, ((128-sprite.width)//2, 94-sprite.height))
    cell.save(OUT/f'pose-{idx:02d}-isolated.png')
    frames.append(cell)
    opaque = np.asarray(cell.getchannel('A')) > 0
    out_rgb = np.asarray(cell)[:, :, :3].astype(np.int16)
    # Background-key contamination report uses strong green residuals; Krios's
    # muted green hair tie is retained and counted separately by connectedness.
    opaque_green = opaque & (out_rgb[:, :, 1] > out_rgb[:, :, 0] + 60) & (out_rgb[:, :, 1] > out_rgb[:, :, 2] + 45) & (out_rgb[:, :, 1] > 100)
    bounds = cell.getchannel('A').getbbox()
    yy = np.indices(opaque.shape)[0]
    green_outside_head = int((opaque_green & (yy > bounds[1] + 0.40*(bounds[3]-bounds[1]))).sum())
    pose_reports.append({
        'frame': idx, 'sourceBounds': p['bbox'], 'sourceComponentArea': p['area'],
        'outputBounds': bounds, 'outputSize': list(size),
        'opaqueGreenDominantPixelCount': int(opaque_green.sum()),
        'opaqueGreenDominantPixelsOutsideHeadRegion': green_outside_head,
        'poseSha256': hashlib.sha256(cell.tobytes()).hexdigest()
    })

atlas = Image.new('RGBA', (128*15, 96), (0,0,0,0))
for i, frame in enumerate(frames):
    atlas.alpha_composite(frame, (128*i, 0))
candidate = OUT/'krios-alley-oop-power15-attempt01-runtime-candidate.png'
atlas.save(candidate)
for name, color in [('light', (234,234,229,255)), ('dark', (27,31,39,255))]:
    bg = Image.new('RGBA', atlas.size, color)
    bg.alpha_composite(atlas)
    bg.convert('RGB').save(OUT/f'krios-alley-oop-power15-attempt01-{name}-preview.png')

unique = len({p['poseSha256'] for p in pose_reports})
if unique != 15:
    raise SystemExit(f'expected 15 distinct output frames, got {unique}')
for p in pose_reports:
    x0, y0, x1, y1 = p['outputBounds']
    if x0 < 5 or x1 > 123 or y0 < 8 or y1 != 94:
        raise SystemExit(f"unsafe margin or baseline in frame {p['frame']}: {p['outputBounds']}")
    if p['opaqueGreenDominantPixelsOutsideHeadRegion']:
        raise SystemExit(f"green contamination outside head region in frame {p['frame']}")
alpha = np.asarray(atlas.getchannel('A'))
row_bottoms = [max(pose_reports[i]['outputBounds'][3] for i in range(j*5,j*5+5)) for j in range(3)]
report = {
    'source': str(SOURCE.relative_to(ROOT)),
    'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    'sourceDimensions': [w,h],
    'candidateAtlas': str(candidate.relative_to(ROOT)),
    'candidateAtlasSha256': hashlib.sha256(candidate.read_bytes()).hexdigest(),
    'algorithm': 'green-dominance mask flood-connected to sheet edge; retain disconnected interior colors including dark-green hair tie; extract 15 complete figures by row and x order; nearest-neighbor uniform fit; 128x96 cells; baseline y94; no redraw',
    'grid': [5,3], 'atlasGrid': [15,1], 'cell': [128,96],
    'threshold': {'greenGreaterThanRedBy':12,'greenGreaterThanBlueBy':12,'greenMinimum':50,'connectivity':8,'enclosedKeyHoleMinimum':0,'preserveSmallGreenHeadAccentMaximum':120,'headRegionFraction':0.40},
    'preservedInteriorGreenComponents': len(preserved_head_accents),
    'componentCountIncludingNoise': int(components.max()), 'figureCount': len(regions),
    'transparentPixelCount': int((alpha==0).sum()), 'opaquePixelCount': int((alpha>0).sum()),
    'uniquePoseHashes': unique, 'uniformScale': scale,
    'rowBottoms': row_bottoms, 'targetBaselineY': 94,
    'poses': pose_reports,
    'interiorHoleThreshold': 120,
    'reviewNotes': 'Cleanup trial03 candidate for trial only. Edge-connected green flood fill plus enclosed green holes removal; preserve only small green components in the upper 40% head region (green hair tie). All residual saturated green on lower body/feet is removed. Visual review required.'
}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report, indent=2)+'\n')
print(json.dumps({'sha256': report['candidateAtlasSha256'], 'components': report['componentCountIncludingNoise'], 'figures':report['figureCount'],'unique':unique,'scale':scale,'rowBottoms':row_bottoms,'greenCounts':[p['opaqueGreenDominantPixelCount'] for p in pose_reports]}, indent=2))
