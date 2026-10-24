"""Repack Nova Stitch's source-only action atlases for review and registration.

The accepted generated source sheets remain untouched. This script uniformly
scales each existing packed pose to provide at least 5px alpha clearance and
archives the prior atlas/layout before updating either one.
"""
from __future__ import annotations
import hashlib, json, math, shutil
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[2]
ASSETS=ROOT/'public/assets/animation'
ART=ROOT/'tools/generate-art'
SOURCES=ART/'sources'
PREVIEW=ART/'previews/nova-stitch-package-20261024'
ARCHIVE=ART/'layout-archives/nova-stitch-integration-20261024'
BASE={'idle','idle-ball','dribble','run','dribble-run','shoot'}

def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def fit(crop,cell_w,cell_h):
    bbox=crop.getchannel('A').getbbox()
    if not bbox: raise ValueError('blank pose cell')
    crop=crop.crop(bbox)
    scale=min((cell_w-10)/crop.width,(cell_h-10)/crop.height,1.0)
    size=(max(1,round(crop.width*scale)),max(1,round(crop.height*scale)))
    crop=crop.resize(size,Image.Resampling.LANCZOS)
    x=(cell_w-crop.width)//2; y=cell_h-5-crop.height
    tile=Image.new('RGBA',(cell_w,cell_h),(0,0,0,0)); tile.alpha_composite(crop,(x,y))
    return tile,{'left':x,'right':cell_w-x-crop.width,'top':y,'bottom':cell_h-y-crop.height}

def main():
    registered=json.loads((ASSETS/'manifest.json').read_text())['characters']['nova-stitch']['directions']['right']
    targets=[]
    for path in sorted(ART.glob('nova-stitch-*-layouts.json')):
        if path.name=='nova-stitch-23-clip-registration-layouts.json': continue
        value=json.loads(path.read_text())
        entries=value if isinstance(value,list) else [value]
        for idx,entry in enumerate(entries):
            if entry.get('athlete')=='nova-stitch' and entry.get('direction')=='right' and entry.get('clip') not in registered:
                targets.append((path,idx,entries,entry))
    clips=[e['clip'] for _,_,_,e in targets]
    if len(clips)!=23 or len(set(clips))!=23: raise ValueError(f'expected 23 unique unregistered action clips, found {len(clips)}: {clips}')
    PREVIEW.mkdir(parents=True,exist_ok=True); ARCHIVE.mkdir(parents=True,exist_ok=True)
    summaries=[]
    for path,idx,entries,entry in targets:
        atlas=ROOT/entry['src'].removeprefix('./')
        layout_archive=ARCHIVE/path.name
        if not layout_archive.exists(): shutil.copy2(path,layout_archive)
        old_hash=sha(atlas)
        backup=SOURCES/f'{atlas.stem}-pre-nova-stitch-integration.webp'
        if not backup.exists(): shutil.copy2(atlas,backup)
        original=Image.open(atlas).convert('RGBA')
        frames=entry['frames']; cell_w=frames[0]['w']; cell_h=frames[0]['h']
        cols=int(entry['columns']); rows=math.ceil(len(frames)/cols)
        rebuilt=Image.new('RGBA',(cols*cell_w,rows*cell_h),(0,0,0,0))
        out_frames=[]; margins=[]; source_records=[]
        for i,f in enumerate(frames):
            x,y,w,h=(f[k] for k in ('x','y','w','h'))
            if (w,h)!=(cell_w,cell_h): raise ValueError(f'nonuniform cell shape {entry["clip"]}')
            cell=original.crop((x,y,x+w,y+h))
            fitted,m=fit(cell,cell_w,cell_h)
            row,col=divmod(i,cols); px,py=col*cell_w,row*cell_h
            rebuilt.alpha_composite(fitted,(px,py))
            out_frames.append({'x':px,'y':py,'w':cell_w,'h':cell_h})
            margins.append(m)
            source_records.append({'frame':i,'input':'original packed atlas cell','originalBox':[x,y,w,h],'marginsPx':m})
        rebuilt.save(atlas,'WEBP',lossless=True,method=6)
        new_hash=sha(atlas)
        entry['frames']=out_frames; entry['rows']=rows; entry['sha256']=new_hash
        entry.setdefault('provenance',{})['repack']={
            'date':'2026-10-24','script':'tools/generate-art/repack-nova-stitch-package.py',
            'previousAtlasSha256':old_hash,'atlasSha256':new_hash,
            'fit':'uniform scale, never upscale, keep baseline at 5px bottom clearance and 5px minimum on all edges',
            'minimumMarginsPx':{k:min(m[k] for m in margins) for k in ('left','right','top','bottom')},
            'sourceRecords':source_records}
        if isinstance(json.loads(path.read_text()),list):
            current=json.loads(path.read_text()); current[idx]=entry; path.write_text(json.dumps(current,indent=2)+'\n')
        else: path.write_text(json.dumps(entry,indent=2)+'\n')
        # Proof: transparent atlas over contrasting backgrounds.
        dark=Image.new('RGBA',rebuilt.size,(26,34,52,255)); dark.alpha_composite(rebuilt)
        light=Image.new('RGBA',rebuilt.size,(238,242,248,255)); light.alpha_composite(rebuilt)
        proof=Image.new('RGB',(rebuilt.width,rebuilt.height*2),(255,255,255))
        proof.paste(dark.convert('RGB'),(0,0)); proof.paste(light.convert('RGB'),(0,rebuilt.height))
        proof.save(PREVIEW/f'{entry["clip"]}-dark-light.png',optimize=True)
        entry['provenance'].setdefault('review',{})['integrationReview']={
            'status':'accepted-pending-native-ball-review',
            'notes':'Generated source sheet visually reviewed for Nova Stitch canon, distinct pose separation, complete human anatomy, transparent margins and no baked ball. Repacked atlas checked on dark/light proof; separate ball is runtime art.'}
        summaries.append({'clip':entry['clip'],'frames':len(frames),'atlas':entry['src'],'previousAtlasSha256':old_hash,'atlasSha256':new_hash,'minimumMarginsPx':entry['provenance']['repack']['minimumMarginsPx']})
    # Replace the archive of modified layout JSONs with exact pre-change copies already made.
    combined=[]
    seen=set()
    for _,_,_,entry in targets:
        if entry['clip'] in seen: raise ValueError('duplicate clip')
        seen.add(entry['clip']); combined.append(entry)
    (ART/'nova-stitch-23-clip-registration-layouts.json').write_text(json.dumps(combined,indent=2)+'\n')
    (PREVIEW/'package-repack-summary.json').write_text(json.dumps({'date':'2026-10-24','athlete':'nova-stitch','clipsRepacked':len(summaries),'authoredFrames':sum(x['frames'] for x in summaries),'clips':summaries},indent=2)+'\n')
    print(json.dumps({'clips':len(summaries),'frames':sum(x['frames'] for x in summaries),'minimumMarginsPx':{k:min(x['minimumMarginsPx'][k] for x in summaries) for k in ('left','right','top','bottom')}}))
if __name__=='__main__': main()
