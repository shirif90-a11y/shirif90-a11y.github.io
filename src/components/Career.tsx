import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useI18n } from '../i18n';

/**
 * The career path as tabs, oldest role first so the path reads forward; the newest role is open by default.
 * #role-… links open the matching tab.
 */
export function Career() {
  const { t, dir } = useI18n();
  const { career } = t;
  const roles = [...career.roles].reverse();
  const last = roles.length - 1;
  const [active, setActive] = useState(last);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const role = roles[active];

  useEffect(() => {
    const sync = () => {
      const i = roles.findIndex((r) => `#${r.id}` === window.location.hash);
      if (i >= 0) setActive(i);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [career.roles]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const back = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    let next = active;
    if (e.key === 'ArrowDown' || e.key === forward) next = active === last ? 0 : active + 1;
    else if (e.key === 'ArrowUp' || e.key === back) next = active === 0 ? last : active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="career" data-anchor className="career" aria-labelledby="career-title">
      <h3 id="career-title" className="h3" data-reveal>
        {career.title}
      </h3>

      <div role="tablist" aria-labelledby="career-title" className="career__tabs" onKeyDown={onKey} data-reveal>
        {roles.map((r, i) => (
          <button
            key={r.id}
            id={r.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-controls="career-panel"
            tabIndex={active === i ? 0 : -1}
            className="career__tab"
            style={{ '--step': i } as CSSProperties}
            onClick={() => setActive(i)}
          >
            <span className="career__tab-year nums">{r.since}</span>
            <span className="career__tab-title">{r.short}</span>
            <span className="career__tab-company">{r.company}</span>
          </button>
        ))}
      </div>

      <div id="career-panel" role="tabpanel" aria-labelledby={role.id} className="career__panel" tabIndex={0}>
        <div key={role.id} className="career__panel-inner">
          <div>
            <p className="career__meta">
              <span>{role.company}</span>
              <span className="nums">{role.period}</span>
            </p>
            <h4 className="career__title">{role.title}</h4>
            <p className="career__summary nums">{role.summary}</p>
          </div>
          <div>
            <ul className="career__points">
              {role.points.map((p) => (
                <li key={p} className="nums">
                  {p}
                </li>
              ))}
            </ul>
            {role.results && (
              <ul className="career__results" aria-label={career.resultsLabel}>
                {role.results.map((r) => (
                  <li key={r} className="nums">
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
