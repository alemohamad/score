import { useState, useCallback, useEffect, useRef } from "react";
import * as Tone from "tone";
import { BEAT_VALUES } from "../constants/music";
import { getTotalBeats, getNoteBeatValue } from "../utils/music";

// Build the playback measure order, expanding repeats once.
// Repeats map: { globalMeasure: 'start' | 'end' | 'both' }
// Returns an array of 0-based measure indices in playback order.
function buildMeasureOrder(repeats, totalMeasures) {
  const order = [];
  let i = 0;
  const repeated = new Set();

  while (i < totalMeasures) {
    order.push(i);
    const globalMeasure = i + 1; // repeats use 1-based measure numbers
    const repeatType = repeats[globalMeasure];

    if ((repeatType === "end" || repeatType === "both") && !repeated.has(globalMeasure)) {
      repeated.add(globalMeasure);
      // Find matching start repeat going backwards
      let startMeasure = 0; // default: start of piece
      for (let j = i - 1; j >= 0; j--) {
        const rt = repeats[j + 1];
        if (rt === "start" || rt === "both") {
          startMeasure = j;
          break;
        }
      }
      // Insert the repeated section
      for (let j = startMeasure; j <= i; j++) {
        order.push(j);
      }
    }
    i++;
  }
  return order;
}

export default function usePlayback(notes, repeats = {}, beatsPerMeasure = 4) {
  const [isPlaying, setIsPlaying]     = useState(false);
  const [playheadBeat, setPlayheadBeat] = useState(0);
  const [tempo, setTempo]             = useState(120);
  const [isMuted, setIsMuted]         = useState(false);
  const timerRef = useRef(null);
  const synthRef = useRef(null);

  const startPlayback = useCallback(async () => {
    if (notes.length === 0) return;

    await Tone.start();

    if (synthRef.current) {
      synthRef.current.dispose();
    }
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.2, release: 0.8 },
    }).toDestination();
    synthRef.current.volume.value = -6;

    const synth = synthRef.current;

    setIsPlaying(true);
    setPlayheadBeat(0);

    const msPerBeat = (60 / tempo) * 1000;
    const msPerTick = msPerBeat / 4;
    const totalBeats = getTotalBeats(notes);

    // Build a set of note indices that are tied to a previous note
    const tiedIndices = new Set();
    for (let i = 0; i < notes.length - 1; i++) {
      const note = notes[i];
      const next = notes[i + 1];
      if (note.slur && !note.isRest && !next.isRest &&
          note.note === next.note && note.octave === next.octave &&
          note.accidental === next.accidental) {
        tiedIndices.add(i + 1);
      }
    }

    function getTiedDuration(idx) {
      let dur = BEAT_VALUES[notes[idx].duration] || 1;
      let j = idx;
      while (j < notes.length - 1 && notes[j].slur && !notes[j + 1].isRest &&
             notes[j].note === notes[j + 1].note && notes[j].octave === notes[j + 1].octave &&
             notes[j].accidental === notes[j + 1].accidental) {
        j++;
        dur += BEAT_VALUES[notes[j].duration] || 1;
      }
      return dur;
    }

    // Build measure order with repeats
    const totalMeasures = Math.ceil(totalBeats / beatsPerMeasure) || 1;
    const hasRepeats = Object.keys(repeats).length > 0;
    const measureOrder = hasRepeats ? buildMeasureOrder(repeats, totalMeasures) : null;

    // Build the playback beat sequence: an array of original beat offsets
    // Each tick maps a playback position to the original score beat
    let playbackBeats;
    if (measureOrder) {
      playbackBeats = [];
      for (const measureIdx of measureOrder) {
        const measureStart = measureIdx * beatsPerMeasure;
        for (let tick = 0; tick < beatsPerMeasure * 4; tick++) {
          playbackBeats.push(measureStart + tick * 0.25);
        }
      }
    }

    const totalPlaybackTicks = playbackBeats
      ? playbackBeats.length
      : Math.ceil(totalBeats / 0.25) + 1;

    function playNotesAtBeat(beat) {
      if (isMuted) return;
      notes.forEach((note, idx) => {
        if (note.isRest) return;
        if (tiedIndices.has(idx)) return;
        const noteStart = note.startBeat !== undefined ? note.startBeat : 0;
        if (beat >= noteStart && beat < noteStart + getNoteBeatValue(note)) {
          const acc = note.accidental === "sharp" ? "#" : note.accidental === "flat" ? "b" : "";
          const noteName = `${note.note}${acc}${note.octave}`;
          const noteDuration = getTiedDuration(idx);
          synth.triggerAttackRelease(noteName, `${noteDuration * (60 / tempo)}s`);
        }
      });
    }

    // Play first beat
    const firstBeat = playbackBeats ? playbackBeats[0] : 0;
    setPlayheadBeat(firstBeat);
    playNotesAtBeat(firstBeat);

    let tickIdx = 0;
    const playedAtTick = new Set();
    playedAtTick.add(0);

    timerRef.current = setInterval(() => {
      tickIdx++;

      if (tickIdx >= totalPlaybackTicks) {
        clearInterval(timerRef.current);
        setIsPlaying(false);
        setPlayheadBeat(0);
        return;
      }

      const scoreBeat = playbackBeats ? playbackBeats[tickIdx] : tickIdx * 0.25;

      // For repeats, we need to re-trigger notes even if played before
      // Use a unique key per tick to allow re-triggering
      setPlayheadBeat(scoreBeat);
      if (!isMuted) {
        notes.forEach((note, idx) => {
          if (note.isRest) return;
          if (tiedIndices.has(idx)) return;
          const noteStart = note.startBeat !== undefined ? note.startBeat : 0;
          // Trigger at the exact start beat of the note
          if (Math.abs(scoreBeat - noteStart) < 0.001) {
            const tickKey = `${tickIdx}-${idx}`;
            if (!playedAtTick.has(tickKey)) {
              playedAtTick.add(tickKey);
              const acc = note.accidental === "sharp" ? "#" : note.accidental === "flat" ? "b" : "";
              const noteName = `${note.note}${acc}${note.octave}`;
              const noteDuration = getTiedDuration(idx);
              synth.triggerAttackRelease(noteName, `${noteDuration * (60 / tempo)}s`);
            }
          }
        });
      }
    }, msPerTick);
  }, [notes, tempo, isMuted, repeats, beatsPerMeasure]);

  const stopPlayback = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.releaseAll();
    }
    setIsPlaying(false);
    setPlayheadBeat(0);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (synthRef.current) synthRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      stopPlayback();
      startPlayback();
    }
  }, [tempo]); // Intentionally only reacting to tempo changes

  return {
    isPlaying, playheadBeat, tempo, setTempo,
    isMuted, setIsMuted,
    startPlayback, stopPlayback,
  };
}
