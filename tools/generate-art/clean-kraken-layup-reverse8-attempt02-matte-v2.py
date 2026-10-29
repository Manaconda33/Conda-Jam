from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/kraken-layup-reverse8-attempt02-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-layup-reverse8-attempt02'; POSES=OUT/'poses'; CW,CH,BASELINE=80,96,94
OUT.mkdir(parents=True,exist_ok=True); POSES.mkdir(parents=True,exist_ok=True)
im=Image.open(SOURCE).convert('RGBA'); rgba=np.asarray(im).copy(); rgb=rgba[:,:,:3].astype(np.float32)
# Estimate only the smooth generated backdrop; subject detail remains in the high-frequency residual.
bg=np.stack([ndimage.gaussian_filter(rgb[:,:,c],sigma=52,mode='nearest') for c in range(3)],axis=2)
diff=np.sqrt(((rgb-bg)**2).sum(axis=2)); atlas=Image.new('RGBA',(CW*4,CH*2),(0,0,0,0)); frames=[]; threshold=30
for i in range(8):
 col,row=i%4,i//4; x0,y0=col*384,row*512; x1,y1=x0+384,y0+512
 local=diff[y0:y1,x0:x1]; strong=local>threshold
 labels,n=ndimage.label(strong,structure=np.ones((3,3),dtype=np.uint8)); sizes=np.bincount(labels.ravel(),minlength=n+1)
 keep=np.zeros(strong.shape,dtype=bool)
 for cid in range(1,n+1):
  if sizes[cid]>=40: keep|=(labels==cid)
 keep=ndimage.binary_closing(keep,structure=np.ones((3,3),dtype=bool),iterations=1)
 keep=ndimage.binary_fill_holes(keep)
 # Grow a one-pixel antialias fringe while retaining original RGB values.
 fringe=ndimage.distance_transform_edt(~keep)<=1.0
 mask=keep|fringe
 crop=rgba[y0:y1,x0:x1].copy(); crop[:,:,3]=np.where(mask,255,0).astype(np.uint8)
 yy,xx=np.where(keep)
 if len(xx)<30000: raise RuntimeError(f'pose {i}: weak silhouette mask {len(xx)} pixels')
 bbox=(int(xx.min()),int(yy.min()),int(xx.max()+1),int(yy.max()+1)); pose=Image.fromarray(crop,'RGBA').crop(bbox)
 scale=min(72/pose.width,73/pose.height); w,h=round(pose.width*scale),round(pose.height*scale)
 if w>CW-8 or h>73: raise RuntimeError(f'pose {i} exceeds safe cell bounds: {w}x{h}')
 pose=pose.resize((w,h),Image.Resampling.NEAREST); ox,oy=(CW-w)//2,BASELINE-h; ax,ay=col*CW,row*CH; atlas.alpha_composite(pose,(ax+ox,ay+oy))
 pp=POSES/f'pose-{i:02d}-matte-v2.png'; pose.save(pp); cell=atlas.crop((ax,ay,ax+CW,ay+CH)); box=cell.getchannel('A').getbbox()
 frames.append({'index':i,'sourceCell':[x0,y0,384,512],'sourceFigureBoundsLocal':bbox,'thresholdRgbResidual':threshold,'retainedStrongPixels':int(keep.sum()),'droppedComponents':int((sizes[1:]<40).sum()),'scale':scale,'scaledSize':[w,h],'offset':[ox,oy],'baselineY':BASELINE,'marginsLTRB':[box[0],box[1],CW-box[2],CH-box[3]],'sha256':hashlib.sha256(pp.read_bytes()).hexdigest()})
atlas_path=OUT/'kraken-layup-reverse8-attempt02-runtime-candidate-matte-v2.png'; atlas.save(atlas_path)
for name,bgcolor in [('light',(238,240,245,255)),('dark',(28,24,40,255))]:
 board=Image.new('RGBA',(960,576),bgcolor)
 for i in range(8):
  x,y=(i%4)*CW,(i//4)*CH; board.alpha_composite(atlas.crop((x,y,x+CW,y+CH)).resize((240,288),Image.Resampling.NEAREST),((i%4)*240,(i//4)*288))
 board.convert('RGB').save(OUT/f'kraken-layup-reverse8-attempt02-{name}-matte-v2-preview-v2.png')
report={'status':'matte/layout trial only; source and cleanup review required before tracks','source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'atlas':str(atlas_path.relative_to(ROOT)),'atlasSha256':hashlib.sha256(atlas_path.read_bytes()).hexdigest(),'sourceDimensions':list(im.size),'backgroundEstimate':'RGB Gaussian blur sigma=52; color residual to smooth background','foregroundThreshold':threshold,'componentMinimum':40,'morphology':'3x3 binary close, fill holes, grow one-pixel fringe; preserve source RGB unchanged; nearest-neighbor fit to 80x96 cells, baseline y=94','rawPreserved':True,'frames':frames,'uniqueFrameHashes':len(set(f['sha256'] for f in frames)),'minimumMarginsLTRB':[min(f['marginsLTRB'][j] for f in frames) for j in range(4)]}
(OUT/'matte-layout-report-v2.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'atlas':str(atlas_path.relative_to(ROOT)),'unique':report['uniqueFrameHashes'],'margins':report['minimumMarginsLTRB'],'frames':[{'index':f['index'],'sourceFigureBoundsLocal':f['sourceFigureBoundsLocal'],'pixels':f['retainedStrongPixels']} for f in frames]},indent=2))
