import { useEffect, useState } from "react";
import { useSound } from "../hooks/useSound";
import "../styles/pages/bootScreen.css";

export default function BootScreen({ onDone }) {
  const [phase, setPhase] = useState("line"); // 'line' | 'expand' | 'bright' | 'done'
  const { play } = useSound();

  useEffect(() => {
    // Boot screen ON sound when animation starts
    const timer = setTimeout(() => {
    play("bootScreenOn", { volume: 0.1 });
  }, 500);

    // Phase 1: horizontal line appears (0.5s)
    const t1 = setTimeout(() => setPhase("expand"), 500);
    // Phase 2: line expands to fill screen (0.8s)
    const t2 = setTimeout(() => setPhase("bright"), 1300);
    // Phase 3: hold with scanlines visible (1s) then fade (0.6s)
    const t3 = setTimeout(() => {
      onDone();
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone, play]);

  return (
    <div className={`boot-screen boot-${phase}`}>
      <div className="boot-scanlines" />
      <div className="boot-line" />
    </div>
  );
}
