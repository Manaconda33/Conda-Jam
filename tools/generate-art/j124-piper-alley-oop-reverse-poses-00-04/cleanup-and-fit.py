#!/usr/bin/env python3
"""Record main-figure alpha cleanup and uniform 80px-margin layouts for J.124 poses00–04."""
from pathlib import Path
import hashlib, json
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parent
LIMIT=80
GEN_IDS={
  (0,1):'exec-af430040-b35c-47b9-8e23-d65c8a951ba8',
  (0,2):'exec-72011d6f-04a5-4bdd-b719-07078c595b40',
  (1,1):'exec-b427165b-d7f8-445c-a03a-ff10cbdd0119',
  (2,1):'exec-46fd0f32-6bc3-4ba8-86f7-1d9b43671d71',
  (3,1):'exec-b0a33ac7-a81c-49df-b6a7-07e181ba0951',
  (4,1):'exec-f1bf2bef-b583-4c20-8531-bf1621afbe82',
}
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def premul_resize(image,size):
    rgba=np.asarray(image.convert('RGBA'),dtype=np.float32); alpha=rgba[:,:,3]/255
    premul=rgba[:,:,:3]*alpha[:,:,None]
    resized_alpha=Image.fromarray(alpha,mode='F').resize(size,Image.Resampling.LANCZOS)
    a=np.clip(np.asarray(resized_alpha,dtype=np.float32),0,1); channels=[]
    for k in range(3):
        channel=np.asarray(Image.fromarray(premul[:,:,k],mode='F').resize(size,Image.Resampling.LANCZOS),dtype=np.float32)
        channels.append(np.divide(channel,a,out=np.zeros_like(channel),where=a>1/255))
    out=np.empty((size[1],size[0],4),dtype=np.uint8)
    out[:,:,:3]=np.rint(np.clip(np.stack(channels,axis=2),0,255)).astype(np.uint8); out[:,:,3]=np.rint(a*255).astype(np.uint8)
    out[out[:,:,3]==0,:3]=0
    return Image.fromarray(out,'RGBA')
def margins(image,threshold=16):
    b=image.getchannel('A').point(lambda a:255 if a>threshold else 0).getbbox()
    return [b[0],b[1],image.width-b[2],image.height-b[3]] if b else None

def light_dark(img,pose,tag):
    for name,bg in [('light',(245,244,239,255)),('dark',(23,24,38,255))]:
        proof=Image.new('RGBA',img.size,bg); proof.alpha_composite(img)
        proof.save(ROOT/'proofs'/f'pose-{pose:02d}-{tag}-{name}.png')

for pose,attempt in [(i,1) for i in range(5)]+[(0,2)]:
    raw=ROOT/'sources'/f'pose-{pose:02d}-attempt{attempt}-generated-raw.png'
    image=Image.open(raw).convert('RGBA'); arr=np.asarray(image); mask=arr[:,:,3]>16
    labels,n=ndimage.label(mask,np.ones((3,3),dtype=np.uint8)); counts=np.bincount(labels.ravel())[1:]
    main=int(np.argmax(counts)+1); main_mask=labels==main
    # Keep only the main figure, with a one-pixel antialias halo. This does not paint or redraw.
    halo=ndimage.binary_dilation(main_mask,structure=np.ones((3,3),dtype=bool),iterations=1)
    cleaned=arr.copy(); cleaned[~halo,3]=0; cleaned[cleaned[:,:,3]==0,:3]=0
    clean_path=ROOT/'cleaned'/f'pose-{pose:02d}-attempt{attempt}-main-alpha.png'
    Image.fromarray(cleaned,'RGBA').save(clean_path)
    clean=Image.open(clean_path).convert('RGBA'); box=clean.getchannel('A').point(lambda a:255 if a>16 else 0).getbbox(); crop=clean.crop(box)
    maxw=clean.width-2*LIMIT-2; maxh=clean.height-2*LIMIT-2; scale=min(maxw/crop.width,maxh/crop.height)
    size=(max(1,round(crop.width*scale)),max(1,round(crop.height*scale))); figure=premul_resize(crop,size)
    out=Image.new('RGBA',clean.size,(0,0,0,0)); xy=((out.width-size[0])//2,(out.height-size[1])//2); out.alpha_composite(figure,xy)
    fit_path=ROOT/'layout-candidates'/f'pose-{pose:02d}-attempt{attempt}-fit80.png'; out.save(fit_path)
    layout={
      'athlete':'piper-quickstep','issue':'J.124','clip':'alley-oop-reverse','pose':pose,'attempt':attempt,
      'rawSource':str(raw.relative_to(ROOT)),'rawSha256':sha(raw),'rawCanvasPx':list(image.size),
      'alpha16Components':int(n),'largestComponentPixels':int(counts[main-1]),'cleanupMethod':'Keep largest 8-connected alpha>16 component plus one-pixel dilation halo; alpha only; no redraw.',
      'cleanedSource':str(clean_path.relative_to(ROOT)),'cleanedSha256':sha(clean_path),'cleanedAlpha16MarginsLTRBpx':margins(clean),
      'cropAlpha16LTRB':list(box),'requiredMarginPx':LIMIT,'scale':round(scale,8),'figurePx':list(size),'placementXY':list(xy),
      'candidate':str(fit_path.relative_to(ROOT)),'candidateSha256':sha(fit_path),'candidateAlpha16MarginsLTRBpx':margins(out),
      'method':'Uniform premultiplied-alpha Lanczos downscale and center placement; no redraw or pose alteration.',
      'lightProof':f'proofs/pose-{pose:02d}-attempt{attempt}-fit80-light.png','darkProof':f'proofs/pose-{pose:02d}-attempt{attempt}-fit80-dark.png'
    }
    light_dark(out,pose,f'attempt{attempt}-fit80')
    (ROOT/'layout-candidates'/f'pose-{pose:02d}-attempt{attempt}-fit80.json').write_text(json.dumps(layout,indent=2)+'\n')
    prompt=ROOT/f'pose-{pose:02d}-attempt1-prompt.md'
    prov={
      'athlete':'piper-quickstep','issue':'J.124','clip':'alley-oop-reverse','pose':pose,'attempt':attempt,
      'beat':['low forward run-in stride toward screen-right; right knee leads, arms pump, eyes track incoming pass','alternate low run-in stride candidate closely matching attempt1','accelerating long screen-right stride; left knee drives up and eyes follow high pass','one-foot takeoff at tick4; lead knee raised, trailing foot pushes off, arms start reaching overhead','airborne early reach; both legs bent and separated, arms extended overhead','late pre-catch reach; elbows nearly extended, palms open and separated'][pose if pose>0 else 0],
      'generationTool':'image_gen.imagegen','generationId':GEN_IDS[(pose,attempt)],'generationDate':'2026-10-25','generationTimeNote':'Exact per-image timestamp was not returned; generated during the 2026-10-25 UTC session.',
      'promptFile':str(prompt.relative_to(ROOT)),'promptSha256':sha(prompt),'identityReferencesAttached':False,
      'identityReferencePolicy':'Text-only canonical Piper identity in prompt; original pose generation, no source image passed to ImageGen.',
      'rawSource':str(raw.relative_to(ROOT)),'rawSourceSha256':sha(raw),'rawCanvasPx':list(image.size),'rawAlpha16MarginsLTRBpx':margins(image),
      'cleanup':{'components':int(n),'largestComponentPixels':int(counts[main-1]),'method':'Keep largest 8-connected alpha>16 component plus one-pixel dilation halo; alpha only; no redraw.','source':str(raw.relative_to(ROOT)),'sourceSha256':sha(raw),'cleanedSource':str(clean_path.relative_to(ROOT)),'cleanedSha256':sha(clean_path),'cleanedAlpha16MarginsLTRBpx':margins(clean)},
      'layout':layout,'selectedCandidate':str(fit_path.relative_to(ROOT)),'selectedCandidateSha256':sha(fit_path),
      'review':{'status':'source-candidate-pending-full-sequence-review','identity':'Piper identity appears consistent: warm brown skin, dark eyes, attached bright orange high ponytail, russet/cream uniform, white socks, red/cream shoes.','anatomy':'Complete adult human anatomy; verify neighboring poses at native atlas scale.','pose':'Beat is distinct in source; parent review pending.','transparency':'RGBA source with transparent backdrop.','ballFree':'No ball or prop in the source.','margins':'Raw alpha>16 margins shown above; selected candidate uses uniform layout with at least80px on all sides.'},
      'disposition':'alternate candidate retained; attempt1 preferred for same run-in beat' if pose==0 and attempt==2 else 'selected lane source candidate; not atlas accepted'
    }
    (ROOT/'provenance'/f'pose-{pose:02d}-attempt{attempt}.json').write_text(json.dumps(prov,indent=2)+'\n')
    print(f'pose{pose:02d} attempt{attempt}: raw={margins(image)}, fit={margins(out)}, components={n}, scale={scale:.5f}')
