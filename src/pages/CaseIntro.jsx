import { useState, useEffect, useRef } from "react";
import { useSound } from "../hooks/useSound";
import "../styles/pages/caseIntro.css";

/* ═══════════════════════════════════════════
   TypewriterLine (UNCHANGED LOGIC)
═══════════════════════════════════════════ */

function TypewriterLine({ text, speed = 55, onDone, paused = false }) {
  const [index, setIndex] = useState(0);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current);
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    if (!text || index >= text.length) return;

    if (!audioRef.current) {
      audioRef.current = new Audio("/sound/typewriter.mp3");
      audioRef.current.volume = 0.12;
    }

    intervalRef.current = setInterval(() => {
      setIndex(prev => {
        const next = prev + 1;
        const char = text[prev] ?? "";

        if (audioRef.current && char.trim() !== "") {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }

        if (next >= text.length) {
          clearInterval(intervalRef.current);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          setTimeout(() => onDoneRef.current?.(), 0);
        }

        return next;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [text, speed, paused]);

  useEffect(() => {
    setIndex(0);
  }, [text]);

  return <>{text.slice(0, index)}</>;
}

/* ═══════════════════════════════════════════
   SLIDES
═══════════════════════════════════════════ */

const SLIDES = [
  {
    text: "MARCH 7, 2016",
    typewriter: false,
    holdAfter: 2500,
    transition: 1200,
    isTitle: true,
  },

  {
    text: `At 2:14 AM, emergency services responded to a 911 call from a private residence in Oak Ridge Creeks. 

Upon arrival, paramedics found the victim, Chris, unresponsive. Four of his friends remained at the scene. They claimed it was a prank—a harmless attempt to get back at a friend. A joke that simply went too far.

The toxicology report suggested otherwise. 

Two pills are a prank. Four pills are a mistake. 

But for someone with Chris's history?

Six pills are a statement.`,
    typewriter: true,
    typeSpeed: 40,
    holdAfter: 3000,
    transition: 1200,
    siren: true,
  },

  {
    text: `By 4:00 AM, the four friends were each sitting in an interrogation room, every one recounting their night.

Now, every story is different. Every version is missing a piece of the truth.

Listen to them. Understand them. Study them.

The footage has been recovered. The investigation is yours to navigate.

Determine what really happened that night.`,
    typewriter: true,
    typeSpeed: 32,
    holdAfter: 2800,
    transition: 1200,
    siren: true,
  },

  {
    text: `Case File: #2016-0307-CHRIS
Date: March 7, 2016
Location: Oak Ridge Creeks, Private Residence
Incident: Fatal Respiratory Failure / Acute Zolpidem Toxicity`,
    typewriter: false,
    holdAfter: 4000,
    transition: 1500,
  },
  {
  type: "logo",
  src: "/Images/The Friend Logo.png", // ← adjust path
  alt: "Game Logo",
  holdAfter: 3000,
  transition: 1200,
  },
];

/* ═══════════════════════════════════════════
   MAIN
═══════════════════════════════════════════ */

export default function CaseIntro({ onDone }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [fade, setFade] = useState(false);
  const [screenFade, setScreenFade] = useState(false);

  const musicRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  const current = SLIDES[slideIdx];

  /* ═══════════════════════════════════
     START MUSIC ON MOUNT ONLY
  ═══════════════════════════════════ */
  useEffect(() => {
    const audio = new Audio("/Friend SFX/Friend SFX - intro scene.mp3");

    audio.loop = true;
    audio.volume = 0.8;
    audio.play().catch(() => {});

    musicRef.current = audio;

    return () => {
      stopMusic(true); // HARD STOP on unmount
    };
  }, []);

  /* ═══════════════════════════════════
     SAFE MUSIC STOP FUNCTION
  ═══════════════════════════════════ */
  function stopMusic(immediate = false) {
    const audio = musicRef.current;
    if (!audio) return;

    clearInterval(fadeIntervalRef.current);

    if (immediate) {
      audio.pause();
      audio.currentTime = 0;
      musicRef.current = null;
      return;
    }

    fadeIntervalRef.current = setInterval(() => {
      if (!audio) return;

      if (audio.volume > 0.02) {
        audio.volume -= 0.02;
      } else {
        audio.pause();
        audio.currentTime = 0;
        clearInterval(fadeIntervalRef.current);
        musicRef.current = null;
      }
    }, 60);
  }

  /* ═══════════════════════════════════
     SLIDE FLOW
  ═══════════════════════════════════ */
  function goToNextSlide() {
    const next = slideIdx + 1;

    setFade(true);

    setTimeout(() => {
      if (next < SLIDES.length) {
        setSlideIdx(next);
        setFade(false);
      } else {
        setScreenFade(true);

        setTimeout(() => {
          stopMusic(true); // extra safety kill switch
          onDone();
        }, 1000);
      }
    }, current.transition || 900);
  }

  function handleSlideDone() {
    const delay = current.holdAfter || 2000;
    setTimeout(goToNextSlide, delay);
  }

  /* AUTO ADVANCE NON-TYPED */
  useEffect(() => {
    if (!current.typewriter) {
      const t = setTimeout(handleSlideDone, current.holdAfter || 2000);
      return () => clearTimeout(t);
    }
  }, [slideIdx]);

  /* FADE OUT MUSIC WHEN THE LAST SLIDE STARTS */
  useEffect(() => {
    if (slideIdx === SLIDES.length - 1) {
      stopMusic(false);
    }
  }, [slideIdx]);

  /* HARD SAFETY: ALWAYS STOP ON UNMOUNT */
  useEffect(() => {
    return () => {
      stopMusic(true);
    };
  }, []);

  return (
    <div
      className={`case-intro ${
        slideIdx === 0 ? "case-intro--title" : "case-intro--dark"
      } ${current.siren ? "case-intro--siren" : ""} ${
        screenFade ? "case-intro--out" : ""
      }`}
    >
      <div className="case-intro-content">

        <div className={`case-intro-slide ${fade ? "fade-out" : "fade-in"}`}>

          {current.type === "logo" ? (
            <img className="case-intro-logo" src={current.src} alt={current.alt} />
          ) : (
            <p className={`case-intro-line ${current.isTitle ? "title" : ""}`}>
              {current.typewriter ? (
                <TypewriterLine
                  key={slideIdx}
                  text={current.text}
                  speed={current.typeSpeed || 40}
                  onDone={handleSlideDone}
                />
              ) : (
                current.text
              )}
            </p>
          )}

        </div>

      </div>
    </div>
  );
}