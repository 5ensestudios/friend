import { useState, useEffect } from "react";
import "../styles/pages/splashScreen.css";

const SLIDES = [
  { id: "studio",    type: "logo",      src: "/Images/5ENSE Logo.png",      sub: "A 5ENSE STUDIOS PRESENTATION" },
  { id: "title",     type: "logo",      src: "/Images/The Friend Logo.png",  sub: null },
  { id: "notice",    type: "text",      src: null,                            sub: null },
];

// Each slide: fade-in 700ms, hold 1800ms, fade-out 700ms
const FADE_MS   = 700;
const HOLD_MS   = 1800;
const SLIDE_MS  = FADE_MS + HOLD_MS + FADE_MS;

export default function SplashScreen({ onDone }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [phase, setPhase]           = useState("in"); // "in" | "hold" | "out"

  useEffect(() => {
    let t;
    if (phase === "in") {
      t = setTimeout(() => setPhase("hold"), FADE_MS);
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("out"), HOLD_MS);
    } else if (phase === "out") {
      t = setTimeout(() => {
        const next = slideIndex + 1;
        if (next >= SLIDES.length) {
          onDone();
        } else {
          setSlideIndex(next);
          setPhase("in");
        }
      }, FADE_MS);
    }
    return () => clearTimeout(t);
  }, [phase, slideIndex, onDone]);

  const slide = SLIDES[slideIndex];

  return (
    <div className={`splash-screen splash-${phase}`} onClick={() => onDone()}>
      <div className="splash-content">
        {slide.type === "logo" ? (
          <div className={`splash-logo-wrap splash-logo-${slide.id}`}>
            <img src={slide.src} alt={slide.id} className={`splash-logo splash-logo-img-${slide.id}`} />
            {slide.sub && <p className="splash-sub">{slide.sub}</p>}
          </div>
        ) : (
          <div className="splash-notice">
            <p className="splash-notice-title">THE FRIEND</p>
            <p className="splash-notice-line">© 2026 5ENSE Studios. All rights reserved.</p>
            <p className="splash-notice-line">This is a work of fiction. Any resemblance to actual events or persons is coincidental.</p>
            <p className="splash-notice-fullscreen">For the best experience, play in fullscreen.</p>
          </div>
        )}
      </div>
      <p className="splash-skip">Click anywhere to skip</p>
    </div>
  );
}
