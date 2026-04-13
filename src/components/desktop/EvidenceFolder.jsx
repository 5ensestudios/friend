import { useState } from "react";
import "../../styles/components/evidenceFolder.css";

const EVIDENCE_DATA = [
  {
    id: "louis",
    suspect: "Louis",
    items: [
      { id: "l1", name: "Text Messages — Louis & Chris", type: "Chat Log", description: "Recovered message thread between Louis and the victim. Messages suggest a deteriorating friendship." },
      { id: "l2", name: "Louis's Statement Inconsistency", type: "Report", description: "Contradictions found between Louis's Act 1 and Act 2 statements regarding his whereabouts." },
      { id: "l3", name: "Pharmacy Receipt", type: "Physical Evidence", description: "A receipt found in Louis's jacket pocket from a pharmacy dated two days before the incident." },
    ],
  },
  {
    id: "may",
    suspect: "May",
    items: [
      { id: "m1", name: "May's Phone Records", type: "Digital Evidence", description: "Call logs showing frequent late-night calls to an unknown number in the weeks before the incident." },
      { id: "m2", name: "Social Media Posts", type: "Digital Evidence", description: "Screenshots of deleted posts from May's account referencing 'making things right.'" },
      { id: "m3", name: "Witness Testimony — Bartender", type: "Testimony", description: "A bartender recalls seeing May alone at the bar earlier that evening, visibly distressed." },
    ],
  },
  {
    id: "johnny",
    suspect: "Johnny",
    items: [
      { id: "j1", name: "Johnny's Browser History", type: "Digital Evidence", description: "Search history recovered from Johnny's laptop includes searches about drug interactions." },
      { id: "j2", name: "Financial Records", type: "Report", description: "Bank statements showing Johnny owed Chris a significant amount of money." },
      { id: "j3", name: "Surveillance Footage — Hallway", type: "Video Evidence", description: "CCTV footage showing Johnny leaving the room briefly during the gathering." },
    ],
  },
  {
    id: "richard",
    suspect: "Richard",
    items: [
      { id: "r1", name: "Richard's Prescription", type: "Medical Record", description: "Medical records confirming Richard has a valid prescription for Zolpidem (sleeping pills)." },
      { id: "r2", name: "Handwritten Note", type: "Physical Evidence", description: "A crumpled note found in the trash reading: 'He doesn't deserve what he has.'" },
      { id: "r3", name: "Richard's Alibi Timeline", type: "Report", description: "Timeline reconstruction shows a 20-minute gap unaccounted for in Richard's version of events." },
    ],
  },
];

export default function EvidenceFolder({ onClose, onDragMouseDown }) {
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const activeSuspect = EVIDENCE_DATA.find(s => s.id === selectedSuspect);

  return (
    <div className="evidence-folder">
      <div className="evidence-titlebar" onMouseDown={onDragMouseDown}>
        <span className="evidence-titlebar-icon">🔒</span>
        <span className="evidence-titlebar-text">EVIDENCE ARCHIVE — CLASSIFIED</span>
        <button className="evidence-close" onClick={onClose}>✕</button>
      </div>

      <div className="evidence-body">
        {/* Sidebar — suspects */}
        <div className="evidence-sidebar">
          <div className="evidence-sidebar-header">SUSPECTS</div>
          {EVIDENCE_DATA.map(suspect => (
            <button
              key={suspect.id}
              className={`evidence-suspect-btn${selectedSuspect === suspect.id ? " active" : ""}`}
              onClick={() => { setSelectedSuspect(suspect.id); setSelectedItem(null); }}
            >
              <span className="suspect-icon">👤</span>
              {suspect.suspect}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="evidence-content">
          {!selectedSuspect ? (
            <div className="evidence-empty">
              <p className="evidence-empty-icon">📂</p>
              <p>Select a suspect to view their evidence files.</p>
              <p className="evidence-empty-sub">4 suspects — 12 evidence items total</p>
            </div>
          ) : (
            <div className="evidence-items">
              <div className="evidence-items-header">
                Evidence — {activeSuspect.suspect}
                <span className="evidence-count">{activeSuspect.items.length} items</span>
              </div>
              {activeSuspect.items.map(item => (
                <button
                  key={item.id}
                  className={`evidence-item${selectedItem === item.id ? " active" : ""}`}
                  onClick={() => setSelectedItem(item.id)}
                >
                  <span className="evidence-item-icon">📎</span>
                  <div className="evidence-item-info">
                    <span className="evidence-item-name">{item.name}</span>
                    <span className="evidence-item-type">{item.type}</span>
                  </div>
                </button>
              ))}
              {/* Detail panel */}
              {selectedItem && (
                <div className="evidence-detail">
                  <div className="evidence-detail-label">FILE CONTENTS</div>
                  <p className="evidence-detail-text">
                    {activeSuspect.items.find(i => i.id === selectedItem)?.description}
                  </p>
                  <div className="evidence-detail-stamp">EVIDENCE</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
