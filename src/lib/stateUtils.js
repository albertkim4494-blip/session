import { LS_KEY, LS_BACKUP_KEY } from "./constants";

/**
 * Stamp `completed` flag on all log sets that are missing it.
 * Past data with reps > 0 → completed; today's data → not completed.
 * Mutates the state object in place.
 */
export function migrateCompletedFlag(st) {
  if (!st?.logsByDate || typeof st.logsByDate !== "object") return;
  const todayKey = new Date().toISOString().slice(0, 10);

  for (const dk of Object.keys(st.logsByDate)) {
    const dayLogs = st.logsByDate[dk];
    if (!dayLogs || typeof dayLogs !== "object") continue;
    for (const exId of Object.keys(dayLogs)) {
      const exLog = dayLogs[exId];
      if (!exLog?.sets || !Array.isArray(exLog.sets)) continue;
      for (const s of exLog.sets) {
        if (s.completed === undefined) {
          s.completed = dk !== todayKey && Number(s.reps) > 0;
        }
      }
    }
  }
}

export function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

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

export function makeDefaultState() {
  return {
    version: 1,
    program: {
      workouts: defaultWorkouts(),
    },
    dailyWorkouts: {},
    logsByDate: {},
    preferences: {
      defaultRestSec: 90,
      timerSound: true,
      timerSoundType: "beep",
      restTimerEnabled: true,
      restTimerSoundType: "beep",
      measurementSystem: "imperial",
      equipment: "gym",
      theme: "dark",
      exerciseRestTimes: {},
    },
    meta: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  };
}

/**
 * Normalize a raw state object: merge with defaults, fix missing/invalid fields.
 * Used by both loadState (localStorage) and cloud sync to ensure consistent structure.
 */
export function normalizeState(st) {
  if (!st || typeof st !== "object") return makeDefaultState();

  const rawProgram = st.program && typeof st.program === "object" ? st.program : {};
  const rawWorkouts = Array.isArray(rawProgram.workouts) ? rawProgram.workouts : [];

  const next = {
    ...makeDefaultState(),
    ...st,
    program: { ...rawProgram, workouts: rawWorkouts },
    dailyWorkouts: st.dailyWorkouts && typeof st.dailyWorkouts === "object" ? st.dailyWorkouts : {},
    logsByDate: st.logsByDate && typeof st.logsByDate === "object" ? st.logsByDate : {},
    meta: { ...(st.meta ?? {}), updatedAt: Date.now() },
  };

  // Merge preferences with defaults for existing users
  const defaultPrefs = makeDefaultState().preferences;
  next.preferences = { ...defaultPrefs, ...(next.preferences || {}) };
  if (!next.preferences.exerciseRestTimes || typeof next.preferences.exerciseRestTimes !== "object") {
    next.preferences.exerciseRestTimes = {};
  }

  // One-time migration: read equipment/theme/measurementSystem from old standalone localStorage keys
  try {
    if (!next.preferences.equipment || next.preferences.equipment === "gym") {
      const oldEquip = localStorage.getItem("wt_equipment");
      if (oldEquip) next.preferences.equipment = oldEquip;
    }
    if (!next.preferences.theme || next.preferences.theme === "dark") {
      const oldTheme = localStorage.getItem("wt_theme");
      if (oldTheme) next.preferences.theme = oldTheme;
    }
    if (!next.preferences.measurementSystem || next.preferences.measurementSystem === "imperial") {
      const oldMs = localStorage.getItem("wt_measurement_system");
      if (oldMs) next.preferences.measurementSystem = oldMs;
    }
  } catch {
    // localStorage may be unavailable (SSR, private browsing)
  }

  migrateCompletedFlag(next);

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

export function loadState() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return makeDefaultState();

  const st = safeParse(raw, null);
  return normalizeState(st);
}

export function persistState(state) {
  try {
    const currentData = localStorage.getItem(LS_KEY);
    if (currentData) {
      try {
        localStorage.setItem(LS_BACKUP_KEY, currentData);
      } catch (backupError) {
        console.warn("Could not create backup:", backupError);
      }
    }

    localStorage.setItem(LS_KEY, JSON.stringify(state));
    return { success: true };
  } catch (error) {
    console.error("Failed to save data:", error);

    let message = "Could not save your workout data. ";
    if (error.name === "QuotaExceededError") {
      message += "Storage is full. Try exporting and clearing old data.";
    } else {
      message += "Please try again or export your data as backup.";
    }

    return { success: false, error: message };
  }
}
