import { useState, useEffect, useRef } from "react";
import { useSound } from "../hooks/useSound";
import "../styles/pages/mainMenu.css";

export default function MainMenu({ onStartIntro, onContinue, onTutorial, currentUserEmail = "" }) {
  const [selectedOption, setSelectedOption] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const audioRef = useRef(null);
  const { play } = useSound();

  useEffect(() => {
    const audio = new Audio("/sound/Friend%20Soundtrack.mp3");
    audio.loop = true;
    audio.volume = 0.05;
    audioRef.current = audio;

    const timer = setTimeout(() => {
      audio.play().catch(() => {});
    }, 2000);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const options = [
    { label: "NEW GAME", action: "new_game", disabled: false },
    { label: "CONTINUE", action: "continue", disabled: false },
    { label: "HOW TO PLAY", action: "tutorial", disabled: false },
    { label: "EXIT", action: "exit", disabled: false },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isStarting) return;

      if (showNewGameModal) {
        if (e.key === "Escape") {
          play("click");
          setShowNewGameModal(false);
        }

        if (e.key === "Enter") {
          handleConfirmNewGame();
        }

        return;
      }

      if (e.key === "ArrowUp") {
        play("hover");
        setSelectedOption((prev) =>
          prev === 0 ? options.length - 1 : prev - 1
        );
      }

      if (e.key === "ArrowDown") {
        play("hover");
        setSelectedOption((prev) =>
          prev === options.length - 1 ? 0 : prev + 1
        );
      }

      if (e.key === "Enter") {
        const action = options[selectedOption]?.action;
        if (action) handleSelectOption(action);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedOption, isStarting, play, showNewGameModal]);

  function handleConfirmNewGame() {
    play("click");
    play("radioSiren", { volume: 0.8 });
    setShowNewGameModal(false);
    setIsStarting(true);
    setTimeout(() => onStartIntro(), 500);
  }

  function handleSelectOption(action) {
    play("click");

    if (action === "new_game") {
      setShowNewGameModal(true);
    }

    if (action === "continue") {
      setIsStarting(true);
      setTimeout(() => onContinue(), 500);
    }

    if (action === "tutorial") {
      setIsStarting(true);
      setTimeout(() => onTutorial?.(), 500);
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
          <img
            src="/Images/The Friend Logo.png"
            alt="THE FRIEND"
            className="title-logo"
          />
        </div>

        <div className="menu-options">
          {options.map((option, idx) => (
            <button
              key={idx}
              className={`menu-option ${
                selectedOption === idx ? "selected" : ""
              } ${option.disabled ? "disabled" : ""}`}
              onClick={() => handleSelectOption(option.action)}
              onMouseEnter={() => {
                play("hover");
                setSelectedOption(idx);
              }}
              disabled={option.disabled}
            >
              <span className="option-text">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="menu-footer">
          <p>© 2026 5ENSE STUDIOS. All rights reserved.</p>
        </div>
      </div>

      {showNewGameModal && (
        <div className="menu-modal-overlay" onClick={() => setShowNewGameModal(false)}>
          <div className="menu-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <h2 className="menu-modal-title">Start new game?</h2>
            <p className="menu-modal-copy">
              The current account linked and its progress will be deleted.
            </p>
            {currentUserEmail && <p className="menu-modal-user">{currentUserEmail}</p>}

            <div className="menu-modal-actions">
              <button type="button" className="menu-modal-btn" onClick={() => setShowNewGameModal(false)}>
                CANCEL
              </button>
              <button type="button" className="menu-modal-btn menu-modal-btn--danger" onClick={handleConfirmNewGame}>
                DELETE & CONTINUE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}