import { useState, useEffect, useRef } from "react";
import "../styles/pages/caseIntro.css";

// Example act intro lines. You can pass different lines for each act.
const DEFAULT_LINES = [
  { text: "ACT I — The Incident", delay: 0 },
  { text: "", delay: 900 },
  { text: "The night took a turn no one expected. Each suspect holds a piece of the truth.", delay: 1400 },
  { text: "", delay: 200 },
  { text: "Listen carefully. Motive hides in the details.", delay: 200 },
];

function TypeLine({ text, speed = 28, onDone }) {
  const [idx, setIdx] = useState(0);
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

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

  if (!text) return <br />;
  return <span>{text.slice(0, idx)}</span>;
}

export default function ActIntro({ lines = DEFAULT_LINES, onDone }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 600);
    return () => clearTimeout(t);
  }, []);

  function handleLineDone() {
    const next = lineIdx + 1;
    if (next < lines.length) {
      const line = lines[next];
      setTimeout(() => setLineIdx(next), line.delay);
    } else {
      setFadeOut(true);
      setTimeout(() => onDone?.(), 700);
    }
  }

  return (
    <div className={`case-intro ${fadeOut ? "case-intro--out" : ""}`}>
      <div className="case-intro-content">
        {started && lines.slice(0, lineIdx + 1).map((line, i) => (
          <p key={i} className={`case-intro-line ${i === 0 ? "case-intro-line--header" : ""}`}>
            {i < lineIdx ? (
              line.text ? line.text : <br />
            ) : (
              <TypeLine
                text={line.text}
                speed={i === 0 ? 22 : 28}
                onDone={handleLineDone}
              />
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
