"""Remove generated background residue and fit the 15 intact figures into atlas cells."""
from collections import deque
from hashlib import sha256
from pathlib import Path
import json
import numpy as np
from PIL import Image

ROOT=Path(__file__).resolve().parents[2]
raw_path=ROOT/'tools/generate-art/sources/j125-leo-dunk-scythe-attempt02-generated-raw.png'
clean_path=ROOT/'tools/generate-art/sources/j125-leo-dunk-scythe-attempt02-cleaned-components.png'
atlas_path=ROOT/'public/assets/animation/leo-dunk-scythe-attempt02-right.webp'
layout_path=ROOT/'tools/generate-art/j125-leo-dunk-scythe-attempt02-layout.json'
preview_dir=ROOT/'tools/generate-art/previews'
raw=Image.open(raw_path).convert('RGBA'); a=np.asarray(raw).copy()
visible=a[:,:,3]>=16
seen=np.zeros(visible.shape,bool); comps=[]
for yy,xx in zip(*np.where(visible)):
    if seen[yy,xx]:continue
    q=deque([(int(yy),int(xx))]);seen[yy,xx]=True; pts=[]
    while q:
        y,x=q.popleft();pts.append((y,x))
        for ny in range(max(0,y-1),min(visible.shape[0],y+2)):
            for nx in range(max(0,x-1),min(visible.shape[1],x+2)):
                if visible[ny,nx] and not seen[ny,nx]:seen[ny,nx]=True;q.append((ny,nx))
    if len(pts)>=50:
        ys=[p[0] for p in pts];xs=[p[1] for p in pts]
        comps.append({'pixels':len(pts),'bbox':[min(xs),min(ys),max(xs)+1,max(ys)+1], 'center':[(min(xs)+max(xs)+1)/2,(min(ys)+max(ys)+1)/2]})
comps=sorted(comps,key=lambda c:c['pixels'],reverse=True)
if len(comps)!=15:raise ValueError(f'Expected exactly 15 figure components >=50px, found {len(comps)}')
assigned={}
for c in comps:
    cx,cy=c['center']; col=min(4,int(cx*5/raw.width)); row=min(2,int(cy*3/raw.height)); i=row*5+col
    if i in assigned:raise ValueError(f'Multiple figures assigned to source cell {i}: {assigned[i]} and {c}')
    assigned[i]=c
if set(assigned)!=set(range(15)):raise ValueError(f'Missing source cells: {sorted(set(range(15))-set(assigned))}')
clean=np.zeros_like(a); transforms=[]
for i,c in assigned.items():
    x0,y0,x1,y1=c['bbox']; compmask=np.zeros(visible.shape,bool)
    # Recover the selected thresholded component within its tight bbox.
    local=visible[y0:y1,x0:x1]; lseen=np.zeros(local.shape,bool); seeds=np.argwhere(local)
    start=tuple(seeds[0]); q=deque([start]);lseen[start]=True; pixels=[]
    while q:
        y,x=q.popleft();pixels.append((y+y0,x+x0))
        for ny in range(max(0,y-1),min(local.shape[0],y+2)):
            for nx in range(max(0,x-1),min(local.shape[1],x+2)):
                if local[ny,nx] and not lseen[ny,nx]:lseen[ny,nx]=True;q.append((ny,nx))
    for y,x in pixels:clean[y,x]=a[y,x]
    transforms.append({'poseIndex':i,'sourceBounds':c['bbox'],'sourceVisiblePixels':c['pixels']})
Image.fromarray(clean,'RGBA').save(clean_path)
atlas=Image.new('RGBA',(512,384),(0,0,0,0));frames=[];scale=.21
for t in transforms:
    i=t['poseIndex'];x0,y0,x1,y1=t['sourceBounds'];crop=Image.fromarray(clean[y0:y1,x0:x1]).convert('RGBA')
    w,h=max(1,round(crop.width*scale)),max(1,round(crop.height*scale))
    if w>66 or h>72:
        s=min(66/crop.width,72/crop.height);w,h=round(crop.width*s),round(crop.height*s)
    fitted=crop.resize((w,h),Image.Resampling.NEAREST)
    dx=(128-w)//2;dy=94-h
    col,row=i%4,i//4;ax,ay=col*128,row*96
    atlas.alpha_composite(fitted,(ax+dx,ay+dy))
    t.update({'destinationRect':{'x':ax,'y':ay,'w':128,'h':96},'spriteBoundsWithinFrame':{'x':dx,'y':dy,'w':w,'h':h},'baselineY':94,'scale':round(w/crop.width,6),'filter':'nearest','margins':{'left':dx,'top':dy,'right':128-dx-w,'bottom':96-dy-h,'baselineClearance':94-dy-h}})
    frames.append({'x':ax,'y':ay,'w':128,'h':96})
transforms.sort(key=lambda t:t['poseIndex'])
frames=[t['destinationRect'] for t in transforms]
atlas.save(atlas_path,'WEBP',lossless=True,method=6)
for n,bgcol in [('light',(242,244,248,255)),('dark',(22,24,30,255))]:
    bg=Image.new('RGBA',atlas.size,bgcol);bg.alpha_composite(atlas);bg.convert('RGB').save(preview_dir/f'j125-attempt02-atlas-{n}.png')
for i in range(15):
    x=(i%4)*128;y=(i//4)*96;crop=atlas.crop((x,y,x+128,y+96)).resize((384,288),Image.Resampling.NEAREST)

    for name,color in [('light',(242,244,248,255)),('dark',(22,24,30,255))]:
        bg=Image.new('RGBA',crop.size,color);bg.alpha_composite(crop);bg.convert('RGB').save(preview_dir/f'j125-attempt02-atlas-frame{i:02d}-{name}-3x.png')
layout={'athlete':'leo','direction':'right','clip':'dunk-scythe','src':'./public/assets/animation/leo-dunk-scythe-attempt02-right.webp','columns':4,'rows':4,'frames':frames,'sourceGrid':{'columns':5,'rows':3,'dimensions':[raw.width,raw.height]},'sourceImage':str(clean_path.relative_to(ROOT)),'rawSourceImage':str(raw_path.relative_to(ROOT)),'rawSha256':sha256(raw_path.read_bytes()).hexdigest(),'sourceSha256':sha256(clean_path.read_bytes()).hexdigest(),'atlasSha256':sha256(atlas_path.read_bytes()).hexdigest(),'atlasDimensions':[512,384],'cellSize':[128,96],'baselineY':94,'packing':'Retain the 15 largest >=50-pixel connected opaque figure components, assign by component center to the source 5x3 cell, discard alpha<16 and all non-figure residue, and fit each intact component at a shared nearest-neighbor scale of 0.21 (clamped only if needed) centered to x=64 and baseline y=94 in 128x96 cells.','transforms':transforms,'prompt':'tools/generate-art/j125-leo-dunk-scythe-attempt02-pixel-reference-prompt.md','generationId':'exec-67ab8d50-5042-4495-9309-88d87c00cfa7','reviewStatus':'unreviewed fit candidate; not registered'}
layout_path.write_text(json.dumps(layout,indent=2)+'\n')
report={'rawSource':str(raw_path.relative_to(ROOT)),'rawSha256':sha256(raw_path.read_bytes()).hexdigest(),'cleanedSource':str(clean_path.relative_to(ROOT)),'cleanedSourceSha256':sha256(clean_path.read_bytes()).hexdigest(),'thresholdAlphaBelow':16,'retainedFigureComponents':15,'removedComponents':max(0,len(comps)-15),'removedVisiblePixels':sum(c['pixels'] for c in comps[15:]),'discardedAlphaPixels':int(np.sum((a[:,:,3]>0)&(clean[:,:,3]==0))),'componentBounds':[{'poseIndex':t['poseIndex'],'bbox':t['sourceBounds'],'pixels':t['sourceVisiblePixels']} for t in transforms],'method':'Preserved the 15 largest >=50-pixel alpha>=16 connected components, one uniquely assigned to each source-grid cell; discarded all low-alpha and detached non-figure pixels. Raw source is unmodified.'}
(ROOT/'tools/generate-art/j125-leo-dunk-scythe-attempt02-cleanup-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'atlas':str(atlas_path.relative_to(ROOT)),'sha256':layout['atlasSha256'],'components':len(transforms),'minimumMargins':[min(t['margins'][k] for t in transforms) for k in ('left','top','right','bottom')],'maxSize':[max(t['spriteBoundsWithinFrame']['w'] for t in transforms),max(t['spriteBoundsWithinFrame']['h'] for t in transforms)]},indent=2))
