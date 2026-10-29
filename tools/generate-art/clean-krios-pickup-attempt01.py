from pathlib import Path
from PIL import Image
import hashlib, json
import numpy as np

root=Path(__file__).resolve().parents[2]
raw=root/'tools/generate-art/sources/krios-pickup-attempt01-generated-raw.png'
clean=root/'tools/generate-art/sources/krios-pickup-attempt01-cleanup01.png'
img=Image.open(raw).convert('RGBA')
a=np.asarray(img).copy();alpha=a[:,:,3];nonzero=(alpha>0)
removed=int(np.count_nonzero(nonzero&(alpha<96)));opaque=int(np.count_nonzero((alpha>=96)&(alpha<255)))
a[alpha<96,3]=0;a[(alpha>=96)&(alpha<255),3]=255
Image.fromarray(a).save(clean)
preview=root/'tools/generate-art/previews/krios-pickup-attempt01';preview.mkdir(parents=True,exist_ok=True)
cleaned=Image.open(clean).convert('RGBA')
for name,bg in [('cleanup01-light-preview.png',(242,242,238,255)),('cleanup01-dark-preview.png',(27,30,36,255))]:
    canvas=Image.new('RGBA',cleaned.size,bg);canvas.alpha_composite(cleaned);canvas.convert('RGB').save(preview/name)
components=[]
mask=(np.asarray(cleaned)[:,:,3]>=64).astype(np.uint8)
from scipy.ndimage import label,find_objects
labels,n=label(mask,np.ones((3,3),dtype=np.uint8))
for i,s in enumerate(find_objects(labels),1):
    if s is None: continue
    area=int(np.count_nonzero(labels[s]==i))
    if area < cleaned.width*cleaned.height/6*.006: continue
    ys,xs=s;components.append({'component':i,'area':area,'x':int(xs.start),'y':int(ys.start),'w':int(xs.stop-xs.start),'h':int(ys.stop-ys.start)})
report={'source':raw.relative_to(root).as_posix(),'sourceSha256':hashlib.sha256(raw.read_bytes()).hexdigest(),'output':clean.relative_to(root).as_posix(),'outputSha256':hashlib.sha256(clean.read_bytes()).hexdigest(),'method':'Set alpha below 96 to zero and alpha 96–254 to 255; preserve all RGB values. No redraw, resize, or color edits.','threshold':96,'removedNonzeroAlphaPixels':removed,'madeOpaquePixels':opaque,'rgbPreserved':bool(np.array_equal(a[:,:,:3],np.asarray(img)[:,:,:3])),'componentsAtAlpha64':components,'componentCount':len(components),'previews':['tools/generate-art/previews/krios-pickup-attempt01/cleanup01-light-preview.png','tools/generate-art/previews/krios-pickup-attempt01/cleanup01-dark-preview.png']}
(root/'tools/generate-art/krios-pickup-attempt01-cleanup01-report.json').write_text(json.dumps(report,indent=2)+'\n')
meta_path=root/'tools/generate-art/krios-pickup-attempt01-provenance.json';meta=json.loads(meta_path.read_text())
meta.update({'athlete':'krios','clip':'pickup','direction':'right','canonicalSection':'J.128','eligibleForPacking':True,'sourceImage':clean.relative_to(root).as_posix(),'sourceSha256':report['outputSha256']})
meta['cleanup']={'performed':True,'script':'tools/generate-art/clean-krios-pickup-attempt01.py','method':report['method'],'report':'tools/generate-art/krios-pickup-attempt01-cleanup01-report.json','sourceImage':clean.relative_to(root).as_posix(),'sourceSha256':report['outputSha256'],'status':'cleanup trial; independent post-cleanup review pending'}
meta['review']={'status':'pose-approved-for-cleanup-and-pack-trials','reviewedBy':'independent source reviewer','reviewNotes':'Original five poses and Krios identity approved for cleanup and packing trials only. Production acceptance still requires post-cleanup transparency/edge review and native packed margin/style review.'}
meta_path.write_text(json.dumps(meta,indent=2)+'\n')
print(json.dumps(report))
