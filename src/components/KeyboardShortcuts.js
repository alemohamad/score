import { useTranslation } from "react-i18next";
import { SOLFEO, KEYBOARD_ROWS } from "../constants/music";

export default function KeyboardShortcuts({ noteSystem, addNote, onAfterChange }) {
  const { t } = useTranslation();

  return (
    <details className="keyboard-shortcuts">
      <summary className="keyboard-shortcuts__summary">
        {t("shortcuts.title")}
      </summary>
      <div className="keyboard-shortcuts__content">
        <div className="keyboard-shortcuts__label">{t("shortcuts.notes")}</div>
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="keyboard-shortcuts__row" style={{ paddingLeft: ri * 14 }}>
            {row.keys.map((k, i) => {
              const nd    = row.noteRange[i];
              const label = nd ? (noteSystem === "solfeo" ? SOLFEO[nd.note] : nd.note) : "";
              return (
                <div key={k}
                  onClick={() => { addNote(nd); onAfterChange?.(); }}
                  className="keyboard-shortcuts__key">
                  <div className="keyboard-shortcuts__key-letter">{k.toUpperCase()}</div>
                  <div className="keyboard-shortcuts__key-note">{label}{nd?.octave}</div>
                </div>
              );
            })}
          </div>
        ))}
        <p className="keyboard-shortcuts__hint">
          <kbd className="kbd kbd--dark">1</kbd> {t("shortcuts.whole")} {" · "}
          <kbd className="kbd kbd--dark">2</kbd> {t("shortcuts.half")} {" · "}
          <kbd className="kbd kbd--dark">3</kbd> {t("shortcuts.quarter")} {" · "}
          <kbd className="kbd kbd--dark">4</kbd> {t("shortcuts.eighth")} {" · "}
          <kbd className="kbd kbd--dark">5</kbd> {t("shortcuts.sixteenth")}
        </p>
        <p className="keyboard-shortcuts__hint">
          <kbd className="kbd">#</kbd> {t("shortcuts.sharp")} {" · "}
          <kbd className="kbd">B</kbd> {t("shortcuts.flat")} {" · "}
          <kbd className="kbd">N</kbd> {t("shortcuts.natural")} {" · "}
          <kbd className="kbd">.</kbd> {t("shortcuts.dotted")} {" · "}
          <kbd className="kbd kbd--triplet">T</kbd> {t("shortcuts.triplet")} {" · "}
          <kbd className="kbd kbd--rest">␣</kbd> {t("shortcuts.rest")} {" · "}
          <kbd className="kbd">⌫</kbd> {t("shortcuts.delete")}
        </p>
        <p className="keyboard-shortcuts__hint">
          <kbd className="kbd">0</kbd> {t("noteSystem.solfeo")} / {t("noteSystem.letter")} {" · "}
          <kbd className="kbd">-</kbd><kbd className="kbd">+</kbd> {t("shortcuts.timeSignature")}
        </p>
      </div>
    </details>
  );
}
