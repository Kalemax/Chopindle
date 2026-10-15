// Edit the text of the "How to Play" popup here.

export const rulesTitle = "How to Play";

// Shown as a numbered list.
export const rulesSteps = [
  "A mystery Chopin piece is picked when the page loads.",
  "Search for a piece, pick a suggestion, and press Enter to guess.",
  "Use the colors to narrow it down until you find it.",
  "Solve it to listen, then click \"Play again\" for a new round.",
];

// The color key, shown under `rulesColorsTitle`.
// `color` must be "green", "yellow" or "gray". `details` (optional) is shown as a bullet list.
export const rulesColorsTitle = "What the colors mean";

export const rulesColors = [
  { color: "gray", name: "Gray", label: "Incorrect" },
  {
    color: "yellow",
    name: "Yellow",
    label: "Close:",
    details: [
      "Opus within 10",
      "Wrong number",
      "Key one letter off",
      "Wrong accidental",
    ],
  },
  { color: "green", name: "Green", label: "Correct" },
];

// A sample guess shown as mini tiles. Tiles without a `color` are plain text (like "in").
export const rulesExampleTitle = "Example";

export const rulesExample = {
  guess: [
    { text: "Nocturne", color: "green" },
    { text: "Op. 15", color: "gray" },
    { text: "No. 2", color: "green" },
    { text: "in" },
    { text: "F", color: "gray" },
    { text: "♯", color: "yellow" },
    { text: "major", color: "green" },
  ],
  note: "The answer is a Nocturne No. 2 in a major key. It has an accidental, just not ♯. The opus and key letter are off.",
};

export const rulesFooter = "Good luck!";
