import { useRef, useState, useEffect } from "react";
import "./App.css";
import SplashScreen from "./pages/SplashScreen";
import AssetPreloader from "./pages/AssetPreloader";
import MainMenu from "./pages/MainMenu";
import CaseIntro from "./pages/CaseIntro";
import BootScreen from "./pages/BootScreen";
import LoginScreen from "./pages/LoginScreen";
import ShutdownScreen from "./pages/ShutdownScreen";
import CinematicEnding from "./pages/CinematicEnding";
import DesktopInterface from "./pages/DesktopInterface";
import MobileWarning from "./pages/MobileWarning";
import { useAssetPreloader } from "./hooks/useAssetPreloader";
import { subscribeToAuth, logoutUser } from "./firebase/auth";
import { loadProgress } from "./firebase/progress";

export default function App() {
  const audioRef = useRef(null);
  const [currentPage, setCurrentPage] = useState("preload"); // 'preload' | 'splash' | 'menu' | 'intro' | 'booting' | 'login' | 'game' | 'shutting-down' | 'ending'
  const [playerData, setPlayerData] = useState(null);
  const [chosenSuspect, setChosenSuspect] = useState(null);
  const [loginMode, setLoginMode] = useState("login");
  const [authUser, setAuthUser] = useState(null);
  const [shutdownTarget, setShutdownTarget] = useState("ending");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  const wasMobileRef = useRef(isMobile);
  const { progress: preloadProgress, isDone: isPreloadDone } = useAssetPreloader({ enabled: !isMobile });

  useEffect(() => {
    if (isMobile || currentPage !== "preload") return;
    if (!isPreloadDone || preloadProgress < 100) return;

    const holdAtFull = setTimeout(() => {
      setCurrentPage("splash");
    }, 220);

    return () => clearTimeout(holdAtFull);
  }, [currentPage, isMobile, isPreloadDone, preloadProgress]);

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

    // Handle screen resize for mobile detection
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const audioEl = audioRef.current;

    if (!audioEl) {
      return;
    }

    if (isMobile) {
      audioEl.pause();
      audioEl.currentTime = 0;
    } else {
      audioEl.volume = 0.3;
      audioEl.play().catch(() => {
        // Silently fail if audio blocked
      });
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile && wasMobileRef.current) {
      setCurrentPage(isPreloadDone ? "splash" : "preload");
    }

    wasMobileRef.current = isMobile;
  }, [isMobile, isPreloadDone]);

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
    setCurrentPage("ending");
  }

  function handleDesktopShutdown() {
    setChosenSuspect(null);
    setShutdownTarget("menu");
    setCurrentPage("shutting-down");
  }

  function handleShutdownDone() {
    if (shutdownTarget === "menu") {
      setCurrentPage("menu");
      return;
    }
    setCurrentPage("ending");
  }

  function handleEndingDone() {
    setShutdownTarget("menu");
    setCurrentPage("shutting-down");
  }

  return (
    <div className="app">
      {isMobile ? (
        <MobileWarning />
      ) : (
        <>
          <audio ref={audioRef} src="/sounds/background.mp3" loop playsInline />
          {currentPage === "preload" && (
            <AssetPreloader progress={preloadProgress} />
          )}
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
              onShutdownToMenu={handleDesktopShutdown}
            />
          )}
          {currentPage === "shutting-down" && (
            <ShutdownScreen onDone={handleShutdownDone} />
          )}
          {currentPage === "ending" && (
            <CinematicEnding suspect={chosenSuspect} onDone={handleEndingDone} />
          )}
        </>
      )}
    </div>
  );
}