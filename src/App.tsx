import { About } from './components/About';
import { Career } from './components/Career';
import { Contact, Footer } from './components/Contact';
import { Education } from './components/Education';
import { Expertise } from './components/Expertise';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Results } from './components/Results';
import { ScrollProgress } from './components/ScrollProgress';
import { Neck, Stage } from './components/Stage';
import { useMagnetic } from './hooks/useMagnetic';
import { useReveal } from './hooks/useReveal';
import { useI18n } from './i18n';

/** The page is a funnel: four stages, each narrower than the last, from introduction to contact. */
export function App() {
  const { t, lang } = useI18n();
  useReveal([lang]);
  useMagnetic([lang]);

  return (
    <>
      <a href="#main" className="skip-link">
        {t.a11y.skipToContent}
      </a>
      <ScrollProgress />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <div className="flow">
          <Stage id="about" title={t.about.title}>
            <About />
            <Career />
          </Stage>
          <Neck from="about" to="expertise" />
          <Stage id="expertise" title={t.expertise.title}>
            <Expertise />
            <Education />
          </Stage>
          <Neck from="expertise" to="results" />
          <Stage id="results" title={t.results.title}>
            <Results />
          </Stage>
          <Neck from="results" to="contact" />
          <Stage id="contact" title={t.contact.title} tone="act">
            <Contact />
          </Stage>
        </div>
      </main>
      <Footer />
    </>
  );
}
