import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';

const sheets=[
  ['captain-run-sprites.png',1484,1060,7,5,35],
  ['supporting-player-run-sprites.png',1500,1049,10,7,70],
  ['captain-run-sprites-2.png',1484,1060,7,5,35],
  ['supporting-player-run-sprites-2.png',1500,1049,10,7,70],
  ['captain-run-sprites-3.png',1484,1060,7,5,35],
  ['supporting-player-run-sprites-3.png',1500,1049,10,7,70],
  ['captain-shot-sprites.png',1484,1060,7,5,35],
  ['supporting-shot-sprites.png',1500,1049,10,7,70],
  ['captain-dunk-sprites.png',1484,1060,7,5,35],
  ['supporting-dunk-sprites.png',1500,1049,10,7,70]
];

test('generated run-cycle atlases cover all 105 roster athletes with transparent RGBA sheets',async()=>{
  for(const [file,width,height,columns,rows,count] of sheets){
    const png=await readFile(new URL(`../public/assets/${file}`,import.meta.url));
    assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10],`${file} has PNG signature`);
    assert.equal(png.readUInt32BE(16),width,`${file} width`);assert.equal(png.readUInt32BE(20),height,`${file} height`);
    assert.equal(png[24],8,`${file} bit depth`);assert.equal(png[25],6,`${file} retains alpha transparency`);
    assert.ok(png.length>2_000_000,`${file} includes generated art`);
    assert.equal(columns*rows,count);
    const chunks=[];for(let offset=8;offset<png.length;){const length=png.readUInt32BE(offset),type=png.toString('ascii',offset+4,offset+8);if(type==='IDAT')chunks.push(png.subarray(offset+8,offset+8+length));offset+=length+12;}
    const packed=inflateSync(Buffer.concat(chunks)),stride=width*4,pixels=Buffer.alloc(stride*height);let sourceOffset=0,previous=Buffer.alloc(stride);
    const paeth=(left,up,upLeft)=>{const base=left+up-upLeft,dl=Math.abs(base-left),du=Math.abs(base-up),dul=Math.abs(base-upLeft);return dl<=du&&dl<=dul?left:du<=dul?up:upLeft};
    for(let y=0;y<height;y++){
      const filter=packed[sourceOffset++],row=pixels.subarray(y*stride,(y+1)*stride);
      for(let x=0;x<stride;x++){
        const left=x>=4?row[x-4]:0,up=previous[x],upLeft=x>=4?previous[x-4]:0;let predict=0;
        if(filter===1)predict=left;else if(filter===2)predict=up;else if(filter===3)predict=Math.floor((left+up)/2);else if(filter===4)predict=paeth(left,up,upLeft);else assert.equal(filter,0,`${file} uses a supported PNG filter`);
        row[x]=(packed[sourceOffset+x]+predict)&255;
      }
      sourceOffset+=stride;previous=Buffer.from(row);
    }
    for(let index=0;index<count;index++){
      const col=index%columns,rowIndex=Math.floor(index/columns),x0=Math.floor(col*width/columns)+4,x1=Math.ceil((col+1)*width/columns)-4,y0=Math.floor(rowIndex*height/rows)+4,y1=Math.ceil((rowIndex+1)*height/rows)-4;let visible=0,transparent=0;
      for(let y=y0;y<y1;y+=2)for(let x=x0;x<x1;x+=2){if(pixels[y*stride+x*4+3])visible++;else transparent++;}
      assert.ok(visible>100,`${file} roster sprite ${index+1} contains visible character art`);
      assert.ok(transparent>100,`${file} roster sprite ${index+1} retains transparent space`);
    }
  }
});
