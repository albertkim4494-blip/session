import React, { useEffect, useRef, useState, useCallback } from "react";
import { formatTimerDisplay } from "../lib/timerUtils";

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.3;
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

export function RestTimerBar({ restSec, exerciseName, isVisible, onDismiss, onComplete, onRestTimeObserved, styles, colors, timerSound }) {
  const [remaining, setRemaining] = useState(restSec);
  const startTimeRef = useRef(Date.now());
  const intervalRef = useRef(null);
  const completedRef = useRef(false);
  const dismissingRef = useRef(false);

  // Reset when restSec or visibility changes
  useEffect(() => {
    if (!isVisible) return;
    completedRef.current = false;
    dismissingRef.current = false;
    startTimeRef.current = Date.now();
    setRemaining(restSec);

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const left = Math.max(0, restSec - elapsed);
      setRemaining(Math.ceil(left));
      if (left <= 0 && !completedRef.current) {
        completedRef.current = true;
        clearInterval(intervalRef.current);
        navigator.vibrate?.([100, 50, 100]);
        if (timerSound) playBeep();
        onComplete?.();
        // Auto-dismiss after 1s
        setTimeout(() => {
          if (!dismissingRef.current) {
            dismissingRef.current = true;
            onDismiss?.();
          }
        }, 1000);
      }
    }, 250);

    return () => clearInterval(intervalRef.current);
  }, [isVisible, restSec, timerSound, onComplete, onDismiss]);

  const handleDismiss = useCallback(() => {
    if (dismissingRef.current) return;
    dismissingRef.current = true;
    clearInterval(intervalRef.current);
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    if (elapsed >= 5) {
      onRestTimeObserved?.(exerciseName, Math.round(elapsed));
    }
    onDismiss?.();
  }, [exerciseName, onRestTimeObserved, onDismiss]);

  if (!isVisible) return null;

  const progress = restSec > 0 ? Math.max(0, Math.min(1, remaining / restSec)) : 0;

  return (
    <div style={styles.restTimerBar}>
      <span style={{ fontSize: 12, fontWeight: 800, opacity: 0.6, flexShrink: 0 }}>Rest</span>
      <div style={styles.restTimerProgress}>
        <div style={{ ...styles.restTimerProgressFill, width: `${progress * 100}%` }} />
      </div>
      <span style={{ ...styles.restTimerTime, color: colors.text }}>
        {formatTimerDisplay(remaining)}
      </span>
      <button type="button" style={styles.restTimerDismiss} onClick={handleDismiss} aria-label="Dismiss rest timer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
