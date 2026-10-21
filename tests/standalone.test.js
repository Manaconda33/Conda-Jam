import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));

test('build emits a self-contained offline game page', async () => {
  execFileSync(process.execPath, ['tools/build.mjs'], { cwd:root, stdio:'inherit' });
  const html = await readFile(path.join(root,'dist/JAMVERSE_96.html'), 'utf8');
  assert.match(html, /<style>[\s\S]*<\/style>/);
  assert.match(html, /<script>[\s\S]*<\/script>/);
  assert.doesNotMatch(html, /<link\b[^>]*\bhref=/i);
  assert.doesNotMatch(html, /<script\b[^>]*\bsrc=/i);
  assert.doesNotMatch(html, /(?:src|href)=["'](?:\.\.?\/|\/)/i);
  assert.match(html, /window\.jamverse/);
  assert.match(html, /const teams/);
  assert.match(html,/data:image\/png;base64,[A-Za-z0-9+/]{1000}/,'generated portrait atlas is embedded in the standalone page');
  assert.equal([...html.matchAll(/data:image\/png;base64,[A-Za-z0-9+/]{1000}/g)].length,15,'portraits, crests, base sprites, four-frame run cycles, shot and dunk poses are embedded in the standalone page');
  assert.equal([...html.matchAll(/data:image\/webp;base64,[A-Za-z0-9+/]{1000}/g)].length,36,'both keyframes for all nine full-roster action sets are embedded in the standalone page');
  assert.doesNotMatch(html,/\.\/public\/assets\/captain-portrait-atlas\.png/,'standalone page must not rely on a separate asset request');
  assert.doesNotMatch(html,/\.\/public\/assets\/team-crest-atlas\.png/,'standalone page must not rely on a separate crest request');
  assert.doesNotMatch(html,/\.\/public\/assets\/captain-gameplay-sprites\.png/,'standalone page must not rely on a separate gameplay sprite request');
  assert.doesNotMatch(html,/\.\/public\/assets\/supporting-player-gameplay-sprites\.png/,'standalone page must not rely on a separate supporting sprite request');
  assert.doesNotMatch(html,/\.\/public\/assets\/supporting-player-portrait-atlas\.png/,'standalone page must not rely on a separate supporting portrait request');
  assert.doesNotMatch(html,/\.\/public\/assets\/captain-run-sprites\.png/,'standalone page must not rely on a separate captain run-pose request');
  assert.doesNotMatch(html,/\.\/public\/assets\/supporting-player-run-sprites\.png/,'standalone page must not rely on a separate support run-pose request');
  assert.doesNotMatch(html,/\.\/public\/assets\/captain-run-sprites-2\.png/,'standalone page embeds the second captain run keyframe');
  assert.doesNotMatch(html,/\.\/public\/assets\/supporting-player-run-sprites-2\.png/,'standalone page embeds the second support run keyframe');
  assert.doesNotMatch(html,/\.\/public\/assets\/captain-run-sprites-3\.png/,'standalone page embeds the third captain run keyframe');
  assert.doesNotMatch(html,/\.\/public\/assets\/supporting-player-run-sprites-3\.png/,'standalone page embeds the third support run keyframe');
  assert.doesNotMatch(html,/\.\/public\/assets\/captain-shot-sprites\.png/,'standalone page must not rely on a separate captain shot-pose request');
  assert.doesNotMatch(html,/\.\/public\/assets\/supporting-shot-sprites\.png/,'standalone page must not rely on a separate support shot-pose request');
  assert.doesNotMatch(html,/\.\/public\/assets\/captain-dunk-sprites\.png/,'standalone page must not rely on a separate captain dunk-pose request');
  assert.doesNotMatch(html,/\.\/public\/assets\/supporting-dunk-sprites\.png/,'standalone page must not rely on a separate support dunk-pose request');
  for(const action of ['pass','receive','push','block','rebound','pickup','celebrate','shoot','dunk'])for(const group of ['captains','supporting'])for(const frame of ['', '-frame2'])assert.doesNotMatch(html,new RegExp(`\\.\\/public\\/assets\\/action-${action}${frame}-${group}\\.webp`),`standalone page must embed ${action} ${group} frame ${frame||'1'}`);
});
