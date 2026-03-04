import { useRef, useState, useEffect } from "react";
import "./App.css";
import MainMenu from "./pages/MainMenu";
import DesktopInterface from "./pages/DesktopInterface";

export default function App() {
  const audioRef = useRef(null);
  const [currentPage, setCurrentPage] = useState("menu"); // 'menu' or 'game'
  const [playerData, setPlayerData] = useState(null);
  const [hasSaveData, setHasSaveData] = useState(false);

  // Check for existing save on mount
  useEffect(() => {
    checkForSaveData();
    // Play background music
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {
        // Silently fail if audio blocked
      });
    }
  }, []);

  function checkForSaveData() {
    const savedGame = localStorage.getItem("friEND_save");
    if (savedGame) {
      setHasSaveData(true);
    }
  }

  function handleNewGame() {
    const newPlayerData = {
      id: Date.now(),
      username: "Detective",
      current_act: 0,
      acts_completed: [],
      scenes_visited: {},
      locked_scenes: {},
      choices_made: [],
      progress: {
        current_act: 0,
        acts_completed: [],
        scenes_visited: {},
        locked_scenes: {},
      },
    };
    localStorage.setItem("friEND_save", JSON.stringify(newPlayerData));
    setPlayerData(newPlayerData);
    setCurrentPage("game");
  }

  function handleContinueGame() {
    const savedGame = localStorage.getItem("friEND_save");
    if (savedGame) {
      const data = JSON.parse(savedGame);
      setPlayerData(data);
      setCurrentPage("game");
    }
  }

  function handleReturnToMenu() {
    setCurrentPage("menu");
  }

  return (
    <div className="app">
      <audio ref={audioRef} src="/sounds/background.mp3" loop playsInline />

      {currentPage === "menu" ? (
        <MainMenu
          onNewGame={handleNewGame}
          onContinue={handleContinueGame}
          hasSaveData={hasSaveData}
        />
      ) : (
        <DesktopInterface
          playerData={playerData}
          onReturnToMenu={handleReturnToMenu}
        />
      )}
    </div>
  );
}