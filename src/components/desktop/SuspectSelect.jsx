import { useState } from "react";
import { useSound } from "../../hooks/useSound";
import "../../styles/components/suspectSelect.css";

const SUSPECTS = [
  { id: "louis", name: "Louis", role: "", img: "/Images/Louis Card.png" },
  { id: "may", name: "May", role: "", img: "/Images/May Card.png" },
  { id: "johnny", name: "Johnny", role: "", img: "/Images/Johnny Card.png" },
  { id: "richard", name: "Richard", role: "", img: "/Images/Richie Card.png" },
];

export default function SuspectSelect({ onSelect, variant = "default" }) {
  const [confirming, setConfirming] = useState(false);
  const { play } = useSound();

  function handleSelect(id) {
    if (confirming) return;
    play("click");
    setConfirming(true);
    setTimeout(() => onSelect(id), 420);
  }

  return (
    <div className={`suspect-select-overlay${variant === "act3" ? " suspect-select-overlay--act3" : ""}${confirming ? " confirming" : ""}`} role="dialog" aria-label="Act 3 character selection">
      <div className="suspect-select-content">
        <div className="suspect-select-grid">
          {SUSPECTS.map(s => (
            <button
              key={s.id}
              className="suspect-select-card"
              onClick={() => handleSelect(s.id)}
              onMouseEnter={() => play("scene_hover")}
              disabled={confirming}
            >
              <img src={s.img} alt={s.name} className="suspect-card-img" />
              <div className="suspect-card-info">
                <strong>{s.name}</strong>
                <span>{s.role}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
