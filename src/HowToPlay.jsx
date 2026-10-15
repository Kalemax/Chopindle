import { useEffect, useState } from "react";
import { rulesColors, rulesFooter, rulesSteps, rulesTitle } from "./rules.js";

export default function HowToPlay() {
  const [open, setOpen] = useState(false);

  // Close the popup with the Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button className="how-to-play-button" onClick={() => setOpen(true)}>
        <span className="how-to-play-icon" aria-hidden="true">?</span>
        How to Play
      </button>

      {open && (
        // Clicking the dimmed backdrop closes the popup; clicks inside it don't
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rules-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
            <h2 id="rules-title">{rulesTitle}</h2>

            <ol className="rules-steps">
              {rulesSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <ul className="rules-colors">
              {rulesColors.map(({ color, label }) => (
                <li key={color}>
                  <span className={`rules-swatch guessComponent ${color}`} />
                  {label}
                </li>
              ))}
            </ul>

            <p className="rules-footer">{rulesFooter}</p>
          </div>
        </div>
      )}
    </>
  );
}
