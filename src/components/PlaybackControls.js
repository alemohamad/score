import { useTranslation } from "react-i18next";

export default function PlaybackControls({
  tempo, setTempo,
  onAfterChange,
}) {
  const { t } = useTranslation();

  return (
    <div className="playback-controls">
      <div className="playback-controls__tempo">
        <span className="playback-controls__tempo-label">{t("playback.tempo")}:</span>
        <input
          type="range"
          min="40" max="240" value={tempo}
          onChange={(e) => setTempo(Number(e.target.value))}
          className="playback-controls__tempo-slider"
        />
        <span className="playback-controls__tempo-value">{tempo} BPM</span>
      </div>
    </div>
  );
}
