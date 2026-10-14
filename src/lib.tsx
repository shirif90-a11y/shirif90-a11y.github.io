import { Fragment, type CSSProperties, type ReactNode } from 'react';
import type { Lang } from './i18n';

/** Renders **bold** spans in copy strings as <strong>; nothing else is interpreted. */
export function rich(text: string): ReactNode {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>,
  );
}

const persianDigits = '۰۱۲۳۴۵۶۷۸۹';

/** Two-digit section or item number in the reader's digits: ۰۲ or 02. */
export function folio(n: number, lang: Lang) {
  const s = String(n).padStart(2, '0');
  return lang === 'fa' ? s.replace(/\d/g, (d) => persianDigits[Number(d)]) : s;
}

/** Current year in the reader's calendar. */
export function currentYear(lang: Lang) {
  const now = new Date();
  return lang === 'fa'
    ? new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(now)
    : String(now.getFullYear());
}

/** An arrow that points forward in the reading direction (mirrored in RTL by CSS). */
export function ArrowForward({ className = '' }: { className?: string }) {
  return (
    <svg className={`arrow arrow-forward ${className}`} width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <path d="M0 6h16M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function ArrowUp({ className = '' }: { className?: string }) {
  return (
    <svg className={`arrow ${className}`} width="12" height="16" viewBox="0 0 12 16" fill="none" aria-hidden="true">
      <path d="M6 16V2M1 7l5-5 5 5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** Stagger index for entrance and reveal animations. */
export function order(n: number) {
  return { '--rise-order': n, '--reveal-order': n } as CSSProperties;
}

/**
 * Splits copy into words so CSS can stagger them in. Words stay whole (Persian letters keep
 * joining) and the spaces stay real, so wrapping, selection and screen readers are unchanged.
 */
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="w" style={{ '--w': start + i } as CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  );
}
