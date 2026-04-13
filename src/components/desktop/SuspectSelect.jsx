import { useState } from "react";
import "../../styles/components/suspectSelect.css";

const SUSPECTS = [
  { id: "louis", name: "Louis", img: "/Images/Louis Card.png" },
  { id: "may", name: "May", img: "/Images/May Card.png" },
  { id: "johnny", name: "Johnny", img: "/Images/Johnny Card.png" },
  { id: "richard", name: "Richard", img: "/Images/Richie Card.png" },
];

export default function SuspectSelect({ onSelect, onCancel }) {
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);

  function handleConfirm() {
    if (!selected) return;
    setConfirming(true);
    setTimeout(() => onSelect(selected), 600);
  }

  return (
    <div className={`suspect-select-overlay${confirming ? " confirming" : ""}`}>
      <div className="suspect-select-panel">
        <h2 className="suspect-select-title">WHO IS GUILTY?</h2>
        <p className="suspect-select-subtitle">Select who you believe is responsible for Chris's death.</p>

        <div className="suspect-cards">
          {SUSPECTS.map(s => (
            <button
              key={s.id}
              className={`suspect-card${selected === s.id ? " selected" : ""}`}
              onClick={() => setSelected(s.id)}
            >
              <div className="suspect-card-inner">
                <img src={s.img} alt={s.name} />
              </div>
              <span className="suspect-card-name">{s.name}</span>
            </button>
          ))}
        </div>

        <div className="suspect-select-actions">
          <button className="suspect-cancel-btn" onClick={onCancel}>GO BACK</button>
          <button
            className={`suspect-confirm-btn${selected ? " enabled" : ""}`}
            onClick={handleConfirm}
            disabled={!selected}
          >
            CONFIRM ACCUSATION
          </button>
        </div>
      </div>
    </div>
  );
}
