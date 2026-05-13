# chugchug-site

Static website for the ChugChug app, built with Vite, React, Tailwind CSS, and deployed to GitHub Pages.

## Requirements

Node.js version: `>=18` (recommended: `20`, see `.nvmrc`).

```bash
npm install
```

## Local Dev

```bash
npm run dev
```

The site is served by Vite. The default local URL is usually `http://localhost:5173/`.

## Build

```bash
npm run build
```

The full build runs:

1. `vite build`
2. `react-snap` prerendering for the configured language URLs

For a quick compile-only check without prerendering:

```bash
npx vite build
```

## Pages

- Home: `index.html`
- Privacy Policy: `privacy.html`

Both pages support:

- `?lang=en`
- `?lang=zh`
- `?lang=zh-Hant`

## Project Structure

- `src/App.jsx`: home page layout and interactions
- `src/privacy.jsx`: privacy policy page layout
- `src/i18n.js`: shared language detection and HTML language helpers
- `src/content/home.js`: home page copy
- `src/content/games.jsx`: game card content and icons
- `src/content/privacy.js`: privacy policy copy
- `src/index.css`: global Tailwind and shared styles
- `src/nunito-font.css`: local font-face declarations

## Assets

Static assets live in `public/`.

App screenshots used by the homepage carousel:

- English: `public/screenshot/en/*.jpeg`
- Simplified Chinese: `public/screenshot/zh/*.jpeg`

Menu screenshots:

- English menu: `public/screenshot/en/menu.jpeg`
- Chinese menu: `public/screenshot/zh/menu-zh.jpeg`

Other important assets:

- `public/og-image.jpg`: social preview image
- `public/favicon.ico`, `public/favicon.svg`: favicons
- `public/apple-touch-icon.png`: Apple touch icon
- `public/fonts/`: bundled Nunito font files
- `public/robots.txt`, `public/sitemap.xml`: search engine metadata

## Deploy

This repo includes a GitHub Actions workflow that builds and deploys to GitHub Pages.

1. Push to `main`
2. In GitHub repo settings, go to **Pages**
3. Set **Build and deployment** to **GitHub Actions**

The workflow installs dependencies with `npm ci`, runs `npm run build`, and uploads `dist`.

## Base Path

The current site uses the custom domain in `CNAME`, so it is served from `/`.

If the site is deployed to a default GitHub Pages project URL such as `https://<user>.github.io/<repo>/`, Vite should use `/<repo>/` as the base path. The current Vite config handles this in GitHub Actions when no `CNAME` file is present.

You can override the Vite base path at build time:

```bash
VITE_BASE=/custom-base/ npm run build
```
