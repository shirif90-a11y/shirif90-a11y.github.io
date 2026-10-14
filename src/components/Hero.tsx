import { useEffect, useState, type CSSProperties } from 'react';
import { useI18n } from '../i18n';
import { ArrowForward, order, rich, Words } from '../lib';

export function Hero() {
  const { t } = useI18n();
  const { hero } = t;

  return (
    <section id="top" className="hero" aria-labelledby="hero-name">
      <div className="shell hero__grid">
        <div className="hero__copy">
          <p className="tag hero-rise">
            <span className="tag__dot" aria-hidden="true" />
            {hero.role}
          </p>
          <p className="hero__greeting hero-rise" style={order(1)}>
            {hero.greeting}
          </p>
          <h1 id="hero-name" className="hero__name words-in">
            <Words text={hero.name} />
          </h1>
          <p className="hero__statement words-in" style={{ '--words-delay': '0.55s' } as CSSProperties}>
            <Words text={hero.statement} />
          </p>
          <p className="hero__intro hero-rise" style={order(7)}>
            {rich(hero.intro)}
          </p>
          <div className="hero__actions hero-rise" style={order(8)}>
            <a href="#contact" className="btn btn-signal group" data-magnetic>
              {hero.primaryCta}
              <ArrowForward />
            </a>
            <a href="#about" className="btn btn-line" data-magnetic>
              {hero.secondaryCta}
            </a>
          </div>
        </div>

        <Funnel />
      </div>
    </section>
  );
}

/* Funnel geometry in SVG units: four layers, each narrower than the one above. */
const W = 420;
const LAYER_H = 95;
const GAP = 13;
const SLOPE = 36;
const H = 4 * LAYER_H + 3 * GAP + 40;
const layers = [0, 1, 2, 3].map((i) => {
  const top = i * (LAYER_H + GAP);
  const inset = i * (SLOPE + 6);
  return {
    top,
    path: `M${inset} ${top}H${W - inset}L${W - inset - SLOPE} ${top + LAYER_H}H${inset + SLOPE}Z`,
  };
});

/* Leads that fall through the funnel: [x, seconds per fall, start offset, radius]. Fixed values keep SSR and client equal. */
const leads = [
  [38, 3.6, 0.0, 4],
  [96, 4.4, 1.2, 3],
  [150, 3.9, 2.6, 5],
  [212, 4.8, 0.6, 3.5],
  [268, 3.4, 3.1, 4.5],
  [322, 4.2, 1.8, 3],
  [380, 3.8, 0.3, 4],
  [128, 5.0, 3.8, 3],
  [300, 4.6, 2.2, 5],
  [60, 4.1, 4.4, 3.5],
  [240, 3.7, 4.9, 3],
  [356, 5.2, 1.0, 4],
] as const;

/**
 * The page as a marketing funnel. Each layer links to its stage; hovering or focusing a layer
 * shows a short preview. Until the visitor points at it, the preview cycles on its own
 * (never under reduced motion).
 */
function Funnel() {
  const { t } = useI18n();
  const { stages } = t.funnel;
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    setMotion(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!auto || !motion) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % stages.length), 2800);
    return () => window.clearInterval(id);
  }, [auto, motion, stages.length]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };
  const stage = stages[active];

  return (
    <figure className="funnel hero-rise" style={order(2)} aria-label={t.funnel.label}>
      <svg className="funnel__svg" viewBox={`0 0 ${W} ${H}`}>
        {layers.map((layer, i) => (
          <a
            key={stages[i].id}
            href={`#${stages[i].id}`}
            className="funnel__layer"
            data-active={active === i}
            aria-label={`${stages[i].step}. ${stages[i].name}: ${stages[i].question}`}
            onMouseEnter={() => pick(i)}
            onFocus={() => pick(i)}
          >
            <path d={layer.path} />
            <text x={W / 2} y={layer.top + 46} textAnchor="middle" className="funnel__name">
              {stages[i].name}
            </text>
            <text x={W / 2} y={layer.top + 74} textAnchor="middle" className="funnel__question">
              {stages[i].question}
            </text>
          </a>
        ))}
        {motion && (
          <g className="funnel__leads" aria-hidden="true">
            {leads.map(([x, dur, delay, r], i) => (
              <circle key={i} r={r}>
                <animateMotion
                  path={`M${x} -30 C ${x} 170, ${W / 2} 260, ${W / 2} ${H}`}
                  dur={`${dur}s`}
                  begin={`-${delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )}
      </svg>
      <figcaption className="funnel__peek" aria-hidden="true">
        <span key={stage.id} className="funnel__peek-inner">
          <span className="funnel__peek-head">
            <span className="funnel__peek-step nums">{stage.step}</span>
            {stage.name}: {stage.question}
          </span>
          <span className="funnel__peek-body nums">{stage.peek}</span>
        </span>
      </figcaption>
    </figure>
  );
}
