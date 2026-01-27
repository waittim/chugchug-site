# chugchug-site

Static site for GitHub Pages (Vite + React + Tailwind).

## Local dev

Node.js version: `>=18` (recommended: `20`, see `.nvmrc`).

```bash
npm install
npm run dev
```

## Assets

Put screenshots in `public/`:

- `public/menu-zh.jpeg` (Chinese)
- `public/menu-en.jpeg` (English)

## Deploy (GitHub Pages)

This repo includes a GitHub Actions workflow that builds and deploys to GitHub Pages.

1. Push to `main`
2. GitHub repo → **Settings** → **Pages** → **Build and deployment** → select **GitHub Actions**
