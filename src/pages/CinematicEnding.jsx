import { useRef, useState, useEffect } from "react";
import "../styles/pages/cinematicEnding.css";

const SUSPECT_VIDEOS = {
  louis: "https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto/f_auto/v1776172844/Louis_Act_3_ameapn.mp4",
  may: "https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto/f_auto/v1776172758/May_Act_3_e8gkxj.mp4",
  johnny: "https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto/f_auto/v1776172888/Johnny_Act_3_pnnvdb.mp4",
  richard: "https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto/f_auto/v1776172813/Richard_Act_3_srtgnb.mp4",
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
