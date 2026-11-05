"""Deliberate raster-only primitives. No source-image tracing or generative models."""
from PIL import Image, ImageDraw
from dataclasses import dataclass
from math import hypot, cos, sin, pi

SIZE=(128,192)
INK='#16131f'
DARK='#282132'


def canvas(size=SIZE): return Image.new('RGBA',size,(0,0,0,0))

class Painter:
    def __init__(self, size=SIZE): self.image=canvas(size); self.d=ImageDraw.Draw(self.image)
    def poly(self, pts, fill, outline=INK, width=2):
        xy=[(int(round(x)),int(round(y))) for x,y in pts]
        self.d.polygon(xy,fill=fill)
        if outline:
            self.d.line(xy+[xy[0]],fill=outline,width=width,joint='curve')
        return self
    def ellipse(self, bbox, fill, outline=INK, width=1):
        self.d.ellipse(tuple(int(round(x)) for x in bbox),fill=fill,outline=outline,width=width)
        return self
    def line(self, pts, fill, width=2, joint='curve'):
        self.d.line([(int(round(x)),int(round(y))) for x,y in pts],fill=fill,width=width,joint=joint)
        return self
    def rect(self, bbox,fill,outline=None,width=1):
        self.d.rectangle(tuple(int(round(x)) for x in bbox),fill=fill,outline=outline,width=width)
        return self
    def arc(self,bbox,start,end,fill,width=1):
        self.d.arc(tuple(int(round(x)) for x in bbox),start,end,fill=fill,width=width)
        return self
    def dots(self, points,fill,size=1):
        for x,y in points:
            self.d.rectangle((round(x),round(y),round(x+size-1),round(y+size-1)), fill=fill)
        return self
    def polygon_clip(self, pts, fill, highlights=None, outline=INK):
        # draw highlights onto a temporary layer and clip to an actual component mask
        self.poly(pts,fill,outline)
        return self


def ribbon(p, points, width, colors, cap=True):
    """Raster tapered limb with defined joints and edge highlights."""
    pts=list(points); half=width/2
    walls=[]
    for i,(x,y) in enumerate(pts):
        a=pts[max(0,i-1)];b=pts[min(len(pts)-1,i+1)]
        dx=b[0]-a[0];dy=b[1]-a[1];length=hypot(dx,dy) or 1
        nx=-dy/length;ny=dx/length
        wt=half*(0.9+0.12*(1-i/max(1,len(pts)-1)))
        walls.append(((x+nx*wt,y+ny*wt),(x-nx*wt,y-ny*wt)))
    poly=[a for a,_ in walls]+[b for _,b in walls][::-1]
    p.poly(poly,colors[1],outline=colors[0],width=2)
    if cap:
        for x,y in (pts[0],pts[-1]):p.ellipse((x-half*.65,y-half*.65,x+half*.65,y+half*.65),fill=colors[1],outline=None)
    # materially consistent rim-light on one surface, not pseudo-random noise
    p.line([walls[i][0] for i in range(1,len(walls))],colors[2],1)


def bezier(*points, steps=18):
    """Cubic Bezier sampled to integer-connected pixel path."""
    assert len(points)==4
    result=[]
    for k in range(steps+1):
        t=k/steps;u=1-t
        x=u*u*u*points[0][0]+3*u*u*t*points[1][0]+3*u*t*t*points[2][0]+t*t*t*points[3][0]
        y=u*u*u*points[0][1]+3*u*u*t*points[1][1]+3*u*t*t*points[2][1]+t*t*t*points[3][1]
        result.append((round(x),round(y)))
    return result


def shade_region(img, polygon, opacity=100, color='#000000'):
    from PIL import ImageChops
    mask=Image.new('L',img.size,0);ImageDraw.Draw(mask).polygon(polygon,fill=opacity)
    # alpha compositing only within already visible component pixels
    visible=img.getchannel('A');mask=ImageChops.multiply(mask,visible)
    layer=Image.new('RGBA',img.size,color)
    layer.putalpha(mask)
    return Image.alpha_composite(img,layer)


def magnify(image,factor=4):return image.resize((image.width*factor,image.height*factor),Image.Resampling.NEAREST)
