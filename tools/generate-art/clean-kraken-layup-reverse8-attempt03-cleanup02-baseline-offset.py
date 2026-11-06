"""Shift reviewed reverse-layup candidates up 2 source pixels and compensate baseline metadata."""
from pathlib import Path
from hashlib import sha256
import json
from PIL import Image

root = Path(__file__).resolve().parents[2]
src_path = root / 'tools/generate-art/previews/kraken-layup-reverse8-attempt03/kraken-layup-reverse8-attempt03-runtime-candidate.png'
out = root / 'tools/generate-art/previews/kraken-layup-reverse8-attempt03/cleanup02-baseline-offset'
out.mkdir(parents=True, exist_ok=True)
src = Image.open(src_path).convert('RGBA')
cell_w, cell_h, cols, rows, shift, baseline = 80, 96, 4, 2, 2, 92
atlas = Image.new('RGBA', (cell_w * cols, cell_h * rows), (0,0,0,0))
frames=[]
for i in range(8):
 col,row=i%cols,i//cols
 cell=src.crop((col*cell_w,row*cell_h,(col+1)*cell_w,(row+1)*cell_h))
 shifted=Image.new('RGBA',(cell_w,cell_h),(0,0,0,0)); shifted.alpha_composite(cell,(0,-shift))
 atlas.alpha_composite(shifted,(col*cell_w,row*cell_h))
 box=shifted.getchannel('A').getbbox()
 margins=[box[0],box[1],cell_w-box[2],cell_h-box[3]]
 frames.append({'frame':i,'x':col*cell_w,'y':row*cell_h,'w':cell_w,'h':cell_h,'baselineY':baseline,'alphaBounds':list(box),'marginsLTRB':margins,'shiftSourcePixels':-shift})
atlas_path=out/'kraken-layup-reverse8-attempt03-cleanup02-atlas.png'; atlas.save(atlas_path)
for name,bg in [('light',(238,241,246,255)),('dark',(27,23,39,255))]:
 preview=Image.new('RGBA',(640,384),bg)
 for f in frames:
  cell=atlas.crop((f['x'],f['y'],f['x']+cell_w,f['y']+cell_h)).resize((160,192),Image.Resampling.NEAREST)
  preview.alpha_composite(cell,((f['frame']%4)*160,(f['frame']//4)*192))
 preview.convert('RGB').save(out/f'kraken-layup-reverse8-attempt03-cleanup02-{name}-preview.png')
report={'athlete':'kraken','clip':'layup-reverse','attempt':'source attempt03 cleanup02','status':'baseline-preserving margin cleanup candidate; independent review required','source':str(src_path.relative_to(root)),'sourceSha256':sha256(src_path.read_bytes()).hexdigest(),'atlas':str(atlas_path.relative_to(root)),'atlasSha256':sha256(atlas_path.read_bytes()).hexdigest(),'cellSize':[cell_w,cell_h],'frameCount':8,'shiftPixelsUp':shift,'baselineMetadata':baseline,'baselineExplanation':'Original accepted-at-source candidate baseline y=94 had 2px bottom margin. Shift all pixels up 2px (baseline y=92) to create 4px bottom margin; runtime baseline metadata baselineY=92 adds a 2px downward compensation so the shoes remain on the same ground line. Must verify in standard loader.','minimumMarginsLTRB':[min(f['marginsLTRB'][j] for f in frames) for j in range(4)],'frames':frames,'rawPreserved':True}
(out/'layout.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'atlas':str(atlas_path.relative_to(root)),'minimumMarginsLTRB':report['minimumMarginsLTRB'],'hash':report['atlasSha256']}))
