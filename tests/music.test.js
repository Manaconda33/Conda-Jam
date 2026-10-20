import test from 'node:test';
import assert from 'node:assert/strict';
import { musicStep, musicPatternLength } from '../src/core/music.js';

test('original arcade music provides a bounded repeating bass, lead and drum pattern', () => {
  assert.equal(musicPatternLength,16);
  for(let i=0;i<musicPatternLength;i++){
    const note=musicStep(i);
    assert.ok(note.bassHz>=55&&note.bassHz<=220);
    assert.ok(note.leadHz===null||(note.leadHz>=200&&note.leadHz<=1200));
    assert.equal(typeof note.kick,'boolean');
    assert.equal(typeof note.snare,'boolean');
  }
  assert.deepEqual(musicStep(0),musicStep(16));
  assert.ok(Array.from({length:16},(_,i)=>musicStep(i)).some(n=>n.kick));
  assert.ok(Array.from({length:16},(_,i)=>musicStep(i)).some(n=>n.snare));
});
