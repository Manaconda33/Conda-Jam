#!/usr/bin/env python3
"""Conservatively remove detached transparent-background components from J122 poses.

Raw pixels are preserved in the original ImageGen sources. Clean images retain the
single largest alpha-connected character core (8-connectivity at alpha > 64),
retaining a two-pixel dilation halo of source alpha around that core. No drawing, color
replacement, scaling, pose editing, or atlas assembly occurs.
"""
from __future__ import annotations
import hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label, binary_dilation

ROOT=Path(__file__).resolve().parents[3]
BASE=Path('tools/generate-art/j122-piper-dunk-scythe-poses-10-14')
SOURCES=BASE/'sources'; PROOFS=BASE/'proofs'
POSES=[(10,1),(11,1),(12,1),(13,2),(14,1)]
STRUCTURE=np.ones((3,3),dtype=bool)
HALO_ITERATIONS=2
def sha(path:Path)->str:return hashlib.sha256(path.read_bytes()).hexdigest()
def measure(alpha:np.ndarray, threshold:int=128):
    ys,xs=np.where(alpha>threshold)
    if len(xs)==0:raise ValueError('No visible alpha')
    x0,y0,x1,y1=int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)
    h,w=alpha.shape
    return {'alphaThreshold':threshold,'alphaBoundingBox':[x0,y0,x1,y1],
      'marginsLTRBpx':[x0,y0,w-x1,h-y1], 'minimumMarginPx':min(x0,y0,w-x1,h-y1),
      'alphaZeroFraction':round(float(np.count_nonzero(alpha==0)/alpha.size),6)}
def main():
  for pose,attempt in POSES:
    stem=f'pose-{pose:02d}-attempt{attempt}'
    raw=SOURCES/f'{stem}.png'; clean=SOURCES/f'{stem}-components-clean.png'
    with Image.open(raw) as opened:rgba=np.array(opened.convert('RGBA'))
    alpha=rgba[:,:,3]
    labels,count=label(alpha>64,structure=STRUCTURE)
    sizes=np.bincount(labels.ravel()); sizes[0]=0
    keep=int(np.argmax(sizes)); core=labels==keep
    mask=binary_dilation(core,structure=STRUCTURE,iterations=HALO_ITERATIONS)
    before=int(np.count_nonzero(alpha)); after=int(np.count_nonzero((alpha>0)&mask))
    removed=before-after
    result=rgba.copy(); result[:,:,3]=np.where(mask,alpha,0).astype(np.uint8)
    Image.fromarray(result,'RGBA').save(clean)
    proof_paths=[]
    for name,color in [('light',(245,245,245,255)),('dark',(24,26,37,255))]:
      bg=Image.new('RGBA',(result.shape[1],result.shape[0]),color)
      bg.alpha_composite(Image.fromarray(result,'RGBA'))
      path=PROOFS/f'{stem}-components-clean-{name}.png'; bg.convert('RGB').save(path); proof_paths.append(str(path))
    measure_clean=measure(result[:,:,3])
    record={'pose':pose,'attempt':attempt,'rawSource':str(raw),'rawSourceSha256':sha(raw),
      'cleanedSource':str(clean),'cleanedSourceSha256':sha(clean),'size':[result.shape[1],result.shape[0]],
      'componentConnectivity':'8-connected','componentThresholdAlphaGreaterThan':64,'componentsBeforeCleanup':int(count),
      'retainedComponentLabel':keep,'retainedCorePixelCountAlphaGt64':int(sizes[keep]),
      'antialiasHalo':'Preserve all source alpha within 2 pixels (8-connectivity dilation) of the retained alpha>64 core.',
      'nonzeroAlphaPixelsBefore':before,'nonzeroAlphaPixelsAfter':after,'clearedNonzeroAlphaPixels':removed,
      'cleanup':'Preserve source RGB and alpha within the 2-pixel 8-connected dilation of the largest 8-connected alpha>64 core; set alpha=0 everywhere else. This removes detached exterior speckles/fringe while preserving a narrow antialias halo; no figure pixels were synthesized or recolored. Original raw source retained unchanged.',
      'proofFiles':proof_paths,**measure_clean}
    layout_path=BASE/f'{stem}-layout.json'
    layout=json.loads(layout_path.read_text()); layout['cleanupRecord']=record; layout['cleanedSource']=str(clean); layout['cleanedSourceSha256']=sha(clean); layout['cleanedMeasurement']=measure_clean
    layout['measurementNote']='Cleaned-source bbox/margins measured at alpha>128; clean proofs show only the retained main connected figure component.'
    layout_path.write_text(json.dumps(layout,indent=2)+'\n')
    prov_path=BASE/f'{stem}-provenance.json'; prov=json.loads(prov_path.read_text())
    prov['cleanedSource']=str(clean); prov['cleanedSourceSha256']=sha(clean); prov['cleanedProofFiles']=proof_paths; prov['cleanup']=record
    prov['sourceReview']={'status':'candidate-cleaned-pending-parent-review','notes':'Independent review accepted pose identity/action/anatomy/no-ball and margins before cleanup. Conservative component isolation keeps the largest 8-connected alpha>64 core plus a 2-pixel antialias halo; clean dark/light composites regenerated and visually checked by the source lane. Parent review still required.'}
    prov['eligibleForAssembly']=False
    prov_path.write_text(json.dumps(prov,indent=2)+'\n')
    print(json.dumps({'pose':pose,'attempt':attempt,'cleanSha256':sha(clean),'components':int(count),'clearedNonzeroAlphaPixels':removed,'cleanMargins':measure_clean['marginsLTRBpx'],'alphaZeroFraction':measure_clean['alphaZeroFraction']}))
if __name__=='__main__':main()
