#!/usr/bin/env python3
"""Pack fifteen independently generated, reviewed Keeg reverse-lob poses.

This only alpha-crops, nearest-neighbor scales, and packs approved source poses.
It never draws, duplicates, mirrors, or interpolates a pose.
"""
from pathlib import Path
from datetime import datetime, timezone
import hashlib,json
from PIL import Image

ROOT=Path(__file__).resolve().parents[2]
PROV=ROOT/'tools/generate-art/j107-keeg-alley-oop-reverse-provenance.json'
LAYOUT=ROOT/'tools/generate-art/j107-keeg-alley-oop-reverse-layout.json'
PNG=ROOT/'tools/generate-art/sources/j107-keeg-alley-oop-reverse-atlas.png'
WEBP=ROOT/'public/assets/animation/keeg-alley-oop-reverse-right.webp'
CELL_W,CELL_H,COLS,ROWS=128,96,5,3
MAX_W,MAX_H=76,86
provenance=json.loads(PROV.read_text())
poses=sorted(provenance['poses'],key=lambda item:item['index'])
# The manifest prompt field is the exact pose00 prompt; each pose/edit's exact
# text remains in its linked prompt markdown files in sourceRecords.
first_prompt=ROOT/poses[0]['promptFile']
prompt_doc=first_prompt.read_text()
marker='Verbatim prompt:\n\n> '
if marker not in prompt_doc:
    raise ValueError('Could not find exact pose00 prompt in its prompt record')
provenance['prompt']=prompt_doc.split(marker,1)[1].split('\n\n',1)[0]
provenance['promptVerbatim']=True
provenance['sourcePromptStatus']='verbatim pose00 prompt; exact per-pose source/edit prompts are linked in sourceRecords'
provenance['promptScope']='Pose00 attempt04 only. Every accepted pose links all exact generation/edit prompt files.'
if [p['index'] for p in poses] != list(range(15)):
    raise ValueError('Expected fifteen accepted poses in row-major sequence')
atlas=Image.new('RGBA',(CELL_W*COLS,CELL_H*ROWS),(0,0,0,0))
frames=[];records=[];cell_hashes=[]
for p in poses:
    source=ROOT/p['source']; raw=ROOT/p['rawSource']
    if hashlib.sha256(source.read_bytes()).hexdigest()!=p['sourceSha256']:
        raise ValueError(f"Source hash mismatch pose{p['index']:02d}")
    if hashlib.sha256(raw.read_bytes()).hexdigest()!=p['rawSourceSha256']:
        raise ValueError(f"Raw source hash mismatch pose{p['index']:02d}")
    image=Image.open(source).convert('RGBA')
    mask=image.getchannel('A').point(lambda v:255 if v>16 else 0)
    bounds=mask.getbbox()
    if list(bounds)!=p['alphaBoundsThreshold16']:
        raise ValueError(f"Alpha bounds changed pose{p['index']:02d}")
    if any(image.getpixel(q)[3]!=0 for q in [(0,0),(image.width-1,0),(0,image.height-1),(image.width-1,image.height-1)]):
        raise ValueError(f"Transparent-corner check failed pose{p['index']:02d}")
    crop=image.crop(bounds)
    scale=min(MAX_W/crop.width,MAX_H/crop.height)
    fw=max(1,round(crop.width*scale));fh=max(1,round(crop.height*scale))
    if fw>MAX_W or fh>MAX_H:raise ValueError(f"Cell clearance failed pose{p['index']:02d}: {fw}x{fh}")
    figure=crop.resize((fw,fh),Image.Resampling.NEAREST)
    cell=Image.new('RGBA',(CELL_W,CELL_H),(0,0,0,0))
    ox=(CELL_W-fw)//2;oy=(CELL_H-fh)//2
    cell.alpha_composite(figure,(ox,oy))
    cell_hash=hashlib.sha256(cell.tobytes()).hexdigest()
    if cell_hash in cell_hashes:raise ValueError(f"Duplicate packed drawing pose{p['index']:02d}")
    cell_hashes.append(cell_hash)
    x=(p['index']%COLS)*CELL_W;y=(p['index']//COLS)*CELL_H
    atlas.alpha_composite(cell,(x,y))
    frames.append({'x':x,'y':y,'w':CELL_W,'h':CELL_H})
    records.append({'poseIndex':p['index'],'generationId':p['generationId'],'promptFiles':p['promptFiles'],
      'source':p['source'],'sourceSha256':p['sourceSha256'],'rawSource':p['rawSource'],
      'rawSourceSha256':p['rawSourceSha256'],'cropThreshold':16,'cropBox':list(bounds),
      'figureSize':[fw,fh],'cellMargins':[ox,CELL_W-fw-ox,oy,CELL_H-fh-oy],
      'packedCellSha256':cell_hash,'cell':[x,y,CELL_W,CELL_H]})
PNG.parent.mkdir(parents=True,exist_ok=True);WEBP.parent.mkdir(parents=True,exist_ok=True)
atlas.save(PNG);atlas.save(WEBP,'WEBP',lossless=True,method=6)
provenance['generatedAt']=datetime.now(timezone.utc).isoformat(timespec='seconds').replace('+00:00','Z')
provenance['status']='accepted; fifteen distinct authored poses with native-render separate-ball track review passed'
provenance['runtimeBallTrack']={'heightByPose':[1.22,1.59,2.24,1.82,2.12,1.46,1.12,1.82,2.06,1.75,2.24,1.1,.86,.42,.7],'forwardByPose':[5.85,8.77,5.12,8.77,12.43,7.31,-8.04,7.31,11.7,12.06,12.43,11.7,4.02,-5.12,-1.46],'anchors':{'grab':10,'release':21},'releasePolicy':'carried through tick20; at tick21 simulation releases into rim flight'}
provenance['nativeRendererReport']='tools/generate-art/previews/j107-keeg-alley-oop-reverse/native-render-report.json'
provenance['reviewSummary']+=' The actual Canvas renderer selected every pose in both facings; the athlete-specific ball track aligned at tick10 catch and tick20 hold, then released at tick21 in both facings at standard and 120% zoom.'
provenance['atlas'].update({'pngSha256':hashlib.sha256(PNG.read_bytes()).hexdigest(),
  'webpSha256':hashlib.sha256(WEBP.read_bytes()).hexdigest(),'dimensions':[atlas.width,atlas.height],
  'figureFit':'Uniform nearest-neighbor fit inside 76x86, center in transparent 128x96 cell; minimum side margins26px and top/bottom margins5px.',
  'packedCellSha256':cell_hashes,'sourceRecords':records})
PROV.write_text(json.dumps(provenance,indent=2,ensure_ascii=False)+'\n')
layout={'athlete':'keeg','direction':'right','clip':'alley-oop-reverse','src':'./public/assets/animation/keeg-alley-oop-reverse-right.webp',
 'columns':COLS,'rows':ROWS,'frames':frames,
 'provenance':{'prompt':provenance['prompt'],'promptVerbatim':True,'sourcePromptStatus':provenance['sourcePromptStatus'],'promptScope':provenance['promptScope'],'generatedAt':provenance['generatedAt'],
  'generationId':'15 individually generated pose records; see sourceRecords','promptAndSourceManifest':'tools/generate-art/j107-keeg-alley-oop-reverse-provenance.json',
  'sourceNotes':'tools/generate-art/j107-keeg-alley-oop-reverse-source-notes.md','assemblyScript':'tools/generate-art/assemble-keeg-alley-oop-reverse.py',
  'cellSize':[CELL_W,CELL_H],'grid':[COLS,ROWS],'figureFit':[MAX_W,MAX_H],'sequenceOrder':list(range(15)),
  'operation':'Tight alpha crop at threshold16; uniform nearest-neighbor fit within76x86, center in transparent128x96 cell; pack row-major. No pose was drawn, duplicated, mirrored or interpolated.','actionAnchors':{'takeoff':2,'grab':5,'peak':7,'release':10,'finish':11,'land':14},
  'sourceRecords':records,'rejectedCandidates':provenance['rejectedCandidates'],
  'ballPolicy':provenance['ballPolicy'],'ballTrack':'Keeg-specific separated runtime track in src/core/animation.js; see runtimeBallTrack and nativeRendererReport.',
  'reviewSummary':provenance['reviewSummary'],'runtimeBallTrack':provenance['runtimeBallTrack'],'nativeRendererReport':provenance['nativeRendererReport'],'atlasSha256':hashlib.sha256(WEBP.read_bytes()).hexdigest(),
  'promptFile':'tools/generate-art/j107-keeg-alley-oop-reverse-provenance.json'}}
LAYOUT.write_text(json.dumps(layout,indent=2,ensure_ascii=False)+'\n')
# Save a review sheet from the actual packed cells on both backgrounds.
review=Image.new('RGB',(CELL_W*COLS,CELL_H*2*ROWS),(250,250,250))
from PIL import ImageDraw
draw=ImageDraw.Draw(review)
for i in range(15):
    x=(i%COLS)*CELL_W;y=(i//COLS)*CELL_H*2
    cell=atlas.crop((x,(i//COLS)*CELL_H,x+CELL_W,(i//COLS+1)*CELL_H))
    review.paste(cell.convert('RGB'),(x,y+16),cell.getchannel('A'))
    draw.text((x+4,y+2),f'{i:02d}',fill='black')
    draw.rectangle((x,y+CELL_H,x+CELL_W-1,y+CELL_H*2-1),fill=(32,32,40))
    review.paste(cell.convert('RGB'),(x,y+CELL_H+16),cell.getchannel('A'))
    draw.text((x+4,y+CELL_H+2),f'{i:02d}',fill='white')
PREVIEW=ROOT/'tools/generate-art/previews/j107-keeg-alley-oop-reverse/j107-keeg-alley-oop-reverse-atlas-review.png'
review.save(PREVIEW)
print(json.dumps({'atlas':str(WEBP.relative_to(ROOT)),'size':list(atlas.size),'frames':len(frames),
 'webpSha256':hashlib.sha256(WEBP.read_bytes()).hexdigest(),'sourceRecords':len(records),'preview':str(PREVIEW.relative_to(ROOT))}))
