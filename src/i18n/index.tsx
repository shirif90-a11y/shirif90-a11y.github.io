import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { en } from './en';
import { fa } from './fa';
import type { Dictionary, Lang } from './types';

export type { Dictionary, Lang } from './types';

const dictionaries: Record<Lang, Dictionary> = { fa, en };
export const STORAGE_KEY = 'fs-portfolio-lang';

/** Header height plus breathing room; anchors closer to the top than this count as "current". */
const ANCHOR_LINE = 120;

interface LanguageContextValue {
  lang: Lang;
  t: Dictionary;
  dir: 'rtl' | 'ltr';
  setLang: (next: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/** Language chosen before React starts: ?lang= in the URL, then the saved preference, then Persian. */
export function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'fa';
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl === 'en' || fromUrl === 'fa') return fromUrl;
  try {
    if (window.localStorage.getItem(STORAGE_KEY) === 'en') return 'en';
  } catch {
    /* storage blocked: fall through to the default */
  }
  return 'fa';
}

/** The section or role nearest to the top of the viewport, and how far it sits from the top. */
function captureAnchor() {
  const anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-anchor]'));
  let best: { id: string; top: number } | null = null;
  for (const el of anchors) {
    const top = el.getBoundingClientRect().top;
    if (top <= ANCHOR_LINE && (!best || top > best.top)) best = { id: el.id, top };
  }
  return best;
}

function setMeta(selector: string, value: string) {
  document.querySelector(selector)?.setAttribute('content', value);
}

export function LanguageProvider({ initial, children }: { initial: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial);
  const pendingAnchor = useRef<{ id: string; top: number } | null>(null);
  const t = dictionaries[lang];

  const langRef = useRef(lang);
  langRef.current = lang;

  const setLang = useCallback((next: Lang) => {
    if (next === langRef.current) return;
    pendingAnchor.current = captureAnchor();
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* preference simply isn't remembered */
    }
    const url = new URL(window.location.href);
    if (next === 'fa') url.searchParams.delete('lang');
    else url.searchParams.set('lang', next);
    window.history.replaceState(window.history.state, '', url);
  }, []);

  // Document language, direction and metadata follow the selected language.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.title = t.meta.title;
    setMeta('meta[name="description"]', t.meta.description);
    setMeta('meta[property="og:title"]', t.meta.title);
    setMeta('meta[property="og:description"]', t.meta.description);
    setMeta('meta[property="og:locale"]', t.meta.ogLocale);
    setMeta('meta[property="og:locale:alternate"]', lang === 'fa' ? en.meta.ogLocale : fa.meta.ogLocale);
    setMeta('meta[name="twitter:title"]', t.meta.title);
    setMeta('meta[name="twitter:description"]', t.meta.description);

    // Keep the reader on the same section after the layout flips direction.
    const anchor = pendingAnchor.current;
    pendingAnchor.current = null;
    if (anchor) {
      const restore = () => {
        const el = document.getElementById(anchor.id);
        if (!el) return;
        const delta = el.getBoundingClientRect().top - anchor.top;
        if (Math.abs(delta) > 1) window.scrollTo({ top: window.scrollY + delta, behavior: 'instant' });
      };
      restore();
      // Late layout changes (font swap, reveal styles) can still move the anchor; settle it once more.
      requestAnimationFrame(() => requestAnimationFrame(restore));
    }
  }, [lang, t]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, t, dir: lang === 'fa' ? 'rtl' : 'ltr', setLang }),
    [lang, t, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useI18n must be used inside <LanguageProvider>');
  return ctx;
}
