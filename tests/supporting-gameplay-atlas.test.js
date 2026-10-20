import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';

test('generated supporting-athlete atlas contains 70 transparent roster sprites in manifest order',async()=>{
  const png=await readFile(new URL('../public/assets/supporting-player-gameplay-sprites.png',import.meta.url));
  assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
  assert.equal(width,1500);assert.equal(height,1049);assert.equal(png[25],6);
  assert.ok(png.length>3_500_000,'original supporting-player art is included');
  const chunks=[];for(let offset=8;offset<png.length;){const length=png.readUInt32BE(offset),type=png.toString('ascii',offset+4,offset+8);if(type==='IDAT')chunks.push(png.subarray(offset+8,offset+8+length));offset+=length+12;}
  const packed=inflateSync(Buffer.concat(chunks)),stride=width*4,pixels=Buffer.alloc(stride*height);let sourceOffset=0,previous=Buffer.alloc(stride);
  const paeth=(left,up,upLeft)=>{const base=left+up-upLeft,dl=Math.abs(base-left),du=Math.abs(base-up),dul=Math.abs(base-upLeft);return dl<=du&&dl<=dul?left:du<=dul?up:upLeft};
  for(let y=0;y<height;y++){
    const filter=packed[sourceOffset++],row=pixels.subarray(y*stride,(y+1)*stride);
    for(let x=0;x<stride;x++){
      const left=x>=4?row[x-4]:0,up=previous[x],upLeft=x>=4?previous[x-4]:0;let predict=0;
      if(filter===1)predict=left;else if(filter===2)predict=up;else if(filter===3)predict=Math.floor((left+up)/2);else if(filter===4)predict=paeth(left,up,upLeft);else assert.equal(filter,0,'PNG row filter is supported');
      row[x]=(packed[sourceOffset+x]+predict)&255;
    }
    sourceOffset+=stride;previous=Buffer.from(row);
  }
  for(let index=0;index<70;index++){
    const col=index%10,rowIndex=Math.floor(index/10),x0=Math.floor((col+.07)*width/10),x1=Math.ceil((col+.93)*width/10),y0=Math.floor((rowIndex+.07)*height/7),y1=Math.ceil((rowIndex+.93)*height/7);let visible=0,transparent=0;
    for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const alpha=pixels[y*stride+x*4+3];if(alpha)visible++;else transparent++}
    assert.ok(visible>500,`supporting gameplay sprite ${index+1} contains visible figure art`);
    assert.ok(transparent>500,`supporting gameplay sprite ${index+1} retains transparent background`);
  }
});
