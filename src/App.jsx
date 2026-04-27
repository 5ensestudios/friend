import { useRef, useState, useEffect } from "react";
import "./App.css";
import SplashScreen from "./pages/SplashScreen";
import AssetPreloader from "./pages/AssetPreloader";
import MainMenu from "./pages/MainMenu";
import CaseIntro from "./pages/CaseIntro";
import BootScreen from "./pages/BootScreen";
import LoginScreen from "./pages/LoginScreen";
import ShutdownScreen from "./pages/ShutdownScreen";
import FatalExceptionScreen from "./pages/FatalExceptionScreen";
import CinematicEnding from "./pages/CinematicEnding";
import CreditsScene from "./pages/CreditsScene";
import TutorialPage from "./pages/TutorialPage";
import CreditsPage from "./pages/CreditsPage";
import DesktopInterface from "./pages/DesktopInterface";
import MobileWarning from "./pages/MobileWarning";
import { useAssetPreloader, CRITICAL_ASSETS, DEFERRED_ASSETS, preloadAssetsInBackground } from "./hooks/useAssetPreloader";
import { deleteUserAccount, subscribeToAuth, logoutUser } from "./firebase/auth";
import { deletePlayerDocument, loadProgress } from "./firebase/progress";

export default function App() {
  const audioRef = useRef(null);
  const menuMusicRef = useRef(null);
  const [currentPage, setCurrentPage] = useState("preload"); // 'preload' | 'splash' | 'menu' | 'tutorial' | 'credits-page' | 'intro' | 'booting' | 'login' | 'game' | 'fatal-exception' | 'shutting-down' | 'ending' | 'credits'
  const [playerData, setPlayerData] = useState(null);
  const [chosenSuspect, setChosenSuspect] = useState(null);
  const [loginMode, setLoginMode] = useState("login");
  const [authUser, setAuthUser] = useState(null);
  const [shutdownTarget, setShutdownTarget] = useState("ending"); // 'menu' | 'credits' | 'act3-ending' | 'ending'
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  const wasMobileRef = useRef(isMobile);
  const desktopBgmRef = useRef(null);
  const bgResumeHandlerRef = useRef(null);
  const endgameCleanupStartedRef = useRef(false);
  const deferredPreloadStartedRef = useRef(false);
  const { progress: preloadProgress, isDone: isPreloadDone } = useAssetPreloader({
    enabled: !isMobile,
    assets: CRITICAL_ASSETS,
  });

  useEffect(() => {
    if (isMobile || currentPage !== "preload") return;
    if (!isPreloadDone || preloadProgress < 100) return;

    const holdAtFull = setTimeout(() => {
      setCurrentPage("splash");
    }, 220);

    return () => clearTimeout(holdAtFull);
  }, [currentPage, isMobile, isPreloadDone, preloadProgress]);

  useEffect(() => {
    if (isMobile || !isPreloadDone) return;
    if (deferredPreloadStartedRef.current) return;
    deferredPreloadStartedRef.current = true;
    preloadAssetsInBackground(DEFERRED_ASSETS, { concurrency: 2 });
  }, [isMobile, isPreloadDone]);

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

    const shouldPlayGlobalBgm = !isMobile && ["splash", "menu", "tutorial", "credits-page"].includes(currentPage);

    if (!shouldPlayGlobalBgm) {
      audioEl.pause();
      audioEl.currentTime = 0;
    } else {
      audioEl.volume = 0.3;
      audioEl.play().catch(() => {
        // Silently fail if audio blocked
      });
    }
  }, [isMobile, currentPage]);

  useEffect(() => {
    if (!isMobile && wasMobileRef.current) {
      setCurrentPage(isPreloadDone ? "splash" : "preload");
    }

    wasMobileRef.current = isMobile;
  }, [isMobile, isPreloadDone]);

  useEffect(() => {
    const audio = new Audio("/sound/Friend%20Soundtrack.mp3");
    audio.loop = true;
    audio.volume = 0.05;
    menuMusicRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const audio = menuMusicRef.current;
    if (!audio) {
      return;
    }

    const shouldPlayMenuMusic = !isMobile && ["menu", "tutorial", "credits-page"].includes(currentPage);

    if (shouldPlayMenuMusic) {
      audio.play().catch(() => {
        // Silently fail if autoplay is blocked.
      });
      return;
    }

    audio.pause();
  }, [currentPage, isMobile]);

  useEffect(() => {
    const ambient = window.__friendDesktopAmbient;
    if (ambient && !["game", "login"].includes(currentPage)) {
      ambient.pause();
    }
  }, [currentPage]);

  useEffect(() => {
    if (!["game", "login"].includes(currentPage)) {
      return;
    }

    // Only play desktop ambient when the actual game is active
    let audio = window.__friendDesktopAmbient;
    if (!audio) {
      audio = new Audio("/Friend SFX/The Friend SFX - Desktop Bgm.mp3");
      audio.loop = true;
      window.__friendDesktopAmbient = audio;
    }

    audio.volume = 0.1;
    audio.play().catch((error) => {
      const resume = () => {
        if (window.__friendDesktopAmbient !== audio) return;
        audio.play().finally(() => {
          window.removeEventListener("click", resume);
          bgResumeHandlerRef.current = null;
        });
      };
      bgResumeHandlerRef.current = resume;
      window.addEventListener("click", resume);
    });

    return () => {
      if (bgResumeHandlerRef.current) {
        window.removeEventListener("click", bgResumeHandlerRef.current);
        bgResumeHandlerRef.current = null;
      }
    };
  }, [currentPage]);

  function handleStartIntro() {
    setCurrentPage("intro");
  }

  function handleOpenTutorial() {
    setCurrentPage("tutorial");
  }

  function handleOpenCredits() {
    setCurrentPage("credits-page");
  }

  async function handleNewGame() {
    if (authUser?.uid) {
      const activeUser = authUser;
      try {
        await deletePlayerDocument(activeUser.uid);
      } catch {
        // Keep flow going even if old save cleanup fails.
      }

      try {
        await deleteUserAccount(activeUser);
      } catch {
        // Fallback to signing out if account deletion is blocked by provider rules.
        await logoutUser();
      }
    }

    setLoginMode("register");
    setCurrentPage("booting");
  }

  async function cleanupCompletedRunAccount() {
    if (endgameCleanupStartedRef.current) return;
    endgameCleanupStartedRef.current = true;

    const activeUser = authUser;

    if (activeUser?.uid) {
      try {
        await deletePlayerDocument(activeUser.uid);
      } catch {
        // Best effort cleanup; continue to auth cleanup.
      }

      try {
        await deleteUserAccount(activeUser);
      } catch {
        // Fallback to sign out if account deletion requires re-auth.
        await logoutUser().catch(() => {});
      }
    } else {
      await logoutUser().catch(() => {});
    }

    setAuthUser(null);
    setPlayerData(null);
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
    setShutdownTarget("act3-ending");
    setCurrentPage("fatal-exception");
  }

  function handleFatalExceptionDone() {
    setCurrentPage("shutting-down");
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
    if (shutdownTarget === "credits") {
      setCurrentPage("credits");
      return;
    }
    if (shutdownTarget === "act3-ending") {
      setCurrentPage("ending");
      return;
    }
    setCurrentPage("ending");
  }

  function handleEndingDone() {
    setShutdownTarget("menu");
    cleanupCompletedRunAccount();
    setCurrentPage("credits");
  }

  async function handleCreditsDone() {
    await cleanupCompletedRunAccount();
    setShutdownTarget("menu");
    setCurrentPage("menu");
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
              onTutorial={handleOpenTutorial}
              onCredits={handleOpenCredits}
              currentUserEmail={authUser?.email || ""}
            />
          )}
          {currentPage === "tutorial" && (
            <TutorialPage onBack={() => setCurrentPage("menu")} />
          )}
          {currentPage === "credits-page" && (
            <CreditsPage onBack={() => setCurrentPage("menu")} />
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
              onReturnToMenu={handleReturnToMenu}
              mode={loginMode}
              currentUserEmail={authUser?.email || ""}
              currentUsername={playerData?.username || authUser?.displayName || "Detective"}
            />
          )}
          {currentPage === "game" && (
            <DesktopInterface
              playerData={playerData}
              authUserId={authUser?.uid}
              onReturnToMenu={handleReturnToMenu}
              onAct3Start={handleAct3Start}
              onShutdownToMenu={handleDesktopShutdown}
            />
          )}
          {currentPage === "fatal-exception" && (
            <FatalExceptionScreen onDone={handleFatalExceptionDone} />
          )}
          {currentPage === "shutting-down" && (
            <ShutdownScreen
              onDone={handleShutdownDone}
              variant={shutdownTarget === "act3-ending" ? "act3" : "default"}
            />
          )}
          {currentPage === "ending" && (
            <CinematicEnding suspect={chosenSuspect} onDone={handleEndingDone} />
          )}
          {currentPage === "credits" && (
            <CreditsScene onDone={handleCreditsDone} />
          )}
        </>
      )}
    </div>
  );
}