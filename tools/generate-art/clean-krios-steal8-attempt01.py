#!/usr/bin/env python3
"""Isolate and lay out reviewed Krios steal8 attempt01 poses without redraw.

The immutable generated RGB sheet is retained. Green matte and small isolated
matte islands are removed, the eight connected figures are cropped by component,
then uniformly nearest-neighbor fitted into logical and native transparent cells.
"""
from __future__ import annotations
import hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/krios-steal8-attempt01-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/krios-steal8-attempt01'
POSES=OUT/'poses';LOGICAL=OUT/'krios-steal8-attempt01-logical-layout.png'
RUNTIME=OUT/'krios-steal8-attempt01-runtime-candidate.png'
LAYOUT=OUT/'runtime-layout.json';REPORT=OUT/'cleanup-layout-report.json'
CW,CH,COLS,ROWS,MARGIN=384,512,4,2,24
NATIVE_W,NATIVE_H,NATIVE_SCALE,BASE=128,96,.26,94
OUT.mkdir(parents=True,exist_ok=True);POSES.mkdir(parents=True,exist_ok=True)
raw=Image.open(SOURCE).convert('RGB');rgb=np.asarray(raw,dtype=np.uint8)
r,g,b=(rgb[...,i].astype(np.int16) for i in range(3))
key_like=(g>=130)&((g-r)>=40)&((g-b)>=40)
# The source review found eight isolated figures. Use silhouette components,
# not nominal grid cells, because several open hands cross cell boundaries.
labels,n=ndimage.label(~key_like,structure=np.ones((3,3),dtype=np.uint8))
sizes=np.bincount(labels.ravel(),minlength=n+1)
components=[i for i in range(1,n+1) if sizes[i]>10_000]
if len(components)!=8:raise RuntimeError(f'expected 8 isolated figures; found {len(components)} foreground components >10k pixels')
bounds=[]
for label in components:
    yy,xx=np.where(labels==label);bounds.append((int(xx.min()),int(yy.min()),int(xx.max()+1),int(yy.max()+1),int(sizes[label])))
bounds.sort(key=lambda q:(0 if (q[1]+q[3])/2<512 else 1,(q[0]+q[2])/2))
key_labels,n_key=ndimage.label(key_like,structure=np.ones((3,3),dtype=np.uint8))
border=np.unique(np.concatenate((key_labels[0],key_labels[-1],key_labels[:,0],key_labels[:,-1])))
border=border[border!=0];connected=np.isin(key_labels,border)
inside=np.unique(key_labels[~connected & key_like]);inside=inside[inside!=0]
island_sizes=np.bincount(key_labels.ravel(),minlength=n_key+1)
small=[int(c) for c in inside if island_sizes[c]<=60]
large=[int(c) for c in inside if island_sizes[c]>60]
remove=np.isin(key_labels,large);mask=connected|remove
edge_zone=ndimage.binary_dilation(connected,structure=np.ones((3,3),bool),iterations=2)
edge_spill=edge_zone&~mask&(g>=70)&((g-r)>=8)&((g-b)>=8);mask|=edge_spill
alpha=np.where(mask,0,255).astype(np.uint8);rgb_clean=rgb.copy()
if small:
    nearest=ndimage.distance_transform_edt(key_like,return_distances=False,return_indices=True)
    sm=np.isin(key_labels,small);rgb_clean[sm]=rgb[nearest[0][sm],nearest[1][sm]]
weak=(g>=50)&((g-r)>=4)&((g-b)>=4);region=np.zeros(weak.shape,bool)
for x0,y0,x1,y1,_ in bounds:region[y0:y1,x0:x1]=True
weak_inside=weak&region&(alpha>0)
if np.any(weak_inside):
    near=ndimage.distance_transform_edt(weak,return_distances=False,return_indices=True)
    rgb_clean[weak_inside]=rgb[near[0][weak_inside],near[1][weak_inside]]
keyed=Image.fromarray(np.dstack((rgb_clean,alpha)),mode='RGBA')
maxw=max(x1-x0 for x0,y0,x1,y1,_ in bounds);maxh=max(y1-y0 for x0,y0,x1,y1,_ in bounds)
logical_scale=min((CW-2*MARGIN)/maxw,(CH-2*MARGIN)/maxh)
logical=Image.new('RGBA',(CW*COLS,CH*ROWS),(0,0,0,0));logical_frames=[];crops=[]
for i,(x0,y0,x1,y1,count) in enumerate(bounds):
    crop=keyed.crop((x0,y0,x1,y1));crops.append(crop)
    w,h=round(crop.width*logical_scale),round(crop.height*logical_scale)
    pose=crop.resize((w,h),Image.Resampling.NEAREST);cx,cy=(i%COLS)*CW,(i//COLS)*CH
    ox=cx+(CW-w)//2;oy=cy+CH-MARGIN-h;logical.alpha_composite(pose,(ox,oy))
    pose.save(POSES/f'pose-{i:02d}-keyed.png')
    cell=logical.crop((cx,cy,cx+CW,cy+CH)).getchannel('A');bb=cell.getbbox();margins=[bb[0],bb[1],CW-bb[2],CH-bb[3]]
    logical_frames.append({'frame':i,'sourceBoundsLTRB':[x0,y0,x1,y1],'sourceComponentPixels':count,
      'uniformFitScale':logical_scale,'scaledSize':[w,h],'outputMarginsLTRB':margins,
      'minimumMarginPx':min(margins),'meets24pxMargins':min(margins)>=MARGIN,
      'poseSha256':hashlib.sha256((POSES/f'pose-{i:02d}-keyed.png').read_bytes()).hexdigest()})
logical.save(LOGICAL)
runtime=Image.new('RGBA',(8*NATIVE_W,NATIVE_H),(0,0,0,0));native=[]
for i,crop in enumerate(crops):
    w,h=round(crop.width*NATIVE_SCALE),round(crop.height*NATIVE_SCALE)
    if w>NATIVE_W or h>BASE:raise RuntimeError(f'pose {i} exceeds runtime cell or baseline')
    pose=crop.resize((w,h),Image.Resampling.NEAREST);ox=i*NATIVE_W+(NATIVE_W-w)//2;oy=BASE-h
    runtime.alpha_composite(pose,(ox,oy))
    native.append({'frame':i,'x':i*NATIVE_W,'y':0,'w':NATIVE_W,'h':NATIVE_H,
      'sourceBoundsLTRB':list(bounds[i][:4]),'sourceComponentPixels':bounds[i][4],
      'sourceToRuntimeScale':NATIVE_SCALE,'scaledSize':[w,h],
      'offsetInCell':[ox-i*NATIVE_W,oy],'baseline':BASE,'bottomMargin':NATIVE_H-BASE})
runtime.save(RUNTIME)
LAYOUT.write_text(json.dumps({'status':'runtime-size proof only; no production acceptance',
 'sourceSheet':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
 'atlas':str(RUNTIME.relative_to(ROOT)),'columns':8,'rows':1,'frameWidth':NATIVE_W,'frameHeight':NATIVE_H,
 'sourceToRuntimeScale':NATIVE_SCALE,'baseline':BASE,'interpolation':'nearest-neighbor','frames':native},indent=2)+'\n')
for theme,bg in [('light',(235,238,244,255)),('dark',(30,25,41,255))]:
    board=Image.new('RGBA',(4*256,2*192),bg)
    for i in range(8):
        p=runtime.crop((i*NATIVE_W,0,(i+1)*NATIVE_W,NATIVE_H)).resize((256,192),Image.Resampling.NEAREST)
        board.alpha_composite(p,((i%4)*256,(i//4)*192))
    board.convert('RGB').save(OUT/f'krios-steal8-attempt01-{theme}-preview.png')
report={'status':'cleanup/layout trial; no production acceptance','source':str(SOURCE.relative_to(ROOT)),
 'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
 'key':{'predicate':'G>=130, G-R>=40, G-B>=40','connectivity':'8-connected canvas-edge matte plus disconnected green islands',
   'keyedPixels':int(mask.sum()),'interiorIslandCount':int(len(inside)),'smallIslandRGBRepairs':len(small),
   'largeIslandsCleared':len(large),'localEdgePixelsCleared':int(edge_spill.sum()),
   'weakInteriorRGBRepairs':int(weak_inside.sum()),'rawPreserved':True,'noRedraw':True},
 'components':{'expected':8,'found':len(components),'componentBoundsAndPixels':[{'boundsLTRB':list(v[:4]),'pixels':v[4]} for v in bounds],
   'componentOrdering':'top-row then bottom-row, sorted left to right','nominalCellOverflowSeparatedByComponents':True},
 'layout':{'sourceGrid':[4,2],'cellSize':[CW,CH],'marginRequirement':MARGIN,'uniformFitScale':logical_scale,
   'logicalSheet':str(LOGICAL.relative_to(ROOT)),'runtimeCandidate':str(RUNTIME.relative_to(ROOT)),
   'runtimeLayout':str(LAYOUT.relative_to(ROOT)),'frames':logical_frames}}
REPORT.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'components':len(components),'logicalMarginsPass':all(f['meets24pxMargins'] for f in logical_frames),
 'logicalScale':logical_scale,'runtimeScale':NATIVE_SCALE,'bounds':bounds,'report':str(REPORT.relative_to(ROOT))},indent=2))
