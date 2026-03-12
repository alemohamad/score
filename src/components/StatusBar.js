import { useTranslation } from "react-i18next";
import { DURATION_KEYS } from "../constants/music";

export default function StatusBar({ duration, dotted, triplet, accidental, noteCount }) {
  const { t } = useTranslation();

  return (
    <div className="status-bar">
      <span>🎵 <strong>{t(Object.values(DURATION_KEYS).find(d => d.value === duration)?.labelKey)}</strong></span>
      <span className="status-bar__divider">|</span>
      <span style={{color: dotted ? "#2a9d8f" : "#bbb"}}>● {t("status.dotted")} {dotted ? t("status.on") : t("status.off")}</span>
      <span className="status-bar__divider">|</span>
      <span style={{color: triplet ? "#9b59b6" : "#bbb"}}>³ {t("status.triplet")} {triplet ? t("status.on") : t("status.off")}</span>
      <span className="status-bar__divider">|</span>
      <span style={{color: accidental ? "#e76f51" : "#bbb"}}>
        {accidental === "sharp"   ? `♯ ${t("status.sharp")}`
        : accidental === "flat"   ? `♭ ${t("status.flat")}`
        : accidental === "natural"? `♮ ${t("status.natural")}`
        : t("status.noAccidental")}
      </span>
      <span className="status-bar__divider">|</span>
      <span>{noteCount} {noteCount !== 1 ? t("status.notes") : t("status.note")}</span>
    </div>
  );
}
