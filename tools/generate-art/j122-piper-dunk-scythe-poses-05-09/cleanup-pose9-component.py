#!/usr/bin/env python3
"""Isolate only the source-connected Piper figure for pose-9 alpha cleanup."""
from __future__ import annotations
import hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label, binary_dilation

BASE=Path(__file__).resolve().parent
RAW=BASE/'raw/pose09-attempt6.png'
CLEAN=BASE/'sources/pose09-attempt6-components-clean.png'
PROOFS=BASE/'previews'
STRUCTURE=np.ones((3,3),dtype=bool)
def sha(path:Path)->str:return hashlib.sha256(path.read_bytes()).hexdigest()
def measure(alpha:np.ndarray, threshold:int=128):
    ys,xs=np.where(alpha>threshold)
    if len(xs)==0:raise ValueError('No visible alpha')
    x0,y0,x1,y1=int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)
    h,w=alpha.shape
    return {'alphaThreshold':threshold,'alphaBoundingBox':[x0,y0,x1,y1],
      'marginsLTRBpx':[x0,y0,w-x1,h-y1],'minimumMarginPx':min(x0,y0,w-x1,h-y1),
      'alphaZeroFraction':round(float(np.count_nonzero(alpha==0)/alpha.size),6)}
with Image.open(RAW) as source:rgba=np.array(source.convert('RGBA'))
alpha=rgba[:,:,3]
labels,count=label(alpha>64,structure=STRUCTURE)
sizes=np.bincount(labels.ravel());sizes[0]=0
keep=int(np.argmax(sizes));core=labels==keep
mask=binary_dilation(core,structure=STRUCTURE,iterations=2)
result=rgba.copy();result[:,:,3]=np.where(mask,alpha,0).astype(np.uint8)
CLEAN.parent.mkdir(parents=True,exist_ok=True);PROOFS.mkdir(parents=True,exist_ok=True)
Image.fromarray(result,'RGBA').save(CLEAN)
proof_files=[]
for name,color in [('light',(245,245,245,255)),('dark',(24,26,37,255))]:
    bg=Image.new('RGBA',(result.shape[1],result.shape[0]),color)
    bg.alpha_composite(Image.fromarray(result,'RGBA'))
    path=PROOFS/f'pose09-attempt6-components-clean-{name}.png'
    bg.convert('RGB').save(path);proof_files.append(str(path.relative_to(BASE.parents[2])))
clean_measure=measure(result[:,:,3])
record={
 'athlete':'piper-quickstep','clip':'dunk-scythe','pose':9,'attempt':6,
 'rawSource':str(RAW.relative_to(BASE.parents[2])),'rawSourceSha256':sha(RAW),
 'cleanedSource':str(CLEAN.relative_to(BASE.parents[2])),'cleanedSourceSha256':sha(CLEAN),
 'size':[result.shape[1],result.shape[0]],'componentConnectivity':'8-connected',
 'componentThresholdAlphaGreaterThan':64,'componentsBeforeCleanup':int(count),
 'retainedComponentLabel':keep,'retainedCorePixelCountAlphaGt64':int(sizes[keep]),
 'antialiasHalo':'Preserved all original source alpha within a two-pixel 8-connected dilation of the retained figure core.',
 'clearedNonzeroAlphaPixels':int(np.count_nonzero(alpha)-np.count_nonzero((alpha>0)&mask)),
 'cleanup':'Kept only the largest 8-connected alpha>64 figure core and its two-pixel source-alpha halo; all RGB/color was preserved and exterior alpha set to zero. No figure pixels were synthesized, recolored, moved, scaled, or redrawn. Raw source remains unchanged.',
 'proofFiles':proof_files,**clean_measure,
 'reviewStatus':'pending independent review; not eligible for assembly yet'
}
(BASE/'pose9-attempt6-layout.json').write_text(json.dumps(record,indent=2)+'\n')
prompt=BASE/'pose9-attempt6-prompt.md'
prov={'athlete':'piper-quickstep','clip':'dunk-scythe','pose':9,'attempt':6,
 'source':'imagegen','generationId':'exec-677024dd-6c34-43af-bea3-9d235cf1ce55',
 'generatedAtNote':'Timestamp and generation ID are from the imagegen output hint; source file was copied unchanged from /workspace/generated_images.',
 'promptFile':str(prompt.relative_to(BASE.parents[2])),
 'promptVerbatim':True,'referenceFiles':[],
 'c2paIdentifier':'urn:c2pa:b751b74a-00ea-44ae-b651-04de067f74ce',
 'rawSource':str(RAW.relative_to(BASE.parents[2])),'rawSourceSha256':sha(RAW),
 'rawSourceSize':[result.shape[1],result.shape[0]],'rawSourceMode':'RGBA',
 'layoutFile':str((BASE/'pose9-attempt6-layout.json').relative_to(BASE.parents[2])),
 'proofFiles':proof_files,'cleanup':record,'cleanedSource':str(CLEAN.relative_to(BASE.parents[2])),
 'cleanedSourceSha256':sha(CLEAN),'sourceReview':{'status':'candidate-cleaned-pending-parent-and-independent-review'},
 'eligibleForAssembly':False,
 'ball':'No ball is drawn; basketball remains on a separate Piper-specific runtime track.'}
(BASE/'pose9-attempt6-provenance.json').write_text(json.dumps(prov,indent=2)+'\n')
print(json.dumps({'rawSha256':sha(RAW),'cleanSha256':sha(CLEAN),'components':int(count),
 'retained':int(sizes[keep]),'margins':clean_measure['marginsLTRBpx'],'alphaZeroFraction':clean_measure['alphaZeroFraction']}))
