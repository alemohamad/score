import { STAFF_TOP, LINE_GAP, NOTE_START_X, BEAT_WIDTH, NOTE_CENTER_OFFSET } from "../constants/staff";

export function staffY(pos) {
  return STAFF_TOP + (13 - pos) * (LINE_GAP / 2);
}

export function yToPos(y) {
  const rawPos = 13 - (y - STAFF_TOP) / (LINE_GAP / 2);
  return Math.max(0, Math.min(16, Math.round(rawPos)));
}

export function getNoteX(beatPosition, beatWidth = BEAT_WIDTH) {
  return NOTE_START_X + beatPosition * beatWidth + NOTE_CENTER_OFFSET;
}
