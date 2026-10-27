#!/usr/bin/env python3
"""Pack the fifteen reviewed J121 Leo poses without inventing or redrawing art."""
from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
from scipy.ndimage import label,find_objects

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/j121-leo-dunk-360-attempt05-generated-raw.png'
ATLAS=ROOT/'public/assets/animation/leo-dunk-360-right.webp'
LAYOUT=ROOT/'tools/generate-art/j121-leo-dunk-36015-layout.json'
source=Image.open(SOURCE).convert('RGBA');pixels=np.asarray(source);mask=pixels[:,:,3]>12
labels,count=label(mask,structure=np.ones((3,3),dtype=np.uint8));sizes=np.bincount(labels.ravel());boxes=find_objects(labels)
figures=[]
for i in range(1,count+1):
    if sizes[i]>5000:
        box=boxes[i-1];x0,x1=box[1].start,box[1].stop;y0,y1=box[0].start,box[0].stop
        figures.append({'component':i,'area':int(sizes[i]),'bbox':[x0,y0,x1,y1],'cx':(x0+x1)/2,'cy':(y0+y1)/2})
assert len(figures)==15, f'expected 15 complete pose components, found {len(figures)}'
ys=sorted(f['cy'] for f in figures);cuts=[(ys[4]+ys[5])/2,(ys[9]+ys[10])/2]
for f in figures:f['row']=0 if f['cy']<cuts[0] else 1 if f['cy']<cuts[1] else 2
figures.sort(key=lambda f:(f['row'],f['cx']))
assert [sum(f['row']==r for f in figures) for r in range(3)]==[5,5,5]
cellw,cellh,cols,rows,baseline=128,96,4,4,94
scale=min(90/max(f['bbox'][3]-f['bbox'][1] for f in figures),60/max(f['bbox'][2]-f['bbox'][0] for f in figures))
atlas=Image.new('RGBA',(cellw*cols,cellh*rows),(0,0,0,0));frame_data=[]
for idx,f in enumerate(figures):
    x0,y0,x1,y1=f['bbox'];sprite=source.crop((x0,y0,x1,y1));w=max(1,round(sprite.width*scale));h=max(1,round(sprite.height*scale));sprite=sprite.resize((w,h),Image.Resampling.LANCZOS)
    col,row=idx%cols,idx//cols;dstx=col*cellw+(cellw-w)//2;dsty=row*cellh+baseline-h
    atlas.alpha_composite(sprite,(dstx,dsty))
    cell=atlas.crop((col*cellw,row*cellh,(col+1)*cellw,(row+1)*cellh))
    frame_data.append({'x':col*cellw,'y':row*cellh,'w':cellw,'h':cellh,'sourceIndex':idx,'sourceComponent':f['component'],'sourceRect':{'x':x0,'y':y0,'w':x1-x0,'h':y1-y0},'destinationRect':{'x':dstx,'y':dsty,'w':w,'h':h},'baselineY':baseline,'sha256':hashlib.sha256(cell.tobytes()).hexdigest()})
atlas.save(ATLAS,format='WEBP',lossless=True,quality=100,method=6)
source_hash=hashlib.sha256(SOURCE.read_bytes()).hexdigest();atlas_hash=hashlib.sha256(ATLAS.read_bytes()).hexdigest()
raw=Image.open(SOURCE).convert('RGBA');alpha=np.asarray(raw)[:,:,3]
layout={'athlete':'leo','clip':'dunk-360','direction':'right','src':'./public/assets/animation/leo-dunk-360-right.webp','columns':cols,'rows':rows,'frames':[{k:v for k,v in fd.items() if k in ('x','y','w','h')} for fd in frame_data],'sourceImage':str(SOURCE.relative_to(ROOT)),'sourceSha256':source_hash,'rawSourceSha256':source_hash,'generationId':'c2pa:44bd39ea-9031-45f9-bfba-09421e14ba11','provenance':{'prompt':'tools/generate-art/j121-leo-dunk-36015-prompt.md','editPrompt':'tools/generate-art/j121-leo-dunk-360-pose-correction-prompt.md','releaseCorrectionPrompt':'tools/generate-art/j121-leo-dunk-360-release-correction2-prompt.md','generatedAt':'2026-10-27','generationId':'c2pa:44bd39ea-9031-45f9-bfba-09421e14ba11','rawSourceImage':str(SOURCE.relative_to(ROOT)),'sourceImage':str(SOURCE.relative_to(ROOT)),'sourceSha256':source_hash,'atlasPath':str(ATLAS.relative_to(ROOT)),'atlasSha256':atlas_hash,'sourceRects':[fd['sourceRect'] for fd in frame_data],'destinationRects':[fd['destinationRect'] for fd in frame_data],'baselineY':baseline,'uniformScale':scale,'packingScript':'tools/generate-art/pack-j121-leo-dunk-360.py','preservedAlternateGenerations':['tools/generate-art/sources/j121-leo-dunk-360-attempt01-generated-raw.png','tools/generate-art/sources/j121-leo-dunk-360-attempt02-generated-raw.png','tools/generate-art/sources/j121-leo-dunk-360-attempt03-generated-raw.png']},'frames':frame_data,'sourceComponentCount':count,'isolatedFigureCount':len(figures),'blankCell':15,'rawAlpha':{'zeroPixelCount':int(np.sum(alpha==0)),'nonzeroPixelCount':int(np.sum(alpha>0)),'semiTransparentPixelCount':int(np.sum((alpha>0)&(alpha<255)))}}
LAYOUT.write_text(json.dumps(layout,indent=2)+'\n')
for name,bg in [('light',(245,242,233,255)),('dark',(24,26,36,255))]:
    proof=Image.new('RGBA',(atlas.width*2,atlas.height*2),bg);proof.alpha_composite(atlas.resize((atlas.width*2,atlas.height*2),Image.Resampling.NEAREST));proof.convert('RGB').save(ROOT/f'tools/generate-art/previews/j121-leo-dunk-360-atlas-{name}.png')
print(json.dumps({'atlas':str(ATLAS.relative_to(ROOT)),'sha256':atlas_hash,'dimensions':atlas.size,'frames':len(frame_data),'components':count,'scale':scale,'alpha':layout['rawAlpha'],'sourceRects':[fd['sourceRect'] for fd in frame_data]}))
