#!/usr/bin/env python3
"""Pack accepted Piper clutch source for native calibration only."""
import hashlib, importlib.util, json
from pathlib import Path
from PIL import Image
ROOT=Path.cwd()
OUT=ROOT/'tools/generate-art/previews/piper-quickstep-dunk-clutch/attempt5-atlas-candidate'
SOURCE=ROOT/'tools/generate-art/sources/piper-quickstep-dunk-clutch-attempt5-clean.png'
PROVENANCE=ROOT/'tools/generate-art/piper-quickstep-dunk-clutch-attempt5-provenance.json'
spec=importlib.util.spec_from_file_location('motion42',ROOT/'tools/generate-art/package-motion42.py')
motion=importlib.util.module_from_spec(spec);spec.loader.exec_module(motion)
rects=motion.inspect_source(SOURCE,count=15,columns=5,isolate=True)
crops=motion.isolated_crops(SOURCE,rects)
scale=92/max(r['h'] for r in rects)
columns,rows,cw,ch=4,4,128,96
atlas=Image.new('RGBA',(columns*cw,rows*ch),(0,0,0,0));frames=[]
for index,(rect,crop) in enumerate(zip(rects,crops)):
    width,height=round(rect['w']*scale),round(rect['h']*scale)
    crop=crop.resize((width,height),Image.Resampling.LANCZOS)
    x=(index%columns)*cw+(cw-width)//2;y=(index//columns)*ch+94-height
    atlas.alpha_composite(crop,(x,y));frames.append({'x':(index%columns)*cw,'y':(index//columns)*ch,'w':cw,'h':ch})
out=OUT/'candidate-atlas.webp';atlas.save(out,'WEBP',quality=88,method=6)
prov=json.loads(PROVENANCE.read_text())
prov.update({'candidateAtlasPath':str(out.relative_to(ROOT)),'candidateAtlasSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'candidatePacking':'preview-only component isolation; 128x96 cells; baseline94; WebP88; no synthesized frames','eligibleForProductionPacking':False})
layout={'athlete':'piper-quickstep','direction':'right','clip':'dunk-clutch','src':'./'+str(out.relative_to(ROOT)),'columns':columns,'rows':rows,'frames':frames,'provenance':prov}
(OUT/'candidate-layout.json').write_text(json.dumps(layout,indent=2)+'\n')
for name,color in [('candidate-light.png',(244,244,244,255)),('candidate-dark.png',(18,20,24,255))]:
    bg=Image.new('RGBA',atlas.size,color);bg.alpha_composite(atlas);bg.convert('RGB').save(OUT/name)
print(json.dumps({'atlas':str(out.relative_to(ROOT)),'sha256':prov['candidateAtlasSha256'],'frames':len(frames),'scale':scale}))
