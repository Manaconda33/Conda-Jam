import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { exportCaptainPackage } from './captain-studio/export-package.mjs';

export { exportCaptainPackage };

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const configIndex = process.argv.indexOf('--config');
  if (configIndex < 0 || !process.argv[configIndex + 1]) {
    process.stderr.write('Usage: node tools/export-captain-package.mjs --config <coordinator-config.json>\n');
    process.exitCode = 2;
  } else {
    const configPath = resolve(process.argv[configIndex + 1]);
    const config = JSON.parse(await readFile(configPath, 'utf8'));
    const summary = await exportCaptainPackage(config);
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  }
}
