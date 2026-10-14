import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile';
import { useI18n } from '../i18n';
import { ArrowForward, ArrowUp, currentYear } from '../lib';

export function Contact() {
  const { t } = useI18n();
  const { contact } = t;
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Clipboard API unavailable (e.g. some browsers on file://): fall back to a hidden textarea.
      const area = document.createElement('textarea');
      area.value = profile.email;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2400);
  }

  return (
    <>
      <a href={`mailto:${profile.email}`} className="contact__email group" data-reveal>
        <span className="latin">{profile.email}</span>
        <ArrowForward className="contact__arrow" />
      </a>

      <div className="contact__actions" data-reveal>
        <button type="button" className="btn btn-ink" onClick={copyEmail} data-magnetic>
          {copied ? contact.copied : contact.copy}
        </button>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-line-ink group" data-magnetic>
          {contact.linkedinLabel}
          <ArrowForward />
          <span className="sr-only">{t.a11y.opensInNewTab}</span>
        </a>
        <span className="sr-only" role="status" aria-live="polite">
          {copied ? contact.copied : ''}
        </span>
      </div>
    </>
  );
}

export function Footer() {
  const { t, lang } = useI18n();
  return (
    <footer className="shell site-footer">
      <p>
        © <span className="nums">{currentYear(lang)}</span> {t.footer.name}
      </p>
      <a href="#top" className="site-footer__top" aria-label={t.a11y.backToTop}>
        <span aria-hidden="true">{t.footer.top}</span>
        <ArrowUp />
      </a>
    </footer>
  );
}
