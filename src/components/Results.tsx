import { useEffect, useRef, type PointerEvent } from 'react';
import { useI18n } from '../i18n';
import { order } from '../lib';

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const toLatin = (s: string) => s.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)));
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Counts the leading number of `el` up from zero once, keeping prefix/suffix and the script's digits. */
function countUp(el: HTMLElement, final: string, persian: boolean) {
  const match = toLatin(final).match(/^(\D*)([\d,]+)(.*)$/);
  if (!match) return;
  const [, pre, num, post] = match;
  const target = Number(num.replace(/,/g, ''));
  const grouped = num.includes(',');
  const format = (v: number) => {
    let s = grouped ? v.toLocaleString('en-US') : String(v);
    if (persian) s = s.replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
    return s;
  };
  const prefix = persian ? pre.replace(/\d/g, (d) => FA_DIGITS[Number(d)]) : pre;
  const suffix = persian ? post.replace(/\d/g, (d) => FA_DIGITS[Number(d)]) : post;
  const start = performance.now();
  const duration = 1400;
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = prefix + format(Math.round(target * eased)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = final;
  };
  requestAnimationFrame(tick);
}

export function Results() {
  const { t, lang } = useI18n();
  const { results } = t;
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || reduceMotion() || !('IntersectionObserver' in window)) return;
    const figures = Array.from(list.querySelectorAll<HTMLElement>('[data-figure]'));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          countUp(el, el.dataset.figure!, lang === 'fa');
          observer.unobserve(el);
        }
      },
      { threshold: 0.6 },
    );
    figures.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [lang]);

  // A gentle tilt toward the pointer, only for mouse users who accept motion.
  const tilt = (e: PointerEvent<HTMLLIElement>) => {
    if (e.pointerType !== 'mouse' || reduceMotion()) return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`);
    card.style.setProperty('--rx', `${(0.5 - (e.clientY - r.top) / r.height) * 10}deg`);
  };
  const untilt = (e: PointerEvent<HTMLLIElement>) => {
    e.currentTarget.style.setProperty('--ry', '0deg');
    e.currentTarget.style.setProperty('--rx', '0deg');
  };

  return (
    <ol ref={listRef} className="posters" aria-label={results.label}>
      {results.items.map((item, i) => (
        <li key={item.value} className={`poster poster--${i + 1}`} data-reveal style={order(i)} onPointerMove={tilt} onPointerLeave={untilt}>
          <p className="poster__source">{item.source}</p>
          <p className="poster__value nums" data-figure={item.value}>
            {item.value}
          </p>
          <p className="poster__label">{item.label}</p>
        </li>
      ))}
    </ol>
  );
}
