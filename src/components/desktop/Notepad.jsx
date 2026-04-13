import { useState, useEffect } from "react";
import "../../styles/components/notepad.css";

export default function Notepad({ onClose, onDragMouseDown }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("friEND_notes");
    if (saved) setText(saved);
  }, []);

  function handleChange(e) {
    const value = e.target.value;
    setText(value);
    localStorage.setItem("friEND_notes", value);
  }

  return (
    <div className="notepad-window">
      <div className="notepad-header">
        <div className="notepad-title-bar" onMouseDown={onDragMouseDown} style={{ cursor: "grab" }}>
          <span className="notepad-title-icon">📝</span>
          <span className="notepad-title">Detective Notes - Notepad</span>
        </div>
        <div className="notepad-controls">
          <button className="notepad-btn notepad-minimize">─</button>
          <button className="notepad-btn notepad-maximize">□</button>
          <button className="notepad-btn notepad-close" onClick={onClose}>✕</button>
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
          placeholder="Write your investigation notes here..."
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
