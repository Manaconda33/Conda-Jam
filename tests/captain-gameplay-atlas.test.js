import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';

test('generated captain gameplay atlas contains 35 transparent full-body sprites in roster order',async()=>{
  const png=await readFile(new URL('../public/assets/captain-gameplay-sprites.png',import.meta.url));
  assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
  assert.equal(width,1484);assert.equal(height,1060);assert.equal(png[25],6);
  assert.ok(png.length>3_000_000,'original full-body art is included');
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
  for(let index=0;index<35;index++){
    const col=index%7,rowIndex=Math.floor(index/7),x0=col*212+10,x1=(col+1)*212-10,y0=rowIndex*212+10,y1=(rowIndex+1)*212-10;let visible=0,transparent=0;
    for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const alpha=pixels[y*stride+x*4+3];if(alpha)visible++;else transparent++}
    assert.ok(visible>1_000,`captain gameplay sprite ${index+1} contains visible figure art`);
    assert.ok(transparent>1_000,`captain gameplay sprite ${index+1} retains transparent background`);
  }
});
