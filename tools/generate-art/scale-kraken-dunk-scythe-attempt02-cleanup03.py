#!/usr/bin/env python3
"""Uniformly scale reviewed Kraken scythe candidate poses while preserving baseline."""
from pathlib import Path
from PIL import Image, ImageDraw
import hashlib, json, math
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/previews/kraken-dunk-scythe-attempt02/cleanup02-component-repack/kraken-dunk-scythe-attempt02-cleanup02-atlas.png'
OUT=ROOT/'tools/generate-art/previews/kraken-dunk-scythe-attempt02/cleanup03-scaled-repack'
OUT.mkdir(parents=True,exist_ok=True)
CELL_W,CELL_H,COLS,ROWS,BASELINE=88,96,5,3,94
SCALE=89/82
raw=Image.open(SOURCE).convert('RGBA')
assert raw.size==(400,288)
atlas=Image.new('RGBA',(CELL_W*COLS,CELL_H*ROWS),(0,0,0,0))
frames=[]
for i in range(COLS*ROWS):
    sx=(i%5)*80;sy=(i//5)*96
    cell=raw.crop((sx,sy,sx+80,sy+96))
    alpha=cell.getchannel('A')
    bbox=alpha.getbbox()
    assert bbox
    pose=cell.crop(bbox)
    nw=max(1,round(pose.width*SCALE));nh=max(1,round(pose.height*SCALE))
    pose=pose.resize((nw,nh),Image.Resampling.NEAREST)
    left=(CELL_W-nw)//2;top=BASELINE-nh
    assert left>=5 and CELL_W-left-nw>=5 and top>=5 and BASELINE< CELL_H
    x=(i%5)*CELL_W+left;y=(i//5)*CELL_H+top
    atlas.alpha_composite(pose,(x,y))
    cell_out=atlas.crop(((i%5)*CELL_W,(i//5)*CELL_H,(i%5+1)*CELL_W,(i//5+1)*CELL_H))
    visible=cell_out.getchannel('A').getbbox();assert visible
    frames.append({'index':i,'x':(i%5)*CELL_W,'y':(i//5)*CELL_H,'w':CELL_W,'h':CELL_H,'visibleBounds':[visible[0],visible[1],visible[2],visible[3]],'marginsLTRB':[visible[0],visible[1],CELL_W-visible[2],CELL_H-visible[3]],'occupiedHeight':visible[3]-visible[1],'sha256':hashlib.sha256(cell_out.tobytes()).hexdigest()})
atlas.save(OUT/'kraken-dunk-scythe-attempt02-cleanup03-atlas.png')
for name,bg in [('light',(246,246,239,255)),('dark',(29,37,54,255))]:
    preview=Image.new('RGBA',(atlas.width*2,atlas.height*2),bg)
    preview.alpha_composite(atlas.resize((atlas.width*2,atlas.height*2),Image.Resampling.NEAREST))
    preview.convert('RGB').save(OUT/f'kraken-dunk-scythe-attempt02-cleanup03-{name}-preview.png')
report={'athlete':'kraken','clip':'dunk-scythe','attempt':2,'cleanup':'cleanup03 scaled component repack','derivedFrom':'tools/generate-art/previews/kraken-dunk-scythe-attempt02/cleanup02-component-repack/kraken-dunk-scythe-attempt02-cleanup02-atlas.png','sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'cleanupScript':'tools/generate-art/scale-kraken-dunk-scythe-attempt02-cleanup03.py','cleanupMethod':f'Per-frame alpha crop; single uniform nearest-neighbor scale factor {SCALE:.9f} (common across all poses); center each pose in an 88x96 transparent cell; align feet to baselineY94; no recoloring, repainting, added/removed figures, or changed pose.','scale':SCALE,'sourceCellSize':[80,96],'cellSize':[CELL_W,CELL_H],'atlasDimensions':list(atlas.size),'columns':COLS,'rows':ROWS,'baselineY':BASELINE,'poseCount':len(frames),'uniqueFrameCount':len({f['sha256'] for f in frames}),'frames':frames,'reviewStatus':'awaiting independent art review; no gameplay or production acceptance'}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'size':atlas.size,'scale':SCALE,'maxOccupiedHeight':max(f['occupiedHeight'] for f in frames),'minSide':min(min(f['marginsLTRB'][0],f['marginsLTRB'][2]) for f in frames),'minTop':min(f['marginsLTRB'][1] for f in frames),'minBottom':min(f['marginsLTRB'][3] for f in frames)}))
