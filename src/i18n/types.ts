export type Lang = 'fa' | 'en';

export type StageId = 'about' | 'expertise' | 'results' | 'contact';

export type IconName = 'target' | 'chart' | 'team' | 'funnel' | 'link' | 'play' | 'cap' | 'gear' | 'book' | 'globe';

export interface Role {
  /** Stable anchor id, shared by both languages. */
  id: string;
  /** Short label for the hero staircase. */
  short: string;
  title: string;
  company: string;
  period: string;
  /** Start year, shown on the staircase and the role tabs. */
  since: string;
  summary: string;
  /** At most three lines. */
  points: string[];
  /** Documented figures, each a short phrase that says what it measures. */
  results?: string[];
}

export interface Dictionary {
  meta: { title: string; description: string; ogLocale: string };
  a11y: {
    skipToContent: string;
    primaryNav: string;
    openMenu: string;
    closeMenu: string;
    languageGroup: string;
    switchToFa: string;
    switchToEn: string;
    opensInNewTab: string;
    backToTop: string;
    home: string;
  };
  nav: { results: string; about: string; career: string; expertise: string; contact: string };
  hero: {
    role: string;
    greeting: string;
    name: string;
    statement: string;
    /** Explains the funnel; **bold** marks the two ends of the journey. */
    intro: string;
    primaryCta: string;
    secondaryCta: string;
    pathTitle: string;
  };
  funnel: {
    /** Accessible name of the hero funnel. */
    label: string;
    /** The page's four stages, top of the funnel first. */
    stages: { id: StageId; step: string; name: string; question: string; peek: string }[];
  };
  results: {
    label: string;
    title: string;
    items: { value: string; label: string; source: string }[];
  };
  about: {
    label: string;
    title: string;
    sides: { tag: string; company: string; body: string }[];
    note: string;
  };
  career: {
    label: string;
    title: string;
    resultsLabel: string;
    roles: Role[];
  };
  expertise: {
    label: string;
    title: string;
    sourceLabel: string;
    items: { icon: IconName; title: string; body: string; source: string }[];
    toolsLabel: string;
    tools: string[];
  };
  education: {
    label: string;
    items: { icon: IconName; title: string; detail: string }[];
  };
  contact: {
    label: string;
    title: string;
    emailLabel: string;
    linkedinLabel: string;
    copy: string;
    copied: string;
  };
  footer: { name: string; top: string };
}
