#!/usr/bin/env python3
"""Isolate and baseline ten accepted Leo jump-shot poses in a 5x2 transparent sheet."""
from __future__ import annotations
import hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, find_objects, label

ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/j104-leo-shoot-generated-raw.png'
OUTPUT=ROOT/'tools/generate-art/sources/j104-leo-shoot10.png'
LAYOUT=ROOT/'tools/generate-art/j104-leo-shoot-cleanup-layout.json'

def sha(p:Path)->str:return hashlib.sha256(p.read_bytes()).hexdigest()

def main():
    source=Image.open(RAW).convert('RGBA')
    if source.size!=(1536,1024):raise ValueError(f'Expected 1536x1024 transparent RGBA, got {source.size}')
    pixels=np.array(source);alpha=pixels[:,:,3]
    if alpha.min()!=0 or alpha.max()<240:raise ValueError('Source must retain real transparency and solid figure pixels')
    labels,count=label(alpha>=32,structure=np.ones((3,3),dtype=np.uint8))
    areas=np.bincount(labels.ravel())
    components=[i for i,a in enumerate(areas) if i and a>=6000]
    if len(components)!=10:raise ValueError(f'Expected ten complete figures, found {len(components)} major components')
    cw,ch=source.width//5,source.height//2
    cells={}
    for component in components:
        ys,xs=np.where(labels==component)
        row=min(1,int(np.mean(ys)//ch));col=min(4,int(np.mean(xs)//cw))
        if (row,col) in cells:raise ValueError(f'Multiple figures in cell {(row,col)}')
        cells[(row,col)]=component
    expected=[(r,c) for r in range(2) for c in range(5)]
    if list(sorted(cells))!=expected:raise ValueError('All ten 5x2 cells must contain one figure')
    output=Image.new('RGBA',source.size,(0,0,0,0));records=[];removed=0
    for index,cell in enumerate(expected):
        component=cells[cell];mask=labels==component
        keep=binary_dilation(mask,iterations=2)
        ys,xs=np.where(keep);box=(int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1))
        crop=pixels[box[1]:box[3],box[0]:box[2]].copy();local=keep[box[1]:box[3],box[0]:box[2]]
        crop[~local,3]=0
        removed+=int(np.count_nonzero((alpha[box[1]:box[3],box[0]:box[2]]>0)&~local))
        crop=Image.fromarray(crop,'RGBA');row,col=cell
        maxw,maxh=round(cw*.86),round(ch*.88);scale=min(maxw/crop.width,maxh/crop.height,1.0)
        size=(max(1,round(crop.width*scale)),max(1,round(crop.height*scale)))
        crop=crop.resize(size,Image.Resampling.LANCZOS)
        x0=col*cw;y0=row*ch;x=x0+(cw-size[0])//2;y=y0+ch-18-size[1]
        if y<y0+12 or x<x0+12 or x+size[0]>x0+cw-12:raise ValueError(f'Pose {index} violates minimum cell margin')
        output.alpha_composite(crop,(x,y))
        records.append({'sourceIndex':index,'component':int(component),'rawBounds':[box[0],box[1],box[2],box[3]],'destination':[x,y,size[0],size[1]],'uniformScale':scale,'marginsPx':[x-x0,y-y0,x0+cw-x-size[0],y0+ch-y-size[1]]})
    output.save(OUTPUT)
    LAYOUT.write_text(json.dumps({'rawSource':str(RAW.relative_to(ROOT)),'rawSha256':sha(RAW),'cleanedSource':str(OUTPUT.relative_to(ROOT)),'cleanedSourceSha256':sha(OUTPUT),'method':'retain ten large alpha-connected bodies; keep only a two-pixel antialias dilation; remove disconnected haze/specks; uniformly scale and center each complete pose in its own 5x2 cell with aligned 18px foot baseline','removedNonBodyAlphaPixels':removed,'minimumCellMarginPx':min(min(r['marginsPx']) for r in records),'frames':records},indent=2)+'\n')
    print(json.dumps({'frames':len(records),'removedNonBodyAlphaPixels':removed,'minimumCellMarginPx':min(min(r['marginsPx']) for r in records),'cleanedSha256':sha(OUTPUT)}))
if __name__=='__main__':main()
