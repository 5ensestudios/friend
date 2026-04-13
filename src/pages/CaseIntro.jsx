import { useState, useEffect, useRef } from "react";
import "../styles/pages/caseIntro.css";

const LINES = [
  { text: "INCIDENT: Fatal Respiratory Failure / Acute Zolpidem Toxicity", delay: 0 },
  { text: "", delay: 900 },
  {
    text: "At 02:14 AM, emergency services responded to a 911 call from a residential gathering. Upon arrival, paramedics found the victim, Chris, unresponsive. Four \"friends\" were found at the scene, their clothes stained with spilled soda and their stories perfectly aligned.",
    delay: 1400,
  },
  { text: "", delay: 200 },
  {
    text: "They call it a prank — a harmless attempt to get back at a \"friend\". The toxicology report suggests otherwise. Two pills are a prank. Six pills are a statement.",
    delay: 200,
  },
  { text: "", delay: 200 },
  {
    text: "The footage has been recovered. The cloud data is yours to navigate.",
    delay: 200,
  },
  { text: "", delay: 1200 },
  { text: "— YOUR OBJECTIVE —", delay: 200 },
  { text: "", delay: 200 },
  {
    text: "Interview each suspect across three acts. In each round you may only choose two of the four to question. Listen carefully — contradictions reveal motive, and motive reveals guilt.",
    delay: 200,
  },
  { text: "", delay: 200 },
  {
    text: "Determine who among them intended for Chris to die.",
    delay: 200,
  },
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

export default function CaseIntro({ onDone }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Small initial delay before first line
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 600);
    return () => clearTimeout(t);
  }, []);

  function handleLineDone() {
    const next = lineIdx + 1;
    if (next < LINES.length) {
      const line = LINES[next];
      setTimeout(() => setLineIdx(next), line.delay);
    } else {
      setFinished(true);
    }
  }

  function handleProceed() {
    setFadeOut(true);
    setTimeout(() => onDone(), 700);
  }

  return (
    <div className={`case-intro ${fadeOut ? "case-intro--out" : ""}`}>
      <div className="case-intro-content">
        {started && LINES.slice(0, lineIdx + 1).map((line, i) => (
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
        {finished && (
          <button className="case-intro-proceed" onClick={handleProceed}>
            begin investigation
          </button>
        )}
      </div>
    </div>
  );
}
