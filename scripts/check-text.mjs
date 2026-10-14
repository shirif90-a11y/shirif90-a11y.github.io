// Content linter: Persian orthography in fa.ts, no Persian script in en.ts.
// Usage: node scripts/check-text.mjs
import { readFileSync } from 'node:fs';

const fa = readFileSync(new URL('../src/i18n/fa.ts', import.meta.url), 'utf8');
const en = readFileSync(new URL('../src/i18n/en.ts', import.meta.url), 'utf8');
const problems = [];

const strings = (src) => [...src.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]);

// 1. English copy must contain no Arabic-script characters (ignoring code comments).
const enCode = en.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
for (const s of strings(enCode)) {
  if (/[؀-ۿﭐ-﷿ﹰ-﻿]/.test(s)) problems.push(`en: Persian script in "${s}"`);
}

// 2. Persian copy: Arabic yeh/kaf, missing ZWNJ in common prefixes/suffixes, Latin digits.
const faRules = [
  [/[يك]/, 'Arabic ي or ك instead of Persian ی or ک'],
  [/(^|\s)(ن?می) (?=[؀-ۿ])/, 'space after «می»; use نیم‌فاصله'],
  [/[؀-ۿ] (ها|های|هایی|تر|ترین|ام|ای|اند|ایم)(?=[\s،؛.]|$)/, 'space before a suffix; use نیم‌فاصله'],
  [/ه ی(?=\s)/, 'detached ezafe «ه ی»; use «ه‌ی»'],
  [/[0-9]/, 'Latin digits in Persian copy'],
  [/  /, 'double space'],
  [/ [،؛.:]/, 'space before punctuation'],
  [/,/, 'Latin comma in Persian copy'],
];
const latinOk = /^[\x20-\x7E]*$/; // pure-Latin strings (tool names) are allowed digits/commas
const faCode = fa.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
for (const s of strings(faCode)) {
  if (latinOk.test(s)) continue;
  for (const [re, msg] of faRules) if (re.test(s)) problems.push(`fa: ${msg}: "${s}"`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('check:text passed');
