import { useState, useEffect } from "react";
import "../styles/pages/mainMenu.css";

export default function MainMenu({ onNewGame, onContinue, hasSaveData }) {
  const [selectedOption, setSelectedOption] = useState(0);
  const [isStarting, setIsStarting] = useState(false);

  const options = [
    { label: "NEW GAME", action: "new_game", disabled: false },
    { label: "CONTINUE", action: "continue", disabled: !hasSaveData },
    { label: "EXIT", action: "exit", disabled: false },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        setSelectedOption((prev) => (prev === 0 ? options.length - 1 : prev - 1));
      }
      if (e.key === "ArrowDown") {
        setSelectedOption((prev) => (prev === options.length - 1 ? 0 : prev + 1));
      }
      if (e.key === "Enter") {
        handleSelectOption(options[selectedOption].action);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedOption, options]);

  function handleSelectOption(action) {
    if (action === "new_game") {
      setIsStarting(true);
      setTimeout(() => onNewGame(), 500);
    }
    if (action === "continue") {
      setIsStarting(true);
      setTimeout(() => onContinue(), 500);
    }
    if (action === "exit") {
      alert("Thank you for playing THE FRIEND.");
    }
  }

  return (
    <div className={`main-menu ${isStarting ? "fade-out" : ""}`}>
      <div className="menu-background">
        <div className="menu-background-overlay"></div>
      </div>

      <div className="menu-container">
        <div className="menu-title">
          <div className="title-main">THE FRIEND</div>
          <div className="title-subtitle">CASE FILE #2016-0307-CHRIS</div>
          <div className="title-date">March 7, 2016</div>
        </div>

        <div className="menu-description">
          <p>
            At 02:14 AM, emergency services responded to a 911 call. Upon
            arrival, they found the victim, Chris, unresponsive.
          </p>
          <p>
            The footage has been recovered. The cloud data is yours to navigate.
          </p>
        </div>

        <div className="menu-options">
          {options.map((option, idx) => (
            <button
              key={idx}
              className={`menu-option ${selectedOption === idx ? "selected" : ""} ${
                option.disabled ? "disabled" : ""
              }`}
              onClick={() => handleSelectOption(option.action)}
              disabled={option.disabled}
            >
              <span className="option-indicator">
                {selectedOption === idx ? "▶" : "  "}
              </span>
              <span className="option-text">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="menu-footer">
          <p>An interactive narrative experience</p>
          <p className="menu-version">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}