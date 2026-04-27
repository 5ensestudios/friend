import { useEffect, useMemo, useRef, useState } from "react";
import { useSound } from "../hooks/useSound";
import "../styles/pages/act3Prelude.css";

/* Typewriter component with audio feedback */
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
      if (audioRef.current) { audioRef.current.pause(); }
      return;
    }
    // If already finished or no text, don't restart
    if (!text || index >= text.length) return;
    if (!audioRef.current) {
      audioRef.current = new Audio("/sound/typewriter.mp3");
      audioRef.current.volume = 0.35;
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
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [text, speed, paused]);

  // Reset index when text changes
  useEffect(() => {
    setIndex(0);
  }, [text]);

  // Handle empty text
  useEffect(() => {
    if (!text) {
      const t = setTimeout(() => onDoneRef.current?.(), 50);
      return () => clearTimeout(t);
    }
  }, [text]);

  return <>{text.slice(0, index)}</>;
}

const SLIDES = [
  {
    id: "act3",
    type: "title",
    text: "ACT III",
    holdMs: 5000,
  },
  {
    id: "truth",
    type: "title",
    text: "The Truth",
    holdMs: 5000,
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

/* Typewriter for multi-line paragraphs with audio support */
function TypewriterParagraphs({ lines = [], speed = 35, onDone }) {
  const fullText = useMemo(() => lines.join("\n"), [lines]);
  const [index, setIndex] = useState(0);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    setIndex(0);
  }, [fullText]);

  useEffect(() => {
    if (!fullText) {
      const done = setTimeout(() => onDoneRef.current?.(), 80);
      return () => clearTimeout(done);
    }

    if (index >= fullText.length) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      onDoneRef.current?.();
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio("/sound/typewriter.mp3");
      audioRef.current.volume = 0.35;
    }

    intervalRef.current = setInterval(() => {
      setIndex(prev => {
        const next = prev + 1;
        const char = fullText[prev] ?? "";
        if (audioRef.current && char.trim() !== "") {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
        return next;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [fullText, index, speed]);

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
  const showGlitch = current?.type === "title" && slideIndex < 2;

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
      const fadeOut = setTimeout(() => setPhase("out"), current.holdMs - 900);
      const next = setTimeout(() => {
        if (slideIndex + 1 >= SLIDES.length) {
          onDoneRef.current?.();
          return;
        }
        setSlideIndex(prev => prev + 1);
      }, current.holdMs);

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
      className={`act3-prelude act3-prelude--${current.type === "title" ? "title" : "text"} act3-prelude--phase ${phase === "out" ? "act3-prelude--phase-out" : ""}`}
      role="dialog"
      aria-label="Act 3 intro"
    >
      {current.type === "title" ? (
        <h1 className={`act3-prelude-title ${showGlitch ? "act3-prelude-title--crash" : ""}`}>
          {current.text}
        </h1>
      ) : (
        <TypewriterParagraphs lines={current.lines} onDone={() => setTypingDone(true)} />
      )}
    </div>
  );
}
