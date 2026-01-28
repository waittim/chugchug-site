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

### Base path (important)

- If you use a custom domain (`CNAME`), the site is served from `/` and assets should load from `/assets/...`.
- If you use the default project URL (`https://<user>.github.io/<repo>/`), the site is served from `/<repo>/`.

You can override Vite base at build time with `VITE_BASE` if needed.

## Pages

- Home: `index.html`
- Privacy Policy: `privacy.html`
