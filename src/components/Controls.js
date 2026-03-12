import { useTranslation } from "react-i18next";

export default function Controls({
  selectedIdx, deleteSelected,
  onAfterChange,
}) {
  const { t } = useTranslation();

  if (selectedIdx === null) return null;

  return (
    <div className="controls-row">
      <button
        onClick={deleteSelected}
        className="control-button control-button--delete">
        {t("controls.deleteSelected")}
      </button>
    </div>
  );
}
