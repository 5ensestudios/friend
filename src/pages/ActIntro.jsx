import { useState, useEffect, useRef } from "react";
import { useSound } from "../hooks/useSound";
import "../styles/pages/caseIntro.css";

const ACT_SLIDES = {
  1: [
    {
      type: "part",
      title: "ACT I",
      part: "PART 1",
    },
    {
      type: "title",
      title: "THE INCIDENT",
      subtitle: "Reconstruct the night, find out where each one of them was.",
    },
  ],
  2: [
    {
      type: "part",
      title: "ACT II",
      part: "PART 2",
    },
    {
      type: "title",
      title: "THE MOTIVES",
      subtitle: "Motives begin to surface. Who had reason to want Chris gone?",
    },
  ],
};

const HOLD_MS = 3200;
const FADE_MS = 700;

export default function ActIntro({ onDone, actNumber = 1 }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const onDoneRef = useRef(onDone);
  const { play } = useSound();
  const slides = ACT_SLIDES[actNumber] || ACT_SLIDES[1];

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
      if (next >= slides.length) {
        onDoneRef.current?.();
        return;
      }
      setSlideIdx(next);
    }, HOLD_MS + FADE_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(nextTimer);
    };
  }, [slideIdx, slides.length]);

  const slide = slides[slideIdx];

  return (
    <div className={`case-intro case-intro--title ${fadeOut ? "case-intro--out" : ""}`}>
      <div className="case-intro-content case-intro-content--act">
        {slide.type === "part" ? (
          <div className="case-intro-act-header">
            <h1 className="case-intro-title case-intro-title--brunson-intro case-intro-title--act">
              {slide.title}
            </h1>
            <p className="case-intro-act-part">{slide.part}</p>
          </div>
        ) : (
          <>
            <h1 className="case-intro-title case-intro-title--brunson-intro case-intro-title--act">
              {slide.title}
            </h1>
            <p className="case-intro-subtitle case-intro-subtitle--intro-label case-intro-subtitle--act">
              {slide.subtitle}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
