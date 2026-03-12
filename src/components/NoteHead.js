import { NOTE_PATHS, ACCIDENTAL_PATHS } from "../constants/svgPaths";
import { LABEL_Y } from "../constants/staff";
import { staffY } from "../utils/staff";

export default function NoteHead({ x, y, duration, selected, dotted, accidental, pos, noteLabel, ghost, beamed, forceDirection, hideLabel }) {
  const isUp = forceDirection !== undefined ? forceDirection : pos < 9;
  const color = ghost ? "#1767AE" : selected ? "#e63946" : "#1a1a2e";
  const opacity = ghost ? 0.7 : 1;

  const getNotePath = () => {
    switch (duration) {
      case "whole":
        return NOTE_PATHS.whole;
      case "half":
        return isUp ? NOTE_PATHS.halfUp : NOTE_PATHS.halfDown;
      case "quarter":
        return isUp ? NOTE_PATHS.quarterUp : NOTE_PATHS.quarterDown;
      case "eighth":
      case "sixteenth":
        if (beamed) {
          return isUp ? NOTE_PATHS.quarterUp : NOTE_PATHS.quarterDown;
        }
        return duration === "eighth"
          ? (isUp ? NOTE_PATHS.eighthUp : NOTE_PATHS.eighthDown)
          : (isUp ? NOTE_PATHS.sixteenthUp : NOTE_PATHS.sixteenthDown);
      default:
        return NOTE_PATHS.quarterUp;
    }
  };

  const notePath = getNotePath();
  const scale = 0.4;
  const scaledWidth = notePath.width * scale;
  const scaledNoteHeadY = notePath.noteHeadY * scale;

  const noteX = x - scaledWidth / 2 + (duration === "whole" ? 0 : (isUp ? 2 : -2));
  const noteY = y - scaledNoteHeadY;

  return (
    <g opacity={opacity}>
      {/* Ledger lines */}
      {pos <= 3 && <line x1={x-11} y1={staffY(3)} x2={x+11} y2={staffY(3)} stroke={color} strokeWidth="1.5"/>}
      {pos <= 1 && <line x1={x-11} y1={staffY(1)} x2={x+11} y2={staffY(1)} stroke={color} strokeWidth="1.5"/>}
      {pos >= 15 && <line x1={x-11} y1={staffY(15)} x2={x+11} y2={staffY(15)} stroke={color} strokeWidth="1.5"/>}

      {/* Accidentals */}
      {!ghost && accidental && ACCIDENTAL_PATHS[accidental] && (() => {
        const acc = ACCIDENTAL_PATHS[accidental];
        const accScale = accidental === "sharp" ? 0.196 : accidental === "flat" ? 0.28 : 0.21;
        const accX = x - 16;
        const accY = y - (acc.height * accScale) / 2;
        return (
          <g transform={`translate(${accX}, ${accY}) scale(${accScale})`}>
            <g transform={`translate(${acc.translateX}, ${acc.translateY})`}>
              <path d={acc.path} fill={color} />
            </g>
          </g>
        );
      })()}

      {/* Note SVG */}
      <g transform={`translate(${noteX}, ${noteY}) scale(${scale})`}>
        <path d={notePath.path} fill={color} />
      </g>

      {/* Dot (puntillo) */}
      {dotted && !ghost && <circle cx={x + 12} cy={y - 1} r={2.5} fill={color}/>}

      {/* Note label */}
      {noteLabel && !hideLabel && (
        <text x={x} y={LABEL_Y} textAnchor="middle" fontSize={14} fontWeight={600}
          fill={ghost ? "#1767AE" : "#636363"}
          fontFamily="system-ui, -apple-system, sans-serif">
          {noteLabel}
        </text>
      )}
    </g>
  );
}
