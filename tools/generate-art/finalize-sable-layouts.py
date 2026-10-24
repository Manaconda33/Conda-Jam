#!/usr/bin/env python3
"""Finalize reviewed Sable Regent source layouts without registration."""
import hashlib,json
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
for lp in sorted((ROOT/'tools/generate-art').glob('sable-regent-*-layouts.json')):
    data=json.loads(lp.read_text())
    if not data or not data[0].get('provenance',{}).get('generationId'): continue
    entry=data[0]; atlas=ROOT/entry['src'].removeprefix('./')
    if not atlas.is_file(): continue
    with Image.open(atlas) as opened: image=opened.convert('RGBA')
    for frame in entry.get('frames',[]):
        crop=image.crop((frame['x'],frame['y'],frame['x']+frame['w'],frame['y']+frame['h']))
        frame['hash']=hashlib.sha256(crop.tobytes()).hexdigest()
    prov=entry['provenance']; prov['atlasPath']=str(atlas.relative_to(ROOT));prov['atlasSha256']=hashlib.sha256(atlas.read_bytes()).hexdigest();prov['atlasBytes']=atlas.stat().st_size
    if prov.get('ballTrack'): entry['ballTrack']=prov['ballTrack']
    lp.write_text(json.dumps(data,indent=2)+'\n')
    pp=ROOT/'tools/generate-art'/f"sable-regent-{entry['clip']}-provenance.json"
    if pp.is_file():
        saved=json.loads(pp.read_text())
        for k in ('atlasPath','atlasSha256','atlasBytes','sourceImage','sourceSha256','ballTrack'):
            if k in prov:saved[k]=prov[k]
        pp.write_text(json.dumps(saved,indent=2)+'\n')
    print(json.dumps({'clip':entry['clip'],'poses':len(entry.get('frames',[])),'uniquePoseHashes':len({f.get('hash') for f in entry.get('frames',[]) }),'atlasBytes':prov['atlasBytes'],'atlasSha256':prov['atlasSha256']}))
