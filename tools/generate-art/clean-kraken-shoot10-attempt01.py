#!/usr/bin/env python3
"""Isolate and lay out reviewed Kraken shoot10 attempt01 poses without redraw."""
from __future__ import annotations
import hashlib,json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/kraken-shoot10-attempt01-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-shoot10-attempt01'
POSES=OUT/'poses';LOGICAL=OUT/'kraken-shoot10-attempt01-logical-layout.png'
RUNTIME=OUT/'kraken-shoot10-attempt01-runtime-candidate.png'
LAYOUT=OUT/'runtime-layout.json';REPORT=OUT/'cleanup-layout-report.json'
LW,LH,LCOLS,LROWS,LMARGIN=384,512,4,3,24
NW,NH,NCOLS,NROWS,NATIVE_SCALE,BASE=80,96,5,2,.222,94
OUT.mkdir(parents=True,exist_ok=True);POSES.mkdir(parents=True,exist_ok=True)
raw=Image.open(SOURCE).convert('RGB');rgb=np.asarray(raw,dtype=np.uint8)
r,g,b=(rgb[...,i].astype(np.int16) for i in range(3))
key_like=(g>=130)&((g-r)>=40)&((g-b)>=40)
labels,n=ndimage.label(~key_like,structure=np.ones((3,3),dtype=np.uint8))
sizes=np.bincount(labels.ravel(),minlength=n+1)
components=[i for i in range(1,n+1) if sizes[i]>3000]
if len(components)!=10:raise RuntimeError(f'expected ten separated poses; found {len(components)} foreground components')
bounds=[]
for label in components:
    yy,xx=np.where(labels==label);bounds.append((int(xx.min()),int(yy.min()),int(xx.max()+1),int(yy.max()+1),int(sizes[label])))
# The raw export keeps four poses per row and two at the left of its final row;
# classify by figure center so hands crossing row boundaries cannot reorder poses.
def source_row(item):
    center=(item[1]+item[3])/2
    return 0 if center<418 else (1 if center<836 else 2)
bounds.sort(key=lambda q:(source_row(q),(q[0]+q[2])/2))
key_labels,key_count=ndimage.label(key_like,structure=np.ones((3,3),dtype=np.uint8))
border=np.unique(np.concatenate((key_labels[0],key_labels[-1],key_labels[:,0],key_labels[:,-1])))
border=border[border!=0];connected=np.isin(key_labels,border)
inside=np.unique(key_labels[~connected & key_like]);inside=inside[inside!=0]
island_sizes=np.bincount(key_labels.ravel(),minlength=key_count+1)
small=[int(c) for c in inside if island_sizes[c]<=60];large=[int(c) for c in inside if island_sizes[c]>60]
mask=connected|np.isin(key_labels,large)
edge_zone=ndimage.binary_dilation(connected,structure=np.ones((3,3),bool),iterations=2)
edge_spill=edge_zone&~mask&(g>=70)&((g-r)>=8)&((g-b)>=8);mask|=edge_spill
alpha=np.where(mask,0,255).astype(np.uint8);clean=rgb.copy()
if small:
    near=ndimage.distance_transform_edt(key_like,return_distances=False,return_indices=True)
    sm=np.isin(key_labels,small);clean[sm]=rgb[near[0][sm],near[1][sm]]
weak=(g>=50)&((g-r)>=4)&((g-b)>=4);region=np.zeros(weak.shape,bool)
for x0,y0,x1,y1,_ in bounds:region[y0:y1,x0:x1]=True
weak_inside=weak&region&(alpha>0)
if np.any(weak_inside):
    near=ndimage.distance_transform_edt(weak,return_distances=False,return_indices=True)
    clean[weak_inside]=rgb[near[0][weak_inside],near[1][weak_inside]]
keyed=Image.fromarray(np.dstack((clean,alpha)),mode='RGBA')
maxw=max(q[2]-q[0] for q in bounds);maxh=max(q[3]-q[1] for q in bounds)
logical_scale=min((LW-2*LMARGIN)/maxw,(LH-2*LMARGIN)/maxh)
logical=Image.new('RGBA',(LW*LCOLS,LH*LROWS),(0,0,0,0));logical_rows=[];crops=[]
for i,(x0,y0,x1,y1,pixels) in enumerate(bounds):
    crop=keyed.crop((x0,y0,x1,y1));crops.append(crop)
    w,h=round(crop.width*logical_scale),round(crop.height*logical_scale)
    pose=crop.resize((w,h),Image.Resampling.NEAREST);cx,cy=(i%LCOLS)*LW,(i//LCOLS)*LH
    ox=cx+(LW-w)//2;oy=cy+LH-LMARGIN-h;logical.alpha_composite(pose,(ox,oy))
    pose.save(POSES/f'pose-{i:02d}-keyed.png')
    bb=logical.crop((cx,cy,cx+LW,cy+LH)).getchannel('A').getbbox();m=[bb[0],bb[1],LW-bb[2],LH-bb[3]]
    logical_rows.append({'frame':i,'sourceGridRow':source_row(bounds[i]),'sourceBoundsLTRB':[x0,y0,x1,y1],
      'sourceComponentPixels':pixels,'uniformFitScale':logical_scale,'scaledSize':[w,h],
      'logicalMarginsLTRB':m,'minimumMarginPx':min(m),'meets24pxMargins':min(m)>=LMARGIN,
      'poseSha256':hashlib.sha256((POSES/f'pose-{i:02d}-keyed.png').read_bytes()).hexdigest()})
logical.save(LOGICAL)
runtime=Image.new('RGBA',(NW*NCOLS,NH*NROWS),(0,0,0,0));native=[]
for i,crop in enumerate(crops):
    w,h=round(crop.width*NATIVE_SCALE),round(crop.height*NATIVE_SCALE)
    if w>NW or h>BASE:raise RuntimeError(f'pose {i} exceeds native cell or common baseline')
    pose=crop.resize((w,h),Image.Resampling.NEAREST);cellx=(i%NCOLS)*NW;celly=(i//NCOLS)*NH
    ox=cellx+(NW-w)//2;oy=celly+BASE-h;runtime.alpha_composite(pose,(ox,oy))
    cell=runtime.crop((cellx,celly,cellx+NW,celly+NH)).getchannel('A');bb=cell.getbbox();m=[bb[0],bb[1],NW-bb[2],NH-bb[3]]
    native.append({'frame':i,'x':cellx,'y':celly,'w':NW,'h':NH,'sourceBoundsLTRB':list(bounds[i][:4]),
      'sourceComponentPixels':bounds[i][4],'sourceToRuntimeScale':NATIVE_SCALE,'scaledSize':[w,h],
      'offsetInCell':[ox-cellx,oy-celly],'baseline':BASE,'nativeMarginsLTRB':m,'minimumMarginPx':min(m),
      'alphaFrameSha256':hashlib.sha256(cell.tobytes()).hexdigest()})
runtime.save(RUNTIME)
LAYOUT.write_text(json.dumps({'status':'runtime-size proof only; not accepted or registered',
 'sourceSheet':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
 'atlas':str(RUNTIME.relative_to(ROOT)),'columns':NCOLS,'rows':NROWS,'frameWidth':NW,'frameHeight':NH,
 'sourceToRuntimeScale':NATIVE_SCALE,'baseline':BASE,'interpolation':'nearest-neighbor','frames':native},indent=2)+'\n')
for theme,bg in [('light',(235,238,244,255)),('dark',(30,25,41,255))]:
    board=Image.new('RGBA',(NCOLS*160,NROWS*192),bg)
    for i in range(10):
        p=runtime.crop(((i%NCOLS)*NW,(i//NCOLS)*NH,(i%NCOLS+1)*NW,(i//NCOLS+1)*NH)).resize((160,192),Image.Resampling.NEAREST)
        board.alpha_composite(p,((i%NCOLS)*160,(i//NCOLS)*192))
    board.convert('RGB').save(OUT/f'kraken-shoot10-attempt01-{theme}-preview.png')
hashes=[v['alphaFrameSha256'] for v in native]
opaque_green=((np.asarray(runtime)[...,3]>0)&(np.asarray(runtime)[...,1]>=50)&
              (np.asarray(runtime)[...,1].astype(np.int16)-np.asarray(runtime)[...,0].astype(np.int16)>=4)&
              (np.asarray(runtime)[...,1].astype(np.int16)-np.asarray(runtime)[...,2].astype(np.int16)>=4))
report={'status':'cleanup/layout trial only; gameplay and production acceptance pending',
 'source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
 'requestedDimensions':[1536,1536],'actualDimensions':list(raw.size),
 'key':{'predicate':'G>=130, G-R>=40, G-B>=40','connectivity':'8-connected canvas-edge matte plus detached green islands',
   'keyedPixels':int(mask.sum()),'interiorIslandCount':int(len(inside)),'smallIslandRGBRepairs':len(small),
   'largeIslandsCleared':len(large),'localEdgePixelsCleared':int(edge_spill.sum()),
   'weakInteriorRGBRepairs':int(weak_inside.sum()),'rawPreserved':True,'noRedraw':True,
   'opaqueGreenDominantNativePixels':int(opaque_green.sum())},
 'components':{'expected':10,'found':len(components),'sourceGrid':[4,3],
   'ordering':'row0 left-to-right; row1 left-to-right; bottom row first two cells',
   'componentBoundsAndPixels':[{'boundsLTRB':list(q[:4]),'pixels':q[4]} for q in bounds]},
 'layout':{'logicalGrid':[LCOLS,LROWS],'logicalCellSize':[LW,LH],'logicalMarginRequirement':LMARGIN,
   'logicalUniformFitScale':logical_scale,'logicalSheet':str(LOGICAL.relative_to(ROOT)),
   'runtimeGrid':[NCOLS,NROWS],'runtimeCellSize':[NW,NH],'runtimeScale':NATIVE_SCALE,'baseline':BASE,
   'runtimeCandidate':str(RUNTIME.relative_to(ROOT)),'runtimeLayout':str(LAYOUT.relative_to(ROOT)),
   'distinctLogicalFrameHashes':len(set(v['poseSha256'] for v in logical_rows)),
   'distinctNativeFrameHashes':len(set(hashes)),'allLogicalMarginsPass':all(v['meets24pxMargins'] for v in logical_rows),
   'frames':logical_rows}}
REPORT.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'components':len(components),'distinctNativeFrames':len(set(hashes)),
 'logicalMarginsPass':report['layout']['allLogicalMarginsPass'],'opaqueGreenDominantNativePixels':int(opaque_green.sum()),
 'logicalScale':logical_scale,'runtimeScale':NATIVE_SCALE,'report':str(REPORT.relative_to(ROOT))},indent=2))
