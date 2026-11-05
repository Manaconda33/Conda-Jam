import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';

const generator=fileURLToPath(new URL('./generate-manaconda-v2.mjs',import.meta.url));
const v1=fileURLToPath(new URL('../manaconda-code-pixel.png',import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
function unpack(buf){
  assert.equal(buf.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(buf.subarray(12,16).toString(),'IHDR');
  const width=buf.readUInt32BE(16),height=buf.readUInt32BE(20);
  assert.equal(buf[24],8);assert.equal(buf[25],6);
  let pos=8,chunks=[];while(pos<buf.length){const len=buf.readUInt32BE(pos),type=buf.subarray(pos+4,pos+8).toString();if(type==='IDAT')chunks.push(buf.subarray(pos+8,pos+8+len));pos+=len+12;}
  let raw=inflateSync(Buffer.concat(chunks)),pixels=Buffer.alloc(width*height*4);
  for(let y=0;y<height;y++){const stride=width*4+1;assert.equal(raw[y*stride],0,'No PNG filtering expected');raw.copy(pixels,y*width*4,y*stride+1,(y+1)*stride);}
  return {width,height,pixels};
}
function inspect(image){const {width,height,pixels}=image;let count=0,minX=width,maxX=-1,minY=height,maxY=-1;const colors=new Set();for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const i=(y*width+x)*4,a=pixels[i+3];assert.ok(a===0||a===255,'Strict alpha transparency');if(a){count++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);colors.add(`${pixels[i]},${pixels[i+1]},${pixels[i+2]}`);}}
  return {count,minX,minY,maxX,maxY,colors:colors.size};
}
test('native V2 is deterministic, truly transparent and has safe margins',()=>{
  const dir=mkdtempSync(join(tmpdir(),'manaconda-v2-'));
  try{
    const a=join(dir,'a.png'),b=join(dir,'b.png'),h=join(dir,'half.png');
    for(const target of [a,b]){const res=spawnSync(process.execPath,[generator,target,'--half',h],{encoding:'utf8'});assert.equal(res.status,0,res.stderr);}
    const first=readFileSync(a),second=readFileSync(b);assert.equal(sha(first),sha(second),'Exact deterministic bytes');
    const hi=unpack(first),half=unpack(readFileSync(h)),old=unpack(readFileSync(v1));
    assert.deepEqual([hi.width,hi.height],[128,192]);assert.deepEqual([half.width,half.height],[64,96]);assert.deepEqual([old.width,old.height],[64,96]);
    const stats=inspect(hi);assert.ok(stats.count>9000,'Substantial detailed native-resolution geometry');assert.ok(stats.colors>=55,'Expanded tonal palette');
    assert.ok(stats.minX>=3 && stats.maxX<=124 && stats.minY>=3 && stats.maxY<=188,'At least three transparent pixel gutter');
    assert.ok(stats.maxX-stats.minX>90&&stats.maxY-stats.minY>150,'Sprite fills its character cell');
    let downDiff=0,oldDiff=0,detail=0;
    for(let y=0;y<96;y++)for(let x=0;x<64;x++){
      const hiOff=((y*2)*128+x*2)*4,halfOff=(y*64+x)*4;
      for(let c=0;c<4;c++){
        assert.equal(half.pixels[halfOff+c],hi.pixels[hiOff+c],'Half export is a deterministic sampling of native V2');
        if(half.pixels[halfOff+c]!==old.pixels[halfOff+c])oldDiff++;
      }
    }
    // A naive upscale makes all four pixels of every 2x2 block identical. V2 must not.
    for(let y=0;y<190;y+=2)for(let x=0;x<126;x+=2){const base=(y*128+x)*4;for(const off of [4,128*4,(128+1)*4])if(hi.pixels[base+3]&&hi.pixels[base+off+3]&&hi.pixels[base]!==hi.pixels[base+off])detail++;}
    assert.ok(oldDiff>8000,'Redesigned, not a copy of V1');assert.ok(detail>250,'Native fine-scale details, not 2x V1 pixel enlargement');
    assert.doesNotMatch(readFileSync(generator,'utf8'),/from ['"](?:canvas|sharp|image_gen|@img|@napi-rs\/canvas)['"]/i);
    console.log(JSON.stringify({v2_sha256:sha(first),visible_pixels:stats.count,visible_colors:stats.colors,low_res_vs_v1_differences:oldDiff,native_2x2_detail:detail}));
  }finally{rmSync(dir,{recursive:true,force:true});}
});
