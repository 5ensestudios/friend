import { useState, useEffect } from "react";
import { useSound } from "../../hooks/useSound";
import "../../styles/components/caseDocument.css";

export default function CaseDocument({ onClose }) {
  const [closing, setClosing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { play } = useSound();

  // Add cache-bust query parameter to force fresh load every time
  const CASE_FILE_SRC = `/Images/Case File.png?v=${Date.now()}`;

  function handleClose() {
    play("click_desktop");
    setClosing(true);
    setTimeout(() => onClose(), 350);
  }

  useEffect(() => {
    // Reset loading state when component mounts
    setImageLoaded(false);
  }, []);

  return (
    <div className={`case-doc-overlay${closing ? " closing" : ""}`} onClick={handleClose}>
      <div className={`case-doc-paper${closing ? " closing" : ""}`} onClick={e => e.stopPropagation()}>
        <div className="case-doc-image-wrap">
          {!imageLoaded && <div className="case-doc-loading"></div>}
          <img
            src={CASE_FILE_SRC}
            alt="Case File"
            className={`case-doc-image${imageLoaded ? " loaded" : ""}`}
            loading="eager"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          <button className="case-doc-close" onClick={handleClose} aria-label="Close case file">✕</button>
        </div>
      </div>
    </div>
  );
}
