#!/usr/bin/env node
/**
 * MANACONDA V2: native 128x192 hand-coded sprite, no generated art, tracing, or raster inputs.
 * Node standard library only. All shapes, colors, highlights and textures are authored here.
 * Usage: node generate-manaconda-v2.mjs [png path] [--half optional-64x96-png path]
 * Sprite facing right, transparent, no drawn basketball or court shadow.
 */
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const WIDTH = 128, HEIGHT = 192;
const PALETTE = {
  ink:'#1b1826', inkSoft:'#30263b', darkest:'#21182f', ambient:'#39304a',
  woodInk:'#422c29', woodShadow:'#674437', wood:'#8e6046',woodLit:'#bc8b5b',woodGlint:'#d5ac77',
  leafDark:'#4d6f53', leaf:'#8a9a60', bloom:'#f8f1de', bloomShadow:'#deb8c0', bloomPink:'#f5cae1', pollen:'#e7bd65',
  hairShadow:'#23242d', hair:'#36333c', hairMid:'#57545b', hairSilver:'#aba8a5', hairWhite:'#d1ccba',
  skinDeep:'#694032',skinShadow:'#865039',skin:'#a66a48',skinWarm:'#c08458',skinLit:'#dca176',skinHigh:'#edbf8c',
  noseShadow:'#8e513d',ear:'#be805b',skinCrease:'#764636',
  beardInk:'#23242c', beard:'#37323a',beardMid:'#57525a',beardSilver:'#99969b', beardLight:'#c4bab9',
  lensShadow:'#11264b',blueDark:'#12538f',blue:'#247fba',blueBright:'#3ebbe6',blueGlare:'#bcecf1', eye:'#20212d',
  indigoDeep:'#221b4b',scarfShadow:'#302464',scarf:'#4b3690',scarfMid:'#6950b2',scarfLight:'#9970d4',scarfGlint:'#baa0e5',
  uniformDeep:'#24173e',uniformDark:'#38245f',violet:'#533686',violetMid:'#6a46a0',violetLit:'#8b60c0',violetHi:'#a983d0',
  goldDeep:'#6f4d28',goldShadow:'#a67637',gold:'#d5ab52',goldLit:'#f0ca78',goldBright:'#ffe39a',
  undershirt:'#4a3b6d',steelDeep:'#5e6075',steel:'#9394aa',whiteShadow:'#acabba',white:'#d7d7dc',whiteWarm:'#ece9e5',whiteBright:'#fff8e9',
  shoeDeep:'#2a2540',shoeShadow:'#49396e',shoe:'#6549a3',shoeLight:'#9774c9',shoeBright:'#c3a7e6',
};

const rgbCache = new Map();
function parse(c){if(!rgbCache.has(c)){const z=c.replace('#','');rgbCache.set(c,[parseInt(z.slice(0,2),16),parseInt(z.slice(2,4),16),parseInt(z.slice(4,6),16)]);}return rgbCache.get(c)}
class PixelArt {
  constructor(w,h){this.w=w;this.h=h;this.pixels=new Uint8Array(w*h*4);}
  dot(x,y,c){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=this.w||y>=this.h)return;const [r,g,b]=parse(c),i=(y*this.w+x)*4;this.pixels[i]=r;this.pixels[i+1]=g;this.pixels[i+2]=b;this.pixels[i+3]=255;}
  rect(x,y,w,h,c){for(let yy=y; yy<y+h; yy++)for(let xx=x;xx<x+w;xx++)this.dot(xx,yy,c)}
  line(x0,y0,x1,y1,c,width=1){const steps=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0))*2)||1;for(let k=0;k<=steps;k++){const x=Math.round(x0+(x1-x0)*k/steps),y=Math.round(y0+(y1-y0)*k/steps);if(width<=1)this.dot(x,y,c);else for(let yy=-Math.floor(width/2);yy<=Math.floor((width-1)/2);yy++)for(let xx=-Math.floor(width/2);xx<=Math.floor((width-1)/2);xx++)this.dot(x+xx,y+yy,c);}}
  path(points,c,width=1){for(let i=0;i<points.length-1;i++)this.line(...points[i],...points[i+1],c,width)}
  poly(points,c){const min=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1])))),max=Math.min(this.h-1,Math.ceil(Math.max(...points.map(p=>p[1]))));for(let y=min;y<=max;y++){const xs=[];for(let k=0;k<points.length;k++){const a=points[k],b=points[(k+1)%points.length];if((a[1]<=y+.5&&b[1]>y+.5)||(b[1]<=y+.5&&a[1]>y+.5))xs.push(a[0]+(y+.5-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2)for(let x=Math.ceil(xs[k]-.5);x<=Math.floor(xs[k+1]-.5);x++)this.dot(x,y,c)}}
  shape(points,fill,edge=null,width=1){this.poly(points,fill);if(edge)for(let k=0;k<points.length;k++)this.line(...points[k],...points[(k+1)%points.length],edge,width);}
  ellipse(cx,cy,rx,ry,fill,edge=null){for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){let q=((x-cx)/rx)**2+((y-cy)/ry)**2;if(q<=1)this.dot(x,y,edge&&q>.85?edge:fill)}}
  curve(start,c1,c2,end,color,width=1){let prev=start;for(let i=1;i<=36;i++){let t=i/36,u=1-t,x=u**3*start[0]+3*u*u*t*c1[0]+3*u*t*t*c2[0]+t**3*end[0],y=u**3*start[1]+3*u*u*t*c1[1]+3*u*t*t*c2[1]+t**3*end[1];this.line(...prev,x,y,color,width);prev=[x,y]}}
  dots(points,c){for(const [x,y] of points)this.dot(x,y,c)}
}
const p = new PixelArt(WIDTH,HEIGHT), C=PALETTE;
const pol=(a,c)=>p.poly(a,c),sh=(a,c,e=C.ink,w=1)=>p.shape(a,c,e,w),stroke=(a,c,w=1)=>p.path(a,c,w),ell=(...a)=>p.ellipse(...a),dt=(a,c)=>p.dots(a,c),r=(...a)=>p.rect(...a);

// BACK-LAYER SCARF: thin curling folds, an irregular torn tail, and a dark underside.
sh([[67,76],[59,75],[52,72],[45,73],[35,68],[29,70],[39,79],[24,76],[16,80],[26,85],[11,91],[18,97],[7,102],[19,104],[15,113],[30,108],[45,100],[57,103],[69,94],[77,84]],C.scarfShadow,C.inkSoft);
pol([[63,78],[51,75],[42,76],[32,72],[37,79],[24,80],[35,85],[18,91],[30,94],[19,100],[33,99],[26,106],[42,97],[53,98],[66,89]],C.scarf);
pol([[57,78],[51,76],[42,77],[37,75],[47,82],[33,84],[43,88],[31,92],[42,93],[31,99],[49,94],[61,91]],C.scarfMid);
pol([[45,77],[38,73],[34,73],[42,80],[35,84],[46,83],[51,81]],C.scarfLight);
stroke([[12,100],[22,95],[27,95]],C.scarfLight,1);stroke([[21,91],[32,88],[40,89]],C.scarfGlint,1);
stroke([[23,106],[29,101],[38,98]],C.scarfMid,2);stroke([[37,80],[27,79]],C.scarfLight,1);

// FAR LEG, bent back to create a dynamic stance, plus distinct knee and calf surfaces.
sh([[76,129],[86,131],[92,142],[90,150],[84,158],[79,171],[72,179],[62,177],[60,165],[62,154],[63,142],[68,131]],C.uniformDark,C.inkSoft,2);
pol([[72,133],[83,133],[88,141],[85,148],[77,153],[68,151],[66,141]],C.violet);
pol([[72,136],[81,136],[84,143],[78,150],[70,148]],C.violetMid);
pol([[66,149],[74,151],[76,154],[67,162],[63,160]],C.uniformDeep);
stroke([[67,139],[70,143],[67,151]],C.goldShadow,2);
// Far leg white compression calf.
sh([[66,153],[79,156],[80,165],[75,174],[72,181],[61,181],[60,173],[62,165]],C.steel,C.inkSoft);
pol([[65,157],[75,158],[76,164],[71,176],[64,177],[63,172]],C.whiteShadow);
pol([[64,159],[71,158],[73,163],[68,173],[64,175]],C.whiteWarm);
pol([[64,161],[66,159],[67,168],[64,172]],C.whiteBright);
stroke([[62,168],[69,170]],C.steel,1);

// FAR SHOE with slimmer tongue, laces and a sharply defined sole.
sh([[64,173],[72,174],[76,180],[81,181],[82,187],[75,189],[47,189],[45,186],[51,181],[61,178]],C.shoeDeep,C.ink,1);
pol([[52,183],[62,177],[69,177],[76,183],[77,185],[49,185]],C.shoe);
pol([[55,182],[62,179],[68,180],[72,183],[65,184],[53,184]],C.shoeLight);
stroke([[49,187],[78,187]],C.whiteBright,1);stroke([[51,186],[76,186]],C.steel,1);
stroke([[62,181],[70,182]],C.goldLit,1);dt([[63,181],[65,182],[67,183]],C.whiteWarm);

// NEAR LEG: forward bent thigh, lean shin, angled ankle (not a mirrored copy).
sh([[92,128],[109,132],[111,143],[108,152],[103,164],[101,178],[91,183],[81,179],[79,169],[82,159],[83,148],[81,138]],C.uniformDeep,C.inkSoft,2);
pol([[90,132],[104,135],[108,144],[104,152],[94,153],[86,145],[85,137]],C.violet);
pol([[95,136],[104,139],[105,145],[101,149],[93,148],[89,142]],C.violetMid);
pol([[99,137],[103,141],[105,145],[103,147]],C.violetLit);
stroke([[94,135],[105,143],[107,150]],C.gold,1);stroke([[88,146],[96,151]],C.goldDeep,1);
// Kneepad highlight and 3D white tights.
sh([[90,151],[105,155],[104,163],[101,176],[98,181],[85,182],[82,176],[84,167],[84,158]],C.steel,C.inkSoft);
pol([[89,154],[101,157],[101,164],[98,174],[94,178],[86,177],[86,167]],C.whiteShadow);
pol([[89,155],[97,157],[99,162],[95,173],[89,176],[86,171]],C.whiteWarm);
pol([[88,157],[91,156],[93,162],[88,171],[86,171]],C.whiteBright);
pol([[100,161],[102,162],[100,170],[97,175]],C.steel);
stroke([[85,165],[91,167],[98,168]],C.steel,1);

// FRONT SHOE, thinner silhouette and many tiny authored details.
sh([[86,174],[99,173],[105,179],[112,180],[122,183],[123,188],[119,190],[83,190],[78,187]],C.shoeDeep,C.ink,1);
pol([[85,178],[97,176],[105,181],[119,184],[119,187],[83,187]],C.shoe);
pol([[90,178],[97,177],[102,180],[109,184],[100,184],[87,183]],C.shoeLight);
pol([[94,178],[99,178],[104,181],[100,182]],C.shoeBright);
stroke([[81,188],[121,188]],C.whiteBright,1);stroke([[84,186],[119,186]],C.steel,1);
stroke([[98,182],[107,184]],C.gold,1);dt([[92,182],[94,183],[96,183],[98,184],[100,185]],C.goldLit);
r(111,185,5,1,C.shoeBright);

// FAR ARM: warm skin, elbow volume, wrist and articulated fingers.
sh([[65,82],[59,87],[54,94],[51,105],[51,116],[50,127],[52,134],[59,138],[65,136],[69,127],[73,115],[78,101],[78,89]],C.skinShadow,C.inkSoft);
pol([[62,86],[66,88],[68,95],[63,106],[60,117],[56,127],[54,126],[54,116],[57,103]],C.skin);
pol([[61,90],[64,90],[64,97],[58,112],[55,118],[55,110]],C.skinWarm);
pol([[61,90],[62,90],[60,100],[58,101]],C.skinHigh);
stroke([[57,117],[61,121],[60,127]],C.skinCrease,1);
sh([[52,127],[60,129],[63,132],[62,138],[58,143],[53,144],[49,140],[48,133]],C.skin,C.inkSoft);
pol([[51,131],[57,130],[59,133],[57,138],[53,140],[50,137]],C.skinLit);
stroke([[50,138],[52,141]],C.skinDeep,1);stroke([[54,141],[55,143]],C.skinDeep,1);

// TORSO: multi-facet jersey with a tapered waist and golden shoulder piping.
sh([[70,78],[82,76],[95,79],[104,84],[111,94],[113,106],[109,120],[109,131],[100,139],[86,141],[72,137],[62,129],[62,111],[63,96]],C.uniformDeep,C.ink,2);
pol([[71,83],[83,80],[96,83],[104,89],[109,99],[108,116],[106,126],[98,135],[87,136],[73,132],[66,125],[66,105]],C.violet);
pol([[71,84],[81,81],[90,85],[89,94],[86,109],[81,123],[72,128],[67,120],[67,104]],C.violetMid);
pol([[75,83],[82,82],[87,86],[83,103],[76,117],[70,117],[70,101]],C.violetLit);
pol([[100,89],[105,95],[107,109],[104,121],[99,131],[93,135],[99,121],[100,106]],C.uniformDark);
pol([[72,112],[80,120],[86,121],[78,128],[69,122]],C.uniformDark);
// collar, shoulder trims and three-dimensional jersey sleeve.
stroke([[72,80],[76,90],[84,95],[93,92],[98,82]],C.goldDeep,3);
stroke([[74,81],[77,90],[85,93],[92,90],[97,82]],C.goldLit,1);
stroke([[65,97],[64,108],[66,116]],C.goldShadow,2);
stroke([[68,99],[67,109]],C.goldLit,1);
stroke([[104,89],[109,96],[110,101]],C.gold,2);
stroke([[105,92],[108,98]],C.goldBright,1);
// jersey creases along ribcage.
stroke([[77,112],[79,119],[85,125]],C.uniformDark,1);
stroke([[93,105],[90,116],[88,122]],C.violetHi,1);
stroke([[104,112],[101,123],[96,127]],C.violetMid,1);
stroke([[69,126],[80,133],[92,134]],C.goldShadow,2);
stroke([[71,127],[82,134],[93,135]],C.goldLit,1);
stroke([[98,132],[102,129]],C.goldDeep,2);
// miniature stylized Condas C crest, hand defined in 1-pixel strokes (no fonts).
sh([[82,99],[93,99],[97,105],[94,114],[86,118],[79,113],[78,105]],C.goldDeep,C.inkSoft);
pol([[82,101],[92,101],[95,106],[92,113],[86,116],[81,111],[80,105]],C.gold);
pol([[84,103],[91,103],[91,105],[87,105],[85,107],[86,111],[90,112],[92,110],[93,112],[90,114],[85,113],[82,109],[82,106]],C.violet);
r(84,102,8,1,C.goldBright);dt([[83,107],[83,109],[91,113]],C.goldLit);

// NEAR SHOULDER AND ARM: warm skin to fitted, shaded single WHITE sleeve.
sh([[102,84],[111,86],[117,92],[122,102],[122,111],[120,121],[116,124],[108,119],[107,108],[102,96]],C.skinShadow,C.inkSoft,1);
pol([[109,88],[115,91],[119,99],[120,107],[116,111],[111,105],[107,96]],C.skin);
pol([[111,90],[115,93],[118,100],[117,103],[113,99]],C.skinLit);
stroke([[109,88],[115,90]],C.skinHigh,1);
// sleeve seam and fabric shapes. Ends under forearm wrist at y145.
sh([[116,105],[124,108],[125,120],[122,131],[117,139],[111,144],[105,139],[108,129],[109,117]],C.steel,C.inkSoft);
pol([[118,108],[122,110],[123,120],[120,129],[115,137],[109,140],[110,130],[113,119]],C.white);
pol([[117,109],[120,110],[121,119],[118,128],[114,132],[113,128],[115,119]],C.whiteWarm);
pol([[117,109],[118,109],[117,119],[115,124],[114,123]],C.whiteBright);
pol([[123,119],[123,123],[118,133],[115,135],[120,126]],C.whiteShadow);
stroke([[112,113],[119,115]],C.steel,1);
stroke([[110,132],[117,135]],C.steel,1);
stroke([[110,137],[115,139]],C.whiteBright,1);
// hand: visible thumb notch and separate fingers instead of a boxy fist.
sh([[108,140],[115,140],[118,144],[118,150],[116,153],[114,150],[112,155],[109,154],[108,151],[105,154],[103,149],[105,145]],C.skinShadow,C.inkSoft);
pol([[109,142],[115,143],[116,148],[113,151],[109,151],[106,148]],C.skin);
pol([[109,144],[112,143],[114,145],[111,148],[108,148]],C.skinLit);
stroke([[114,149],[113,153]],C.skinCrease);stroke([[109,149],[108,152]],C.skinCrease);
r(105,148,2,2,C.skinLit);

// Neck, scarf knot and folds in front of jersey but behind jaw.
sh([[80,68],[95,69],[101,76],[97,85],[91,87],[82,85],[72,83],[73,75]],C.indigoDeep,C.inkSoft);
pol([[79,71],[93,72],[98,76],[94,82],[84,84],[75,80],[76,75]],C.scarf);
pol([[78,72],[87,73],[94,76],[90,80],[82,81],[76,77]],C.scarfMid);
stroke([[77,77],[84,81],[92,81]],C.scarfLight,1);
pol([[94,77],[100,78],[96,84],[90,87],[88,84]],C.scarfShadow);
stroke([[96,78],[93,83]],C.scarfGlint,1);
// Neck skin shows just above wrap.
pol([[83,62],[96,63],[96,73],[90,77],[83,72]],C.skinShadow);
pol([[87,65],[94,66],[93,72],[89,74],[86,71]],C.skinWarm);

// HEAD SILHOUETTE: angled jaw and three-quarter face, NOT symmetric or oversized.
sh([[74,27],[80,22],[90,20],[100,24],[108,32],[112,42],[113,51],[111,61],[109,70],[104,80],[95,85],[85,83],[77,77],[73,69],[72,58],[70,49],[70,39]],C.beardInk,C.ink,2);
// Warm facial plane / high cheeks.
pol([[78,32],[86,28],[98,30],[105,37],[109,45],[109,53],[106,61],[100,69],[89,70],[78,64],[74,54],[73,43]],C.skinShadow);
pol([[81,31],[91,29],[100,33],[105,40],[107,51],[103,60],[97,66],[87,65],[78,57],[76,45]],C.skin);
pol([[90,30],[99,33],[104,40],[105,50],[101,56],[97,56],[92,48],[87,44]],C.skinWarm);
pol([[98,36],[103,39],[105,46],[103,49],[100,43]],C.skinLit);
pol([[81,37],[85,34],[85,43],[80,48],[77,46]],C.skinLit);
pol([[104,47],[108,49],[107,55],[104,56]],C.skinHigh);
// Ear: layered concavity, finely drawn helix.
sh([[72,45],[77,44],[81,49],[81,58],[77,62],[72,58],[70,53]],C.skinShadow,C.skinCrease);
pol([[74,47],[78,47],[79,52],[76,56],[73,55]],C.ear);
stroke([[74,49],[76,48],[77,51],[75,54]],C.noseShadow,1);
dt([[73,49],[76,55]],C.skinHigh);
// Nose to right with natural 3-quarter projection.
sh([[102,51],[109,54],[113,58],[110,61],[105,60],[103,57]],C.skinWarm,C.skinShadow);
pol([[106,55],[110,57],[110,59],[106,58]],C.skinLit);
stroke([[106,60],[110,60]],C.noseShadow,1);
// Beard under cheek and chin. Mouth remains inside facial hair.
pol([[74,56],[81,60],[87,62],[94,62],[99,61],[104,59],[109,65],[108,73],[104,81],[98,85],[89,85],[81,80],[76,72]],C.beard);
pol([[79,63],[86,66],[92,69],[98,68],[104,66],[104,76],[98,81],[92,82],[86,78],[81,73]],C.beardMid);
pol([[78,60],[83,61],[87,67],[82,68],[77,65]],C.beardInk);
pol([[104,63],[108,65],[106,76],[102,79],[103,70]],C.beardInk);
// mustache and lower lip
pol([[96,61],[101,60],[106,62],[103,66],[97,65],[94,64]],C.beardInk);
stroke([[97,67],[103,67]],C.skinDeep,1);r(97,68,6,1,C.beardInk);
// Strands follow beard growth direction, individually specified 1px traces.
for(const seg of [
 [[78,64],[81,68],[82,72]],[[81,66],[84,72]],[[85,69],[87,75]],[[90,71],[91,80]],[[96,71],[95,80]],[[100,69],[99,78]],[[104,69],[102,76]],
 [[81,75],[84,79]],[[85,78],[89,82]],[[98,79],[95,83]],[[91,79],[91,84]],[[79,69],[81,73]]])stroke(seg,C.beardSilver,1);
for(const seg of [[[78,67],[80,70]],[[86,71],[86,76]],[[94,74],[93,79]],[[102,72],[101,75]],[[88,80],[90,82]],[[97,81],[96,83]]])stroke(seg,C.beardLight,1);
dt([[81,64],[84,67],[88,69],[99,65],[105,68],[85,81],[93,82],[98,78],[79,73]],C.beardSilver);

// FACE DETAILS and cobalt rectangular GLASSES: 1px wire edges, deep lenses.
stroke([[80,49],[86,48]],C.blueDark,2);
sh([[83,45],[95,44],[98,47],[97,56],[85,57],[82,54]],C.lensShadow,C.blueDark,1);
pol([[85,47],[94,46],[95,48],[94,54],[86,54]],C.blue);
pol([[85,47],[94,46],[94,49],[86,50]],C.blueBright);
r(91,49,2,4,C.eye);r(91,49,1,2,C.blueGlare);
stroke([[85,46],[94,45]],C.blueGlare,1);stroke([[84,54],[88,55]],C.blueGlare,1);
sh([[100,45],[110,46],[111,54],[108,57],[100,55],[98,51]],C.lensShadow,C.blueDark,1);
pol([[101,47],[109,48],[109,53],[101,54]],C.blue);
pol([[102,47],[109,48],[109,49],[102,49]],C.blueBright);
r(105,49,2,3,C.eye);r(105,49,1,1,C.blueGlare);
stroke([[96,47],[100,47]],C.blueBright,1);
stroke([[99,55],[109,55]],C.blueDark,1);
// small brows behind frame
stroke([[85,43],[94,42]],C.hair,1);stroke([[100,43],[107,44]],C.hair,1);

// HAIR: individually authored curls and silver streaks, leaving the brow and ear open.
sh([[70,44],[69,35],[72,26],[75,22],[80,16],[87,13],[93,14],[99,11],[105,17],[109,21],[110,29],[107,34],[103,36],[101,31],[94,33],[90,29],[82,34],[77,39]],C.hairShadow,C.inkSoft,1);
for(const [cx,cy,rx,ry] of [[75,29,5,5],[80,22,5,5],[87,19,5,5],[93,20,5,5],[100,19,5,6],[105,24,4,5],[101,30,5,4],[94,28,5,5],[86,27,5,5],[79,33,4,4],[73,38,3,4]])ell(cx,cy,rx,ry,C.hair);
// hair islands dark vs lit
for(const pts of [ [[72,32],[75,26],[79,24]],[[79,20],[83,17],[87,16]],[[88,17],[93,18],[98,15]],[[99,15],[104,19],[106,24]],[[96,25],[100,30],[103,30]],[[75,35],[77,32],[79,31]]])stroke(pts,C.hairMid,1);
for(const pts of [ [[75,30],[78,25],[80,24]],[[82,19],[86,17],[90,18]],[[91,21],[93,19],[98,18]],[[102,20],[105,23]],[[80,31],[85,27]],[[96,28],[99,27]],[[73,39],[75,35]]])stroke(pts,C.hairSilver,1);
for(const pts of [[[77,26],[79,23]],[[84,18],[87,17]],[[92,17],[94,18]],[[100,19],[103,21]],[[83,29],[86,26]]])stroke(pts,C.hairWhite,1);
dt([[76,22],[88,14],[98,14],[105,26],[73,35],[96,31]],C.hairSilver);

// DRIFTWOOD CREST: grows from both temples and projects BACKWARD (image-left).
// Distinct pathways have taper and bark facets; no upward antler branches.
const branch=(points,w=1)=>stroke(points,C.woodInk,w);
branch([[74,40],[66,36],[57,34],[49,34],[41,33],[32,34]],3);
branch([[66,36],[60,30],[53,27],[46,28],[38,26]],2);
branch([[55,34],[50,41],[43,43],[34,44],[27,48]],2);
branch([[46,29],[43,25],[38,23],[31,23]],1);
branch([[42,33],[37,38],[30,40]],1);
branch([[31,34],[25,33],[18,36]],1);
// Rear-side temple root at eye-line, short and closely swept back.
branch([[83,37],[78,33],[71,30],[66,28],[58,29]],2);
branch([[70,30],[66,25],[61,24]],1);
branch([[57,29],[52,31],[48,31]],1);
// bark highlights, never beyond broad outline in the same line segment.
stroke([[69,37],[57,35],[46,34],[36,35]],C.wood,1);
stroke([[58,30],[51,28],[45,29]],C.woodLit,1);
stroke([[50,40],[43,42],[34,44]],C.wood,1);
stroke([[41,27],[36,26]],C.woodGlint,1);
stroke([[29,35],[24,34]],C.woodLit,1);
stroke([[77,34],[70,31],[65,30]],C.woodLit,1);
// blossoms are finely constructed 1-3px components.
function bloom(x,y){ell(x,y-2,1,1,C.bloom);ell(x+2,y,1,1,C.bloomPink);ell(x,y+2,1,1,C.bloomShadow);ell(x-2,y,1,1,C.bloom);p.dot(x,y,C.pollen)}
for(const [x,y] of [[33,23],[20,36],[29,48],[38,26],[61,24],[31,40]])bloom(x,y);
sh([[43,39],[45,37],[48,38],[46,40]],C.leaf,C.woodInk);
dt([[39,39],[53,29],[24,35],[36,44]],C.leafDark);

// Fine high-frequency specular details are local to existing solids, not random noise.
stroke([[66,95],[67,91]],C.violetHi,1);
dt([[83,106],[85,108],[91,109]],C.goldBright);
dt([[103,95],[105,98],[110,131]],C.whiteBright);
dt([[87,43],[91,41]],C.skinLit);
dt([[57,136],[55,138]],C.skinHigh);
dt([[90,139],[95,142]],C.violetHi);

// Align on the gameplay baseline while preserving a 3px transparent buffer on all sides.
// Only translation occurs here; native-resolution drawing remains untouched.
const align=p.pixels.slice();p.pixels.fill(0);
for(let y=3;y<HEIGHT;y++)for(let x=2;x<WIDTH;x++){
  const src=(y*WIDTH+x)*4,dst=((y-3)*WIDTH+(x-2))*4;
  p.pixels.set(align.subarray(src,src+4),dst);
}

// Strict RGBA packing. Nonzero alpha is always opaque, no feathered edge pixels.
function png(width,height,bytes){const signature=Buffer.from([137,80,78,71,13,10,26,10]);function crc32(buf){let c=0xffffffff;for(const b of buf){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^0xffffffff)>>>0}function chunk(type,data){let len=Buffer.alloc(4),t=Buffer.from(type),c=Buffer.alloc(4);len.writeUInt32BE(data.length);c.writeUInt32BE(crc32(Buffer.concat([t,data])));return Buffer.concat([len,t,data,c])}const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(width,0);ihdr.writeUInt32BE(height,4);ihdr[8]=8;ihdr[9]=6;const raw=Buffer.alloc(height*(width*4+1));for(let y=0;y<height;y++)Buffer.from(bytes.buffer,bytes.byteOffset+y*width*4,width*4).copy(raw,y*(width*4+1)+1);return Buffer.concat([signature,chunk('IHDR',ihdr),chunk('IDAT',deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);}
let out=process.argv[2]||'manaconda-code-pixel-v2.png';writeFileSync(out,png(WIDTH,HEIGHT,p.pixels));
let halfArg=process.argv.indexOf('--half');if(halfArg>=0){const half=new Uint8Array(64*96*4);for(let y=0;y<96;y++)for(let x=0;x<64;x++){const src=((y*2)*128+x*2)*4,dst=(y*64+x)*4;half.set(p.pixels.subarray(src,src+4),dst);}writeFileSync(process.argv[halfArg+1]||'manaconda-code-pixel-v2-64.png',png(64,96,half));}
let count=0,minX=WIDTH,minY=HEIGHT,maxX=-1,maxY=-1;const used=new Set();for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++){let i=(y*WIDTH+x)*4;if(p.pixels[i+3]>0){count++;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);used.add(`${p.pixels[i]},${p.pixels[i+1]},${p.pixels[i+2]}`)}}
console.log(JSON.stringify({file:out,width:WIDTH,height:HEIGHT,visiblePixels:count,uniqueVisibleColors:used.size,bounds:[minX,minY,maxX,maxY],method:'native-res code-drawn geometry: no image model, raster art input, or 2x V1 upscale'},null,2));
