#!/usr/bin/env node
/**
 * MANACONDA | hand-programmed arcade-pixel experiment
 * Copyright (c) 2026. Original geometric pixel art, not image-model output.
 * Usage: node generate-manaconda.mjs [output.png]
 * Dependencies: Node.js built-ins only (fs, zlib).
 * Output: RGBA PNG 64x96. Art facing right, ball-free, transparent background.
 */
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const W = 64, H = 96;
const C = {
  ink:'#171222', deep:'#21172e', inner:'#372038', crest:'#4d3127', bark:'#80523a', barkLight:'#b7814e',
  hair:'#27272d', hairMid:'#555057', silver:'#aaa3a2', silverLight:'#d4c6ae',
  skinDark:'#744532', skin:'#a86e4a', skinLight:'#d59a69', skinLit:'#f0c18b',
  beard:'#29252e', beardShade:'#484047', beardSilver:'#aaa2a0',
  iris:'#3d9ed9', glassDark:'#152442', glass:'#164f9c', glassLight:'#54c8f3',
  jerseyDark:'#291952', purple:'#45328b', purpleMid:'#6342ad', purpleLight:'#875ed1',
  indigo:'#27265b', scarf:'#4e369c', scarfLit:'#8b65d9', scarfShade:'#332268',
  goldDark:'#835528', gold:'#d7a84b', goldLight:'#f5d982',
  whiteDark:'#8d8d9d', white:'#d6d3dc', whiteLight:'#f8f3e9',
  shoeDark:'#282042', shoe:'#6042a8', shoeLit:'#aa80ea',
  leaf:'#69865b', blossom:'#f3dfd7', blossomPink:'#eca9c7', blossomCore:'#e7c974',
};

class Pixels {
  constructor(w,h){ this.w=w;this.h=h;this.bytes=new Uint8Array(w*h*4);this.cache=new Map(); }
  rgb(hex){if(!this.cache.has(hex)){const h=hex.replace('#','');this.cache.set(hex,[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]);}return this.cache.get(hex)}
  dot(x,y,col){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=this.w||y>=this.h)return;let i=4*(y*this.w+x),v=this.rgb(col);this.bytes[i]=v[0];this.bytes[i+1]=v[1];this.bytes[i+2]=v[2];this.bytes[i+3]=255;}
  rect(x,y,w,h,c){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)this.dot(xx,yy,c)}
  line(x0,y0,x1,y1,col,width=1){const dx=x1-x0,dy=y1-y0,steps=Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))*2)||1;
    for(let i=0;i<=steps;i++){let x=Math.round(x0+dx*i/steps),y=Math.round(y0+dy*i/steps);let r=Math.floor(width/2);for(let yy=-r;yy<=r;yy++)for(let xx=-r;xx<=r;xx++)this.dot(x+xx,y+yy,col)} }
  poly(points,col){let ys=points.map(p=>p[1]), y0=Math.max(0,Math.floor(Math.min(...ys))), y1=Math.min(this.h-1,Math.ceil(Math.max(...ys)));
    for(let y=y0;y<=y1;y++){const xs=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if((a[1]<=y+.5&&b[1]>y+.5)||(b[1]<=y+.5&&a[1]>y+.5))xs.push(a[0]+(y+.5-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let j=0;j<xs.length;j+=2){for(let x=Math.ceil(xs[j]-.5);x<=Math.floor(xs[j+1]-.5);x++)this.dot(x,y,col)}}}
  shape(points,fill,stroke=C.ink,width=1){this.poly(points,fill);if(stroke)for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];this.line(a[0],a[1],b[0],b[1],stroke,width)}}
  ellipse(cx,cy,rx,ry,fill,stroke=null){for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const t=((x-cx)/rx)**2+((y-cy)/ry)**2;if(t<=1)this.dot(x,y,t>.78&&stroke?stroke:fill)}}
  cluster(points,col){for(const [x,y] of points)this.dot(x,y,col)}
}
const p = new Pixels(W,H);
const sh=(pts,fill,stroke=C.ink,width=1)=>p.shape(pts,fill,stroke,width);
const fill=(pts,c)=>p.poly(pts,c);
const line=(a,b,c,w=1)=>p.line(...a,...b,c,w);
const dots=(pts,c)=>p.cluster(pts,c);

// 0. The silhouette's rear-most geometry: scarf flags and a small travel pack.
// This court variant wears the Chicago Condas uniform, not armor/backpack.
sh([[28,32],[20,33],[14,29],[7,31],[13,35],[4,38],[9,42],[2,44],[12,46],[21,42],[30,43],[36,36]],C.scarfShade);
fill([[27,33],[19,34],[14,32],[9,33],[16,36],[8,39],[15,41],[9,44],[21,40],[31,40]],C.scarf);
fill([[24,34],[16,34],[11,33],[18,36],[12,39],[20,38],[30,38]],C.scarfLit);
dots([[7,39],[9,40],[15,44],[12,43],[20,35]],C.purpleLight);

// 1. Back leg, planted behind front leg.
sh([[29,58],[37,62],[36,69],[32,75],[29,82],[27,87],[20,88],[20,82],[22,75],[21,70],[25,62]],C.jerseyDark);
fill([[27,61],[34,63],[33,68],[27,73],[24,72],[24,67]],C.purple);
fill([[27,63],[29,63],[25,71],[24,69]],C.gold);
sh([[26,73],[33,73],[32,78],[29,84],[28,89],[20,89],[21,82],[21,77]],C.whiteDark);
fill([[24,75],[31,75],[29,81],[26,86],[23,85],[23,78]],C.white);
fill([[24,76],[27,76],[26,83],[23,84]],C.whiteLight);
line([21,82],[29,82],C.whiteDark);

// 2. Far shoe. The soles stay on y=92 and no ground shadow is baked in.
sh([[20,85],[27,86],[32,89],[33,91],[29,93],[14,93],[12,91],[15,88],[19,87]],C.shoeDark);
fill([[16,89],[22,86],[28,88],[31,90],[25,91],[15,91]],C.shoe);
fill([[17,89],[22,87],[27,89],[24,89]],C.shoeLit);
line([14,92],[30,92],C.whiteLight);
dots([[21,89],[23,90],[25,90]],C.goldLight);

// 3. Front leg: deliberately angled to give the idle pose athletic weight.
sh([[38,58],[46,60],[50,67],[51,74],[46,78],[45,87],[39,89],[37,84],[38,75],[35,70],[34,65]],C.jerseyDark);
fill([[37,61],[45,62],[48,68],[47,73],[42,74],[38,68]],C.purple);
fill([[44,64],[47,67],[48,71],[45,72]],C.purpleLight);
line([40,62],[47,71],C.goldDark,2);
line([42,63],[48,70],C.gold,1);
sh([[41,74],[49,73],[49,79],[46,87],[46,89],[39,89],[39,82],[40,77]],C.whiteDark);
fill([[43,76],[47,76],[46,82],[44,86],[41,86],[41,80]],C.white);
fill([[42,77],[44,77],[42,85],[41,85]],C.whiteLight);
line([41,80],[46,80],C.whiteDark);

// 4. Front shoe, toe at right and gold piping.
sh([[40,86],[46,85],[49,88],[56,89],[57,92],[53,94],[38,94],[36,91]],C.shoeDark);
fill([[41,87],[46,87],[50,89],[54,90],[54,92],[39,92],[38,90]],C.shoe);
fill([[43,87],[46,87],[50,90],[45,90]],C.shoeLit);
line([38,93],[55,93],C.whiteLight);
line([45,89],[50,90],C.goldLight);
dots([[43,90],[45,91],[47,91]],C.gold);

// 5. Far arm behind chest, sleeveless and hand open by the hip.
sh([[28,37],[24,38],[20,43],[19,51],[17,58],[19,62],[23,63],[27,59],[31,49],[33,44]],C.skinDark);
fill([[23,42],[27,40],[28,46],[24,53],[21,57],[20,54]],C.skin);
fill([[23,43],[25,41],[26,46],[23,51]],C.skinLight);
sh([[19,58],[23,57],[24,61],[22,65],[19,65],[17,62]],C.skin);
fill([[19,59],[21,59],[21,62],[19,63]],C.skinLit);

// 6. Torso and jersey. Sharp dark outline, asymmetric golden sports piping.
sh([[31,35],[40,33],[49,36],[53,41],[51,54],[49,62],[42,66],[34,65],[27,61],[27,52],[26,45]],C.jerseyDark,C.ink,2);
fill([[31,38],[39,36],[48,38],[51,43],[49,55],[47,61],[41,64],[33,62],[29,59],[29,46]],C.purple);
fill([[33,39],[39,37],[46,39],[47,47],[44,55],[40,59],[33,57],[31,52]],C.purpleMid);
fill([[31,39],[35,38],[33,49],[31,53],[29,52],[29,45]],C.purpleLight);
fill([[48,40],[50,44],[48,56],[44,62],[42,63],[46,52]],C.jerseyDark);
// Jersey neckline and sleeve piping.
line([31,36],[34,42],C.goldDark,2);line([34,42],[41,44],C.gold,2);line([41,44],[47,37],C.goldDark,2);
line([28,44],[29,52],C.gold,2);line([29,54],[31,60],C.goldLight);
line([49,39],[51,44],C.gold,2);line([49,57],[48,61],C.goldDark,1);
// Arcaded chest crest. Stylized C inside a gold diamond, entirely authored pixels.
sh([[37,44],[42,45],[44,49],[41,54],[36,52],[34,48]],C.goldDark,C.ink);
fill([[37,46],[41,46],[42,49],[40,52],[37,51],[35,49]],C.gold);
fill([[38,47],[41,47],[40,48],[38,48],[37,50],[40,50],[39,51],[36,50],[36,48]],C.purple);
dots([[38,45],[41,46],[39,53]],C.goldLight);
// Waist and small belt trim.
line([30,59],[44,64],C.goldDark,2);line([31,59],[43,63],C.goldLight,1);

// 7. Near shoulder and white compression sleeve, unmistakable asymmetry.
sh([[48,37],[53,39],[57,44],[59,51],[57,57],[54,59],[50,56],[50,49],[46,44]],C.skinDark);
fill([[51,40],[55,43],[57,49],[55,52],[52,50],[49,44]],C.skin);
fill([[52,42],[55,45],[56,48],[54,48]],C.skinLight);
sh([[54,49],[59,50],[60,58],[58,66],[54,70],[49,68],[51,64],[53,58]],C.whiteDark);
fill([[55,51],[58,53],[58,59],[56,64],[53,66],[52,65],[55,58]],C.white);
fill([[55,52],[56,53],[55,63],[53,64]],C.whiteLight);
line([53,54],[58,55],C.whiteDark);line([52,63],[56,65],C.whiteLight);
// Near hand with separated finger cluster.
sh([[52,66],[57,65],[59,68],[59,72],[57,73],[56,71],[54,75],[52,73],[51,70]],C.skin);
fill([[54,67],[56,67],[57,70],[55,71],[53,70]],C.skinLight);
dots([[54,73],[57,72]],C.skinDark);

// 8. Neck and scarf wrap, behind head and over the jersey collar.
sh([[34,30],[44,30],[48,35],[45,39],[37,41],[31,37]],C.scarfShade);
fill([[33,32],[42,31],[46,34],[44,37],[38,39],[32,36]],C.scarf);
line([34,35],[43,36],C.scarfLit,2);
line([37,38],[42,39],C.goldDark);

// 9. Head and beard: three-quarter angle to screen-right.
sh([[33,17],[38,14],[46,15],[51,19],[53,25],[51,30],[49,35],[44,39],[37,37],[33,33],[32,27],[30,24]],C.beard,C.ink,2);
fill([[35,18],[41,16],[47,18],[50,22],[51,26],[47,31],[41,32],[36,29],[33,25]],C.skin);
fill([[40,18],[46,18],[49,21],[49,25],[45,28],[41,27]],C.skinLight);
fill([[46,20],[49,22],[50,25],[47,25]],C.skinLit);
// Three-quarter nose ridge, brows, and ear.
sh([[48,24],[53,26],[52,28],[49,28]],C.skinLight,C.skinDark);
p.rect(47,27,4,1,C.skinDark);
sh([[32,24],[35,23],[36,28],[33,29]],C.skinDark,C.beard);
p.rect(34,25,2,2,C.skinLight);
// Lively salt-and-pepper beard around cheeks, jaw and chin.
fill([[32,28],[36,30],[40,31],[45,32],[49,30],[48,35],[44,38],[38,37],[34,33]],C.beard);
fill([[35,31],[38,34],[42,35],[39,37],[36,35]],C.beardShade);
fill([[45,31],[48,31],[46,35],[44,36]],C.beardShade);
dots([[34,29],[36,31],[34,33],[36,35],[39,34],[40,36],[42,37],[44,35],[46,33],[47,31]],C.beardSilver);
dots([[33,30],[37,33],[42,36],[44,36]],C.silverLight);
// Mouth within beard, not a second disconnected facial component.
line([44,31],[48,31],C.ink);p.dot(48,30,C.skinLight);

// 10. Very distinctive rectangular blue glasses, visible iris, temple.
line([35,24],[38,23],C.glass,2);
sh([[39,22],[46,22],[47,27],[40,28]],C.glassDark,C.glass,1);
fill([[40,23],[45,23],[45,26],[41,26]],C.glassLight);
p.rect(42,24,2,2,C.deep);p.dot(43,24,C.whiteLight);
sh([[48,22],[52,23],[53,27],[49,28]],C.glassDark,C.glass,1);
p.dot(50,24,C.glassLight);p.dot(51,24,C.ink);
line([46,23],[49,23],C.glassLight,1);
line([39,22],[46,22],C.glassLight);

// 11. Gray-streaked curls, irregular rather than a single smooth helmet.
sh([[31,19],[31,15],[34,12],[37,11],[40,9],[44,11],[47,9],[50,12],[51,16],[49,19],[45,19],[43,16],[38,18],[34,20]],C.hair,C.ink);
for(const [x,y,r] of [[34,14,3],[39,12,3],[44,13,3],[48,14,2],[32,18,2],[38,17,2],[46,17,2]])p.ellipse(x,y,r,r,C.hair);
// Deliberate chunky curl clusters.
dots([[34,13],[35,12],[37,15],[39,11],[42,10],[44,12],[47,11],[49,14],[34,18],[39,16],[46,16]],C.hairMid);
dots([[37,11],[38,12],[40,12],[43,14],[46,11],[48,13],[35,16],[42,16]],C.silver);
dots([[37,10],[44,10],[47,12]],C.silverLight);

// 12. Living temple crest. Both sides sweep BACKWARD (to image-left), never rise like antlers.
// Roots begin by the ear and forehead; primary branches stay tight to the head contour.
const branch=(a,b,col=C.crest,w=1)=>line(a,b,col,w);
branch([34,19],[26,15],C.crest,2);branch([26,15],[18,15],C.crest,2);
branch([29,17],[21,11],C.bark,1);branch([21,11],[15,12],C.crest);
branch([23,15],[17,18],C.crest);branch([17,18],[12,17],C.crest);
branch([30,21],[23,20],C.crest,2);branch([23,20],[15,22],C.bark);
branch([22,20],[18,24],C.crest);branch([25,16],[23,13],C.barkLight);
// Far-side root peeking behind head.
branch([46,17],[40,13],C.bark,1);branch([40,13],[35,14],C.crest);
// Bark facet highlights on the longest rearward limb.
branch([24,15],[19,15],C.barkLight);branch([23,20],[18,21],C.barkLight);
// Tiny ivory blossoms, not pink antler spikes.
function blossom(x,y){p.dot(x,y,C.blossomCore);p.dot(x-1,y,C.blossom);p.dot(x+1,y,C.blossomPink);p.dot(x,y-1,C.blossom);p.dot(x,y+1,C.blossomPink)}
blossom(17,12);blossom(13,17);blossom(16,22);blossom(24,12);
p.dot(19,17,C.leaf);p.dot(27,18,C.leaf);

// 13. Final specular pixel accents and outlining at the most readable points.
dots([[40,23],[43,22],[51,23],[54,66],[57,55],[38,45],[28,53],[45,87],[22,90]],C.whiteLight);
p.dot(40,46,C.goldLight);

// Pack with the same deliberate bottom clearance used in production sprite audits.
// This is a whole-sprite translation, not a resized or traced source image.
for (let y=0; y<H; y++) for (let x=0; x<W; x++) {
  const dst=4*(y*W+x), src=4*((y+2)*W+x);
  if(y+2<H){ p.bytes[dst]=p.bytes[src];p.bytes[dst+1]=p.bytes[src+1];p.bytes[dst+2]=p.bytes[src+2];p.bytes[dst+3]=p.bytes[src+3]; }
  else {p.bytes[dst]=0;p.bytes[dst+1]=0;p.bytes[dst+2]=0;p.bytes[dst+3]=0;}
}

// PNG encoding is handwritten over built-in zlib. This file creates real RGBA PNGs.
function crc32(buf){let c=0xffffffff;for(const byte of buf){c^=byte;for(let n=0;n<8;n++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^0xffffffff)>>>0}
function chunk(type,data){const name=Buffer.from(type,'ascii'),sz=Buffer.alloc(4),crc=Buffer.alloc(4);sz.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([name,data])));return Buffer.concat([sz,name,data,crc]);}
function png(){const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(W,0);ihdr.writeUInt32BE(H,4);ihdr[8]=8;ihdr[9]=6;const scan=Buffer.alloc(H*(W*4+1));for(let y=0;y<H;y++)Buffer.from(p.bytes.buffer,y*W*4,W*4).copy(scan,y*(W*4+1)+1);return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(scan,{level:9})),chunk('IEND',Buffer.alloc(0))]);}
const outfile=process.argv[2]??'manaconda-code-pixel.png';writeFileSync(outfile,png());
const occupied=[...p.bytes].filter((_,i)=>i%4===3&&p.bytes[i]>0).length;
console.log(JSON.stringify({output:outfile,width:W,height:H,transparent:true,occupiedPixels:occupied,palette:Object.keys(C).length,method:'deterministic hand-coded pixel primitives; no image generation'},null,2));
