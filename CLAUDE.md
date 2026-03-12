# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pentagram — Clave de Sol is an interactive treble clef staff editor built with React. It supports keyboard, mouse, touch, and Apple Pencil input for placing musical notes on a staff. Includes playback with Tone.js, i18n (Spanish/English), time signatures, repeat signs, triplets, and beamed notes.

## Commands

```bash
npm install    # Install dependencies
npm start      # Run development server at http://localhost:3000
npm run build  # Create production build
npm run deploy # Build and output to /docs for GitHub Pages
```

## Architecture

React 18 application created with Create React App. Dependencies: Tone.js (audio), i18next + react-i18next (translations).

### Folder Structure

```
src/
├── App.js                          # Main component — state, keyboard handler, staff rendering
├── App.css                         # All styles (extracted from inline)
├── index.js                        # Entry point
├── constants/
│   ├── music.js                    # SOLFEO, STAFF_NOTES, DURATION_KEYS, BEAT_VALUES, TIME_SIGNATURES, KEY_TO_NOTE
│   ├── staff.js                    # STAFF_TOP, LINE_GAP, BEAT_WIDTH, STEM_LENGTH, etc.
│   └── svgPaths.js                 # NOTE_PATHS, REST_PATHS, REPEAT_PATHS, ACCIDENTAL_PATHS, G_CLEF
├── utils/
│   ├── music.js                    # noteName, getNoteBeatValue, getTotalBeats, snapToGrid
│   ├── staff.js                    # staffY, yToPos, getNoteX
│   └── audio.js                    # Tone.js synth setup, playNote()
├── hooks/
│   └── usePlayback.js              # Playback state & logic (play/stop/tempo/mute)
├── components/
│   ├── NoteHead.js                 # SVG note rendering (stems, flags, accidentals, ledger lines)
│   ├── RestHead.js                 # SVG rest rendering
│   ├── Beams.js                    # Beam group calculation + beam SVG rendering
│   ├── Toggle.js                   # Solfeo/Letter notation toggle
│   ├── TimeSignatureSelector.js    # Time signature picker (4/4, 3/4, 2/4)
│   ├── LanguageSwitcher.js         # ES/EN language toggle
│   ├── StatusBar.js                # Current duration/dotted/triplet/accidental display
│   ├── PlaybackControls.js         # Play/stop, mute, tempo slider, hide labels
│   ├── Controls.js                 # Duration buttons, modifier buttons, rest/delete/export
│   └── KeyboardShortcuts.js        # Collapsible keyboard shortcuts reference
└── i18n/
    ├── index.js                    # i18next configuration
    └── locales/
        ├── en.json                 # English translations
        └── es.json                 # Spanish translations
```

### Key Concepts

- **Music theory constants** (`constants/music.js`): `STAFF_NOTES` maps positions 0–16 to notes G3–B5. `KEY_TO_NOTE` maps QWERTY rows to staff positions.
- **Staff geometry** (`constants/staff.js`): Fixed pixel values for staff rendering. `MEASURES_PER_LINE` controls horizontal layout.
- **SVG paths** (`constants/svgPaths.js`): All musical symbol paths embedded as data — no external image files needed.
- **Beat system** (`utils/music.js`): Notes have `startBeat` positions. `snapToGrid()` quantizes placement. Dotted notes multiply by 1.5, triplets by 2/3.
- **Playback** (`hooks/usePlayback.js`): Interval-based playhead advancing by sixteenth-note ticks. Triggers Tone.js synth per note.
- **Input handling** (in `App.js`): Keyboard shortcuts for all actions. Pointer events convert coordinates via `yToPos()`. Ghost note previews on hover.

### Deployment

The `npm run deploy` script builds and outputs to `/docs` for GitHub Pages (Settings > Pages > Deploy from branch > /docs folder).
