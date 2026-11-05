"""Composable sprite renderer. Generates individual layers and pose atlases."""
from collections import OrderedDict
from dataclasses import asdict
from PIL import Image,ImageDraw,ImageFont
from .geometry import canvas,magnify
from .components import render_layer,COMPONENTS
from .rig import Rig,IDLE


def render_parts(recipe,pose=IDLE[0]):
    rig=Rig(recipe,pose)
    return OrderedDict((key,render_layer(key,recipe,rig)) for key in rig.depth)


def render(recipe,pose=IDLE[0],disabled=(),include_layers=False):
    parts=render_parts(recipe,pose)
    out=canvas()
    for name,layer in parts.items():
        if name not in disabled:out=Image.alpha_composite(out,layer)
    if include_layers:return out,parts
    return out


def atlas(recipe,poses=IDLE,columns=3):
    rows=(len(poses)+columns-1)//columns
    sheet=canvas((columns*128,rows*192))
    for i,pose in enumerate(poses):sheet.alpha_composite(render(recipe,pose),(i%columns*128,i//columns*192))
    return sheet


def checker(size,cell=12):
    im=Image.new('RGB',size,'#343349');d=ImageDraw.Draw(im)
    for y in range(0,size[1],cell):
        for x in range(0,size[0],cell):
            if (x//cell+y//cell)%2==0:d.rectangle((x,y,x+cell-1,y+cell-1),fill='#3c3b55')
    return im


def matted(im,bg='#28263c',scale=2):
    base=Image.new('RGBA',im.size,bg);base.alpha_composite(im)
    return base.convert('RGB').resize((im.width*scale,im.height*scale),Image.Resampling.NEAREST)


def component_sheet(recipe,pose=IDLE[0],columns=5):
    # Shows isolated code component layers without transforming any final sprite pixels.
    _,parts=render(recipe,pose,include_layers=True)
    keys=list(parts)
    cw,ch=190,236; rows=(len(keys)+columns-1)//columns
    sheet=Image.new('RGB',(cw*columns,ch*rows),'#191923');d=ImageDraw.Draw(sheet)
    for i,name in enumerate(keys):
        xx=(i%columns)*cw;yy=(i//columns)*ch
        d.rounded_rectangle((xx+5,yy+5,xx+cw-5,yy+ch-5),radius=7,fill='#29283b',outline='#4b4764')
        pane=checker((128,192),8).convert('RGBA');pane.alpha_composite(parts[name]);pane=pane.convert('RGB')
        sheet.paste(pane,(xx+(cw-128)//2,yy+10))
        d.text((xx+10,yy+207),name.replace('_',' '),fill='#f0ebf1')
    return sheet


def validation_report(recipe):
    sheet=atlas(recipe)
    boxes=[];visible=[]
    for k in range(6):
        f=sheet.crop(((k%3)*128,(k//3)*192,(k%3+1)*128,(k//3+1)*192))
        alpha=f.getchannel('A'); boxes.append(alpha.getbbox()); visible.append(sum(v>0 for v in alpha.tobytes()))
    return {'frames':6,'cell':[128,192],'atlas':[384,384],'occupied_bounds':boxes,'visible_pixels':visible,
            'all_distinct':len(set(atlas(recipe).crop(((k%3)*128,(k//3)*192,(k%3+1)*128,(k//3+1)*192)).tobytes() for k in range(6)))==6}
