import React, { useState, useCallback, useRef } from "react";
import { useTimer } from "../hooks/useTimer";
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

const CIRCUMFERENCE = 2 * Math.PI * 52;

export function ExerciseTimer({ targetSec, onTimeRecorded, colors, styles, timerSound }) {
  const [timerMode, setTimerMode] = useState("countdown");
  const recordedRef = useRef(false);

  const handleComplete = useCallback(() => {
    navigator.vibrate?.([100, 50, 100]);
    if (timerSound) playBeep();
    if (!recordedRef.current) {
      recordedRef.current = true;
      onTimeRecorded?.(targetSec || 0);
    }
  }, [timerSound, onTimeRecorded, targetSec]);

  const timer = useTimer(handleComplete);

  const handleStart = useCallback(() => {
    recordedRef.current = false;
    if (timerMode === "countdown") {
      timer.start(targetSec || 30, "countdown");
    } else {
      timer.start(0, "stopwatch");
    }
  }, [timerMode, targetSec, timer]);

  const handleStop = useCallback(() => {
    timer.stop();
    if (timerMode === "stopwatch" && timer.seconds > 0 && !recordedRef.current) {
      recordedRef.current = true;
      navigator.vibrate?.([100, 50, 100]);
      if (timerSound) playBeep();
      onTimeRecorded?.(timer.seconds);
    }
  }, [timer, timerMode, timerSound, onTimeRecorded]);

  const handleReset = useCallback(() => {
    timer.reset();
    recordedRef.current = false;
  }, [timer]);

  const handleToggleMode = useCallback(() => {
    timer.reset();
    recordedRef.current = false;
    setTimerMode((m) => (m === "countdown" ? "stopwatch" : "countdown"));
  }, [timer]);

  // SVG ring progress
  const progress = timerMode === "countdown" && timer.target > 0
    ? Math.min(1, Math.max(0, 1 - timer.seconds / timer.target))
    : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const accentColor = colors.appBg === "#0b0f14" ? "#7dd3fc" : "#2b5b7a";

  return (
    <div style={styles.timerContainer}>
      <button
        type="button"
        onClick={handleToggleMode}
        style={styles.timerModeToggle}
        disabled={timer.isRunning}
      >
        {timerMode === "countdown" ? "Switch to Stopwatch" : "Switch to Countdown"}
      </button>

      <div style={styles.timerRingWrap}>
        <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke={colors.border}
            strokeWidth="6"
          />
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke={accentColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.3s linear" }}
          />
        </svg>
        <div style={{ ...styles.timerDigital, color: colors.text }}>
          {formatTimerDisplay(timer.seconds)}
        </div>
      </div>

      <div style={styles.timerControls}>
        {!timer.isRunning ? (
          <button type="button" style={styles.timerBtnPrimary} onClick={handleStart}>
            {timer.seconds === 0 && timerMode === "countdown" && timer.target > 0 ? "Restart" : "Start"}
          </button>
        ) : (
          <button type="button" style={styles.timerBtnPrimary} onClick={timerMode === "stopwatch" ? handleStop : () => timer.toggle()}>
            {timerMode === "stopwatch" ? "Stop" : "Pause"}
          </button>
        )}
        <button type="button" style={styles.timerBtn} onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
