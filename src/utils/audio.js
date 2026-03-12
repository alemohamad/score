import * as Tone from "tone";

const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: "triangle" },
  envelope: { attack: 0.02, decay: 0.3, sustain: 0.2, release: 0.8 },
}).toDestination();
synth.volume.value = -6;

export function playNote(note, octave, accidental) {
  const acc = accidental === "sharp" ? "#" : accidental === "flat" ? "b" : "";
  const noteName = `${note}${acc}${octave}`;

  if (Tone.context.state !== "running") {
    Tone.start();
  }

  synth.triggerAttackRelease(noteName, "8n");
}
