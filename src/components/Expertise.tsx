import { useI18n } from '../i18n';
import { order } from '../lib';
import { Icon } from './Icon';

/** Six skills, each with where it was used in practice, then the everyday tools. */
export function Expertise() {
  const { t } = useI18n();
  const { expertise } = t;

  return (
    <>
      <ul className="tiles">
        {expertise.items.map((item, i) => (
          <li key={item.title} className="tile" data-reveal style={order(i % 3)}>
            <span className="tile__icon">
              <Icon name={item.icon} />
            </span>
            <h3 className="tile__title">{item.title}</h3>
            <p className="tile__body">{item.body}</p>
            <p className="tile__source">
              <span className="tile__source-label">{expertise.sourceLabel}</span>
              {item.source}
            </p>
          </li>
        ))}
      </ul>
      <div className="tools-block" data-reveal>
        <h3 className="tools-block__label">{expertise.toolsLabel}</h3>
        <div className="marquee">
          <ul className="tools">
            {expertise.tools.map((tool) => (
              <li key={tool} lang="en" className="latin">
                {tool}
              </li>
            ))}
          </ul>
          {/* A second copy makes the loop seamless; it is hidden from assistive tech. */}
          <ul className="tools tools--echo" aria-hidden="true">
            {expertise.tools.map((tool) => (
              <li key={tool} lang="en" className="latin">
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
