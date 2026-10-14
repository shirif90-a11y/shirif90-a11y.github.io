import type { IconName } from '../i18n/types';

/** Line icons drawn for this site (24px grid, 1.6 stroke). Decorative: always aria-hidden. */
const paths: Record<IconName, string> = {
  target: 'M12 21a9 9 0 1 1 9-9M12 17a5 5 0 1 1 5-5M12 12l8-8M16 4h4v4',
  chart: 'M3 20h18M6 16v-4M11 16V9M16 16V6M5 9l5-4 4 3 6-5',
  team: 'M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2.5 19c.6-3 3-5 6-5s5.4 2 6 5M16 11a2.5 2.5 0 1 0 0-5M17.5 14c2 .5 3.5 2.3 4 5',
  funnel: 'M3 4h18l-7 8v6l-4 2v-8L3 4ZM8 8h8',
  link: 'M9 7H7a5 5 0 0 0 0 10h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8',
  play: 'M3 5h18v12H3zM8 21h8M12 17v4M10 8.5v5l4-2.5-4-2.5Z',
  cap: 'M2 9l10-5 10 5-10 5L2 9ZM6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1',
  book: 'M3 5c3-1.3 6-1.3 9 .5 3-1.8 6-1.8 9-.5v14c-3-1.3-6-1.3-9 .5-3-1.8-6-1.8-9-.5V5ZM12 5.5v14',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z',
};

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
