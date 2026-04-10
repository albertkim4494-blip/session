import { LS_KEY, LS_BACKUP_KEY } from "./constants";

/**
 * Stamp `completed` flag on all log sets that are missing it.
 * Past data with reps > 0 → completed; today's data → not completed.
 * Mutates the state object in place.
 */
function migrateCompletedFlag(st) {
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

/**
 * Find an exercise by ID across all state locations:
 * program workouts, daily workouts, and session additions.
 */
export function findExerciseById(st, exerciseId) {
  for (const wk of (st.program?.workouts || [])) {
    const found = (wk.exercises || []).find((e) => e.id === exerciseId);
    if (found) return found;
  }
  for (const wk of Object.values(st.dailyWorkouts || {}).flat()) {
    const found = (wk.exercises || []).find((e) => e.id === exerciseId);
    if (found) return found;
  }
  for (const dateAdds of Object.values(st.sessionAdditions || {})) {
    for (const exArr of Object.values(dateAdds || {})) {
      const found = exArr.find((e) => e.id === exerciseId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Apply a callback to every exercise across all state locations.
 * Used for toggling properties on a matching exercise by ID.
 */
export function forEachExercise(st, callback) {
  for (const wk of (st.program?.workouts || [])) {
    for (const ex of (wk.exercises || [])) callback(ex);
  }
  for (const key of Object.keys(st.dailyWorkouts || {})) {
    const dayWorkouts = st.dailyWorkouts[key];
    if (!Array.isArray(dayWorkouts)) continue;
    for (const wk of dayWorkouts) {
      for (const ex of (wk.exercises || [])) callback(ex);
    }
  }
  for (const key of Object.keys(st.sessionAdditions || {})) {
    for (const exArr of Object.values(st.sessionAdditions[key] || {})) {
      if (!Array.isArray(exArr)) continue;
      for (const ex of exArr) callback(ex);
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
    customExercises: [],
    dailyWorkouts: {},
    todaySessions: {},
    sessionOverrides: {},
    sessionAdditions: {},
    logsByDate: {},
    preferences: {
      defaultRestSec: 90,
      timerSound: true,
      timerSoundType: "beep",
      restTimerEnabled: true,
      restTimerSoundType: "beep",
      measurementSystem: "imperial",
      equipment: ["full_gym"],
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
    customExercises: Array.isArray(st.customExercises)
      ? st.customExercises.map((ex) => ({
          ...ex,
          muscles: ex.muscles && ex.muscles.primary ? ex.muscles : { primary: [] },
          equipment: Array.isArray(ex.equipment) ? ex.equipment : [],
          tags: Array.isArray(ex.tags) ? ex.tags : [],
          movement: ex.movement || "",
          aliases: ex.aliases || [],
        }))
      : [],
    dailyWorkouts: st.dailyWorkouts && typeof st.dailyWorkouts === "object"
      ? Object.fromEntries(
          Object.entries(st.dailyWorkouts).filter(([, v]) => Array.isArray(v))
        )
      : {},
    todaySessions: st.todaySessions && typeof st.todaySessions === "object" ? st.todaySessions : {},
    sessionOverrides: st.sessionOverrides && typeof st.sessionOverrides === "object" ? st.sessionOverrides : {},
    sessionAdditions: st.sessionAdditions && typeof st.sessionAdditions === "object" ? st.sessionAdditions : {},
    logsByDate: st.logsByDate && typeof st.logsByDate === "object" ? st.logsByDate : {},
    meta: { ...(st.meta ?? {}), updatedAt: Date.now() },
  };

  // Merge preferences with defaults for existing users
  const defaultPrefs = makeDefaultState().preferences;
  next.preferences = { ...defaultPrefs, ...(next.preferences || {}) };
  if (!next.preferences.exerciseRestTimes || typeof next.preferences.exerciseRestTimes !== "object") {
    next.preferences.exerciseRestTimes = {};
  }
  // Strip legacy exerciseCategories if present (overrides/customGroups/categoryOrder removed)
  delete next.preferences.exerciseCategories;

  // Clean up legacy standalone localStorage keys (migration complete)
  try {
    localStorage.removeItem("wt_theme");
    localStorage.removeItem("wt_equipment");
    localStorage.removeItem("wt_measurement_system");
  } catch {
    // localStorage may be unavailable (SSR, private browsing)
  }

  // Migrate equipment from legacy string to array format
  if (typeof next.preferences.equipment === "string") {
    const map = { home: [], basic: ["dumbbell", "kettlebell"], gym: ["full_gym"] };
    next.preferences.equipment = map[next.preferences.equipment] || ["full_gym"];
  }
  if (!Array.isArray(next.preferences.equipment)) {
    next.preferences.equipment = ["full_gym"];
  }

  // Clean up sessionOverrides and todaySessions older than 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  if (next.sessionOverrides) {
    for (const dk of Object.keys(next.sessionOverrides)) {
      if (dk < cutoffKey) delete next.sessionOverrides[dk];
    }
  }
  if (next.todaySessions) {
    for (const dk of Object.keys(next.todaySessions)) {
      if (dk < cutoffKey) delete next.todaySessions[dk];
    }
  }
  if (next.sessionAdditions) {
    for (const dk of Object.keys(next.sessionAdditions)) {
      if (dk < cutoffKey) delete next.sessionAdditions[dk];
    }
  }
  if (next.dailyWorkouts) {
    for (const dk of Object.keys(next.dailyWorkouts)) {
      if (dk < cutoffKey) delete next.dailyWorkouts[dk];
    }
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
