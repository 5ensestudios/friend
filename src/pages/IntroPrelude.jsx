import { useEffect, useRef, useState } from "react";
import { useSound } from "../hooks/useSound";
import "../styles/pages/caseIntro.css";

const SLIDES = [
  {
    title: "INTRODUCTION",
  },
  {
    title: "THE FIRST INTERVIEWS",
    subtitle: "Meet the victim’s friends, establish who they are. ",
  },
];

const HOLD_MS = 3200;
const FADE_MS = 700;

export default function IntroPrelude({ onDone }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const onDoneRef = useRef(onDone);
  const { play } = useSound();

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    play("radioChirp");
  }, [play]);

  useEffect(() => {
    setFadeOut(false);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, HOLD_MS);

    const nextTimer = setTimeout(() => {
      const next = slideIdx + 1;
      if (next >= SLIDES.length) {
        onDoneRef.current?.();
        return;
      }
      setSlideIdx(next);
    }, HOLD_MS + FADE_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(nextTimer);
    };
  }, [slideIdx]);

  const slide = SLIDES[slideIdx];

  return (
    <div className={`case-intro case-intro--title ${fadeOut ? "case-intro--out" : ""}`}>
      <div className="case-intro-content">
        <h1 className="case-intro-title case-intro-title--brunson-intro">{slide.title}</h1>
        {slide.subtitle && (
          <p className="case-intro-subtitle case-intro-subtitle--intro-label">{slide.subtitle}</p>
        )}
      </div>
    </div>
  );
}
