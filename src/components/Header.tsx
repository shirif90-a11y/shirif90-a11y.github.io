import { useEffect, useRef, useState } from 'react';
import { profile, sectionIds } from '../data/profile';
import { useActiveSection } from '../hooks/useActiveSection';
import { useI18n } from '../i18n';
import { order } from '../lib';
import { LanguageSwitch } from './LanguageSwitch';

/** Floating pill header: name, the funnel stages, language, contact. Collapses into a full-screen menu on small screens. */
export function Header() {
  const { t } = useI18n();
  const active = useActiveSection(sectionIds);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const wide = window.matchMedia('(min-width: 64rem)');
    const onWide = () => wide.matches && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    document.documentElement.style.overflow = 'hidden';
    firstLink.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen]);

  const links = sectionIds.map((id) => ({ id, label: t.nav[id], step: t.funnel.stages.find((s) => s.id === id)!.step }));

  return (
    <header className="site-header">
      <div className="shell">
        <div className="site-header__pill">
          <a href="#top" className="wordmark" aria-label={t.a11y.home} onClick={() => setMenuOpen(false)}>
            <span className="wordmark__mark" aria-hidden="true" />
            {t.hero.name}
          </a>

          <nav aria-label={t.a11y.primaryNav} className="site-nav">
            <ul>
              {links.slice(0, -1).map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} aria-current={active === link.id ? 'location' : undefined}>
                    <span className="site-nav__step nums" aria-hidden="true">
                      {link.step}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__actions">
            <LanguageSwitch />
            <a href="#contact" className="btn btn-signal btn-small site-header__cta">
              {t.hero.primaryCta}
            </a>
            <button
              ref={menuButton}
              type="button"
              className="menu-button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="sr-only">{menuOpen ? t.a11y.closeMenu : t.a11y.openMenu}</span>
              <span className="menu-button__lines" data-open={menuOpen} aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="mobile-menu">
          <nav aria-label={t.a11y.primaryNav} className="shell">
            <ol>
              {links.map((link, i) => (
                <li key={link.id} style={order(i)}>
                  <a ref={i === 0 ? firstLink : undefined} href={`#${link.id}`} onClick={() => setMenuOpen(false)}>
                    <span className="mobile-menu__step nums" aria-hidden="true">
                      {link.step}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ol>
            <a href={`mailto:${profile.email}`} className="mobile-menu__mail">
              <span className="latin">{profile.email}</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
