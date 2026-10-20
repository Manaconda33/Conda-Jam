import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';

test('generated franchise crest atlas is an RGBA 8 by 5 league sheet',async()=>{
  const png=await readFile(new URL('../public/assets/team-crest-atlas.png',import.meta.url));
  assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
  assert.equal(width,1659);
  assert.equal(height,948);
  assert.equal(png[25],6);
  assert.ok(png.length>1_000_000);
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
    const col=index<7?index:index<15?index-7:index<23?index-15:index<31?index-23:index-31;
    const rowIndex=index<7?0:index<15?1:index<23?2:index<31?3:4;
    const x0=Math.floor((col+.15)*width/8),x1=Math.ceil((col+.85)*width/8),y0=Math.floor((rowIndex+.15)*height/5),y1=Math.ceil((rowIndex+.85)*height/5);
    let visible=0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(pixels[y*stride+x*4+3]>0)visible++;
    assert.ok(visible>100,`crest tile ${index+1} should contain visible art`);
  }
});
