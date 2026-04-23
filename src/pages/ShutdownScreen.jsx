import { useEffect, useMemo, useState } from "react";
import { useSound } from "../hooks/useSound";
import "../styles/pages/shutdownScreen.css";

export default function ShutdownScreen({ onDone, variant = "default" }) {
  const [phase, setPhase] = useState("bright"); // 'bright' | 'collapse' | 'line' | 'done'
  const { play } = useSound();
  const theme = useMemo(() => {
    if (variant === "act3") {
      return {
        bg: "#662020",
        exitBg: "#141414",
        line: "#f5d8cf",
        glow: "rgba(245, 216, 207, 0.5)",
        shadow: "rgba(102, 32, 32, 0.65)",
      };
    }

    return {
      bg: "var(--color-accent-dark, #0d0d0d)",
      exitBg: "var(--color-accent-dark, #0d0d0d)",
      line: "var(--color-secondary, #3d655e)",
      glow: "rgba(61, 101, 94, 0.6)",
      shadow: "rgba(61, 101, 94, 0.3)",
    };
  }, [variant]);

  useEffect(() => {
    // Play boot screen OFF sound when shutdown starts
    play("bootScreenOff", { volume: 0.1 });

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
  }, [onDone, play]);

  return (
    <div
      className={`shutdown-screen shutdown-${phase} shutdown-screen--${variant}`}
      style={{
        "--shutdown-bg": theme.bg,
        "--shutdown-exit-bg": theme.exitBg,
        "--shutdown-line": theme.line,
        "--shutdown-glow": theme.glow,
        "--shutdown-shadow": theme.shadow,
      }}
    >
      <div className="shutdown-scanlines" />
      <div className="shutdown-line" />
    </div>
  );
}
