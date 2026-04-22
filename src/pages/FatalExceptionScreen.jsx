import { useEffect, useMemo, useState } from "react";
import "../styles/pages/fatalExceptionScreen.css";

const COUNTDOWN_START = 3;

export default function FatalExceptionScreen({ onDone }) {
  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const [phase, setPhase] = useState("enter"); // 'enter' | 'countdown' | 'exit'

  const countdownLabel = useMemo(() => `${countdown}...`, [countdown]);

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase("countdown"), 700);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase("exit");
          setTimeout(() => onDone?.(), 700);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(enterTimer);
      clearInterval(interval);
    };
  }, [onDone]);

  return (
    <div className={`fatal-exception fatal-exception--${phase}`} role="dialog" aria-live="polite">
      <div className="fatal-exception-crack fatal-exception-crack--one" />
      <div className="fatal-exception-crack fatal-exception-crack--two" />
      <div className="fatal-exception-crack fatal-exception-crack--three" />
      <div className="fatal-exception-glitch fatal-exception-glitch--one" />
      <div className="fatal-exception-glitch fatal-exception-glitch--two" />
      <div className="fatal-exception-glitch fatal-exception-glitch--three" />
      <div className="fatal-exception-card">
        <h1 className="fatal-exception-title">Fatal Exception</h1>
        <p className="fatal-exception-copy">
          Bit rot threshold exceeded. Core directory compromised. Data integrity at 0%.
        </p>
        <p className="fatal-exception-countdown">
          Terminating session in {countdownLabel}
        </p>
      </div>
    </div>
  );
}