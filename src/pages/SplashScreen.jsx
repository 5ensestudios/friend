import { useState, useEffect } from "react";
import "../styles/pages/splashScreen.css";

const SLIDES = [
  { id: "studio", type: "logo", src: "/Images/5ENSE Logo.png", sub: null },
  { id: "title", type: "logo", src: "/Images/The Friend Logo.png", sub: null },

  {
    id: "legal",
    type: "text",
    content: [
      "© 2026 5ENSE STUDIOS. All rights reserved.",
      "This is a work of fiction. Names, characters, businesses, places, events and incidents are either the products of the author’s imagination or used in a fictitious manner. Any resemblance to actual persons, living or dead, or actual events is purely coincidental.",
    ]
  },

  {
    id: "fullscreen",
    type: "text",
    content: ["Maximize screen for an immersive experience."]
  },


];

const FADE_MS = 1200; // longer fade
const HOLD_MS = 2600; // longer hold
const SLIDE_MS = FADE_MS + HOLD_MS + FADE_MS;


export default function SplashScreen({ onDone }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [phase, setPhase] = useState(null); // null at first

  useEffect(() => {
    let fadeInTimeout, holdTimeout, fadeOutTimeout, nextTimeout;

    // Fix: set phase to 'in' after mount to avoid flicker
    fadeInTimeout = setTimeout(() => {
      setPhase("in");
      holdTimeout = setTimeout(() => {
        setPhase("hold");
        fadeOutTimeout = setTimeout(() => {
          setPhase("out");
          nextTimeout = setTimeout(() => {
            const next = slideIndex + 1;
            if (next >= SLIDES.length) {
              onDone();
            } else {
              setSlideIndex(next);
            }
          }, FADE_MS);
        }, HOLD_MS);
      }, FADE_MS);
    }, 10); // short delay to allow mount

    return () => {
      clearTimeout(fadeInTimeout);
      clearTimeout(holdTimeout);
      clearTimeout(fadeOutTimeout);
      clearTimeout(nextTimeout);
    };
  }, [slideIndex, onDone]);

  const slide = SLIDES[slideIndex];

  return (
    <div className={`splash-screen splash-${phase || "in"} splash-${slide.id}`}
      onClick={onDone}>
      <div className="splash-content">
        {slide.type === "logo" ? (
          <div className={`splash-logo-wrap splash-logo-${slide.id}`}>
            <img
              src={slide.src}
              alt={slide.id}
              className={`splash-logo splash-logo-img-${slide.id}`}
            />
            {slide.sub && <p className="splash-sub">{slide.sub}</p>}
          </div>
        ) : (
          <div className={`splash-text splash-text-${slide.id}`}>
            {slide.content.map((line, i) => (
              <p key={i} className="splash-text-line">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}