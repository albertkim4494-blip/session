import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useTimer } from "../hooks/useTimer";
import { formatTimerDisplay } from "../lib/timerUtils";
import { isSetCompleted } from "../lib/setHelpers";
import { PillTabs } from "./PillTabs";

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
    osc.onended = () => ctx.close();
  } catch {}
}

const CIRCUMFERENCE = 2 * Math.PI * 52;

const MODE_TABS = [
  { value: "countdown", label: "Countdown" },
  { value: "stopwatch", label: "Stopwatch" },
];

export function ExerciseTimer({ sets, savedSets, onTimerComplete, colors, styles, timerSound, autoStart, onAutoStartChange, autoStartSignal }) {
  const [mode, setMode] = useState("countdown");
  const completedRef = useRef(false);
  const lastSignalRef = useRef(autoStartSignal || 0);

  // Find first uncompleted set — check modal sets against saved state
  const activeSetIndex = useMemo(() => {
    if (!sets?.length) return -1;
    for (let i = 0; i < sets.length; i++) {
      if (!savedSets?.[i] || !isSetCompleted(savedSets[i])) return i;
    }
    return -1;
  }, [sets, savedSets]);

  // Timer target from the active set's reps input
  const targetSec = activeSetIndex >= 0 ? (Number(sets[activeSetIndex]?.reps) || 0) : 0;

  const handleComplete = useCallback(() => {
    navigator.vibrate?.([100, 50, 100]);
    if (timerSound) playBeep();
    if (!completedRef.current) {
      completedRef.current = true;
      onTimerComplete?.(activeSetIndex, targetSec);
    }
  }, [timerSound, onTimerComplete, activeSetIndex, targetSec]);

  const timer = useTimer(handleComplete);

  const handleStart = useCallback(() => {
    completedRef.current = false;
    if (mode === "countdown") {
      timer.start(targetSec || 30, "countdown");
    } else {
      timer.start(0, "stopwatch");
    }
  }, [mode, targetSec, timer]);

  // Auto-start when signal changes (rest timer completed/dismissed)
  useEffect(() => {
    if (!autoStart || !autoStartSignal) return;
    if (autoStartSignal > lastSignalRef.current) {
      lastSignalRef.current = autoStartSignal;
      // Short delay so the new activeSetIndex has propagated
      const t = setTimeout(() => {
        if (activeSetIndex >= 0 && targetSec > 0 && mode === "countdown") {
          completedRef.current = false;
          timer.start(targetSec, "countdown");
        }
      }, 300);
      return () => clearTimeout(t);
    }
  }, [autoStartSignal, autoStart, activeSetIndex, targetSec, mode, timer]);

  const handleStop = useCallback(() => {
    timer.stop();
    if (mode === "stopwatch" && timer.seconds > 0 && !completedRef.current) {
      completedRef.current = true;
      navigator.vibrate?.([100, 50, 100]);
      if (timerSound) playBeep();
      onTimerComplete?.(activeSetIndex, timer.seconds);
    }
  }, [timer, mode, timerSound, onTimerComplete, activeSetIndex]);

  const handleReset = useCallback(() => {
    timer.reset();
    completedRef.current = false;
  }, [timer]);

  const handleModeChange = useCallback((newMode) => {
    timer.reset();
    completedRef.current = false;
    setMode(newMode);
  }, [timer]);

  const allDone = activeSetIndex === -1;
  const startDisabled = allDone || (mode === "countdown" && targetSec === 0);

  // SVG ring progress
  const displaySec = timer.isRunning || timer.seconds > 0 ? timer.seconds : (mode === "countdown" ? targetSec : 0);
  const progress = mode === "countdown" && (timer.target > 0 || targetSec > 0)
    ? Math.min(1, Math.max(0, 1 - displaySec / (timer.target || targetSec || 1)))
    : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const accentColor = colors.appBg === "#0d1117" ? "#7dd3fc" : "#2b5b7a";

  // Compact pill styles for timer mode toggle
  const pillStyles = {
    pillRow: { ...styles.pillRow, marginBottom: 6, gap: 4 },
    pill: { ...styles.pill, padding: "6px 10px", fontSize: 12 },
    pillActive: styles.pillActive,
    pillInactive: styles.pillInactive,
  };

  const startLabel = allDone ? "All done" : "Start";

  return (
    <div style={styles.timerContainer}>
      <PillTabs
        tabs={MODE_TABS}
        value={mode}
        onChange={handleModeChange}
        styles={pillStyles}
      />

      {activeSetIndex >= 0 && (
        <div style={{ fontSize: 11, opacity: 0.5, fontWeight: 700, marginTop: -4 }}>
          Set {activeSetIndex + 1}
        </div>
      )}

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
          {formatTimerDisplay(displaySec)}
        </div>
      </div>

      <div style={styles.timerControls}>
        {!timer.isRunning ? (
          <button
            type="button"
            style={{
              ...styles.timerBtnPrimary,
              ...(startDisabled ? { opacity: 0.4, cursor: "default" } : {}),
            }}
            onClick={handleStart}
            disabled={startDisabled}
          >
            {startLabel}
          </button>
        ) : (
          <button
            type="button"
            style={styles.timerBtnPrimary}
            onClick={mode === "stopwatch" ? handleStop : () => timer.toggle()}
          >
            {mode === "stopwatch" ? "Stop" : "Pause"}
          </button>
        )}
        <button
          type="button"
          style={{
            ...styles.timerBtn,
            ...(allDone ? { opacity: 0.4, cursor: "default" } : {}),
          }}
          onClick={handleReset}
          disabled={allDone}
        >
          Reset
        </button>
      </div>

      {/* Auto-start toggle */}
      <label style={{
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 12, opacity: 0.6, cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
      }}>
        <input
          type="checkbox"
          checked={!!autoStart}
          onChange={(e) => onAutoStartChange?.(e.target.checked)}
          style={{ width: 16, height: 16, margin: 0 }}
        />
        Auto-start next set
      </label>
    </div>
  );
}
