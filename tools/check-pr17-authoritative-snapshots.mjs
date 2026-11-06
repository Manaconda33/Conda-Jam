import fs from 'node:fs';
import crypto from 'node:crypto';

const [generatedJsonPath, generatedMarkdownPath, committedJsonPath, committedMarkdownPath, statusPath, outputPath] = process.argv.slice(2);
if ([generatedJsonPath, generatedMarkdownPath, committedJsonPath, committedMarkdownPath, statusPath].some(x => !x)) {
  console.error('Usage: node tools/check-pr17-authoritative-snapshots.mjs generated.json generated.md committed.json committed.md status.md [output.json]');
  process.exit(2);
}

const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const text = file => fs.readFileSync(file, 'utf8');
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
const generated = json(generatedJsonPath);
const committed = json(committedJsonPath);
const [generatedMarkdown, committedMarkdown, status] = [text(generatedMarkdownPath), text(committedMarkdownPath), text(statusPath)];

const withoutTimestamp = data => {
  const { generatedAt, ...rest } = data;
  return rest;
};
const expectedDigest = sha256(JSON.stringify(withoutTimestamp(committed)));
const actualDigest = sha256(JSON.stringify(withoutTimestamp(generated)));
const jsonMatches = expectedDigest === actualDigest;

// All the generator's output must match byte-for-byte except for its timestamp.
// The timestamp in checked-in Markdown must match checked-in JSON exactly.
const normalizedMarkdown = generatedMarkdown.replace(/^Generated: .+$/m, 'Generated: ' + committed.generatedAt);
const markdownMatches = normalizedMarkdown === committedMarkdown;
const expectedCounts = { 'missing-clip': 706, 'prompt-not-verbatim': 40 };
const actualCounts = Object.fromEntries(Object.keys(expectedCounts).map(code => [
  code, generated.errors?.filter(e => e.code === code).length
]));
const countsMatch = Object.keys(expectedCounts).every(code => actualCounts[code] === expectedCounts[code]);
const auditIncomplete = generated.ok === false && committed.ok === false &&
  generated.targetShortfalls?.length === 0 && committed.targetShortfalls?.length === 0;
const statusCurrent = status.startsWith('## Current PR #17 combined integration audit — November 6, 2026 (review only)') &&
  status.includes('| Missing captain clips (unaccepted backlog) | **706** |') &&
  status.includes('| Disclosed non-verbatim prompts (not recovered/waived) | **40** |') &&
  status.includes('### Historical captain-production status entries (preserved verbatim below)') &&
  status.includes('## Current captain lane — 2026-10-29 12:43 UTC');
const passed = jsonMatches && markdownMatches && countsMatch && auditIncomplete && statusCurrent;
const summary = {
  scope: 'PR17 authoritative combined audit snapshot compared with newly generated runtime evidence',
  generatedAtCommitted: committed.generatedAt,
  generatedAtRecheck: generated.generatedAt,
  actualDigest,
  committedDigest: expectedDigest,
  jsonMatches, markdownMatches, countsMatch, actualCounts,
  strictArtAccepted: committed.ok, auditIncomplete, statusCurrent, passed
};
if (outputPath) fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
if (!passed) {
  console.error('FAIL: checked-in authoritative report is inconsistent with actual combined source (or its preserved historical status).');
  process.exitCode = 1;
} else {
  console.log('PASS: complete authoritative JSON, Markdown, and status agree with fresh combined-tree audit; strict art still incomplete');
}
