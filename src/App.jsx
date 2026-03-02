import { useRef, useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const menuVideoRef = useRef(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameStage, setGameStage] = useState("intro-story"); // intro-story, intro-video-first, intro-video-loop, choice-video, choice-paused
  const [currentVideo, setCurrentVideo] = useState("/videos/intro.mp4");
  const [showChoices, setShowChoices] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [firstLoopComplete, setFirstLoopComplete] = useState(false);

  const introStory = "You find yourself in a mysterious place. The air is thick with tension. Every decision you make will shape your fate. What will you do?";

  const scene = {
    intro: "/videos/intro.mp4",
    loop: "/videos/intro.mp4",
    next: {
      left: "/videos/left.mp4",
      middle: "/videos/middle.mp4",
      right: "/videos/right.mp4"
    }
  };

  // Video ends and loops
  const handleEnded = () => {
    if (gameStage === "intro-video-first") {
      // First intro.mp4 complete, stay on intro for looping and show choices
      setGameStage("intro-video-loop");
      setShowChoices(true);
    } else if (gameStage === "intro-video-loop") {
      // Keep showing choices on loop
      setShowChoices(true);
    } else if (gameStage === "choice-video") {
      // After choice video ends, pause it in B&W and show choices
      setGameStage("choice-paused");
      setShowChoices(true);
    }
  };

  // Typewriter effect for intro story
  useEffect(() => {
    if (gameStage === "intro-story") {
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < introStory.length) {
          setDisplayedText(introStory.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          // After typewriter finishes, show skip button or auto-proceed
          setTimeout(() => {
            setGameStage("intro-video-first");
            setShowChoices(false);
          }, 2000);
        }
      }, 50); // Typing speed

      return () => clearInterval(typeInterval);
    }
  }, [gameStage]);

  const choose = (choice) => {
    setShowChoices(false);
    setCurrentVideo(scene.next[choice]);
    setGameStage("choice-video");
    // Reset video to play from the start
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    // Play sound effect on choice
    playSound("/sounds/select.mp3");
  };

  const startGame = () => {
    setGameStarted(true);
    setGameStage("intro-story");
    playSound("/sounds/select.mp3");
  };

  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Silently fail if sound file doesn't exist
    });
  };

  // Play background music
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {
        // Silently fail if audio file doesn't exist or autoplay blocked
      });
    }
  }, []);

  // Pause/Play video and apply grayscale when choices show
  useEffect(() => {
    if (videoRef.current && gameStage !== "intro-story") {
      if (showChoices) {
        videoRef.current.pause();
      } else if (gameStage === "intro-video-loop" || gameStage === "intro-video-first") {
        videoRef.current.play();
      }
    }
  }, [showChoices, gameStage]);

  return (
    <div className="container">
      <audio
        ref={audioRef}
        src="/sounds/background.mp3"
        loop
        playsInline
      />
      
      {!gameStarted ? (
        // MAIN MENU
        <div className="main-menu">
          <video
            ref={menuVideoRef}
            src="/videos/menu-bg.mp4"
            autoPlay
            muted
            playsInline
            loop
            className="menu-video"
          />
          <div className="menu-overlay"></div>
          <div className="menu-content">
            <h1>Interactive Video Game</h1>
            <button className="start-button" onClick={startGame}>
              PLAY GAME
            </button>
          </div>
        </div>
      ) : gameStage === "intro-story" ? (
        // INTRO STORY WITH TYPEWRITER
        <div className="intro-story-container">
          <video
            src="/videos/menu-bg.mp4"
            autoPlay
            muted
            playsInline
            loop
            className="story-video"
          />
          <div className="story-overlay"></div>
          <div className="story-content">
            <p className="typewriter-text">{displayedText}</p>
          </div>
        </div>
      ) : (
        // GAME VIDEO
        <div className="video-wrapper">
          <video
            ref={videoRef}
            src={currentVideo}
            autoPlay
            muted
            playsInline
            onEnded={handleEnded}
            loop={gameStage === "intro-video-loop"}
            className={showChoices ? "video-paused" : ""}
          />
          {showChoices && gameStage !== "intro-video-first" && (
            <>
              <button
                className="hotspot left"
                onClick={() => choose("left")}
              >
                LEFT
              </button>

              <button
                className="hotspot middle"
                onClick={() => choose("middle")}
              >
                MIDDLE
              </button>

              <button
                className="hotspot right"
                onClick={() => choose("right")}
              >
                RIGHT
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}