import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { run } = require('react-snap');
const projectRoot = process.cwd();
const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));

const browserCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined,
  process.platform === 'darwin'
    ? '/Applications/Chromium.app/Contents/MacOS/Chromium'
    : undefined,
  process.platform === 'linux' ? '/usr/bin/google-chrome' : undefined,
  process.platform === 'linux' ? '/usr/bin/google-chrome-stable' : undefined,
  process.platform === 'linux' ? '/usr/bin/chromium' : undefined,
  process.platform === 'linux' ? '/usr/bin/chromium-browser' : undefined,
  process.platform === 'win32' && process.env.PROGRAMFILES
    ? join(process.env.PROGRAMFILES, 'Google', 'Chrome', 'Application', 'chrome.exe')
    : undefined,
  process.platform === 'win32' && process.env['PROGRAMFILES(X86)']
    ? join(process.env['PROGRAMFILES(X86)'], 'Google', 'Chrome', 'Application', 'chrome.exe')
    : undefined,
].filter(Boolean);

const puppeteerExecutablePath = browserCandidates.find(existsSync);

if (!puppeteerExecutablePath) {
  console.warn(
    '[prerender] Warning: Chrome or Chromium not found. Skipping static prerendering. Set PUPPETEER_EXECUTABLE_PATH or install Chrome to enable prerendering.',
  );
  process.exit(0);
}

try {
  await run({
    publicPath: '/',
    ...packageJson.reactSnap,
    puppeteerExecutablePath,
  });
} catch (err) {
  console.warn('[prerender] Prerendering skipped due to error:', err?.message || err);
  process.exit(0);
}
