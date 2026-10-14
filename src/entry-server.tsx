import { renderToString } from 'react-dom/server';
import { App } from './App';
import { LanguageProvider } from './i18n';

/** Persian (default) markup injected into dist/index.html by scripts/prerender.mjs. */
export function render() {
  return renderToString(
    <LanguageProvider initial="fa">
      <App />
    </LanguageProvider>,
  );
}
