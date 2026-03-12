import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

export default function LanguageSwitcher({ onAfterChange }) {
  const { i18n } = useTranslation();

  return (
    <div className="pill-group">
      {LANGUAGES.map(lang => (
        <button key={lang.code}
          className={`pill-button ${i18n.language === lang.code ? "pill-button--active" : ""}`}
          onClick={() => { i18n.changeLanguage(lang.code); onAfterChange?.(); }}>
          {lang.label}
        </button>
      ))}
    </div>
  );
}
