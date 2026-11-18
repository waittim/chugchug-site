import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './AppGlass.jsx';
import PrivacyPage from './privacy.jsx';
import { GAMES } from './content/games.jsx';

export function render(page, lang) {
  const tree = page === 'privacy'
    ? <PrivacyPage initialLang={lang} />
    : <App initialLang={lang} />;
  return renderToString(tree);
}

export function gameCatalog(lang) {
  return GAMES.map((game) => ({
    name: game.name[lang] || game.name.en,
    tagline: game.tagline?.[lang] || game.tagline?.en || '',
  }));
}
