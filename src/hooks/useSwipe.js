import { useRef } from "react";

export function useSwipe({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, thresholdPx = 40 }) {
  const startRef = useRef(null);

  function onTouchStart(e) {
    const t = e.touches?.[0];
    if (t) startRef.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e) {
    const start = startRef.current;
    startRef.current = null;
    const end = e.changedTouches?.[0];
    if (!start || !end) return;

    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;

    // Determine dominant axis
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) < thresholdPx) return;
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    } else {
      if (Math.abs(dy) < thresholdPx) return;
      if (dy < 0) onSwipeUp?.();
      else onSwipeDown?.();
    }
  }

  return { onTouchStart, onTouchEnd };
}
