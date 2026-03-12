import { useTranslation } from "react-i18next";

export default function PlaybackControls({
  isPlaying, startPlayback, stopPlayback,
  isMuted, setIsMuted,
  hideLabels, setHideLabels,
  tempo, setTempo,
  hasNotes, onAfterChange,
}) {
  const { t } = useTranslation();

  return (
    <div className="playback-controls">
      <button
        onClick={() => { isPlaying ? stopPlayback() : startPlayback(); onAfterChange?.(); }}
        disabled={!hasNotes}
        className={`playback-controls__play ${isPlaying ? "playback-controls__play--stop" : ""}`}
        style={{ opacity: !hasNotes ? 0.5 : 1, cursor: !hasNotes ? "not-allowed" : "pointer" }}>
        {isPlaying ? `⏹ ${t("playback.stop")}` : `▶ ${t("playback.play")}`}
      </button>

      <button
        onClick={() => { setIsMuted(m => !m); onAfterChange?.(); }}
        className={`playback-controls__toggle ${isMuted ? "playback-controls__toggle--active" : ""}`}>
        {isMuted ? `🔇 ${t("playback.muted")}` : `🔊 ${t("playback.sound")}`}
      </button>

      <button
        onClick={() => { setHideLabels(h => !h); onAfterChange?.(); }}
        className={`playback-controls__toggle ${hideLabels ? "playback-controls__toggle--active" : ""}`}>
        {hideLabels ? `🏷️ ${t("playback.namesOff")}` : `🏷️ ${t("playback.namesOn")}`}
      </button>

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
