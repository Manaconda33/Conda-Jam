#!/usr/bin/env python3
"""Isolate and uniformly center the 11 original Piper push poses; no redraw/reorder."""
from __future__ import annotations
import hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, distance_transform_edt, find_objects, label

ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/piper-quickstep-push-attempt1-generated-raw.png'
OUT=ROOT/'tools/generate-art/sources/piper-quickstep-push-attempt1-clean-candidate.png'
LAYOUT=ROOT/'tools/generate-art/piper-quickstep-push-attempt1-layouts.json'
PROOF=ROOT/'tools/generate-art/previews/piper-quickstep-push/attempt1-clean'
CELL_W,CELL_H,COLS,ROWS=384,512,4,3
MIN_MARGIN=56

with Image.open(RAW) as im:
    if im.mode!='RGBA': raise SystemExit(f'Expected RGBA, got {im.mode}')
    raw=np.asarray(im).copy()
alpha=raw[:,:,3]
if int(alpha.min())!=0: raise SystemExit('Raw background is not transparent')
labels,count=label(alpha>=64,structure=np.ones((3,3),dtype=np.uint8))
components=[]
for idx,slc in enumerate(find_objects(labels),1):
    if slc is None: continue
    area=int(np.count_nonzero(labels[slc]==idx))
    if area<10000: continue
    ys,xs=slc
    components.append({'label':idx,'area':area,'x0':int(xs.start),'y0':int(ys.start),'x1':int(xs.stop),'y1':int(ys.stop),
                       'cx':float((xs.start+xs.stop)/2),'cy':float((ys.start+ys.stop)/2)})
if len(components)!=11: raise SystemExit(f'Expected exactly 11 complete poses, found {len(components)}')
# Assign by nearest row/column center so raw margin crossings cannot reorder figures.
for c in components:
    c['col']=min(range(COLS),key=lambda col:abs(c['cx']-(col+.5)*raw.shape[1]/COLS))
    c['row']=min(range(ROWS),key=lambda row:abs(c['cy']-(row+.5)*raw.shape[0]/ROWS))
by_cell={(c['row'],c['col']):c for c in components}
expected=[(r,c) for r in range(ROWS) for c in range(COLS) if (r,c)!=(2,3)]
if len(by_cell)!=11 or set(by_cell)!=set(expected): raise SystemExit(f'Unexpected pose cells: {sorted(by_cell)}')
# Include only alpha antialiasing within 2px of each opaque figure component.
for c in components:
    core=labels==c['label']
    c['mask']=binary_dilation(core,iterations=2)&(alpha>0)
    yy,xx=np.where(c['mask'])
    c['x0'],c['x1']=int(xx.min()),int(xx.max()+1)
    c['y0'],c['y1']=int(yy.min()),int(yy.max()+1)
    c['w'],c['h']=c['x1']-c['x0'],c['y1']-c['y0']
max_width=max(c['w'] for c in components)
scale=(CELL_W-2*(MIN_MARGIN+4))/max_width
if scale<=0: raise SystemExit('Invalid uniform scale')
canvas=Image.new('RGBA',(CELL_W*COLS,CELL_H*ROWS),(0,0,0,0))
records=[]
for frame,(row,col) in enumerate(expected):
    c=by_cell[(row,col)]
    x0,y0,x1,y1=c['x0'],c['y0'],c['x1'],c['y1']
    crop=raw[y0:y1,x0:x1].copy()
    crop[~c['mask'][y0:y1,x0:x1],3]=0
    # Resize premultiplied RGBA, retaining the existing pixels only.
    src=Image.fromarray(crop,'RGBA').convert('RGBa')
    size=(max(1,round(c['w']*scale)),max(1,round(c['h']*scale)))
    resized=src.resize(size,Image.Resampling.LANCZOS).convert('RGBA')
    ox=col*CELL_W+(CELL_W-size[0])//2
    oy=row*CELL_H+(CELL_H-size[1])//2
    canvas.alpha_composite(resized,(ox,oy))
    margins=[ox-col*CELL_W,CELL_W-(ox-col*CELL_W)-size[0],oy-row*CELL_H,CELL_H-(oy-row*CELL_H)-size[1]]
    if min(margins)<MIN_MARGIN: raise SystemExit(f'Frame {frame} margin too small: {margins}')
    records.append({'frame':frame,'rawComponent':c['label'],'rawAreaAlpha64':c['area'],'rawBboxXYXY':[c['x0'],c['y0'],c['x1'],c['y1']],
                    'cell':[row,col],'uniformScale':scale,'outputSize':list(size),'outputXY':[ox,oy],
                    'transparentMarginsLTRBpx':margins,'cleanup':'component mask plus 2px original antialias only'})
OUT.parent.mkdir(parents=True,exist_ok=True); PROOF.mkdir(parents=True,exist_ok=True)
canvas.save(OUT,optimize=True)
# Light/dark visual contact sheets are proofs only; authored source remains the RGBA canvas.
for bg,name in [((245,245,245,255),'light'),((25,27,35,255),'dark')]:
    proof=Image.new('RGBA',canvas.size,bg); proof.alpha_composite(canvas)
    proof.save(PROOF/f'source-{name}.png',optimize=True)
manifest={'athlete':'Piper Quickstep','clip':'push','attempt':1,'rawSource':'tools/generate-art/sources/piper-quickstep-push-attempt1-generated-raw.png',
          'rawSha256':hashlib.sha256(RAW.read_bytes()).hexdigest(),'cleanSource':'tools/generate-art/sources/piper-quickstep-push-attempt1-clean-candidate.png',
          'cleanSha256':hashlib.sha256(OUT.read_bytes()).hexdigest(),'cleanSize':list(canvas.size),'mode':'RGBA','layout':'4x3 row-major, 11 distinct original poses and empty final cell',
          'uniformScale':scale,'minimumTransparentMargin':min(min(r['transparentMarginsLTRBpx']) for r in records),
          'cleanup':'Global alpha>=64 component isolation, per-pose crop, retain original alpha only within 2px of the component, common uniform scale and transparent centering. No figure pixels drawn, synthesized, duplicated or reordered.',
          'frames':records}
LAYOUT.write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'source':str(OUT.relative_to(ROOT)),'sha256':manifest['cleanSha256'],'size':canvas.size,'uniformScale':scale,'frames':len(records),'minimumMargins':manifest['minimumTransparentMargin'],'layout':str(LAYOUT.relative_to(ROOT))},indent=2))
