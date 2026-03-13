export const SOLFEO = { C: "Do", D: "Re", E: "Mi", F: "Fa", G: "Sol", A: "La", B: "Si" };

export const STAFF_NOTES = [
  { note: "G", octave: 3, pos: 0 },
  { note: "A", octave: 3, pos: 1 },
  { note: "B", octave: 3, pos: 2 },
  { note: "C", octave: 4, pos: 3 },
  { note: "D", octave: 4, pos: 4 },
  { note: "E", octave: 4, pos: 5 },
  { note: "F", octave: 4, pos: 6 },
  { note: "G", octave: 4, pos: 7 },
  { note: "A", octave: 4, pos: 8 },
  { note: "B", octave: 4, pos: 9 },
  { note: "C", octave: 5, pos: 10 },
  { note: "D", octave: 5, pos: 11 },
  { note: "E", octave: 5, pos: 12 },
  { note: "F", octave: 5, pos: 13 },
  { note: "G", octave: 5, pos: 14 },
  { note: "A", octave: 5, pos: 15 },
  { note: "B", octave: 5, pos: 16 },
];

export const DURATION_KEYS = {
  "1": { value: "sixteenth",  labelKey: "duration.sixteenth" },
  "2": { value: "eighth",     labelKey: "duration.eighth" },
  "3": { value: "quarter",    labelKey: "duration.quarter" },
  "4": { value: "half",       labelKey: "duration.half" },
  "5": { value: "whole",      labelKey: "duration.whole" },
};

export const BEAT_VALUES = {
  whole: 4,
  half: 2,
  quarter: 1,
  eighth: 0.5,
  sixteenth: 0.25,
};

export const TIME_SIGNATURES = [
  { beats: 4, beatValue: 4, label: "4/4" },
  { beats: 3, beatValue: 4, label: "3/4" },
  { beats: 2, beatValue: 4, label: "2/4" },
];

const TOP_ROW = ["q","w","e","r","t","y","u"];
const MID_ROW = ["a","s","d","f","g","h","j"];
const BOT_ROW = ["z","x","c"];

export const KEYBOARD_ROWS = [
  { keys: TOP_ROW, noteRange: STAFF_NOTES.slice(0, 7) },
  { keys: MID_ROW, noteRange: STAFF_NOTES.slice(7, 14) },
  { keys: BOT_ROW, noteRange: STAFF_NOTES.slice(14, 17) },
];

export const KEY_TO_NOTE = {};
TOP_ROW.forEach((key, i) => { KEY_TO_NOTE[key] = STAFF_NOTES[i]; });
MID_ROW.forEach((key, i) => { KEY_TO_NOTE[key] = STAFF_NOTES[7 + i]; });
BOT_ROW.forEach((key, i) => { KEY_TO_NOTE[key] = STAFF_NOTES[14 + i]; });
