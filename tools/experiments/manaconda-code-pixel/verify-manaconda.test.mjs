import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import test from 'node:test';

const loc = new URL('./generate-manaconda.mjs', import.meta.url).pathname;
function generate(p) {
  const r = spawnSync(process.execPath,[loc,p],{encoding:'utf8'});
  assert.equal(r.status,0,r.stderr);
  return readFileSync(p);
}
function png(buf) {
  assert.equal(buf.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(buf.subarray(12,16).toString(),'IHDR');
  const width=buf.readUInt32BE(16),height=buf.readUInt32BE(20);
  assert.equal(width,64); assert.equal(height,96);
  assert.equal(buf[24],8);assert.equal(buf[25],6);
  const payloads=[];let off=8;
  while(off<buf.length){const len=buf.readUInt32BE(off),type=buf.subarray(off+4,off+8).toString();if(type==='IDAT')payloads.push(buf.subarray(off+8,off+8+len));off+=len+12;}
  const raw=inflateSync(Buffer.concat(payloads)),pixels=Buffer.alloc(width*height*4);
  for(let y=0;y<height;y++){
    assert.equal(raw[y*(width*4+1)],0,'Rows must use no PNG filter');
    raw.copy(pixels,y*width*4,y*(width*4+1)+1,(y+1)*(width*4+1));
  }
  return {pixels,width,height};
}
test('standalone generation is deterministic with valid transparent RGBA',()=>{
  const dir=mkdtempSync(join(tmpdir(),'manaconda-code-'));
  try{
    const a=generate(join(dir,'a.png')), b=generate(join(dir,'b.png'));
    assert.equal(createHash('sha256').update(a).digest('hex'),createHash('sha256').update(b).digest('hex'));
    const {pixels,width,height}=png(a);
    let count=0,minX=width,minY=height,maxX=-1,maxY=-1;
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      const a=pixels[(y*width+x)*4+3];
      if(!a)continue;count++;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
      assert.equal(a,255,'No unexpectedly feathered alpha pixels');
    }
    assert.ok(count>=1800 && count<4000,'Visible sprite size');
    assert.ok(minX>=2 && maxX<=width-3 && minY>=2 && maxY<=height-3,'Transparent frame gutter');
    assert.ok(pixels.some((v,i)=>i%4===3 && v===0),'True alpha transparency');
    const src=readFileSync(loc,'utf8');
    assert.doesNotMatch(src,/import\s+.*(?:sharp|canvas|image_gen|stable.diffusion|sora)/i);
  }finally{rmSync(dir,{recursive:true,force:true});}
});
