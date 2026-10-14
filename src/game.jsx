import { useMemo, useState } from "react";
import "./game.css";
import { chopinPieces, getRandomPiece } from "./chopinPieces.js";

const accidentalSymbols = { b: "♭", "#": "♯" };
const MAX_SUGGESTIONS = 10;

function formatTitle(piece) {
  const opus = typeof piece.opus === "number" ? `Op. ${piece.opus}` : piece.opus;
  const number = piece.number != null ? `, No. ${piece.number}` : "";
  return `${piece.type}, ${opus}${number}`;
}

function formatKey(piece) {
  const accidental = accidentalSymbols[piece.accidental] ?? "";
  return `${piece.key}${accidental} ${piece.modality}`;
}

// Autocompletes searches for pieces
function searchText(piece) {
  const accidentalWords = { b: "flat b", "#": "sharp #" };
  const key = piece.key.toLowerCase();
  const accidental = piece.accidental ?? "";
  return [
    `${key}${accidental}`,
    accidentalSymbols[piece.accidental] ? `${key}${accidentalSymbols[piece.accidental]}` : "",
    piece.type,
    piece.opus,
    piece.number != null ? `no ${piece.number} number ${piece.number}` : "",
    "op opus",
    piece.key,
    accidentalWords[piece.accidental] ?? "",
    piece.modality,
  ]
    .join(" ")
    .toLowerCase();
}

// Lower is better; null means no match. Every typed word must match; words
// matching at the start of a field word or the title rank higher.
function scorePiece(piece, text, query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;
  const title = formatTitle(piece).toLowerCase();
  const fieldWords = text.split(/\s+/);
  let score = 0;
  for (const word of words) {
    if (title.startsWith(word)) score += 0;
    else if (fieldWords.some((w) => w.startsWith(word))) score += 1;
    else if (text.includes(word)) score += 3;
    else return null;
  }
  return score;
}

const indexed = chopinPieces.map((piece) => ({ piece, text: searchText(piece) }));

function getSuggestions(query) {
  return indexed
    .map(({ piece, text }) => ({ piece, score: scorePiece(piece, text, query) }))
    .filter((r) => r.score !== null)
    .sort((a, b) => a.score - b.score)
    .slice(0, MAX_SUGGESTIONS)
    .map((r) => r.piece);
}

export default function RunGame() {
  const [guesses, setGuesses] = useState([]); // array of piece objects
  const [currentGuess, setCurrentGuess] = useState(null); // one piece object, or null
  const [piece, setPiece] = useState(null); // the answer: one piece object, or null
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);

  const suggestions = useMemo(() => getSuggestions(query), [query]);
  const showDropdown = open && query.trim() !== "";

  // The piece whose title exactly matches what's in the input box (or undefined)
  const typedPiece = useMemo(
    () =>
      chopinPieces.find(
        (p) => formatTitle(p).toLowerCase() === query.trim().toLowerCase()
      ),
    [query]
  );

  function choose(chosen) {
    setCurrentGuess(chosen);
    setGuesses((prev) => [...prev, chosen]);
    setQuery("");
    setOpen(false);
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showDropdown && suggestions[highlighted]) {
        setQuery(formatTitle(suggestions[highlighted]));
        setOpen(false);
      } else if (typedPiece) {
        choose(typedPiece);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="game">
      <h1>Chopindle</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Type any Chopin piece"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlighted(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="piece-suggestions"
          aria-autocomplete="list"
        />
        {showDropdown && (
          <ul id="piece-suggestions" className="suggestions" role="listbox">
            {suggestions.length === 0 && <li className="no-results">No matching pieces</li>}
            {suggestions.map((s, i) => (
              <li
                key={`${s.type}-${s.opus}-${s.number}-${s.key}${s.accidental ?? ""}`}
                role="option"
                aria-selected={i === highlighted}
                className={i === highlighted ? "active" : ""}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setQuery(formatTitle(s));
                  setOpen(false);
                }}
                onMouseEnter={() => setHighlighted(i)}
              >
                <span>{formatTitle(s)}</span>
                <span className="suggestion-key">{formatKey(s)}</span>
              </li>
            ))}
          </ul>
        )}
        <button
          className="enter-button"
          onClick={() => choose(typedPiece)}
          disabled={!typedPiece}
        >
          Enter
        </button>
      </div>

      <button
        className="random-button"
        onClick={() => {
          const random = getRandomPiece();
          setPiece(random);
          setQuery("");
          setOpen(false);
        }}
      >
        Get Random Piece
      </button>

      {piece && (
        <div className="piece-card">
          <h2>{formatTitle(piece)}</h2>
          <dl>
            <dt>Type</dt>
            <dd>{piece.type}</dd>
            <dt>Opus</dt>
            <dd>{piece.opus}</dd>
            <dt>Number</dt>
            <dd>{piece.number ?? "—"}</dd>
            <dt>Key</dt>
            <dd>{formatKey(piece)}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}