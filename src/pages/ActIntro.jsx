import { useState, useEffect, useRef } from "react";
import { useSound } from "../hooks/useSound";
import "../styles/pages/caseIntro.css";

function normalizeIntroContent(lines) {
  const textLines = (lines || [])
    .map(line => (typeof line?.text === "string" ? line.text.trim() : ""))
    .filter(Boolean);

  if (!textLines.length) {
    return {
      title: "INTRODUCTION",
      subtitle: "The First Interviews",
      description: "Meet the victim's friends, establish who they are.",
    };
  }

  return {
    title: textLines[0] || "INTRODUCTION",
    subtitle: textLines[1] || "",
    description: textLines[2] || "",
  };
}

export default function ActIntro({ onDone, lines = [] }) {
  const [fadeOut, setFadeOut] = useState(false);
  const onDoneRef = useRef(onDone);
  const { play } = useSound();
  const { title, subtitle, description } = normalizeIntroContent(lines);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    play("radioChirp");
    const fadeTimer = setTimeout(() => setFadeOut(true), 5000);
    const doneTimer = setTimeout(() => onDoneRef.current?.(), 5700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [play]);

  return (
    <div className={`case-intro case-intro--title ${fadeOut ? "case-intro--out" : ""}`}>
      <div className="case-intro-content">
        <h1 className="case-intro-title">{title}</h1>
        {subtitle && <p className="case-intro-subtitle">{subtitle}</p>}
        {description && <p className="case-intro-desc">{description}</p>}
      </div>
    </div>
  );
}
