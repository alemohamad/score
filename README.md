# 𝄞 Pentagram — Clave de Sol

Interactive treble clef staff editor with playback. Supports keyboard, mouse, touch, and Apple Pencil.

Editor de pentagrama interactivo en Clave de Sol con reproduccion. Compatible con teclado, raton, tactil y Apple Pencil.

## Features

- Place notes on a treble clef staff (G3 to B5)
- Note durations: whole, half, quarter, eighth, sixteenth
- Modifiers: dotted notes, triplets, sharps, flats, naturals
- Rests for all durations
- Automatic note beaming (eighths and sixteenths)
- Time signatures: 4/4, 3/4, 2/4
- Repeat signs on any bar line
- Playback with adjustable tempo (40–240 BPM)
- Mute toggle and note label visibility toggle
- Two notation systems: Solfeo (Do Re Mi) / Letter (A B C)
- Two languages: Spanish / English
- Export notes to clipboard as JSON

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in the browser.

## Keyboard Shortcuts

### Notes

| Key | Notes |
|-----|-------|
| `Q W E R T Y U` | G3 A3 B3 C4 D4 E4 F4 |
| `A S D F G H J` | G4 A4 B4 C5 D5 E5 F5 |
| `Z X C` | G5 A5 B5 |

### Duration

| Key | Duration |
|-----|----------|
| `1` | Whole (Redonda) |
| `2` | Half (Blanca) |
| `3` | Quarter (Negra) |
| `4` | Eighth (Corchea) |
| `5` | Sixteenth (Semicorchea) |

### Modifiers

| Key | Action |
|-----|--------|
| `#` | Sharp |
| `B` | Flat |
| `N` | Natural |
| `.` | Dotted |
| `T` | Triplet |
| `Space` | Rest |
| `Backspace` | Delete last or selected note |
| `Escape` | Deselect |
| `0` | Toggle Solfeo / Letter notation |
| `- / +` | Cycle time signatures |

### Mouse / Touch / Apple Pencil

- **Hover** over the staff to preview the note (blue ghost)
- **Click / Tap** on the staff to place a note
- **Click** on a placed note to select it
- **Click** on a bar line to cycle repeat signs

## Deploy to GitHub Pages

```bash
npm run deploy
```

This builds the project and outputs to the `/docs` folder. Then in your GitHub repo, go to **Settings > Pages** and set the source to **Deploy from a branch**, branch **main**, folder **/docs**.

## Tech Stack

- [React 18](https://react.dev/) — UI framework
- [Tone.js](https://tonejs.github.io/) — Audio synthesis and playback
- [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) — Internationalization
- [Create React App](https://create-react-app.dev/) — Build tooling
