import { useState, useEffect } from "react";
import { useSound } from "../hooks/useSound";
import "../styles/pages/mainMenu.css";

export default function MainMenu({ onStartIntro, onContinue, onTutorial, onCredits, currentUserEmail = "" }) {
  const [selectedOption, setSelectedOption] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const { play } = useSound();

  const options = [
    { label: "CONTINUE", action: "continue", disabled: false },
    { label: "NEW GAME", action: "new_game", disabled: false },
    { label: "HOW TO PLAY", action: "tutorial", disabled: false },
    { label: "CREDITS", action: "credits", disabled: false },
    { label: "EXIT", action: "exit", disabled: false },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isStarting) return;

      if (showNewGameModal) {
        if (e.key === "Escape") {
          play("click_game");
          setShowNewGameModal(false);
        }

        if (e.key === "Enter") {
          handleConfirmNewGame();
        }

        return;
      }

      if (showExitModal) {
        if (e.key === "Escape" || e.key === "Enter") {
          play("click_game");
          setShowExitModal(false);
        }

        return;
      }

      if (e.key === "ArrowUp") {
        play("scene_hover");
        setSelectedOption((prev) =>
          prev === 0 ? options.length - 1 : prev - 1
        );
      }

      if (e.key === "ArrowDown") {
        play("scene_hover");
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
  }, [selectedOption, isStarting, play, showExitModal, showNewGameModal]);

  function handleConfirmNewGame() {
    play("click_game");
    play("radioSiren", { volume: 0.8 });
    setShowNewGameModal(false);
    setIsStarting(true);
    setTimeout(() => onStartIntro(), 500);
  }

  function handleSelectOption(action) {
    play("click_game");

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

    if (action === "credits") {
      setIsStarting(true);
      setTimeout(() => onCredits?.(), 500);
    }

    if (action === "exit") {
      setShowExitModal(true);
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
                play("scene_hover");
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

      {showExitModal && (
        <div className="menu-modal-overlay" onClick={() => setShowExitModal(false)}>
          <div className="menu-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <h2 className="menu-modal-title">SYSTEM NOTICE:</h2>
            <p className="menu-modal-copy">Session has been terminated. No further input will be processed.</p>
            <div className="menu-modal-actions">
              <button
                type="button"
                className="menu-modal-btn"
                onClick={() => {
                  play("click_game");
                  setShowExitModal(false);
                }}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}