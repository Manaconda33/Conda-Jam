import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('generated franchise crest atlas is an RGBA 8 by 5 league sheet',async()=>{
  const png=await readFile(new URL('../public/assets/team-crest-atlas.png',import.meta.url));
  assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  assert.equal(png.readUInt32BE(16),1659);
  assert.equal(png.readUInt32BE(20),948);
  assert.equal(png[25],6);
  assert.ok(png.length>1_000_000);
});
