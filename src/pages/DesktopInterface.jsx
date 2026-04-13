import { useState, useEffect } from "react";
import FileExplorer from "../components/desktop/FileExplorer";
import Notepad from "../components/desktop/Notepad";
import CaseDocument from "../components/desktop/CaseDocument";
import EvidenceFolder from "../components/desktop/EvidenceFolder";
import EvidencePopup from "../components/desktop/EvidencePopup";
import SuspectSelect from "../components/desktop/SuspectSelect";
import SceneView from "../components/dialouge/SceneView";
import { useDraggable } from "../hooks/useDraggable";
import { saveProgress } from "../firebase/progress";
import "../styles/pages/desktop.css";

export default function DesktopInterface({ playerData, onReturnToMenu, onAct3Start }) {
  const [view, setView] = useState("desktop"); // 'desktop' or 'scene'
  const [currentAct, setCurrentAct] = useState(null);
  const [playerProgress, setPlayerProgress] = useState(playerData.progress);
  const [openWindows, setOpenWindows] = useState([]); // ['files', 'notes', 'evidence']
  const [activeWindow, setActiveWindow] = useState(null);
  const [clock, setClock] = useState(new Date());
  const [showEvidencePopup, setShowEvidencePopup] = useState(false);
  const [showSuspectSelect, setShowSuspectSelect] = useState(false);
  const [evidenceVisible, setEvidenceVisible] = useState(
    playerData.progress.acts_completed.includes(2)
  );

  const filesDrag = useDraggable({ x: 60, y: 40 });
  const notesDrag = useDraggable({ x: 120, y: 80 });
  const evidenceDrag = useDraggable({ x: 90, y: 60 });

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  function persistProgress(nextProgress) {
    setPlayerProgress(nextProgress);
    const updatedData = {
      ...playerData,
      current_act: nextProgress.current_act,
      acts_completed: nextProgress.acts_completed,
      scenes_visited: nextProgress.scenes_visited,
      locked_scenes: nextProgress.locked_scenes,
      progress: nextProgress,
    };

    // Save in the background so gameplay stays responsive.
    saveProgress(playerData.id, updatedData).catch(() => {});
  }

  function handleActSelect(actNumber) {
    if (actNumber === 3) {
      // Act 3 — show suspect select first
      setShowSuspectSelect(true);
      return;
    }
    setCurrentAct(actNumber);
    setView("scene");
  }

  function handleSuspectChosen(suspectId) {
    setShowSuspectSelect(false);
    onAct3Start(suspectId);
  }

  function handleCloseScene() {
    setView("desktop");
    setCurrentAct(null);
  }

  function handleActComplete(actNumber) {
    const completedActs = playerProgress.acts_completed.includes(actNumber)
      ? playerProgress.acts_completed
      : [...playerProgress.acts_completed, actNumber];

    const newProgress = {
      ...playerProgress,
      current_act: Math.max(playerProgress.current_act, actNumber + 1),
      acts_completed: completedActs,
    };

    persistProgress(newProgress);
    handleCloseScene();

    // After Act 2, show evidence icon + popup after 5 seconds
    if (actNumber === 2) {
      setTimeout(() => {
        setEvidenceVisible(true);
        setShowEvidencePopup(true);
      }, 5000);
    }
  }

  function handleProgressUpdate(partialProgress) {
    const newProgress = {
      ...playerProgress,
      ...partialProgress,
      scenes_visited: {
        ...playerProgress.scenes_visited,
        ...(partialProgress.scenes_visited || {}),
      },
    };

    persistProgress(newProgress);
  }

  function openWindow(windowId) {
    if (!openWindows.includes(windowId)) {
      setOpenWindows(prev => [...prev, windowId]);
    }
    setActiveWindow(windowId);
  }

  function closeWindow(windowId) {
    setOpenWindows(prev => prev.filter(w => w !== windowId));
    if (activeWindow === windowId) {
      setActiveWindow(null);
    }
  }

  function focusWindow(windowId) {
    setActiveWindow(windowId);
  }

  if (view === "scene") {
    return (
      <SceneView
        actNumber={currentAct}
        playerProgress={playerProgress}
        onClose={handleCloseScene}
        onActComplete={handleActComplete}
        onProgressUpdate={handleProgressUpdate}
      />
    );
  }

  return (
    <div className="desktop-interface">
      {/* Desktop wallpaper */}
      <div className="desktop-wallpaper">
        <div className="wallpaper-noise"></div>
      </div>

      {/* Desktop icons */}
      <div className="desktop-icons">
        <button
          className="desktop-icon"
          onDoubleClick={() => openWindow("files")}
          onClick={() => openWindow("files")}
        >
          <div className="desktop-icon-img">
            <svg viewBox="0 0 48 48" width="48" height="48">
              <path d="M4 8h16l4 4h20v28H4V8z" fill="#e8a735" />
              <path d="M4 14h40v26H4V14z" fill="#ffc34d" />
              <path d="M4 14h40v4H4z" fill="#e8a735" opacity="0.5" />
            </svg>
          </div>
          <span className="desktop-icon-label">Case Files</span>
        </button>

        <button
          className="desktop-icon"
          onDoubleClick={() => openWindow("notes")}
          onClick={() => openWindow("notes")}
        >
          <div className="desktop-icon-img">
            <svg viewBox="0 0 48 48" width="48" height="48">
              <rect x="8" y="4" width="32" height="40" rx="2" fill="#fff9e6" />
              <rect x="8" y="4" width="32" height="6" fill="#7eb8da" />
              <line x1="14" y1="18" x2="34" y2="18" stroke="#c0c0c0" strokeWidth="1" />
              <line x1="14" y1="24" x2="34" y2="24" stroke="#c0c0c0" strokeWidth="1" />
              <line x1="14" y1="30" x2="34" y2="30" stroke="#c0c0c0" strokeWidth="1" />
              <line x1="14" y1="36" x2="28" y2="36" stroke="#c0c0c0" strokeWidth="1" />
            </svg>
          </div>
          <span className="desktop-icon-label">Detective Notes</span>
        </button>

        <button
          className="desktop-icon"
          onDoubleClick={() => openWindow("casedoc")}
          onClick={() => openWindow("casedoc")}
        >
          <div className="desktop-icon-img">
            <svg viewBox="0 0 48 48" width="48" height="48">
              <rect x="6" y="2" width="28" height="38" rx="2" fill="#e8dcc8" />
              <rect x="14" y="8" width="28" height="38" rx="2" fill="#f5f0e6" />
              <rect x="18" y="14" width="20" height="2" fill="#ccc" />
              <rect x="18" y="20" width="20" height="2" fill="#ccc" />
              <rect x="18" y="26" width="14" height="2" fill="#ccc" />
              <rect x="18" y="32" width="18" height="2" fill="#ccc" />
              <rect x="16" y="10" width="10" height="3" rx="1" fill="#8b2020" opacity="0.6" />
            </svg>
          </div>
          <span className="desktop-icon-label">Case Brief</span>
        </button>

        {evidenceVisible && (
          <button
            className="desktop-icon"
            onDoubleClick={() => openWindow("evidence")}
            onClick={() => openWindow("evidence")}
          >
            <div className="desktop-icon-img">
              <svg viewBox="0 0 48 48" width="48" height="48">
                <path d="M4 10h16l4 4h20v26H4V10z" fill="#e8a735" />
                <path d="M4 16h40v24H4V16z" fill="#ffc34d" />
                <path d="M4 16h40v4H4z" fill="#e8a735" opacity="0.5" />
              </svg>
            </div>
            <span className="desktop-icon-label">Evidence</span>
          </button>
        )}
      </div>

      {/* Windows */}
      {openWindows.includes("files") && (
        <div
          className={`desktop-window ${activeWindow === "files" ? "active" : ""}`}
          onClick={() => focusWindow("files")}
          style={{
            zIndex: activeWindow === "files" ? 200 : 100,
            transform: `translate(${filesDrag.pos.x}px, ${filesDrag.pos.y}px)`,
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <FileExplorer
            playerProgress={playerProgress}
            onActSelect={handleActSelect}
            onReturnToMenu={onReturnToMenu}
            onClose={() => closeWindow("files")}
            onDragMouseDown={filesDrag.onMouseDown}
          />
        </div>
      )}

      {openWindows.includes("notes") && (
        <div
          className={`desktop-window desktop-window--notes ${activeWindow === "notes" ? "active" : ""}`}
          onClick={() => focusWindow("notes")}
          style={{
            zIndex: activeWindow === "notes" ? 200 : 100,
            transform: `translate(${notesDrag.pos.x}px, ${notesDrag.pos.y}px)`,
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <Notepad onClose={() => closeWindow("notes")} onDragMouseDown={notesDrag.onMouseDown} />
        </div>
      )}

      {openWindows.includes("casedoc") && (
        <CaseDocument onClose={() => closeWindow("casedoc")} />
      )}

      {openWindows.includes("evidence") && (
        <div
          className={`desktop-window ${activeWindow === "evidence" ? "active" : ""}`}
          onClick={() => focusWindow("evidence")}
          style={{
            zIndex: activeWindow === "evidence" ? 200 : 100,
            transform: `translate(${evidenceDrag.pos.x}px, ${evidenceDrag.pos.y}px)`,
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <EvidenceFolder
            onClose={() => closeWindow("evidence")}
            onDragMouseDown={evidenceDrag.onMouseDown}
          />
        </div>
      )}

      {showEvidencePopup && (
        <EvidencePopup onDismiss={() => setShowEvidencePopup(false)} />
      )}

      {showSuspectSelect && (
        <SuspectSelect
          onSelect={handleSuspectChosen}
          onCancel={() => setShowSuspectSelect(false)}
        />
      )}

      {/* Taskbar */}
      <div className="taskbar">
        <div className="taskbar-left">
          <button className="taskbar-start" onClick={onReturnToMenu}>
            <span className="start-icon">⊞</span>
            <span className="start-text">START</span>
          </button>
          <div className="taskbar-divider"></div>
          {openWindows.map(w => (
            <button
              key={w}
              className={`taskbar-window-btn ${activeWindow === w ? "active" : ""}`}
              onClick={() => focusWindow(w)}
            >
              {w === "files" ? "📁 Case Files" : w === "notes" ? "📝 Notes" : w === "evidence" ? "🔒 Evidence" : "📄 Case Brief"}
            </button>
          ))}
        </div>
        <div className="taskbar-right">
          <div className="taskbar-tray">
            <span className="tray-icon">🔊</span>
            <span className="tray-icon">🔌</span>
          </div>
          <div className="taskbar-clock">
            <div className="clock-time">{clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="clock-date">{clock.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' })}</div>
          </div>
        </div>
      </div>
    </div>
  );
}