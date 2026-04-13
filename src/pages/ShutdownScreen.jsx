import { useEffect, useState } from "react";
import "../styles/pages/shutdownScreen.css";

export default function ShutdownScreen({ onDone }) {
  const [phase, setPhase] = useState("bright"); // 'bright' | 'collapse' | 'line' | 'done'

  useEffect(() => {
    // Phase 1: bright hold with scanlines (0.4s)
    const t1 = setTimeout(() => setPhase("collapse"), 400);
    // Phase 2: collapse to horizontal line (0.8s)
    const t2 = setTimeout(() => setPhase("line"), 1200);
    // Phase 3: line shrinks and fades (0.6s)
    const t3 = setTimeout(() => onDone(), 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <div className={`shutdown-screen shutdown-${phase}`}>
      <div className="shutdown-scanlines" />
      <div className="shutdown-line" />
    </div>
  );
}
