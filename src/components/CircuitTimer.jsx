import React, { useReducer, useEffect, useRef, useCallback, useMemo, useState } from "react";
import { useTimer } from "../hooks/useTimer";
import { playTimerSound } from "../lib/timerSounds";
import { parseScheme } from "../lib/workoutGenerator";
import { isSetCompleted } from "../lib/setHelpers";
import { getUnit, getWeightLabel } from "../lib/constants";

// ---------------------------------------------------------------------------
// localStorage config persistence
// ---------------------------------------------------------------------------
const CONFIG_KEY = "wt_circuit_config";

function loadConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      const c = JSON.parse(raw);
      return {
        rounds: Math.min(5, Math.max(1, c.rounds || 3)),
        restBetweenExercises: Math.min(120, Math.max(15, c.restBetweenExercises || 60)),
        restBetweenRounds: Math.min(180, Math.max(30, c.restBetweenRounds || 120)),
      };
    }
  } catch {}
  return { rounds: 3, restBetweenExercises: 60, restBetweenRounds: 120 };
}

function saveConfig(cfg) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  } catch {}
}

// ---------------------------------------------------------------------------
// State machine reducer
// ---------------------------------------------------------------------------
const GET_READY_SEC = 5;

function circuitReducer(state, action) {
  switch (action.type) {
    case "SET_CONFIG":
      return { ...state, ...action.payload };
    case "START":
      return {
        ...state,
        phase: "get-ready",
        currentExerciseIndex: 0,
        currentRound: 1,
        paused: false,
        workElapsed: 0,
        totalStartTime: Date.now(),
      };
    case "BEGIN_WORK":
      return { ...state, phase: "work", workElapsed: 0 };
    case "DONE_SET": {
      const { exerciseCount, totalRounds } = state;
      const isLastExercise = state.currentExerciseIndex >= exerciseCount - 1;
      const isLastRound = state.currentRound >= totalRounds;
      if (isLastExercise && isLastRound) {
        return { ...state, phase: "complete", totalEndTime: Date.now() };
      }
      if (isLastExercise) {
        return { ...state, phase: "round-rest" };
      }
      return { ...state, phase: "rest" };
    }
    case "REST_DONE": {
      return {
        ...state,
        phase: "get-ready",
        currentExerciseIndex: state.currentExerciseIndex + 1,
        workElapsed: 0,
      };
    }
    case "ROUND_REST_DONE":
      return {
        ...state,
        phase: "get-ready",
        currentExerciseIndex: 0,
        currentRound: state.currentRound + 1,
        workElapsed: 0,
      };
    case "TOGGLE_PAUSE":
      return { ...state, paused: !state.paused };
    case "UPDATE_WORK_ELAPSED":
      return { ...state, workElapsed: action.payload };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getLastSetsText(exerciseId, existingLogs, findPrior, measurementSystem) {
  // Check current-day logs first, then prior days
  const log = existingLogs?.[exerciseId] || findPrior?.(exerciseId);
  if (!log?.sets?.length) return null;
  const wLabel = getWeightLabel(measurementSystem);
  return log.sets
    .filter((s) => Number(s.reps) > 0)
    .map((s) => {
      const w = String(s.weight || "").toUpperCase() === "BW" ? "BW" : s.weight;
      return `${s.reps}\u00d7${w || 0}`;
    })
    .join(", ");
}

function estimateMinutes(exercises, rounds, restEx, restRound) {
  // Rough: 45s avg work + rest per exercise, plus round rest
  const workPerExercise = 45;
  const perRound = exercises * (workPerExercise + restEx);
  const total = perRound * rounds + restRound * (rounds - 1);
  return Math.round(total / 60);
}

// ---------------------------------------------------------------------------
// CircuitTimer Component
// ---------------------------------------------------------------------------
export function CircuitTimer({
  workout,
  dateKey,
  existingLogs,
  onCompleteSet,
  onClose,
  colors,
  styles,
  timerSoundEnabled,
  timerSoundType,
  findPrior,
  measurementSystem,
}) {
  const exercises = workout.exercises || [];
  const savedCfg = useMemo(loadConfig, []);

  const [state, dispatch] = useReducer(circuitReducer, {
    phase: "config",
    currentExerciseIndex: 0,
    currentRound: 1,
    totalRounds: savedCfg.rounds,
    restBetweenExercises: savedCfg.restBetweenExercises,
    restBetweenRounds: savedCfg.restBetweenRounds,
    exerciseCount: exercises.length,
    paused: false,
    workElapsed: 0,
    totalStartTime: null,
    totalEndTime: null,
  });

  const { phase, currentExerciseIndex, currentRound, totalRounds,
    restBetweenExercises, restBetweenRounds, paused } = state;

  const currentExercise = exercises[currentExerciseIndex] || null;
  const nextExerciseIndex = currentExerciseIndex + 1 < exercises.length ? currentExerciseIndex + 1 : 0;
  const nextExercise = exercises[nextExerciseIndex] || null;
  const setIndex = currentRound - 1; // round 1 = set 0

  // Track total sets logged
  const setsLoggedRef = useRef(0);

  // Reps/weight input state for work phase
  const [repsInput, setRepsInput] = useState("");
  const [weightInput, setWeightInput] = useState("");

  // Pre-fill reps/weight when exercise changes
  useEffect(() => {
    if (phase !== "get-ready" && phase !== "work") return;
    if (!currentExercise) return;

    const exId = currentExercise.id;
    const dayLog = existingLogs?.[exId];
    const priorLog = findPrior?.(exId);
    const log = dayLog || priorLog;

    if (log?.sets?.[setIndex]) {
      setRepsInput(String(log.sets[setIndex].reps || ""));
      setWeightInput(String(log.sets[setIndex].weight || ""));
    } else if (log?.sets?.length > 0) {
      // Use last set as template
      const last = log.sets[log.sets.length - 1];
      setRepsInput(String(last.reps || ""));
      setWeightInput(String(last.weight || ""));
    } else {
      // Try scheme
      const scheme = parseScheme(currentExercise.scheme || workout.scheme);
      setRepsInput(scheme ? String(scheme.reps) : "");
      setWeightInput("");
    }
  }, [currentExerciseIndex, currentRound, phase]);

  // ---------------------------------------------------------------------------
  // Timers
  // ---------------------------------------------------------------------------

  const onGetReadyComplete = useCallback(() => {
    if (timerSoundEnabled) playTimerSound(timerSoundType || "beep");
    navigator.vibrate?.([100, 50, 100]);
    dispatch({ type: "BEGIN_WORK" });
  }, [timerSoundEnabled, timerSoundType]);

  const onRestComplete = useCallback(() => {
    if (timerSoundEnabled) playTimerSound(timerSoundType || "chime");
    navigator.vibrate?.([100, 50, 100]);
    dispatch({ type: "REST_DONE" });
  }, [timerSoundEnabled, timerSoundType]);

  const onRoundRestComplete = useCallback(() => {
    if (timerSoundEnabled) playTimerSound(timerSoundType || "chime");
    navigator.vibrate?.([200, 100, 200]);
    dispatch({ type: "ROUND_REST_DONE" });
  }, [timerSoundEnabled, timerSoundType]);

  const getReadyTimer = useTimer(onGetReadyComplete);
  const workTimer = useTimer(null); // stopwatch, no auto-complete
  const restTimer = useTimer(onRestComplete);
  const roundRestTimer = useTimer(onRoundRestComplete);

  // Countdown beeps during last 3 seconds of get-ready
  const lastBeepRef = useRef(0);
  useEffect(() => {
    if (phase !== "get-ready" || !getReadyTimer.isRunning) return;
    if (getReadyTimer.seconds <= 3 && getReadyTimer.seconds > 0 && getReadyTimer.seconds !== lastBeepRef.current) {
      lastBeepRef.current = getReadyTimer.seconds;
      if (timerSoundEnabled) playTimerSound("beep");
      navigator.vibrate?.(10);
    }
  }, [phase, getReadyTimer.seconds, getReadyTimer.isRunning, timerSoundEnabled]);

  // Phase-driven timer starts
  useEffect(() => {
    if (phase === "get-ready") {
      lastBeepRef.current = 0;
      navigator.vibrate?.(10);
      getReadyTimer.start(GET_READY_SEC, "countdown");
    } else if (phase === "work") {
      workTimer.start(0, "stopwatch");
    } else if (phase === "rest") {
      restTimer.start(restBetweenExercises, "countdown");
    } else if (phase === "round-rest") {
      roundRestTimer.start(restBetweenRounds, "countdown");
    }
  }, [phase, currentExerciseIndex, currentRound]);

  // Pause/resume
  useEffect(() => {
    if (phase === "work") {
      if (paused && workTimer.isRunning) workTimer.stop();
      else if (!paused && !workTimer.isRunning && phase === "work") workTimer.toggle();
    }
    if (phase === "rest") {
      if (paused && restTimer.isRunning) restTimer.stop();
      else if (!paused && !restTimer.isRunning) restTimer.toggle();
    }
    if (phase === "round-rest") {
      if (paused && roundRestTimer.isRunning) roundRestTimer.stop();
      else if (!paused && !roundRestTimer.isRunning) roundRestTimer.toggle();
    }
    if (phase === "get-ready") {
      if (paused && getReadyTimer.isRunning) getReadyTimer.stop();
      else if (!paused && !getReadyTimer.isRunning) getReadyTimer.toggle();
    }
  }, [paused]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const handleDone = useCallback(() => {
    const reps = Number(repsInput) || 0;
    if (reps <= 0) return; // need at least reps

    const weight = weightInput.trim();
    onCompleteSet(currentExercise.id, setIndex, { reps, weight }, workout.id);
    setsLoggedRef.current += 1;

    if (timerSoundEnabled && (currentExerciseIndex >= exercises.length - 1 && currentRound >= totalRounds)) {
      // Circuit complete sound
      playTimerSound(timerSoundType || "chime");
      navigator.vibrate?.([200, 100, 200, 100, 200]);
    }

    dispatch({ type: "DONE_SET" });
  }, [repsInput, weightInput, currentExercise, setIndex, workout.id, onCompleteSet,
      currentExerciseIndex, exercises.length, currentRound, totalRounds, timerSoundEnabled, timerSoundType]);

  const handleSkipRest = useCallback(() => {
    if (phase === "rest") {
      restTimer.stop();
      onRestComplete();
    } else if (phase === "round-rest") {
      roundRestTimer.stop();
      onRoundRestComplete();
    }
  }, [phase, restTimer, roundRestTimer, onRestComplete, onRoundRestComplete]);

  // Confirm stop
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  const handleStop = useCallback(() => {
    setShowStopConfirm(true);
  }, []);

  const confirmStop = useCallback(() => {
    setShowStopConfirm(false);
    onClose();
  }, [onClose]);

  // Total elapsed time for complete screen
  const totalElapsed = state.totalEndTime && state.totalStartTime
    ? Math.round((state.totalEndTime - state.totalStartTime) / 1000)
    : 0;

  // ---------------------------------------------------------------------------
  // Overlay styles
  // ---------------------------------------------------------------------------
  const overlay = {
    position: "fixed",
    inset: 0,
    zIndex: 10000,
    background: colors?.appBg || "#111",
    color: colors?.text || "#fff",
    display: "flex",
    flexDirection: "column",
    fontFamily: "inherit",
    overflow: "auto",
  };

  const center = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 24,
    gap: 16,
    textAlign: "center",
  };

  const bigNumber = {
    fontSize: 72,
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
    lineHeight: 1,
  };

  const medNumber = {
    fontSize: 48,
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
    lineHeight: 1,
  };

  const phaseLabel = {
    fontSize: 14,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    opacity: 0.6,
  };

  const exerciseName = {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.2,
  };

  const subText = {
    fontSize: 14,
    opacity: 0.5,
    lineHeight: 1.4,
  };

  const headerBar = {
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 13,
    fontWeight: 600,
    opacity: 0.6,
    flexShrink: 0,
  };

  const primaryBtn = {
    padding: "14px 32px",
    borderRadius: 12,
    border: "none",
    background: colors?.accent || "#4fc3f7",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    minWidth: 180,
  };

  const secondaryBtn = {
    padding: "10px 24px",
    borderRadius: 10,
    border: `1px solid ${colors?.border || "#333"}`,
    background: "transparent",
    color: colors?.text || "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  };

  const inputStyle = {
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid ${colors?.border || "#333"}`,
    background: colors?.inputBg || "rgba(255,255,255,0.08)",
    color: colors?.text || "#fff",
    fontSize: 20,
    fontWeight: 600,
    textAlign: "center",
    width: 90,
    fontFamily: "inherit",
    fontVariantNumeric: "tabular-nums",
  };

  const progressBarBg = {
    width: "100%",
    maxWidth: 300,
    height: 6,
    borderRadius: 3,
    background: colors?.border || "#333",
    overflow: "hidden",
  };

  // ---------------------------------------------------------------------------
  // Config phase
  // ---------------------------------------------------------------------------
  if (phase === "config") {
    const est = estimateMinutes(exercises.length, totalRounds, restBetweenExercises, restBetweenRounds);

    const stepperRow = (label, value, min, max, step, onChange) => (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 300, padding: "8px 0" }}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            style={{ ...secondaryBtn, padding: "6px 14px", fontSize: 18, lineHeight: 1, opacity: value <= min ? 0.3 : 1 }}
            onClick={() => value > min && onChange(value - step)}
            disabled={value <= min}
          >&minus;</button>
          <span style={{ fontSize: 18, fontWeight: 700, minWidth: 50, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
            {label.includes("rest") || label.includes("Rest") ? `${value}s` : value}
          </span>
          <button
            style={{ ...secondaryBtn, padding: "6px 14px", fontSize: 18, lineHeight: 1, opacity: value >= max ? 0.3 : 1 }}
            onClick={() => value < max && onChange(value + step)}
            disabled={value >= max}
          >+</button>
        </div>
      </div>
    );

    return (
      <div style={overlay}>
        <div style={center}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
            {workout.name}
          </div>

          {stepperRow("Rounds", totalRounds, 1, 5, 1, (v) =>
            dispatch({ type: "SET_CONFIG", payload: { totalRounds: v } })
          )}
          {stepperRow("Exercise rest", restBetweenExercises, 15, 120, 15, (v) =>
            dispatch({ type: "SET_CONFIG", payload: { restBetweenExercises: v } })
          )}
          {stepperRow("Round rest", restBetweenRounds, 30, 180, 30, (v) =>
            dispatch({ type: "SET_CONFIG", payload: { restBetweenRounds: v } })
          )}

          <div style={{ ...subText, marginTop: 8 }}>
            {exercises.length} exercise{exercises.length !== 1 ? "s" : ""} &times; {totalRounds} round{totalRounds !== 1 ? "s" : ""}
            <br />
            Est. ~{est} min
          </div>

          <button
            className="btn-press"
            style={{ ...primaryBtn, marginTop: 16 }}
            onClick={() => {
              saveConfig({ rounds: totalRounds, restBetweenExercises, restBetweenRounds });
              dispatch({ type: "START" });
            }}
          >
            Start Circuit
          </button>
          <button style={{ ...secondaryBtn, marginTop: 4 }} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Get Ready phase
  // ---------------------------------------------------------------------------
  if (phase === "get-ready") {
    const lastText = getLastSetsText(currentExercise?.id, existingLogs, findPrior, measurementSystem);
    return (
      <div style={overlay}>
        <div style={headerBar}>
          <span>Round {currentRound}/{totalRounds}</span>
          <span>Exercise {currentExerciseIndex + 1}/{exercises.length}</span>
        </div>
        <div style={center}>
          <div style={phaseLabel}>Get Ready</div>
          <div style={bigNumber}>{getReadyTimer.seconds}</div>
          <div style={exerciseName}>{currentExercise?.name}</div>
          <div style={subText}>Set {currentRound} of {totalRounds}</div>
          {lastText && <div style={subText}>Last: {lastText}</div>}
        </div>
        {/* Pause overlay */}
        {paused && <PauseOverlay colors={colors} onResume={() => dispatch({ type: "TOGGLE_PAUSE" })} />}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Work phase
  // ---------------------------------------------------------------------------
  if (phase === "work") {
    const exUnit = getUnit(currentExercise?.unit, currentExercise);
    const isTimeUnit = currentExercise?.unit === "sec" || currentExercise?.unit === "min";
    const nextText = currentExerciseIndex < exercises.length - 1
      ? exercises[currentExerciseIndex + 1]?.name
      : currentRound < totalRounds ? exercises[0]?.name : null;

    return (
      <div style={overlay}>
        <div style={headerBar}>
          <button
            style={{ ...secondaryBtn, padding: "6px 14px", fontSize: 12 }}
            onClick={() => dispatch({ type: "TOGGLE_PAUSE" })}
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <span>Round {currentRound}/{totalRounds}</span>
        </div>
        <div style={center}>
          <div style={exerciseName}>{currentExercise?.name}</div>
          <div style={subText}>Set {currentRound} of {totalRounds}</div>

          <div style={medNumber}>{formatTime(workTimer.seconds)}</div>

          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <label style={{ fontSize: 12, opacity: 0.5, fontWeight: 600 }}>
                {isTimeUnit ? exUnit.label : "Reps"}
              </label>
              <input
                type="number"
                inputMode="numeric"
                style={inputStyle}
                value={repsInput}
                onChange={(e) => setRepsInput(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <label style={{ fontSize: 12, opacity: 0.5, fontWeight: 600 }}>Weight</label>
              <input
                type="text"
                inputMode="decimal"
                style={inputStyle}
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="BW"
              />
            </div>
          </div>

          <button
            className="btn-press"
            style={{ ...primaryBtn, marginTop: 16, fontSize: 18 }}
            onClick={handleDone}
          >
            Done
          </button>

          {nextText && <div style={{ ...subText, marginTop: 8 }}>Next: {nextText}</div>}
        </div>

        <div style={{ padding: "12px 16px", textAlign: "center", flexShrink: 0 }}>
          <button style={{ ...secondaryBtn, fontSize: 12, opacity: 0.6 }} onClick={handleStop}>
            Stop
          </button>
        </div>

        {paused && <PauseOverlay colors={colors} onResume={() => dispatch({ type: "TOGGLE_PAUSE" })} />}
        {showStopConfirm && (
          <ConfirmOverlay
            colors={colors}
            message="End circuit? Progress is already saved."
            onConfirm={confirmStop}
            onCancel={() => setShowStopConfirm(false)}
          />
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Rest phase
  // ---------------------------------------------------------------------------
  if (phase === "rest" || phase === "round-rest") {
    const isRoundRest = phase === "round-rest";
    const timer = isRoundRest ? roundRestTimer : restTimer;
    const totalSec = isRoundRest ? restBetweenRounds : restBetweenExercises;
    const progress = totalSec > 0 ? Math.max(0, Math.min(1, 1 - timer.seconds / totalSec)) : 0;

    const upNextEx = isRoundRest ? exercises[0] : exercises[currentExerciseIndex + 1];
    const upNextText = getLastSetsText(upNextEx?.id, existingLogs, findPrior, measurementSystem);

    return (
      <div style={overlay}>
        <div style={headerBar}>
          <span>Round {currentRound}/{totalRounds}</span>
          <span>{isRoundRest ? "Round Rest" : "Rest"}</span>
        </div>
        <div style={center}>
          <div style={medNumber}>{formatTime(timer.seconds)}</div>
          <div style={progressBarBg}>
            <div style={{
              width: `${progress * 100}%`,
              height: "100%",
              borderRadius: 3,
              background: colors?.accent || "#4fc3f7",
              transition: "width 0.3s linear",
            }} />
          </div>

          {upNextEx && (
            <div style={{ marginTop: 16 }}>
              <div style={{ ...subText, marginBottom: 4 }}>Up next:</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{upNextEx.name}</div>
              {upNextText && <div style={subText}>Last: {upNextText}</div>}
            </div>
          )}

          <button
            className="btn-press"
            style={{ ...secondaryBtn, marginTop: 16 }}
            onClick={handleSkipRest}
          >
            Skip Rest
          </button>
        </div>

        <div style={{ padding: "12px 16px", textAlign: "center", flexShrink: 0 }}>
          <button
            style={{ ...secondaryBtn, fontSize: 12, opacity: 0.6, marginRight: 12 }}
            onClick={() => dispatch({ type: "TOGGLE_PAUSE" })}
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button style={{ ...secondaryBtn, fontSize: 12, opacity: 0.6 }} onClick={handleStop}>
            Stop
          </button>
        </div>

        {paused && <PauseOverlay colors={colors} onResume={() => dispatch({ type: "TOGGLE_PAUSE" })} />}
        {showStopConfirm && (
          <ConfirmOverlay
            colors={colors}
            message="End circuit? Progress is already saved."
            onConfirm={confirmStop}
            onCancel={() => setShowStopConfirm(false)}
          />
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Complete phase
  // ---------------------------------------------------------------------------
  if (phase === "complete") {
    return (
      <div style={overlay}>
        <div style={center}>
          <div style={{ fontSize: 48 }}>&#127937;</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Circuit Complete!</div>
          <div style={subText}>
            {totalRounds} round{totalRounds !== 1 ? "s" : ""} &bull; {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
            <br />
            {setsLoggedRef.current} set{setsLoggedRef.current !== 1 ? "s" : ""} logged
            <br />
            Total time: {formatTime(totalElapsed)}
          </div>
          <button
            className="btn-press"
            style={{ ...primaryBtn, marginTop: 16 }}
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PauseOverlay({ colors, onResume }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10001,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
      onClick={onResume}
    >
      <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: 4, textTransform: "uppercase" }}>
        Paused
      </div>
      <div style={{ fontSize: 14, color: "#fff", opacity: 0.6 }}>Tap to resume</div>
    </div>
  );
}

function ConfirmOverlay({ colors, message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10002,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", textAlign: "center", maxWidth: 280 }}>
        {message}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          style={{
            padding: "10px 24px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          onClick={onCancel}
        >
          Continue
        </button>
        <button
          style={{
            padding: "10px 24px",
            borderRadius: 10,
            border: "none",
            background: "#e53935",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          onClick={onConfirm}
        >
          End Circuit
        </button>
      </div>
    </div>
  );
}
