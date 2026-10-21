"""Crop and uniformly downsample authored imagegen poses; never invent frames.
Originals remain in generated_images. Pillow/scipy inspect alpha; ImageMagick
packages 64x96 gameplay cells into WebP quality 88 with transparent padding.
"""
from pathlib import Path
import json, subprocess, tempfile
from PIL import Image
import numpy as np
from scipy.ndimage import label, find_objects
ROOT=Path('/workspace/Conda-Jam'); SOURCE=Path('/workspace/generated_images')
SOURCES={
 'idle':[('exec-41dfccf1-593b-4e95-987b-c369f7d0e55d.png',3,2,6)],
 'run':[('exec-0e14fa38-2e43-4949-9096-5f4fed1a42f6.png',4,3,12)],
 'dribble-run':[('exec-54e941b2-5c28-4350-bd89-9fd4df08e2f8.png',4,3,12)],
 'idle-ball':[('exec-6a505d21-292d-443b-a76e-124c01d690f8.png',2,2,4)],
 'dribble':[('exec-dc4e1fc9-20c5-485a-aca0-9076f5e45c93.png',4,2,8),('exec-050205bc-ec9a-4e1b-8e15-3732aff1e26f.png',2,1,2)],
}
GRIDS={'idle':(3,2),'run':(4,3),'dribble-run':(4,3),'idle-ball':(2,2),'dribble':(5,2)}
def inspect_source(spec):
 filename,cols,rows,count=spec; src=SOURCE/filename
 im=Image.open(src); assert im.mode=='RGBA'
 alpha=np.array(im.getchannel('A')); assert alpha.min()==0 and alpha.max()>240
 components,n=label(alpha>64); rects=[]
 for i,s in enumerate(find_objects(components)):
  if s and (components[s]==i+1).sum()>10000:
   x,y=s[1].start,s[0].start; right,bottom=s[1].stop,s[0].stop
   assert x>0 and y>0 and right<im.width and bottom<im.height,'Clipped main component'
   rects.append(dict(sourceImage=str(src),x=max(0,x-2),y=max(0,y-2),w=min(im.width,right+2)-max(0,x-2),h=min(im.height,bottom+2)-max(0,y-2)))
 assert len(rects)==count,(filename,len(rects))
 rects.sort(key=lambda r:r['y']+r['h']/2)
 return [r for k in range(rows) for r in sorted(rects[k*cols:(k+1)*cols],key=lambda r:r['x'])]
def package(name,sources):
 groups=[inspect_source(source) for source in sources]
 base_height=sum(r['h'] for r in groups[0])/len(groups[0])
 rects=[]
 for group in groups:
  source_scale=base_height/(sum(r['h'] for r in group)/len(group))
  rects.extend(dict(r,sourceScale=source_scale) for r in group)
 if name in ('run','dribble-run'):rects=rects[:11]
 cols,rows=GRIDS[name];cw,ch=64,96
 scale=min(60/max(r['w']*r['sourceScale'] for r in rects),92/max(r['h']*r['sourceScale'] for r in rects))
 target=ROOT/'public/assets/animation'/f'manaconda-{name}-right.webp'
 with tempfile.TemporaryDirectory(prefix='manaconda-') as folder:
  files=[]
  # One uniform scale per authored source sheet; retain pose size variation.
  for k,r in enumerate(rects):
   dst=str(Path(folder)/f'{k:02d}.png');files.append(dst)
   subprocess.run(['convert',r['sourceImage'],'-crop',f"{r['w']}x{r['h']}+{r['x']}+{r['y']}",'+repage','-filter','Lanczos','-resize',f"{max(1,round(r['w']*scale*r['sourceScale']))}x{max(1,round(r['h']*scale*r['sourceScale']))}!",'-background','none','-gravity','south','-extent',f'{cw}x{ch}',dst],check=True)
  atlas=str(Path(folder)/'atlas.png')
  subprocess.run(['montage',*files,'-tile',f'{cols}x{rows}','-geometry','+0+0','-background','none',atlas],check=True)
  subprocess.run(['convert',atlas,'-background','black','-alpha','background','-alpha','on','-quality','88','-define','webp:alpha-quality=100',str(target)],check=True)
 frames=[dict(x=(k%cols)*cw,y=(k//cols)*ch,w=cw,h=ch) for k in range(len(rects))]
 return dict(athlete='manaconda',direction='right',clip=name,src='./'+str(target.relative_to(ROOT)),columns=cols,rows=rows,frames=frames,provenance=dict(prompt='tools/generate-art/manaconda-prompts.md',generatedAt='2026-10-21T02:18:00Z',sourceRects=rects,packaging='Uniform per-source fit within 60x92 into 64x96 transparent cells; WebP quality88'))
if __name__=='__main__':
 layouts=[package(n,s) for n,s in SOURCES.items()]
 (ROOT/'tools/generate-art/manaconda-layouts.json').write_text(json.dumps(layouts,indent=2)+'\n')
 print(json.dumps([{k:v for k,v in l.items() if k in ('clip','src','columns','rows')}|{'frames':len(l['frames'])} for l in layouts]))
