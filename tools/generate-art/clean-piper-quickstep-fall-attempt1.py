#!/usr/bin/env python3
"""Isolate ten original Piper fall poses and center them on the 5x2 source grid."""
from __future__ import annotations
import hashlib, json, math
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, find_objects, label

ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/piper-quickstep-fall-attempt1-generated-raw.png'
OUT=ROOT/'tools/generate-art/sources/piper-quickstep-fall-attempt1-clean-candidate.png'
LAYOUT=ROOT/'tools/generate-art/piper-quickstep-fall-attempt1-layouts.json'

def sha(path:Path)->str:return hashlib.sha256(path.read_bytes()).hexdigest()

def resize_premultiplied(rgba:np.ndarray,size:tuple[int,int])->np.ndarray:
    im=Image.fromarray(rgba,'RGBA')
    arr=np.asarray(im).astype(np.float32)
    a=arr[:,:,3:4]/255.0
    premul=np.concatenate([arr[:,:,:3]*a,arr[:,:,3:4]],axis=2).astype(np.uint8)
    resized=np.asarray(Image.fromarray(premul,'RGBA').resize(size,Image.Resampling.LANCZOS)).astype(np.float32)
    alpha=np.clip(resized[:,:,3:4],0,255)
    rgb=np.divide(resized[:,:,:3]*255.0,alpha,out=np.zeros_like(resized[:,:,:3]),where=alpha>0)
    return np.concatenate([np.clip(rgb,0,255),alpha],axis=2).astype(np.uint8)

with Image.open(RAW) as opened:
    source=opened.convert('RGBA')
if source.size!=(1536,1024):raise SystemExit(f'Unexpected source size: {source.size}')
pixels=np.asarray(source)
alpha=pixels[:,:,3]
labels,count=label(alpha>=64,structure=np.ones((3,3),dtype=np.uint8))
cell_w=source.width/5
cell_h=source.height/2
rectangles=[]
for ident,slices in enumerate(find_objects(labels),start=1):
    if slices is None:continue
    area=int(np.count_nonzero(labels[slices]==ident))
    # Detached glows leave a dozen tiny components; only full body silhouettes
    # are retained, and their geometry/count are validated below.
    if area<1000:continue
    ys,xs=slices
    rect={'component':ident,'areaAlpha64':area,'bboxXYXY':[int(xs.start),int(ys.start),int(xs.stop),int(ys.stop)],'center':[float((xs.start+xs.stop)/2),float((ys.start+ys.stop)/2)]}
    rect['column']=min(4,int(rect['center'][0]//cell_w));rect['row']=min(1,int(rect['center'][1]//cell_h))
    rectangles.append(rect)
if len(rectangles)!=10:raise SystemExit(f'Expected ten large pose components, got {len(rectangles)}')
if len({(r['row'],r['column']) for r in rectangles})!=10:raise SystemExit('Source component centers do not map one pose to each 5x2 cell')
by_cell={(r['row'],r['column']):r for r in rectangles}
canvas=np.zeros((1024,1536,4),dtype=np.uint8)
frames=[]
scale=.52
for index,(row,col) in enumerate(( (r,c) for r in range(2) for c in range(5) )):
    rect=by_cell[(row,col)]; ident=rect['component']; mask=labels==ident
    keep=binary_dilation(mask,iterations=2)
    ys,xs=np.where(keep)
    x0,x1=int(xs.min()),int(xs.max()+1);y0,y1=int(ys.min()),int(ys.max()+1)
    crop=pixels[y0:y1,x0:x1].copy();local=keep[y0:y1,x0:x1]
    crop[~local,3]=0
    # One common scale preserves comparable body sizes across all ten poses.
    size=(max(1,round(crop.shape[1]*scale)),max(1,round(crop.shape[0]*scale)))
    resized=resize_premultiplied(crop,size)
    cx=(col+.5)*cell_w;cy=(row+.5)*cell_h
    ox=round(cx-size[0]/2);oy=round(cy-size[1]/2)
    canvas[oy:oy+size[1],ox:ox+size[0]]=resized
    visible=resized[:,:,3]>0;vy,vx=np.where(visible)
    frames.append({'frame':index,'sourceComponent':ident,'sourceAreaAlpha64':rect['areaAlpha64'],'sourceBBoxXYXY':rect['bboxXYXY'],'sourceCenter':rect['center'],'sourceCell':[row,col],'uniformScale':scale,'outputSize':list(size),'outputXY':[ox,oy],'transparentMarginsLTRBpx':[int(vx.min()+ox-round(col*cell_w)),int(math.ceil((col+1)*cell_w)-vx.max()-1-ox),int(vy.min()+oy-row*cell_h),int((row+1)*cell_h-vy.max()-1-oy)]})

clean=Image.fromarray(canvas,'RGBA');clean.save(OUT,optimize=True)
# Validate true alpha and every cell's per-edge source margin.
assert clean.getchannel('A').getextrema()[0]==0
for f in frames:
    if min(f['transparentMarginsLTRBpx'])<60:raise SystemExit(f'Frame {f["frame"]} margin below 60px: {f["transparentMarginsLTRBpx"]}')
layout={'athlete':'Piper Quickstep','clip':'fall','attempt':1,'rawSource':'tools/generate-art/sources/piper-quickstep-fall-attempt1-generated-raw.png','rawSourceSha256':sha(RAW),'cleanedSource':'tools/generate-art/sources/piper-quickstep-fall-attempt1-clean-candidate.png','cleanedSourceSha256':sha(OUT),'size':[1536,1024],'mode':'RGBA','layout':'5x2 row-major ten original poses','cleanup':'At alpha>=64, isolate ten separate original body components globally (some cross nominal raw cell edges), retain original pixels within two-pixel antialias dilation, uniformly scale every body by0.55 and center it in its intended 5x2 cell. No redraw, synthesis, duplication or reorder. Detached glow/specks are excluded.','alphaThreshold':64,'antialiasDilationPx':2,'commonScale':scale,'frames':frames}
LAYOUT.write_text(json.dumps(layout,indent=2)+'\n')
print(json.dumps({'rawSha256':sha(RAW),'cleanSha256':sha(OUT),'dimensions':clean.size,'frames':len(frames),'minimumMargin':min(min(f['transparentMarginsLTRBpx']) for f in frames),'alphaExtrema':clean.getchannel('A').getextrema()},indent=2))
