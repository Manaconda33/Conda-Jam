#!/usr/bin/env python3
"""Add decoded pose hashes and final WebP hashes to Nova's unregistered source layouts."""
import hashlib, json
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
for layout_path in sorted((ROOT/'tools/generate-art').glob('nova-stitch-*-layouts.json')):
    layout=json.loads(layout_path.read_text())
    if not layout or not layout[0].get('provenance',{}).get('generationId'):
        continue
    entry=layout[0]
    atlas=ROOT/entry['src'].removeprefix('./')
    if not atlas.is_file(): continue
    with Image.open(atlas) as opened: image=opened.convert('RGBA')
    for frame in entry['frames']:
        crop=image.crop((frame['x'],frame['y'],frame['x']+frame['w'],frame['y']+frame['h']))
        frame['hash']=hashlib.sha256(crop.tobytes()).hexdigest()
    prov=entry['provenance'];prov['atlasPath']=str(atlas.relative_to(ROOT));prov['atlasSha256']=hashlib.sha256(atlas.read_bytes()).hexdigest();prov['atlasBytes']=atlas.stat().st_size
    layout_path.write_text(json.dumps(layout,indent=2)+'\n')
    prov_path=ROOT/'tools/generate-art'/f"nova-stitch-{entry['clip']}-provenance.json"
    if prov_path.is_file():
        stored=json.loads(prov_path.read_text());stored.update({k:v for k,v in prov.items() if k in {'atlasPath','atlasSha256','atlasBytes','sourceImage','sourceSha256'}});prov_path.write_text(json.dumps(stored,indent=2)+'\n')
    print(json.dumps({'clip':entry['clip'],'poses':len(entry['frames']),'uniquePoseHashes':len({f['hash'] for f in entry['frames']}),'atlasBytes':prov['atlasBytes'],'atlasSha256':prov['atlasSha256']}))
