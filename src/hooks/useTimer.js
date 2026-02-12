import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Reusable timer hook supporting countdown and stopwatch modes.
 * Uses Date.now() arithmetic for accuracy (handles tab backgrounding).
 *
 * @param {Function} onComplete - Called when countdown reaches 0
 * @returns {{ seconds, isRunning, mode, target, progress, elapsed, start, stop, reset, toggle }}
 */
export function useTimer(onComplete) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("countdown"); // "countdown" | "stopwatch"
  const [target, setTarget] = useState(0);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const accumulatedRef = useRef(0);
  const targetRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const modeRef = useRef("countdown");
  const completedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const now = Date.now();
    const elapsed = accumulatedRef.current + (now - startTimeRef.current) / 1000;

    if (modeRef.current === "countdown") {
      const remaining = Math.max(0, targetRef.current - elapsed);
      setSeconds(Math.ceil(remaining));
      if (remaining <= 0 && !completedRef.current) {
        completedRef.current = true;
        clearTimer();
        setIsRunning(false);
        setSeconds(0);
        onCompleteRef.current?.();
      }
    } else {
      setSeconds(Math.floor(elapsed));
    }
  }, [clearTimer]);

  const start = useCallback((targetSec, timerMode) => {
    clearTimer();
    const m = timerMode || "countdown";
    modeRef.current = m;
    setMode(m);
    targetRef.current = targetSec || 0;
    setTarget(targetSec || 0);
    accumulatedRef.current = 0;
    completedRef.current = false;
    startTimeRef.current = Date.now();
    setIsRunning(true);
    setSeconds(m === "countdown" ? Math.ceil(targetSec || 0) : 0);
    intervalRef.current = setInterval(tick, 250);
  }, [clearTimer, tick]);

  const stop = useCallback(() => {
    if (!startTimeRef.current) return;
    accumulatedRef.current += (Date.now() - startTimeRef.current) / 1000;
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    accumulatedRef.current = 0;
    startTimeRef.current = null;
    completedRef.current = false;
    setIsRunning(false);
    setSeconds(modeRef.current === "countdown" ? Math.ceil(targetRef.current) : 0);
  }, [clearTimer]);

  const toggle = useCallback(() => {
    if (isRunning) {
      stop();
    } else {
      if (completedRef.current) {
        // Reset and restart
        accumulatedRef.current = 0;
        completedRef.current = false;
        setSeconds(modeRef.current === "countdown" ? Math.ceil(targetRef.current) : 0);
      }
      startTimeRef.current = Date.now();
      setIsRunning(true);
      intervalRef.current = setInterval(tick, 250);
    }
  }, [isRunning, stop, tick, clearTimer]);

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  const elapsed = accumulatedRef.current + (isRunning && startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0);
  const progress = mode === "countdown" && target > 0
    ? Math.min(1, Math.max(0, 1 - seconds / target))
    : 0;

  return { seconds, isRunning, mode, target, progress, elapsed, start, stop, reset, toggle };
}
