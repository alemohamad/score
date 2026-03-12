import { useTranslation } from "react-i18next";
import { DURATION_KEYS } from "../constants/music";

export default function Controls({
  duration, setDuration,
  dotted, setDotted,
  triplet, setTriplet,
  accidental, setAccidental,
  addRest,
  selectedIdx, deleteSelected,
  notes, setNotes, setSelectedIdx,
  onAfterChange,
}) {
  const { t } = useTranslation();

  return (
    <>
      {/* Duration buttons */}
      <div className="controls-row">
        <div className="controls-row__label">{t("controls.duration")}</div>
        {Object.entries(DURATION_KEYS).map(([k, v]) => (
          <button key={k}
            onClick={() => { setDuration(v.value); onAfterChange?.(); }}
            className={`control-button ${duration === v.value ? "control-button--active" : ""}`}>
            {t(v.labelKey)}
          </button>
        ))}
      </div>

      {/* Modifier buttons */}
      <div className="controls-row">
        <div className="controls-row__label">{t("controls.modifiers")}</div>
        {[
          { key:".", labelKey:"status.dotted",  symbol:"●", active:dotted,                fn:()=>setDotted(d=>!d) },
          { key:"t", labelKey:"status.triplet", symbol:"³", active:triplet,               fn:()=>setTriplet(t=>!t) },
          { key:"#", labelKey:"status.sharp",   symbol:"♯", active:accidental==="sharp",   fn:()=>setAccidental(a=>a==="sharp"   ?null:"sharp")   },
          { key:"b", labelKey:"status.flat",    symbol:"♭", active:accidental==="flat",    fn:()=>setAccidental(a=>a==="flat"    ?null:"flat")    },
          { key:"n", labelKey:"status.natural", symbol:"♮", active:accidental==="natural", fn:()=>setAccidental(a=>a==="natural" ?null:"natural") },
        ].map(m => (
          <button key={m.key}
            onClick={() => { m.fn(); onAfterChange?.(); }}
            className={`control-button ${m.active ? "control-button--modifier-active" : ""}`}
            style={m.active ? { boxShadow: "0 2px 8px #e6394630" } : undefined}>
            {m.symbol} {t(m.labelKey)}
          </button>
        ))}

        <button
          onClick={() => { addRest(); onAfterChange?.(); }}
          className="control-button control-button--rest">
          {t("controls.rest")}
        </button>

        {selectedIdx !== null && (
          <button
            onClick={deleteSelected}
            className="control-button control-button--delete">
            {t("controls.deleteSelected")}
          </button>
        )}

        {notes.length > 0 && (
          <button
            onClick={() => {
              const exportData = JSON.stringify(notes, null, 2);
              const blob = new Blob([exportData], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "score.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="control-button control-button--export">
            Export
          </button>
        )}

        <button
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = (e) => {
              const file = e.target.files[0];
              if (!file) return;
              file.text().then(text => {
                try {
                  const imported = JSON.parse(text);
                  if (Array.isArray(imported)) {
                    setNotes(imported);
                    setSelectedIdx(null);
                  } else {
                    alert("Invalid format: expected an array of notes.");
                  }
                } catch {
                  alert("Could not parse file as JSON.");
                }
              });
            };
            input.click();
          }}
          className="control-button control-button--import">
          Import
        </button>
      </div>
    </>
  );
}
