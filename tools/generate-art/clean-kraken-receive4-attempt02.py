from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
HERE=ROOT/'tools/generate-art/previews/kraken-receive4-attempt02'
RAW=ROOT/'tools/generate-art/sources/kraken-receive4-attempt02-pose02-generated-raw.png'
PRIOR=ROOT/'tools/generate-art/previews/kraken-receive4-attempt01'
CW,CH,BASELINE=80,96,94
OUT=HERE/'kraken-receive4-attempt02-runtime-candidate.png'
POSES=HERE/'poses';POSES.mkdir(parents=True,exist_ok=True)
# Preserve all other original poses from reviewed attempt01; replace only the visually misaligned catch pose.
frames=[Image.open(PRIOR/'poses'/f'pose-{i:02d}-normalized.png').convert('RGBA') for i in range(4)]
im=Image.open(RAW).convert('RGBA');rgba=np.asarray(im);alpha=rgba[:,:,3]
labels,n=ndimage.label(alpha>=48,structure=np.ones((3,3),dtype=np.uint8));sizes=np.bincount(labels.ravel(),minlength=n+1);ids=[i for i in range(1,n+1) if sizes[i]>=100_000]
if len(ids)!=1:raise RuntimeError(f'Expected one strong pose, found {len(ids)}')
y,x=np.where(labels==ids[0]);bounds=[int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)];x0,y0,x1,y1=bounds
main=labels[y0:y1,x0:x1]==ids[0];local=rgba[y0:y1,x0:x1].copy();distance=ndimage.distance_transform_edt(~main);keep=main|((local[:,:,3]>0)&(distance<=1.25));local[:,:,3]=np.where(keep,local[:,:,3],0)
crop=Image.fromarray(local,'RGBA');crop.save(POSES/'pose-02-catch-attempt02-source-crop.png')
scale=min(70/crop.height,70/crop.width);w,h=round(crop.width*scale),round(crop.height*scale)
pose=crop.resize((w,h),Image.Resampling.NEAREST);cell=Image.new('RGBA',(CW,CH),(0,0,0,0));cell.alpha_composite(pose,((CW-w)//2,BASELINE-h));frames[2]=cell;cell.save(POSES/'pose-02-catch-80x96.png')
for i,frame in enumerate(frames):frame.save(POSES/f'pose-{i:02d}-normalized.png')
atlas=Image.new('RGBA',(CW*2,CH*2),(0,0,0,0))
for i,frame in enumerate(frames):atlas.alpha_composite(frame,((i%2)*CW,(i//2)*CH))
atlas.save(OUT)
layout_frames=[]
for i,frame in enumerate(frames):
 b=frame.getchannel('A').getbbox();layout_frames.append({'index':i,'slot':[i%2,i//2],'x':i%2*CW,'y':i//2*CH,'w':CW,'h':CH,'bboxInCellLTRB':list(b),'marginsLTRB':[b[0],b[1],CW-b[2],CH-b[3]],'baselineY':BASELINE,'alphaHash':hashlib.sha256(frame.getchannel('A').tobytes()).hexdigest(),'pixelHash':hashlib.sha256(frame.tobytes()).hexdigest()})
for theme,bg in [('light',(238,240,245,255)),('dark',(28,24,40,255))]:
 board=Image.new('RGBA',(CW*2,CH*2),bg)
 for i,frame in enumerate(frames):board.alpha_composite(frame,((i%2)*CW,(i//2)*CH))
 board.convert('RGB').save(HERE/f'kraken-receive4-attempt02-{theme}-native.png');board.resize((CW*8,CH*8),Image.Resampling.NEAREST).convert('RGB').save(HERE/f'kraken-receive4-attempt02-{theme}-nearest4x.png')
layout={'status':'candidate source composite; independent review and track calibration pending','athlete':'kraken','clip':'receive','attempt':2,'columns':2,'rows':2,'frameSize':[CW,CH],'baselineY':BASELINE,'durations':[2,2,1,3],'catchFrame':2,'catchTick':4,'ballBakedIn':False,'atlas':str(OUT.relative_to(ROOT)),'atlasSha256':hashlib.sha256(OUT.read_bytes()).hexdigest(),'lineage':{'frames':[0,1,3],'source':'tools/generate-art/sources/kraken-receive4-attempt01-generated-raw.png','generationId':'exec-73626bfe-e2fb-4dc5-8768-f297ab8edbdf','priorLayout':'tools/generate-art/previews/kraken-receive4-attempt01/layout.json','frame2Source':str(RAW.relative_to(ROOT)),'frame2Prompt':'tools/generate-art/kraken-receive4-attempt02-pose02-imagegen-prompt.txt','frame2GenerationId':'not exposed by the image-generation tool response','frame2SourceSha256':hashlib.sha256(RAW.read_bytes()).hexdigest(),'sourceBoundsLTRB':bounds,'cropSha256':hashlib.sha256((POSES/'pose-02-catch-attempt02-source-crop.png').read_bytes()).hexdigest(),'scale':scale,'outputSize':[w,h]},'frames':layout_frames}
(HERE/'layout.json').write_text(json.dumps(layout,indent=2)+'\n')
print(json.dumps({'sourceBounds':bounds,'cropSize':crop.size,'scaledSize':[w,h],'scale':scale,'frame2Margins':layout_frames[2]['marginsLTRB'],'uniqueFrames':len({f['pixelHash'] for f in layout_frames}),'atlas':str(OUT.relative_to(ROOT))},indent=2))
