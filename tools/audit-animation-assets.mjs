import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { teams } from '../src/content/teams.js';
import { supportingAnimationLibraries } from '../src/content/supporting-animation-libraries.js';
import { animationClips } from '../src/core/animation.js';
import { auditManifest } from './animation-assets.mjs';

const args = process.argv.slice(2);
const value = flag => args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined;
const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const manifestPath = path.resolve(root, value('--manifest') || 'public/assets/animation/manifest.json');
let manifest, loadError;
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); }
catch (error) { loadError = error.message; }
const report = await auditManifest({ manifest, root, athletes: teams.flatMap(team => team.roster), clips: animationClips, libraries: supportingAnimationLibraries });
if (loadError) report.errors.unshift({ code: 'manifest-unreadable', message: loadError });
report.ok = report.errors.length === 0;
if (value('--json')) await writeFile(path.resolve(root, value('--json')), `${JSON.stringify(report, null, 2)}\n`);
if (value('--markdown')) {
  const counts = new Map();
  for (const error of report.errors) counts.set(error.code, (counts.get(error.code) || 0) + 1);
  await writeFile(path.resolve(root, value('--markdown')), [
    '# Animation asset audit', '', `Generated: ${report.generatedAt}`, '',
    `Status: **${report.ok ? 'PASS' : 'INCOMPLETE'}**`, '',
    `${report.athletes} athletes; ${report.clipDefinitions} required clips per athlete; ${report.inspectedClips} existing clips decoded across ${report.uniqueSourceLibraries} unique source libraries, ${report.uniqueSourceAtlases} source atlases and ${report.uniqueSourceDrawings} unique decoded source drawings.`, '',
    `Clip classifications: ${Object.entries(report.classifications).map(([kind, count]) => `${kind}: ${count}`).join('; ')}. Library assignments: ${Object.entries(report.assignmentClassifications).map(([kind, count]) => `${kind}: ${count}`).join('; ')}. Missing clip assignments: ${report.missingClipCount}. Shared-player assignments do not inflate unique source artwork or frame counts.`, '',
    `Minimum authored frames: ${report.requiredFramesMinimum}; production target: ${report.targetFramesTotal}. Inspected clips below target: ${report.targetShortfalls.length} (not a failure when the minimum is satisfied).`, '',
    '| Finding | Count |', '| --- | ---: |', ...[...counts].map(([code, count]) => `| ${code} | ${count} |`), '',
    'Pixel hashes detect identical decoded crops. They do not certify anatomical correctness, continuity, pose quality, or fidelity to asymmetric character details; recorded human review remains required.', '',
  ].join('\n'));
}
console.log(JSON.stringify({ ok: report.ok, athletes: report.athletes, inspectedClips: report.inspectedClips, uniqueSourceLibraries: report.uniqueSourceLibraries, uniqueSourceAtlases: report.uniqueSourceAtlases, uniqueSourceDrawings: report.uniqueSourceDrawings, classifications: report.classifications, assignmentClassifications: report.assignmentClassifications, missingClipCount: report.missingClipCount, requiredFramesMinimum: report.requiredFramesMinimum, targetFramesTotal: report.targetFramesTotal, targetShortfalls: report.targetShortfalls.length, errors: report.errors.length, findings: Object.fromEntries([...new Set(report.errors.map(error => error.code))].map(code => [code, report.errors.filter(error => error.code === code).length])) }, null, 2));
if (!report.ok && !args.includes('--report-only')) process.exitCode = 1;
