#!/usr/bin/env python3
"""Deterministically key/isolate Krios J.128 push attempt01 for cleanup trials only.

Preserves the raw source. The main figure components are selected before any
atlas packing because contact-frame art crosses the nominal grid gutter.
"""
from __future__ import annotations
import json
from pathlib import Path
import hashlib
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / 'tools/generate-art/sources/krios-push-attempt01-generated-raw.png'
OUT = ROOT / 'tools/generate-art/previews/krios-push-attempt01'
OUT.mkdir(parents=True, exist_ok=True)
raw = Image.open(RAW).convert('RGB')
pixels = np.asarray(raw)
r, g, b = pixels.transpose(2, 0, 1)
# Matte is green-dominant but not a single flat RGB value. Remove the broad
# dominant-green field; retain dark outlines, red skin, ember trim and white socks.
background = (g > r + 70) & (g > b + 70) & (g > 100)
foreground = ~background
labels, count = ndimage.label(foreground, structure=np.ones((3, 3), dtype=np.uint8))
sizes = np.bincount(labels.ravel())
sizes[0] = 0
largest = np.argsort(sizes)[-11:][::-1]
if len(largest) != 11 or min(sizes[largest]) < 15000:
    raise SystemExit(f'Expected 11 full athlete components; got sizes {sizes[largest].tolist()}')

# Stable row-major ordering from component centroid, not nominal cell crops.
figures = []
for label in largest:
    ys, xs = np.where(labels == label)
    figures.append({'label': int(label), 'area': int(sizes[label]),
                    'bbox': [int(xs.min()), int(ys.min()), int(xs.max()+1), int(ys.max()+1)],
                    'center': [float(xs.mean()), float(ys.mean())]})
figures.sort(key=lambda item: (int(item['center'][1] // 362), item['center'][0]))

# Attach secondary colored components only when they sit close to a main figure.
# Keep their exact RGB pixels. Components farther away remain documented rather
# than being silently folded into unrelated poses.
for label in range(1, count + 1):
    if label in largest or sizes[label] == 0:
        continue
    ys, xs = np.where(labels == label)
    cx, cy = float(xs.mean()), float(ys.mean())
    distances = []
    for fig in figures:
        x0, y0, x1, y1 = fig['bbox']
        dx = max(x0-cx, 0, cx-(x1-1)); dy = max(y0-cy, 0, cy-(y1-1))
        distances.append((dx*dx+dy*dy, fig))
    distance2, nearest = min(distances, key=lambda item: item[0])
    if distance2 <= 24*24:
        nearest.setdefault('attachedLabels', []).append(int(label))
        nearest.setdefault('attachedAreas', []).append(int(sizes[label]))

frames = []
all_boxes = []
for index, fig in enumerate(figures):
    owned = [fig['label'], *fig.get('attachedLabels', [])]
    mask = np.isin(labels, owned)
    ys, xs = np.where(mask)
    if len(xs) == 0:
        raise SystemExit(f'No pixels for pose {index}')
    box = [int(xs.min()), int(ys.min()), int(xs.max()+1), int(ys.max()+1)]
    all_boxes.append(box)
    rgba = np.zeros((box[3]-box[1], box[2]-box[0], 4), dtype=np.uint8)
    crop_rgb = pixels[box[1]:box[3], box[0]:box[2]]
    crop_mask = mask[box[1]:box[3], box[0]:box[2]]
    rgba[crop_mask, :3] = crop_rgb[crop_mask]
    rgba[crop_mask, 3] = 255
    # Remove tiny green contamination while preserving opaque edge/silhouette pixels.
    local = rgba[:, :, :3]
    green_spill = crop_mask & (local[:, :, 1] > local[:, :, 0] + 50) & (local[:, :, 1] > local[:, :, 2] + 50) & (local[:, :, 1] > 120)
    for sy, sx in zip(*np.where(green_spill)):
        before = local[sy, sx].tolist()
        local[sy, sx, 1] = min(int(local[sy, sx, 1]), (int(local[sy, sx, 0]) + int(local[sy, sx, 2])) // 2)
        fig.setdefault('despillPixels', []).append({'sourcePixel':[int(box[0]+sx),int(box[1]+sy)],'before':before,'after':local[sy,sx].tolist()})
    frame = Image.fromarray(rgba, 'RGBA')
    frame.save(OUT / f'pose-{index:02d}-isolated.png')
    fig['bbox'] = box
    fig['poseIndex'] = index
    fig['attachedComponentCount'] = len(owned)-1
    fig['attachedComponentAreas'] = fig.get('attachedAreas', [])
    fig['frameSha256'] = hashlib.sha256((OUT / f'pose-{index:02d}-isolated.png').read_bytes()).hexdigest()
    frames.append(frame)

if len({hashlib.sha256(frame.tobytes()).hexdigest() for frame in frames}) != 11:
    raise SystemExit('Duplicate isolated poses detected')
# A single scale based on all poses. Use comfortable gutters and a shared y=94 baseline.
max_w = max(frame.width for frame in frames)
max_h = max(frame.height for frame in frames)
scale = min(112/max_w, 82/max_h)
from PIL import Image as PILImage
atlas = Image.new('RGBA', (128*11, 96), (0, 0, 0, 0))
packed = []
for index, frame in enumerate(frames):
    size = (max(1, round(frame.width*scale)), max(1, round(frame.height*scale)))
    resized = frame.resize(size, PILImage.Resampling.NEAREST)
    x = index*128 + (128-size[0])//2
    y = 94-size[1]
    atlas.alpha_composite(resized, (x, y))
    packed.append({'index':index,'x':index*128,'y':0,'w':128,'h':96,'visibleRect':[x-index*128,y,size[0],size[1]],'sourceBBox':all_boxes[index],'scaledSize':list(size),'sha256':hashlib.sha256(atlas.crop((index*128,0,(index+1)*128,96)).tobytes()).hexdigest()})
atlas.save(OUT / 'krios-push-attempt01-runtime-candidate.png')

# Logical 4x3 review sheet, preserving source-derived silhouettes. Blank final cell.
logical = Image.new('RGBA',(4*384,3*288),(0,0,0,0))
for index, frame in enumerate(frames):
    size=(max(1,round(frame.width*scale)),max(1,round(frame.height*scale)))
    resized=frame.resize(size,PILImage.Resampling.NEAREST)
    col,row=index%4,index//4
    logical.alpha_composite(resized,(col*384+(384-size[0])//2,row*288+288-size[1]-12))
logical.save(OUT / 'krios-push-attempt01-logical-layout.png')
for name,bg in [('light',(240,243,248,255)),('dark',(24,29,39,255))]:
    preview=Image.new('RGBA',atlas.size,bg);preview.alpha_composite(atlas);preview.convert('RGB').save(OUT/f'krios-push-attempt01-{name}-preview.png')
report={'source':'tools/generate-art/sources/krios-push-attempt01-generated-raw.png','sourceSha256':hashlib.sha256(RAW.read_bytes()).hexdigest(),'sourceDimensions':list(raw.size),'algorithm':'green-dominance mask g>r+70 and g>b+70 and g>100; 8-connected components; eleven largest athlete components; adjacent small colored components within24px attached; no redraw','backgroundPixelShare':float(background.mean()),'foregroundConnectedComponentCount':int(count),'despilledNativePixels':sum(len(fig.get('despillPixels',[])) for fig in figures),'largestComponentAreas':[int(sizes[label]) for label in largest],'figures':figures,'poseCount':len(frames),'uniquePoseHashes':len({hashlib.sha256(frame.tobytes()).hexdigest() for frame in frames}),'uniformScale':scale,'nativeCell':[128,96],'baseline':94,'frameMarginTarget':[8,7],'packedFrames':packed,'rejectedComponents':[{'label':int(label),'area':int(sizes[label]),'bbox':[int(np.where(labels==label)[1].min()),int(np.where(labels==label)[0].min()),int(np.where(labels==label)[1].max()+1),int(np.where(labels==label)[0].max()+1)]} for label in range(1,count+1) if sizes[label]>0 and all(label not in [f['label'],*f.get('attachedLabels',[])] for f in figures)]}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'poseCount':report['poseCount'],'uniquePoseHashes':report['uniquePoseHashes'],'scale':scale,'nativeCell':[128,96],'baseline':94,'backgroundPixelShare':report['backgroundPixelShare'],'components':count,'largest':report['largestComponentAreas'],'rejectedComponentCount':len(report['rejectedComponents'])},indent=2))
