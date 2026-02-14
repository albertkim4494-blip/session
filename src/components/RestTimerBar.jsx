import React, { useEffect, useRef, useState, useCallback } from "react";
import { formatTimerDisplay } from "../lib/timerUtils";
import { playTimerSound } from "../lib/timerSounds";

const ADJUST_STEP = 15; // seconds per tap
const MIN_REST = 15;
const MAX_REST = 300;

export function RestTimerBar({ restSec, exerciseName, isVisible, onDismiss, onComplete, onRestTimeObserved, onRestTimeAdjust, styles, colors, timerSound, timerSoundType, restTimerSoundType }) {
  const [remaining, setRemaining] = useState(restSec);
  const totalRef = useRef(restSec);     // tracks adjusted total for progress bar
  const startTimeRef = useRef(Date.now());
  const intervalRef = useRef(null);
  const autoDismissRef = useRef(null);
  const completedRef = useRef(false);
  const dismissingRef = useRef(false);

  // Stable refs for callbacks to avoid useEffect re-runs
  const onDismissRef = useRef(onDismiss);
  const onCompleteRef = useRef(onComplete);
  const onRestTimeObservedRef = useRef(onRestTimeObserved);
  const onRestTimeAdjustRef = useRef(onRestTimeAdjust);
  useEffect(() => { onDismissRef.current = onDismiss; }, [onDismiss]);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => { onRestTimeObservedRef.current = onRestTimeObserved; }, [onRestTimeObserved]);
  useEffect(() => { onRestTimeAdjustRef.current = onRestTimeAdjust; }, [onRestTimeAdjust]);

  useEffect(() => {
    if (!isVisible) return;
    completedRef.current = false;
    dismissingRef.current = false;
    startTimeRef.current = Date.now();
    totalRef.current = restSec;
    setRemaining(restSec);

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const left = Math.max(0, totalRef.current - elapsed);
      setRemaining(Math.ceil(left));
      if (left <= 0 && !completedRef.current) {
        completedRef.current = true;
        clearInterval(intervalRef.current);
        navigator.vibrate?.([100, 50, 100]);
        if (timerSound) playTimerSound(restTimerSoundType || timerSoundType || "beep");
        // Save adjusted duration as observed rest time
        if (totalRef.current !== restSec) {
          onRestTimeObservedRef.current?.(exerciseName, totalRef.current);
        }
        onCompleteRef.current?.();
        autoDismissRef.current = setTimeout(() => {
          if (!dismissingRef.current) {
            dismissingRef.current = true;
            onDismissRef.current?.();
          }
        }, 1000);
      }
    }, 250);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(autoDismissRef.current);
    };
  }, [isVisible, restSec, timerSound, timerSoundType, restTimerSoundType, exerciseName]);

  const handleAdjust = useCallback((delta) => {
    if (completedRef.current) return;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const newTotal = Math.max(MIN_REST, Math.min(MAX_REST, totalRef.current + delta));
    // Don't allow adjusting below elapsed time
    if (newTotal <= elapsed) return;
    totalRef.current = newTotal;
    setRemaining(Math.ceil(newTotal - elapsed));
    onRestTimeAdjustRef.current?.(newTotal);
  }, []);

  const handleDismiss = useCallback(() => {
    if (dismissingRef.current) return;
    dismissingRef.current = true;
    clearInterval(intervalRef.current);
    clearTimeout(autoDismissRef.current);
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    if (elapsed >= 5) {
      onRestTimeObservedRef.current?.(exerciseName, Math.round(elapsed));
    }
    onDismissRef.current?.();
  }, [exerciseName]);

  if (!isVisible) return null;

  const total = totalRef.current;
  const progress = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;

  const adjBtnStyle = {
    width: 28, height: 28, borderRadius: 8,
    border: `1px solid ${colors.border}`,
    background: colors.cardBg,
    color: colors.text,
    fontSize: 16, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", padding: 0, flexShrink: 0,
    opacity: completedRef.current ? 0.3 : 0.7,
  };

  return (
    <div style={styles.restTimerBar}>
      <span style={{ fontSize: 12, fontWeight: 800, opacity: 0.6, flexShrink: 0 }}>Rest</span>
      <button type="button" style={adjBtnStyle} onClick={() => handleAdjust(-ADJUST_STEP)} aria-label="Reduce rest time">−</button>
      <div style={styles.restTimerProgress}>
        <div style={{ ...styles.restTimerProgressFill, width: `${progress * 100}%` }} />
      </div>
      <span style={{ ...styles.restTimerTime, color: colors.text }}>
        {formatTimerDisplay(remaining)}
      </span>
      <button type="button" style={adjBtnStyle} onClick={() => handleAdjust(ADJUST_STEP)} aria-label="Increase rest time">+</button>
      <button type="button" style={styles.restTimerDismiss} onClick={handleDismiss} aria-label="Dismiss rest timer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
