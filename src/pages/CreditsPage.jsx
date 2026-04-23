import { useEffect, useState } from "react";
import "../styles/pages/creditsPage.css";
import { useSound } from "../hooks/useSound";

const CREDITS = [
  ["Eana Mae Tagana", "Game Director, Visual Designer, & Writer"],
  ["Frederick Arago", "Media Producer & Post-Production Lead"],
  ["Nathan Bartolo", "Lead Developer & Sound Designer"],
  ["John Richard Roble", "Production Assistant & Audio Support"],
  ["Christian Darrel Tan", "Production Assistant & Development Support"],
];

export default function CreditsPage({ onBack }) {
  const { play } = useSound(); 

  const [isLeaving, setIsLeaving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  function handleBack() {
    if (isLeaving) return;

    setIsLeaving(true);
    setTimeout(() => onBack?.(), 500);
  }

  return (
    <div
      className={`credits-page ${
        isVisible ? "credits-page--visible" : ""
      } ${isLeaving ? "credits-page--leaving" : ""}`}
      role="dialog"
      aria-label="Credits"
    >
      <div className="credits-page-title-wrap">
        <h1 className="credits-page-title">Credits</h1>
      </div>

      <div className="credits-page-grid" role="group" aria-label="Credits list">
        {CREDITS.map(([name, role]) => (
          <div key={name} className="credits-page-row">
            <p className="credits-page-name">{name}</p>
            <p className="credits-page-role">{role}</p>
          </div>
        ))}
      </div>

      <button
        className="credits-page-back tutorial-back"
        type="button"
        onClick={() => {
          play("click_desktop"); // ✅ SFX
          handleBack();
        }}
      >
        BACK
      </button>
    </div>
  );
}