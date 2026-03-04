import { useState } from "react";
import FileExplorer from "../components/desktop/FileExplorer";
import SceneView from "../components/dialouge/SceneView";
import "../styles/pages/desktop.css";

export default function DesktopInterface({ playerData, onReturnToMenu }) {
  const [view, setView] = useState("desktop"); // 'desktop' or 'scene'
  const [currentAct, setCurrentAct] = useState(null);
  const [playerProgress, setPlayerProgress] = useState(playerData.progress);

  function handleActSelect(actNumber) {
    setCurrentAct(actNumber);
    setView("scene");
  }

  function handleCloseScene() {
    setView("desktop");
    setCurrentAct(null);
  }

  function handleActComplete(actNumber) {
    const newProgress = {
      ...playerProgress,
      current_act: actNumber + 1,
      acts_completed: [...playerProgress.acts_completed, actNumber],
    };
    setPlayerProgress(newProgress);
    
    // Update localStorage
    const updatedData = { ...playerData, progress: newProgress };
    localStorage.setItem("friEND_save", JSON.stringify(updatedData));
    
    handleCloseScene();
  }

  return (
    <div className="desktop-interface">
      <div className="desktop-background">
        <div className="desktop-grid"></div>
      </div>

      {view === "desktop" ? (
        <>
          <FileExplorer
            playerProgress={playerProgress}
            onActSelect={handleActSelect}
            onReturnToMenu={onReturnToMenu}
          />
          <div className="taskbar">
            <div className="taskbar-start">START</div>
            <div className="taskbar-clock">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </>
      ) : (
        <SceneView
          actNumber={currentAct}
          playerProgress={playerProgress}
          onClose={handleCloseScene}
          onActComplete={handleActComplete}
        />
      )}
    </div>
  );
}