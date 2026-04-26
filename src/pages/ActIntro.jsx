import { useState, useEffect, useMemo, useRef } from "react";
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
  3: [
    {
      type: "part",
      title: "ACT III",
      part: "PART 3",
    },
    {
      type: "title",
      title: "THE TRUTH",
      subtitle: "Uncover the final secrets and confront the truth.",
    },
  ],
};

const HOLD_MS = 3200;
const FADE_MS = 700;

export default function ActIntro({ onDone, actNumber = 1 }) {
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const isPreviewMode = import.meta.env.DEV && searchParams.get("actIntroPreview") === "1";
  const initialPreviewAct = useMemo(() => {
    if (!isPreviewMode) {
      return actNumber;
    }

    const requested = Number.parseInt(searchParams.get("actIntroAct") || String(actNumber), 10);
    return requested === 2 ? 2 : 1;
  }, [actNumber, isPreviewMode, searchParams]);

  const [previewAct, setPreviewAct] = useState(initialPreviewAct);
  const [slideIdx, setSlideIdx] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const onDoneRef = useRef(onDone);
  const { play } = useSound();
  const activeAct = isPreviewMode ? previewAct : actNumber;
  const slides = ACT_SLIDES[activeAct] || ACT_SLIDES[1];

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    play("radioChirp");
  }, [play]);

  useEffect(() => {
    setSlideIdx(0);
    setFadeOut(false);
    setSlideIn(false);
    setAnimationKey(prev => prev + 1);
  }, [activeAct]);

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
    if (isPreviewMode) {
      return undefined;
    }

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
  }, [isPreviewMode, slideIdx, slides.length]);

  useEffect(() => {
    if (!isPreviewMode) {
      return undefined;
    }

    function handlePreviewKeys(event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSlideIdx(prev => Math.min(slides.length - 1, prev + 1));
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
        setSlideIdx(slides.length - 1);
      }

      if (event.key === "1") {
        event.preventDefault();
        setPreviewAct(1);
      }

      if (event.key === "2") {
        event.preventDefault();
        setPreviewAct(2);
      }
    }

    window.addEventListener("keydown", handlePreviewKeys);
    return () => window.removeEventListener("keydown", handlePreviewKeys);
  }, [isPreviewMode, slides.length]);

  const slide = slides[slideIdx];

  // Reset slideIn when fadeOut starts
  useEffect(() => {
    if (fadeOut) {
      setSlideIn(false);
    }
  }, [fadeOut]);

  return (
    <div className={`case-intro case-intro--title ${fadeOut ? "case-intro--out" : ""}`}>
      <div className={`case-intro-slide ${slideIn ? "fade-in" : ""} ${fadeOut ? "fade-out" : ""}`}>
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
    </div>
  );
}
