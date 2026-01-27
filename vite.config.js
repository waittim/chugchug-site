import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

function getGithubPagesBase() {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
  if (!repo) return '/';
  return `/${repo}/`;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => ({
  base: process.env.GITHUB_ACTIONS ? getGithubPagesBase() : '/',
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
