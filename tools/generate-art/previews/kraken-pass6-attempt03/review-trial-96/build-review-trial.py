#!/usr/bin/env python3
"""Build a non-runtime 96x96 Kraken chest-pass review trial from attempt03."""
from pathlib import Path
from hashlib import sha256
import json
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parent
SRC = ROOT / 'tools/generate-art/sources/kraken-pass6-attempt03-generated-raw.png'
IDLE = ROOT / 'public/assets/animation/kraken-idle-right.webp'
COLS, ROWS, CELL, BASELINE = 3, 2, 96, 90
SCALE = 80 / 523
FRINGE_RADIUS = 3.0
raw = Image.open(SRC).convert('RGBA')
pix = np.asarray(raw)
alpha = pix[:, :, 3]
labels, n = ndimage.label(alpha > 0, structure=np.ones((3, 3), np.uint8))
comps = []
for cid, sl in enumerate(ndimage.find_objects(labels), 1):
    if sl is None:
        continue
    m = labels[sl] == cid
    area = int(m.sum())
    if area >= 50000:
        yy, xx = np.where(m)
        comps.append({'id':cid, 'area':area,
                      'bbox':[int(sl[1].start+xx.min()), int(sl[0].start+yy.min()),
                              int(sl[1].start+xx.max()+1), int(sl[0].start+yy.max()+1)],
                      'mask':labels == cid})
# Stable row-major order, independent of nominal equal-width columns.
comps.sort(key=lambda c: (0 if c['bbox'][1] < raw.height // 2 else 1, c['bbox'][0]))
if len(comps) != 6:
    raise RuntimeError(f'Expected six major alpha-connected figures, found {len(comps)}')

# Expand each figure only to nearby alpha islands (up to 3 original pixels), retaining
# source RGBA values byte-for-byte. Distant detached artifacts stay outside the trial.
all_masks = np.stack([c['mask'] for c in comps])
if np.any(all_masks.sum(axis=0) > 1):
    raise RuntimeError('Major figure components overlap; no safe extraction possible')
figures = []
for i, comp in enumerate(comps):
    distance = ndimage.distance_transform_edt(~comp['mask'])
    mask = comp['mask'] | ((alpha > 0) & (distance <= FRINGE_RADIUS))
    if np.any(mask & (all_masks.sum(axis=0) > 1)):
        raise RuntimeError(f'Fringe assignment overlaps another major figure for pose {i+1}')
    yy, xx = np.where(mask)
    box = (int(xx.min()), int(yy.min()), int(xx.max()+1), int(yy.max()+1))
    extracted = raw.crop(box)
    extracted_pixels = np.asarray(extracted)
    local_mask = mask[box[1]:box[3], box[0]:box[2]]
    # Keep only the selected figure and its original nearby RGBA pixels.
    masked = extracted_pixels.copy()
    masked[~local_mask] = 0
    extracted = Image.fromarray(masked, 'RGBA')
    w, h = round(extracted.width*SCALE), round(extracted.height*SCALE)
    if w > CELL-10 or h > BASELINE:
        raise RuntimeError(f'Pose {i+1} violates trial cell margins: scaled {w}x{h}')
    # Nearest sampling preserves source palette/alpha values and pixel clusters.
    scaled = extracted.resize((w,h), Image.Resampling.NEAREST)
    cell = Image.new('RGBA',(CELL,CELL),(0,0,0,0))
    xoff, yoff = (CELL-w)//2, BASELINE-h
    cell.alpha_composite(scaled,(xoff,yoff))
    pose_path = OUT/f'pose-{i+1:02d}-96px.png'
    cell.save(pose_path)
    figures.append({'index':i+1, 'sourceComponentId':comp['id'], 'sourceComponentPixels':comp['area'],
                    'sourceCropLTRB':list(box), 'sourceCropSize':[extracted.width,extracted.height],
                    'scaledFigureSize':[w,h], 'scale':SCALE, 'offsetInCell':[xoff,yoff],
                    'baselineY':BASELINE, 'cellMarginsLTRB':[xoff,yoff,CELL-xoff-w,CELL-yoff-h],
                    'retainedNonMainAlphaPixels':int(np.count_nonzero(mask & ~comp['mask'])),
                    'cellSha256':sha256(pose_path.read_bytes()).hexdigest(), 'path':pose_path.name})

atlas = Image.new('RGBA',(CELL*COLS,CELL*ROWS),(0,0,0,0))
for i,f in enumerate(figures):
    cell=Image.open(OUT/f['path']).convert('RGBA')
    atlas.alpha_composite(cell,((i%COLS)*CELL,(i//COLS)*CELL))
atlas_path=OUT/'pass6-attempt03-trial-96x96.png'; atlas.save(atlas_path)

# Native-size extraction boards retain source resolution and are used to inspect
# silhouette assignment and edge fringe before viewing downscaled gameplay cells.
maxw=max(f['sourceCropSize'][0] for f in figures); maxh=max(f['sourceCropSize'][1] for f in figures)
native=Image.new('RGBA',(maxw*COLS,maxh*ROWS),(0,0,0,0))
for i,f in enumerate(figures):
    p=Image.open(OUT/f['path']) # output pose cell; native source created below from recorded box/mask
    # Reconstruct the unscaled source extraction from the selected component + nearby fringe.
    comp=comps[i]
    d=ndimage.distance_transform_edt(~comp['mask']); m=comp['mask']|((alpha>0)&(d<=FRINGE_RADIUS))
    x0,y0,x1,y1=f['sourceCropLTRB']; crop=pix[y0:y1,x0:x1].copy(); crop[~m[y0:y1,x0:x1]]=0
    cropim=Image.fromarray(crop,'RGBA')
    native.alpha_composite(cropim,((i%COLS)*maxw+(maxw-cropim.width)//2,(i//COLS)*maxh+(maxh-cropim.height)))
native.save(OUT/'native-extracted-figures.png')

light_bg=(239,241,246,255); dark_bg=(26,22,38,255)
for suffix,bg in [('light',light_bg),('dark',dark_bg)]:
    board=Image.new('RGBA',atlas.size,bg); board.alpha_composite(atlas)
    board.convert('RGB').save(OUT/f'trial-{suffix}-native.png')
    zoom=board.resize((atlas.width*4,atlas.height*4),Image.Resampling.NEAREST)
    zoom.convert('RGB').save(OUT/f'trial-{suffix}-4x.png')
    # Side-by-side with the actual registered Kraken idle atlas at native scale.
    idle=Image.open(IDLE).convert('RGBA')
    comparison=Image.new('RGBA',(atlas.width+24+idle.width, max(atlas.height,idle.height)),bg)
    comparison.alpha_composite(board,(0,0)); comparison.alpha_composite(idle,(atlas.width+24,0))
    comparison.convert('RGB').save(OUT/f'comparison-idle-{suffix}.png')

# Native crops show margin and empty hand/edge details. This report is a trial, never runtime acceptance.
# Record all disconnected source alpha components not retained as background fragments for traceability.
source_labels, source_n = ndimage.label(alpha > 0, structure=np.ones((3,3),np.uint8))
retained_union=np.zeros_like(alpha,dtype=bool)
for comp in comps:
    retained_union |= comp['mask'] | ((alpha>0)&(ndimage.distance_transform_edt(~comp['mask'])<=FRINGE_RADIUS))
ex_labels, ex_n=ndimage.label((alpha>0)&~retained_union, structure=np.ones((3,3),np.uint8))
excluded=[]
for cid,sl in enumerate(ndimage.find_objects(ex_labels),1):
    if sl is None: continue
    m=ex_labels[sl]==cid; area=int(m.sum())
    if not area: continue
    yy,xx=np.where(m); excluded.append({'pixels':area,'boundsLTRB':[int(sl[1].start+xx.min()),int(sl[0].start+yy.min()),int(sl[1].start+xx.max()+1),int(sl[0].start+yy.max()+1)]})
report={'status':'visual cleanup/layout trial only; not runtime registered or gameplay accepted',
        'source':str(SRC.relative_to(ROOT)), 'sourceSha256':sha256(SRC.read_bytes()).hexdigest(),
        'sourceSize':list(raw.size), 'prompt':'tools/generate-art/kraken-pass6-attempt03-imagegen-prompt.txt',
        'identityReference':str(IDLE.relative_to(ROOT)), 'generationId':'exec-6af62d0f-5c3d-4f21-a213-93f524e77291',
        'trialAtlas':atlas_path.name,'trialAtlasSha256':sha256(atlas_path.read_bytes()).hexdigest(),
        'cell':[CELL,CELL], 'grid':[COLS,ROWS], 'scale':SCALE,'baselineY':BASELINE,'fringeRadiusOriginalPixels':FRINGE_RADIUS,
        'resampling':'nearest-neighbor; source RGBA pixel values retained by sampling, no redraw or color adjustment',
        'figures':figures,'excludedDetachedAlphaComponentCount':len(excluded),
        'excludedDetachedAlphaComponentMaxPixels':max((x['pixels'] for x in excluded), default=0),
        'excludedDetachedAlphaPixelCount':int(np.count_nonzero((alpha>0)&~retained_union)),
        'previews':['native-extracted-figures.png','trial-light-native.png','trial-dark-native.png','trial-light-4x.png','trial-dark-4x.png','comparison-idle-light.png','comparison-idle-dark.png'],
        'notes':['Six non-overlapping alpha-connected source figures were identified by their full silhouettes, not equal-width sheet columns.',
                 'Only nonzero-alpha pixels inside each silhouette or within 3 original pixels were included; RGBA values of all included source pixels are unchanged.',
                 'Distant detached transparent-image fragments are excluded from derived figures and listed; the untouched raw source remains authoritative.',
                 '96x96 output cells use one scale and baseline, with no basketball or runtime/ball-track changes.']}
(OUT/'review-trial-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'atlas':str(atlas_path),'sourceHash':report['sourceSha256'],'includedDetachedPixels':sum(f['retainedNonMainAlphaPixels'] for f in figures),'excludedDetachedPixelCount':report['excludedDetachedAlphaPixelCount'],'frames':[{'crop':f['sourceCropLTRB'],'size':f['scaledFigureSize'],'margins':f['cellMarginsLTRB']} for f in figures]},indent=2))
