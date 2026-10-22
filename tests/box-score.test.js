import test from 'node:test';
import assert from 'node:assert/strict';
import {boxScoreHeader,formatBoxScoreRow} from '../src/ui/box-score.js';

test('final player box score labels knockdowns explicitly',()=>{
 assert.match(boxScoreHeader,/\bKDN\b/);
});

test('final player box score reports counted knockdowns for starters and substitutes',()=>{
 const row=formatBoxScoreRow({name:'Thump Alder',points:12,fgm:3,fga:6,threeMakes:1,threeAttempts:2,dunks:1,assists:2,rebounds:4,steals:1,blocks:1,turnovers:3,knockdowns:2,highestStreak:4});
 assert.equal(row,'Thump Ald… 12 3/6 1/2  1   2   4  1  1  3  2  4');
});
