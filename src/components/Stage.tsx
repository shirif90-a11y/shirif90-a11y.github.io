import type { CSSProperties, ReactNode } from 'react';
import { useI18n } from '../i18n';
import type { StageId } from '../i18n/types';
import { Words } from '../lib';

/* Each stage is narrower than the one before it, so the page itself tapers like a funnel. */
const widths: Record<StageId, string> = {
  about: '84rem',
  expertise: '76rem',
  results: '68rem',
  contact: '58rem',
};

/** One stage of the page funnel: a numbered label, the section title and its content. */
export function Stage({ id, title, tone, children }: { id: StageId; title: string; tone?: 'act'; children: ReactNode }) {
  const { t } = useI18n();
  const stage = t.funnel.stages.find((s) => s.id === id)!;

  return (
    <section
      id={id}
      data-anchor
      className={`stage${tone ? ` stage--${tone}` : ''}`}
      style={{ '--stage-w': widths[id] } as CSSProperties}
      aria-labelledby={`${id}-title`}
      data-reveal
    >
      <div className="stage__head">
        <p className="stage__tag">
          <span className="stage__step nums">{stage.step}</span>
          <span>
            {stage.name}
            <span className="stage__question">{stage.question}</span>
          </span>
        </p>
        <h2 id={`${id}-title`} className="h2" data-reveal="words">
          <Words text={title} />
        </h2>
      </div>
      {children}
    </section>
  );
}

/** The narrowing neck between two stages, with leads falling through it. Purely decorative. */
export function Neck({ from, to }: { from: StageId; to: StageId }) {
  return (
    <div className="neck" style={{ '--from': widths[from], '--to': widths[to] } as CSSProperties} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}
