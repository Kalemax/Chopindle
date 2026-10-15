import { useMemo, useState } from "react";
import "./game.css";
import { chopinPieces, getRandomPiece } from "./chopinPieces.js";
import HowToPlay from "./HowToPlay.jsx";

const accidentalSymbols = { b: "♭", "#": "♯" };
const MAX_SUGGESTIONS = 10;
const MAX_GUESSES = 6;
const MAX_OPUS_DIFF = 10; // for yellow status

function formatTitle(piece) {
  const opus = typeof piece.opus === "number" ? `Op. ${piece.opus}` : piece.opus;
  const number = piece.number != null ? ` No. ${piece.number}` : "";
  return `${piece.type} ${opus}${number} in ${formatKey(piece)}`;
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

//Assigns a status for each portion of a guess to determine its color
function status(isMatch, isPartial = false) {
  if (isMatch) return "green";
  if (isPartial) return "yellow";
  return "gray";
}

// Pulls the video ID out of a "https://www.youtube.com/watch?v=ID" link
function youtubeId(url) {
  return new URL(url).searchParams.get("v");
}

// A guess is correct when every component would be green. Number and
// accidental are compared too, since a guess without them hides those parts.
function isCorrectGuess(guess, answer) {
  return (
    guess.type === answer.type &&
    guess.opus === answer.opus &&
    guess.number === answer.number &&
    guess.key === answer.key &&
    guess.accidental === answer.accidental &&
    guess.modality === answer.modality
  );
}

export default function RunGame() {
  const [guesses, setGuesses] = useState([]); // array of piece objects
  const [piece, setPiece] = useState(() => getRandomPiece()); // the answer, picked when the page loads
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

  // The card is revealed once any guess has every component green
  const solved = piece != null && guesses.some((g) => isCorrectGuess(g, piece));

  function choose(chosen) {
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
        <h1 className="title">Chopindle</h1>
      
      {/*Contains a how to play button that displays a pop up with rules*/}
      {/* Rules text lives in rules.js */}
        <HowToPlay />
        
        {/*Search bar for guessing pieces*/}
        <div className="search">
            <div className="search-row">
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
                {/* Disable the button if there's no typed piece or if the answer piece hasn't been set yet */}
                <button
                className="enter-button"
                onClick={() => choose(typedPiece)}
                disabled={!typedPiece || !piece} 
                >
                    Enter
                </button>
            </div>

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
                {formatTitle(s)}
              </li>
            ))}
          </ul>
        )}
      </div>

        <div className="guessCount">
            <p> Guesses: {guesses.length} / {MAX_GUESSES}</p>
        </div>

        {/* Displays the guesses*/}
        <div className="guesses">
            {guesses.length > 0 && (
                <div>
                    <ul>
                        {guesses.map((g, i) => (
                            <li className ={"guess"} key={i}>
                                {/*Green if correct, gray if wrong*/}
                                <span className={`guessComponent ${status(g.type === piece.type)}`}>{g.type}</span>
                                {/*Green if correct, yellow if within 10 opus numbers, gray if wrong*/}
                                <span className={`guessComponent ${status(g.opus === piece.opus, (typeof g.opus === "number" && typeof piece.opus === "number" && Math.abs(g.opus - piece.opus) <= MAX_OPUS_DIFF))}`}>
                                    {typeof g.opus === "number" ? `Op. ${g.opus}` : g.opus}
                                </span>
                                {/*Green if correct, yellow if a number is present but wrong, gray if wrong*/}
                                {g.number != null && (
                                    <span className={`guessComponent ${status(g.number === piece.number, g.number && piece.number)}`}>
                                        No. {g.number}
                                    </span>
                                )}
                                <span>in</span>
                                {/*Green if correct, yellow if within one letter of the correct key, gray if wrong*/}
                                <span className={`guessComponent ${status(g.key === piece.key, (Math.abs(g.key.charCodeAt(0) - piece.key.charCodeAt(0)) === 1 || Math.abs(g.key.charCodeAt(0) - piece.key.charCodeAt(0)) === 6))}`}>
                                    {g.key}
                                </span>
                                {/*Green if correct, yellow if an accidental is present but wrong, gray if wrong*/}
                                {g.accidental != null && (
                                    <span className={`guessComponent ${status(g.accidental === piece.accidental, g.accidental && piece.accidental)}`}>
                                        {accidentalSymbols[g.accidental]}
                                    </span>
                                )}
                                {/*Green if correct, gray if wrong*/}
                                <span className={`guessComponent ${status(g.modality === piece.modality)}`}>
                                    {g.modality}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>



        {solved && (
            <div className="piece-card">
                <h2 className="correct">Correct!</h2>
                <h2 className="piece-title">{formatTitle(piece)}</h2>
                {/* Embedded YouTube player so users can listen without leaving the tab */}
                <div className="video-embed">
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${youtubeId(piece.youtube)}`}
                        title={`${formatTitle(piece)} on YouTube`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                </div>
                <button
                    className="play-again-button"
                    onClick={() => {
                        const random = getRandomPiece();
                        setPiece(random);
                        setQuery("");
                        setOpen(false);
                        setGuesses([]);
                    }}
                >
                    Play again
                </button>
            </div>
        )}
    </div>
  );
}