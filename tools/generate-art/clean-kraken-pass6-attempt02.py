#!/usr/bin/env python3
"""Normalize Kraken pass attempt02 without redrawing or changing source pixels."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'tools/generate-art/sources/kraken-pass6-attempt02-generated-raw.png'
OUT = ROOT / 'tools/generate-art/previews/kraken-pass6-attempt02'
POSES = OUT / 'poses'
ATLAS = OUT / 'kraken-pass6-attempt02-runtime-candidate.png'
LIGHT = OUT / 'kraken-pass6-attempt02-light-preview.png'
DARK = OUT / 'kraken-pass6-attempt02-dark-preview.png'
CONTACT_LIGHT = OUT / 'contact-sheet-light.png'
CONTACT_DARK = OUT / 'contact-sheet-dark.png'
LAYOUT = OUT / 'layout.json'
REPORT = OUT / 'cleanup-layout-report.json'

CELL_W, CELL_H, COLS, ROWS = 80, 96, 3, 2
BASELINE = 94
UNIFORM_SCALE = 0.147
RECTS = [
    (31, 31, 371, 529),       # frame 0: ready
    (472, 32, 855, 529),      # frame 1: preparation
    (977, 32, 1345, 530),     # frame 2: chest gather
    (15, 594, 486, 1092),     # frame 3: release
    (464, 593, 953, 1090),    # frame 4: follow-through
    (1014, 595, 1364, 1092),  # frame 5: recovery
]
OUT.mkdir(parents=True, exist_ok=True)
POSES.mkdir(parents=True, exist_ok=True)
raw = Image.open(SOURCE).convert('RGBA')
if raw.size != (1402, 1122):
    raise RuntimeError(f'Unexpected source dimensions: {raw.size}')
source = np.asarray(raw)
alpha = source[:, :, 3]
labels, count = ndimage.label(alpha > 0, structure=np.ones((3, 3), dtype=np.uint8))
objects = ndimage.find_objects(labels)
components = []
for label_id, sl in enumerate(objects, 1):
    if sl is None:
        continue
    yy, xx = sl
    size = int(np.count_nonzero(labels[sl] == label_id))
    if size:
        components.append({'id':label_id, 'pixels':size, 'boundsLTRB':[xx.start, yy.start, xx.stop, yy.stop]})

atlas = Image.new('RGBA', (CELL_W * COLS, CELL_H * ROWS), (0, 0, 0, 0))
frames = []
excluded = []
for index, rect in enumerate(RECTS):
    x0, y0, x1, y1 = rect
    source_cell = np.array(raw.crop(rect), copy=True)
    local_labels, local_count = ndimage.label(source_cell[:, :, 3] > 0, structure=np.ones((3, 3), dtype=np.uint8))
    local_sizes = np.bincount(local_labels.ravel(), minlength=local_count + 1)
    main_id = int(np.argmax(local_sizes[1:]) + 1)
    main_mask = local_labels == main_id
    main_area = int(local_sizes[main_id])
    if main_area < 50000:
        raise RuntimeError(f'Expected a complete main figure in frame {index}; largest component has {main_area} pixels')
    yy, xx = np.where(main_mask)
    bx0, by0, bx1, by1 = int(xx.min()), int(yy.min()), int(xx.max()+1), int(yy.max()+1)
    bounds = [x0+bx0, y0+by0, x0+bx1, y0+by1]
    # Retain in-pose antialias details within 2 source pixels of the main figure.
    # Isolated islands farther away are documented and left in the untouched raw.
    distance = ndimage.distance_transform_edt(~main_mask)
    near_main = (source_cell[:, :, 3] > 0) & (distance <= 2.0)
    removed = (source_cell[:, :, 3] > 0) & ~near_main
    if np.any(removed):
        rem_labels, rem_count = ndimage.label(removed, structure=np.ones((3,3), dtype=np.uint8))
        rem_sizes = np.bincount(rem_labels.ravel(), minlength=rem_count+1)
        for rem_id in range(1, rem_count+1):
            if rem_sizes[rem_id] == 0: continue
            ry, rx = np.where(rem_labels == rem_id)
            excluded.append({'frame':index, 'pixels':int(rem_sizes[rem_id]),
                             'sourceBoundsLTRB':[x0+int(rx.min()), y0+int(ry.min()), x0+int(rx.max()+1), y0+int(ry.max()+1)],
                             'reason':'detached alpha island more than 2 source pixels from the reviewed figure silhouette'})
    source_cell[:, :, 3] = np.where(near_main, source_cell[:, :, 3], 0)
    crop = Image.fromarray(source_cell, mode='RGBA').crop((bx0, by0, bx1, by1))
    w, h = round(crop.width * UNIFORM_SCALE), round(crop.height * UNIFORM_SCALE)
    if w > CELL_W - 8 or h > BASELINE:
        raise RuntimeError(f'Frame {index} exceeds target margins: {w}x{h}')
    pose = crop.resize((w, h), Image.Resampling.NEAREST)
    cell_x, cell_y = (index % COLS) * CELL_W, (index // COLS) * CELL_H
    offset_x = (CELL_W - w) // 2
    offset_y = BASELINE - h
    atlas.alpha_composite(pose, (cell_x + offset_x, cell_y + offset_y))
    pose_path = POSES / f'pose-{index:02d}-normalized.png'
    pose.save(pose_path)
    cell = atlas.crop((cell_x, cell_y, cell_x + CELL_W, cell_y + CELL_H))
    bbox = cell.getchannel('A').getbbox()
    margins = [bbox[0], bbox[1], CELL_W - bbox[2], CELL_H - bbox[3]]
    frames.append({
        'index':index, 'x':cell_x, 'y':cell_y, 'w':CELL_W, 'h':CELL_H,
        'sourceRectLTRB':bounds, 'sourceCellLTRB':list(rect), 'sourceComponentPixels':main_area,
        'sourceCropSize':[crop.width,crop.height],
        'uniformScale':UNIFORM_SCALE, 'scaledSize':[w,h], 'offsetInCell':[offset_x,offset_y],
        'baselineY':BASELINE, 'marginsLTRB':margins,
        'alphaCropSha256':hashlib.sha256(cell.getchannel('A').tobytes()).hexdigest(),
        'normalizedPoseSha256':hashlib.sha256(pose_path.read_bytes()).hexdigest()
    })
atlas.save(ATLAS)
for theme, background in [('light',(238,240,245,255)),('dark',(28,24,40,255))]:
    board = Image.new('RGBA', (COLS * 240, ROWS * 288), background)
    for index in range(6):
        x, y = (index % COLS) * CELL_W, (index // COLS) * CELL_H
        zoom = atlas.crop((x, y, x + CELL_W, y + CELL_H)).resize((240,288), Image.Resampling.NEAREST)
        board.alpha_composite(zoom, ((index % COLS) * 240, (index // COLS) * 288))
    board.convert('RGB').save(LIGHT if theme == 'light' else DARK)
    board.convert('RGB').save(CONTACT_LIGHT if theme == 'light' else CONTACT_DARK)

layout_data = {
    'status':'cleanup and layout trial only; not registered or accepted',
    'source':'tools/generate-art/sources/kraken-pass6-attempt02-generated-raw.png',
    'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    'atlas':str(ATLAS.relative_to(ROOT)), 'atlasSha256':hashlib.sha256(ATLAS.read_bytes()).hexdigest(),
    'columns':COLS,'rows':ROWS,'frameWidth':CELL_W,'frameHeight':CELL_H,
    'uniformScale':UNIFORM_SCALE,'baselineY':BASELINE,'interpolation':'nearest-neighbor','frames':frames
}
LAYOUT.write_text(json.dumps(layout_data,indent=2)+'\n')
report = {
    'status':'cleanup/layout trial only; source and gameplay acceptance pending',
    'source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    'sourceDimensions':list(raw.size),'sourceAlphaRange':[int(alpha.min()),int(alpha.max())],
    'grid':'3x2 row-major; 6 alpha-connected figures; exact source crops recorded in layout.json',
    'connectedComponents':components,'excludedDetachedComponents':excluded,
    'pixelTreatment':'Original RGBA pixels only; no keying, redraw, color replacement, despill or interpolation; nearest-neighbor scale only.',
    'target':{'columns':COLS,'rows':ROWS,'cell':[CELL_W,CELL_H],'uniformScale':UNIFORM_SCALE,'baselineY':BASELINE,
              'minimumHorizontalMarginPx':min(min(f['marginsLTRB'][0],f['marginsLTRB'][2]) for f in frames),
              'minimumTopMarginPx':min(f['marginsLTRB'][1] for f in frames),
              'minimumBottomMarginPx':min(f['marginsLTRB'][3] for f in frames)},
    'atlas':str(ATLAS.relative_to(ROOT)),'layout':str(LAYOUT.relative_to(ROOT)),
    'lightPreview':str(LIGHT.relative_to(ROOT)),'darkPreview':str(DARK.relative_to(ROOT)),
    'rawPreserved':True,'frameCount':len(frames),
    'uniqueFrameAlphaHashes':len(set(f['alphaCropSha256'] for f in frames)),
    'uniqueNormalizedPoseHashes':len(set(f['normalizedPoseSha256'] for f in frames))
}
REPORT.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'frameCount':len(frames),'uniqueAlphaFrames':report['uniqueFrameAlphaHashes'],
 'uniqueNormalizedPoses':report['uniqueNormalizedPoseHashes'],'excludedFragments':len(excluded),
 'margins':[report['target']['minimumHorizontalMarginPx'],report['target']['minimumTopMarginPx'],report['target']['minimumBottomMarginPx']],
 'atlas':str(ATLAS.relative_to(ROOT))},indent=2))
