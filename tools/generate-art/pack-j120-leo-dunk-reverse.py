#!/usr/bin/env python3
"""Pack the fifteen isolated J120 figure components without inventing poses."""
from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
from scipy.ndimage import label,find_objects
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/j120-leo-dunk-reverse-attempt02-cleaned.png'
ATLAS=ROOT/'public/assets/animation/leo-dunk-reverse-right.webp'
LAYOUT=ROOT/'tools/generate-art/j120-leo-dunk-reverse15-layout.json'
source=Image.open(SOURCE).convert('RGBA');pixels=np.asarray(source);mask=pixels[:,:,3]>0
labels,count=label(mask,structure=np.ones((3,3),dtype=np.uint8));sizes=np.bincount(labels.ravel());boxes=find_objects(labels)
figures=[]
for i in range(1,count+1):
 if sizes[i]>5000:
  box=boxes[i-1];x0,x1=box[1].start,box[1].stop;y0,y1=box[0].start,box[0].stop
  figures.append({'label':i,'area':int(sizes[i]),'bbox':[x0,y0,x1,y1],'cx':(x0+x1)/2,'cy':(y0+y1)/2})
assert len(figures)==15,(len(figures),[(f['label'],f['area']) for f in figures])
# Cluster the three visually aligned rows by silhouette center, then order each row left-to-right.
ys=sorted(f['cy'] for f in figures);cuts=[(ys[4]+ys[5])/2,(ys[9]+ys[10])/2]
for f in figures:f['row']=0 if f['cy']<cuts[0] else 1 if f['cy']<cuts[1] else 2
figures.sort(key=lambda f:(f['row'],f['cx']))
assert [sum(f['row']==r for f in figures) for r in range(3)]==[5,5,5]
cellw,cellh,cols,rows,baseline=128,96,4,4,94
max_height=max(f['bbox'][3]-f['bbox'][1] for f in figures);scale=90/max_height
atlas=Image.new('RGBA',(cellw*cols,cellh*rows),(0,0,0,0));frame_data=[]
for idx,f in enumerate(figures):
 x0,y0,x1,y1=f['bbox'];sprite=source.crop((x0,y0,x1,y1));w=max(1,round(sprite.width*scale));h=max(1,round(sprite.height*scale));sprite=sprite.resize((w,h),Image.Resampling.LANCZOS)
 col,row=idx%cols,idx//cols;dstx=col*cellw+(cellw-w)//2;dsty=row*cellh+baseline-h
 atlas.alpha_composite(sprite,(dstx,dsty))
 frame_data.append({'x':col*cellw,'y':row*cellh,'w':cellw,'h':cellh,'sourceIndex':idx,'sourceComponent':f['label'],'sourceRect':{'x':x0,'y':y0,'w':x1-x0,'h':y1-y0},'destinationRect':{'x':dstx,'y':dsty,'w':w,'h':h},'baselineY':baseline,'sha256':hashlib.sha256(atlas.crop((col*cellw,row*cellh,(col+1)*cellw,(row+1)*cellh)).tobytes()).hexdigest()})
atlas.save(ATLAS,format='WEBP',lossless=True,quality=100,method=6)
source_hash=hashlib.sha256(SOURCE.read_bytes()).hexdigest();atlas_hash=hashlib.sha256(ATLAS.read_bytes()).hexdigest()
layout={'athlete':'leo','clip':'dunk-reverse','direction':'right','src':'./public/assets/animation/leo-dunk-reverse-right.webp','columns':cols,'rows':rows,'frames':[{k:v for k,v in fd.items() if k in ('x','y','w','h')} for fd in frame_data],'sourceImage':str(SOURCE.relative_to(ROOT)),'sourceSha256':source_hash,'rawSourceImage':'tools/generate-art/sources/j120-leo-dunk-reverse-attempt02-generated-raw.png','rawSourceSha256':hashlib.sha256((ROOT/'tools/generate-art/sources/j120-leo-dunk-reverse-attempt02-generated-raw.png').read_bytes()).hexdigest(),'provenance':{'prompt':'tools/generate-art/j120-leo-dunk-reverse15-prompt.md','editPrompt':'tools/generate-art/j120-leo-dunk-reverse15-edit-prompt.md','generatedAt':'2026-10-27','generationId':'c2pa:72f55ae0-737d-4d3a-b5b7-dc0c3971ce5b','rawSourceImage':'tools/generate-art/sources/j120-leo-dunk-reverse-attempt02-generated-raw.png','sourceImage':str(SOURCE.relative_to(ROOT)),'sourceSha256':source_hash,'atlasPath':str(ATLAS.relative_to(ROOT)),'atlasSha256':atlas_hash,'sourceRects':[fd['sourceRect'] for fd in frame_data],'destinationRects':[fd['destinationRect'] for fd in frame_data],'baselineY':baseline,'uniformScale':scale,'cleanupScript':'tools/generate-art/clean-j120-leo-dunk-reverse.py','packingScript':'tools/generate-art/pack-j120-leo-dunk-reverse.py','rejectedGenerations':['c2pa:ab343ffc-fbb0-4151-afee-642ffc74839e']},'frames':frame_data,'sourceComponentCount':count,'isolatedFigureCount':len(figures),'blankCell':15}
LAYOUT.write_text(json.dumps(layout,indent=2)+'\n')
for name,bg in [('light',(245,242,233,255)),('dark',(24,26,36,255))]:
 proof=Image.new('RGBA',(atlas.width*2,atlas.height*2),bg);proof.alpha_composite(atlas.resize((atlas.width*2,atlas.height*2),Image.Resampling.NEAREST));proof.convert('RGB').save(ROOT/f'tools/generate-art/previews/j120-leo-dunk-reverse-atlas-{name}.png')
print(json.dumps({'atlas':str(ATLAS.relative_to(ROOT)),'sha256':atlas_hash,'dimensions':atlas.size,'frames':len(frame_data),'sourceComponents':count,'scale':scale,'bboxRows':[[f['bbox'] for f in figures if f['row']==r] for r in range(3)]}))
