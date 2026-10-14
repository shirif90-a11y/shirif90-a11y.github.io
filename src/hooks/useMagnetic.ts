import { useEffect } from 'react';

/**
 * Buttons marked `data-magnetic` lean a few pixels toward a mouse pointer.
 * Touch, pen and reduced-motion users get the plain button.
 */
export function useMagnetic(deps: unknown[] = []) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width - 0.5) * 12}px`);
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height - 0.5) * 10}px`);
    };
    const leave = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    };
    items.forEach((el) => {
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
    });
    return () =>
      items.forEach((el) => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
