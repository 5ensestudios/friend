import { useRef, useState, useEffect } from "react";
import "./App.css";
import SplashScreen from "./pages/SplashScreen";
import MainMenu from "./pages/MainMenu";
import CaseIntro from "./pages/CaseIntro";
import BootScreen from "./pages/BootScreen";
import LoginScreen from "./pages/LoginScreen";
import ShutdownScreen from "./pages/ShutdownScreen";
import CinematicEnding from "./pages/CinematicEnding";
import DesktopInterface from "./pages/DesktopInterface";
import { subscribeToAuth, logoutUser } from "./firebase/auth";
import { loadProgress } from "./firebase/progress";

export default function App() {
  const audioRef = useRef(null);
  const [currentPage, setCurrentPage] = useState("splash"); // 'splash' | 'menu' | 'intro' | 'booting' | 'login' | 'game' | 'shutting-down' | 'ending'
  const [playerData, setPlayerData] = useState(null);
  const [chosenSuspect, setChosenSuspect] = useState(null);
  const [loginMode, setLoginMode] = useState("login");
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (user) => {
      setAuthUser(user);

      if (!user) {
        setPlayerData(null);
        return;
      }

      const savedGame = await loadProgress(user.uid);
      setPlayerData(savedGame);
    });

    // Play background music
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {
        // Silently fail if audio blocked
      });
    }

    return unsubscribe;
  }, []);

  function handleStartIntro() {
    setCurrentPage("intro");
  }

  async function handleNewGame() {
    if (authUser) {
      await logoutUser();
    }

    setLoginMode("register");
    setCurrentPage("booting");
  }

  function handleBootDone() {
    setCurrentPage("login");
  }

  function handleAuthSuccess(gameState, user) {
    setAuthUser(user);
    setPlayerData(gameState);
    setCurrentPage("game");
  }

  function handleContinueGame() {
    setLoginMode("login");
    setCurrentPage("booting");
  }

  function handleReturnToMenu() {
    setCurrentPage("menu");
  }

  function handleAct3Start(suspectId) {
    setChosenSuspect(suspectId);
    setCurrentPage("shutting-down");
  }

  function handleShutdownDone() {
    setCurrentPage("ending");
  }

  function handleEndingDone() {
    setCurrentPage("menu");
  }

  return (
    <div className="app">
      <audio ref={audioRef} src="/sounds/background.mp3" loop playsInline />

      {currentPage === "splash" && (
        <SplashScreen onDone={() => setCurrentPage("menu")} />
      )}
      {currentPage === "menu" && (
        <MainMenu
          onStartIntro={handleStartIntro}
          onContinue={handleContinueGame}
        />
      )}
      {currentPage === "intro" && (
        <CaseIntro onDone={handleNewGame} />
      )}
      {currentPage === "booting" && (
        <BootScreen onDone={handleBootDone} />
      )}
      {currentPage === "login" && (
        <LoginScreen
          onAuthSuccess={handleAuthSuccess}
          mode={loginMode}
          currentUserEmail={authUser?.email || ""}
          currentUsername={playerData?.username || authUser?.displayName || "Detective"}
        />
      )}
      {currentPage === "game" && (
        <DesktopInterface
          playerData={playerData}
          onReturnToMenu={handleReturnToMenu}
          onAct3Start={handleAct3Start}
        />
      )}
      {currentPage === "shutting-down" && (
        <ShutdownScreen onDone={handleShutdownDone} />
      )}
      {currentPage === "ending" && (
        <CinematicEnding suspect={chosenSuspect} onDone={handleEndingDone} />
      )}
    </div>
  );
}