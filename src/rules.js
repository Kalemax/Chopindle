// Edit the text of the "How to Play" popup here.

export const rulesTitle = "How to Play";

// Shown as a numbered list.
export const rulesSteps = [
  "Click \"Get Random Piece\" to start a new game.",
  "Type the name of any Chopin piece in the search box.",
  "Use the arrow keys to move through suggestions and press Enter to select one.",
  "Click \"Enter\" (or press Enter again) to submit your guess.",
  "Keep guessing until you find the correct piece!",
  "Click \"Clear Guesses\" at any time to start over.",
];

// The color key. `color` must be "green", "yellow" or "gray".
export const rulesColors = [
  { color: "green", label: "Correct" },
  { color: "yellow", label: "Close (e.g. within 10 opus numbers, or one letter off in the key)" },
  { color: "gray", label: "Incorrect" },
];

export const rulesFooter = "Good luck!";
