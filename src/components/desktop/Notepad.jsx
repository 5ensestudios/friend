import { useState, useEffect } from "react";
import { useSound } from "../../hooks/useSound";
import "../../styles/components/notepad.css";

export default function Notepad({
  onClose,
  onDragMouseDown,
  title = "Case Notes",
  iconSrc = "/icons/Notes.png",
  storageKey = "friEND_notes",
  initialText = "",
  placeholder = "Write anything you might find useful here...",
}) {
  const [text, setText] = useState("");
  const { play } = useSound();

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      setText(saved);
      return;
    }
    setText(initialText);
    localStorage.setItem(storageKey, initialText);
  }, [storageKey, initialText]);

  function handleChange(e) {
    const value = e.target.value;
    setText(value);
    localStorage.setItem(storageKey, value);
  }

  return (
    <div className="notepad-window">
      <div className="notepad-header">
        <div className="notepad-title-bar" onMouseDown={onDragMouseDown} style={{ cursor: "grab" }}>
          <span className="notepad-title-icon"><img src={iconSrc} alt="Notes" className="notepad-title-icon-img" /></span>
          <span className="notepad-title">{title}</span>
        </div>
        <div className="notepad-controls">
          <button className="notepad-btn notepad-minimize">─</button>
          <button className="notepad-btn notepad-maximize">□</button>
          <button
            className="notepad-btn notepad-close"
            onClick={() => {
              play("click_desktop");
              onClose();
            }}
          >
            ✕
          </button>
        </div>
      </div>
      <div className="notepad-menubar">
        <span className="notepad-menu-item">File</span>
        <span className="notepad-menu-item">Edit</span>
        <span className="notepad-menu-item">Format</span>
        <span className="notepad-menu-item">View</span>
        <span className="notepad-menu-item">Help</span>
      </div>
      <div className="notepad-body">
        <textarea
          className="notepad-textarea"
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          spellCheck={false}
        />
      </div>
      <div className="notepad-statusbar">
        <span>Ln 1, Col 1</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
