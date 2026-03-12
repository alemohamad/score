import { STEM_LENGTH, BEAM_THICKNESS, BEAM_GAP } from "../constants/staff";
import { getNoteBeatValue } from "../utils/music";

export function calculateBeamGroups(notes, beatsPerMeasure) {
  const groups = [];
  let currentGroup = [];

  notes.forEach((note, idx) => {
    const isBeamable = !note.isRest && (note.duration === "eighth" || note.duration === "sixteenth");

    if (isBeamable) {
      if (currentGroup.length > 0) {
        const lastNote = currentGroup[currentGroup.length - 1];
        const lastNoteEnd = (lastNote.beatPosition || 0) + getNoteBeatValue(lastNote);
        const thisNoteStart = note.beatPosition || 0;

        const isAdjacent = Math.abs(thisNoteStart - lastNoteEnd) < 0.01;
        const sameMeasure = Math.floor(thisNoteStart / beatsPerMeasure) === Math.floor((lastNote.beatPosition || 0) / beatsPerMeasure);
        const sameDuration = lastNote.duration === note.duration;

        if (isAdjacent && sameMeasure && sameDuration) {
          currentGroup.push({ ...note, index: idx });
        } else {
          if (currentGroup.length > 1) {
            groups.push([...currentGroup]);
          }
          currentGroup = [{ ...note, index: idx }];
        }
      } else {
        currentGroup = [{ ...note, index: idx }];
      }
    } else {
      if (currentGroup.length > 1) {
        groups.push([...currentGroup]);
      }
      currentGroup = [];
    }
  });

  if (currentGroup.length > 1) {
    groups.push([...currentGroup]);
  }

  return groups;
}

export function getBeamDirection(group, getNoteRenderInfo) {
  const notesInfo = group.map(note => ({
    ...note,
    ...getNoteRenderInfo(note)
  }));
  const avgPos = notesInfo.reduce((sum, n) => sum + n.pos, 0) / notesInfo.length;
  return avgPos < 9;
}

export default function Beams({ beamGroups, getNoteRenderInfo }) {
  return (
    <>
      {beamGroups.map((group, groupIdx) => {
        if (group.length < 2) return null;

        const notesInfo = group.map(note => ({
          ...note,
          ...getNoteRenderInfo(note)
        }));

        const avgPos = notesInfo.reduce((sum, n) => sum + n.pos, 0) / notesInfo.length;
        const isUp = avgPos < 9;

        const stemOffset = isUp ? 4.5 : -4.5;

        const stemEndY = isUp
          ? Math.min(...notesInfo.map(n => n.y)) - STEM_LENGTH
          : Math.max(...notesInfo.map(n => n.y)) + STEM_LENGTH;

        const color = "#1a1a2e";
        const isSixteenth = group[0].duration === "sixteenth";

        const firstNoteX = notesInfo[0].x + stemOffset;
        const lastNoteX = notesInfo[notesInfo.length - 1].x + stemOffset;

        return (
          <g key={`beam-group-${groupIdx}`}>
            <line
              x1={firstNoteX + (isUp ? 1 : -3) + (!isUp && isSixteenth ? -0.5 : 0)}
              y1={stemEndY}
              x2={lastNoteX + (isUp ? 3 : -2.5) + (!isUp && isSixteenth ? 0.5 : 0)}
              y2={stemEndY}
              stroke={color}
              strokeWidth={BEAM_THICKNESS}
            />
            {isSixteenth && (
              <line
                x1={firstNoteX + (isUp ? 2 : -2.5) + (!isUp ? -0.5 : 0)}
                y1={stemEndY + (isUp ? BEAM_GAP : -BEAM_GAP)}
                x2={lastNoteX + (isUp ? 2 : -2.5) + (!isUp ? 0.5 : 0)}
                y2={stemEndY + (isUp ? BEAM_GAP : -BEAM_GAP)}
                stroke={color}
                strokeWidth={BEAM_THICKNESS}
              />
            )}
            {notesInfo.map((note, i) => {
              const stemX = note.x + stemOffset + (isUp ? 2 : -2.5);
              const stemStartY = note.y + (isUp ? -STEM_LENGTH + 8 : STEM_LENGTH - 8);
              const stemEndYAdjusted = stemEndY + (isUp ? BEAM_THICKNESS/2 : -BEAM_THICKNESS/2);
              return (
                <line
                  key={`stem-ext-${i}`}
                  x1={stemX}
                  y1={stemStartY}
                  x2={stemX}
                  y2={stemEndYAdjusted}
                  stroke={color}
                  strokeWidth={1.5}
                />
              );
            })}
          </g>
        );
      })}
    </>
  );
}
