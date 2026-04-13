import { useState, useRef, useCallback } from "react";

export function useDraggable(initialPos = { x: 0, y: 0 }) {
  const [pos, setPos] = useState(initialPos);
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    // Only drag on left mouse button
    if (e.button !== 0) return;
    dragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...pos };

    const onMouseMove = (e) => {
      if (!dragging.current) return;
      setPos({
        x: startPos.current.x + (e.clientX - startMouse.current.x),
        y: startPos.current.y + (e.clientY - startMouse.current.y),
      });
    };

    const onMouseUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [pos]);

  return { pos, onMouseDown };
}
