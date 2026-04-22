import { useEffect, useMemo, useRef, useState } from "react";
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
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const isPreviewMode = import.meta.env.DEV && searchParams.get("actIntroPreview") === "1";
  const [slideIdx, setSlideIdx] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const onDoneRef = useRef(onDone);
  const { play } = useSound();

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    play("radioChirp");
  }, [play]);

  useEffect(() => {
    // Trigger slide-in animation after slide changes
    const timer = setTimeout(() => {
      setSlideIn(true);
    }, 10);
    return () => clearTimeout(timer);
  }, [slideIdx, animationKey]);

  useEffect(() => {
    // Reset slideIn when slideIdx changes to trigger animation again
    setSlideIn(false);
  }, [slideIdx]);

  useEffect(() => {
    if (fadeOut) {
      setSlideIn(false);
    }
  }, [fadeOut]);

  useEffect(() => {
    if (isPreviewMode) {
      return undefined;
    }

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
  }, [isPreviewMode, slideIdx]);

  useEffect(() => {
    if (!isPreviewMode) {
      return undefined;
    }

    function handlePreviewKeys(event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSlideIdx(prev => Math.min(SLIDES.length - 1, prev + 1));
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSlideIdx(prev => Math.max(0, prev - 1));
      }

      if (event.key === "Home") {
        event.preventDefault();
        setSlideIdx(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        setSlideIdx(SLIDES.length - 1);
      }
    }

    window.addEventListener("keydown", handlePreviewKeys);
    return () => window.removeEventListener("keydown", handlePreviewKeys);
  }, [isPreviewMode]);

  const slide = SLIDES[slideIdx];

  return (
    <div className={`case-intro case-intro--title ${fadeOut ? "case-intro--out" : ""}`}>
      <div className={`case-intro-slide ${slideIn ? "fade-in" : ""} ${fadeOut ? "fade-out" : ""}`}>
        <div className="case-intro-content">
          <h1 className="case-intro-title case-intro-title--brunson-intro">{slide.title}</h1>
          {slide.subtitle && (
            <p className="case-intro-subtitle case-intro-subtitle--intro-label">{slide.subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
