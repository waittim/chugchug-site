import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';

function getGithubPagesBase() {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
  if (!repo) return '/';
  return `/${repo}/`;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

function getBase() {
  const override = process.env.VITE_BASE?.trim();
  if (override) return override;

  if (!process.env.GITHUB_ACTIONS) return '/';

  // If a custom domain is configured (CNAME exists), the site is served from domain root.
  if (existsSync(resolve(__dirname, 'CNAME'))) return '/';

  // Otherwise GitHub Pages project sites are served from /<repo>/.
  return getGithubPagesBase();
}

export default defineConfig(() => ({
  base: getBase(),
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
      },
    },
  },
}));
