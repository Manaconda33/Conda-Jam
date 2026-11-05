"""Independently rendered costume / anatomy / identity components.

Each component is a self-contained transparent RGBA layer, aligned through Rig anchors.
Rendering/pose changes never trace, crop, or paste existing generated character art.
"""
from .geometry import Painter,canvas,bezier,ribbon,INK,DARK
from PIL import Image
from math import sin,cos,pi

COMPONENTS={}

def component(name):
    def register(fn): COMPONENTS[name]=fn;return fn
    return register


def skin(c):return (INK,c.skin_shadow,c.skin,c.skin_light)

def bodyline(p,points,cols,thickness=10):ribbon(p,points,thickness,cols)

def pt(r,k,dx=0,dy=0):x,y=r[k];return(x+dx,y+dy)

def shape(p, pts, base, shadow=None, shine=None, outline=INK):
    p.poly(pts,base,outline)
    if shadow:p.poly(shadow,base if isinstance(shadow,str) else base,outline=None)
    if shine and isinstance(shine,tuple):p.line(shine[0],shine[1],shine[2] if len(shine)>2 else 1)


def moved(pts,dx=0,dy=0):return [(x+dx,y+dy)for x,y in pts]

@component('scarf_back')
def scarf_back(c,r):
    p=Painter();root=r['scarf_root'];dx,dy=root[0]-78,root[1]-66;wave=r.pose.scarf_wave
    if c.scarf=='none':return p.image
    L=c.scarf_length
    # Curved rectangular tails, not a generated fabric noise pattern.
    p.poly(moved([(70,68),(62,71),(51,78),(38,76),(27,80),(17,78),(9,85),(20,89),(29,88),(35,97),(46,89),(55,94),(68,77)],dx+(1-L)*28,dy+wave), '#322368',width=2)
    p.poly(moved([(67,71),(55,77),(41,81),(29,80),(17,84),(34,85),(45,86),(52,82),(67,77)],dx+(1-L)*23,dy+wave), '#6341a6',outline=None)
    p.poly(moved([(62,74),(49,77),(39,82),(27,82),(15,85),(37,84),(48,83),(61,78)],dx+(1-L)*23,dy+wave),'#8c66cc',outline=None)
    p.line(moved([(55,78),(44,83),(34,86),(20,85)],dx+(1-L)*23,dy+wave),'#b396e6',1)
    p.line(moved([(55,89),(45,86),(36,93),(28,90)],dx+(1-L)*24,dy+wave),'#2b214f',2)
    p.poly(moved([(58,78),(52,85),(44,87),(48,91),(60,87),(68,81)],dx,dy+wave),'#48318f',outline=None)
    return p.image

@component('crest_back')
def crest_back(c,r):
    p=Painter()
    if c.crest=='none':return p.image
    x,y=r['temple_back'];L=c.crest_length
    # Both branches rooted at the temples, bend backward and slightly downward.
    a=[(x,y),(x-8*L,y-3),(x-16*L,y-6),(x-23*L,y-4),(x-31*L,y-9)]
    b=[(x+4,y+3),(x-5*L,y+1),(x-13*L,y+3),(x-21*L,y+2)]
    p.line(a,INK,5);p.line(a,'#674329',3);p.line([a[1],a[2],a[3]],'#aa7650',1)
    p.line(b,INK,4);p.line(b,'#785138',2)
    for u,v,w in [(1,-5,-8),(2,-7,-11),(3,-3,-7)]:
        px,py=a[u]; p.line([(px,py),(px+3*L,py+w)],INK,3);p.line([(px,py),(px+3*L,py+w)],'#a4744b',1)
    for u in [1,2,3]:
        px,py=b[u];p.line([(px,py),(px-3*L,py+6)],'#7c563d',2)
    return p.image

@component('rear_leg')
def rear_leg(c,r):
    p=Painter();h=r['hip_rear'];k=r['knee_rear'];a=r['ankle_rear']
    p.poly([(h[0]-8,h[1]-1),(h[0]+9,h[1]),(k[0]+9,k[1]+2),(k[0]+4,k[1]+6),(k[0]-10,k[1]+1)],'#30234f')
    # compression fabric with articulated thigh/knee and calf, not rectangular posts
    p.poly([(h[0]-5,h[1]+5),(h[0]+7,h[1]+3),(k[0]+8,k[1]+1),(k[0]+2,k[1]+7),(k[0]-8,k[1]+5)], '#eeeaf1')
    p.poly([(k[0]-8,k[1]+3),(k[0]+6,k[1]+5),(a[0]+6,a[1]),(a[0]-6,a[1])], '#d5d3df')
    p.poly([(h[0]-4,h[1]+6),(h[0]-1,h[1]+8),(k[0]-3,k[1]-4),(k[0]-7,k[1]+2),(a[0]-5,a[1]-1),(a[0]-2,a[1]-1)], '#a19bab',outline=None)
    p.line([(k[0]+1,k[1]+9),(a[0]+3,a[1]-2)],'#faf9f3',2)
    p.ellipse((k[0]-3,k[1]-1,k[0]+6,k[1]+8),'#f1f1f4',outline='#9990ab')
    p.line([(h[0]+7,h[1]+12),(k[0]+6,k[1]-1)],'#847e92',2)
    return p.image

@component('front_leg')
def front_leg(c,r):
    p=Painter();h=r['hip_front'];k=r['knee_front'];a=r['ankle_front']
    p.poly([(h[0]-8,h[1]-1),(h[0]+9,h[1]),(k[0]+11,k[1]-1),(k[0]+6,k[1]+5),(k[0]-9,k[1]+6)],'#30234f')
    t='#494254' if c.tights=='dark' else '#f1f0f2'
    s='#262130' if c.tights=='dark' else '#c9c6d3'
    hi='#6f6374' if c.tights=='dark' else '#ffffff'
    p.poly([(h[0]-5,h[1]+4),(h[0]+7,h[1]+4),(k[0]+8,k[1]),(k[0]+5,k[1]+5),(k[0]-8,k[1]+6)],t)
    p.poly([(k[0]-8,k[1]+2),(k[0]+7,k[1]+4),(a[0]+7,a[1]+1),(a[0]-7,a[1]+1)],s)
    p.poly([(k[0]-5,k[1]+4),(k[0]+2,k[1]+7),(a[0]+4,a[1]-4),(a[0]-1,a[1]-4)],t,outline=None)
    p.line([(h[0]+3,h[1]+8),(k[0]+4,k[1]-4)],hi,2)
    p.line([(k[0]+3,k[1]+9),(a[0]+5,a[1]-1)],hi,2)
    p.ellipse((k[0]-3,k[1]-2,k[0]+8,k[1]+9),t,outline='#8b8599')
    return p.image

def shoe(r,front):
    p=Painter();a=r['ankle_front' if front else 'ankle_rear'];x,y=a
    lean=2 if front else -3
    # Low stepped profile with separated sole and toe, no giant block-shoe
    p.poly([(x-8,y-2),(x+7,y-2),(x+9,y+2),(x+16+lean,y+4),(x+19+lean,y+8),(x+19+lean,y+10),(x-15,y+10),(x-17,y+7),(x-13,y+2)], '#2d204e')
    p.poly([(x-7,y-1),(x+6,y-1),(x+10,y+5),(x+15+lean,y+6),(x+17+lean,y+7),(x-12,y+7)],'#6347ac',outline=None)
    p.poly([(x-3,y),(x+5,y),(x+7,y+3),(x+1,y+4),(x-7,y+3)],'#a58bdb',outline=None)
    p.line([(x-8,y+5),(x-1,y+7),(x+10,y+7)],'#d7b34c',2)
    p.rect((x-14,y+8,x+18+lean,y+9),'#f3e7da')
    p.line([(x-7,y+2),(x+5,y+3)],'#d0b9ef',1)
    p.line([(x-2,y+4),(x+4,y+5)],'#eee7f7',1)
    return p.image

@component('rear_shoe')
def rear_shoe(c,r):return shoe(r,False)
@component('front_shoe')
def front_shoe(c,r):return shoe(r,True)

@component('shorts')
def shorts(c,r):
    p=Painter();x,y=r['hip'];dark=c.jersey_dark;main=c.jersey_primary;hi=c.jersey_light;gold=c.jersey_trim
    p.poly([(x-16,y-9),(x+16,y-10),(x+18,y+6),(x+8,y+13),(x-1,y+10),(x-6,y+14),(x-18,y+8)],dark)
    p.poly([(x-14,y-9),(x+13,y-8),(x+14,y+4),(x+3,y+8),(x-2,y+5),(x-5,y+9),(x-14,y+5)],main,outline=None)
    p.poly([(x-7,y-8),(x+9,y-7),(x+12,y+2),(x+3,y+7)],hi,outline=None)
    p.line([(x-13,y+4),(x-5,y+7)],gold,2)
    p.line([(x+6,y+9),(x+14,y+6)],gold,2)
    p.line([(x-10,y-7),(x+12,y-6)],'#281c42',1)
    return p.image

@component('rear_arm')
def rear_arm(c,r):
    p=Painter();a=r['shoulder_rear'];e=r['elbow_rear'];w=r['wrist_rear'];s=skin(c)
    # Far arm passes behind jersey, bent naturally forward
    bodyline(p,[a,(a[0]-5,a[1]+10),e],(INK,s[2],s[3]),11 if c.build=='broad' else 9)
    bodyline(p,[e,(e[0]+1,e[1]+9),w],(INK,s[2],s[3]),9)
    p.line([(a[0]-6,a[1]+14),(e[0]-3,e[1]-3)],s[1],2)
    p.ellipse((w[0]-6,w[1]-4,w[0]+5,w[1]+8),s[2],outline=INK,width=2)
    p.line([(w[0]+1,w[1]+1),(w[0]+3,w[1]+5)],s[3],1)
    return p.image

@component('torso')
def torso(c,r):
    p=Painter();x,y=r['chest'];yb=r['hip'][1]
    sh0=r['shoulder_rear'];sh1=r['shoulder_front']; main=c.jersey_primary;deep=c.jersey_dark;hi=c.jersey_light;trim=c.jersey_trim
    # Controlled taper, three-quarter perspective and curved shoulder caps
    silhouette=[(sh0[0]-5,sh0[1]+2),(sh0[0]+2,sh0[1]-5),(x-9,y-11),(x+11,y-9),
                (sh1[0]-2,sh1[1]-5),(sh1[0]+5,sh1[1]+5),(x+17,y+17),
                (x+14,yb-5),(x+11,yb+3),(x-12,yb+3),(x-16,yb-3),(sh0[0]-7,y+19)]
    p.poly(silhouette,deep)
    p.poly([(sh0[0]+2,sh0[1]-2),(x-9,y-8),(x+11,y-6),(sh1[0]-1,sh1[1]-2),
            (x+12,y+16),(x+9,yb-2),(x+6,yb),(x-9,yb-1),(x-10,yb-7),(x-15,y+19)],main,outline=None)
    p.poly([(x-8,y-7),(x+7,y-5),(x+13,y+8),(x+8,y+19),(x+5,y+27),(x-2,y+22)],hi,outline=None)
    p.poly([(sh0[0]+3,sh0[1]+1),(x-11,y-3),(x-9,y+27),(x-8,yb-2),(x-14,yb-2),(x-17,y+9)],'#29204f',outline=None)
    p.poly([(x+10,y+20),(x+13,y+24),(x+10,yb-1),(x+6,yb-1)],'#4d348d',outline=None)
    # Jersey seams, fabric folds, high-contrast but no chaotic speckling.
    p.line([(x-10,y-4),(x-10,y+18),(x-6,y+26)],'#a77ce4',1)
    p.line([(x+9,y+10),(x+7,y+19),(x+9,y+26)],'#b297e4',1)
    p.line([(x-12,yb-3),(x+11,yb-2)],trim,2)
    p.line([(sh0[0]+3,sh0[1]-3),(x-8,y-8)],trim,2)
    p.line([(x+10,y-7),(sh1[0]+2,sh1[1])],trim,2)
    p.line([(x-5,y+34),(x-1,y+30)],'#39245e',2)
    return p.image

@component('front_arm')
def front_arm(c,r):
    p=Painter();a=r['shoulder_front'];e=r['elbow_front'];w=r['wrist_front'];s=skin(c)
    bodyline(p,[a,(a[0]+5,a[1]+13),e],(INK,s[2],s[3]),12 if c.build=='broad' else 10)
    p.line([(a[0]+3,a[1]+5),(e[0]+3,e[1]-6)],s[3],2)
    if c.white_sleeve:
        # white sleeve is part of the uniform, with a designed glove-free wrist break
        p.poly([(e[0]-6,e[1]-7),(e[0]+5,e[1]-8),(w[0]+5,w[1]-8),(w[0]+4,w[1]-3),(w[0]-5,w[1]-3)],'#bbb8d1')
        p.poly([(e[0]-3,e[1]-7),(e[0]+4,e[1]-8),(w[0]+3,w[1]-6),(w[0]-2,w[1]-4)],'#f4f3f0',outline=None)
        p.line([(e[0]+3,e[1]-7),(w[0]+2,w[1]-7)],'#ffffff',2)
        p.line([(e[0]-4,e[1]+1),(w[0]-4,w[1]-3)],'#8983a1',2)
    else:
        bodyline(p,[e,(e[0],e[1]+7),w],(INK,s[2],s[3]),9)
    p.ellipse((w[0]-6,w[1]-2,w[0]+6,w[1]+9),s[2],outline=INK,width=2)
    p.poly([(w[0]+2,w[1]+1),(w[0]+5,w[1]+3),(w[0]+3,w[1]+7)],s[3],outline=None)
    return p.image

@component('neck')
def neck(c,r):
    p=Painter();x,y=r['neck'];s=skin(c)
    p.poly([(x-8,y-7),(x+8,y-9),(x+10,y+13),(x-9,y+10)],s[1])
    p.poly([(x-5,y-7),(x+7,y-7),(x+4,y+8),(x-5,y+8)],s[2],outline=None)
    p.line([(x+3,y-4),(x+4,y+3)],s[3],2)
    return p.image

@component('head')
def head(c,r):
    p=Painter();x,y=r['head'];s=skin(c)
    # Face and ear are separate sculptural forms, useful for hair / facial hair swaps.
    p.poly([(x-11,y-15),(x-2,y-19),(x+11,y-17),(x+17,y-9),(x+18,y-2),
            (x+16,y+4),(x+20,y+6),(x+15,y+10),(x+14,y+16),(x+6,y+20),
            (x-4,y+17),(x-12,y+9),(x-16,y-1),(x-14,y-10)],s[1])
    p.poly([(x-9,y-13),(x-1,y-16),(x+10,y-13),(x+14,y-7),(x+13,y+4),
            (x+16,y+6),(x+11,y+12),(x+2,y+16),(x-5,y+12),(x-11,y+4),(x-11,y-7)],s[2],outline=None)
    p.poly([(x-6,y-11),(x,y-14),(x+10,y-11),(x+13,y-5),(x+9,y-3),(x+7,y+3),(x+1,y+8),(x-5,y+7)],s[3],outline=None)
    p.poly([(x+12,y-2),(x+19,y+4),(x+17,y+7),(x+12,y+6)],s[3],outline=None)
    p.ellipse((x-15,y-1,x-7,y+9),s[2],outline=INK,width=2)
    p.line([(x-12,y+1),(x-10,y+6)],s[3],1)
    p.line([(x+14,y-1),(x+17,y+3)],s[3],1)
    # Nose and cheek planar highlights, expression remains separate.
    p.line([(x+2,y+6),(x+11,y+8)],'#e7ae7e',2)
    p.dots([(x+8,y-6),(x-1,y-10),(x+12,y+2)],s[3],1)
    return p.image

@component('hair')
def hair(c,r):
    p=Painter();x,y=r['head']
    if c.hair=='salt-curls':
        p.poly([(x-17,y-7),(x-16,y-18),(x-11,y-24),(x-3,y-28),(x+7,y-27),
                (x+17,y-24),(x+19,y-15),(x+15,y-10),(x+12,y-16),
                (x+3,y-17),(x-5,y-15),(x-12,y-7),(x-13,y+3),(x-17,y+3)],'#22232d')
        # low-res individual curls constructed as discrete contours, not giant spherical hair
        for dx,dy,rx,ry in [(-16,-20,4,4),(-10,-26,6,5),(-3,-29,6,5),(5,-29,5,5),(12,-25,6,6),(18,-20,4,5),
                             (-15,-11,5,5),(-5,-20,6,5),(4,-20,5,5),(12,-17,5,4)]:
            p.ellipse((x+dx-rx//2,y+dy-ry//2,x+dx+rx,y+dy+ry),'#32303b',outline=None)
        for dx,dy in [(-12,-22),(-3,-26),(5,-26),(14,-21),(-8,-17),(6,-17),(-15,-10)]:
            p.line([(x+dx,y+dy),(x+dx+3,y+dy-1)],'#9d999d',2)
        for dx,dy in [(-4,-22),(2,-24),(9,-20),(-12,-17)]:p.line([(x+dx,y+dy),(x+dx+2,y+dy-2)],'#d0bdac',1)
        p.poly([(x+14,y-17),(x+18,y-15),(x+17,y-8),(x+15,y-4),(x+13,y-7)],'#28222d',outline=None)
    elif c.hair=='braids-topknot':
        p.poly([(x-16,y-9),(x-12,y-21),(x-7,y-24),(x+10,y-25),(x+16,y-17),(x+14,y-7),
                (x+8,y-10),(x-4,y-12),(x-11,y-4)],'#1b1925')
        p.ellipse((x+0,y-29,x+16,y-17),'#1e182a')
        for j in range(5):
            p.line([(x-11+j*5,y-20),(x-7+j*5,y-15)],'#655279',2)
            p.line([(x-13+j*5,y-16),(x-9+j*5,y-12)],'#302a44',2)
        p.line([(x+5,y-28),(x+10,y-25)],'#b58fb8',1)
    return p.image

@component('beard')
def beard(c,r):
    p=Painter();x,y=r['head'];F=c.beard_fullness
    if c.beard=='full-salt':
        low=y+15+int(F*10)
        p.poly([(x-14,y+7),(x-8,y+9),(x-2,y+12),(x+9,y+9),(x+16,y+8),
               (x+14,y+15),(x+10,y+19),(x+5,low),(x-1,low+2),(x-9,low-2),(x-15,y+17)],'#26222b')
        p.poly([(x-9,y+12),(x-3,y+13),(x+6,y+13),(x+10,y+16),(x+5,low-1),
                (x-2,low),(x-9,y+18)],'#46404a',outline=None)
        # restrained silvery barber-streaks, each on geometry rather than texture noise
        for a,b,c1,d in [(-11,12,-9,17),(-6,14,-6,22),(-2,15,-3,25),(3,15,4,23),(8,13,10,20)]:
            p.line([(x+a,y+b),(x+c1,y+d)],'#a39ca1',2)
        p.line([(x-2,y+18),(x+1,low)],'#d6c4bc',1)
        p.line([(x+6,y+16),(x+8,y+21)],'#d1bebb',1)
        # distinguish moustache, mouth and soul patch
        p.poly([(x-4,y+8),(x+4,y+7),(x+12,y+9),(x+10,y+12),(x+4,y+12),(x-4,y+12)],'#2d2831',outline=None)
        p.line([(x+4,y+14),(x+10,y+14)],'#af7d60',1)
    elif c.beard=='short-goatee':
        p.poly([(x+0,y+11),(x+10,y+11),(x+9,y+17),(x+5,y+21),(x+1,y+17)],'#27202c')
        p.line([(x+5,y+11),(x+11,y+12)],'#27202c',2)
        p.dots([(x+1,y+10),(x+4,y+15)],'#655159',1)
    return p.image

@component('crest_front')
def crest_front(c,r):
    p=Painter()
    if c.crest=='none':return p.image
    x,y=r['temple_front'];L=c.crest_length
    # Closer temple limb follows a compact diagonal at skull height.
    base=[(x-2,y),(x-9*L,y-1),(x-18*L,y-4),(x-29*L,y-2)]
    p.line(base,INK,5);p.line(base,'#7a5135',3)
    p.line(base[1:3],'#c69861',1)
    p.line([base[1],(base[1][0]-3*L,base[1][1]-7)],'#8a5836',2)
    p.line([base[2],(base[2][0]-3*L,base[2][1]+6)],'#8a5836',2)
    # Draw blossoms as purposeful small clusters on branches, avoiding random flecks.
    centers=[(base[3][0],base[3][1]-2),(base[2][0]-2,base[2][1]-7),
             (base[1][0]-3,base[1][1]-7),(base[2][0]-5,base[2][1]+6),
             (base[3][0]+9,base[3][1]+3),(base[3][0]+5,base[3][1]-7),
             (base[1][0]-12,base[1][1]-1),(base[2][0]+4,base[2][1]+5),
             (base[1][0]+2,base[1][1]+3),(base[2][0]+3,base[2][1]-1),
             (base[3][0]-1,base[3][1]+6),(base[3][0]+3,base[3][1]-13)]
    for cx,cy in centers[:max(0,c.blossom_count)]:
        p.dots([(cx-2,cy),(cx+2,cy),(cx,cy-2),(cx,cy+2)],'#f1d9cf',2)
        p.dots([(cx,cy)],'#e9b7d0',2)
    return p.image

@component('glasses')
def glasses(c,r):
    p=Painter()
    if c.glasses=='none':return p.image
    x,y=r['head'];t=c.glasses_thickness
    # Two independently constructed geometric optical frames with unobstructed irises.
    for left,right in [(-10,1),(5,17)]:
        # visible translucent lens, structured by discrete highlight clusters
        p.poly([(x+left,y-5),(x+right,y-5),(x+right,y+4),(x+left+1,y+5)],'#2268a9',outline='#13294c')
        p.poly([(x+left+1,y-4),(x+right-1,y-4),(x+right-2,y),(x+left+2,y+2)],'#438cba',outline=None)
        p.line([(x+left,y-5),(x+right,y-5)],'#1c4e97',t)
        p.line([(x+left,y+4),(x+right,y+4)],'#14294b',t)
        p.line([(x+left,y-4),(x+left,y+4)],'#204e97',t)
        p.line([(x+right,y-4),(x+right,y+4)],'#102f62',t)
        p.dots([(x+left+3,y-3),(x+left+4,y-2)],'#c2eaff',1)
        p.dots([(x+left+6,y-2)],'#e1fcff',1)
    p.line([(x+1,y-4),(x+5,y-3)],'#1c3c74',t)
    p.line([(x-10,y-2),(x-15,y-5)],'#1c3c74',2)
    return p.image

@component('facial_highlights')
def facial_highlights(c,r):
    p=Painter();x,y=r['head']
    # naturalistic restrained expressive eyebrow/eyelid accents, separate from lens component
    if c.glasses=='none':
        p.line([(x+0,y-5),(x+5,y-6)],'#271e27',2)
        p.line([(x+10,y-4),(x+14,y-3)],'#271e27',2)
        p.dots([(x+3,y-3),(x+12,y-2)],'#0c1723',1)
    p.line([(x+11,y+6),(x+16,y+8)],'#bb805a',1)
    return p.image

@component('scarf_knot')
def scarf_knot(c,r):
    p=Painter()
    if c.scarf=='none':return p.image
    x,y=r['scarf_root'];p.poly([(x-10,y-7),(x-3,y-3),(x+9,y-4),(x+15,y),
                                (x+8,y+6),(x-2,y+7),(x-11,y+2)],'#241a4b')
    p.poly([(x-9,y-5),(x-1,y-2),(x+9,y-3),(x+12,y),(x+6,y+3),(x-3,y+3)],'#7759b7',outline=None)
    p.line([(x-8,y-4),(x-3,y),(x+7,y)],'#bc98e8',2)
    p.line([(x-3,y+4),(x+6,y+5)],'#d7b75e',1)
    return p.image

@component('uniform_emblem')
def uniform_emblem(c,r):
    p=Painter();x,y=r['chest'];cx,cy=x+1,y+13
    # tiny team badge, consistent shape across recipes
    p.poly([(cx-6,cy-6),(cx+3,cy-8),(cx+8,cy-1),(cx+5,cy+7),(cx-4,cy+8),(cx-8,cy+1)],'#221a49')
    p.poly([(cx-5,cy-5),(cx+3,cy-6),(cx+6,cy-1),(cx+3,cy+5),(cx-4,cy+5),(cx-6,cy+1)],c.jersey_trim,outline=None)
    p.poly([(cx-4,cy-1),(cx+1,cy-4),(cx+4,cy+1),(cx+1,cy+3),(cx-4,cy+2)],c.jersey_primary,outline=None)
    p.line([(cx+1,cy-4),(cx-3,cy-1)],'#f1d788',1)
    return p.image


def render_layer(name,recipe,rig):
    if name not in COMPONENTS:raise KeyError(f'Unknown component {name}')
    im=COMPONENTS[name](recipe,rig)
    assert im.mode=='RGBA' and im.size==(128,192)
    return im
