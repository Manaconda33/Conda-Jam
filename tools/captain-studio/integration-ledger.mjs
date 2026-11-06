import { constants } from 'node:fs';
import { lstat, open, unlink } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { canonicalJson } from './canonical-json.mjs';
import { renderIntegrationLedger } from './integration-report.mjs';
import { validateRelativePath } from './package-hash.mjs';

export { renderIntegrationLedger } from './integration-report.mjs';

/** Append a deterministic sidecar record; this file is never copied into the integration tree. */
export async function appendIntegrationLedger({ ledgerRoot, ledgerPath, record }) {
  if (typeof ledgerRoot !== 'string' || typeof ledgerPath !== 'string') throw Object.assign(new Error('UNSAFE_LEDGER_PATH'), { code: 'UNSAFE_LEDGER_PATH' });
  let relative;
  try { relative = validateRelativePath(ledgerPath); } catch { throw Object.assign(new Error('UNSAFE_LEDGER_PATH'), { code: 'UNSAFE_LEDGER_PATH' }); }
  const root = resolve(ledgerRoot), target = resolve(root, relative);
  if (!target.startsWith(root + sep)) throw Object.assign(new Error('UNSAFE_LEDGER_PATH'), { code: 'UNSAFE_LEDGER_PATH' });
  for (let current = dirname(target);; current = dirname(current)) {
    const stat = await lstat(current);
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw Object.assign(new Error('UNSAFE_LEDGER_PATH'), { code: 'UNSAFE_LEDGER_PATH' });
    if (current === root) break;
    if (!current.startsWith(root + sep)) throw Object.assign(new Error('UNSAFE_LEDGER_PATH'), { code: 'UNSAFE_LEDGER_PATH' });
  }
  const addition = renderIntegrationLedger(record), lockPath = `${target}.lock`;
  let lock, ledger;
  try {
    try { lock = await open(lockPath, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY | constants.O_NOFOLLOW, 0o600); }
    catch (error) { if (error.code === 'EEXIST') throw Object.assign(new Error('LEDGER_BUSY'), { code: 'LEDGER_BUSY' }); throw error; }
    ledger = await open(target, constants.O_CREAT | constants.O_APPEND | constants.O_RDWR | constants.O_NOFOLLOW, 0o600);
    if (!(await ledger.stat()).isFile()) throw Object.assign(new Error('UNSAFE_LEDGER_PATH'), { code: 'UNSAFE_LEDGER_PATH' });
    const prior = await ledger.readFile('utf8');
    if (prior && !prior.endsWith('\n')) throw Object.assign(new Error('LEDGER_CORRUPT'), { code: 'LEDGER_CORRUPT' });
    const priorRows = prior ? prior.trimEnd().split('\n') : [];
    for (const row of priorRows) if (!row || canonicalJson(JSON.parse(row)) !== row) throw Object.assign(new Error('LEDGER_CORRUPT'), { code: 'LEDGER_CORRUPT' });
    const newRows = addition.trimEnd() ? addition.trimEnd().split('\n') : [];
    const known = new Set(priorRows);
    if (newRows.some(row => known.has(row))) throw Object.assign(new Error('DUPLICATE_INTEGRATION_RECORD'), { code: 'DUPLICATE_INTEGRATION_RECORD' });
    if (addition) { await ledger.writeFile(addition, 'utf8'); await ledger.sync(); }
  } finally {
    await ledger?.close(); await lock?.close();
    if (lock) await unlink(lockPath).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
  return { bytes: Buffer.byteLength(addition) };
}
