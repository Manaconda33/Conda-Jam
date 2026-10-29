#!/usr/bin/env python3
"""Documented green-key/layout trial for J.128 Krios block attempt01.

The immutable RGB generation is preserved. This script removes connected green matte,
repairs only isolated green islands/edge spill, isolates the four reviewed components,
uses a single nearest-neighbor fit scale, and writes native-size previews. It does not
redraw or synthesize poses.
"""
from __future__ import annotations
import hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/krios-block4-attempt01-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/krios-block4-attempt01'
POSES=OUT/'poses';LOGICAL=OUT/'krios-block4-attempt01-logical-layout.png';RUNTIME=OUT/'krios-block4-attempt01-runtime-candidate.png'
LAYOUT=OUT/'runtime-layout.json';REPORT=OUT/'cleanup-layout-report.json'
# Bounds from 8-connected foreground components after independently reviewed green-key segmentation.
BOUNDS=[(228,176,574,484),(902,9,1294,484),(227,492,660,949),(901,672,1270,992)]
CW,CH,COLS,ROWS,MARGIN=384,512,2,2,24
NATIVE_W,NATIVE_H,NATIVE_SCALE,BASE=128,96,.16,94
raw=Image.open(SOURCE).convert('RGB');rgb=np.asarray(raw,dtype=np.uint8)
r,g,b=(rgb[...,i].astype(np.int16) for i in range(3))
key_like=(g>=130)&((g-r)>=40)&((g-b)>=40)
labels,n=ndimage.label(key_like,structure=np.ones((3,3),dtype=np.uint8))
border=np.unique(np.concatenate((labels[0],labels[-1],labels[:,0],labels[:,-1])));border=border[border!=0]
connected=np.isin(labels,border)
inside=np.unique(labels[~connected & key_like]);inside=inside[inside!=0]
sizes=np.bincount(labels.ravel(),minlength=n+1);small=[int(c) for c in inside if sizes[c]<=60];large=[int(c) for c in inside if sizes[c]>60]
remove=np.isin(labels,large);mask=connected|remove
edge_zone=ndimage.binary_dilation(connected,structure=np.ones((3,3),bool),iterations=2)
edge_spill=edge_zone&~mask&(g>=70)&((g-r)>=8)&((g-b)>=8);mask|=edge_spill
alpha=np.where(mask,0,255).astype(np.uint8);rgb_clean=rgb.copy()
if small:
    nearest=ndimage.distance_transform_edt(key_like,return_distances=False,return_indices=True);sm=np.isin(labels,small)
    rgb_clean[sm]=rgb[nearest[0][sm],nearest[1][sm]]
weak=(g>=50)&((g-r)>=4)&((g-b)>=4);region=np.zeros(weak.shape,bool)
for x0,y0,x1,y1 in BOUNDS:region[y0:y1,x0:x1]=True
weak_inside=weak&region&(alpha>0)
if np.any(weak_inside):
    near=ndimage.distance_transform_edt(weak,return_distances=False,return_indices=True)
    rgb_clean[weak_inside]=rgb[near[0][weak_inside],near[1][weak_inside]]
keyed=Image.fromarray(np.dstack((rgb_clean,alpha)),mode='RGBA')
OUT.mkdir(parents=True,exist_ok=True);POSES.mkdir(parents=True,exist_ok=True)
maxw=max(x1-x0 for x0,y0,x1,y1 in BOUNDS);maxh=max(y1-y0 for x0,y0,x1,y1 in BOUNDS)
scale=min((CW-2*MARGIN)/maxw,(CH-2*MARGIN)/maxh)
logical=Image.new('RGBA',(CW*COLS,CH*ROWS),(0,0,0,0));frames=[];cropped=[]
for i,(x0,y0,x1,y1) in enumerate(BOUNDS):
    crop=keyed.crop((x0,y0,x1,y1));w,h=round(crop.width*scale),round(crop.height*scale)
    pose=crop.resize((w,h),Image.Resampling.NEAREST);cx,cy=(i%COLS)*CW,(i//COLS)*CH
    ox=cx+(CW-w)//2;oy=cy+CH-MARGIN-h;logical.alpha_composite(pose,(ox,oy))
    pose.save(POSES/f'pose-{i:02d}-keyed.png');cropped.append(crop)
    cell=logical.crop((cx,cy,cx+CW,cy+CH)).getchannel('A');bb=cell.getbbox();margins=[bb[0],bb[1],CW-bb[2],CH-bb[3]]
    frames.append({'frame':i,'sourceBoundsLTRB':[x0,y0,x1,y1],'sourceSize':[x1-x0,y1-y0],'uniformFitScale':scale,
      'scaledSize':[w,h],'outputMarginsLTRB':margins,'minimumMarginPx':min(margins),'meets24pxMargins':min(margins)>=MARGIN,
      'poseSha256':hashlib.sha256((POSES/f'pose-{i:02d}-keyed.png').read_bytes()).hexdigest()})
logical.save(LOGICAL)
runtime=Image.new('RGBA',(4*NATIVE_W,NATIVE_H),(0,0,0,0));native=[]
for i,crop in enumerate(cropped):
    w,h=round(crop.width*NATIVE_SCALE),round(crop.height*NATIVE_SCALE);pose=crop.resize((w,h),Image.Resampling.NEAREST)
    ox=i*NATIVE_W+(NATIVE_W-w)//2;oy=BASE-h;runtime.alpha_composite(pose,(ox,oy))
    native.append({'frame':i,'x':i*NATIVE_W,'y':0,'w':NATIVE_W,'h':NATIVE_H,'sourceBoundsLTRB':list(BOUNDS[i]),
      'sourceToRuntimeScale':NATIVE_SCALE,'scaledSize':[w,h],'offsetInCell':[ox-i*NATIVE_W,oy],'baseline':BASE,'bottomMargin':NATIVE_H-BASE})
runtime.save(RUNTIME)
LAYOUT.write_text(json.dumps({'status':'runtime-size proof; not accepted or registered','sourceSheet':str(SOURCE.relative_to(ROOT)),
 'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'atlas':str(RUNTIME.relative_to(ROOT)),'columns':4,'rows':1,
 'frameWidth':NATIVE_W,'frameHeight':NATIVE_H,'sourceToRuntimeScale':NATIVE_SCALE,'baseline':BASE,'interpolation':'nearest-neighbor','frames':native},indent=2)+'\n')
# Separate light/dark enlarged proofs make edge spill and silhouette review easier.
for theme,bg in [('light',(235,238,244,255)),('dark',(30,25,41,255))]:
    board=Image.new('RGBA',(4*192,192),bg)
    for i in range(4):
        p=runtime.crop((i*NATIVE_W,0,(i+1)*NATIVE_W,NATIVE_H)).resize((192,144),Image.Resampling.NEAREST)
        board.alpha_composite(p,(i*192,24))
    board.convert('RGB').save(OUT/f'krios-block4-attempt01-{theme}-preview.png')
report={'status':'cleanup/layout trial only; no production acceptance','source':str(SOURCE.relative_to(ROOT)),
 'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'key':{'predicate':'G>=130, G-R>=40, G-B>=40',
 'connectivity':'8-connected canvas-edge matte plus disconnected green islands','keyedPixels':int(mask.sum()),
 'interiorIslandCount':int(len(inside)),'smallIslandRGBRepairs':len(small),'largeIslandsCleared':len(large),
 'localEdgePixelsCleared':int(edge_spill.sum()),'weakInteriorRGBRepairs':int(weak_inside.sum()),'rawPreserved':True,'noRedraw':True},
 'layout':{'sourceGrid':[2,2],'cellSize':[CW,CH],'marginRequirement':MARGIN,'uniformFitScale':scale,'logicalSheet':str(LOGICAL.relative_to(ROOT)),
 'runtimeCandidate':str(RUNTIME.relative_to(ROOT)),'runtimeLayout':str(LAYOUT.relative_to(ROOT)),'frames':frames}}
REPORT.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'keyedPixels':int(mask.sum()),'uniformFitScale':scale,'marginsPass':all(f['meets24pxMargins'] for f in frames),
 'runtimeScale':NATIVE_SCALE,'report':str(REPORT.relative_to(ROOT))},indent=2))
