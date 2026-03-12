import { useTranslation } from "react-i18next";

export default function Toggle({ noteSystem, setNoteSystem, onAfterChange }) {
  const { t } = useTranslation();

  return (
    <div className="pill-group">
      {["solfeo", "letter"].map(sys => (
        <button key={sys}
          className={`pill-button ${noteSystem === sys ? "pill-button--active" : ""}`}
          onClick={() => { setNoteSystem(sys); onAfterChange?.(); }}>
          {t(`noteSystem.${sys}`)}
        </button>
      ))}
    </div>
  );
}
