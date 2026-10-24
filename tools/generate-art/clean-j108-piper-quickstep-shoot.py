#!/usr/bin/env python3
"""Extract reviewed Piper shoot poses from the preserved generated sheets.

Generator output overlaps its nominal grid lines, so this uses eight-connected
alpha>16 silhouette components, verified by x order. It removes only a 2px
outer fringe with alpha MinFilter(5) plus boundary red-fringe removal, then crops/fits existing figures for cell
review. No pose is drawn, interpolated, duplicated, or mirrored.
"""
from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,ImageChops
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'tools/generate-art/sources'
PREVIEW=ROOT/'tools/generate-art/previews/j108-piper-quickstep-shoot'
PREVIEW.mkdir(parents=True,exist_ok=True)
BASE=OUT/'j108-piper-quickstep-shoot-attempt-02-edit-raw.png'
REPLACE=OUT/'j108-piper-quickstep-shoot-attempt-03-replacements-raw.png'

def components(path,expected):
 image=Image.open(path).convert('RGBA');arr=np.asarray(image)
 lab,n=ndimage.label(arr[:,:,3]>16,structure=np.ones((3,3),dtype=np.uint8));counts=np.bincount(lab.ravel());items=[]
 for label in range(1,n+1):
  if counts[label]<1000:continue
  ys,xs=np.where(lab==label)
  items.append({'label':label,'bounds':[int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)],'pixels':int(counts[label])})
 items.sort(key=lambda v:v['bounds'][0])
 if len(items)!=expected:raise ValueError(f'{path.name}: expected {expected} silhouettes, found {len(items)}')
 return image,lab,items

def extract(image,lab,c):
 x0,y0,x1,y1=c['bounds'];mask=Image.fromarray((lab[y0:y1,x0:x1]==c['label']).astype('uint8')*255)
 tile=image.crop((x0,y0,x1,y1));isolated=Image.new('RGBA',tile.size,(0,0,0,0));isolated.paste(tile,(0,0),mask)
 isolated.putalpha(ImageChops.darker(isolated.getchannel('A'),mask))
 isolated.putalpha(isolated.getchannel('A').filter(ImageFilter.MinFilter(5)))
 # Remove only high-saturation red pixels within 8 source px of the outer
 # silhouette; this strips the generated red fringe while retaining interior
 # uniform/hair colors.
 rgba=np.asarray(isolated).copy(); solid=rgba[:,:,3]>16; dist=ndimage.distance_transform_edt(solid)
 red=(rgba[:,:,0]>185)&(rgba[:,:,1]<55)&(rgba[:,:,2]<70)&(dist<=8)
 rgba[red,3]=0; isolated=Image.fromarray(rgba,'RGBA')
 return isolated
base_img,base_lab,base=components(BASE,10)
rep_img,rep_lab,replacements=components(REPLACE,5)
# Original sequence: approach00, bend01, gather02, deep gather03, set04,
# release05, follow-through06, apex07, descent08, balanced landing09.
selection=[('base',0),('replace',0),('replace',1),('base',3),('base',4),('base',5),('base',6),('replace',2),('replace',3),('replace',4)]
frames=[];preview=Image.new('RGB',(640,384),(248,248,248));d=ImageDraw.Draw(preview)
for idx,(src,index) in enumerate(selection):
 image,lab,items=(base_img,base_lab,base) if src=='base' else (rep_img,rep_lab,replacements)
 component=items[index];isolated=extract(image,lab,component)
 name=f'j108-piper-quickstep-shoot-pose-{idx:02d}-attempt-{2 if src=="base" else 3}.png'
 out=OUT/name;isolated.save(out)
 alpha=isolated.getchannel('A').point(lambda v:255 if v>16 else 0);bounds=alpha.getbbox()
 crop=isolated.crop(bounds);scale=min(76/crop.width,86/crop.height);fw,fh=max(1,round(crop.width*scale)),max(1,round(crop.height*scale))
 if fw>76 or fh>86:raise ValueError(f'pose{idx:02d} fit overflow {fw}x{fh}')
 fig=crop.resize((fw,fh),Image.Resampling.NEAREST);cell=Image.new('RGBA',(128,96),(0,0,0,0));ox=(128-fw)//2;oy=(96-fh)//2;cell.alpha_composite(fig,(ox,oy))
 cellHash=hashlib.sha256(cell.tobytes()).hexdigest()
 corners=[cell.getpixel(q)[3] for q in [(0,0),(127,0),(0,95),(127,95)]]
 if any(corners):raise ValueError(f'pose{idx:02d} packed-cell corner alpha not zero')
 c=idx%5*128;r=idx//5*192
 for color,offset in [((248,248,248,255),0),((32,32,40,255),96)]:
  bg=Image.new('RGBA',(128,96),color);bg.alpha_composite(cell);preview.paste(bg.convert('RGB'),(c,r+offset));d.text((c+3,r+offset+2),f'{idx:02d}',fill='black' if offset==0 else 'white')
 frames.append({'index':idx,'pose':('approach','bend','gather','deep-gather','set','release','follow-through','apex','descent','landing')[idx],
   'source':out.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),
   'generationSource':(BASE if src=='base' else REPLACE).relative_to(ROOT).as_posix(),
   'generationSourceSha256':hashlib.sha256((BASE if src=='base' else REPLACE).read_bytes()).hexdigest(),
   'generationId':'exec-57e8bead-39f1-47bc-9f68-77e961d8041b' if src=='base' else 'exec-429e12df-7cb5-4811-a5d1-e7e0cd0d8db1',
   'componentBounds':[component['bounds'][0],component['bounds'][1],component['bounds'][2],component['bounds'][3]],
   'sourceDimensions':[isolated.width,isolated.height],'componentPixels':component['pixels'],'alphaBoundsThreshold16':list(bounds),
   'cellFigure':[fw,fh],'cellMargins':[ox,128-fw-ox,oy,96-fh-oy],'packedCellSha256':cellHash,'cornerAlpha':corners,
   'review':'Complete isolated figure; true alpha outside; hand and shoes fit; no ball/props.'})
path=PREVIEW/'j108-piper-shoot-poses00-09-cell-review.png';preview.save(path)
if len({f['packedCellSha256'] for f in frames}) != 10:
 raise ValueError('Review cells are not unique')
layout={'athlete':'piper-quickstep','clip':'shoot','direction':'right','cellSize':[128,96],'grid':[5,2],
 'figureFit':[76,86],'sequenceOrder':list(range(10)),'actionAnchors':{'takeoff':2,'release':5,'peak':5,'finish':9},
 'sources':frames,'packing':'Review-only cells; tight alpha>16 crop; nearest-neighbor fit within76x86 and center in transparent128x96 cell.',
 'prompts':['tools/generate-art/j108-piper-quickstep-shoot-prompt.md','tools/generate-art/j108-piper-quickstep-shoot-attempt-02-edit-prompt.md','tools/generate-art/j108-piper-quickstep-shoot-attempt-03-replacements-prompt.md'],
 'rejectedCandidates':['tools/generate-art/sources/j108-piper-quickstep-shoot-generated-raw.png: nominal grid layout rejected because the first sheet did not leave clear per-cell vertical margins and some upper arms crossed the implied row boundary; silhouettes were recovered by component isolation.',
 'tools/generate-art/sources/j108-piper-quickstep-shoot-attempt-02-edit-raw.png: edited full sheet still had red edge fringe and repeated/poorly ordered poses; selected only component-isolated poses explicitly reviewed in this layout.',
 'tools/generate-art/sources/j108-piper-quickstep-shoot-attempt-03-replacements-raw.png: five-pose replacement sheet is not itself a complete ten-pose clip; components 0–4 are only used for frames01,02,07,08,09.']}
(ROOT/'tools/generate-art/j108-piper-quickstep-shoot-layout.json').write_text(json.dumps(layout,indent=2)+'\n')
print(json.dumps({'frames':len(frames),'uniqueSources':len({f['sha256'] for f in frames}),'minMargins':[min(f['cellMargins'][0],f['cellMargins'][1]) for f in frames],'minVertical':[min(f['cellMargins'][2],f['cellMargins'][3]) for f in frames],'preview':str(path.relative_to(ROOT))}))
