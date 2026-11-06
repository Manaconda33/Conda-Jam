#!/usr/bin/env python3
"""Review-only green-key cleanup/layout trial for Krios reverse-layup attempt01."""
from __future__ import annotations
import hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/krios-layup-reverse8-attempt01-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/krios-layup-reverse8-attempt01'
POSE_DIR=OUT/'poses'
SHEET=OUT/'krios-layup-reverse8-attempt01-keyed-layout-trial.png'
RUNTIME=OUT/'krios-layup-reverse8-attempt01-runtime-candidate.png'
REPORT=OUT/'cleanup-layout-report.json'
RUNTIME_LAYOUT=OUT/'runtime-layout.json'
# Bounds from independent source review's 8-connected green-matte segmentation.
BOUNDS=[(31,150,319,459),(446,70,683,461),(848,58,1163,376),(1231,28,1523,435),
        (54,534,413,936),(475,498,741,965),(842,599,1136,960),(1179,612,1505,960)]
COLS,ROWS,CW,CH,MARGIN=4,2,384,512,32

raw=Image.open(SOURCE).convert('RGB');rgb=np.asarray(raw,dtype=np.uint8)
r,g,b=(rgb[...,i].astype(np.int16) for i in range(3))
key_like=(g>=130)&((g-r)>=40)&((g-b)>=40)
labels,n=ndimage.label(key_like,structure=np.ones((3,3),dtype=np.uint8))
border=np.unique(np.concatenate((labels[0],labels[-1],labels[:,0],labels[:,-1])))
border=border[border!=0]
connected=np.isin(labels,border)
inside=np.unique(labels[~connected & key_like]);inside=inside[inside!=0]
sizes=np.bincount(labels.ravel(),minlength=n+1)
small=[int(c) for c in inside if sizes[c]<=60]
large=[int(c) for c in inside if sizes[c]>60]
remove=np.isin(labels,large)
mask=connected|remove
edge_zone=ndimage.binary_dilation(connected,structure=np.ones((3,3),bool),iterations=2)
edge_spill=edge_zone&~mask&(g>=70)&((g-r)>=8)&((g-b)>=8)
mask|=edge_spill
alpha=np.where(mask,0,255).astype(np.uint8)
rgb_clean=rgb.copy()
if small:
    near=ndimage.distance_transform_edt(key_like,return_distances=False,return_indices=True)
    sm=np.isin(labels,small)
    rgb_clean[sm]=rgb[near[0][sm],near[1][sm]]
weak=(g>=50)&((g-r)>=4)&((g-b)>=4)
region=np.zeros(weak.shape,bool)
for x0,y0,x1,y1 in BOUNDS: region[y0:y1,x0:x1]=True
weak_inside=weak&region&(alpha>0)
if np.any(weak_inside):
    near=ndimage.distance_transform_edt(weak,return_distances=False,return_indices=True)
    rgb_clean[weak_inside]=rgb[near[0][weak_inside],near[1][weak_inside]]
keyed=Image.fromarray(np.dstack((rgb_clean,alpha)),mode='RGBA')
OUT.mkdir(parents=True,exist_ok=True);POSE_DIR.mkdir(parents=True,exist_ok=True)

maxw=max(x1-x0 for x0,y0,x1,y1 in BOUNDS);maxh=max(y1-y0 for x0,y0,x1,y1 in BOUNDS)
scale=min((CW-2*MARGIN)/maxw,(CH-2*MARGIN)/maxh)
sheet=Image.new('RGBA',(COLS*CW,ROWS*CH),(0,0,0,0));frames=[]
for i,(x0,y0,x1,y1) in enumerate(BOUNDS):
    crop=keyed.crop((x0,y0,x1,y1));w,h=round(crop.width*scale),round(crop.height*scale)
    sprite=crop.resize((w,h),Image.Resampling.NEAREST)
    cx,cy=(i%COLS)*CW,(i//COLS)*CH
    px,py=cx+(CW-w)//2,cy+(CH-h)//2
    sheet.alpha_composite(sprite,(px,py));sprite.save(POSE_DIR/f'pose-{i:02d}-keyed.png')
    box=sheet.crop((cx,cy,cx+CW,cy+CH)).getchannel('A').getbbox()
    margins=[box[0],box[1],CW-box[2],CH-box[3]]
    frames.append({'frame':i,'sourceBoundsLTRB':[x0,y0,x1,y1],'sourceSize':[x1-x0,y1-y0],
        'uniformScale':scale,'scaledSize':[w,h],'offsetInSheet':[px,py],'outputBoundsInCellLTRB':list(box),
        'marginsLTRB':margins,'minimumMarginPx':min(margins),'meets32pxMargins':min(margins)>=MARGIN,
        'poseSha256':hashlib.sha256((POSE_DIR/f'pose-{i:02d}-keyed.png').read_bytes()).hexdigest()})
sheet.save(SHEET)

NATIVE_W,NATIVE_H,NATIVE_SCALE,BASE=128,96,.195,94
runtime=Image.new('RGBA',(len(BOUNDS)*NATIVE_W,NATIVE_H),(0,0,0,0));native_frames=[]
for i in range(len(BOUNDS)):
    pose=Image.open(POSE_DIR/f'pose-{i:02d}-keyed.png').convert('RGBA');box=pose.getchannel('A').getbbox();crop=pose.crop(box)
    w,h=round(crop.width*NATIVE_SCALE/scale),round(crop.height*NATIVE_SCALE/scale)
    # pose was uniformly scaled by source `scale`; source-to-runtime scale is fixed .195.
    w,h=round((box[2]-box[0])/scale*NATIVE_SCALE),round((box[3]-box[1])/scale*NATIVE_SCALE)
    sprite=crop.resize((w,h),Image.Resampling.NEAREST);ox=i*NATIVE_W+(NATIVE_W-w)//2;oy=BASE-h
    runtime.alpha_composite(sprite,(ox,oy))
    native_frames.append({'frame':i,'x':i*NATIVE_W,'y':0,'w':NATIVE_W,'h':NATIVE_H,'sourceCropLTRB':list(box),
        'sourceCropSize':[round((box[2]-box[0])/scale),round((box[3]-box[1])/scale)],
        'sourceToRuntimeScale':NATIVE_SCALE,'scaledSize':[w,h],'offsetInCell':[ox-i*NATIVE_W,oy],
        'baseline':BASE,'bottomMargin':NATIVE_H-BASE})
runtime.save(RUNTIME)
RUNTIME_LAYOUT.write_text(json.dumps({'status':'runtime-size proof for ball-track calibration only; not accepted or registered',
    'sourceSheet':str(SHEET.relative_to(ROOT)),'atlas':str(RUNTIME.relative_to(ROOT)),'columns':8,'rows':1,
    'frameWidth':NATIVE_W,'frameHeight':NATIVE_H,'sourceToRuntimeScale':NATIVE_SCALE,'baseline':BASE,
    'interpolation':'nearest-neighbor','frames':native_frames},indent=2)+'\n')
report={'status':'cleanup and layout trial only; no production registration','source':str(SOURCE.relative_to(ROOT)),
    'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'key':{'predicate':'G>=130, G-R>=40, G-B>=40',
    'connectivity':'canvas-edge-connected green key plus disconnected green islands','keyedPixels':int(mask.sum()),
    'interiorIslandCount':int(len(inside)),'smallIslandRGBRepairs':len(small),'largeIslandsCleared':len(large),
    'localEdgePixelsCleared':int(edge_spill.sum()),'weakInteriorRGBRepairs':int(weak_inside.sum()),
    'rawPreserved':True,'noRedraw':True},
    'layout':{'sourceGrid':[4,2],'cellSize':[CW,CH],'marginRequirement':MARGIN,'uniformFitScale':scale,
    'sheet':str(SHEET.relative_to(ROOT)),'runtimeCandidate':str(RUNTIME.relative_to(ROOT)),
    'runtimeLayout':str(RUNTIME_LAYOUT.relative_to(ROOT)),'frames':frames}}
REPORT.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'keyedPixels':int(mask.sum()),'scale':scale,'allMarginsPass':all(f['meets32pxMargins'] for f in frames),'runtimeScale':NATIVE_SCALE,'report':str(REPORT.relative_to(ROOT))},indent=2))
