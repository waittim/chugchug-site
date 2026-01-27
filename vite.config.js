import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function getGithubPagesBase() {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
  if (!repo) return '/';
  return `/${repo}/`;
}

export default defineConfig(() => ({
  base: process.env.GITHUB_ACTIONS ? getGithubPagesBase() : '/',
  plugins: [react()],
}));

