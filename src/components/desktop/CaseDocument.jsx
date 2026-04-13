import { useState } from "react";
import "../../styles/components/caseDocument.css";

export default function CaseDocument({ onClose }) {
  const [closing, setClosing] = useState(false);

  function handleClose() {
    setClosing(true);
    setTimeout(() => onClose(), 350);
  }

  return (
    <div className={`case-doc-overlay${closing ? " closing" : ""}`} onClick={handleClose}>
      <div className={`case-doc-paper${closing ? " closing" : ""}`} onClick={e => e.stopPropagation()}>
        <button className="case-doc-close" onClick={handleClose}>✕</button>

        <div className="case-doc-header">
          <div className="case-doc-stamp">CONFIDENTIAL</div>
          <h1 className="case-doc-title">INCIDENT REPORT</h1>
          <div className="case-doc-meta">
            <span>Case No. 2016-0307-FR</span>
            <span>Date: March 7, 2016</span>
          </div>
          <div className="case-doc-meta">
            <span>Classification: HOMICIDE — PENDING</span>
          </div>
          <hr className="case-doc-divider" />
        </div>

        <div className="case-doc-body">
          <div className="case-doc-section">
            <h3>INCIDENT</h3>
            <p>Fatal Respiratory Failure / Acute Zolpidem Toxicity</p>
          </div>

          <div className="case-doc-section">
            <h3>SUMMARY</h3>
            <p>
              At 02:14 AM, emergency services responded to a 911 call from a residential
              gathering. Upon arrival, paramedics found the victim, <strong>Chris</strong>,
              unresponsive. Four individuals were found at the scene, their clothes stained
              with spilled soda and their stories perfectly aligned.
            </p>
            <p>
              They call it a prank — a harmless attempt to get back at a "friend". The
              toxicology report suggests otherwise. Two pills are a prank. Six pills are
              a statement.
            </p>
          </div>

          <div className="case-doc-section">
            <h3>PERSONS OF INTEREST</h3>
            <ul>
              <li><strong>Louis</strong> </li>
              <li><strong>May</strong> </li>
              <li><strong>Johnny</strong> </li>
              <li><strong>Richard</strong> </li>
            </ul>
          </div>

          <div className="case-doc-section">
            <h3>EVIDENCE</h3>
            <p>
              Footage has been recovered from the scene. Cloud data has been
              extracted and archived for review. All four suspects have agreed
              to sit for formal interviews.
            </p>
          </div>

          <div className="case-doc-section">
            <h3>DIRECTIVE</h3>
            <p>
              Interview each suspect across three acts. In each round, you may
              only choose two of the four to question. Listen carefully —
              contradictions reveal motive, and motive reveals guilt.
            </p>
            <p>
              Determine who among them intended for Chris to die.
            </p>
          </div>
        </div>

        <div className="case-doc-footer">
          <div className="case-doc-footer-line" />
          <span>CLASSIFIED DOCUMENT</span>
        </div>
      </div>
    </div>
  );
}
