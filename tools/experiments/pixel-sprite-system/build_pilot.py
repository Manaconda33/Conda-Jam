#!/usr/bin/env python3
"""Build all artifacts, no inference, tracing or image-generation model calls."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from modular_sprite import MANACONDA,REED,edited,IDLE,render,atlas,component_sheet,validation_report
from modular_sprite.renderer import matted,checker
import hashlib,json
ROOT=Path(__file__).parent;OUT=ROOT/'outputs';OUT.mkdir(exist_ok=True)


def save(im,name):im.save(OUT/name,optimize=True);return im

def thumb(img,width=300,height=450):
    base=Image.new('RGB',(width,height),'#242337')
    im=img.copy(); im.thumbnail((width-20,height-50),Image.Resampling.NEAREST)
    bg=checker(img.size,12).convert('RGBA');bg.alpha_composite(img)
    bg=bg.convert('RGB').resize((img.width*2,img.height*2),Image.Resampling.NEAREST)
    if bg.width>width-18 or bg.height>height-40:
        bg.thumbnail((width-18,height-40),Image.Resampling.NEAREST)
    base.paste(bg,((width-bg.width)//2,(height-bg.height)//2))
    return base

base=save(render(MANACONDA), 'manaconda-modular-idle.png')
cycle=save(atlas(MANACONDA), 'manaconda-modular-idle6.png')
scale=save(base.resize((64,96),Image.Resampling.NEAREST),'manaconda-modular-64x96.png')
secondary=save(render(REED),'reed-ashcroft-modular-idle.png')
sibling=save(atlas(REED),'reed-ashcroft-modular-idle6.png')

# Intentionally change exactly one recipe property; remaining layers unchanged.
variants=[
 ('BASE',MANACONDA),
 ('THIN GLASSES',edited(MANACONDA,glasses_thickness=1)),
 ('DENSER BLOSSOMS',edited(MANACONDA,blossom_count=11)),
 ('LONGER SCARF',edited(MANACONDA,scarf_length=1.23)),
 ('LIGHTER BEARD',edited(MANACONDA,beard_fullness=.58)),
]
for label,cfg in variants[1:]:save(render(cfg),'edit-'+label.lower().replace(' ','-')+'.png')

parts=save(component_sheet(MANACONDA),'manaconda-component-debug.png')

font=ImageFont.load_default();labels=['BASE','THIN GLASSES','MORE BLOSSOMS','LONGER SCARF','LIGHTER BEARD']
board=Image.new('RGB',(5*220,420),'#1a1928');d=ImageDraw.Draw(board)
for i,(label,cfg) in enumerate(variants):
    bx=i*220
    d.rounded_rectangle((bx+7,12,bx+212,405),radius=11,fill='#29283c',outline='#4e466c',width=2)
    preview=matted(render(cfg),scale=2)
    board.paste(preview,(bx+(220-preview.width)//2,35))
    d.text((bx+15,373),labels[i],font=font,fill='#f2e7da')
save(board,'manaconda-edit-variants.png')

# A deliberate on-court-size proof. All samples are composed at exactly the same size.
court=Image.new('RGB',(4*270,340),'#1a1a29');d=ImageDraw.Draw(court)
examples=[('MANACONDA / NATIVE',base),('MANACONDA / GAME SCALE',scale),('REED / SAME RIG',secondary),('MANACONDA / IDLE FRAME 4',render(MANACONDA,IDLE[4]))]
for i,(title,im) in enumerate(examples):
    xx=i*270;d.rounded_rectangle((xx+8,8,xx+262,331),radius=10,fill='#27263a',outline='#4c4a63')
    enlarged=im.resize((im.width*2 if im.width==128 else 256,im.height*2 if im.height==192 else 384),Image.Resampling.NEAREST)
    if enlarged.height>284:enlarged=im.resize((round(im.width*1.48) if im.width==128 else 190,round(im.height*1.48) if im.height==192 else 284),Image.Resampling.NEAREST)
    patch=Image.new('RGBA',enlarged.size,'#34304a');patch.alpha_composite(enlarged.convert('RGBA'))
    court.paste(patch.convert('RGB'),(xx+(270-patch.width)//2,23))
    d.text((xx+16,312),title,font=font,fill='#ece9e1')
save(court,'modular-v1-overview.png')

# A visual six-frame strip for reviewers at 1:1 composition scale.
strip=Image.new('RGB',(6*182,250),'#1b1b2b');ds=ImageDraw.Draw(strip)
for i,pose in enumerate(IDLE):
    f=render(MANACONDA,pose)
    panel=Image.new('RGBA',(128,192),'#302e48');panel.alpha_composite(f)
    strip.paste(panel.convert('RGB'),(i*182+27,12))
    ds.text((i*182+21,216),pose.name,font=font,fill='#f0e6e2')
save(strip,'manaconda-idle6-preview.png')

report={'manaconda':validation_report(MANACONDA),'reed':validation_report(REED),'parts':list(__import__('modular_sprite.components',fromlist=['COMPONENTS']).COMPONENTS.keys()),
 'generator':'Python/Pillow raster primitives only; no image model, source-image tracing, or reference pixel reuse',
 'render_sha256':hashlib.sha256(base.tobytes()).hexdigest()}
(OUT/'validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))

# Export whole-cell modular atlases for the browser workbench. 19 component columns
# by six pose rows, one atlas per character. Hidden parts remain transparent.
from modular_sprite import render_parts
from modular_sprite.rig import Rig
PARTS=list(render_parts(MANACONDA).keys())
ALL_CHARS=[MANACONDA,REED]
workbench_manifest={
  'format':'conda-modular-sprite/v1',
  'cell':[128,192],
  'parts':PARTS,
  'poses':[p.name for p in IDLE],
  'characters':{},
  'variantDescriptions':{
    'default':'Canonical identity components',
    'thin-glasses':'Blue frame reduced from 2 px to 1 px',
    'more-blossoms':'Increase blossom clusters without modifying the crest trunk',
    'longer-scarf':'Extend the scarf tail while preserving the neck knot',
    'lighter-beard':'Shorter beard silhouette, same face and hair',
  }
}
for cfg in ALL_CHARS:
    sheet=Image.new('RGBA',(128*len(PARTS),192*len(IDLE)),(0,0,0,0))
    anchors={}
    for i,pose in enumerate(IDLE):
        layers=render_parts(cfg,pose)
        anchors[pose.name]=Rig(cfg,pose).anchors()
        for j,key in enumerate(PARTS):
            sheet.alpha_composite(layers[key],(j*128,i*192))
    img_file=f'parts-{cfg.id}.png';save(sheet,img_file)
    workbench_manifest['characters'][cfg.id]={
        'name':cfg.name,'atlas':'outputs/'+img_file,
        'anchors':anchors,'components':{key:render_parts(cfg)[key].getchannel('A').getbbox() is not None for key in PARTS}
    }
# Variants only contain the one affected layer at each pose.
variants_map=[
    ('thin-glasses','glasses',edited(MANACONDA,glasses_thickness=1)),
    ('more-blossoms','crest_front',edited(MANACONDA,blossom_count=11)),
    ('longer-scarf','scarf_back',edited(MANACONDA,scarf_length=1.23)),
    ('lighter-beard','beard',edited(MANACONDA,beard_fullness=.58)),
]
variant_sheet=Image.new('RGBA',(128*len(variants_map),192*len(IDLE)),(0,0,0,0))
for j,(key,part,cfg) in enumerate(variants_map):
    for i,pose in enumerate(IDLE):
        variant_sheet.alpha_composite(render_parts(cfg,pose)[part],(j*128,i*192))
save(variant_sheet,'parts-manaconda-variants.png')
workbench_manifest['characters']['manaconda']['variants']={key:{'part':part,'column':i} for i,(key,part,_) in enumerate(variants_map)}
workbench_manifest['characters']['manaconda']['variantAtlas']='outputs/parts-manaconda-variants.png'
(OUT/'workbench-manifest.json').write_text(json.dumps(workbench_manifest,indent=2)+'\n')

# Browser-ready workbench; all references are local to this experiment folder.
import html as html_module
html_text=(ROOT/'workbench.template.html').read_text()
html_text=html_text.replace('/*__MANIFEST__*/',json.dumps(workbench_manifest,separators=(',',':')))
(ROOT/'workbench.html').write_text(html_text)

# Human-readable summary from actual generated data.
report['component_columns']=len(PARTS)
report['workbench']={'characters':len(ALL_CHARS),'poses':len(IDLE),'edit_variants':len(variants_map),'baked_component_atlases':3}
(OUT/'validation.json').write_text(json.dumps(report,indent=2)+'\n')
print('Workbench atlas manifests and sprites generated.')

# Playback preview generated solely from the coded poses, not ImageGen.
for cfg in ALL_CHARS:
    pal=[]
    for index in [0,1,2,3,4,5,4,3,2,1]:
        img=render(cfg,IDLE[index])
        bg=Image.new('RGBA',img.size,'#302e45');bg.alpha_composite(img)
        pal.append(bg.convert('RGB').resize((384,576),Image.Resampling.NEAREST).quantize(colors=96))
    pal[0].save(OUT/f'{cfg.id}-modular-idle6.gif',save_all=True,append_images=pal[1:],duration=160,loop=0,disposal=2,optimize=True)
