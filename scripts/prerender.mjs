// Injects the Persian server render into a built index.html so the page has real content
// before JavaScript runs (search engines, link previews, slow connections).
// Usage: node scripts/prerender.mjs dist   (after `vite build` and the SSR build into .ssr/)
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const outDir = resolve(process.argv[2] ?? 'dist');
const { render } = await import(pathToFileURL(resolve('.ssr/entry-server.js')).href);
const file = resolve(outDir, 'index.html');
const html = readFileSync(file, 'utf8');
const marker = '<div id="root"><!--app--></div>';
if (!html.includes(marker)) throw new Error(`Root marker not found in ${file}`);
writeFileSync(file, html.replace(marker, `<div id="root" data-prerendered="fa">${render()}</div>`));
console.log(`prerendered ${file}`);
