import { useI18n, type Lang } from '../i18n';

/**
 * Two-option switch. Labels stay in the active script: «فا / EN» in Persian, "FA / EN" in English,
 * so the English page shows no Persian letters.
 */
export function LanguageSwitch() {
  const { lang, t, setLang } = useI18n();
  const options: { value: Lang; label: string; srLabel: string }[] = [
    { value: 'fa', label: lang === 'fa' ? 'فا' : 'FA', srLabel: t.a11y.switchToFa },
    { value: 'en', label: 'EN', srLabel: t.a11y.switchToEn },
  ];

  return (
    <div role="group" aria-label={t.a11y.languageGroup} className="lang-switch">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={lang === option.value}
          onClick={() => setLang(option.value)}
          className="lang-switch__option"
        >
          <span aria-hidden="true" lang={option.value === 'fa' && lang === 'fa' ? 'fa' : 'en'}>
            {option.label}
          </span>
          <span className="sr-only">{option.srLabel}</span>
        </button>
      ))}
    </div>
  );
}
