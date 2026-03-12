import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import "./App.css";

// Constants
import { STAFF_NOTES, DURATION_KEYS, TIME_SIGNATURES, KEY_TO_NOTE } from "./constants/music";
import { STAFF_TOP, LINE_GAP, STAFF_LEFT, NOTE_START_X, BEAT_WIDTH, MEASURES_PER_LINE, SIXTEENTH_GAP_ADJUST } from "./constants/staff";
import { G_CLEF, REPEAT_PATHS } from "./constants/svgPaths";

// Utils
import { noteName, getNoteBeatValue, getDurationBeatValue, getTotalBeats, snapToGrid } from "./utils/music";
import { staffY, yToPos, getNoteX } from "./utils/staff";
import { playNote } from "./utils/audio";

// Hooks
import usePlayback from "./hooks/usePlayback";

// Components
import NoteHead from "./components/NoteHead";
import RestHead from "./components/RestHead";
import Beams, { calculateBeamGroups, getBeamDirection } from "./components/Beams";
import Toggle from "./components/Toggle";
import TimeSignatureSelector from "./components/TimeSignatureSelector";
import LanguageSwitcher from "./components/LanguageSwitcher";
import PlaybackControls from "./components/PlaybackControls";
import Controls from "./components/Controls";
import KeyboardShortcuts from "./components/KeyboardShortcuts";
import MenuBar from "./components/MenuBar";

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const { t } = useTranslation();

  const [notes,       setNotes]       = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [duration,    setDuration]    = useState("quarter");
  const [dotted,      setDotted]      = useState(false);
  const [triplet,     setTriplet]     = useState(false);
  const [accidental,  setAccidental]  = useState(null);
  const [noteSystem,  setNoteSystem]  = useState("solfeo");
  const [ghostNote,   setGhostNote]   = useState(null);
  const [timeSignature, setTimeSignature] = useState(TIME_SIGNATURES[0]);
  const [repeats, setRepeats] = useState({});
  const [hideLabels,  setHideLabels]  = useState(false);

  const containerRef = useRef(null);
  const svgRefs      = useRef([]);

  const {
    isPlaying, playheadBeat, tempo, setTempo,
    isMuted, setIsMuted,
    startPlayback, stopPlayback,
  } = usePlayback(notes);

  useEffect(() => { containerRef.current?.focus(); }, []);


  const focusContainer = useCallback(() => containerRef.current?.focus(), []);

  // ── Add a note ──────────────────────────────────────────────────────────────
  const addNote = useCallback((noteData) => {
    playNote(noteData.note, noteData.octave, accidental);

    setNotes(ns => {
      const currentTotalBeats = getTotalBeats(ns);
      const snappedBeat = snapToGrid(currentTotalBeats, duration, triplet);

      const newNote = {
        ...noteData,
        duration,
        dotted,
        triplet,
        accidental,
        id: Date.now() + Math.random(),
        startBeat: snappedBeat,
      };

      const newNotes = [...ns, newNote];

      if (triplet) {
        let tripletCount = 0;
        for (let i = newNotes.length - 1; i >= 0; i--) {
          const n = newNotes[i];
          if (n.triplet && n.duration === duration) {
            tripletCount++;
          } else {
            break;
          }
        }
        if (tripletCount >= 3) {
          setTimeout(() => setTriplet(false), 0);
        }
      }

      return newNotes;
    });
    setAccidental(null);
    setDotted(false);
    setSelectedIdx(null);
  }, [duration, dotted, triplet, accidental]);

  // ── Add a rest ────────────────────────────────────────────────────────────────
  const addRest = useCallback(() => {
    setNotes(ns => {
      const currentTotalBeats = getTotalBeats(ns);
      const snappedBeat = snapToGrid(currentTotalBeats, duration, triplet);

      const newRest = {
        isRest: true,
        duration,
        dotted,
        triplet,
        id: Date.now() + Math.random(),
        startBeat: snappedBeat,
      };

      const newNotes = [...ns, newRest];

      if (triplet) {
        let tripletCount = 0;
        for (let i = newNotes.length - 1; i >= 0; i--) {
          const n = newNotes[i];
          if (n.triplet && n.duration === duration) {
            tripletCount++;
          } else {
            break;
          }
        }
        if (tripletCount >= 3) {
          setTimeout(() => setTriplet(false), 0);
        }
      }

      return newNotes;
    });
    setDotted(false);
    setSelectedIdx(null);
  }, [duration, dotted, triplet]);

  // ── Keyboard handler ────────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase();

    if (DURATION_KEYS[e.key]) { setDuration(DURATION_KEYS[e.key].value); return; }
    if (key === ".")           { setDotted(d => !d); return; }
    if (key === "t")           { setTriplet(t => !t); return; }
    if (e.shiftKey && e.key === "#") { setAccidental(a => a === "sharp"   ? null : "sharp");   return; }
    if (key === "b")           { setAccidental(a => a === "flat"    ? null : "flat");    return; }
    if (key === "n")           { setAccidental(a => a === "natural" ? null : "natural"); return; }

    if (key === "0") {
      setNoteSystem(ns => ns === "solfeo" ? "letter" : "solfeo");
      return;
    }

    if (key === "-") {
      setTimeSignature(ts => {
        const idx = TIME_SIGNATURES.findIndex(t => t.label === ts.label);
        const newIdx = idx <= 0 ? TIME_SIGNATURES.length - 1 : idx - 1;
        return TIME_SIGNATURES[newIdx];
      });
      return;
    }
    if (key === "+" || (e.shiftKey && e.key === "=")) {
      setTimeSignature(ts => {
        const idx = TIME_SIGNATURES.findIndex(t => t.label === ts.label);
        const newIdx = idx >= TIME_SIGNATURES.length - 1 ? 0 : idx + 1;
        return TIME_SIGNATURES[newIdx];
      });
      return;
    }

    if (key === "backspace" || key === "delete") {
      e.preventDefault();
      if (selectedIdx !== null) {
        setNotes(ns => ns.filter((_, i) => i !== selectedIdx));
        setSelectedIdx(null);
      } else {
        setNotes(ns => ns.length > 0 ? ns.slice(0, -1) : ns);
      }
      return;
    }

    if (key === "escape") { setSelectedIdx(null); return; }

    if (key === " ") {
      e.preventDefault();
      addRest();
      return;
    }

    const noteData = KEY_TO_NOTE[key];
    if (noteData) addNote(noteData);
  }, [selectedIdx, addNote, addRest]);

  // ── Pointer helpers ─────────────────────────────────────────────────────────
  function getSVGCoords(e, svgEl) {
    const rect    = svgEl.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const scale   = rect.width / svgEl.getAttribute("width");
    return { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale - 18 };
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const totalBeats = getTotalBeats(notes);
  const beatsPerMeasure = timeSignature.beats;
  const beatsPerLine = MEASURES_PER_LINE * beatsPerMeasure;
  const staffWidth = NOTE_START_X + beatsPerLine * BEAT_WIDTH + 20;
  const nextNoteBeatValue = getDurationBeatValue(duration, dotted, triplet);

  const rawCurrentLine = Math.floor(totalBeats / beatsPerLine);
  const beatsOnRawLine = totalBeats % beatsPerLine;
  const canFitOnRawLine = beatsOnRawLine + nextNoteBeatValue <= beatsPerLine;

  const currentLine = canFitOnRawLine ? rawCurrentLine : rawCurrentLine + 1;
  const beatsOnCurrentLine = canFitOnRawLine ? beatsOnRawLine : 0;

  const totalLines = Math.max(1, currentLine + 1);

  function getNotesForLine(lineIdx) {
    const lineStartBeat = lineIdx * beatsPerLine;
    const lineEndBeat = (lineIdx + 1) * beatsPerLine;
    const lineNotes = [];
    let accumulatedBeats = 0;

    for (const note of notes) {
      const noteBeatValue = getNoteBeatValue(note);
      const noteStartBeat = note.startBeat !== undefined ? note.startBeat : accumulatedBeats;

      if (noteStartBeat >= lineStartBeat && noteStartBeat < lineEndBeat) {
        lineNotes.push({ ...note, beatPosition: noteStartBeat - lineStartBeat });
      }

      accumulatedBeats = noteStartBeat + noteBeatValue;
    }

    return lineNotes;
  }

  function handleStaffPointerMove(e, lineIdx) {
    const svgEl = svgRefs.current[lineIdx];
    if (!svgEl) return;
    const { x, y } = getSVGCoords(e, svgEl);
    if (x < STAFF_LEFT || x > staffWidth) { setGhostNote(null); return; }
    const pos = yToPos(y);
    const noteData = STAFF_NOTES[pos];
    if (!noteData || lineIdx !== currentLine) {
      setGhostNote(null);
      return;
    }
    setGhostNote({ pos, noteData, lineIdx });
  }

  function handleStaffClick(e, lineIdx) {
    const svgEl = svgRefs.current[lineIdx];
    if (!svgEl) return;
    const { x, y } = getSVGCoords(e, svgEl);
    if (x < STAFF_LEFT || x > staffWidth) return;
    const pos = yToPos(y);
    const noteData = STAFF_NOTES[pos];
    if (noteData && lineIdx === currentLine) {
      addNote(noteData);
    }
    setGhostNote(null);
  }

  const deleteSelected = useCallback(() => {
    setNotes(ns => ns.filter((_, i) => i !== selectedIdx));
    setSelectedIdx(null);
  }, [selectedIdx]);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="app"
    >
      {/* Menu bar */}
      <MenuBar duration={duration} setDuration={setDuration} dotted={dotted} setDotted={setDotted} triplet={triplet} setTriplet={setTriplet} addRest={addRest} accidental={accidental} setAccidental={setAccidental} isMuted={isMuted} setIsMuted={setIsMuted} isPlaying={isPlaying} startPlayback={startPlayback} stopPlayback={stopPlayback} tempo={tempo} setTempo={setTempo} hasNotes={notes.length > 0} noteCount={notes.length} notes={notes} setNotes={setNotes} setSelectedIdx={setSelectedIdx} noteSystem={noteSystem} setNoteSystem={setNoteSystem} timeSignature={timeSignature} setTimeSignature={setTimeSignature} hideLabels={hideLabels} setHideLabels={setHideLabels} onAfterChange={focusContainer} />

      {/* Staff */}
      <div className="staff-container-wrapper">
      <div className="staff-container" style={{ maxWidth: staffWidth + 30 }}>
        {Array.from({ length: totalLines }).map((_, lineIdx) => {
          const lineNotes = getNotesForLine(lineIdx);
          const isCurrentLine = lineIdx === currentLine;
          const showGhost = ghostNote && ghostNote.lineIdx === lineIdx && isCurrentLine;

          return (
            <svg
              key={lineIdx}
              ref={el => svgRefs.current[lineIdx] = el}
              width={staffWidth}
              height={LINE_GAP * 4 + 130}
              style={{ display:"block", cursor: isCurrentLine ? "crosshair" : "default" }}
              onMouseMove={e => handleStaffPointerMove(e, lineIdx)}
              onMouseLeave={() => setGhostNote(null)}
              onClick={e => handleStaffClick(e, lineIdx)}
              onTouchStart={e => { e.preventDefault(); handleStaffClick(e, lineIdx); }}
              onTouchMove={e => { e.preventDefault(); handleStaffPointerMove(e, lineIdx); }}
            >
              <g transform="translate(0,18)">
                {/* Staff lines */}
                {[0,1,2,3,4].map(i => (
                  <line key={i}
                    x1={STAFF_LEFT+2} y1={STAFF_TOP + i * LINE_GAP}
                    x2={staffWidth - 10} y2={STAFF_TOP + i * LINE_GAP}
                    stroke="#1a1a2e" strokeWidth="1.1"
                  />
                ))}

                {/* Treble clef */}
                <g transform={`translate(${STAFF_LEFT + 5}, ${STAFF_TOP - 20}) scale(0.55)`}>
                  <g transform={`translate(${G_CLEF.translateX}, ${G_CLEF.translateY})`}>
                    <path d={G_CLEF.path} fill="#1a1a2e" />
                  </g>
                </g>

                {/* Time signature (first line only) */}
                {lineIdx === 0 && (
                  <g>
                    <text x={STAFF_LEFT + 65} y={STAFF_TOP + LINE_GAP * 1.7 - 2}
                      fontSize={36} fontFamily="Georgia, serif" fontWeight="bold" fill="#1a1a2e"
                      textAnchor="middle">
                      {timeSignature.beats}
                    </text>
                    <text x={STAFF_LEFT + 65} y={STAFF_TOP + LINE_GAP * 3.7 - 2}
                      fontSize={36} fontFamily="Georgia, serif" fontWeight="bold" fill="#1a1a2e"
                      textAnchor="middle">
                      {timeSignature.beatValue}
                    </text>
                  </g>
                )}

                {/* Repeat start at beginning */}
                {lineIdx === 0 && repeats[0] === 'start' && (
                  <g transform={`translate(${NOTE_START_X - 5}, ${STAFF_TOP - 1}) scale(0.87)`}>
                    {REPEAT_PATHS.start.paths.map((p, i) => (
                      <path key={i} d={p} fill="#1a1a2e" />
                    ))}
                  </g>
                )}
                {lineIdx === 0 && (
                  <rect
                    x={NOTE_START_X - 10} y={STAFF_TOP - 5}
                    width={20} height={LINE_GAP * 4 + 10}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setRepeats(r => {
                        const newRepeats = { ...r };
                        if (r[0] === 'start') delete newRepeats[0];
                        else newRepeats[0] = 'start';
                        return newRepeats;
                      });
                    }}
                  />
                )}

                {/* Bar lines + repeat signs */}
                {Array.from({ length: MEASURES_PER_LINE }).map((_, measureIdx) => {
                  const globalMeasure = lineIdx * MEASURES_PER_LINE + measureIdx + 1;
                  const barX = NOTE_START_X + (measureIdx + 1) * beatsPerMeasure * BEAT_WIDTH;
                  const repeatType = repeats[globalMeasure];
                  const repeatScale = 0.87;
                  const repeatY = STAFF_TOP - 1;

                  return (
                    <g key={`bar-${measureIdx}`}>
                      <line
                        x1={barX} y1={STAFF_TOP}
                        x2={barX} y2={STAFF_TOP + LINE_GAP * 4}
                        stroke="#1a1a2e" strokeWidth={measureIdx === MEASURES_PER_LINE - 1 ? "2.5" : "1.5"}
                      />
                      {(repeatType === 'end' || repeatType === 'both') && (
                        <g transform={`translate(${barX - REPEAT_PATHS.end.width * repeatScale - 2}, ${repeatY}) scale(${repeatScale})`}>
                          {REPEAT_PATHS.end.paths.map((p, i) => (
                            <path key={i} d={p} fill="#1a1a2e" />
                          ))}
                        </g>
                      )}
                      {(repeatType === 'start' || repeatType === 'both') && (
                        <g transform={`translate(${barX + 3}, ${repeatY}) scale(${repeatScale})`}>
                          {REPEAT_PATHS.start.paths.map((p, i) => (
                            <path key={i} d={p} fill="#1a1a2e" />
                          ))}
                        </g>
                      )}
                      <rect
                        x={barX - 15} y={STAFF_TOP - 5}
                        width={30} height={LINE_GAP * 4 + 10}
                        fill="transparent"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setRepeats(r => {
                            const current = r[globalMeasure];
                            let next;
                            if (!current) next = 'end';
                            else if (current === 'end') next = 'start';
                            else if (current === 'start') next = 'both';
                            else next = undefined;

                            const newRepeats = { ...r };
                            if (next) newRepeats[globalMeasure] = next;
                            else delete newRepeats[globalMeasure];
                            return newRepeats;
                          });
                        }}
                      />
                    </g>
                  );
                })}

                {/* Playhead */}
                {isPlaying && (() => {
                  const playheadLine = Math.floor(playheadBeat / beatsPerLine);
                  if (playheadLine === lineIdx) {
                    const beatOnLine = playheadBeat % beatsPerLine;
                    const playheadX = getNoteX(beatOnLine);
                    return (
                      <line
                        x1={playheadX} y1={STAFF_TOP - 10}
                        x2={playheadX} y2={STAFF_TOP + LINE_GAP * 4 + 10}
                        stroke="#e63946" strokeWidth="2"
                        strokeLinecap="round"
                      />
                    );
                  }
                  return null;
                })()}

                {/* Ghost note */}
                {showGhost && (
                  <NoteHead
                    x={getNoteX(snapToGrid(beatsOnCurrentLine, duration, triplet))}
                    y={staffY(ghostNote.pos)}
                    duration={duration} selected={false}
                    dotted={dotted} accidental={accidental}
                    pos={ghostNote.pos} ghost={true}
                    noteLabel={noteName(ghostNote.noteData.note, noteSystem, accidental)}
                    hideLabel={hideLabels}
                  />
                )}

                {/* Notes + beams */}
                {(() => {
                  const beamGroups = calculateBeamGroups(lineNotes, beatsPerMeasure);

                  // Build per-note x adjustments for beamed sixteenth groups
                  const sixteenthXAdjust = new Map();
                  beamGroups.forEach(group => {
                    if (group[0].duration === "sixteenth") {
                      group.forEach((note, i) => {
                        sixteenthXAdjust.set(note.id, i * SIXTEENTH_GAP_ADJUST);
                      });
                    }
                  });

                  const getNoteRenderInfo = (note) => ({
                    x: getNoteX(note.beatPosition) + (sixteenthXAdjust.get(note.id) || 0),
                    y: staffY(note.pos),
                    pos: note.pos
                  });

                  const noteBeamDirection = new Map();
                  beamGroups.forEach(group => {
                    const isUp = getBeamDirection(group, getNoteRenderInfo);
                    group.forEach(note => {
                      noteBeamDirection.set(note.id, isUp);
                    });
                  });

                  return (
                    <>
                      <Beams beamGroups={beamGroups} getNoteRenderInfo={getNoteRenderInfo} />

                      {lineNotes.map((note) => {
                        const x = getNoteX(note.beatPosition) + (sixteenthXAdjust.get(note.id) || 0);
                        const globalIdx = notes.findIndex(n => n.id === note.id);

                        if (note.isRest) {
                          return (
                            <g key={note.id}
                              onClick={ev => { ev.stopPropagation(); setSelectedIdx(globalIdx === selectedIdx ? null : globalIdx); }}
                              onTouchEnd={ev => { ev.preventDefault(); ev.stopPropagation(); setSelectedIdx(globalIdx === selectedIdx ? null : globalIdx); }}
                              style={{ cursor:"pointer" }}>
                              <rect x={x-16} y={STAFF_TOP} width={32} height={LINE_GAP*4} fill="transparent"/>
                              <RestHead x={x} duration={note.duration}
                                selected={selectedIdx === globalIdx}
                                dotted={note.dotted}
                                hideLabel={hideLabels}
                                restLabel={t("controls.restLabel")}
                              />
                            </g>
                          );
                        }

                        const y = staffY(note.pos);
                        const label = noteName(note.note, noteSystem, note.accidental);
                        const isBeamed = noteBeamDirection.has(note.id);
                        const forceDirection = isBeamed ? noteBeamDirection.get(note.id) : undefined;

                        return (
                          <g key={note.id}
                            onClick={ev => { ev.stopPropagation(); setSelectedIdx(globalIdx === selectedIdx ? null : globalIdx); }}
                            onTouchEnd={ev => { ev.preventDefault(); ev.stopPropagation(); setSelectedIdx(globalIdx === selectedIdx ? null : globalIdx); }}
                            style={{ cursor:"pointer" }}>
                            <rect x={x-16} y={y-26} width={32} height={52} fill="transparent"/>
                            <NoteHead x={x} y={y} duration={note.duration}
                              selected={selectedIdx === globalIdx}
                              dotted={note.dotted} accidental={note.accidental}
                              pos={note.pos} noteLabel={label}
                              beamed={isBeamed}
                              forceDirection={forceDirection}
                              hideLabel={hideLabels}
                            />
                          </g>
                        );
                      })}

                      {/* Triplet brackets */}
                      {(() => {
                        const brackets = [];
                        let i = 0;
                        while (i < lineNotes.length) {
                          const note = lineNotes[i];
                          if (note.triplet) {
                            let groupEnd = i;
                            while (
                              groupEnd < lineNotes.length &&
                              lineNotes[groupEnd].triplet &&
                              lineNotes[groupEnd].duration === note.duration
                            ) {
                              groupEnd++;
                            }
                            const groupSize = groupEnd - i;
                            if (groupSize >= 1) {
                              const firstNote = lineNotes[i];
                              const lastNote = lineNotes[groupEnd - 1];
                              const x1 = getNoteX(firstNote.beatPosition) - 8;
                              const x2 = getNoteX(lastNote.beatPosition) + 8;
                              const bracketY = STAFF_TOP - 18;
                              brackets.push(
                                <g key={`triplet-${firstNote.id}`}>
                                  <line x1={x1} y1={bracketY} x2={x1} y2={bracketY + 5} stroke="#1a1a2e" strokeWidth="1.5"/>
                                  <line x1={x1} y1={bracketY} x2={(x1 + x2) / 2 - 8} y2={bracketY} stroke="#1a1a2e" strokeWidth="1.5"/>
                                  <text x={(x1 + x2) / 2} y={bracketY + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1a1a2e" fontFamily="Georgia, serif">3</text>
                                  <line x1={(x1 + x2) / 2 + 8} y1={bracketY} x2={x2} y2={bracketY} stroke="#1a1a2e" strokeWidth="1.5"/>
                                  <line x1={x2} y1={bracketY} x2={x2} y2={bracketY + 5} stroke="#1a1a2e" strokeWidth="1.5"/>
                                </g>
                              );
                            }
                            i = groupEnd;
                          } else {
                            i++;
                          }
                        }
                        return brackets;
                      })()}
                    </>
                  );
                })()}
              </g>
            </svg>
          );
        })}
      </div>
      </div>

      {/* Keyboard shortcuts */}
      <KeyboardShortcuts noteSystem={noteSystem} addNote={addNote} onAfterChange={focusContainer} />
    </div>
  );
}
