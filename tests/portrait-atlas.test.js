import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';

test('generated captain portrait atlas is a transparent 7 by 5 portrait grid', async () => {
  const png=await readFile(new URL('../public/assets/captain-portrait-atlas.png',import.meta.url));
  assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10],'atlas must be a PNG');
  assert.equal(png.readUInt32BE(16),1484,'seven evenly sized portrait columns');
  assert.equal(png.readUInt32BE(20),1060,'five evenly sized portrait rows');
  assert.equal(png[25],6,'generated image uses RGBA color');
  assert.ok(png.length>1_000_000,'generated original art must be included in the project');
  const chunks=[];for(let offset=8;offset<png.length;){const length=png.readUInt32BE(offset),type=png.toString('ascii',offset+4,offset+8);if(type==='IDAT')chunks.push(png.subarray(offset+8,offset+8+length));offset+=length+12;}
  const pixels=inflateSync(Buffer.concat(chunks)),stride=1484*4;let sourceOffset=0,previous=Buffer.alloc(stride),hasTransparentPixel=false;
  const paeth=(left,up,upLeft)=>{const base=left+up-upLeft,dl=Math.abs(base-left),du=Math.abs(base-up),dul=Math.abs(base-upLeft);return dl<=du&&dl<=dul?left:du<=dul?up:upLeft};
  for(let y=0;y<1060;y++){const filter=pixels[sourceOffset++],row=Buffer.allocUnsafe(stride);for(let x=0;x<stride;x++){const left=x>=4?row[x-4]:0,up=previous[x],upLeft=x>=4?previous[x-4]:0;let predict=0;if(filter===1)predict=left;else if(filter===2)predict=up;else if(filter===3)predict=Math.floor((left+up)/2);else if(filter===4)predict=paeth(left,up,upLeft);row[x]=(pixels[sourceOffset+x]+predict)&255;if(x%4===3&&row[x]===0)hasTransparentPixel=true;}sourceOffset+=stride;previous=row;}
  assert.ok(hasTransparentPixel,'portrait atlas must have transparent padding');
});
