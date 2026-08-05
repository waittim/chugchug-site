import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './AppGlass.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './nunito-font.css';
import './index.css';

const container = document.getElementById('root');

if (container?.hasChildNodes()) {
  hydrateRoot(
    container,
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
} else {
  createRoot(container).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
