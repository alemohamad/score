import { TIME_SIGNATURES } from "../constants/music";

export default function TimeSignatureSelector({ timeSignature, setTimeSignature, onAfterChange }) {
  return (
    <div className="pill-group">
      {TIME_SIGNATURES.map(ts => (
        <button key={ts.label}
          className={`pill-button ${timeSignature.label === ts.label ? "pill-button--active" : ""}`}
          onClick={() => { setTimeSignature(ts); onAfterChange?.(); }}>
          {ts.label}
        </button>
      ))}
    </div>
  );
}
