# Chopindle

A Wordle-style guessing game for the piano music of Frédéric Chopin. A mystery piece is picked at random, and you guess Chopin pieces until you find it. Every guess is color-coded to show how close you are. Once you solve it, you can listen to the piece right in the page.

Built with [React](https://react.dev/) and [Vite](https://vite.dev/).

## How to play

1. A mystery Chopin piece is picked when the page loads.
2. Start typing any Chopin piece in the search box, for example `nocturne 9 2`, `ballade`, `etude 10` or `c# minor`. A dropdown shows the 10 best matches.
3. Click a suggestion, or use <kbd>↑</kbd>/<kbd>↓</kbd> and <kbd>Enter</kbd> to select one, then press **Enter** to submit the guess.
4. Use the colors to narrow it down until you find the piece.
5. When you solve it, an embedded YouTube performance of the piece appears. Click **Play again** for a new round.

Click **How to Play** in the top-left corner at any time to see the rules.

### What the colors mean

Each guess is split into parts: **type**, **opus**, **number**, **key**, **accidental** and **modality** (major/minor). Each part is colored on its own:

| Color | Meaning |
| --- | --- |
| 🟩 Green | Correct |
| 🟨 Yellow | Close: the opus is within 10 of the answer, the guess and the answer both have a number but it's the wrong one, the key letter is one letter off (wrapping from G to A), or both have an accidental but it's the wrong one |
| ⬜ Gray | Incorrect |

You win when **every** part of your guess matches the answer.

**Example:** if the answer is *Nocturne Op. 32 No. 2 in A♭ major* and you guess *Nocturne Op. 15 No. 2 in F♯ major*:

| Nocturne | Op. 15 | No. 2 | F | ♯ | major |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 🟩 | ⬜ | 🟩 | ⬜ | 🟨 | 🟩 |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18, 20 or 22+
- npm (comes with Node.js)

### Installation

```bash
git clone https://github.com/Kalemax/Chopindle.git
cd Chopindle
npm install
```

### Run it locally

```bash
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

### Other scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server with hot reloading |
| `npm run build` | Builds an optimized production version into `dist/` |
| `npm run preview` | Serves the production build locally to check it |
| `npm run lint` | Lints the code with [oxlint](https://oxc.rs/docs/guide/usage/linter) |

## Project structure

```
Chopindle/
├── index.html           # Page shell that loads the app
├── public/              # Static files (favicon, icons)
└── src/
    ├── main.jsx         # Entry point: mounts the app
    ├── game.jsx         # The game: search, guesses, color logic, solved card
    ├── HowToPlay.jsx    # "How to Play" button and rules popup
    ├── rules.js         # Text of the rules popup (edit the rules here)
    ├── chopinPieces.js  # The list of pieces and random piece picker
    ├── game.css         # Game styles
    └── index.css        # Global styles and color variables
```

## Customizing

### Adding or editing pieces

Every piece lives in [`src/chopinPieces.js`](src/chopinPieces.js) as one object:

```js
{ type: "Nocturne", opus: 9, number: 2, key: "E", accidental: "b", modality: "major", youtube: "https://www.youtube.com/watch?v=9E6b3swbnWg" },
```

| Field | Description |
| --- | --- |
| `type` | Kind of piece, e.g. `"Nocturne"`, `"Etude"`, `"Ballade"` |
| `opus` | Opus number, or `"Posth."` for posthumous works |
| `number` | Number within the opus, or `null` if there isn't one |
| `key` | Key letter, `"A"` through `"G"` |
| `accidental` | `"b"` (flat), `"#"` (sharp) or `null` |
| `modality` | `"major"` or `"minor"` |
| `youtube` | Link to a performance of only this piece, shown when the puzzle is solved |

New pieces show up in the search and can be picked as answers automatically.

### Editing the rules popup

All the text in the **How to Play** popup is in [`src/rules.js`](src/rules.js): the steps, the color explanations and the example guess. Change the text there; you don't need to touch any UI code.

### Changing the colors

The button and outline accent color is the `--accent` variable at the top of [`src/index.css`](src/index.css), with a separate value for dark mode. The green/yellow/gray guess colors are the `.guessComponent` rules in [`src/game.css`](src/game.css).

## Troubleshooting

### `Cannot resolve entry module ... vite.config.js` on Windows

Windows **Smart App Control** can block the native binaries some build tools ship with. This project uses Vite 6 and points Rollup at its WebAssembly build (`@rollup/wasm-node`, set in the `overrides` field of `package.json`) so it runs even with Smart App Control on. If you see this error, delete `node_modules` and `package-lock.json` and run `npm install` again so the override is applied.

### Port 5173 is already in use

Vite picks the next free port (5174, 5175, …) automatically. Use the URL it prints in the terminal.

## Acknowledgments

- Inspired by [Wordle](https://www.nytimes.com/games/wordle/index.html).
- The performances are the work of the pianists and channels linked in `chopinPieces.js`. Videos are embedded with YouTube's standard player.
