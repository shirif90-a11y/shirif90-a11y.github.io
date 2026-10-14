import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { detectInitialLang, LanguageProvider } from './i18n';
import './styles/index.css';

const container = document.getElementById('root')!;
const lang = detectInitialLang();
const tree = (
  <StrictMode>
    <LanguageProvider initial={lang}>
      <App />
    </LanguageProvider>
  </StrictMode>
);

// The production build ships a Persian prerender. Hydrate it when Persian is wanted; otherwise render fresh.
if (container.dataset.prerendered === lang) {
  hydrateRoot(container, tree);
} else {
  container.textContent = '';
  createRoot(container).render(tree);
}
delete container.dataset.prerendered;
