import React, { useEffect, useMemo, useState, useRef, useReducer, useCallback } from "react";
import { fetchCloudState, saveCloudState, createDebouncedSaver } from "./lib/supabaseSync";
import { supabase } from "./lib/supabase";
import { fetchCoachInsights } from "./lib/coachApi";

/**
 * ============================================================================
 * WORKOUT TRACKER PWA - REFACTORED VERSION
 * ============================================================================
 * 
 * Improvements made:
 * ✅ Consolidated modal state with useReducer (15+ useState → 1 useReducer)
 * ✅ Added useCallback for performance optimization
 * ✅ Better error handling with user feedback
 * ✅ Input validation with helpful error messages
 * ✅ Improved code organization with clear sections
 * ✅ Better comments for learning
 * 
 * Structure:
 * 1. Constants
 * 2. Utility Functions
 * 3. State Management (Reducer)
 * 4. Custom Hooks
 * 5. UI Components
 * 6. Main App Component
 * 7. Styles
 */

// ============================================================================
// 1. CONSTANTS - Values that never change
// ============================================================================

const LS_KEY = "workout_tracker_v2";
const LS_BACKUP_KEY = "workout_tracker_v2_backup";

const REP_UNITS = [
  // Count
  { key: "reps", label: "Reps", abbr: "reps", allowDecimal: false },
  // Distance (imperial)
  { key: "miles", label: "Miles", abbr: "mi", allowDecimal: true },
  { key: "yards", label: "Yards", abbr: "yd", allowDecimal: false },
  { key: "laps", label: "Laps", abbr: "laps", allowDecimal: false },
  { key: "steps", label: "Steps", abbr: "steps", allowDecimal: false },
  // Time
  { key: "sec", label: "Seconds", abbr: "sec", allowDecimal: true },
  { key: "min", label: "Minutes", abbr: "min", allowDecimal: true },
  { key: "hrs", label: "Hours", abbr: "hrs", allowDecimal: true },
];

function getUnit(key, exercise) {
  if (key === "custom" && exercise) {
    return {
      key: "custom",
      label: exercise.customUnitAbbr || "custom",
      abbr: exercise.customUnitAbbr || "custom",
      allowDecimal: exercise.customUnitAllowDecimal ?? false,
    };
  }
  return REP_UNITS.find((u) => u.key === key) || REP_UNITS[0];
}

// ============================================================================
// 2. UTILITY FUNCTIONS - Helper functions used throughout the app
// ============================================================================

/**
 * Converts a Date object to YYYY-MM-DD format
 */
function yyyyMmDd(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Safely parse JSON with a fallback value
 */
function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Generate a unique ID
 */
function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

/**
 * Check if a string is a valid date key (YYYY-MM-DD)
 */
function isValidDateKey(s) {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

/**
 * Add days to a date key
 */
function addDays(dateKey, delta) {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(d.getDate() + delta);
  return yyyyMmDd(d);
}

function formatDateLabel(dateKey) {
  return new Date(dateKey + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Get month key from date (YYYY-MM)
 */
function monthKeyFromDate(dateKey) {
  return dateKey.slice(0, 7);
}

/**
 * Get number of days in a month
 */
function daysInMonth(year, monthIndex0) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

/**
 * Get weekday (Monday = 0, Sunday = 6)
 */
function weekdayMonday0(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  return (d.getDay() + 6) % 7;
}

/**
 * Get weekday (Sunday = 0, Saturday = 6)
 */
function weekdaySunday0(dateKey) {
  return new Date(dateKey + "T00:00:00").getDay();
}

/**
 * Shift a month key by N months
 */
function shiftMonth(monthKey, deltaMonths) {
  const [yy, mm] = monthKey.split("-").map(Number);
  const d = new Date(yy, mm - 1, 1);
  d.setMonth(d.getMonth() + deltaMonths);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Format month for display (e.g., "January 2024")
 */
function formatMonthLabel(monthKey) {
  const [yy, mm] = monthKey.split("-").map(Number);
  const d = new Date(yy, mm - 1, 1);
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

/**
 * Get the Monday of the week containing this date
 */
function startOfWeekMonday(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  const day = d.getDay();
  const diffToMonday = (day + 6) % 7;
  d.setDate(d.getDate() - diffToMonday);
  return yyyyMmDd(d);
}

/**
 * Get the Sunday of the week containing this date
 */
function startOfWeekSunday(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(d.getDate() - d.getDay());
  return yyyyMmDd(d);
}

/**
 * Get the first day of the month
 */
function startOfMonth(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(1);
  return yyyyMmDd(d);
}

/**
 * Get the first day of the year
 */
function startOfYear(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  d.setMonth(0, 1);
  return yyyyMmDd(d);
}

/**
 * Check if a date is in a range (inclusive)
 */
function inRangeInclusive(dateKey, startKey, endKey) {
  return dateKey >= startKey && dateKey <= endKey;
}

/**
 * Convert weight string to number (or null for BW)
 */
function toNumberOrNull(weightStr) {
  if (typeof weightStr !== "string") return null;
  const t = weightStr.trim();
  if (!t) return null;
  if (t.toUpperCase() === "BW") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/**
 * Format max weight for display
 */
function formatMaxWeight(maxNum, hasBW) {
  if (maxNum != null) return String(maxNum);
  if (hasBW) return "BW";
  return "-";
}

/**
 * Default workouts for new users
 */
function defaultWorkouts() {
  return [
    {
      id: uid("w"),
      name: "Baseline",
      category: "Baseline",
      exercises: [
        { id: uid("ex"), name: "Push Ups", unit: "reps" },
        { id: uid("ex"), name: "Pull Ups", unit: "reps" },
        { id: uid("ex"), name: "Squats", unit: "reps" },
        { id: uid("ex"), name: "Face Pulls", unit: "reps" },
      ],
    },
    {
      id: uid("w"),
      name: "Workout A",
      category: "Workout",
      exercises: [
        { id: uid("ex"), name: "Incline Bench Press", unit: "reps" },
        { id: uid("ex"), name: "Row", unit: "reps" },
      ],
    },
    {
      id: uid("w"),
      name: "Workout B",
      category: "Workout",
      exercises: [
        { id: uid("ex"), name: "Overhead Press", unit: "reps" },
        { id: uid("ex"), name: "Pull Down", unit: "reps" },
      ],
    },
  ];
}

/**
 * Create default state for new users
 */
function makeDefaultState() {
  return {
    version: 1,
    program: {
      workouts: defaultWorkouts(),
    },
    logsByDate: {},
    meta: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  };
}

/**
 * Load state from localStorage with validation
 */
function loadState() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return makeDefaultState();

  const st = safeParse(raw, null);
  if (!st || typeof st !== "object") return makeDefaultState();

  const rawProgram = st.program && typeof st.program === "object" ? st.program : {};
  const rawWorkouts = Array.isArray(rawProgram.workouts) ? rawProgram.workouts : [];

  const next = {
    ...makeDefaultState(),
    ...st,
    program: { ...rawProgram, workouts: rawWorkouts },
    logsByDate: st.logsByDate && typeof st.logsByDate === "object" ? st.logsByDate : {},
    meta: { ...(st.meta ?? {}), updatedAt: Date.now() },
  };

  // Ensure every workout has valid structure and a category
  next.program.workouts = next.program.workouts.map((w) => ({
    ...w,
    exercises: Array.isArray(w.exercises) ? w.exercises : [],
    category:
      typeof w.category === "string" && w.category.trim()
        ? w.category.trim()
        : "Workout",
  }));

  return next;
}

/**
 * Save state to localStorage with error handling
 * 
 * IMPROVED: Now returns success/error info and notifies user
 */
function persistState(state) {
  try {
    // Step 1: Create backup of current data
    const currentData = localStorage.getItem(LS_KEY);
    if (currentData) {
      try {
        localStorage.setItem(LS_BACKUP_KEY, currentData);
      } catch (backupError) {
        console.warn("⚠️ Could not create backup:", backupError);
        // Continue anyway - backup failure shouldn't stop save
      }
    }

    // Step 2: Save new data
    localStorage.setItem(LS_KEY, JSON.stringify(state));

    return { success: true };

  } catch (error) {
    console.error("❌ Failed to save data:", error);

    // User-friendly error message
    let message = "Could not save your workout data. ";

    if (error.name === "QuotaExceededError") {
      message += "Storage is full. Try exporting and clearing old data.";
    } else {
      message += "Please try again or export your data as backup.";
    }

    return { success: false, error: message };
  }
}

/**
 * Validate exercise name
 * 
 * NEW: Returns { valid: boolean, error: string }
 */
function validateExerciseName(name, existingExercises = []) {
  const trimmed = (name || "").trim();

  if (!trimmed) {
    return { valid: false, error: "Exercise name cannot be empty" };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: "Exercise name is too long (max 50 characters)" };
  }

  const isDuplicate = existingExercises.some(
    (ex) => ex.name.toLowerCase() === trimmed.toLowerCase()
  );

  if (isDuplicate) {
    return { valid: false, error: "This exercise already exists in this workout" };
  }

  return { valid: true, error: null };
}

/**
 * Validate workout name
 */
function validateWorkoutName(name, existingWorkouts = []) {
  const trimmed = (name || "").trim();

  if (!trimmed) {
    return { valid: false, error: "Workout name cannot be empty" };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: "Workout name is too long (max 50 characters)" };
  }

  const isDuplicate = existingWorkouts.some(
    (w) => w.name.toLowerCase() === trimmed.toLowerCase()
  );

  if (isDuplicate) {
    return { valid: false, error: "A workout with this name already exists" };
  }

  return { valid: true, error: null };
}

// ============================================================================
// 3. AI COACH LOGIC - NEW IN V2!
// ============================================================================

/**
 * Muscle group classification for balance analysis
 */
const MUSCLE_GROUPS = {
  ANTERIOR_DELT: ['front delt', 'anterior delt', 'overhead press', 'military press', 'shoulder press'],
  LATERAL_DELT: ['side delt', 'lateral delt', 'lateral raise'],
  POSTERIOR_DELT: ['rear delt', 'posterior delt', 'face pull', 'reverse fly', 'reverse flye'],
  CHEST: ['chest', 'bench press', 'bench', 'push up', 'pushup', 'dip', 'fly', 'flye', 'pec'],
  TRICEPS: ['tricep', 'triceps', 'extension', 'skullcrusher', 'pushdown'],
  BACK: ['back', 'row', 'pull up', 'pullup', 'chin up', 'chinup', 'lat', 'pulldown', 'pull down', 'deadlift'],
  BICEPS: ['bicep', 'biceps', 'curl'],
  QUADS: ['quad', 'squat', 'leg press', 'lunge'],
  HAMSTRINGS: ['hamstring', 'leg curl', 'rdl', 'romanian'],
  GLUTES: ['glute', 'hip thrust'],
  CALVES: ['calf', 'calves', 'raise'],
  ABS: ['ab', 'abs', 'core', 'plank', 'crunch', 'sit up', 'situp'],
};

function classifyExercise(exerciseName) {
  const lower = exerciseName.toLowerCase();
  const matches = [];
  
  for (const [group, keywords] of Object.entries(MUSCLE_GROUPS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        matches.push(group);
        break;
      }
    }
  }
  
  return matches.length > 0 ? matches : ['UNCLASSIFIED'];
}

function analyzeWorkoutBalance(state, dateRange) {
  const muscleGroupVolume = {};
  const exerciseIdToName = new Map();
  
  for (const workout of state.program.workouts) {
    for (const ex of workout.exercises) {
      exerciseIdToName.set(ex.id, ex.name);
    }
  }
  
  for (const dateKey of Object.keys(state.logsByDate || {})) {
    if (!isValidDateKey(dateKey)) continue;
    if (!inRangeInclusive(dateKey, dateRange.start, dateRange.end)) continue;

    const dayLogs = state.logsByDate[dateKey];
    if (!dayLogs || typeof dayLogs !== "object") continue;

    for (const [exerciseId, log] of Object.entries(dayLogs)) {
      const exerciseName = exerciseIdToName.get(exerciseId);
      if (!exerciseName) continue;
      if (!log || !Array.isArray(log.sets)) continue;

      const groups = classifyExercise(exerciseName);
      const totalReps = log.sets.reduce((sum, set) => sum + (Number(set.reps) || 0), 0);
      
      for (const group of groups) {
        muscleGroupVolume[group] = (muscleGroupVolume[group] || 0) + totalReps;
      }
    }
  }
  
  return { muscleGroupVolume };
}

function getSuggestionsForMuscleGroup(group) {
  const suggestions = {
    POSTERIOR_DELT: [
      { exercise: 'Face Pulls', muscleGroup: 'POSTERIOR_DELT' },
      { exercise: 'Reverse Flyes', muscleGroup: 'POSTERIOR_DELT' },
    ],
    BACK: [
      { exercise: 'Pull Ups', muscleGroup: 'BACK' },
      { exercise: 'Barbell Rows', muscleGroup: 'BACK' },
      { exercise: 'Lat Pulldowns', muscleGroup: 'BACK' },
    ],
    BICEPS: [
      { exercise: 'Barbell Curls', muscleGroup: 'BICEPS' },
      { exercise: 'Hammer Curls', muscleGroup: 'BICEPS' },
    ],
    HAMSTRINGS: [
      { exercise: 'Romanian Deadlifts', muscleGroup: 'HAMSTRINGS' },
      { exercise: 'Leg Curls', muscleGroup: 'HAMSTRINGS' },
    ],
  };
  
  return suggestions[group] || [];
}

function detectImbalances(analysis) {
  const insights = [];
  const muscleGroupVolume = analysis?.muscleGroupVolume ?? {};

  const totalVolume = Object.values(muscleGroupVolume).reduce((a, b) => a + b, 0);
  
  if (totalVolume < 50) return [];
  
  // Check push/pull ratio
  const pushVolume = 
    (muscleGroupVolume.CHEST || 0) + 
    (muscleGroupVolume.ANTERIOR_DELT || 0) + 
    (muscleGroupVolume.TRICEPS || 0);
    
  const pullVolume = 
    (muscleGroupVolume.BACK || 0) + 
    (muscleGroupVolume.POSTERIOR_DELT || 0) + 
    (muscleGroupVolume.BICEPS || 0);
  
  if (pushVolume > pullVolume * 1.5 && pullVolume > 0) {
    const ratio = (pushVolume / pullVolume).toFixed(1);
    insights.push({
      type: 'IMBALANCE',
      severity: 'HIGH',
      title: '⚠️ Push/Pull Imbalance Detected',
      message: `You're doing ${ratio}x more pushing than pulling. This can lead to shoulder issues and poor posture.`,
      suggestions: [
        { exercise: 'Barbell Rows', muscleGroup: 'BACK' },
        { exercise: 'Pull Ups', muscleGroup: 'BACK' },
        { exercise: 'Face Pulls', muscleGroup: 'POSTERIOR_DELT' },
      ]
    });
  }
  
  // Check posterior delt neglect
  const anteriorDelt = muscleGroupVolume.ANTERIOR_DELT || 0;
  const posteriorDelt = muscleGroupVolume.POSTERIOR_DELT || 0;
  
  if (anteriorDelt > posteriorDelt * 2 && anteriorDelt > 30) {
    insights.push({
      type: 'IMBALANCE',
      severity: 'MEDIUM',
      title: '💡 Rear Delt Neglect',
      message: 'Your front delts are getting way more work than rear delts. Add rear delt work for balanced shoulders.',
      suggestions: getSuggestionsForMuscleGroup('POSTERIOR_DELT')
    });
  }
  
  // Check neglected groups
  const importantGroups = ['BACK', 'HAMSTRINGS', 'POSTERIOR_DELT'];
  
  for (const group of importantGroups) {
    const volume = muscleGroupVolume[group] || 0;
    const percentage = (volume / totalVolume) * 100;
    
    if (percentage < 5 && totalVolume > 100 && insights.length < 2) {
      const groupName = group.replace(/_/g, ' ').toLowerCase();
      insights.push({
        type: 'NEGLECTED',
        severity: 'LOW',
        title: `📊 ${groupName} volume is low`,
        message: `You've barely trained ${groupName} recently. Consider adding some direct work.`,
        suggestions: getSuggestionsForMuscleGroup(group)
      });
    }
  }
  
  // Positive feedback
  if (insights.length === 0 && totalVolume > 100) {
    insights.push({
      type: 'POSITIVE',
      severity: 'INFO',
      title: '✅ Training looks balanced!',
      message: 'Your workout volume is well-distributed. Keep up the great work!',
      suggestions: []
    });
  }
  
  return insights.slice(0, 3);
}

/**
 * Compute a stable signature for the AI Coach that only changes when
 * workout data actually changes meaningfully within the given date range.
 * Returns { signature, totalSets, totalReps } for threshold comparison.
 */
function computeCoachSignature(state, summaryRange) {
  const workouts = state?.program?.workouts || [];
  const logsByDate = state?.logsByDate || {};
  let totalSets = 0;
  let totalReps = 0;
  let loggedDays = 0;
  const exerciseNames = [];

  for (const w of workouts) {
    for (const ex of w.exercises || []) {
      exerciseNames.push(ex.name);
    }
  }

  for (const dateKey of Object.keys(logsByDate)) {
    if (!isValidDateKey(dateKey)) continue;
    if (dateKey < summaryRange.start || dateKey > summaryRange.end) continue;
    const dayLogs = logsByDate[dateKey];
    if (!dayLogs || typeof dayLogs !== "object") continue;
    let dayHasData = false;
    for (const log of Object.values(dayLogs)) {
      if (log && Array.isArray(log.sets)) {
        totalSets += log.sets.length;
        totalReps += log.sets.reduce((s, set) => s + (Number(set.reps) || 0), 0);
        dayHasData = true;
      }
    }
    if (dayHasData) loggedDays++;
  }

  const signature = `${summaryRange.start}|${summaryRange.end}|${loggedDays}|${totalSets}|${totalReps}|${exerciseNames.length}`;
  return { signature, totalSets, totalReps, loggedDays };
}

const COACH_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes between auto-refreshes
const COACH_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hour cache TTL
const COACH_CHANGE_THRESHOLD = 0.15; // 15% change in reps to trigger refetch

// ============================================================================
// 4. STATE MANAGEMENT - Modal Reducer
// ============================================================================

/**
 * Initial state for all modals
 * 
 * IMPROVEMENT: All modal state in one place instead of 15+ useState calls
 */
const initialModalState = {
  log: {
    isOpen: false,
    context: null, // { workoutId, exerciseId, exerciseName }
    sets: [],
    notes: "",
  },
  confirm: {
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Delete",
    onConfirm: null,
  },
  input: {
    isOpen: false,
    title: "",
    label: "",
    placeholder: "",
    value: "",
    confirmText: "Save",
    onConfirm: null,
  },
  datePicker: {
    isOpen: false,
    monthCursor: "",
  },
  addWorkout: {
    isOpen: false,
    name: "",
    category: "Workout",
  },
  addExercise: {
    isOpen: false,
    workoutId: null,
    name: "",
    unit: "reps",
    customUnitAbbr: "",
    customUnitAllowDecimal: false,
  },
  // NEW: Modal for adding suggested exercises from AI Coach
  addSuggestion: {
    isOpen: false,
    exerciseName: "",
  },
  editUnit: {
    isOpen: false,
    workoutId: null,
    exerciseId: null,
    unit: "reps",
    customUnitAbbr: "",
    customUnitAllowDecimal: false,
  },
};

/**
 * Modal reducer - handles all modal actions
 * 
 * Think of this as a command center that receives "actions" (commands)
 * and updates the state accordingly
 */
function modalReducer(state, action) {
  switch (action.type) {
    // ===== LOG MODAL =====
    case "OPEN_LOG":
      return {
        ...state,
        log: {
          isOpen: true,
          context: action.payload.context,
          sets: action.payload.sets,
          notes: action.payload.notes,
        },
      };

    case "UPDATE_LOG_SETS":
      return {
        ...state,
        log: { ...state.log, sets: action.payload },
      };

    case "UPDATE_LOG_NOTES":
      return {
        ...state,
        log: { ...state.log, notes: action.payload },
      };

    case "CLOSE_LOG":
      return {
        ...state,
        log: initialModalState.log,
      };

    // ===== CONFIRM MODAL =====
    case "OPEN_CONFIRM":
      return {
        ...state,
        confirm: {
          isOpen: true,
          title: action.payload.title,
          message: action.payload.message,
          confirmText: action.payload.confirmText || "Delete",
          onConfirm: action.payload.onConfirm,
        },
      };

    case "CLOSE_CONFIRM":
      return {
        ...state,
        confirm: initialModalState.confirm,
      };

    // ===== INPUT MODAL =====
    case "OPEN_INPUT":
      return {
        ...state,
        input: {
          isOpen: true,
          title: action.payload.title,
          label: action.payload.label,
          placeholder: action.payload.placeholder,
          value: action.payload.initialValue || "",
          confirmText: action.payload.confirmText || "Save",
          onConfirm: action.payload.onConfirm,
        },
      };

    case "UPDATE_INPUT_VALUE":
      return {
        ...state,
        input: { ...state.input, value: action.payload },
      };

    case "CLOSE_INPUT":
      return {
        ...state,
        input: initialModalState.input,
      };

    // ===== DATE PICKER =====
    case "OPEN_DATE_PICKER":
      return {
        ...state,
        datePicker: {
          isOpen: true,
          monthCursor: action.payload.monthCursor,
        },
      };

    case "UPDATE_MONTH_CURSOR":
      return {
        ...state,
        datePicker: { ...state.datePicker, monthCursor: action.payload },
      };

    case "CLOSE_DATE_PICKER":
      return {
        ...state,
        datePicker: { ...state.datePicker, isOpen: false },
      };

    // ===== ADD WORKOUT MODAL =====
    case "OPEN_ADD_WORKOUT":
      return {
        ...state,
        addWorkout: {
          isOpen: true,
          name: "",
          category: "Workout",
        },
      };

    case "UPDATE_ADD_WORKOUT":
      return {
        ...state,
        addWorkout: { ...state.addWorkout, ...action.payload },
      };

    case "CLOSE_ADD_WORKOUT":
      return {
        ...state,
        addWorkout: initialModalState.addWorkout,
      };

    // ===== ADD EXERCISE MODAL =====
    case "OPEN_ADD_EXERCISE":
      return {
        ...state,
        addExercise: {
          isOpen: true,
          workoutId: action.payload.workoutId,
          name: "",
          unit: "reps",
          customUnitAbbr: "",
          customUnitAllowDecimal: false,
        },
      };

    case "UPDATE_ADD_EXERCISE":
      return {
        ...state,
        addExercise: { ...state.addExercise, ...action.payload },
      };

    case "CLOSE_ADD_EXERCISE":
      return {
        ...state,
        addExercise: initialModalState.addExercise,
      };

    // NEW: Add suggestion modal actions
    case "OPEN_ADD_SUGGESTION":
      return {
        ...state,
        addSuggestion: {
          isOpen: true,
          exerciseName: action.payload.exerciseName,
        },
      };

    case "CLOSE_ADD_SUGGESTION":
      return {
        ...state,
        addSuggestion: initialModalState.addSuggestion,
      };

    // ===== EDIT UNIT MODAL =====
    case "OPEN_EDIT_UNIT":
      return {
        ...state,
        editUnit: {
          isOpen: true,
          workoutId: action.payload.workoutId,
          exerciseId: action.payload.exerciseId,
          unit: action.payload.unit,
          customUnitAbbr: action.payload.customUnitAbbr || "",
          customUnitAllowDecimal: action.payload.customUnitAllowDecimal ?? false,
        },
      };

    case "UPDATE_EDIT_UNIT":
      return {
        ...state,
        editUnit: { ...state.editUnit, ...action.payload },
      };

    case "CLOSE_EDIT_UNIT":
      return {
        ...state,
        editUnit: initialModalState.editUnit,
      };

    default:
      return state;
  }
}

// ============================================================================
// 4. CUSTOM HOOKS - Reusable logic
// ============================================================================

/**
 * Custom hook for swipe gestures
 * 
 * Usage: const swipe = useSwipe({ onSwipeLeft: fn, onSwipeRight: fn });
 *        <div {...swipe}>Content</div>
 */
function useSwipe({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, thresholdPx = 40 }) {
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

/**
 * Custom hook for mobile keyboard avoidance.
 * Returns the current keyboard inset (in px) using window.visualViewport.
 */
function useKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    function onResize() {
      const kb = window.innerHeight - vv.height;
      setInset(kb > 0 ? kb : 0);
    }

    vv.addEventListener("resize", onResize);
    onResize();
    return () => vv.removeEventListener("resize", onResize);
  }, []);

  return inset;
}

// ============================================================================
// 5. UI COMPONENTS - Reusable UI pieces
// ============================================================================

/**
 * Pill-style tabs component
 */
function PillTabs({ tabs, value, onChange, styles }) {
  return (
    <div style={styles.pillRow}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            style={{
              ...styles.pill,
              ...(active ? styles.pillActive : styles.pillInactive),
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Category autocomplete input
 */
function CategoryAutocomplete({ value, onChange, suggestions, placeholder, styles }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const query = (value || "").trim().toLowerCase();
  const filtered = query
    ? suggestions.filter((s) => s.toLowerCase().includes(query) && s.toLowerCase() !== query)
    : suggestions;

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        style={styles.textInput}
        placeholder={placeholder}
      />
      {open && filtered.length > 0 && (
        <div style={styles.autocompleteDropdown}>
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              style={styles.autocompleteOption}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(s);
                setOpen(false);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Modal component - reusable sheet-style modal with keyboard avoidance
 */
function Modal({ open, title, children, onClose, styles }) {
  const kbInset = useKeyboardInset();

  if (!open) return null;

  const handleFocusCapture = (e) => {
    const el = e.target;
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT") {
      setTimeout(() => {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 120);
    }
  };

  return (
    <div style={{ ...styles.modalOverlay, paddingBottom: 10 + kbInset }} onMouseDown={onClose}>
      <div
        style={{ ...styles.modalSheet, maxHeight: `calc(100dvh - ${10 + kbInset}px)` }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>{title}</div>
          <button onClick={onClose} style={styles.iconBtn} aria-label="Close">
            ×
          </button>
        </div>
        <div
          style={{ ...styles.modalBody, maxHeight: `calc(78dvh - ${kbInset}px)` }}
          onFocusCapture={handleFocusCapture}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Confirmation modal
 */
function ConfirmModal({ open, title, message, confirmText = "Delete", onCancel, onConfirm, styles }) {
  if (!open) return null;

  return (
    <Modal open={open} title={title} onClose={onCancel} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={styles.smallText}>{message}</div>
        <div style={styles.modalFooter}>
          <button style={styles.secondaryBtn} onClick={onCancel}>
            Cancel
          </button>
          <button style={styles.dangerBtn} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/**
 * Input modal
 */
function InputModal({
  open,
  title,
  label,
  placeholder,
  value = "",
  confirmText = "Save",
  onCancel,
  onConfirm,
  onChange,
  styles,
}) {
  if (!open) return null;

  return (
    <Modal open={open} title={title} onClose={onCancel} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={styles.fieldCol}>
          <label style={styles.label}>{label}</label>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={styles.textInput}
            placeholder={placeholder}
            autoFocus
          />
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.secondaryBtn} onClick={onCancel}>
            Cancel
          </button>
          <button style={styles.primaryBtn} onClick={() => onConfirm(value)}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/**
 * Theme switch component
 */
function ThemeSwitch({ theme, onToggle, styles }) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      style={styles.themeSwitch}
      aria-label="Toggle theme"
      type="button"
    >
      <span
        style={{
          ...styles.themeSwitchTrack,
          ...(isDark ? styles.themeSwitchTrackDark : styles.themeSwitchTrackLight),
        }}
      >
        <span
          style={{
            ...styles.themeSwitchThumb,
            ...(isDark ? styles.themeSwitchThumbDark : styles.themeSwitchThumbLight),
            transform: isDark ? "translateX(20px)" : "translateX(0px)",
          }}
        />
      </span>
      <span style={styles.themeSwitchLabel}>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

/**
 * NEW: AI Coach Insights Card
 */
function CoachInsightsCard({ insights, onAddExercise, styles, collapsed, onToggle, loading, error, onRefresh }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const hasInsights = insights.length > 0;
  if (!loading && !hasInsights && !error) return null;

  return (
    <div style={styles.card}>
      <div style={collapsed ? { ...styles.cardHeader, marginBottom: 0 } : styles.cardHeader} onClick={onToggle}>
        <div style={styles.cardTitle}>🤖 AI Coach</div>
        <span style={styles.badge}>
          {loading && !hasInsights ? '...' : `${insights.length} insight${insights.length !== 1 ? 's' : ''}`}
        </span>
        <span style={styles.collapseToggle}>{collapsed ? "▶" : "▼"}</span>
      </div>

      {!collapsed && (
        <>
          {error && (
            <div style={{ padding: '8px 12px', marginBottom: 8, fontSize: 13, opacity: 0.7, background: 'rgba(245,158,11,0.1)', borderRadius: 8 }}>
              {error}
            </div>
          )}

          {hasInsights ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: loading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
              {insights.map((insight, idx) => (
                <InsightItem
                  key={idx}
                  insight={insight}
                  isExpanded={expandedIndex === idx}
                  onToggle={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                  onAddExercise={onAddExercise}
                  styles={styles}
                />
              ))}
            </div>
          ) : loading ? (
            <div style={{ padding: '16px 0', textAlign: 'center', opacity: 0.6, fontSize: 14 }}>
              Analyzing your workouts...
            </div>
          ) : null}

          <div style={styles.coachFooter}>
            Powered by AI{loading ? ' — updating...' : ''}
            {onRefresh && !loading && (
              <>
                {' · '}
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); onRefresh(); }}
                  style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Refresh
                </a>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function InsightItem({ insight, isExpanded, onToggle, onAddExercise, styles }) {
  const severityColors = {
    HIGH: '#ef4444',
    MEDIUM: '#f59e0b',
    LOW: '#3b82f6',
    INFO: '#10b981',
  };
  
  return (
    <div style={{
      ...styles.insightCard,
      borderLeft: `4px solid ${severityColors[insight.severity]}`
    }}>
      <button 
        onClick={onToggle}
        style={styles.insightHeader}
        type="button"
      >
        <div style={{ flex: 1 }}>
          <div style={styles.insightTitle}>{insight.title}</div>
          <div style={styles.insightMessage}>{insight.message}</div>
        </div>
        {insight.suggestions.length > 0 && (
          <span style={styles.insightChevron}>
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
      </button>
      
      {isExpanded && insight.suggestions.length > 0 && (
        <div style={styles.insightSuggestions}>
          <div style={styles.suggestionsTitle}>💪 Suggested exercises:</div>
          {insight.suggestions.map((suggestion, i) => (
            <div key={i} style={styles.suggestionRow}>
              <div style={{ flex: 1 }}>
                <div style={styles.suggestionName}>{suggestion.exercise}</div>
                <div style={styles.suggestionGroup}>
                  {suggestion.muscleGroup.replace(/_/g, ' ').toLowerCase()}
                </div>
              </div>
              <button
                onClick={() => onAddExercise(suggestion.exercise)}
                style={styles.addSuggestionBtn}
                type="button"
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * NEW: Modal for selecting workout to add suggested exercise to
 */
function AddSuggestedExerciseModal({ open, exerciseName, workouts, onCancel, onConfirm, styles }) {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(workouts[0]?.id || null);
  
  useEffect(() => {
    if (open && workouts.length > 0) {
      setSelectedWorkoutId(workouts[0].id);
    }
  }, [open, workouts]);
  
  if (!open) return null;
  
  return (
    <Modal open={open} title={`Add "${exerciseName}"`} onClose={onCancel} styles={styles}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={styles.fieldCol}>
          <label style={styles.label}>Add to which workout?</label>
          <select
            value={selectedWorkoutId || ''}
            onChange={(e) => setSelectedWorkoutId(e.target.value)}
            style={styles.textInput}
          >
            {workouts.map(w => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.category})
              </option>
            ))}
          </select>
        </div>
        
        <div style={styles.smallText}>
          💡 This will add <b>"{exerciseName}"</b> to your selected workout. You can rename or remove it later.
        </div>
        
        <div style={styles.modalFooter}>
          <button style={styles.secondaryBtn} onClick={onCancel}>
            Cancel
          </button>
          <button 
            style={styles.primaryBtn} 
            onClick={() => onConfirm(selectedWorkoutId, exerciseName)}
            disabled={!selectedWorkoutId}
          >
            Add Exercise
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================================
// 6. MAIN APP COMPONENT
// ============================================================================

export default function App({ session, onLogout }) {
  // ---------------------------------------------------------------------------
  // STATE - What the app remembers
  // ---------------------------------------------------------------------------

  const [state, setState] = useState(() => loadState());
  const [dataReady, setDataReady] = useState(false);
  const cloudSaver = useRef(null);
  const [tab, setTab] = useState(() => sessionStorage.getItem("wt_tab") || "today");
  const [summaryMode, setSummaryMode] = useState("wtd");
  const [dateKey, setDateKey] = useState(() => yyyyMmDd(new Date()));
  const [manageWorkoutId, setManageWorkoutId] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("wt_theme") || "dark");
  const [reorderWorkouts, setReorderWorkouts] = useState(false);
  const [reorderExercises, setReorderExercises] = useState(false);
  const [overflowMenuOpen, setOverflowMenuOpen] = useState(false);
  const [collapsedToday, setCollapsedToday] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wt_collapsed_today"))); } catch { return new Set(); }
  });
  const [collapsedSummary, setCollapsedSummary] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wt_collapsed_summary"))); } catch { return new Set(); }
  });
  const [autoCollapseEmpty, setAutoCollapseEmpty] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wt_auto_collapse_empty")) === true; } catch { return false; }
  });
  const manualExpandRef = useRef(new Set()); // tracks workouts user manually expanded

  // AI Coach state
  const [profile, setProfile] = useState(null);
  const [coachInsights, setCoachInsights] = useState([]);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState(null);
  const coachReqIdRef = useRef(0);
  const coachCacheRef = useRef(new Map());
  const coachLastSignatureRef = useRef(null);
  const coachLastFetchRef = useRef(0); // timestamp of last successful AI fetch

  // Swipe navigation between tabs
  const touchRef = useRef({ startX: 0, startY: 0, swiping: false, locked: false });
  const bodyRef = useRef(null);
  const TAB_ORDER = ["today", "summary", "manage"];

  const handleTouchStart = useCallback((e) => {
    touchRef.current.startX = e.touches[0].clientX;
    touchRef.current.startY = e.touches[0].clientY;
    touchRef.current.swiping = false;
    touchRef.current.locked = false;
    // Blur any focused button to prevent stuck highlight
    try { if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); } catch {}
    if (bodyRef.current) {
      bodyRef.current.style.transition = "none";
      bodyRef.current.style.willChange = "transform, opacity";
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    const dx = e.touches[0].clientX - touchRef.current.startX;
    const dy = e.touches[0].clientY - touchRef.current.startY;

    // Once locked to vertical scrolling, don't interfere
    if (touchRef.current.locked) return;

    // Decide direction after 10px of movement
    if (!touchRef.current.swiping && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      if (Math.abs(dx) > Math.abs(dy)) {
        touchRef.current.swiping = true;
      } else {
        touchRef.current.locked = true;
        return;
      }
    }

    if (touchRef.current.swiping && bodyRef.current) {
      // Add resistance at the edges
      const idx = TAB_ORDER.indexOf(tab);
      let clamped = dx;
      if (dx > 0 && idx === 0) clamped = dx * 0.2;
      if (dx < 0 && idx === TAB_ORDER.length - 1) clamped = dx * 0.2;

      bodyRef.current.style.transform = `translateX(${clamped}px)`;
      bodyRef.current.style.opacity = `${1 - Math.min(Math.abs(clamped) / 600, 0.3)}`;
      e.preventDefault();
    }
  }, [tab]);

  const handleTouchEnd = useCallback((e) => {
    if (!touchRef.current.swiping || !bodyRef.current) {
      touchRef.current.swiping = false;
      return;
    }

    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    const idx = TAB_ORDER.indexOf(tab);
    const threshold = 60;

    if (Math.abs(dx) > threshold) {
      // Determine direction
      const goNext = dx < 0 && idx < TAB_ORDER.length - 1;
      const goPrev = dx > 0 && idx > 0;

      if (goNext || goPrev) {
        const direction = goNext ? -1 : 1;
        bodyRef.current.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
        bodyRef.current.style.transform = `translateX(${direction * window.innerWidth}px)`;
        bodyRef.current.style.opacity = "0.3";

        setTimeout(() => {
          setTab(goNext ? TAB_ORDER[idx + 1] : TAB_ORDER[idx - 1]);
          if (bodyRef.current) {
            bodyRef.current.style.transition = "none";
            bodyRef.current.style.transform = `translateX(${-direction * window.innerWidth * 0.3}px)`;
            bodyRef.current.style.opacity = "0.3";
            // Force reflow then animate in
            bodyRef.current.offsetHeight;
            bodyRef.current.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
            bodyRef.current.style.transform = "translateX(0)";
            bodyRef.current.style.opacity = "1";
          }
        }, 200);
      } else {
        // At edge, snap back
        bodyRef.current.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
        bodyRef.current.style.transform = "translateX(0)";
        bodyRef.current.style.opacity = "1";
      }
    } else {
      // Below threshold, snap back
      bodyRef.current.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
      bodyRef.current.style.transform = "translateX(0)";
      bodyRef.current.style.opacity = "1";
    }

    touchRef.current.swiping = false;
    // Clear will-change after animation settles
    setTimeout(() => { if (bodyRef.current) bodyRef.current.style.willChange = "auto"; }, 450);
  }, [tab]);

  function toggleCollapse(setter, id) {
    setter((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function collapseAll(setter, ids) {
    setter(new Set(ids));
  }

  function expandAll(setter) {
    setter(new Set());
  }

  // IMPROVEMENT: All modal state consolidated into one reducer
  const [modals, dispatchModal] = useReducer(modalReducer, {
    ...initialModalState,
    datePicker: {
      ...initialModalState.datePicker,
      monthCursor: monthKeyFromDate(dateKey),
    },
  });

  // ---------------------------------------------------------------------------
  // CLOUD SYNC — Fetch from Supabase on mount, migrate if needed
  // ---------------------------------------------------------------------------
  useEffect(() => {
    cloudSaver.current = createDebouncedSaver(2000);

    let cancelled = false;

    async function init() {
      try {
        const cloudState = await fetchCloudState(session.user.id);

        if (cancelled) return;

        if (cloudState && typeof cloudState === "object" && Object.keys(cloudState).length > 0) {
          // Cloud has data — use it as source of truth
          setState(cloudState);
          persistState(cloudState);
        } else {
          // Cloud is empty — migrate current localStorage state up
          const localState = loadState();
          await saveCloudState(session.user.id, localState);
        }
      } catch (err) {
        // Network error — continue with localStorage data
        console.error("Cloud sync init failed, using localStorage:", err);
      }

      if (!cancelled) setDataReady(true);
    }

    init();

    return () => {
      cancelled = true;
      cloudSaver.current?.cancel();
    };
  }, [session.user.id]);

  // Fetch user profile from Supabase
  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("age, weight_lbs, goal, about, sports")
          .eq("id", session.user.id)
          .single();
        if (!cancelled && data && !error) {
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }
    loadProfile();
    return () => { cancelled = true; };
  }, [session.user.id]);

  const todayKey = yyyyMmDd(new Date());

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES - Derived from state
  // ---------------------------------------------------------------------------

  const colors = useMemo(
    () =>
      theme === "dark"
        ? {
            appBg: "#0b0f14",
            text: "#e8eef7",
            border: "rgba(255,255,255,0.10)",
            cardBg: "#0f1722",
            cardAltBg: "#0b111a",
            inputBg: "#0f1722",
            navBg: "#0b0f14",
            topBarBg: "#0b0f14",
            shadow: "0 8px 18px rgba(0,0,0,0.25)",
            primaryBg: "#152338",
            primaryText: "#e8eef7",
            dangerBg: "rgba(255, 80, 80, 0.14)",
            dangerBorder: "rgba(255, 120, 120, 0.45)",
            dangerText: "#ffd7d7",
            dot: "#7dd3fc",
          }
        : {
            appBg: "#f5f9fc",
            text: "#1f2933",
            border: "#dde5ec",
            cardBg: "#ffffff",
            cardAltBg: "#eef6f3",
            inputBg: "#ffffff",
            navBg: "#f5f9fc",
            topBarBg: "#f5f9fc",
            shadow: "0 8px 18px rgba(31,41,51,0.08)",
            primaryBg: "#2b5b7a",
            primaryText: "#ffffff",
            dangerBg: "rgba(220, 38, 38, 0.12)",
            dangerBorder: "rgba(220, 38, 38, 0.35)",
            dangerText: "#b91c1c",
            dot: "#2563eb",
          },
    [theme]
  );

  const styles = useMemo(() => getStyles(colors), [colors]);

  const workouts = state.program.workouts;

  const categoryOptions = useMemo(() => {
    const defaults = ["Workout", "Push", "Pull", "Legs", "Upper", "Lower", "Cardio", "Stretch", "Abs"];
    const existing = workouts.map((w) => (w.category || "Workout").trim());
    const seen = new Set();
    const result = [];
    for (const c of [...existing, ...defaults]) {
      const key = c.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(c);
      }
    }
    return result;
  }, [workouts]);

  const workoutById = useMemo(() => {
    const m = new Map();
    for (const w of workouts) m.set(w.id, w);
    return m;
  }, [workouts]);

  const logsForDate = state.logsByDate[dateKey] ?? {};

  const summaryRange = useMemo(() => {
    if (summaryMode === "wtd") {
      return { start: startOfWeekSunday(dateKey), end: dateKey, label: "WTD" };
    }
    if (summaryMode === "mtd") {
      return { start: startOfMonth(dateKey), end: dateKey, label: "MTD" };
    }
    return { start: startOfYear(dateKey), end: dateKey, label: "YTD" };
  }, [dateKey, summaryMode]);

  const summaryDaysLogged = useMemo(() => {
    let logged = 0;
    let total = 0;
    let d = summaryRange.start;
    while (d <= summaryRange.end) {
      total++;
      const dayLogs = state.logsByDate[d];
      if (dayLogs && typeof dayLogs === "object" && Object.keys(dayLogs).length > 0) {
        logged++;
      }
      d = addDays(d, 1);
    }
    return { logged, total };
  }, [state.logsByDate, summaryRange]);

  const loggedDaysInMonth = useMemo(() => {
    const set = new Set();
    const prefix = modals.datePicker.monthCursor + "-";

    for (const dk of Object.keys(state.logsByDate || {})) {
      if (!isValidDateKey(dk)) continue;
      if (!dk.startsWith(prefix)) continue;

      const dayLogs = state.logsByDate[dk];
      if (dayLogs && typeof dayLogs === "object" && Object.keys(dayLogs).length > 0) {
        set.add(dk);
      }
    }
    return set;
  }, [state.logsByDate, modals.datePicker.monthCursor]);

  // AI Coach — stable signature that only changes when workout data meaningfully changes
  const { signature: coachSignature, totalReps: coachTotalReps } = useMemo(
    () => computeCoachSignature(state, summaryRange),
    [state.logsByDate, state.program.workouts, summaryRange]
  );

  // AI Coach — load from localStorage cache on mount / signature change, fetch only when needed
  useEffect(() => {
    if (!dataReady || !profile) return;

    const userId = session.user.id;
    const cacheKey = `wt_coach_v2:${userId}:${summaryMode}:${dateKey}`;

    // 1. Try localStorage persisted cache
    if (coachInsights.length === 0) {
      try {
        const stored = JSON.parse(localStorage.getItem(cacheKey));
        if (stored && stored.insights?.length > 0 && Date.now() - stored.createdAt < COACH_CACHE_TTL_MS) {
          setCoachInsights(stored.insights);
          coachLastSignatureRef.current = stored.signature;
          coachLastFetchRef.current = stored.createdAt;
          // If signature matches, no need to fetch
          if (stored.signature === coachSignature) return;
        }
      } catch {}
    }

    // 2. Check in-memory cache
    const memCached = coachCacheRef.current.get(coachSignature);
    if (memCached && Date.now() - memCached.createdAt < COACH_CACHE_TTL_MS) {
      setCoachInsights(memCached.insights);
      setCoachError(null);
      return;
    }

    // 3. Cooldown check — don't auto-fetch if we fetched recently
    const timeSinceLastFetch = Date.now() - coachLastFetchRef.current;
    if (timeSinceLastFetch < COACH_COOLDOWN_MS && coachInsights.length > 0) {
      // Check minimum change threshold
      const prevSig = coachLastSignatureRef.current;
      if (prevSig) {
        const prevReps = parseInt(prevSig.split("|")[4]) || 0;
        const change = prevReps > 0 ? Math.abs(coachTotalReps - prevReps) / prevReps : 1;
        if (change < COACH_CHANGE_THRESHOLD) return; // Not enough change, skip
      }
    }

    // 4. Fetch from AI with race protection
    let cancelled = false;
    const reqId = ++coachReqIdRef.current;

    setCoachLoading(true);
    // Don't clear insights — keep showing previous while loading

    fetchCoachInsights({ profile, state, dateRange: summaryRange })
      .then(({ insights }) => {
        if (cancelled || coachReqIdRef.current !== reqId) return;
        setCoachInsights(insights);
        setCoachError(null);
        coachLastSignatureRef.current = coachSignature;
        coachLastFetchRef.current = Date.now();
        // Save to caches
        coachCacheRef.current.set(coachSignature, { insights, createdAt: Date.now() });
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            insights, signature: coachSignature, createdAt: Date.now(),
          }));
        } catch {}
      })
      .catch((err) => {
        if (cancelled || coachReqIdRef.current !== reqId) return;
        console.error("AI Coach error:", err);
        // Only fall back to static if we have no cached insights at all
        if (coachInsights.length === 0) {
          const analysis = analyzeWorkoutBalance(state, summaryRange);
          setCoachInsights(detectImbalances(analysis));
        }
        setCoachError("AI coach unavailable — showing basic analysis");
      })
      .finally(() => {
        if (!cancelled && coachReqIdRef.current === reqId) {
          setCoachLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [dataReady, profile, coachSignature]);

  // ---------------------------------------------------------------------------
  // EFFECTS - Side effects (saving, syncing)
  // ---------------------------------------------------------------------------

  // Keep calendar month aligned with selected date
  useEffect(() => {
    dispatchModal({
      type: "UPDATE_MONTH_CURSOR",
      payload: monthKeyFromDate(dateKey),
    });
  }, [dateKey]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("wt_theme", theme);
  }, [theme]);

  // Persist active tab across refresh
  useEffect(() => {
    sessionStorage.setItem("wt_tab", tab);
  }, [tab]);

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem("wt_collapsed_today", JSON.stringify([...collapsedToday]));
  }, [collapsedToday]);

  useEffect(() => {
    localStorage.setItem("wt_collapsed_summary", JSON.stringify([...collapsedSummary]));
  }, [collapsedSummary]);

  useEffect(() => {
    localStorage.setItem("wt_auto_collapse_empty", JSON.stringify(autoCollapseEmpty));
  }, [autoCollapseEmpty]);

  // Auto-collapse empty workout cards on date change (respects manual overrides)
  useEffect(() => {
    // Reset manual overrides when date changes
    manualExpandRef.current.clear();
    if (!autoCollapseEmpty) return;
    const dayLogs = state.logsByDate[dateKey] ?? {};
    const emptyIds = workouts
      .filter((w) => !w.exercises.some((ex) => dayLogs[ex.id]?.sets?.length > 0))
      .map((w) => w.id);
    const filledIds = workouts
      .filter((w) => w.exercises.some((ex) => dayLogs[ex.id]?.sets?.length > 0))
      .map((w) => w.id);
    setCollapsedToday((prev) => {
      const next = new Set(prev);
      for (const id of emptyIds) {
        if (!manualExpandRef.current.has(id)) next.add(id);
      }
      for (const id of filledIds) next.delete(id);
      return next;
    });
  }, [dateKey, autoCollapseEmpty]);

  // Reset overflow menu and exercise reorder when switching workouts
  useEffect(() => {
    setOverflowMenuOpen(false);
    setReorderExercises(false);
  }, [manageWorkoutId]);


  // Persist state changes (localStorage immediate, Supabase debounced)
  useEffect(() => {
    const stateWithMeta = {
      ...state,
      meta: { ...(state.meta ?? {}), updatedAt: Date.now() },
    };

    const result = persistState(stateWithMeta);

    // IMPROVEMENT: Show error to user if save failed
    if (!result.success) {
      console.error(result.error);
    }

    // Debounced cloud save (only after initial load is done)
    if (dataReady) {
      cloudSaver.current?.trigger(session.user.id, stateWithMeta);
    }
  }, [state, dataReady, session.user.id]);

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------

  /**
   * Update app state
   */
  function updateState(updater) {
    setState((prev) => {
      const next = updater(structuredClone(prev));
      next.meta = { ...(next.meta ?? {}), updatedAt: Date.now() };
      return next;
    });
  }

  /**
   * Find most recent log for an exercise before a date
   */
  function findMostRecentLogBefore(exerciseId, beforeDateKey) {
    const keys = Object.keys(state.logsByDate).filter(
      (k) => isValidDateKey(k) && k < beforeDateKey
    );
    keys.sort((a, b) => (a > b ? -1 : 1));
    for (const k of keys) {
      const exLog = state.logsByDate[k]?.[exerciseId];
      if (exLog && Array.isArray(exLog.sets)) return exLog;
    }
    return null;
  }

  /**
   * Compute summary stats for an exercise
   */
  function computeExerciseSummary(exerciseId, startKey, endKey, unit) {
    let totalReps = 0;
    let maxNum = null;
    let hasBW = false;

    for (const dk of Object.keys(state.logsByDate)) {
      if (!isValidDateKey(dk)) continue;
      if (!inRangeInclusive(dk, startKey, endKey)) continue;

      const exLog = state.logsByDate[dk]?.[exerciseId];
      if (!exLog || !Array.isArray(exLog.sets)) continue;

      for (const set of exLog.sets) {
        const reps = Number(set.reps ?? 0);
        if (Number.isFinite(reps)) totalReps += reps;

        const w = String(set.weight ?? "").trim();
        if (w.toUpperCase() === "BW") {
          hasBW = true;
        } else {
          const n = toNumberOrNull(w);
          if (n != null) maxNum = maxNum == null ? n : Math.max(maxNum, n);
        }
      }
    }

    const displayTotal = unit?.allowDecimal
      ? parseFloat(totalReps.toFixed(2))
      : Math.floor(totalReps);

    return { totalReps: displayTotal, maxWeight: formatMaxWeight(maxNum, hasBW) };
  }

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS - IMPROVEMENT: Wrapped in useCallback for performance
  // ---------------------------------------------------------------------------

  /**
   * Open log modal for an exercise
   */
  const openLog = useCallback(
    (workoutId, exercise) => {
      const exerciseId = exercise.id;
      const existing = state.logsByDate[dateKey]?.[exerciseId] ?? null;
      const prior = existing ?? findMostRecentLogBefore(exerciseId, dateKey);

      const sets = prior?.sets?.length
        ? prior.sets.map((s) => ({
            reps: Number(s.reps ?? 0) || 0,
            weight: typeof s.weight === "string" ? s.weight : "",
          }))
        : [{ reps: 0, weight: "" }];

      const normalizedSets = sets.map((s) => {
        const isBW = String(s.weight).toUpperCase() === "BW";
        return { reps: s.reps, weight: isBW ? "BW" : String(s.weight ?? "").trim() };
      });

      dispatchModal({
        type: "OPEN_LOG",
        payload: {
          context: {
            workoutId,
            exerciseId,
            exerciseName: exercise.name,
            unit: exercise.unit || "reps",
            customUnitAbbr: exercise.customUnitAbbr || "",
            customUnitAllowDecimal: exercise.customUnitAllowDecimal ?? false,
          },
          sets: normalizedSets,
          notes: prior?.notes ?? "",
        },
      });
    },
    [state.logsByDate, dateKey]
  );

  /**
   * Save the current log
   */
  const saveLog = useCallback(() => {
    if (!modals.log.context) return;

    const logCtx = modals.log.context;

    updateState((st) => {
      // Look up exercise from program for current unit
      let logExercise = null;
      for (const wk of st.program.workouts) {
        const found = wk.exercises.find((e) => e.id === logCtx.exerciseId);
        if (found) { logExercise = found; break; }
      }
      const logUnit = logExercise ? getUnit(logExercise.unit, logExercise) : getUnit("reps");

      const cleanedSets = (Array.isArray(modals.log.sets) ? modals.log.sets : [])
        .map((s) => {
          const reps = Number(s.reps ?? 0);
          const repsClean = Number.isFinite(reps) && reps > 0
            ? (logUnit.allowDecimal ? parseFloat(reps.toFixed(2)) : Math.floor(reps))
            : 0;
          const w = String(s.weight ?? "").trim();
          const weight = w.toUpperCase() === "BW" ? "BW" : w.replace(/[^\d.]/g, "");
          return { reps: repsClean, weight: weight || "" };
        })
        .filter((s) => s.reps > 0);

      // Save the log entry (no unit persistence — units are managed in Manage tab)
      st.logsByDate[dateKey] = st.logsByDate[dateKey] ?? {};
      st.logsByDate[dateKey][logCtx.exerciseId] = {
        sets: cleanedSets.length ? cleanedSets : [{ reps: 0, weight: "BW" }],
        notes: modals.log.notes ?? "",
      };

      return st;
    });

    dispatchModal({ type: "CLOSE_LOG" });
  }, [modals.log, dateKey]);

  /**
   * Delete log for an exercise
   */
  const deleteLogForExercise = useCallback(
    (exerciseId) => {
      updateState((st) => {
        if (!st.logsByDate[dateKey]) return st;
        delete st.logsByDate[dateKey][exerciseId];
        return st;
      });
    },
    [dateKey]
  );

  /**
   * Add a new workout
   */
  function addWorkout() {
    dispatchModal({ type: "OPEN_ADD_WORKOUT" });
  }

  /**
   * Rename a workout
   */
  const renameWorkout = useCallback(
    (workoutId) => {
      const w = workoutById.get(workoutId);
      if (!w) return;

      dispatchModal({
        type: "OPEN_INPUT",
        payload: {
          title: "Rename workout",
          label: "Workout name",
          placeholder: "e.g. Push Day",
          initialValue: w.name,
          onConfirm: (val) => {
            // IMPROVEMENT: Validate input
            const validation = validateWorkoutName(val, workouts.filter((x) => x.id !== workoutId));
            if (!validation.valid) {
              alert("⚠️ " + validation.error);
              return;
            }

            const name = val.trim();
            updateState((st) => {
              const ww = st.program.workouts.find((x) => x.id === workoutId);
              if (ww) ww.name = name;
              return st;
            });
            dispatchModal({ type: "CLOSE_INPUT" });
          },
        },
      });
    },
    [workoutById, workouts]
  );

  /**
   * Set workout category
   */
  const setWorkoutCategory = useCallback(
    (workoutId) => {
      const w = workoutById.get(workoutId);
      if (!w) return;

      dispatchModal({
        type: "OPEN_INPUT",
        payload: {
          title: "Set category",
          label: "Workout category",
          placeholder: "e.g. Push / Pull / Legs / Stretch",
          initialValue: (w.category || "Workout").trim(),
          onConfirm: (val) => {
            const next = (val || "").trim() || "Workout";
            updateState((st) => {
              const ww = st.program.workouts.find((x) => x.id === workoutId);
              if (ww) ww.category = next;
              return st;
            });
            dispatchModal({ type: "CLOSE_INPUT" });
          },
        },
      });
    },
    [workoutById]
  );

  /**
   * Delete a workout
   */
  const deleteWorkout = useCallback(
    (workoutId) => {
      const w = workoutById.get(workoutId);
      if (!w) return;

      dispatchModal({
        type: "OPEN_CONFIRM",
        payload: {
          title: "Delete workout?",
          message: `Delete ${w.name}? This will NOT delete past logs.`,
          confirmText: "Delete",
          onConfirm: () => {
            updateState((st) => {
              st.program.workouts = st.program.workouts.filter((x) => x.id !== workoutId);
              return st;
            });
            if (manageWorkoutId === workoutId) setManageWorkoutId(null);
            dispatchModal({ type: "CLOSE_CONFIRM" });
          },
        },
      });
    },
    [workoutById, manageWorkoutId]
  );

  /**
   * Add an exercise to a workout
   */
  const addExercise = useCallback(
    (workoutId) => {
      const workout = workoutById.get(workoutId);
      if (!workout) return;

      dispatchModal({
        type: "OPEN_ADD_EXERCISE",
        payload: { workoutId },
      });
    },
    [workoutById]
  );

  /**
   * Rename an exercise
   */
  const renameExercise = useCallback(
    (workoutId, exerciseId) => {
      const w = workoutById.get(workoutId);
      const ex = w?.exercises?.find((e) => e.id === exerciseId);
      if (!ex) return;

      dispatchModal({
        type: "OPEN_INPUT",
        payload: {
          title: "Rename exercise",
          label: "Exercise name",
          placeholder: "e.g. Bench Press",
          initialValue: ex.name,
          onConfirm: (val) => {
            // IMPROVEMENT: Validate input
            const otherExercises = w.exercises.filter((e) => e.id !== exerciseId);
            const validation = validateExerciseName(val, otherExercises);
            if (!validation.valid) {
              alert("⚠️ " + validation.error);
              return;
            }

            const name = val.trim();
            updateState((st) => {
              const ww = st.program.workouts.find((x) => x.id === workoutId);
              const ee = ww?.exercises?.find((e) => e.id === exerciseId);
              if (ee) ee.name = name;
              return st;
            });
            dispatchModal({ type: "CLOSE_INPUT" });
          },
        },
      });
    },
    [workoutById]
  );

  /**
   * Delete an exercise
   */
  const deleteExercise = useCallback(
    (workoutId, exerciseId) => {
      const w = workoutById.get(workoutId);
      const ex = w?.exercises?.find((e) => e.id === exerciseId);
      if (!ex) return;

      dispatchModal({
        type: "OPEN_CONFIRM",
        payload: {
          title: "Delete exercise?",
          message: `Delete "${ex.name}"? This will NOT delete past logs.`,
          confirmText: "Delete",
          onConfirm: () => {
            updateState((st) => {
              const ww = st.program.workouts.find((x) => x.id === workoutId);
              if (!ww) return st;
              ww.exercises = ww.exercises.filter((e) => e.id !== exerciseId);
              return st;
            });
            dispatchModal({ type: "CLOSE_CONFIRM" });
          },
        },
      });
    },
    [workoutById]
  );

  /**
   * Edit unit for an exercise (from Manage tab)
   */
  const editUnitExercise = useCallback(
    (workoutId, exerciseId) => {
      const w = workoutById.get(workoutId);
      const ex = w?.exercises?.find((e) => e.id === exerciseId);
      if (!ex) return;

      dispatchModal({
        type: "OPEN_EDIT_UNIT",
        payload: {
          workoutId,
          exerciseId,
          unit: ex.unit || "reps",
          customUnitAbbr: ex.customUnitAbbr || "",
          customUnitAllowDecimal: ex.customUnitAllowDecimal ?? false,
        },
      });
    },
    [workoutById]
  );

  const saveEditUnit = useCallback(() => {
    const { workoutId, exerciseId, unit, customUnitAbbr, customUnitAllowDecimal } = modals.editUnit;

    if (unit === "custom" && !customUnitAbbr?.trim()) {
      alert("\u26a0\ufe0f Please enter a custom unit abbreviation");
      return;
    }

    updateState((st) => {
      const w = st.program.workouts.find((x) => x.id === workoutId);
      const ex = w?.exercises?.find((e) => e.id === exerciseId);
      if (!ex) return st;
      ex.unit = unit;
      if (unit === "custom") {
        ex.customUnitAbbr = customUnitAbbr.trim();
        ex.customUnitAllowDecimal = customUnitAllowDecimal ?? false;
      } else {
        delete ex.customUnitAbbr;
        delete ex.customUnitAllowDecimal;
      }
      return st;
    });

    dispatchModal({ type: "CLOSE_EDIT_UNIT" });
  }, [modals.editUnit]);

  /**
   * Move a workout up or down in the list
   */
  function moveWorkout(workoutId, direction) {
    updateState((st) => {
      const arr = st.program.workouts;
      const idx = arr.findIndex((w) => w.id === workoutId);
      if (idx < 0) return st;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= arr.length) return st;
      [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
      return st;
    });
  }

  /**
   * Move an exercise up or down within a workout
   */
  function moveExercise(workoutId, exerciseId, direction) {
    updateState((st) => {
      const w = st.program.workouts.find((x) => x.id === workoutId);
      if (!w) return st;
      const arr = w.exercises;
      const idx = arr.findIndex((e) => e.id === exerciseId);
      if (idx < 0) return st;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= arr.length) return st;
      [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
      return st;
    });
  }

  /**
   * Export data as JSON
   */
  const exportJson = useCallback(() => {
    try {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `workout-tracker-export-${yyyyMmDd(new Date())}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("❌ Failed to export data: " + error.message);
    }
  }, [state]);

  /**
   * Import data from JSON file
   */
  async function importJsonFromFile(file) {
    try {
      const text = await file.text();
      const incoming = safeParse(text, null);

      if (!incoming || typeof incoming !== "object") {
        alert("❌ Invalid JSON file.");
        return;
      }

      const program = incoming.program && typeof incoming.program === "object" ? incoming.program : null;
      const logsByDate = incoming.logsByDate && typeof incoming.logsByDate === "object" ? incoming.logsByDate : null;

      if (!program || !Array.isArray(program.workouts) || !logsByDate) {
        alert("❌ Import file missing required fields (program.workouts, logsByDate).");
        return;
      }

      if (!confirm("⚠️ Import will REPLACE your current data. Continue?")) return;

      const next = {
        ...makeDefaultState(),
        ...incoming,
        program: incoming.program,
        logsByDate,
        meta: { ...(incoming.meta ?? {}), updatedAt: Date.now() },
      };

      setState(next);
      alert("✅ Import complete!");
    } catch (error) {
      alert("❌ Failed to import: " + error.message);
    }
  }

  // NEW: Handle adding suggested exercise from AI Coach
  function handleAddSuggestion(exerciseName) {
    dispatchModal({
      type: "OPEN_ADD_SUGGESTION",
      payload: { exerciseName },
    });
  }

  const confirmAddSuggestion = useCallback((workoutId, exerciseName) => {
    const workout = workoutById.get(workoutId);
    if (!workout) {
      alert("❌ Workout not found");
      return;
    }
    
    // Check if exercise already exists
    const exists = workout.exercises.some(
      ex => ex.name.toLowerCase() === exerciseName.toLowerCase()
    );
    
    if (exists) {
      alert(`"${exerciseName}" already exists in ${workout.name}`);
      dispatchModal({ type: "CLOSE_ADD_SUGGESTION" });
      return;
    }
    
    // Add the exercise
    updateState((st) => {
      const w = st.program.workouts.find((x) => x.id === workoutId);
      if (!w) return st;
      w.exercises.push({ id: uid("ex"), name: exerciseName, unit: "reps" });
      return st;
    });

    dispatchModal({ type: "CLOSE_ADD_SUGGESTION" });
    alert(`✅ Added "${exerciseName}" to ${workout.name}!`);
  }, [workoutById]);

  // Swipe hook for calendar
  const swipe = useSwipe({
    onSwipeLeft: () =>
      dispatchModal({
        type: "UPDATE_MONTH_CURSOR",
        payload: shiftMonth(modals.datePicker.monthCursor, +1),
      }),
    onSwipeRight: () =>
      dispatchModal({
        type: "UPDATE_MONTH_CURSOR",
        payload: shiftMonth(modals.datePicker.monthCursor, -1),
      }),
    onSwipeUp: () =>
      dispatchModal({
        type: "UPDATE_MONTH_CURSOR",
        payload: shiftMonth(modals.datePicker.monthCursor, +12),
      }),
    onSwipeDown: () =>
      dispatchModal({
        type: "UPDATE_MONTH_CURSOR",
        payload: shiftMonth(modals.datePicker.monthCursor, -12),
      }),
  });

  // ---------------------------------------------------------------------------
  // SUB-COMPONENTS - Components that need access to app state/handlers
  // ---------------------------------------------------------------------------

  /**
   * Exercise row component
   */
  function ExerciseRow({ workoutId, exercise }) {
    const exLog = logsForDate[exercise.id] ?? null;
    const hasLog = !!exLog && Array.isArray(exLog.sets);
    const exUnit = getUnit(exercise.unit, exercise);
    const setsText = hasLog
      ? exLog.sets
          .filter((s) => Number(s.reps) > 0)
          .map((s) => {
            const isBW = String(s.weight).toUpperCase() === "BW";
            const w = isBW ? "BW" : s.weight;
            if (exUnit.key === "reps") {
              return `${s.reps}x${w}`;
            }
            const hasWeight = w && w !== "BW" && w !== "" && w !== "0";
            return hasWeight ? `${s.reps}${exUnit.abbr} @ ${w}` : `${s.reps}${exUnit.abbr}`;
          })
          .join(", ")
      : "";

    return (
      <div style={styles.exerciseRow}>
        <button
          style={styles.exerciseBtn}
          onClick={() => openLog(workoutId, exercise)}
          aria-label={`Log ${exercise.name}`}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <div style={styles.exerciseName}>{exercise.name}</div>
            <span style={styles.unitPill}>{exUnit.abbr}</span>
            {hasLog ? <span style={styles.badge}>Logged</span> : <span style={styles.badgeMuted}>-</span>}
          </div>
          {hasLog && setsText ? <div style={styles.exerciseSub}>{setsText}</div> : null}
        </button>

        {hasLog ? (
          <button
            style={styles.smallDangerBtn}
            onClick={() => deleteLogForExercise(exercise.id)}
            aria-label={`Delete log for ${exercise.name}`}
          >
            Delete
          </button>
        ) : (
          <div style={{ width: 72 }} />
        )}
      </div>
    );
  }

  /**
   * Workout card component
   */
  function WorkoutCard({ workout, collapsed, onToggle }) {
    const cat = (workout.category || "Workout").trim();
    return (
      <div style={styles.card}>
        <div style={collapsed ? { ...styles.cardHeader, marginBottom: 0 } : styles.cardHeader} onClick={onToggle}>
          <div style={styles.cardTitle}>{workout.name}</div>
          <span style={styles.tagMuted}>{cat}</span>
          <span style={styles.collapseToggle}>{collapsed ? "▶" : "▼"}</span>
        </div>

        {!collapsed && (
          workout.exercises.length === 0 ? (
            <div style={styles.emptyText}>No exercises yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {workout.exercises.map((ex) => (
                <ExerciseRow key={ex.id} workoutId={workout.id} exercise={ex} />
              ))}
            </div>
          )
        )}
      </div>
    );
  }

  /**
   * Summary block component
   */
  function SummaryBlock({ workout, collapsed, onToggle }) {
    const cat = (workout.category || "Workout").trim();
    return (
      <div style={styles.card}>
        <div style={collapsed ? { ...styles.cardHeader, marginBottom: 0 } : styles.cardHeader} onClick={onToggle}>
          <div style={styles.cardTitle}>{workout.name}</div>
          <span style={styles.tagMuted}>{cat}</span>
          <span style={styles.collapseToggle}>{collapsed ? "▶" : "▼"}</span>
        </div>

        {!collapsed && (
          workout.exercises.length === 0 ? (
            <div style={styles.emptyText}>No exercises yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {workout.exercises.map((ex) => {
                const exUnit = getUnit(ex.unit, ex);
                const s = computeExerciseSummary(ex.id, summaryRange.start, summaryRange.end, exUnit);
                return (
                  <div key={ex.id} style={styles.summaryRow}>
                    <div style={styles.exerciseName}>{ex.name}</div>
                    <div style={styles.summaryRight}>
                      <span style={styles.summaryChip}>{s.totalReps} {exUnit.abbr}</span>
                      <span style={styles.summaryChip}>Max {s.maxWeight}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER - The actual UI
  // ---------------------------------------------------------------------------

  if (!dataReady) {
    return (
      <div style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0f14",
        color: "#64748b",
      }}>
        Loading your workouts...
      </div>
    );
  }

  return (
    <div style={styles.app}>
      {/* Main content column */}
      <div style={styles.content}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarRow}>
            <div style={styles.brand}>Workout Tracker</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ThemeSwitch theme={theme} styles={styles} onToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
              <button
                onClick={onLogout}
                style={{
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 8,
                  border: "1px solid #1e293b",
                  background: "transparent",
                  color: theme === "dark" ? "#94a3b8" : "#64748b",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          </div>

          <div style={styles.dateRow}>
            <label style={styles.label}>Date</label>

            <div style={{ display: "flex", gap: 8, flex: 1 }}>
              <button
                style={styles.secondaryBtn}
                onClick={() => setDateKey((k) => addDays(k, -1))}
                aria-label="Previous day"
                type="button"
              >
                ←
              </button>

              <button
                style={{ ...styles.dateBtn, flex: 1 }}
                onClick={() =>
                  dispatchModal({
                    type: "OPEN_DATE_PICKER",
                    payload: { monthCursor: monthKeyFromDate(dateKey) },
                  })
                }
                aria-label="Pick date"
                type="button"
              >
                {formatDateLabel(dateKey)}
              </button>

              <button
                style={styles.secondaryBtn}
                onClick={() => setDateKey((k) => addDays(k, +1))}
                aria-label="Next day"
                type="button"
              >
                →
              </button>
            </div>
          </div>

          {/* Tab-specific sticky toolbar */}
          {tab === "today" && (
            <div style={{ ...styles.collapseAllRow, justifyContent: "space-between", alignItems: "center", paddingTop: 10 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, opacity: 0.85, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={autoCollapseEmpty}
                  onChange={(e) => setAutoCollapseEmpty(e.target.checked)}
                  style={styles.checkbox}
                />
                Hide empty
              </label>
              <button
                style={styles.collapseAllBtn}
                onClick={() => {
                  const allCollapsed = workouts.every((w) => collapsedToday.has(w.id));
                  allCollapsed ? expandAll(setCollapsedToday) : collapseAll(setCollapsedToday, workouts.map((w) => w.id));
                }}
                type="button"
              >
                {workouts.every((w) => collapsedToday.has(w.id)) ? "Expand All" : "Collapse All"}
              </button>
            </div>
          )}

          {tab === "summary" && (
            <div style={{ paddingTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              <PillTabs
                styles={styles}
                value={summaryMode}
                onChange={setSummaryMode}
                tabs={[
                  { value: "wtd", label: "WTD" },
                  { value: "mtd", label: "MTD" },
                  { value: "ytd", label: "YTD" },
                ]}
              />
              <div style={styles.rangeRow}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={styles.rangeText}>
                    {formatDateLabel(summaryRange.start)} – {formatDateLabel(summaryRange.end)}
                  </div>
                  <span style={styles.tagMuted}>{summaryDaysLogged.logged} / {summaryDaysLogged.total} days</span>
                </div>
                <button
                  style={styles.collapseAllBtn}
                  onClick={() => {
                    const allIds = [...workouts.map((w) => w.id), "__coach__"];
                    const allCollapsed = allIds.every((id) => collapsedSummary.has(id));
                    allCollapsed ? expandAll(setCollapsedSummary) : collapseAll(setCollapsedSummary, allIds);
                  }}
                  type="button"
                >
                  {[...workouts.map((w) => w.id), "__coach__"].every((id) => collapsedSummary.has(id)) ? "Expand All" : "Collapse All"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main body */}
        <div ref={bodyRef} style={styles.body} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          {/* TODAY TAB */}
          {tab === "today" ? (
            <div style={styles.section}>
              {workouts.map((w) => (
                <WorkoutCard
                  key={w.id}
                  workout={w}
                  collapsed={collapsedToday.has(w.id)}
                  onToggle={() => {
                    // Track manual expand so auto-collapse doesn't override it
                    if (collapsedToday.has(w.id)) {
                      manualExpandRef.current.add(w.id);
                    } else {
                      manualExpandRef.current.delete(w.id);
                    }
                    toggleCollapse(setCollapsedToday, w.id);
                  }}
                />
              ))}
            </div>
          ) : null}

          {/* SUMMARY TAB */}
          {tab === "summary" ? (
            <div style={styles.section}>
              {/* AI Coach Card */}
              <CoachInsightsCard
                insights={coachInsights}
                onAddExercise={handleAddSuggestion}
                styles={styles}
                collapsed={collapsedSummary.has("__coach__")}
                onToggle={() => toggleCollapse(setCollapsedSummary, "__coach__")}
                loading={coachLoading}
                error={coachError}
                onRefresh={() => {
                  const reqId = ++coachReqIdRef.current;
                  setCoachLoading(true);
                  setCoachError(null);
                  fetchCoachInsights({ profile, state, dateRange: summaryRange, options: { forceRefresh: true } })
                    .then(({ insights }) => {
                      if (coachReqIdRef.current !== reqId) return;
                      setCoachInsights(insights);
                      coachLastSignatureRef.current = coachSignature;
                      coachLastFetchRef.current = Date.now();
                      coachCacheRef.current.set(coachSignature, { insights, createdAt: Date.now() });
                      const cacheKey = `wt_coach_v2:${session.user.id}:${summaryMode}:${dateKey}`;
                      try { localStorage.setItem(cacheKey, JSON.stringify({ insights, signature: coachSignature, createdAt: Date.now() })); } catch {}
                    })
                    .catch((err) => {
                      if (coachReqIdRef.current !== reqId) return;
                      console.error("AI Coach refresh error:", err);
                      if (coachInsights.length === 0) {
                        const analysis = analyzeWorkoutBalance(state, summaryRange);
                        setCoachInsights(detectImbalances(analysis));
                      }
                      setCoachError("AI coach unavailable — showing basic analysis");
                    })
                    .finally(() => {
                      if (coachReqIdRef.current === reqId) setCoachLoading(false);
                    });
                }}
              />

              {workouts.map((w) => (
                <SummaryBlock
                  key={w.id}
                  workout={w}
                  collapsed={collapsedSummary.has(w.id)}
                  onToggle={() => toggleCollapse(setCollapsedSummary, w.id)}
                />
              ))}
            </div>
          ) : null}

          {/* MANAGE TAB */}
          {tab === "manage" ? (
            <div style={styles.section}>
              {/* Workout list */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>Structure</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      style={reorderWorkouts ? styles.primaryBtn : styles.secondaryBtn}
                      onClick={() => setReorderWorkouts((v) => !v)}
                    >
                      {reorderWorkouts ? "Done" : "Reorder"}
                    </button>
                    <button style={styles.primaryBtn} onClick={addWorkout}>
                      + Add Workout
                    </button>
                  </div>
                </div>

                <div style={styles.manageList}>
                  {workouts.map((w, wi) => {
                    const active = manageWorkoutId === w.id;
                    const isFirst = wi === 0;
                    const isLast = wi === workouts.length - 1;
                    return (
                      <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button
                          style={{ ...styles.manageItem, flex: 1, ...(active ? styles.manageItemActive : {}) }}
                          onClick={() => setManageWorkoutId(w.id)}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ fontWeight: 700 }}>{w.name}</div>
                            <span style={styles.tagMuted}>{(w.category || "Workout").trim()}</span>
                          </div>
                          <div style={styles.smallText}>{w.exercises.length} exercises</div>
                        </button>
                        {reorderWorkouts ? (
                          <div style={styles.reorderBtnGroup}>
                            <button
                              style={styles.reorderBtn}
                              disabled={isFirst}
                              onClick={() => moveWorkout(w.id, -1)}
                              title="Move up"
                            >&#9650;</button>
                            <button
                              style={styles.reorderBtn}
                              disabled={isLast}
                              onClick={() => moveWorkout(w.id, 1)}
                              title="Move down"
                            >&#9660;</button>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected workout editor */}
              {manageWorkoutId ? (
                <div style={styles.card}>
                  {(() => {
                    const w = workoutById.get(manageWorkoutId);
                    if (!w) return <div style={styles.emptyText}>Select a workout.</div>;

                    return (
                      <>
                        {/* Workout header: title+tag left, overflow menu right */}
                        <div style={styles.cardHeader}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
                            <div style={{ ...styles.cardTitle, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.name}</div>
                            <span style={styles.tagMuted}>{(w.category || "Workout").trim()}</span>
                          </div>
                          <div style={{ position: "relative" }}>
                            <button
                              style={styles.overflowMenuBtn}
                              onClick={() => setOverflowMenuOpen((v) => !v)}
                              title="More options"
                            >&#8942;</button>
                            {overflowMenuOpen ? (
                              <>
                                <div style={styles.overflowBackdrop} onClick={() => setOverflowMenuOpen(false)} />
                                <div style={styles.overflowMenu}>
                                  <button
                                    style={styles.overflowMenuItem}
                                    onClick={() => { setOverflowMenuOpen(false); renameWorkout(w.id); }}
                                  >Rename workout</button>
                                  <button
                                    style={styles.overflowMenuItem}
                                    onClick={() => { setOverflowMenuOpen(false); setWorkoutCategory(w.id); }}
                                  >Change category</button>
                                  <button
                                      style={styles.overflowMenuItemDanger}
                                      onClick={() => { setOverflowMenuOpen(false); deleteWorkout(w.id); }}
                                    >Delete workout</button>
                                </div>
                              </>
                            ) : null}
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                          <button style={styles.addExerciseFullBtn} onClick={() => addExercise(w.id)}>
                            + Add Exercise
                          </button>
                          {w.exercises.length > 1 && (
                            <button
                              style={reorderExercises ? styles.primaryBtn : styles.secondaryBtn}
                              onClick={() => setReorderExercises((v) => !v)}
                            >
                              {reorderExercises ? "Done" : "Reorder"}
                            </button>
                          )}
                        </div>

                        {w.exercises.length === 0 ? (
                          <div style={styles.emptyText}>No exercises yet. Add one above.</div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {w.exercises.map((ex, ei) => {
                              const isFirstEx = ei === 0;
                              const isLastEx = ei === w.exercises.length - 1;
                              return (
                                <div key={ex.id} style={styles.manageExerciseRow}>
                                  <div style={styles.manageExerciseLeft}>
                                    <div style={styles.manageExerciseName}>{ex.name}</div>
                                    <span style={styles.unitPill}>{getUnit(ex.unit, ex).abbr}</span>
                                  </div>
                                  {reorderExercises ? (
                                    <div style={styles.reorderBtnGroup}>
                                      <button
                                        style={styles.reorderBtn}
                                        disabled={isFirstEx}
                                        onClick={() => moveExercise(w.id, ex.id, -1)}
                                        title="Move up"
                                      >&#9650;</button>
                                      <button
                                        style={styles.reorderBtn}
                                        disabled={isLastEx}
                                        onClick={() => moveExercise(w.id, ex.id, 1)}
                                        title="Move down"
                                      >&#9660;</button>
                                    </div>
                                  ) : (
                                    <div style={styles.manageExerciseActions}>
                                      <button style={styles.compactSecondaryBtn} onClick={() => editUnitExercise(w.id, ex.id)}>
                                        Unit
                                      </button>
                                      <button style={styles.compactSecondaryBtn} onClick={() => renameExercise(w.id, ex.id)}>
                                        Rename
                                      </button>
                                      <button style={styles.compactDangerBtn} onClick={() => deleteExercise(w.id, ex.id)}>
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : null}

              {/* Backup section */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>Backup</div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button style={styles.secondaryBtn} onClick={exportJson}>
                    Export JSON
                  </button>

                  <label style={{ ...styles.secondaryBtn, cursor: "pointer" }}>
                    Import JSON
                    <input
                      type="file"
                      accept="application/json"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) importJsonFromFile(f);
                        e.target.value = "";
                      }}
                    />
                  </label>

                  <button
                    style={styles.dangerBtn}
                    onClick={() => {
                      if (!confirm("⚠️ Reset ALL data? This cannot be undone.")) return;
                      setState(makeDefaultState());
                      setManageWorkoutId(null);
                      alert("✅ Reset complete.");
                    }}
                  >
                    Reset All
                  </button>
                </div>
                <div style={styles.smallText}>
                  Import replaces current data. Structure changes never delete past logs.
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Bottom navigation */}
        <div style={styles.nav}>
          <button style={{ ...styles.navBtn, ...(tab === "today" ? styles.navBtnActive : {}) }} onClick={() => setTab("today")}>
            Today
          </button>
          <button style={{ ...styles.navBtn, ...(tab === "summary" ? styles.navBtnActive : {}) }} onClick={() => setTab("summary")}>
            Summary
          </button>
          <button style={{ ...styles.navBtn, ...(tab === "manage" ? styles.navBtnActive : {}) }} onClick={() => setTab("manage")}>
            Manage
          </button>
        </div>
      </div>

      {/* MODALS */}

      {/* Log Modal */}
      <Modal open={modals.log.isOpen} title={modals.log.context?.exerciseName || "Log"} onClose={() => dispatchModal({ type: "CLOSE_LOG" })} styles={styles}>
        {modals.log.isOpen && (() => {
          const logCtx = modals.log.context;
          // Look up exercise from program for current unit
          let logExercise = null;
          for (const wk of state.program.workouts) {
            const found = wk.exercises.find((e) => e.id === logCtx?.exerciseId);
            if (found) { logExercise = found; break; }
          }
          const logUnit = logExercise ? getUnit(logExercise.unit, logExercise) : getUnit("reps");
          return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={styles.smallText}>
            Prefilled from your most recent log. Unit: <b>{logUnit.label}</b> — change in Manage tab.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {modals.log.sets.map((s, i) => {
              const isBW = String(s.weight).toUpperCase() === "BW";
              return (
                <div key={i} style={styles.setRow}>
                  <div style={styles.setIndex}>{i + 1}</div>

                  <div style={styles.fieldCol}>
                    <label style={styles.label}>{logUnit.label}</label>
                    <input
                      value={String(s.reps ?? "")}
                      onChange={(e) => {
                        const newSets = [...modals.log.sets];
                        const regex = logUnit.allowDecimal ? /[^\d.]/g : /[^\d]/g;
                        newSets[i] = { ...newSets[i], reps: e.target.value.replace(regex, "") };
                        dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                      }}
                      inputMode={logUnit.allowDecimal ? "decimal" : "numeric"}
                      pattern={logUnit.allowDecimal ? "[0-9.]*" : "[0-9]*"}
                      style={styles.numInput}
                      placeholder="0"
                    />
                  </div>

                  <div style={styles.fieldCol}>
                    <label style={styles.label}>Weight</label>
                    <input
                      value={isBW ? "BW" : String(s.weight ?? "")}
                      onChange={(e) => {
                        const newSets = [...modals.log.sets];
                        newSets[i] = { ...newSets[i], weight: e.target.value };
                        dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      style={{ ...styles.numInput, ...(isBW ? styles.disabledInput : {}) }}
                      placeholder="e.g. 185"
                      disabled={isBW}
                    />
                  </div>

                  <div style={styles.bwCol}>
                    <label style={styles.label}>BW</label>
                    <input
                      type="checkbox"
                      checked={isBW}
                      onChange={(e) => {
                        const newSets = [...modals.log.sets];
                        newSets[i] = { ...newSets[i], weight: e.target.checked ? "BW" : "" };
                        dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                      }}
                      style={styles.checkbox}
                    />
                  </div>

                  <button
                    style={styles.smallDangerBtn}
                    onClick={() => {
                      const newSets = modals.log.sets.filter((_, idx) => idx !== i);
                      dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                    }}
                    disabled={modals.log.sets.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <button
            style={styles.secondaryBtn}
            onClick={() => {
              const last = modals.log.sets[modals.log.sets.length - 1];
              const nextSet = last ? { reps: last.reps ?? 0, weight: last.weight ?? "" } : { reps: 0, weight: "" };
              dispatchModal({ type: "UPDATE_LOG_SETS", payload: [...modals.log.sets, nextSet] });
            }}
          >
            + Add Set
          </button>

          <div style={styles.fieldCol}>
            <label style={styles.label}>Notes (optional)</label>
            <textarea
              value={modals.log.notes}
              onChange={(e) => dispatchModal({ type: "UPDATE_LOG_NOTES", payload: e.target.value })}
              style={styles.textarea}
              rows={3}
              placeholder="Quick notes..."
            />
          </div>

          <div style={styles.modalFooter}>
            <button style={styles.secondaryBtn} onClick={() => dispatchModal({ type: "CLOSE_LOG" })}>
              Cancel
            </button>
            <button style={styles.primaryBtn} onClick={saveLog}>
              Save
            </button>
          </div>
        </div>
          );
        })()}
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        open={modals.datePicker.isOpen}
        title="Pick a date"
        onClose={() => dispatchModal({ type: "CLOSE_DATE_PICKER" })}
        styles={styles}
      >
        {(() => {
          const [yy, mm] = modals.datePicker.monthCursor.split("-").map(Number);
          const year = yy;
          const monthIndex0 = mm - 1;

          const firstDayKey = `${modals.datePicker.monthCursor}-01`;
          const padLeft = weekdaySunday0(firstDayKey);
          const dim = daysInMonth(year, monthIndex0);

          const cells = [];
          for (let i = 0; i < padLeft; i++) cells.push(null);
          for (let d = 1; d <= dim; d++) cells.push(d);
          while (cells.length % 7 !== 0) cells.push(null);

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Month header */}
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <button
                  style={styles.secondaryBtn}
                  onClick={() =>
                    dispatchModal({
                      type: "UPDATE_MONTH_CURSOR",
                      payload: shiftMonth(modals.datePicker.monthCursor, -1),
                    })
                  }
                  type="button"
                >
                  Prev
                </button>

                <div style={{ fontWeight: 900, alignSelf: "center" }}>{formatMonthLabel(modals.datePicker.monthCursor)}</div>

                <button
                  style={styles.secondaryBtn}
                  onClick={() =>
                    dispatchModal({
                      type: "UPDATE_MONTH_CURSOR",
                      payload: shiftMonth(modals.datePicker.monthCursor, +1),
                    })
                  }
                  type="button"
                >
                  Next
                </button>
              </div>

              {/* Calendar grid */}
              <div {...swipe} style={styles.calendarSwipeArea}>
                <div style={styles.calendarGrid}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
                    <div key={w} style={styles.calendarDow}>
                      {w}
                    </div>
                  ))}

                  {cells.map((day, idx) => {
                    if (!day) return <div key={idx} />;

                    const dayKey = `${modals.datePicker.monthCursor}-${String(day).padStart(2, "0")}`;
                    const selected = dayKey === dateKey;
                    const hasLog = loggedDaysInMonth.has(dayKey);
                    const isToday = dayKey === todayKey;

                    return (
                      <button
                        key={idx}
                        style={{
                          ...styles.calendarCell,
                          ...(isToday && !selected ? styles.calendarCellToday : {}),
                          ...(selected ? styles.calendarCellActive : {}),
                        }}
                        onClick={() => {
                          setDateKey(dayKey);
                          dispatchModal({ type: "CLOSE_DATE_PICKER" });
                        }}
                        type="button"
                      >
                        <div style={styles.calendarCellNum}>{day}</div>
                        <div style={{ height: 10, display: "flex", justifyContent: "center" }}>
                          {hasLog && !selected ? <span style={styles.calendarDot} /> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button style={styles.secondaryBtn} onClick={() => dispatchModal({ type: "CLOSE_DATE_PICKER" })} type="button">
                  Close
                </button>
                <button
                  style={styles.primaryBtn}
                  onClick={() => {
                    setDateKey(yyyyMmDd(new Date()));
                    dispatchModal({ type: "CLOSE_DATE_PICKER" });
                  }}
                  type="button"
                >
                  Today
                </button>
              </div>

              <div style={styles.smallText}>Tip: swipe left/right for months, up/down for years. Dots = days with logs.</div>
            </div>
          );
        })()}
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        open={modals.confirm.isOpen}
        title={modals.confirm.title}
        message={modals.confirm.message}
        confirmText={modals.confirm.confirmText}
        onCancel={() => dispatchModal({ type: "CLOSE_CONFIRM" })}
        onConfirm={modals.confirm.onConfirm}
        styles={styles}
      />

      {/* Input Modal */}
      <InputModal
        open={modals.input.isOpen}
        title={modals.input.title}
        label={modals.input.label}
        placeholder={modals.input.placeholder}
        value={modals.input.value}
        confirmText={modals.input.confirmText}
        onCancel={() => dispatchModal({ type: "CLOSE_INPUT" })}
        onConfirm={modals.input.onConfirm}
        onChange={(val) => dispatchModal({ type: "UPDATE_INPUT_VALUE", payload: val })}
        styles={styles}
      />

      {/* Add Workout Modal */}
      <Modal
        open={modals.addWorkout.isOpen}
        title="Add Workout"
        onClose={() => dispatchModal({ type: "CLOSE_ADD_WORKOUT" })}
        styles={styles}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={styles.fieldCol}>
            <label style={styles.label}>Workout name</label>
            <input
              value={modals.addWorkout.name}
              onChange={(e) =>
                dispatchModal({
                  type: "UPDATE_ADD_WORKOUT",
                  payload: { name: e.target.value },
                })
              }
              style={styles.textInput}
              placeholder="e.g. Workout C"
              autoFocus
            />
          </div>

          <div style={styles.fieldCol}>
            <label style={styles.label}>Workout category</label>
            <CategoryAutocomplete
              value={modals.addWorkout.category}
              onChange={(val) =>
                dispatchModal({
                  type: "UPDATE_ADD_WORKOUT",
                  payload: { category: val },
                })
              }
              suggestions={categoryOptions}
              placeholder="e.g. Push / Pull / Legs / Stretch"
              styles={styles}
            />
          </div>

          <div style={styles.modalFooter}>
            <button style={styles.secondaryBtn} onClick={() => dispatchModal({ type: "CLOSE_ADD_WORKOUT" })}>
              Cancel
            </button>
            <button
              style={styles.primaryBtn}
              onClick={() => {
                // IMPROVEMENT: Validate input
                const validation = validateWorkoutName(modals.addWorkout.name, workouts);
                if (!validation.valid) {
                  alert("⚠️ " + validation.error);
                  return;
                }

                const name = modals.addWorkout.name.trim();
                const category = (modals.addWorkout.category || "Workout").trim() || "Workout";
                const newId = uid("w");

                updateState((st) => {
                  st.program.workouts.push({
                    id: newId,
                    name,
                    category,
                    exercises: [],
                  });
                  return st;
                });

                dispatchModal({ type: "CLOSE_ADD_WORKOUT" });
                setManageWorkoutId(newId);
                setTab("manage");
              }}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Exercise Modal */}
      <Modal
        open={modals.addExercise.isOpen}
        title="Add Exercise"
        onClose={() => dispatchModal({ type: "CLOSE_ADD_EXERCISE" })}
        styles={styles}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={styles.fieldCol}>
            <label style={styles.label}>Exercise name</label>
            <input
              value={modals.addExercise.name}
              onChange={(e) =>
                dispatchModal({
                  type: "UPDATE_ADD_EXERCISE",
                  payload: { name: e.target.value },
                })
              }
              style={styles.textInput}
              placeholder="e.g. Bench Press"
              autoFocus
            />
          </div>

          <div style={styles.fieldCol}>
            <label style={styles.label}>Unit</label>
            <select
              value={modals.addExercise.unit}
              onChange={(e) =>
                dispatchModal({
                  type: "UPDATE_ADD_EXERCISE",
                  payload: { unit: e.target.value },
                })
              }
              style={styles.textInput}
            >
              {REP_UNITS.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label} ({u.abbr})
                </option>
              ))}
              <option value="custom">Custom...</option>
            </select>
          </div>

          {modals.addExercise.unit === "custom" && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ ...styles.fieldCol, flex: 1 }}>
                <label style={styles.label}>Abbreviation</label>
                <input
                  value={modals.addExercise.customUnitAbbr || ""}
                  onChange={(e) =>
                    dispatchModal({
                      type: "UPDATE_ADD_EXERCISE",
                      payload: { customUnitAbbr: e.target.value.slice(0, 10) },
                    })
                  }
                  style={styles.textInput}
                  placeholder="e.g. cal"
                />
              </div>
              <div style={{ ...styles.fieldCol, alignItems: "center" }}>
                <label style={styles.label}>Decimals</label>
                <input
                  type="checkbox"
                  checked={modals.addExercise.customUnitAllowDecimal || false}
                  onChange={(e) =>
                    dispatchModal({
                      type: "UPDATE_ADD_EXERCISE",
                      payload: { customUnitAllowDecimal: e.target.checked },
                    })
                  }
                  style={styles.checkbox}
                />
              </div>
            </div>
          )}

          <div style={styles.modalFooter}>
            <button style={styles.secondaryBtn} onClick={() => dispatchModal({ type: "CLOSE_ADD_EXERCISE" })}>
              Cancel
            </button>
            <button
              style={styles.primaryBtn}
              onClick={() => {
                const workout = workoutById.get(modals.addExercise.workoutId);
                if (!workout) return;

                const validation = validateExerciseName(modals.addExercise.name, workout.exercises);
                if (!validation.valid) {
                  alert("\u26a0\ufe0f " + validation.error);
                  return;
                }

                if (modals.addExercise.unit === "custom" && !modals.addExercise.customUnitAbbr?.trim()) {
                  alert("\u26a0\ufe0f Please enter a custom unit abbreviation");
                  return;
                }

                const name = modals.addExercise.name.trim();
                const unit = modals.addExercise.unit;
                const wId = modals.addExercise.workoutId;
                updateState((st) => {
                  const w = st.program.workouts.find((x) => x.id === wId);
                  if (!w) return st;
                  const newEx = { id: uid("ex"), name, unit };
                  if (unit === "custom") {
                    newEx.customUnitAbbr = modals.addExercise.customUnitAbbr.trim();
                    newEx.customUnitAllowDecimal = modals.addExercise.customUnitAllowDecimal ?? false;
                  }
                  w.exercises.push(newEx);
                  return st;
                });
                dispatchModal({ type: "CLOSE_ADD_EXERCISE" });
              }}
            >
              Add
            </button>
          </div>
        </div>
      </Modal>

      {/* NEW: Add Suggested Exercise Modal */}
      <AddSuggestedExerciseModal
        open={modals.addSuggestion.isOpen}
        exerciseName={modals.addSuggestion.exerciseName}
        workouts={workouts}
        onCancel={() => dispatchModal({ type: "CLOSE_ADD_SUGGESTION" })}
        onConfirm={confirmAddSuggestion}
        styles={styles}
      />

      {/* Edit Unit Modal */}
      <Modal
        open={modals.editUnit.isOpen}
        title="Change Unit"
        onClose={() => dispatchModal({ type: "CLOSE_EDIT_UNIT" })}
        styles={styles}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={styles.fieldCol}>
            <label style={styles.label}>Unit</label>
            <select
              value={modals.editUnit.unit}
              onChange={(e) =>
                dispatchModal({
                  type: "UPDATE_EDIT_UNIT",
                  payload: { unit: e.target.value },
                })
              }
              style={styles.textInput}
            >
              {REP_UNITS.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label} ({u.abbr})
                </option>
              ))}
              <option value="custom">Custom...</option>
            </select>
          </div>

          {modals.editUnit.unit === "custom" && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ ...styles.fieldCol, flex: 1 }}>
                <label style={styles.label}>Abbreviation</label>
                <input
                  value={modals.editUnit.customUnitAbbr || ""}
                  onChange={(e) =>
                    dispatchModal({
                      type: "UPDATE_EDIT_UNIT",
                      payload: { customUnitAbbr: e.target.value.slice(0, 10) },
                    })
                  }
                  style={styles.textInput}
                  placeholder="e.g. cal"
                />
              </div>
              <div style={{ ...styles.fieldCol, alignItems: "center" }}>
                <label style={styles.label}>Decimals</label>
                <input
                  type="checkbox"
                  checked={modals.editUnit.customUnitAllowDecimal || false}
                  onChange={(e) =>
                    dispatchModal({
                      type: "UPDATE_EDIT_UNIT",
                      payload: { customUnitAllowDecimal: e.target.checked },
                    })
                  }
                  style={styles.checkbox}
                />
              </div>
            </div>
          )}

          <div style={styles.modalFooter}>
            <button style={styles.secondaryBtn} onClick={() => dispatchModal({ type: "CLOSE_EDIT_UNIT" })}>
              Cancel
            </button>
            <button style={styles.primaryBtn} onClick={saveEditUnit}>
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================================
// 7. STYLES - All styling in one place
// ============================================================================

function getStyles(colors) {
  return {
    app: {
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      background: colors.appBg,
      color: colors.text,
      height: "100dvh",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      overflow: "hidden",
    },

    content: {
      width: "100%",
      maxWidth: 760,
      overflowX: "clip",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      paddingLeft: "calc(14px + var(--safe-left, 0px))",
      paddingRight: "calc(14px + var(--safe-right, 0px))",
      paddingTop: "calc(10px + var(--safe-top, 0px))",
    },

    topBar: {
      flexShrink: 0,
      zIndex: 10,
      background: colors.topBarBg,
      padding: "14px 0 10px",
      borderBottom: `1px solid ${colors.border}`,
    },

    brand: { fontWeight: 800, fontSize: 18, letterSpacing: 0.2 },
    dateRow: { marginTop: 10, display: "flex", alignItems: "center", gap: 10 },
    label: { fontSize: 12, opacity: 0.85 },

    topBarRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },

    textInput: {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.inputBg,
      color: colors.text,
      fontSize: 14,
      width: "100%",
      boxSizing: "border-box",
    },

    dateBtn: {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.inputBg,
      color: colors.text,
      fontSize: 14,
      fontWeight: 900,
      textAlign: "center",
    },

    body: { flex: 1, paddingTop: 14, overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", paddingBottom: 24 },
    section: { display: "flex", flexDirection: "column", gap: 12 },

    nav: {
      flexShrink: 0,
      display: "flex",
      gap: 8,
      paddingTop: 10,
      paddingBottom: "calc(14px + env(safe-area-inset-bottom, 0px))",
      background: colors.navBg,
      borderTop: `1px solid ${colors.border}`,
      touchAction: "none",
    },

    navBtn: {
      flex: 1,
      padding: "12px 12px",
      borderRadius: 14,
      border: `1px solid ${colors.border}`,
      background: colors.cardBg,
      color: colors.text,
      fontWeight: 800,
      transition: "background 0.25s, border-color 0.25s, color 0.25s",
      WebkitTapHighlightColor: "transparent",
      outline: "none",
    },

    navBtnActive: {
      border: "1px solid rgba(255,255,255,0.25)",
      background: colors.primaryBg,
      color: colors.primaryText,
    },

    card: {
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: 16,
      padding: 12,
      boxShadow: colors.shadow,
    },

    cardHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 10,
      cursor: "pointer",
    },

    collapseToggle: {
      fontSize: 12,
      opacity: 0.5,
      marginLeft: "auto",
    },

    collapseAllRow: {
      display: "flex",
      justifyContent: "flex-end",
    },

    collapseAllBtn: {
      padding: "6px 12px",
      borderRadius: 10,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 700,
      fontSize: 12,
      opacity: 0.85,
      cursor: "pointer",
    },

    autocompleteDropdown: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      marginTop: 4,
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      zIndex: 10,
      overflow: "hidden",
      maxHeight: 200,
      overflowY: "auto",
    },

    autocompleteOption: {
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "10px 14px",
      background: "transparent",
      border: "none",
      borderBottom: `1px solid ${colors.border}`,
      color: colors.text,
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
    },

    cardTitle: { fontWeight: 900, fontSize: 16 },

    tagMuted: {
      fontSize: 12,
      padding: "4px 8px",
      borderRadius: 999,
      background: colors.appBg === "#0b0f14" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
      border: `1px solid ${colors.border}`,
      opacity: 0.85,
    },

    emptyText: { opacity: 0.75, fontSize: 13, padding: "6px 2px" },

    exerciseRow: { display: "flex", alignItems: "stretch", gap: 10 },

    exerciseBtn: {
      flex: 1,
      textAlign: "left",
      padding: 12,
      borderRadius: 14,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
    },

    exerciseName: { fontWeight: 800, fontSize: 15 },
    exerciseSub: { marginTop: 6, fontSize: 12, opacity: 0.8 },

    badge: {
      fontSize: 11,
      fontWeight: 800,
      padding: "3px 8px",
      borderRadius: 999,
      background: "rgba(46, 204, 113, 0.18)",
      border: "1px solid rgba(46, 204, 113, 0.25)",
    },

    badgeMuted: {
      fontSize: 11,
      fontWeight: 800,
      padding: "3px 8px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.08)",
      opacity: 0.75,
    },

    unitPill: {
      fontSize: 11,
      fontWeight: 800,
      padding: "2px 7px",
      borderRadius: 999,
      background: colors.appBg === "#0b0f14" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
      border: `1px solid ${colors.border}`,
      opacity: 0.85,
    },

    primaryBtn: {
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.18)",
      background: colors.primaryBg,
      color: colors.primaryText,
      fontWeight: 900,
    },

    secondaryBtn: {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 800,
    },

    dangerBtn: {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${colors.dangerBorder}`,
      background: colors.dangerBg,
      color: colors.dangerText,
      fontWeight: 900,
    },

    smallDangerBtn: {
      width: 72,
      height: 40,
      padding: 0,
      borderRadius: 12,
      border: `1px solid ${colors.dangerBorder}`,
      background: colors.dangerBg,
      color: colors.dangerText,
      fontWeight: 900,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: "40px",
      alignSelf: "center",
    },

    manageList: { display: "flex", flexDirection: "column", gap: 10 },

    manageItem: {
      textAlign: "left",
      padding: 12,
      borderRadius: 14,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
    },

    manageItemActive: {
      border: `1px solid ${colors.border}`,
      background: colors.primaryBg,
      color: colors.primaryText,
    },

    manageExerciseRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      padding: "10px 12px",
      borderRadius: 14,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      overflow: "hidden",
    },

    manageExerciseLeft: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      minWidth: 0,
      flex: 1,
    },

    manageExerciseName: {
      fontWeight: 700,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      minWidth: 0,
    },

    manageExerciseActions: {
      display: "flex",
      gap: 4,
      flexShrink: 0,
    },

    pillRow: { display: "flex", gap: 8, marginBottom: 10 },

    pill: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.10)",
      fontWeight: 900,
    },

    pillActive: {
      background: colors.primaryBg,
      color: colors.primaryText,
      border: `1px solid ${colors.border}`,
    },

    pillInactive: {
      background: colors.cardAltBg,
      color: colors.text,
      opacity: 0.85,
      border: `1px solid ${colors.border}`,
    },

    rangeRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },

    rangeText: { fontSize: 12, opacity: 0.8 },

    summaryRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      padding: "10px 12px",
      borderRadius: 14,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
    },

    summaryRight: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" },

    summaryChip: {
      fontSize: 12,
      fontWeight: 900,
      padding: "6px 10px",
      borderRadius: 999,
      background: colors.primaryBg,
      color: colors.primaryText,
      border: `1px solid ${colors.border}`,
    },

    smallText: { fontSize: 12, opacity: 0.8 },

    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      padding: 10,
      zIndex: 50,
    },

    modalSheet: {
      width: "100%",
      maxWidth: 720,
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
    },

    modalHeader: {
      padding: 12,
      borderBottom: `1px solid ${colors.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },

    modalTitle: { fontWeight: 900, fontSize: 16 },
    modalBody: { padding: 12, maxHeight: "78vh", overflow: "auto" },
    modalFooter: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 },

    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 900,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      lineHeight: "40px",
      fontSize: 20,
    },

    setRow: {
      display: "grid",
      gridTemplateColumns: "36px 1fr 1fr 46px 88px",
      gap: 10,
      alignItems: "center",
      padding: 10,
      borderRadius: 14,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
    },

    setIndex: {
      fontWeight: 900,
      opacity: 0.85,
      textAlign: "center",
      paddingBottom: 10,
    },

    fieldCol: { display: "flex", flexDirection: "column", gap: 6, minWidth: 0 },
    bwCol: { display: "flex", flexDirection: "column", gap: 8, alignItems: "center" },

    numInput: {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.inputBg,
      color: colors.text,
      fontSize: 14,
    },

    disabledInput: { opacity: 0.7 },
    checkbox: { width: 22, height: 22 },

    textarea: {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.inputBg,
      color: colors.text,
      fontSize: 14,
      resize: "vertical",
    },

    calendarSwipeArea: {
      borderRadius: 14,
      touchAction: "pan-y",
    },

    calendarGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: 8,
    },

    calendarDow: {
      fontSize: 11,
      fontWeight: 800,
      opacity: 0.75,
      textAlign: "center",
      padding: "4px 0",
    },

    calendarCell: {
      padding: "10px 0 6px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 900,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
    },

    calendarCellActive: {
      background: colors.primaryBg,
      color: colors.primaryText,
      border: `1px solid ${colors.border}`,
    },

    calendarCellNum: {
      lineHeight: "18px",
    },

    calendarDot: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: colors.dot,
      opacity: 1,
      boxShadow: "0 0 0 1px rgba(0,0,0,0.25)",
    },

    calendarCellToday: {
      boxShadow: `0 0 0 2px ${colors.primaryBg} inset`,
    },

    themeSwitch: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px 6px 6px",
      borderRadius: 999,
      border: `1px solid ${colors.border}`,
      background: colors.cardBg,
      color: colors.text,
      fontWeight: 800,
      userSelect: "none",
      WebkitTapHighlightColor: "transparent",
      cursor: "pointer",
    },

    themeSwitchTrack: {
      width: 40,
      height: 22,
      borderRadius: 999,
      border: `1px solid ${colors.border}`,
      padding: 2,
      boxSizing: "border-box",
      position: "relative",
      transition: "background 160ms ease",
    },

    themeSwitchTrackDark: {
      background: "rgba(255,255,255,0.12)",
    },

    themeSwitchTrackLight: {
      background: "rgba(0,0,0,0.08)",
    },

    themeSwitchThumb: {
      width: 16,
      height: 16,
      borderRadius: 999,
      transition: "transform 200ms cubic-bezier(.2,.8,.2,1)",
      position: "absolute",
      top: 2,
      left: 2,
    },

    themeSwitchThumbDark: {
      background: "#e8eef7",
    },

    themeSwitchThumbLight: {
      background: "#1f2933",
    },

    themeSwitchLabel: {
      fontSize: 12,
      opacity: 0.9,
    },

    // NEW: AI Coach specific styles
    insightCard: {
      background: colors.cardAltBg,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      overflow: 'hidden',
    },

    insightHeader: {
      width: '100%',
      padding: 12,
      textAlign: 'left',
      background: 'transparent',
      border: 'none',
      color: colors.text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      cursor: 'pointer',
    },

    insightTitle: {
      fontWeight: 800,
      fontSize: 14,
      marginBottom: 4,
    },

    insightMessage: {
      fontSize: 13,
      opacity: 0.85,
      lineHeight: 1.4,
    },

    insightChevron: {
      fontSize: 12,
      opacity: 0.6,
    },

    insightSuggestions: {
      padding: 12,
      paddingTop: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    },

    suggestionsTitle: {
      fontSize: 12,
      fontWeight: 800,
      opacity: 0.75,
      marginBottom: 4,
    },

    suggestionRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      padding: 10,
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: 10,
    },

    suggestionName: {
      fontWeight: 700,
      fontSize: 14,
    },

    suggestionGroup: {
      fontSize: 11,
      opacity: 0.7,
      marginTop: 2,
      textTransform: 'capitalize',
    },

    addSuggestionBtn: {
      padding: '8px 12px',
      borderRadius: 8,
      border: `1px solid ${colors.border}`,
      background: colors.primaryBg,
      color: colors.primaryText,
      fontWeight: 800,
      fontSize: 13,
    },

    coachFooter: {
      fontSize: 12,
      opacity: 0.7,
      marginTop: 8,
      padding: '8px 10px',
      background: colors.appBg === "#0b0f14" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
      borderRadius: 8,
    },

    // Overflow menu (⋮ button + dropdown)
    overflowMenuBtn: {
      width: 36,
      height: 36,
      borderRadius: 10,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 900,
      fontSize: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      cursor: "pointer",
    },

    overflowBackdrop: {
      position: "fixed",
      inset: 0,
      zIndex: 40,
    },

    overflowMenu: {
      position: "absolute",
      top: "100%",
      right: 0,
      marginTop: 4,
      minWidth: 180,
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      zIndex: 41,
      overflow: "hidden",
    },

    overflowMenuItem: {
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "12px 16px",
      background: "transparent",
      border: "none",
      color: colors.text,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
    },

    overflowMenuItemDanger: {
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "12px 16px",
      background: "transparent",
      border: "none",
      color: colors.dangerText,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
    },

    // Full-width add exercise button
    addExerciseFullBtn: {
      flex: 1,
      padding: "12px 16px",
      borderRadius: 12,
      border: `1px solid rgba(255,255,255,0.18)`,
      background: colors.primaryBg,
      color: colors.primaryText,
      fontWeight: 900,
      fontSize: 14,
      cursor: "pointer",
    },

    // Reorder arrow buttons
    reorderBtnGroup: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      flexShrink: 0,
    },

    reorderBtn: {
      width: 30,
      height: 26,
      borderRadius: 8,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 900,
      fontSize: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      cursor: "pointer",
      opacity: 1,
    },

    // Compact exercise action buttons
    compactSecondaryBtn: {
      padding: "6px 8px",
      borderRadius: 8,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 800,
      fontSize: 12,
      cursor: "pointer",
    },

    compactDangerBtn: {
      padding: "6px 8px",
      borderRadius: 8,
      border: `1px solid ${colors.dangerBorder}`,
      background: colors.dangerBg,
      color: colors.dangerText,
      fontWeight: 900,
      fontSize: 12,
      cursor: "pointer",
    },
  };
}