import { useState } from "react";
import "../../styles/components/caseDocument.css";

const CASE_FILE_SOURCES = [
  "/Images/Case File.png",
  "/Images/Case%20File.png",
  "/images/Case File.png",
  "/images/Case%20File.png",
];

export default function CaseDocument({ onClose }) {
  const [closing, setClosing] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);

  function handleClose() {
    setClosing(true);
    setTimeout(() => onClose(), 350);
  }

  return (
    <div className={`case-doc-overlay${closing ? " closing" : ""}`} onClick={handleClose}>
      <div className={`case-doc-paper${closing ? " closing" : ""}`} onClick={e => e.stopPropagation()}>
        <div className="case-doc-image-wrap">
          {sourceIndex < CASE_FILE_SOURCES.length ? (
            <img
              src={CASE_FILE_SOURCES[sourceIndex]}
              alt="Case File"
              className="case-doc-image"
              onError={() => {
                setSourceIndex(prev => Math.min(prev + 1, CASE_FILE_SOURCES.length));
              }}
            />
          ) : (
            <p className="case-doc-image-fallback">Unable to load case file image.</p>
          )}
          <button className="case-doc-close" onClick={handleClose} aria-label="Close case file">✕</button>
        </div>
      </div>
    </div>
  );
}
