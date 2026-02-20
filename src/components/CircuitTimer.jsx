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
  onUncompleteSet,
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

  // Track total sets logged
  const setsLoggedRef = useRef(0);

  // Multi-set state for work phase — array of { reps, weight }
  const [localSets, setLocalSets] = useState([]);

  // Build set template when exercise changes
  useEffect(() => {
    if (phase !== "get-ready" && phase !== "work") return;
    if (!currentExercise) return;

    const exId = currentExercise.id;
    const dayLog = existingLogs?.[exId];
    const priorLog = findPrior?.(exId);
    const template = dayLog || priorLog;
    const scheme = parseScheme(currentExercise.scheme || workout.scheme);
    const numSets = template?.sets?.length || scheme?.sets || 3;

    const sets = [];
    for (let i = 0; i < numSets; i++) {
      const src = template?.sets?.[i] || template?.sets?.[template.sets.length - 1];
      sets.push({
        reps: src ? String(src.reps || "") : (scheme ? String(scheme.reps) : ""),
        weight: src ? String(src.weight || "") : "",
      });
    }
    setLocalSets(sets);
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

  const handleCompleteSet = useCallback((setIdx) => {
    const s = localSets[setIdx];
    if (!s) return;
    const reps = Number(s.reps) || 0;
    if (reps <= 0) return;
    const weight = s.weight.trim();
    onCompleteSet(currentExercise.id, setIdx, { reps, weight }, workout.id);
    setsLoggedRef.current += 1;
  }, [localSets, currentExercise, workout.id, onCompleteSet]);

  const handleUncompleteSet = useCallback((setIdx) => {
    if (!currentExercise) return;
    onUncompleteSet(currentExercise.id, setIdx);
  }, [currentExercise, onUncompleteSet]);

  const handleNext = useCallback(() => {
    const isLastExercise = currentExerciseIndex >= exercises.length - 1;
    const isLastRound = currentRound >= totalRounds;

    if (isLastExercise && isLastRound) {
      if (timerSoundEnabled) {
        playTimerSound(timerSoundType || "chime");
        navigator.vibrate?.([200, 100, 200, 100, 200]);
      }
    }

    dispatch({ type: "DONE_SET" });
  }, [currentExerciseIndex, exercises.length, currentRound, totalRounds, timerSoundEnabled, timerSoundType]);

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
    const isBWExercise = currentExercise?.bodyweight;
    const showWeight = exUnit.key === "reps" && !isBWExercise;
    const nextText = currentExerciseIndex < exercises.length - 1
      ? exercises[currentExerciseIndex + 1]?.name
      : currentRound < totalRounds ? exercises[0]?.name : null;

    // Read saved sets from existingLogs to show checkmarks
    const savedSets = existingLogs?.[currentExercise?.id]?.sets;
    const firstUncompleted = localSets.findIndex((_, idx) =>
      !(savedSets && idx < savedSets.length && isSetCompleted(savedSets[idx]))
    );

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
        <div style={{ flex: 1, overflow: "auto", padding: "0 16px 16px" }}>
          <div style={{ textAlign: "center", marginBottom: 12, paddingTop: 8 }}>
            <div style={exerciseName}>{currentExercise?.name}</div>
            <div style={{ ...subText, marginTop: 4 }}>{formatTime(workTimer.seconds)}</div>
          </div>

          {/* Set header row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: showWeight ? "32px 1fr 1fr" : "32px 1fr",
            gap: 8,
            padding: "0 4px 6px",
            fontSize: 11,
            fontWeight: 600,
            opacity: 0.4,
            textTransform: "uppercase",
          }}>
            <span />
            <span style={{ textAlign: "center" }}>{isTimeUnit ? exUnit.label : "Reps"}</span>
            {showWeight && <span style={{ textAlign: "center" }}>{getWeightLabel(measurementSystem)}</span>}
          </div>

          {/* Set rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {localSets.map((s, i) => {
              const isSaved = savedSets && i < savedSets.length && isSetCompleted(savedSets[i]);
              const isNext = i === firstUncompleted;
              return (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: showWeight ? "32px 1fr 1fr" : "32px 1fr",
                  gap: 8,
                  alignItems: "center",
                  padding: "6px 4px",
                  borderRadius: 10,
                  border: isSaved
                    ? "1px solid rgba(46,204,113,0.4)"
                    : `1px solid ${colors?.border || "#333"}`,
                  background: isSaved
                    ? "rgba(46,204,113,0.08)"
                    : (colors?.cardAltBg || "rgba(255,255,255,0.04)"),
                  transition: "border 0.2s, background 0.2s",
                }}>
                  {/* Checkmark button */}
                  <button
                    style={{
                      width: 28, height: 28, borderRadius: 999, padding: 0,
                      border: isSaved ? "2px solid #2ecc71" : isNext ? "2px solid rgba(46,204,113,0.5)" : `2px solid ${colors?.border || "#333"}`,
                      background: isSaved ? "#2ecc71" : "transparent",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: isSaved ? "#fff" : (colors?.text || "#fff"),
                      transition: "all 0.2s",
                      WebkitTapHighlightColor: "transparent",
                    }}
                    onClick={() => {
                      if (isSaved) {
                        handleUncompleteSet(i);
                      } else {
                        handleCompleteSet(i);
                      }
                    }}
                    aria-label={isSaved ? `Uncomplete set ${i + 1}` : `Complete set ${i + 1}`}
                  >
                    {isSaved ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 700, opacity: isNext ? 0.7 : 0.3 }}>{i + 1}</span>
                    )}
                  </button>

                  {/* Reps input */}
                  <input
                    type="number"
                    inputMode="numeric"
                    value={s.reps}
                    onChange={(e) => {
                      const updated = [...localSets];
                      updated[i] = { ...updated[i], reps: e.target.value.replace(/[^\d.]/g, "") };
                      setLocalSets(updated);
                    }}
                    onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                    enterKeyHint="done"
                    style={{
                      ...inputStyle,
                      width: "100%",
                      fontSize: 16,
                      padding: "8px 6px",
                      opacity: isSaved ? 0.5 : 1,
                    }}
                    placeholder="0"
                    disabled={isSaved}
                  />

                  {/* Weight input */}
                  {showWeight && (
                    <input
                      type="text"
                      inputMode="decimal"
                      value={s.weight}
                      onChange={(e) => {
                        const updated = [...localSets];
                        updated[i] = { ...updated[i], weight: e.target.value.replace(/[^\d.]/g, "") };
                        setLocalSets(updated);
                      }}
                      onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                      enterKeyHint="done"
                      style={{
                        ...inputStyle,
                        width: "100%",
                        fontSize: 16,
                        padding: "8px 6px",
                        opacity: isSaved ? 0.5 : 1,
                      }}
                      placeholder={getWeightLabel(measurementSystem)}
                      disabled={isSaved}
                    />
                  )}
                </div>
              );
            })}

            {/* Add set button */}
            <button
              style={{
                ...secondaryBtn,
                padding: "6px 12px",
                fontSize: 12,
                opacity: 0.5,
                alignSelf: "center",
              }}
              onClick={() => {
                const last = localSets[localSets.length - 1] || { reps: "", weight: "" };
                setLocalSets([...localSets, { reps: last.reps, weight: last.weight }]);
              }}
            >
              + Add Set
            </button>
          </div>

          {/* Next / advance button */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              className="btn-press"
              style={{ ...primaryBtn, fontSize: 16 }}
              onClick={handleNext}
            >
              {currentExerciseIndex >= exercises.length - 1 && currentRound >= totalRounds
                ? "Finish"
                : "Next"}
            </button>
            {nextText && <div style={{ ...subText, marginTop: 8 }}>Next: {nextText}</div>}
          </div>
        </div>

        <div style={{ padding: "8px 16px 12px", textAlign: "center", flexShrink: 0 }}>
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
