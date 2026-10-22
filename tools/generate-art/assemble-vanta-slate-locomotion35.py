#!/usr/bin/env python3
"""Assemble Vanta's 35-pose source from a 34-pose sheet and one generated dribble pose."""
from __future__ import annotations
import hashlib, importlib.util, json
from datetime import datetime, timezone
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, find_objects, label

ROOT=Path(__file__).resolve().parents[2]
raw=ROOT/'tools/generate-art/sources/vanta-slate-locomotion35-raw.png'
dribble_raw=ROOT/'tools/generate-art/sources/vanta-slate-dribble7-raw.png'
out=ROOT/'tools/generate-art/sources/vanta-slate-locomotion35.png'
meta_path=ROOT/'tools/generate-art/vanta-slate-locomotion35-assembly.json'
base=Image.open(raw).convert('RGBA'); pixels=np.asarray(base); alpha=pixels[:,:,3]
labels,_=label(alpha>64); minimum=base.width*base.height/35*.025
figures=[]
for comp,slices in enumerate(find_objects(labels),start=1):
    if slices is None:continue
    area=int((labels[slices]==comp).sum())
    if area<minimum:continue
    y,x=slices[0].start,slices[1].start;h,w=slices[0].stop-y,slices[1].stop-x
    if min(x,y)<2 or x+w>base.width-2 or y+h>base.height-2:raise ValueError('Raw figure touches canvas edge')
    if y<30:cat='idle'
    elif 240<=y<300:cat='ready'
    elif 430<=y<480:cat='dribble'
    elif 600<=y<660:cat='run'
    elif 840<=y<900:cat='dribble-run'
    else:raise ValueError(f'Unexpected source component at {(x,y,w,h)}')
    figures.append({'component':comp,'x':x,'y':y,'w':w,'h':h,'area':area,'category':cat})
expected={'idle':6,'ready':4,'dribble':9,'run':8,'dribble-run':7}
if len(figures)!=34 or {k:sum(f['category']==k for f in figures) for k in expected}!=expected:
    raise ValueError(f'Expected34 source poses with categories {expected}, found {len(figures)}')
by={k:sorted((f for f in figures if f['category']==k),key=lambda f:f['x']) for k in expected}
# The first low-dribble component is two figures touching; discard that merged crop rather than separate invented pixels.
merged=[f for f in by['dribble'] if f['w']>250]
if len(merged)!=1:raise ValueError(f'Expected one touching dribble pair, found {len(merged)}')
valid_dribbles=[f for f in by['dribble'] if f not in merged]
if len(valid_dribbles)!=8:raise ValueError('Expected eight individually separated low-dribble source figures')
spec=importlib.util.spec_from_file_location('motion',ROOT/'tools/generate-art/package-motion42.py');motion=importlib.util.module_from_spec(spec);spec.loader.exec_module(motion)
strip_rects=motion.inspect_source(dribble_raw,count=7,columns=7,isolate=True)
strip_crops=motion.isolated_crops(dribble_raw,strip_rects)
base_height=int(round(float(np.median([f['h'] for f in valid_dribbles]))))
extras=[]
for i in range(2):
    crop=strip_crops[i];scale=base_height/crop.height
    extras.append({'crop':crop.resize((max(1,round(crop.width*scale)),base_height),Image.Resampling.LANCZOS),'sourceIndex':i,'scale':scale})
# Isolate the33 clean base figures and their antialias fringe; every >64-alpha pixel must belong to a retained body.
clean_base=by['idle']+by['ready']+valid_dribbles+by['run']+by['dribble-run']
selected_ids=[f['component'] for f in clean_base]
primary=np.where(np.isin(labels,selected_ids),labels,0)
nearest=distance_transform_edt(primary==0,return_distances=False,return_indices=True)
owners=primary[tuple(nearest)]
selected_pixel=np.isin(labels,selected_ids)
soft=(alpha>0)&(alpha<=64)&(owners!=0)
clean=pixels.copy();clean[~(selected_pixel|soft)]=0
clean_image=Image.fromarray(clean)
base_dribbles=[{'type':'base','figure':f} for f in valid_dribbles]
supplement_dribbles=[{'type':'supplement','crop':x['crop'],'sourceIndex':x['sourceIndex'],'scale':x['scale']} for x in extras]
dribbles=base_dribbles[:4]+supplement_dribbles+base_dribbles[4:]
rows=[by['idle']+by['ready'][:1],by['ready'][1:]+dribbles[:4],dribbles[4:]+by['run'][:1],by['run'][1:],by['dribble-run']]
if [len(r) for r in rows]!=[7]*5:raise AssertionError('35 source rows must each contain seven bodies')
cell_w,cell_h,baseline=320,270,250
canvas=Image.new('RGBA',(cell_w*7,cell_h*5),(0,0,0,0));placements=[]
for row_index,row in enumerate(rows):
    for col_index,item in enumerate(row):
        if isinstance(item,dict) and item.get('type')=='supplement':
            body=item['crop'];category='dribble';origin={'path':str(dribble_raw.relative_to(ROOT)),'sourceIndex':item['sourceIndex'],'componentRect':{k:strip_rects[item['sourceIndex']][k] for k in ('x','y','w','h')},'uniformScale':item['scale']}
        else:
            f=item.get('figure',item)
            x,y,w,h,comp=(f[k] for k in ('x','y','w','h','component'))
            crop=np.array(clean_image.crop((x,y,x+w,y+h)));crop[owners[y:y+h,x:x+w]!=comp]=0
            body=Image.fromarray(crop);category=f['category'];origin={'path':str(raw.relative_to(ROOT)),'component':comp,'sourceRect':{k:f[k] for k in ('x','y','w','h')}}
        w,h=body.size;dx=col_index*cell_w+(cell_w-w)//2;dy=row_index*cell_h+baseline-h
        if dx<col_index*cell_w or dx+w>(col_index+1)*cell_w or dy<row_index*cell_h+2 or dy+h>row_index*cell_h+baseline:raise ValueError(f'Full body does not fit source cell: category={category} size={w}x{h} at {dx},{dy} cell={cell_w}x{cell_h}')
        canvas.alpha_composite(body,(dx,dy));placements.append({'category':category,**origin,'row':row_index+1,'column':col_index+1,'atlasRect':{'x':dx,'y':dy,'w':w,'h':h}})
canvas.save(out)
rects=motion.inspect_source(out,count=35,columns=7)
if len(rects)!=35:raise AssertionError('Accepted base source failed exact35-body audit')
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
meta={'athlete':'vanta-slate','canonicalSection':'J.11','generatedAt':datetime.now(timezone.utc).isoformat(timespec='seconds').replace('+00:00','Z'),
      'rawBaseSource':str(raw.relative_to(ROOT)),'rawBaseSha256':sha(raw),'rawBaseConnectedComponentCount':34,'rawBaseAuthoredBodyCount':35,
      'dribbleSupplementSource':str(dribble_raw.relative_to(ROOT)),'dribbleSupplementSha256':sha(dribble_raw),'dribbleSupplementFullBodyCount':7,
      'acceptedSource':str(out.relative_to(ROOT)),'acceptedSourceSha256':sha(out),'acceptedBodyCount':35,
      'assembly':'The raw base sheet contained six idle, four ball-ready, nine connected dribble components, eight run and seven dribble-run figures. One connected component visibly merged two adjacent dribble poses and was wholly excluded. Eight clean raw dribble figures plus two separately generated dribble drawings, uniformly scaled to the median dribble height, form ten distinct dribble frames. Exact35 bodies are arranged into a transparent 7x5 source; no image is synthesized, held, or duplicated.',
      'rejectedComponents':[{'source':str(raw.relative_to(ROOT)),'component':merged[0]['component'],'sourceRect':{k:merged[0][k] for k in ('x','y','w','h')},'reason':'Two low-dribble drawings touch and form a single alpha-connected crop; the ambiguous merged crop is excluded from production.'}],
      'excludedGeneratedFrames':[{'source':str(dribble_raw.relative_to(ROOT)),'frames':[2,3,4,5,6],'reason':'Five additional valid distinct dribble drawings remain documented in the raw supplement and are not needed for this batch.'}],
      'rejectedAttempts':[{'source':'tools/generate-art/sources/vanta-slate-dribble-run7-rejected-tattoo-raw.png','reason':'Rejected for conspicuous purple arm tattoos that do not appear in the canon reference; retained as provenance only.'}],
      'poseIndices':[0,1,2,3,4,5,None,None,None,None,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,31,32,33,34,35,36,37],
      'placements':placements}
meta_path.write_text(json.dumps(meta,indent=2)+'\n')
print(json.dumps({'source':str(out),'sha256':sha(out),'bodyCount':len(rects),'componentsFromBase':len(figures),'supplementScales':[x['scale'] for x in extras],'metadata':str(meta_path)}))
