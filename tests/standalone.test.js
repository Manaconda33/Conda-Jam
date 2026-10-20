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
  assert.equal([...html.matchAll(/data:image\/png;base64,[A-Za-z0-9+/]{1000}/g)].length,2,'portrait and crest atlases are embedded in the standalone page');
  assert.doesNotMatch(html,/\.\/public\/assets\/captain-portrait-atlas\.png/,'standalone page must not rely on a separate asset request');
  assert.doesNotMatch(html,/\.\/public\/assets\/team-crest-atlas\.png/,'standalone page must not rely on a separate crest request');
});
