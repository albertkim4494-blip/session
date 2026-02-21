import { useReducer, useEffect, useRef, useCallback, useMemo, useState } from "react";
import { useTimer } from "../hooks/useTimer";
import { playTimerSound } from "../lib/timerSounds";
import { parseScheme } from "../lib/workoutGenerator";
import { isSetCompleted } from "../lib/setHelpers";
import { getUnit, getWeightLabel } from "../lib/constants";
import { formatTimerDisplay } from "../lib/timerUtils";
import { EXERCISE_CATALOG } from "../lib/exerciseCatalog";
import { ExerciseGif } from "./ExerciseGif";
import { BodyDiagram } from "./BodyDiagram";

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
        restBetweenExercises: Math.min(120, Math.max(0, c.restBetweenExercises ?? 60)),
        restBetweenRounds: Math.min(180, Math.max(0, c.restBetweenRounds ?? 120)),
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
// Per-exercise circuit run cache (survives remounts within same day/workout)
// ---------------------------------------------------------------------------
const CIRCUIT_RUN_CACHE_KEY = "wt_circuit_run_cache";

function loadCircuitRunCache(dateKey, workoutId) {
  try {
    const raw = localStorage.getItem(CIRCUIT_RUN_CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    if (cache.date !== dateKey || cache.workoutId !== workoutId) {
      localStorage.removeItem(CIRCUIT_RUN_CACHE_KEY);
      return null;
    }
    return cache;
  } catch { return null; }
}

function updateCircuitRunCache(dateKey, workoutId, exerciseId, data) {
  try {
    const raw = localStorage.getItem(CIRCUIT_RUN_CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    if (cache.date !== dateKey || cache.workoutId !== workoutId) {
      cache.date = dateKey;
      cache.workoutId = workoutId;
      cache.sets = {};
      cache.durations = {};
    }
    if (data.sets != null) {
      if (!cache.sets) cache.sets = {};
      cache.sets[exerciseId] = data.sets;
    }
    if (data.duration != null) {
      if (!cache.durations) cache.durations = {};
      cache.durations[exerciseId] = data.duration;
    }
    localStorage.setItem(CIRCUIT_RUN_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

// ---------------------------------------------------------------------------
// State machine reducer
// ---------------------------------------------------------------------------
const INITIAL_GET_READY_SEC = 5;
const MIN_TRANSITION_SEC = 3;

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
        totalStartTime: Date.now(),
      };
    case "BEGIN_WORK":
      return { ...state, phase: "work" };
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
    // Rest phases go directly to work — no separate get-ready
    case "REST_DONE":
      return {
        ...state,
        phase: "work",
        currentExerciseIndex: state.currentExerciseIndex + 1,
      };
    case "ROUND_REST_DONE":
      return {
        ...state,
        phase: "work",
        currentExerciseIndex: 0,
        currentRound: state.currentRound + 1,
      };
    case "TOGGLE_PAUSE":
      return { ...state, paused: !state.paused };
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

function getLastSetsText(exerciseId, existingLogs, findPrior) {
  const log = existingLogs?.[exerciseId] || findPrior?.(exerciseId);
  if (!log?.sets?.length) return null;
  return log.sets
    .filter((s) => Number(s.reps) > 0)
    .map((s) => {
      const w = String(s.weight || "").toUpperCase() === "BW" ? "BW" : s.weight;
      return `${s.reps}\u00d7${w || 0}`;
    })
    .join(", ");
}

function estimateMinutes(exercises, rounds, restEx, restRound) {
  const workPerExercise = 45;
  const perRound = exercises * (workPerExercise + restEx);
  const total = perRound * rounds + restRound * Math.max(0, rounds - 1);
  return Math.round(total / 60);
}

const TIME_PRESETS = [30, 45, 60, 90, 120, 180];

// Static catalog lookup — built once at module load
const catalogMap = new Map();
for (const entry of EXERCISE_CATALOG) catalogMap.set(entry.id, entry);

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
    totalStartTime: null,
    totalEndTime: null,
  });

  const { phase, currentExerciseIndex, currentRound, totalRounds,
    restBetweenExercises, restBetweenRounds, paused } = state;

  const currentExercise = exercises[currentExerciseIndex] || null;

  // Track total sets logged
  const setsLoggedRef = useRef(0);

  // Auto-advance timer ref (clearable)
  const autoAdvanceRef = useRef(null);
  useEffect(() => () => clearTimeout(autoAdvanceRef.current), []);

  // Multi-set state for work phase — array of { reps, weight }
  const [localSets, setLocalSets] = useState([]);

  // Time-based exercise: which set is active for countdown, and whether countdown started
  const [timeSetIndex, setTimeSetIndex] = useState(0);
  const [timeCountdownStarted, setTimeCountdownStarted] = useState(false);

  // Set rest timer (between individual sets for regular exercises)
  const [setRestActive, setSetRestActive] = useState(false);
  const [setRestSecondsLeft, setSetRestSecondsLeft] = useState(0);
  const setRestIntervalRef = useRef(null);
  const setRestStartRef = useRef(0);
  const setRestTotalRef = useRef(0);

  // Set index offset — when re-running a circuit, offset new sets so they don't overwrite prior logs
  const setIndexOffsetRef = useRef(0);

  // Ref tracking the total duration for the current timed set (immune to closure staleness)
  const timeTargetRef = useRef(0);

  // Per-exercise chosen durations for time-based exercises (persists across rounds within one circuit session)
  const chosenTimeDurationsRef = useRef(new Map());

  // Per-exercise set count from first encounter (prevents accumulation on re-runs)
  const perRunSetCountRef = useRef(new Map());

  // Collapsible exercise detail (GIF + body diagram)
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);
  const catalogEntry = currentExercise?.catalogId ? catalogMap.get(currentExercise.catalogId) : null;

  // Is current exercise time-based?
  const isTimeBased = currentExercise?.unit === "sec";

  // Refs so the localSets effect always reads fresh values without
  // re-running every time existingLogs/findPrior references change
  const existingLogsRef = useRef(existingLogs);
  existingLogsRef.current = existingLogs;
  const findPriorRef = useRef(findPrior);
  findPriorRef.current = findPrior;

  // Build set template when exercise changes
  useEffect(() => {
    if (phase !== "get-ready" && phase !== "work" && phase !== "rest" && phase !== "round-rest") return;
    if (!currentExercise) return;

    const exId = currentExercise.id;
    const dayLog = existingLogsRef.current?.[exId];
    const priorLog = findPriorRef.current?.(exId);
    const template = dayLog || priorLog;
    const scheme = parseScheme(currentExercise.scheme || workout.scheme);

    // Calculate offset: count already-completed sets so new circuit run appends instead of overwrites
    const completedCount = dayLog?.sets?.filter(s => isSetCompleted(s)).length || 0;
    setIndexOffsetRef.current = completedCount;

    // --- Load persistent cache (survives component remounts within same day/workout) ---
    const cache = loadCircuitRunCache(dateKey, workout.id);
    const cachedSetCount = cache?.sets?.[exId];
    const cachedDuration = cache?.durations?.[exId] || 0;

    // --- Determine numSets (stable across re-runs) ---
    // Priority: in-memory ref → localStorage cache → scheme → priorLog → template → 1
    // The cache prevents dayLog.sets.length from growing (3→6→9) across remounts.
    const inMemCount = perRunSetCountRef.current.get(exId);
    let numSets;
    if (inMemCount != null) {
      numSets = inMemCount;
    } else if (cachedSetCount != null) {
      numSets = cachedSetCount;
    } else if (scheme?.sets) {
      numSets = scheme.sets;
    } else if (priorLog?.sets?.length) {
      numSets = priorLog.sets.length;
    } else {
      numSets = template?.sets?.length || 1;
    }
    perRunSetCountRef.current.set(exId, numSets);
    updateCircuitRunCache(dateKey, workout.id, exId, { sets: numSets });

    // --- Build localSets ---
    const sets = [];
    let autoStartDur = 0;

    if (isTimeBased) {
      // Merge in-memory + cached chosen duration
      const chosenDur = chosenTimeDurationsRef.current.get(exId) || cachedDuration;

      // Find user-preferred duration from logs (skip scheme-default values)
      const schemeReps = scheme?.reps || 0;
      const allTemplateSets = template?.sets || [];
      const userChosenSet = [...allTemplateSets].reverse().find(s => {
        const r = Number(s.reps);
        return r > 0 && (schemeReps === 0 || r !== schemeReps);
      });
      const userPreferredDur = Number(userChosenSet?.reps) || 0;

      // Display value: chosen > user-preferred > any logged > empty
      let timeReps = "";
      if (chosenDur > 0) {
        timeReps = String(chosenDur);
      } else if (userPreferredDur > 0) {
        timeReps = String(userPreferredDur);
      } else {
        const lastAny = [...allTemplateSets].reverse().find(s => Number(s.reps) > 0);
        timeReps = lastAny ? String(lastAny.reps) : "";
      }

      for (let i = 0; i < numSets; i++) {
        sets.push({ reps: timeReps, weight: "" });
      }

      // Auto-start: chosen > user-preferred
      autoStartDur = chosenDur > 0 ? chosenDur : userPreferredDur;
    } else {
      // Regular exercises: pre-fill per-set from most recent logged values
      const repsSource = template;
      const srcLen = repsSource?.sets?.length || 0;
      const srcStart = srcLen > numSets ? srcLen - numSets : 0;
      for (let i = 0; i < numSets; i++) {
        const src = repsSource?.sets?.[srcStart + i] || repsSource?.sets?.[srcLen - 1];
        let reps;
        if (src) {
          reps = String(src.reps || "");
        } else {
          reps = scheme ? String(scheme.reps) : "";
        }
        sets.push({ reps, weight: src ? String(src.weight || "") : "" });
      }
    }
    setLocalSets(sets);
    setTimeSetIndex(0);
    setShowExerciseDetail(false);
    timeTargetRef.current = Number(sets[0]?.reps) || 0;

    // --- Auto-start time-based (inline to avoid race conditions) ---
    if (isTimeBased && autoStartDur > 0 && phase === "work") {
      if (!chosenTimeDurationsRef.current.has(exId)) {
        chosenTimeDurationsRef.current.set(exId, autoStartDur);
        updateCircuitRunCache(dateKey, workout.id, exId, { duration: autoStartDur });
      }
      timeTargetRef.current = autoStartDur;
      setTimeCountdownStarted(true);
      workTimer.start(autoStartDur, "countdown");
    } else {
      setTimeCountdownStarted(false);
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

  // Work timer completion — for time-based exercises, auto-complete the set
  const onWorkTimerComplete = useCallback(() => {
    if (!currentExercise || !isTimeBased) return;
    // Read total from ref — always current even after +/- 30s adjustments
    const reps = timeTargetRef.current || 0;
    if (reps > 0) {
      onCompleteSet(currentExercise.id, timeSetIndex + setIndexOffsetRef.current, { reps, weight: "" }, workout.id);
      setsLoggedRef.current += 1;
    }
    if (timerSoundEnabled) playTimerSound(timerSoundType || "chime");
    navigator.vibrate?.([100, 50, 100]);
    // Advance to next time set, or auto-advance after last set
    if (timeSetIndex < localSets.length - 1) {
      setTimeCountdownStarted(false);
      setTimeSetIndex((prev) => prev + 1);
    } else {
      // Last timed set done — auto-advance like regular exercises
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = setTimeout(() => {
        dispatch({ type: "DONE_SET" });
      }, 1500);
    }
  }, [currentExercise, isTimeBased, localSets, timeSetIndex, onCompleteSet, workout.id, timerSoundEnabled, timerSoundType]);

  const getReadyTimer = useTimer(onGetReadyComplete);
  const workTimer = useTimer(onWorkTimerComplete);
  const restTimer = useTimer(onRestComplete);
  const roundRestTimer = useTimer(onRoundRestComplete);

  // Countdown beeps during last 3 seconds of get-ready, rest, and round-rest
  const lastBeepRef = useRef(0);
  useEffect(() => {
    let sec = 0;
    let running = false;
    if (phase === "get-ready") { sec = getReadyTimer.seconds; running = getReadyTimer.isRunning; }
    else if (phase === "rest") { sec = restTimer.seconds; running = restTimer.isRunning; }
    else if (phase === "round-rest") { sec = roundRestTimer.seconds; running = roundRestTimer.isRunning; }
    else return;
    if (!running) return;
    if (sec <= 3 && sec > 0 && sec !== lastBeepRef.current) {
      lastBeepRef.current = sec;
      if (timerSoundEnabled) playTimerSound("beep");
      navigator.vibrate?.(10);
    }
  }, [phase, getReadyTimer.seconds, getReadyTimer.isRunning,
    restTimer.seconds, restTimer.isRunning,
    roundRestTimer.seconds, roundRestTimer.isRunning, timerSoundEnabled]);

  // Phase-driven timer starts
  useEffect(() => {
    clearTimeout(autoAdvanceRef.current);
    if (phase === "get-ready") {
      lastBeepRef.current = 0;
      navigator.vibrate?.(10);
      getReadyTimer.start(INITIAL_GET_READY_SEC, "countdown");
    } else if (phase === "work") {
      if (!isTimeBased) {
        workTimer.start(0, "stopwatch");
      }
      // Time-based auto-start is handled by a separate effect below
    } else if (phase === "rest") {
      lastBeepRef.current = 0;
      restTimer.start(Math.max(MIN_TRANSITION_SEC, restBetweenExercises), "countdown");
    } else if (phase === "round-rest") {
      lastBeepRef.current = 0;
      roundRestTimer.start(Math.max(MIN_TRANSITION_SEC, restBetweenRounds), "countdown");
    }
  }, [phase, currentExerciseIndex, currentRound]);

  // Auto-start subsequent time sets (set 1+) after advancing from a completed set.
  // Set 0 is handled inline by the localSets build effect above.
  useEffect(() => {
    if (phase !== "work" || !isTimeBased || timeSetIndex === 0) return;
    if (timeCountdownStarted) return;
    const chosenDur = chosenTimeDurationsRef.current.get(currentExercise?.id) || 0;
    if (chosenDur <= 0) return;
    timeTargetRef.current = chosenDur;
    setTimeCountdownStarted(true);
    workTimer.start(chosenDur, "countdown");
  }, [phase, isTimeBased, timeSetIndex, timeCountdownStarted]);

  // Pause/resume
  useEffect(() => {
    if (phase === "work") {
      if (paused && workTimer.isRunning) workTimer.stop();
      else if (!paused && !workTimer.isRunning && (timeCountdownStarted || !isTimeBased)) workTimer.toggle();
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
  // Set rest timer (between individual sets)
  // ---------------------------------------------------------------------------

  const clearSetRest = useCallback(() => {
    clearInterval(setRestIntervalRef.current);
    setSetRestActive(false);
    setSetRestSecondsLeft(0);
  }, []);

  const startSetRest = useCallback((totalSec) => {
    clearInterval(setRestIntervalRef.current);
    setRestTotalRef.current = totalSec;
    setRestStartRef.current = Date.now();
    setSetRestSecondsLeft(totalSec);
    setSetRestActive(true);
    let lastBeep = 0;
    setRestIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - setRestStartRef.current) / 1000;
      const remaining = Math.max(0, Math.ceil(setRestTotalRef.current - elapsed));
      setSetRestSecondsLeft(remaining);
      if (remaining <= 3 && remaining > 0 && remaining !== lastBeep) {
        lastBeep = remaining;
        if (timerSoundEnabled) playTimerSound("beep");
        navigator.vibrate?.(10);
      }
      if (remaining <= 0) {
        clearInterval(setRestIntervalRef.current);
        setSetRestActive(false);
        if (timerSoundEnabled) playTimerSound(timerSoundType || "chime");
        navigator.vibrate?.([100, 50, 100]);
      }
    }, 250);
  }, [timerSoundEnabled, timerSoundType]);

  const adjustSetRest = useCallback((delta) => {
    const newTotal = setRestTotalRef.current + delta;
    if (newTotal <= 0) {
      clearSetRest();
      return;
    }
    setRestTotalRef.current = newTotal;
    const elapsed = (Date.now() - setRestStartRef.current) / 1000;
    const remaining = Math.max(0, Math.ceil(newTotal - elapsed));
    if (remaining <= 0) {
      clearSetRest();
    } else {
      setSetRestSecondsLeft(remaining);
    }
  }, [clearSetRest]);

  // Clear set rest on phase/exercise/round change or unmount
  useEffect(() => {
    clearSetRest();
    return () => clearInterval(setRestIntervalRef.current);
  }, [phase, currentExerciseIndex, currentRound]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const handleCompleteSet = useCallback((setIdx) => {
    const s = localSets[setIdx];
    if (!s) return;
    const reps = Number(s.reps) || 0;
    if (reps <= 0) return;
    const weight = (s.weight || "").trim();
    const offset = setIndexOffsetRef.current;
    onCompleteSet(currentExercise.id, setIdx + offset, { reps, weight }, workout.id);
    setsLoggedRef.current += 1;

    // Auto-advance if all sets are now completed
    const savedSets = existingLogs?.[currentExercise?.id]?.sets;
    const allDone = localSets.every((_, idx) => {
      if (idx === setIdx) return true; // just completed this one
      return savedSets && (idx + offset) < savedSets.length && isSetCompleted(savedSets[idx + offset]);
    });
    if (allDone) {
      clearSetRest();
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = setTimeout(() => {
        dispatch({ type: "DONE_SET" });
      }, 1500);
    } else if (restBetweenExercises > 0) {
      startSetRest(restBetweenExercises);
    }
  }, [localSets, currentExercise, workout.id, onCompleteSet, existingLogs, restBetweenExercises, clearSetRest, startSetRest]);

  const handleUncompleteSet = useCallback((setIdx) => {
    if (!currentExercise) return;
    clearTimeout(autoAdvanceRef.current);
    clearSetRest();
    onUncompleteSet(currentExercise.id, setIdx + setIndexOffsetRef.current);
  }, [currentExercise, onUncompleteSet, clearSetRest]);

  const handleNext = useCallback(() => {
    if (!currentExercise) return;
    const isLastExercise = currentExerciseIndex >= exercises.length - 1;
    const isLastRound = currentRound >= totalRounds;

    const savedSets = existingLogsRef.current?.[currentExercise.id]?.sets;
    const offset = setIndexOffsetRef.current;

    if (isTimeBased) {
      // For time-based exercises: stop the running timer and log elapsed time
      if (workTimer.isRunning) {
        const s = localSets[timeSetIndex];
        const targetSec = Number(s?.reps) || 0;
        const elapsed = targetSec - workTimer.seconds;
        workTimer.stop();
        if (elapsed > 0) {
          const alreadyDone = savedSets && (timeSetIndex + offset) < savedSets.length && isSetCompleted(savedSets[timeSetIndex + offset]);
          if (!alreadyDone) {
            onCompleteSet(currentExercise.id, timeSetIndex + offset, { reps: elapsed, weight: "" }, workout.id);
            setsLoggedRef.current += 1;
          }
        }
      }
    } else {
      // Auto-complete all unchecked sets with valid reps
      for (let i = 0; i < localSets.length; i++) {
        const alreadyDone = savedSets && (i + offset) < savedSets.length && isSetCompleted(savedSets[i + offset]);
        if (alreadyDone) continue;
        const reps = Number(localSets[i].reps) || 0;
        if (reps <= 0) continue;
        const weight = localSets[i].weight?.trim() || "";
        onCompleteSet(currentExercise.id, i + offset, { reps, weight }, workout.id);
        setsLoggedRef.current += 1;
      }
    }

    if (isLastExercise && isLastRound) {
      if (timerSoundEnabled) {
        playTimerSound(timerSoundType || "chime");
        navigator.vibrate?.([200, 100, 200, 100, 200]);
      }
    }

    clearSetRest();
    clearTimeout(autoAdvanceRef.current);
    dispatch({ type: "DONE_SET" });
  }, [currentExerciseIndex, exercises.length, currentRound, totalRounds, timerSoundEnabled, timerSoundType,
    currentExercise, existingLogs, localSets, onCompleteSet, workout.id, isTimeBased, workTimer, timeSetIndex, clearSetRest]);

  // Start countdown for time-based exercise
  const handleStartTimeCountdown = useCallback((durationSec) => {
    // Store chosen duration so subsequent rounds and remounts auto-start with it
    if (currentExercise) {
      chosenTimeDurationsRef.current.set(currentExercise.id, durationSec);
      updateCircuitRunCache(dateKey, workout.id, currentExercise.id, { duration: durationSec });
    }
    // Update localSets with the chosen duration
    const updated = [...localSets];
    updated[timeSetIndex] = { ...updated[timeSetIndex], reps: String(durationSec) };
    setLocalSets(updated);
    timeTargetRef.current = durationSec;
    setTimeCountdownStarted(true);
    workTimer.start(durationSec, "countdown");
  }, [localSets, timeSetIndex, workTimer, dateKey]);

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
    clearTimeout(autoAdvanceRef.current);
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

  const exerciseNameStyle = {
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

    // Check which exercises have no logged data
    const exercisesWithoutLogs = exercises.filter((ex) => {
      const dayLog = existingLogs?.[ex.id];
      const priorLog = findPrior?.(ex.id);
      return !dayLog?.sets?.length && !priorLog?.sets?.length;
    });
    const noLogsAtAll = exercisesWithoutLogs.length === exercises.length;
    const someWithoutLogs = exercisesWithoutLogs.length > 0 && !noLogsAtAll;

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
          {stepperRow("Exercise rest", restBetweenExercises, 0, 120, 15, (v) =>
            dispatch({ type: "SET_CONFIG", payload: { restBetweenExercises: v } })
          )}
          {stepperRow("Round rest", restBetweenRounds, 0, 180, 30, (v) =>
            dispatch({ type: "SET_CONFIG", payload: { restBetweenRounds: v } })
          )}

          <div style={{ ...subText, marginTop: 8 }}>
            {exercises.length} exercise{exercises.length !== 1 ? "s" : ""} &times; {totalRounds} round{totalRounds !== 1 ? "s" : ""}
            <br />
            Est. ~{est} min
          </div>

          {noLogsAtAll && (
            <div style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(255,193,7,0.1)",
              border: "1px solid rgba(255,193,7,0.25)",
              fontSize: 13,
              lineHeight: 1.5,
              maxWidth: 300,
              textAlign: "center",
            }}>
              No sets logged yet. You can fill in reps/weight as you go.
            </div>
          )}

          {someWithoutLogs && (
            <div style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(255,193,7,0.06)",
              border: "1px solid rgba(255,193,7,0.15)",
              fontSize: 12,
              lineHeight: 1.5,
              maxWidth: 300,
              textAlign: "center",
              opacity: 0.8,
            }}>
              No prior data for: {exercisesWithoutLogs.map((e) => e.name).join(", ")}
            </div>
          )}

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
    const lastText = getLastSetsText(currentExercise?.id, existingLogs, findPrior);
    return (
      <div style={overlay}>
        <div style={headerBar}>
          <span>Round {currentRound}/{totalRounds}</span>
          <span>Exercise {currentExerciseIndex + 1}/{exercises.length}</span>
        </div>
        <div style={center}>
          <div style={phaseLabel}>Get Ready</div>
          <div style={bigNumber}>{getReadyTimer.seconds}</div>
          <div style={exerciseNameStyle}>{currentExercise?.name}</div>
          <div style={subText}>Set {currentRound} of {totalRounds}</div>
          {lastText && <div style={subText}>Last: {lastText}</div>}
        </div>
        {paused && <PauseOverlay onResume={() => dispatch({ type: "TOGGLE_PAUSE" })} />}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Work phase
  // ---------------------------------------------------------------------------
  if (phase === "work") {
    const exUnit = getUnit(currentExercise?.unit, currentExercise);
    const isBWExercise = currentExercise?.bodyweight;
    const showWeight = exUnit.key === "reps" && !isBWExercise;
    const nextText = currentExerciseIndex < exercises.length - 1
      ? exercises[currentExerciseIndex + 1]?.name
      : currentRound < totalRounds ? exercises[0]?.name : null;

    // Read saved sets from existingLogs to show checkmarks (offset for re-run circuits)
    const savedSets = existingLogs?.[currentExercise?.id]?.sets;
    const offset = setIndexOffsetRef.current;
    const firstUncompleted = localSets.findIndex((_, idx) =>
      !(savedSets && (idx + offset) < savedSets.length && isSetCompleted(savedSets[idx + offset]))
    );

    // --- Time-based exercise UI ---
    if (isTimeBased) {
      const currentTimeSetData = localSets[timeSetIndex];
      const targetSec = Number(currentTimeSetData?.reps) || 0;

      // SVG ring for countdown
      const CIRCUMFERENCE = 2 * Math.PI * 60;
      const displaySec = workTimer.isRunning || workTimer.seconds > 0 ? workTimer.seconds : targetSec;
      const timerTarget = workTimer.target || targetSec || 1;
      const progress = timeCountdownStarted && timerTarget > 0
        ? Math.min(1, Math.max(0, 1 - displaySec / timerTarget))
        : 0;
      const dashOffset = CIRCUMFERENCE * (1 - progress);

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
            <div style={exerciseNameStyle}>{currentExercise?.name}</div>
            {localSets.length > 1 && (
              <div style={subText}>Set {timeSetIndex + 1} of {localSets.length}</div>
            )}

            {catalogEntry && (
              <ExerciseDetailToggle
                show={showExerciseDetail}
                onToggle={() => setShowExerciseDetail((v) => !v)}
                catalogEntry={catalogEntry}
                colors={colors}
              />
            )}

            {/* Duration not started — show presets */}
            {!timeCountdownStarted && (() => {
              // Use the most recent logged duration (last set with reps > 0)
              const sessionLog = existingLogs?.[currentExercise.id];
              const priorLog = findPrior?.(currentExercise.id);
              const lastSessionSet = sessionLog?.sets?.filter(s => s.reps > 0).pop();
              const lastPriorSet = priorLog?.sets?.slice().reverse().find(s => Number(s.reps) > 0);
              const priorSec = Number(lastSessionSet?.reps) || Number(lastPriorSet?.reps) || 0;
              return (
              <div style={{ marginTop: 8 }}>
                {priorSec > 0 && (
                  <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 8 }}>
                    Last time: {formatTimerDisplay(priorSec)}
                  </div>
                )}
                <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 10, fontWeight: 600 }}>Select duration:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {TIME_PRESETS.map((sec) => {
                    const isLastUsed = sec === priorSec;
                    return (
                    <button
                      key={sec}
                      className="btn-press"
                      style={{
                        ...secondaryBtn,
                        padding: "10px 16px",
                        fontSize: 15,
                        fontWeight: 700,
                        minWidth: 64,
                        ...(isLastUsed ? {
                          border: `2px solid ${colors?.accent || "#4fc3f7"}`,
                          background: `${colors?.accent || "#4fc3f7"}22`,
                        } : {}),
                      }}
                      onClick={() => handleStartTimeCountdown(sec)}
                    >
                      {formatTimerDisplay(sec)}
                    </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, opacity: 0.5 }}>Custom:</span>
                  <input
                    id="circuit-custom-sec"
                    type="number"
                    inputMode="numeric"
                    style={{ ...inputStyle, width: 72, fontSize: 16 }}
                    placeholder="sec"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && Number(e.target.value) > 0) {
                        handleStartTimeCountdown(Number(e.target.value));
                      }
                    }}
                  />
                  <button
                    className="btn-press"
                    style={{ ...primaryBtn, padding: "8px 16px", fontSize: 14, minWidth: 0 }}
                    onClick={() => {
                      const el = document.getElementById("circuit-custom-sec");
                      const v = Number(el?.value);
                      if (v > 0) handleStartTimeCountdown(v);
                    }}
                  >
                    Go
                  </button>
                </div>
              </div>
              );
            })()}

            {/* Timer started — show ring timer */}
            {timeCountdownStarted && (
              <>
                <div style={{ position: "relative", width: 160, height: 160, margin: "8px 0" }}>
                  <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="80" cy="80" r="60" fill="none" stroke={colors?.border || "#333"} strokeWidth="7" />
                    <circle
                      cx="80" cy="80" r="60" fill="none"
                      stroke={colors?.accent || "#4fc3f7"}
                      strokeWidth="7" strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={dashOffset}
                      style={{ transition: "stroke-dashoffset 0.3s linear" }}
                    />
                  </svg>
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 36, fontWeight: 700, fontVariantNumeric: "tabular-nums",
                  }}>
                    {formatTimerDisplay(displaySec)}
                  </div>
                </div>

                {workTimer.isRunning ? (
                  /* Timer running — +/- 30s, skip, and add set */
                  <>
                    <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                      <button
                        className="btn-press"
                        style={{ ...secondaryBtn, fontSize: 14, padding: "8px 18px", opacity: workTimer.seconds <= 30 ? 0.3 : 1 }}
                        disabled={workTimer.seconds <= 30}
                        onClick={() => {
                          const newRemaining = workTimer.seconds - 30;
                          if (newRemaining <= 0) { handleNext(); return; }
                          timeTargetRef.current = Math.max(1, timeTargetRef.current - 30);
                          workTimer.start(newRemaining, "countdown");
                        }}
                      >
                        &minus;30s
                      </button>
                      <button
                        className="btn-press"
                        style={{ ...secondaryBtn, fontSize: 14, padding: "8px 18px" }}
                        onClick={() => {
                          const newRemaining = workTimer.seconds + 30;
                          timeTargetRef.current += 30;
                          workTimer.start(newRemaining, "countdown");
                        }}
                      >
                        +30s
                      </button>
                      <button
                        className="btn-press"
                        style={{ ...secondaryBtn, fontSize: 14, padding: "8px 18px" }}
                        onClick={handleNext}
                      >
                        Skip
                      </button>
                    </div>
                    <button
                      className="btn-press"
                      style={{ ...secondaryBtn, fontSize: 13, padding: "8px 18px", opacity: 0.7, marginTop: 4 }}
                      onClick={() => {
                        clearTimeout(autoAdvanceRef.current);
                        const priorDur = timeTargetRef.current || 0;
                        const newSets = [...localSets, { reps: String(priorDur || ""), weight: "" }];
                        setLocalSets(newSets);
                        if (currentExercise) {
                          perRunSetCountRef.current.set(currentExercise.id, newSets.length);
                          updateCircuitRunCache(dateKey, workout.id, currentExercise.id, { sets: newSets.length });
                        }
                      }}
                    >
                      + Add Set
                    </button>
                  </>
                ) : (
                  /* Timer completed — brief auto-advance state */
                  <>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#2ecc71", marginBottom: 8 }}>
                      &#10003; Set complete!
                    </div>
                    <button
                      className="btn-press"
                      style={{ ...secondaryBtn, fontSize: 14, padding: "10px 20px" }}
                      onClick={() => {
                        clearTimeout(autoAdvanceRef.current);
                        const priorDur = timeTargetRef.current || 0;
                        const newSets = [...localSets, { reps: String(priorDur || ""), weight: "" }];
                        const newIdx = localSets.length;
                        setLocalSets(newSets);
                        setTimeSetIndex(newIdx);
                        if (currentExercise) {
                          perRunSetCountRef.current.set(currentExercise.id, newSets.length);
                          updateCircuitRunCache(dateKey, workout.id, currentExercise.id, { sets: newSets.length });
                        }
                        if (priorDur > 0) {
                          setTimeCountdownStarted(true);
                          workTimer.start(priorDur, "countdown");
                        } else {
                          setTimeCountdownStarted(false);
                        }
                      }}
                    >
                      + Add Set
                    </button>
                  </>
                )}
              </>
            )}

            {nextText && <div style={{ ...subText, marginTop: 8 }}>Next: {nextText}</div>}
          </div>

          <div style={{ padding: "8px 16px 12px", textAlign: "center", flexShrink: 0 }}>
            <button style={{ ...secondaryBtn, fontSize: 12, opacity: 0.6 }} onClick={handleStop}>
              Stop
            </button>
          </div>

          {paused && <PauseOverlay onResume={() => dispatch({ type: "TOGGLE_PAUSE" })} />}
          {showStopConfirm && (
            <ConfirmOverlay
              message="End circuit? Progress is already saved."
              onConfirm={confirmStop}
              onCancel={() => setShowStopConfirm(false)}
            />
          )}
        </div>
      );
    }

    // --- Regular exercise UI (reps/weight) ---
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
            <div style={exerciseNameStyle}>{currentExercise?.name}</div>
            <div style={{ ...subText, marginTop: 4 }}>{formatTime(workTimer.seconds)}</div>

            {catalogEntry && (
              <ExerciseDetailToggle
                show={showExerciseDetail}
                onToggle={() => setShowExerciseDetail((v) => !v)}
                catalogEntry={catalogEntry}
                colors={colors}
              />
            )}
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
            <span style={{ textAlign: "center" }}>Reps</span>
            {showWeight && <span style={{ textAlign: "center" }}>{getWeightLabel(measurementSystem)}</span>}
          </div>

          {/* Set rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {localSets.map((s, i) => {
              const isSaved = savedSets && (i + offset) < savedSets.length && isSetCompleted(savedSets[i + offset]);
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
                      color: isSaved ? "#fff" : isNext ? "rgba(46,204,113,0.6)" : (colors?.text || "#fff"),
                      fontWeight: 700, fontSize: 12,
                      transition: "all 0.2s",
                      ...(isSaved ? { animation: "chipPop 0.3s ease-out" } : {}),
                      ...(isNext && !isSaved ? { animation: "setBreathe 2s ease-in-out infinite" } : {}),
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
                        <polyline points="20 6 9 17 4 12" style={{ strokeDasharray: 24, animation: "checkDraw 0.3s ease-out forwards" }} />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: isNext ? 0.7 : 0.3 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
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
                const newSets = [...localSets, { reps: last.reps, weight: last.weight }];
                setLocalSets(newSets);
                if (currentExercise) {
                  perRunSetCountRef.current.set(currentExercise.id, newSets.length);
                  updateCircuitRunCache(dateKey, workout.id, currentExercise.id, { sets: newSets.length });
                }
              }}
            >
              + Add Set
            </button>
          </div>

          {/* Inline set rest timer */}
          {setRestActive && (
            <div style={{
              margin: "12px 0",
              padding: "10px 12px",
              borderRadius: 10,
              background: `${colors?.accent || "#4fc3f7"}15`,
              border: `1px solid ${colors?.accent || "#4fc3f7"}40`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, whiteSpace: "nowrap" }}>Rest</span>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: colors?.border || "#333", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  borderRadius: 2,
                  background: colors?.accent || "#4fc3f7",
                  width: `${setRestTotalRef.current > 0 ? Math.max(0, Math.min(100, ((setRestTotalRef.current - setRestSecondsLeft) / setRestTotalRef.current) * 100)) : 0}%`,
                  transition: "width 0.25s linear",
                }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums", minWidth: 36, textAlign: "center" }}>
                {formatTime(setRestSecondsLeft)}
              </span>
              <button
                style={{ background: "none", border: "none", color: colors?.text || "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "2px 6px", fontFamily: "inherit", opacity: 0.6 }}
                onClick={() => adjustSetRest(-15)}
              >
                &minus;15
              </button>
              <button
                style={{ background: "none", border: "none", color: colors?.text || "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "2px 6px", fontFamily: "inherit", opacity: 0.6 }}
                onClick={() => adjustSetRest(15)}
              >
                +15
              </button>
              <button
                style={{ background: "none", border: "none", color: colors?.text || "#fff", fontSize: 16, cursor: "pointer", padding: "2px 6px", fontFamily: "inherit", opacity: 0.5 }}
                onClick={clearSetRest}
              >
                &times;
              </button>
            </div>
          )}

          {/* Next / advance button */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              className="btn-press"
              style={{ ...primaryBtn, fontSize: 16 }}
              onClick={handleNext}
            >
              {currentExerciseIndex >= exercises.length - 1 && currentRound >= totalRounds
                ? "Log All & Finish \u2713"
                : "Log All & Next \u2192"}
            </button>
            {nextText && <div style={{ ...subText, marginTop: 8 }}>Next: {nextText}</div>}
          </div>
        </div>

        <div style={{ padding: "8px 16px 12px", textAlign: "center", flexShrink: 0 }}>
          <button style={{ ...secondaryBtn, fontSize: 12, opacity: 0.6 }} onClick={handleStop}>
            Stop
          </button>
        </div>

        {paused && <PauseOverlay onResume={() => dispatch({ type: "TOGGLE_PAUSE" })} />}
        {showStopConfirm && (
          <ConfirmOverlay
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
    const configuredSec = isRoundRest ? restBetweenRounds : restBetweenExercises;
    const actualTotalSec = Math.max(MIN_TRANSITION_SEC, configuredSec);
    const progress = actualTotalSec > 0 ? Math.max(0, Math.min(1, 1 - timer.seconds / actualTotalSec)) : 0;
    const isGetReadyZone = timer.seconds <= 3 && timer.seconds > 0;

    const upNextEx = isRoundRest ? exercises[0] : exercises[currentExerciseIndex + 1];
    const upNextText = getLastSetsText(upNextEx?.id, existingLogs, findPrior);

    return (
      <div style={overlay}>
        <div style={headerBar}>
          <span>Round {isRoundRest ? currentRound + 1 : currentRound}/{totalRounds}</span>
          <span>
            {isRoundRest
              ? "Round Rest"
              : isGetReadyZone ? "Get Ready" : "Rest"}
          </span>
        </div>
        <div style={center}>
          {/* Show "GET READY" prominently when entering final 3s */}
          {isGetReadyZone && (
            <div style={{
              ...phaseLabel,
              color: colors?.accent || "#4fc3f7",
              opacity: 1,
              fontSize: 16,
              letterSpacing: 3,
              marginBottom: -4,
            }}>
              GET READY
            </div>
          )}

          <div style={isGetReadyZone ? bigNumber : medNumber}>
            {isGetReadyZone ? timer.seconds : formatTime(timer.seconds)}
          </div>

          <div style={progressBarBg}>
            <div style={{
              width: `${progress * 100}%`,
              height: "100%",
              borderRadius: 3,
              background: isGetReadyZone ? "#2ecc71" : (colors?.accent || "#4fc3f7"),
              transition: "width 0.3s linear",
            }} />
          </div>

          {/* Next exercise info — always prominent */}
          {upNextEx && (
            <div style={{ marginTop: 16 }}>
              <div style={{ ...subText, marginBottom: 4 }}>
                {isGetReadyZone ? "Next up:" : "Up next:"}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{upNextEx.name}</div>
              {upNextText && <div style={subText}>Last: {upNextText}</div>}
            </div>
          )}

          {/* Only show skip for longer rests (>MIN_TRANSITION_SEC means user configured actual rest) */}
          {configuredSec > MIN_TRANSITION_SEC && (
            <button
              className="btn-press"
              style={{ ...secondaryBtn, marginTop: 16 }}
              onClick={handleSkipRest}
            >
              Skip Rest
            </button>
          )}
        </div>

        <div style={{ padding: "12px 16px", textAlign: "center", flexShrink: 0 }}>
          {configuredSec > MIN_TRANSITION_SEC && (
            <button
              style={{ ...secondaryBtn, fontSize: 12, opacity: 0.6, marginRight: 12 }}
              onClick={() => dispatch({ type: "TOGGLE_PAUSE" })}
            >
              {paused ? "Resume" : "Pause"}
            </button>
          )}
          <button style={{ ...secondaryBtn, fontSize: 12, opacity: 0.6 }} onClick={handleStop}>
            Stop
          </button>
        </div>

        {paused && <PauseOverlay onResume={() => dispatch({ type: "TOGGLE_PAUSE" })} />}
        {showStopConfirm && (
          <ConfirmOverlay
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

function PauseOverlay({ onResume }) {
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

function ExerciseDetailToggle({ show, onToggle, catalogEntry, colors }) {
  const hasMuscles = catalogEntry.muscles?.primary?.length > 0;
  return (
    <div style={{ marginTop: 8, width: "100%" }}>
      <button
        style={{
          background: "none",
          border: "none",
          color: colors?.accent || "#4fc3f7",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          padding: "4px 8px",
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          gap: 4,
          margin: "0 auto",
        }}
        onClick={onToggle}
      >
        <span style={{
          display: "inline-block",
          transform: show ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
          fontSize: 10,
        }}>&#9654;</span>
        {show ? "Hide exercise" : "Show exercise"}
      </button>
      {show && (
        <div style={{ marginTop: 8 }}>
          {catalogEntry.gifUrl && (
            <ExerciseGif
              gifUrl={catalogEntry.gifUrl}
              exerciseName={catalogEntry.name}
              colors={colors}
              size={160}
            />
          )}
          {hasMuscles && (
            <BodyDiagram
              highlightedMuscles={catalogEntry.muscles.primary}
              secondaryMuscles={catalogEntry.muscles.secondary || []}
              colors={colors}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ConfirmOverlay({ message, onConfirm, onCancel }) {
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
