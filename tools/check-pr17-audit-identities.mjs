import fs from 'node:fs';

const [actualPath, baselinePath, reportPath] = process.argv.slice(2);
if (!actualPath || !baselinePath) {
  console.error('Usage: node tools/check-pr17-audit-identities.mjs generated-audit.json pinned-baseline.json [delta-report.json]');
  process.exit(2);
}
const actual = JSON.parse(fs.readFileSync(actualPath, 'utf8'));
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const keys = ['code', 'athlete', 'direction', 'clip', 'classification'];
if (baseline.version !== 1 || JSON.stringify(baseline.signatureFields) !== JSON.stringify(keys))
  throw Error('Unsupported baseline schema');
const signature = record => keys.map(key => {
  if (typeof record[key] !== 'string' || !record[key] || record[key].includes('|'))
    throw Error('Invalid audit signature field: ' + key);
  return record[key];
}).join('|');
const expected = baseline.signatures;
if (!Array.isArray(expected) || expected.length !== 746 || new Set(expected).size !== expected.length ||
  expected.some(x => typeof x !== 'string')) throw Error('Incomplete or duplicate baseline signatures');
const expectedCounts = { 'missing-clip': 0, 'prompt-not-verbatim': 0 };
for (const value of expected) {
  const code = value.split('|')[0];
  if (!(code in expectedCounts)) throw Error('Unexpected baseline error: ' + code);
  expectedCounts[code]++;
}
for (const [code,count] of Object.entries(expectedCounts))
  if (baseline.expectedCounts?.[code] !== count) throw Error('Baseline count conflict: '+code);
if (!Array.isArray(actual.errors)) throw Error('Generated audit missing errors array');
const observed = actual.errors.map(signature);
const ex = new Set(expected), got = new Set(observed);
const introduced = [...got].filter(x=>!ex.has(x)).sort();
const removed = [...ex].filter(x=>!got.has(x)).sort();
const duplicateCount = observed.length-got.size;
const frameShortfalls = actual.targetShortfalls?.length;
const countsOK = actual.missingClipCount === 706 &&
  observed.filter(x=>x.startsWith('prompt-not-verbatim|')).length === 40;
const passed = !introduced.length && !removed.length && !duplicateCount && observed.length===746 &&
  countsOK && frameShortfalls===0 && actual.ok===false;
const summary = {scope:'PR17 exact asset findings including direction/classification',
  pinnedSources:baseline.sourceBlobs,expected:expected.length,observed:observed.length,
  introducedCount:introduced.length,removedCount:removed.length,duplicateCount,
  introduced:introduced.slice(0,50),removed:removed.slice(0,50),
  missingClipCount:actual.missingClipCount,frameShortfalls,strictArtAccepted:actual.ok,passed};
if(reportPath)fs.writeFileSync(reportPath,JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
if(!passed){console.error('FAIL: Asset findings changed even if totals match');process.exitCode=1;}
else console.log('PASS: All 746 exact inherited identities match pinned source baselines');
