from pathlib import Path
import hashlib, importlib.util, json
from PIL import Image
root=Path(__file__).resolve().parents[5]
source=root/'tools/generate-art/sources/piper-quickstep-dunk-360-attempt3-clean-candidate.png'
provenance=json.loads((root/'tools/generate-art/piper-quickstep-dunk-360-attempt3-provenance.json').read_text())
packer=root/'tools/generate-art/package-motion42.py'
spec=importlib.util.spec_from_file_location('motion42',packer); motion=importlib.util.module_from_spec(spec); spec.loader.exec_module(motion)
rects=motion.inspect_source(source,count=15,columns=5,isolate=True)
crops=motion.isolated_crops(source,rects)
scale=92/max(r['h'] for r in rects); columns,rows,cw,ch=4,4,128,96
atlas=Image.new('RGBA',(columns*cw,rows*ch),(0,0,0,0)); frames=[]
for i,(crop,rect) in enumerate(zip(crops,rects)):
    w,h=round(rect['w']*scale),round(rect['h']*scale)
    crop=crop.resize((w,h),Image.Resampling.LANCZOS)
    x=(i%columns)*cw+(cw-w)//2; y=(i//columns)*ch+94-h
    atlas.alpha_composite(crop,(x,y))
    frames.append({'x':(i%columns)*cw,'y':(i//columns)*ch,'w':cw,'h':ch})
out=Path(__file__).resolve().parent
image=out/'candidate-atlas.webp'; atlas.save(image,'WEBP',quality=88,method=6)
layout={'athlete':'piper-quickstep','direction':'right','clip':'dunk-360','src':'./tools/generate-art/previews/piper-quickstep-dunk-360/attempt3-atlas-candidate/candidate-atlas.webp','columns':columns,'rows':rows,'frames':frames,'provenance':provenance,'sourceRects':[{'sourceIndex':i,**r} for i,r in enumerate(rects)],'uniformScale':scale,'componentIsolation':True}
(out/'candidate-layout.json').write_text(json.dumps(layout,indent=2)+'\n')
for color,name in [((248,248,248,255),'candidate-light.png'),((20,20,20,255),'candidate-dark.png')]:
    proof=Image.new('RGBA',atlas.size,color);proof.alpha_composite(atlas);proof.convert('RGB').save(out/name)
print(json.dumps({'path':str(image.relative_to(root)),'atlasSha256':hashlib.sha256(image.read_bytes()).hexdigest(),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'size':atlas.size,'frames':len(frames),'scale':scale}))
