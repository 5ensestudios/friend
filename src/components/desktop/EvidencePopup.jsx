import { useState, useEffect } from "react";
import "../../styles/components/evidencePopup.css";

export default function EvidencePopup({ onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  function handleDismiss() {
    setExiting(true);
    setTimeout(() => onDismiss(), 400);
  }

  return (
    <div className={`evidence-popup-overlay${visible ? " visible" : ""}${exiting ? " exiting" : ""}`} onClick={handleDismiss}>
      <div className={`evidence-popup${visible ? " visible" : ""}${exiting ? " exiting" : ""}`} onClick={e => e.stopPropagation()}>
        <div className="evidence-popup-icon">🔓</div>
        <div className="evidence-popup-content">
          <h3 className="evidence-popup-title">EVIDENCE UNLOCKED</h3>
          <p className="evidence-popup-text">
            New evidence files have been added to your desktop. Review the evidence archive before proceeding to Act III.
          </p>
        </div>
        <button className="evidence-popup-btn" onClick={handleDismiss}>
          UNDERSTOOD
        </button>
      </div>
    </div>
  );
}
