import { SOLFEO, BEAT_VALUES } from "../constants/music";

export function noteName(note, system, accidental) {
  const base = system === "solfeo" ? SOLFEO[note] : note;
  const acc  = accidental === "sharp" ? "\u266F"
             : accidental === "flat"  ? "\u266D"
             : accidental === "natural" ? "\u266E" : "";
  return base + acc;
}

export function getNoteBeatValue(note) {
  let value = BEAT_VALUES[note.duration] || 1;
  if (note.dotted) value *= 1.5;
  if (note.triplet) value *= 2 / 3;
  return value;
}

export function getDurationBeatValue(duration, dotted, triplet) {
  let value = BEAT_VALUES[duration] || 1;
  if (dotted) value *= 1.5;
  if (triplet) value *= 2 / 3;
  return value;
}

export function getTotalBeats(notes) {
  if (notes.length === 0) return 0;
  const lastNote = notes[notes.length - 1];
  if (lastNote.startBeat !== undefined) {
    return lastNote.startBeat + getNoteBeatValue(lastNote);
  }
  return notes.reduce((sum, note) => sum + getNoteBeatValue(note), 0);
}

export function getBeatGridSize(duration, triplet = false) {
  let gridSize;
  switch (duration) {
    case "sixteenth": gridSize = 0.25; break;
    case "eighth": gridSize = 0.5; break;
    case "quarter": gridSize = 1; break;
    case "half": gridSize = 2; break;
    case "whole": gridSize = 4; break;
    default: gridSize = 1;
  }
  if (triplet) {
    gridSize = gridSize * (2 / 3);
  }
  return gridSize;
}

export function snapToGrid(currentBeat, duration, triplet = false) {
  const gridSize = getBeatGridSize(duration, triplet);
  return Math.ceil(currentBeat / gridSize - 0.0001) * gridSize;
}
