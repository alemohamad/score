import { useState, useCallback, useEffect, useRef } from "react";
import * as Tone from "tone";
import { BEAT_VALUES } from "../constants/music";
import { getTotalBeats } from "../utils/music";

export default function usePlayback(notes) {
  const [isPlaying, setIsPlaying]     = useState(false);
  const [playheadBeat, setPlayheadBeat] = useState(0);
  const [tempo, setTempo]             = useState(120);
  const [isMuted, setIsMuted]         = useState(false);
  const timerRef = useRef(null);
  const synthRef = useRef(null);

  const startPlayback = useCallback(async () => {
    if (notes.length === 0) return;

    await Tone.start();

    // Create a fresh synth for this playback session — no leftover state
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
    const playedNotes = new Set();

    // Build a set of note indices that are tied to a previous note (should not trigger separately)
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
      let totalDuration = BEAT_VALUES[notes[idx].duration] || 1;
      let j = idx;
      while (j < notes.length - 1 && notes[j].slur && !notes[j + 1].isRest &&
             notes[j].note === notes[j + 1].note && notes[j].octave === notes[j + 1].octave &&
             notes[j].accidental === notes[j + 1].accidental) {
        j++;
        totalDuration += BEAT_VALUES[notes[j].duration] || 1;
      }
      return totalDuration;
    }

    function playNotesAtBeat(beat) {
      if (isMuted) return;
      notes.forEach((note, idx) => {
        if (note.isRest) return;
        if (tiedIndices.has(idx)) return; // Skip tied continuation notes
        const noteStart = note.startBeat !== undefined ? note.startBeat : 0;
        if (beat >= noteStart && !playedNotes.has(idx)) {
          playedNotes.add(idx);
          const acc = note.accidental === "sharp" ? "#" : note.accidental === "flat" ? "b" : "";
          const noteName = `${note.note}${acc}${note.octave}`;
          const noteDuration = getTiedDuration(idx);
          synth.triggerAttackRelease(noteName, `${noteDuration * (60 / tempo)}s`);
        }
      });
    }

    // Play beat 0 immediately, then start the interval
    playNotesAtBeat(0);
    setPlayheadBeat(0);

    let currentBeat = 0;
    timerRef.current = setInterval(() => {
      currentBeat += 0.25;

      if (currentBeat > totalBeats) {
        clearInterval(timerRef.current);
        setIsPlaying(false);
        setPlayheadBeat(0);
        return;
      }

      setPlayheadBeat(currentBeat);
      playNotesAtBeat(currentBeat);
    }, msPerTick);
  }, [notes, tempo, isMuted]);

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
