import { useRef, useState, useEffect } from "react";
import "../styles/pages/cinematicEnding.css";

const SUSPECT_VIDEOS = {
  louis: "/videos/Act 3 placeholder.mp4",
  may: "/videos/Act 3 placeholder.mp4",
  johnny: "/videos/Act 3 placeholder.mp4",
  richard: "/videos/Act 3 placeholder.mp4",
};

export default function CinematicEnding({ suspect, onDone }) {
  const videoRef = useRef(null);
  const [ended, setEnded] = useState(false);
  const [ready, setReady] = useState(false);

  const videoSrc = SUSPECT_VIDEOS[suspect] || "/videos/Act 3 placeholder.mp4";

  useEffect(() => {
    const t = setTimeout(() => {
      setReady(true);
      videoRef.current?.play().catch(() => {});
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  function handleEnded() {
    setEnded(true);
  }

  function handleFinish() {
    onDone();
  }

  return (
    <div className="cinematic-ending">
      <video
        ref={videoRef}
        className="cinematic-video"
        src={videoSrc}
        playsInline
        onEnded={handleEnded}
      />
      {!ready && <div className="cinematic-black-hold" />}
      {ended && (
        <div className="cinematic-end-overlay">
          <button className="cinematic-end-btn" onClick={handleFinish}>
            RETURN TO MENU
          </button>
        </div>
      )}
    </div>
  );
}
