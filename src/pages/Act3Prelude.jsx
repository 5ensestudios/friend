import { useEffect, useMemo, useRef, useState } from "react";
import { useSound } from "../hooks/useSound";
import "../styles/pages/act3Prelude.css";

const SLIDES = [
  {
    id: "act3",
    type: "title",
    text: "ACT III",
    holdMs: 1700,
  },
  {
    id: "truth",
    type: "title",
    text: "The Truth",
    holdMs: 2000,
  },
  {
    id: "story",
    type: "text",
    lines: [
      "You have heard their stories.",
      "",
      "They didn't lie to you. They just gave you their truth, a version of the night they needed to believe.",
      "",
      "But the truth is fragile.",
      "",
      "What happened to Chris was a tragedy. But as you've seen, no one in that apartment was innocent. Not even Chris.",
      "",
      "To understand how it went so wrong, you had to see the weight they were all carrying. The resentments and selfish choices that push people to do the unthinkable.",
    ],
    holdMs: 2300,
  },
  {
    id: "choice",
    type: "text",
    lines: [
      "Each perspective shifts the narrative. A different angle. A different detail. His story. Her story. Their story.",
      "",
      "You have listened to all of it. You have seen the nuances they tried to leave out.",
      "",
      "Now, the pieces are in front of you.",
      "",
      "Make your choice.",
    ],
    holdMs: 4200,
  },
];

const TITLE_FADE_MS = 900;
const TITLE_HOLD_MS = 1100;

function TypewriterParagraphs({ lines = [], speed = 22, onDone }) {
  const fullText = useMemo(() => lines.join("\n"), [lines]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [fullText]);

  useEffect(() => {
    if (!fullText) {
      const done = setTimeout(() => onDone?.(), 80);
      return () => clearTimeout(done);
    }

    if (index >= fullText.length) {
      onDone?.();
      return;
    }

    const tick = setTimeout(() => {
      setIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(tick);
  }, [fullText, index, onDone, speed]);

  return (
    <div className="act3-prelude-text-content">
      {fullText.slice(0, index).split("\n").map((line, i) => (
        line ? (
          <p key={i}>{line}</p>
        ) : (
          <div key={i} className="act3-prelude-gap" />
        )
      ))}
    </div>
  );
}

export default function Act3Prelude({ onDone }) {
  const { play } = useSound();
  const [slideIndex, setSlideIndex] = useState(0);
  const [phase, setPhase] = useState("in");
  const [typingDone, setTypingDone] = useState(false);
  const onDoneRef = useRef(onDone);

  const current = SLIDES[slideIndex];

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    play("radioChirp");
  }, [play]);

  useEffect(() => {
    setTypingDone(false);
    setPhase("in");

    if (!current) return;

    if (current.type === "title") {
      const fadeIn = setTimeout(() => setPhase("hold"), TITLE_FADE_MS);
      const fadeOut = setTimeout(() => setPhase("out"), TITLE_FADE_MS + TITLE_HOLD_MS);
      const next = setTimeout(() => {
        if (slideIndex + 1 >= SLIDES.length) {
          onDoneRef.current?.();
          return;
        }
        setSlideIndex(prev => prev + 1);
      }, TITLE_FADE_MS + TITLE_HOLD_MS + TITLE_FADE_MS);

      return () => {
        clearTimeout(fadeIn);
        clearTimeout(fadeOut);
        clearTimeout(next);
      };
    }
  }, [current, slideIndex]);

  useEffect(() => {
    if (!current || current.type !== "text") return;
    if (!typingDone) return;

    const hold = setTimeout(() => {
      setPhase("out");
    }, current.holdMs);

    const next = setTimeout(() => {
      if (slideIndex + 1 >= SLIDES.length) {
        onDoneRef.current?.();
        return;
      }
      setSlideIndex(prev => prev + 1);
    }, current.holdMs + 800);

    return () => {
      clearTimeout(hold);
      clearTimeout(next);
    };
  }, [current, slideIndex, typingDone]);

  if (!current) return null;

  return (
    <div
      className={`act3-prelude act3-prelude--${current.type === "title" ? "title" : "text"} act3-prelude--${phase}`}
      role="dialog"
      aria-label="Act 3 intro"
    >
      {current.type === "title" ? (
        <h1 className="act3-prelude-title">{current.text}</h1>
      ) : (
        <TypewriterParagraphs lines={current.lines} onDone={() => setTypingDone(true)} />
      )}
    </div>
  );
}
