// Copies the single-file build to preview/fatemeh-shiri-portfolio.html for offline review.
import { copyFileSync, mkdirSync, statSync } from 'node:fs';
mkdirSync('preview', { recursive: true });
copyFileSync('dist-standalone/index.html', 'preview/fatemeh-shiri-portfolio.html');
const kb = Math.round(statSync('preview/fatemeh-shiri-portfolio.html').size / 1024);
console.log(`preview/fatemeh-shiri-portfolio.html (${kb} KB)`);
