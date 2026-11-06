"""Replace pose11 with its independently generated follow-through and pack J125."""
from collections import deque
from hashlib import sha256
from pathlib import Path
import json
import numpy as np
from PIL import Image

ROOT=Path(__file__).resolve().parents[2]
sheet_path=ROOT/'tools/generate-art/sources/j125-leo-dunk-scythe-attempt04-generated-raw.png'
pose_path=ROOT/'tools/generate-art/sources/j125-leo-dunk-scythe-pose11-attempt06-generated-raw.png'
composite_path=ROOT/'tools/generate-art/sources/j125-leo-dunk-scythe-attempt06-composite-cleaned.png'
atlas_path=ROOT/'public/assets/animation/leo-dunk-scythe-attempt06-right.webp'
layout_path=ROOT/'tools/generate-art/j125-leo-dunk-scythe-attempt06-layout.json'
preview_dir=ROOT/'tools/generate-art/previews'

def components(mask,min_pixels=1):
    seen=np.zeros(mask.shape,bool);out=[]
    for yy,xx in zip(*np.where(mask)):
        if seen[yy,xx]:continue
        q=deque([(int(yy),int(xx))]);seen[yy,xx]=True;pts=[]
        while q:
            y,x=q.popleft();pts.append((y,x))
            for ny in range(max(0,y-1),min(mask.shape[0],y+2)):
                for nx in range(max(0,x-1),min(mask.shape[1],x+2)):
                    if mask[ny,nx] and not seen[ny,nx]:seen[ny,nx]=True;q.append((ny,nx))
        if len(pts)>=min_pixels:
            ys=[p[0] for p in pts];xs=[p[1] for p in pts]
            out.append({'pixels':len(pts),'bbox':[min(xs),min(ys),max(xs)+1,max(ys)+1],'points':pts})
    return out

sheet=Image.open(sheet_path).convert('RGBA');sa=np.asarray(sheet);smask=sa[:,:,3]>=16
main=[c for c in components(smask,50)]
if len(main)!=15:raise ValueError(f'Expected 15 figures from attempt04; found {len(main)}')
by_index={}
for c in main:
    x0,y0,x1,y1=c['bbox'];cx=(x0+x1)/2;cy=(y0+y1)/2
    col=min(4,int(cx*5/sheet.width));row=min(2,int(cy*3/sheet.height));idx=row*5+col
    if idx in by_index:raise ValueError(f'Duplicate source cell {idx}')
    c['poseIndex']=idx;by_index[idx]=c
if set(by_index)!=set(range(15)):raise ValueError('Missing source pose')
pose=Image.open(pose_path).convert('RGBA');pa=np.asarray(pose);pc=sorted(components(pa[:,:,3]>=16,100),key=lambda c:c['pixels'],reverse=True)
if not pc:raise ValueError('Isolated pose11 has no opaque figure')
source_pose=pc[0];x0,y0,x1,y1=source_pose['bbox'];sprite=pose.crop((x0,y0,x1,y1))
maxw,maxh=240,280;sc=min(maxw/sprite.width,maxh/sprite.height);nw,nh=max(1,round(sprite.width*sc)),max(1,round(sprite.height*sc))
sprite=sprite.resize((nw,nh),Image.Resampling.NEAREST)
cell_x0,cell_y0=round(sheet.width/5),round(sheet.height*2/3);cell_w,cell_h=round(sheet.width/5),sheet.height-cell_y0
px=cell_x0+(cell_w-nw)//2;py=cell_y0+cell_h-nh-15
composite=np.zeros_like(sa)
for idx,c in by_index.items():
    if idx==11:continue
    for y,x in c['points']:composite[y,x]=sa[y,x]
composite[py:py+nh,px:px+nw]=np.asarray(sprite)
Image.fromarray(composite,'RGBA').save(composite_path)

cmask=composite[:,:,3]>=16;cc=components(cmask,50);poses={}
for c in cc:
    x0,y0,x1,y1=c['bbox'];cx=(x0+x1)/2;cy=(y0+y1)/2;idx=min(2,int(cy*3/composite.shape[0]))*5+min(4,int(cx*5/composite.shape[1]))
    if idx in poses:raise ValueError(f'Duplicate composite cell {idx}')
    c['poseIndex']=idx;poses[idx]=c
if set(poses)!=set(range(15)):raise ValueError(f'Composite pose assignment mismatch {sorted(poses)}')

atlas=Image.new('RGBA',(512,384),(0,0,0,0));frames=[];transforms=[]
for idx in range(15):
    c=poses[idx];x0,y0,x1,y1=c['bbox'];crop=Image.fromarray(composite[y0:y1,x0:x1]).convert('RGBA')
    sc=min(.21,66/crop.width,72/crop.height);w=max(1,round(crop.width*sc));h=max(1,round(crop.height*sc));fit=crop.resize((w,h),Image.Resampling.NEAREST)
    dx=(128-w)//2;dy=94-h;ax=(idx%4)*128;ay=(idx//4)*96
    atlas.alpha_composite(fit,(ax+dx,ay+dy));frames.append({'x':ax,'y':ay,'w':128,'h':96})
    transforms.append({'poseIndex':idx,'sourceBounds':c['bbox'],'sourceVisiblePixels':c['pixels'],'destinationRect':{'x':ax,'y':ay,'w':128,'h':96},'spriteBoundsWithinFrame':{'x':dx,'y':dy,'w':w,'h':h},'baselineY':94,'scale':round(sc,6),'filter':'nearest','margins':{'left':dx,'top':dy,'right':128-dx-w,'bottom':96-dy-h,'baselineClearance':94-dy-h}})
atlas.save(atlas_path,'WEBP',lossless=True,method=6)
for side,bgcolor in [('light',(242,244,248,255)),('dark',(22,24,30,255))]:
    bg=Image.new('RGBA',atlas.size,bgcolor);bg.alpha_composite(atlas);bg.convert('RGB').save(preview_dir/f'j125-attempt06-atlas-{side}.png')
    for idx in range(15):
        x=(idx%4)*128;y=(idx//4)*96;crop=atlas.crop((x,y,x+128,y+96)).resize((384,288),Image.Resampling.NEAREST)
        proof=Image.new('RGBA',crop.size,bgcolor);proof.alpha_composite(crop);proof.convert('RGB').save(preview_dir/f'j125-attempt06-atlas-frame{idx:02d}-{side}-3x.png')

layout={'athlete':'leo','clip':'dunk-scythe','direction':'right','src':'./public/assets/animation/leo-dunk-scythe-attempt06-right.webp','columns':4,'rows':4,'frames':frames,'sourceGrid':{'columns':5,'rows':3,'dimensions':[sheet.width,sheet.height]},'sourceImage':str(composite_path.relative_to(ROOT)),'rawSourceImage':str(sheet_path.relative_to(ROOT)),'pose11SourceImage':str(pose_path.relative_to(ROOT)),'rawSha256':sha256(sheet_path.read_bytes()).hexdigest(),'pose11RawSha256':sha256(pose_path.read_bytes()).hexdigest(),'sourceSha256':sha256(composite_path.read_bytes()).hexdigest(),'atlasSha256':sha256(atlas_path.read_bytes()).hexdigest(),'atlasDimensions':[512,384],'cellSize':[128,96],'baselineY':94,'packing':'Preserve attempt04 opaque figure components for poses 0–10 and12–14; replace only poseIndex11 with the independently generated pose11 attempt06 component, uniformly fit inside the source cell; discard alpha<16 residue/background; pack all 15 poses row-major into 128x96 cells at baseline94 with a shared nearest-neighbor cap of 0.21, max 66x72.','transforms':transforms,'prompt':'tools/generate-art/j125-leo-dunk-scythe-attempt04-action-edit-prompt.md','generationIds':['exec-24cfe1f0-f774-4e9d-af53-648408820184','exec-0c987f72-7e0a-4c1d-a78e-e61eb72a64c8'],'pose11Prompt':'tools/generate-art/j125-leo-dunk-scythe-pose11-attempt06-prompt.md','packingScript':'tools/generate-art/pack-j125-leo-dunk-scythe-attempt06-composite.py','reviewStatus':'independent packed art/layout review approved; track calibration pending'}
layout['provenance']={'sourceGeneration':'imagegen','generationIds':layout['generationIds'],'generatedAt':'2026-10-27','primaryPrompt':'tools/generate-art/j125-leo-dunk-scythe-attempt04-action-edit-prompt.md','pose11Prompt':layout['pose11Prompt'],'sourceImages':[{'path':str(sheet_path.relative_to(ROOT)),'sha256':layout['rawSha256'],'poseIndices':[0,1,2,3,4,5,6,7,8,9,10,12,13,14]},{'path':str(pose_path.relative_to(ROOT)),'sha256':layout['pose11RawSha256'],'poseIndex':11}],'compositeSourceImage':layout['sourceImage'],'compositeSha256':layout['sourceSha256'],'atlasSha256':layout['atlasSha256'],'cleanupReport':'tools/generate-art/j125-leo-dunk-scythe-attempt06-cleanup-report.json','packingScript':layout['packingScript'],'derivedProcessing':'Composite from two preserved ImageGen sources; only pose11 replaced with separately generated source pose; alpha>=16 cleanup and nearest-neighbor atlas packing.'}
layout_path.write_text(json.dumps(layout,indent=2)+'\n')
report={'sources':[{'path':str(sheet_path.relative_to(ROOT)),'sha256':sha256(sheet_path.read_bytes()).hexdigest(),'usedPoses':[i for i in range(15) if i!=11]},{'path':str(pose_path.relative_to(ROOT)),'sha256':sha256(pose_path.read_bytes()).hexdigest(),'usedPose':11,'isolatedComponentBounds':source_pose['bbox'],'isolatedVisiblePixels':source_pose['pixels'],'placedSourceCellRect':[px,py,px+nw,py+nh]}],'compositeSource':str(composite_path.relative_to(ROOT)),'compositeSha256':sha256(composite_path.read_bytes()).hexdigest(),'alphaThreshold':16,'retainedPoses':15,'framesRowMajor':True,'method':'Raw sheet and isolated frame source are unchanged. A new derived composite source uses source attempt04 frames except pose11, which is replaced by separately generated pose11 attempt06. Alpha>=16 components only; other residue removed.'}
(ROOT/'tools/generate-art/j125-leo-dunk-scythe-attempt06-cleanup-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'atlas':str(atlas_path.relative_to(ROOT)),'sha256':layout['atlasSha256'],'frames':len(frames),'pose11SourceRect':[px,py,px+nw,py+nh],'margins':[min(t['margins'][k] for t in transforms) for k in ('left','top','right','bottom')]},indent=2))
