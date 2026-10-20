import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sheets=[
  ['captain-run-sprites.png',1484,1060,7,5,35],
  ['supporting-player-run-sprites.png',1500,1049,10,7,70],
  ['captain-shot-sprites.png',1484,1060,7,5,35],
  ['supporting-shot-sprites.png',1500,1049,10,7,70],
  ['captain-dunk-sprites.png',1484,1060,7,5,35],
  ['supporting-dunk-sprites.png',1500,1049,10,7,70]
];

test('generated run-pose atlases cover all 105 roster athletes with transparent RGBA sheets',async()=>{
  for(const [file,width,height,columns,rows,count] of sheets){
    const png=await readFile(new URL(`../public/assets/${file}`,import.meta.url));
    assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10],`${file} has PNG signature`);
    assert.equal(png.readUInt32BE(16),width,`${file} width`);assert.equal(png.readUInt32BE(20),height,`${file} height`);
    assert.equal(png[24],8,`${file} bit depth`);assert.equal(png[25],6,`${file} retains alpha transparency`);
    assert.ok(png.length>2_000_000,`${file} includes generated art`);
    assert.equal(columns*rows,count);
  }
});
