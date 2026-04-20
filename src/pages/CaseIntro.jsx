import { useState, useEffect, useRef } from "react";
import { useSound } from "../hooks/useSound";
import "../styles/pages/caseIntro.css";

/* ═══════════════════════════════════════════
   Slides (Cinematic System)
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
];

/* ═══════════════════════════════════════════
   Typewriter
═══════════════════════════════════════════ */

function TypeLine({ text, speed = 28, onDone }) {
  const [idx, setIdx] = useState(0);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!text) {
      const t = setTimeout(() => onDoneRef.current?.(), 80);
      return () => clearTimeout(t);
    }

    setIdx(0);
    let current = 0;

    const iv = setInterval(() => {
      current++;
      setIdx(current);

      if (current >= text.length) {
        clearInterval(iv);
        setTimeout(() => onDoneRef.current?.(), 0);
      }
    }, speed);

    return () => clearInterval(iv);
  }, [text, speed]);

  return <span>{text.slice(0, idx)}</span>;
}

/* ═══════════════════════════════════════════
   Main Component
═══════════════════════════════════════════ */

export default function CaseIntro({ onDone }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [fade, setFade] = useState(false);
  const [screenFade, setScreenFade] = useState(false);
  const { play } = useSound();
  const sirenPlayedRef = useRef(false);

  const current = SLIDES[slideIdx];

  /* Start delay and play radio siren */
  useEffect(() => {
    const t = setTimeout(() => {
      setStarted(true);
      if (!sirenPlayedRef.current) {
        play("radioSiren", { volume: 0.8 });
        sirenPlayedRef.current = true;
      }
    }, 600);
    return () => clearTimeout(t);
  }, [play]);

  /* Slide transition controller */
  function goToNextSlide() {
    const next = slideIdx + 1;

    setFade(true); // start fade-out

    setTimeout(() => {
      if (next < SLIDES.length) {
        setSlideIdx(next);
        setFade(false); // fade-in after swap
      } else {
        setScreenFade(true);
        setTimeout(() => onDone(), 700);
      }
    }, current.transition || 900);
  }

  /* Handle slide completion */
  function handleSlideDone() {
    const delay = current.holdAfter || 2000;

    setTimeout(() => {
      goToNextSlide();
    }, delay);
  }

  /* Auto-advance non-typewriter slides */
  useEffect(() => {
    if (!started) return;

    if (!current.typewriter) {
      const t = setTimeout(() => {
        handleSlideDone();
      }, current.holdAfter || 2000);

      return () => clearTimeout(t);
    }
  }, [slideIdx, started]);

  return (
    <div
      className={`case-intro ${
        slideIdx === 0 ? "case-intro--title" : "case-intro--dark"
      } ${screenFade ? "case-intro--out" : ""}`}
    >
      <div className="case-intro-content">

        {started && (
          <div className={`case-intro-slide ${fade ? "fade-out" : "fade-in"}`}>

            <p
              className={`case-intro-line ${current.isTitle ? "title" : ""}`}
              style={{ whiteSpace: "pre-line" }}
            >

              {current.typewriter ? (
                <TypeLine
                  key={slideIdx}
                  text={current.text}
                  speed={current.typeSpeed || 40}
                  onDone={handleSlideDone}
                />
              ) : (
                current.text
              )}

            </p>

          </div>
        )}

      </div>
    </div>
  );
}