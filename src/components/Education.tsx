import { useI18n } from '../i18n';
import { order } from '../lib';
import { Icon } from './Icon';

export function Education() {
  const { t } = useI18n();
  const { education } = t;

  return (
    <section className="education" aria-labelledby="education-title">
      <h3 id="education-title" className="h3" data-reveal>
        {education.label}
      </h3>
      <ul className="edu">
        {education.items.map((item, i) => (
          <li key={item.title} className="edu__item" data-reveal style={order(i)}>
            <span className="edu__icon">
              <Icon name={item.icon} />
            </span>
            <span>
              <span className="edu__title">{item.title}</span>
              <span className="edu__detail nums">{item.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
