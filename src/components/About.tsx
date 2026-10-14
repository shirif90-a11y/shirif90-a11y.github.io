import { useI18n } from '../i18n';
import { order } from '../lib';

/** Brand side and platform side; the half under the pointer or focus widens. */
export function About() {
  const { t } = useI18n();
  const { about } = t;

  return (
    <>
      <div className="sides">
        {about.sides.map((side, i) => (
          <article key={side.company} className={`side side--${i + 1}`} tabIndex={0} data-reveal style={order(i)}>
            <p className="side__tag">{side.tag}</p>
            <h3 className="side__company">{side.company}</h3>
            <p className="side__body">{side.body}</p>
          </article>
        ))}
      </div>
      <p className="about__note" data-reveal>
        {about.note}
      </p>
    </>
  );
}
