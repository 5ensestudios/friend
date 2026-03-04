import { useState, useEffect } from "react";
import "../../styles/components/dialogue.css";

export default function SceneView({
  actNumber,
  playerProgress,
  onClose,
  onActComplete,
}) {
  const [sceneData, setSceneData] = useState(null);
  const [currentScene, setCurrentScene] = useState("intro");

  useEffect(() => {
    loadActData();
  }, [actNumber]);

  async function loadActData() {
    // Placeholder - will load from JSON later
    const acts = {
      0: {
        title: "INTRODUCTORY - The First Interviews",
        intro: "CASE FILE: #2016-0307-CHRIS\nMarch 7, 2016\n\nYou arrive at the scene...",
      },
      1: {
        title: "ACT I - The Incident",
        intro: "What happened last night?",
      },
      2: {
        title: "ACT II - The Motives",
        intro: "What did Chris do to provoke this?",
      },
      3: {
        title: "ACT III - The Truth",
        intro: "Who is responsible?",
      },
    };
    setSceneData(acts[actNumber] || acts[0]);
  }

  function handleCompleteAct() {
    onActComplete(actNumber);
  }

  return (
    <div className="scene-view">
      <div className="scene-header">
        <h2>{sceneData?.title}</h2>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="scene-content">
        <p>{sceneData?.intro}</p>
        <p style={{ marginTop: "40px", color: "#999" }}>
          [Dialogue and scene content coming soon]
        </p>
      </div>

      <div className="scene-footer">
        <button className="scene-button" onClick={handleCompleteAct}>
          Continue to Next Act
        </button>
      </div>
    </div>
  );
}